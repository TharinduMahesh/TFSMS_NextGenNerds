import 'dart:async';
import 'package:flutter/material.dart';
import '../../models/chat_message_model.dart';
import '../../models/chat_user.dart';
import '../../services/realtime_service.dart';
import '../../services/chat_api_service.dart';

class ChatConversationPage extends StatefulWidget {
  final String currentUserId;
  final String currentUserName;
  final ChatUser otherUser;

  const ChatConversationPage({
    super.key,
    required this.currentUserId,
    required this.currentUserName,
    required this.otherUser,
  });

  @override
  State<ChatConversationPage> createState() => _ChatConversationPageState();
}

class _ChatConversationPageState extends State<ChatConversationPage> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<ChatMessage> _messages = [];
  bool _isTyping = false;
  bool _otherUserTyping = false;
  Timer? _typingTimer;
  late StreamSubscription<ChatMessage> _messageSubscription;
  late StreamSubscription<String> _typingSubscription;
  late StreamSubscription<Map<String, UserStatus>> _statusSubscription;
  late ChatUser _otherUser;

  @override
  void initState() {
    super.initState();
    _otherUser = widget.otherUser;
    _setupMessageListeners();
    _loadInitialMessages();
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    _typingTimer?.cancel();
    _messageSubscription.cancel();
    _typingSubscription.cancel();
    _statusSubscription.cancel();
    super.dispose();
  }

  void _setupMessageListeners() {
    // Listen for incoming messages
    _messageSubscription = SignalRService.instance.messageStream.listen((message) {
      if ((message.senderId == widget.otherUser.id && message.receiverId == widget.currentUserId) ||
          (message.senderId == widget.currentUserId && message.receiverId == widget.otherUser.id)) {
        if (mounted) {
          setState(() {
            _messages.add(message);
          });
          _scrollToBottom();
        }
      }
    });

    // Listen for typing indicators
    _typingSubscription = SignalRService.instance.typingStream.listen((userId) {
      if (userId == widget.otherUser.id && mounted) {
        setState(() {
          _otherUserTyping = true;
        });
        
        // Hide typing indicator after 3 seconds
        Timer(const Duration(seconds: 3), () {
          if (mounted) {
            setState(() {
              _otherUserTyping = false;
            });
          }
        });
      }
    });

    // Listen for status changes
    _statusSubscription = SignalRService.instance.userStatusStream.listen((statusUpdate) {
      if (statusUpdate.containsKey(widget.otherUser.id) && mounted) {
        setState(() {
          _otherUser = _otherUser.copyWith(
            status: statusUpdate[widget.otherUser.id]!,
            lastSeen: statusUpdate[widget.otherUser.id] == UserStatus.offline 
                ? DateTime.now() 
                : null,
          );
        });
      }
    });
  }

  Future<void> _loadInitialMessages() async {
    try {
      // Since messages aren't saved, this will return empty list
      // But keeping for potential temporary caching
      final messages = await ChatApiService.getConversation(
        widget.currentUserId, 
        widget.otherUser.id,
      );
      
      if (mounted) {
        setState(() {
          _messages.addAll(messages);
        });
        _scrollToBottom();
      }
    } catch (e) {
      print('❌ Error loading initial messages: $e');
    }
  }

  Future<void> _sendMessage() async {
    final content = _messageController.text.trim();
    if (content.isEmpty) return;

    final message = ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      senderId: widget.currentUserId,
      receiverId: widget.otherUser.id,
      content: content,
      timestamp: DateTime.now(),
      isDelivered: false,
      isRead: false,
    );

    // Clear input immediately for better UX
    _messageController.clear();
    
    // Add message to local list
    setState(() {
      _messages.add(message);
    });
    _scrollToBottom();

    try {
      // Send via SignalR for real-time delivery
      await SignalRService.instance.sendMessage(message);
      
      // Optional: Send to API for logging (not persistent storage)
      ChatApiService.sendMessage(message);
      
      // Mark as delivered
      if (mounted) {
        setState(() {
          final index = _messages.indexWhere((m) => m.id == message.id);
          if (index != -1) {
            _messages[index] = _messages[index].copyWith(isDelivered: true);
          }
        });
      }
    } catch (e) {
      print('❌ Error sending message: $e');
      
      // Show error to user
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Text('Failed to send message'),
            backgroundColor: Colors.red,
            action: SnackBarAction(
              label: 'Retry',
              textColor: Colors.white,
              onPressed: () {
                _messageController.text = content;
              },
            ),
          ),
        );
      }
    }

    // Stop typing indicator
    if (_isTyping) {
      setState(() {
        _isTyping = false;
      });
    }
  }

  void _onTextChanged(String text) {
    if (text.isNotEmpty && !_isTyping) {
      setState(() {
        _isTyping = true;
      });
      
      // Send typing indicator
      SignalRService.instance.sendTypingIndicator(widget.otherUser.id);
    }

    // Reset typing timer
    _typingTimer?.cancel();
    _typingTimer = Timer(const Duration(seconds: 2), () {
      if (_isTyping && mounted) {
        setState(() {
          _isTyping = false;
        });
      }
    });
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Widget _buildMessage(ChatMessage message) {
    final isMe = message.senderId == widget.currentUserId;
    final DateTime now = DateTime.now();
    final bool isToday = message.timestamp.day == now.day &&
        message.timestamp.month == now.month &&
        message.timestamp.year == now.year;

    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4, horizontal: 16),
        child: Column(
          crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: isMe ? Colors.green[600] : Colors.grey[200],
                borderRadius: BorderRadius.circular(18),
              ),
              constraints: BoxConstraints(
                maxWidth: MediaQuery.of(context).size.width * 0.7,
              ),
              child: Text(
                message.content,
                style: TextStyle(
                  color: isMe ? Colors.white : Colors.black87,
                  fontSize: 16,
                ),
              ),
            ),
            const SizedBox(height: 4),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  isToday
                      ? '${message.timestamp.hour.toString().padLeft(2, '0')}:${message.timestamp.minute.toString().padLeft(2, '0')}'
                      : '${message.timestamp.day}/${message.timestamp.month} ${message.timestamp.hour.toString().padLeft(2, '0')}:${message.timestamp.minute.toString().padLeft(2, '0')}',
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 12,
                  ),
                ),
                if (isMe) ...[
                  const SizedBox(width: 4),
                  Icon(
                    message.isRead
                        ? Icons.done_all
                        : message.isDelivered
                            ? Icons.done_all
                            : Icons.done,
                    size: 16,
                    color: message.isRead
                        ? Colors.blue
                        : message.isDelivered
                            ? Colors.grey
                            : Colors.grey[400],
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTypingIndicator() {
    if (!_otherUserTyping) return const SizedBox.shrink();

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(18),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  '${widget.otherUser.name} is typing',
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontStyle: FontStyle.italic,
                  ),
                ),
                const SizedBox(width: 8),
                SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation(Colors.grey[400]),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Stack(
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: _otherUser.role == 'grower' 
                      ? Colors.green[100] 
                      : Colors.blue[100],
                  child: Icon(
                    _otherUser.role == 'grower' ? Icons.nature : Icons.local_shipping,
                    color: _otherUser.role == 'grower' 
                        ? Colors.green[700] 
                        : Colors.blue[700],
                    size: 20,
                  ),
                ),
                Positioned(
                  bottom: 0,
                  right: 0,
                  child: Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      color: _getStatusColor(_otherUser.status),
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 2),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _otherUser.name,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    _otherUser.statusText,
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.8),
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        backgroundColor: Colors.green[700],
        iconTheme: const IconThemeData(color: Colors.white),
        actions: [
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert),
            onSelected: (value) {
              switch (value) {
                case 'clear':
                  _clearChat();
                  break;
                case 'block':
                  _showBlockDialog();
                  break;
              }
            },
            itemBuilder: (BuildContext context) => [
              const PopupMenuItem(
                value: 'clear',
                child: ListTile(
                  leading: Icon(Icons.delete_outline),
                  title: Text('Clear Chat'),
                  contentPadding: EdgeInsets.zero,
                ),
              ),
              const PopupMenuItem(
                value: 'block',
                child: ListTile(
                  leading: Icon(Icons.block),
                  title: Text('Block User'),
                  contentPadding: EdgeInsets.zero,
                ),
              ),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          // Messages List
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              itemCount: _messages.length + (_otherUserTyping ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == _messages.length) {
                  return _buildTypingIndicator();
                }
                return _buildMessage(_messages[index]);
              },
            ),
          ),
          
          // Message Input
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  offset: const Offset(0, -2),
                  blurRadius: 4,
                  color: Colors.black.withOpacity(0.1),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    onChanged: _onTextChanged,
                    decoration: InputDecoration(
                      hintText: 'Type a message...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(25),
                        borderSide: BorderSide.none,
                      ),
                      filled: true,
                      fillColor: Colors.grey[100],
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 12,
                      ),
                    ),
                    maxLines: null,
                    textCapitalization: TextCapitalization.sentences,
                  ),
                ),
                const SizedBox(width: 12),
                FloatingActionButton(
                  onPressed: _sendMessage,
                  mini: true,
                  backgroundColor: Colors.green[600],
                  child: const Icon(
                    Icons.send,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ],
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

  void _clearChat() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Clear Chat'),
        content: const Text('Are you sure you want to clear this chat? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                _messages.clear();
              });
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Chat cleared')),
              );
            },
            child: const Text('Clear'),
          ),
        ],
      ),
    );
  }

  void _showBlockDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Block User'),
        content: Text('Are you sure you want to block ${_otherUser.name}? You will no longer receive messages from this user.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              // TODO: Implement block functionality
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('${_otherUser.name} has been blocked')),
              );
            },
            child: const Text('Block'),
          ),
        ],
      ),
    );
  }
}
