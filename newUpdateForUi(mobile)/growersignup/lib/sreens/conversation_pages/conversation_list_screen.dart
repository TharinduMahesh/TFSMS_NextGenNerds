import 'package:flutter/material.dart';
import 'package:growersignup/models/consersation/Chat_user_model.dart';
import 'package:growersignup/services/conversation/Chat_service.dart';
import 'package:growersignup/services/conversation/chat_api_service.dart';

import 'chat_screen.dart';

// Helper class to hold the combined data for the screen.
class ChatListData {
  final ChatUser currentUser;
  final List<ChatUser> userList;
  ChatListData(this.currentUser, this.userList);
}

class ChatListScreen extends StatefulWidget {
  final String currentUserEmail;
  final String currentUserType;

  const ChatListScreen({
    super.key,
    required this.currentUserEmail,
    required this.currentUserType,
  });

  @override
  State<ChatListScreen> createState() => _ChatListScreenState();
}

class _ChatListScreenState extends State<ChatListScreen> {
  final ApiService _apiService = ApiService();
  final ChatService _chatService = ChatService();
  final TextEditingController _searchController = TextEditingController();
  
  late Future<ChatListData> _chatListDataFuture;
  String _listTitle = "Chats";
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _chatListDataFuture = _loadChatListData();
    _searchController.addListener(() {
      if (_searchQuery != _searchController.text) {
        setState(() {
          _searchQuery = _searchController.text;
          // Re-fetch data with the new search query
          _chatListDataFuture = _loadChatListData(search: _searchQuery);
        });
      }
    });
  }
  
  // FIXED: This method now loads all required data in a more robust way.
  Future<ChatListData> _loadChatListData({String? search}) async {
    // 1. Fetch the current user's details.
    final currentUser = await _apiService.getUserDetails(widget.currentUserEmail, widget.currentUserType);
    
    // 2. Connect to the real-time chat service.
    await _chatService.connect(currentUser.id, currentUser.userType);
    
    // 3. Conditionally fetch the correct list of users to display.
    List<ChatUser> userList;
    if (currentUser.userType.toLowerCase() == 'grower') {
      // Use a post-frame callback to safely update the title after the build.
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) setState(() => _listTitle = "Collectors");
      });
      userList = await _apiService.getCollectors(search: search);
    } else {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) setState(() => _listTitle = "Growers");
      });
      userList = await _apiService.getGrowers(search: search);
    }
    
    // 4. Return all the data together in a single object.
    return ChatListData(currentUser, userList);
  }

  @override
  void dispose() {
    _chatService.disconnect();
    _searchController.dispose();
    super.dispose();
  }

  void _navigateToChatScreen(ChatUser currentUser, ChatUser otherUser) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ChatScreen(
          currentUser: currentUser,
          otherUser: otherUser,
          chatService: _chatService,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(_listTitle)),
      body: Column(
        children: [
          // NEW: Search bar
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search by name...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Colors.grey),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Theme.of(context).primaryColor),
                ),
              ),
            ),
          ),
          Expanded(
            child: FutureBuilder<ChatListData>(
              future: _chatListDataFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Text('An error occurred:\n${snapshot.error}', textAlign: TextAlign.center),
                  ));
                }
                if (!snapshot.hasData) {
                  return const Center(child: Text('Could not load data.'));
                }

                final currentUser = snapshot.data!.currentUser;
                final users = snapshot.data!.userList;

                if (users.isEmpty) {
                  return const Center(child: Text('No users found.'));
                }

                return ListView.builder(
                  itemCount: users.length,
                  itemBuilder: (context, index) {
                    final user = users[index];
                    if (user.id == currentUser.id) return const SizedBox.shrink();
                    
                    return Card(
                      margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: Colors.teal.shade100,
                          child: Text(user.fullName.isNotEmpty ? user.fullName[0].toUpperCase() : '?'),
                        ),
                        title: Text(user.fullName),
                        subtitle: Text(user.userType),
                        onTap: () => _navigateToChatScreen(currentUser, user),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}