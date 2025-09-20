import 'package:flutter/material.dart';
import 'package:growersignup/models/consersation/Chat_user_model.dart';
import 'package:growersignup/models/consersation/message_model.dart';
import 'package:growersignup/services/conversation/Chat_service.dart';
import 'package:growersignup/services/conversation/chat_api_service.dart';
import 'dart:async';

class ChatScreen extends StatefulWidget {
  final ChatUser currentUser;
  final ChatUser otherUser;
  final ChatService chatService;

  const ChatScreen({
    super.key,
    required this.currentUser,
    required this.otherUser,
    required this.chatService,
  });

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final ApiService _apiService = ApiService();
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<Message> _messages = [];
  bool _isLoadingHistory = true;

  @override
  void initState() {
    super.initState();
    _loadChatHistory();
    widget.chatService.onReceiveMessage(_handleNewMessage);
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  // FIXED: Added auto-scrolling to the bottom.
  void _scrollToBottom() {
    Timer(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _loadChatHistory() async {
    try {
      final history = await _apiService.getChatHistory(
        widget.currentUser.id,
        widget.currentUser.userType,
        widget.otherUser.id,
        widget.otherUser.userType,
      );
      setState(() {
        _messages.addAll(history);
        _isLoadingHistory = false;
      });
      _scrollToBottom();
    } catch (e) {
      setState(() {
        _isLoadingHistory = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load chat history: $e')),
        );
      }
    }
  }

  void _handleNewMessage(Message message) {
    // Ensure the message is part of the current conversation before adding it.
    final isRelevant =
        (message.senderId == widget.currentUser.id &&
            message.receiverId == widget.otherUser.id) ||
        (message.senderId == widget.otherUser.id &&
            message.receiverId == widget.currentUser.id);
    if (isRelevant) {
      if (mounted) {
        setState(() {
          _messages.add(message);
        });
        _scrollToBottom();
      }
    }
  }

  void _sendMessage() {
    if (_messageController.text.trim().isEmpty) return;
    final message = Message(
      messageId: 0,
      senderId: widget.currentUser.id,
      senderType: widget.currentUser.userType,
      receiverId: widget.otherUser.id,
      receiverType: widget.otherUser.userType,
      content: _messageController.text.trim(),
      timestamp: DateTime.now().toUtc(),
      isRead: false,
    );
    widget.chatService.sendMessage(message);
    setState(() {
      _messages.add(message);
    });
    _messageController.clear();
    _scrollToBottom();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.otherUser.fullName)),
      body: Column(
        children: [
          Expanded(
            child:
                _isLoadingHistory
                    ? const Center(child: CircularProgressIndicator())
                    : ListView.builder(
                      controller: _scrollController,
                      padding: const EdgeInsets.all(8.0),
                      itemCount: _messages.length,
                      itemBuilder: (context, index) {
                        final message = _messages[index];
                        final isSentByMe =
                            message.senderId == widget.currentUser.id;
                        return _buildMessageBubble(message, isSentByMe);
                      },
                    ),
          ),
          _buildMessageInput(),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(Message message, bool isSentByMe) {
    return Align(
      alignment: isSentByMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 5, horizontal: 8),
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 14),
        decoration: BoxDecoration(
          color: isSentByMe ? Colors.teal : Colors.grey[300],
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft:
                isSentByMe
                    ? const Radius.circular(16)
                    : const Radius.circular(0),
            bottomRight:
                isSentByMe
                    ? const Radius.circular(0)
                    : const Radius.circular(16),
          ),
        ),
        child: Text(
          message.content,
          style: TextStyle(color: isSentByMe ? Colors.white : Colors.black87),
        ),
      ),
    );
  }

  Widget _buildMessageInput() {
    return SafeArea(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          boxShadow: [
            BoxShadow(
              offset: const Offset(0, -1),
              blurRadius: 2,
              color: Colors.grey.withOpacity(0.1),
            ),
          ],
        ),
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: _messageController,
                decoration: const InputDecoration(
                  hintText: 'Type a message...',
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.all(10),
                ),
                onSubmitted: (_) => _sendMessage(),
              ),
            ),
            IconButton(
              icon: const Icon(Icons.send, color: Colors.teal),
              onPressed: _sendMessage,
            ),
          ],
        ),
      ),
    );
  }
}
