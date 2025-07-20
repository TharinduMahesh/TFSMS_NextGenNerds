import 'dart:async';
import 'package:flutter/material.dart';
import '../../models/chat_user.dart';
import '../../services/chat_api_service.dart';
import '../../services/realtime_service.dart';
import 'chat_conversation_page.dart';

class ChatListPage extends StatefulWidget {
  final String currentUserId;
  final String currentUserName;
  final String currentUserRole;

  const ChatListPage({
    super.key,
    required this.currentUserId,
    required this.currentUserName,
    required this.currentUserRole,
  });

  @override
  State<ChatListPage> createState() => _ChatListPageState();
}

class _ChatListPageState extends State<ChatListPage> with WidgetsBindingObserver {
  final TextEditingController _searchController = TextEditingController();
  List<ChatUser> _allUsers = [];
  List<ChatUser> _filteredUsers = [];
  bool _isLoading = true;
  String _searchQuery = '';
  late StreamSubscription<Map<String, UserStatus>> _statusSubscription;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _initializeChat();
    _loadUsers();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _searchController.dispose();
    _statusSubscription.cancel();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    super.didChangeAppLifecycleState(state);
    
    switch (state) {
      case AppLifecycleState.resumed:
        SignalRService.instance.updateUserStatus(UserStatus.online);
        break;
      case AppLifecycleState.paused:
      case AppLifecycleState.inactive:
        SignalRService.instance.updateUserStatus(UserStatus.away);
        break;
      case AppLifecycleState.detached:
        SignalRService.instance.updateUserStatus(UserStatus.offline);
        break;
      case AppLifecycleState.hidden:
        break;
    }
  }

  Future<void> _initializeChat() async {
    try {
        // Connect to real-time service
        await SignalRService.instance.connect(widget.currentUserId);      // Set user status to online
      await SignalRService.instance.updateUserStatus(UserStatus.online);
      
      // Listen for user status changes
      _statusSubscription = SignalRService.instance.userStatusStream.listen((statusUpdate) {
        if (mounted) {
          _updateUserStatus(statusUpdate);
        }
      });
      
    } catch (e) {
      print('❌ Error initializing chat: $e');
    }
  }

  Future<void> _loadUsers() async {
    try {
      setState(() {
        _isLoading = true;
      });

      final users = await ChatApiService.getAvailableUsers(widget.currentUserId);
      
      // Get current status for all users
      final userIds = users.map((u) => u.id).toList();
      final statusMap = await ChatApiService.getUsersStatus(userIds);
      
      // Update users with current status
      final updatedUsers = users.map((user) {
        final status = statusMap[user.id] ?? UserStatus.offline;
        return user.copyWith(status: status);
      }).toList();

      setState(() {
        _allUsers = updatedUsers;
        _filteredUsers = updatedUsers;
        _isLoading = false;
      });
    } catch (e) {
      print('❌ Error loading users: $e');
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _updateUserStatus(Map<String, UserStatus> statusUpdate) {
    setState(() {
      for (var entry in statusUpdate.entries) {
        final userId = entry.key;
        final status = entry.value;
        
        // Update in all users list
        final userIndex = _allUsers.indexWhere((u) => u.id == userId);
        if (userIndex != -1) {
          _allUsers[userIndex] = _allUsers[userIndex].copyWith(
            status: status,
            lastSeen: status == UserStatus.offline ? DateTime.now() : null,
          );
        }
        
        // Update in filtered users list
        final filteredUserIndex = _filteredUsers.indexWhere((u) => u.id == userId);
        if (filteredUserIndex != -1) {
          _filteredUsers[filteredUserIndex] = _filteredUsers[filteredUserIndex].copyWith(
            status: status,
            lastSeen: status == UserStatus.offline ? DateTime.now() : null,
          );
        }
      }
    });
  }

  void _filterUsers(String query) {
    setState(() {
      _searchQuery = query;
      if (query.isEmpty) {
        _filteredUsers = List.from(_allUsers);
      } else {
        _filteredUsers = _allUsers.where((user) {
          return user.name.toLowerCase().contains(query.toLowerCase()) ||
                 user.role.toLowerCase().contains(query.toLowerCase());
        }).toList();
      }
    });
  }

  void _openConversation(ChatUser user) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ChatConversationPage(
          currentUserId: widget.currentUserId,
          currentUserName: widget.currentUserName,
          otherUser: user,
        ),
      ),
    );
  }

  Widget _buildUserCard(ChatUser user) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: Stack(
          children: [
            CircleAvatar(
              radius: 24,
              backgroundColor: user.role == 'grower' ? Colors.green[100] : Colors.blue[100],
              child: Icon(
                user.role == 'grower' ? Icons.nature : Icons.local_shipping,
                color: user.role == 'grower' ? Colors.green[700] : Colors.blue[700],
                size: 24,
              ),
            ),
            Positioned(
              bottom: 0,
              right: 0,
              child: Container(
                width: 14,
                height: 14,
                decoration: BoxDecoration(
                  color: _getStatusColor(user.status),
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 2),
                ),
              ),
            ),
          ],
        ),
        title: Text(
          user.name,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 16,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              user.role.toUpperCase(),
              style: TextStyle(
                color: user.role == 'grower' ? Colors.green[700] : Colors.blue[700],
                fontWeight: FontWeight.w500,
                fontSize: 12,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              user.statusText,
              style: TextStyle(
                color: user.isOnline ? Colors.green[600] : Colors.grey[600],
                fontSize: 12,
              ),
            ),
          ],
        ),
        trailing: Icon(
          Icons.chat_bubble_outline,
          color: Colors.grey[400],
        ),
        onTap: () => _openConversation(user),
      ),
    );
  }

  Color _getStatusColor(UserStatus status) {
    switch (status) {
      case UserStatus.online:
        return Colors.green;
      case UserStatus.away:
        return Colors.orange;
      case UserStatus.busy:
        return Colors.red;
      case UserStatus.offline:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Search Bar
        Container(
          margin: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(25),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.1),
                spreadRadius: 1,
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: TextField(
            controller: _searchController,
            onChanged: _filterUsers,
            decoration: InputDecoration(
              hintText: 'Search users...',
              prefixIcon: const Icon(Icons.search, color: Colors.grey),
              suffixIcon: _searchQuery.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear),
                      onPressed: () {
                        _searchController.clear();
                        _filterUsers('');
                      },
                    )
                  : null,
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
            ),
          ),
        ),
        
        // Users List
        Expanded(
          child: _isLoading
              ? const Center(
                  child: CircularProgressIndicator(),
                )
              : _filteredUsers.isEmpty
                  ? _buildEmptyState()
                  : RefreshIndicator(
                      onRefresh: _loadUsers,
                      child: ListView.builder(
                        itemCount: _filteredUsers.length,
                        itemBuilder: (context, index) {
                          return _buildUserCard(_filteredUsers[index]);
                        },
                      ),
                    ),
        ),
      ],
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.people_outline,
            size: 64,
            color: Colors.grey[400],
          ),
          const SizedBox(height: 16),
          Text(
            _searchQuery.isNotEmpty 
                ? 'No users found matching "$_searchQuery"'
                : 'No users available',
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            _searchQuery.isNotEmpty 
                ? 'Try adjusting your search'
                : 'Pull down to refresh',
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[500],
            ),
          ),
        ],
      ),
    );
  }
}
