import 'dart:async';
import 'package:flutter/material.dart';
import 'package:growersignup/models/consersation/conversation_model.dart';
import 'package:growersignup/models/consersation/message_model.dart';
import 'package:growersignup/services/conversation/chat_api_service.dart';
import 'package:intl/intl.dart';
import 'package:signalr_core/signalr_core.dart';

class ChatScreen extends StatefulWidget {
  final Conversation conversation;
  final String currentUserEmail;
  final String currentUserType;

  const ChatScreen({
    Key? key,
    required this.conversation,
    required this.currentUserEmail,
    required this.currentUserType,
  }) : super(key: key);

  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final List<Message> _messages = [];
  bool _isLoading = true;
  String? _error;
  final TextEditingController _textController = TextEditingController();
  HubConnection? _signalR;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _loadMessages();
    _initSignalR();
  }

  Future<void> _loadMessages() async {
    try {
      setState(() {
        _isLoading = true;
        _error = null;
      });

      print('Loading messages for conversation: ${widget.conversation.conversationId}');
      final messages = await ChatApiService.getMessages(widget.conversation.conversationId);
      
      setState(() {
        _messages.clear();
        _messages.addAll(messages);
        _isLoading = false;
      });
      
      _scrollToBottom();
    } catch (e) {
      print('Error loading messages: $e');
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to load messages: $e'),
            backgroundColor: Colors.red,
            action: SnackBarAction(
              label: 'Retry',
              textColor: Colors.white,
              onPressed: _loadMessages,
            ),
          ),
        );
      }
    }
  }

  Future<void> _initSignalR() async {
    try {
      const serverUrl = "http://localhost:7061";
      _signalR = HubConnectionBuilder()
          .withUrl('$serverUrl/chathub')
          .build();

      _signalR?.onclose((error) {
        print("SignalR Connection closed: $error");
      });

      _signalR?.on('ReceiveMessage', (List<Object?>? arguments) {
        if (arguments != null && arguments.isNotEmpty && arguments[0] != null) {
          try {
            final messageData = arguments[0];
            final newMessage = Message.fromJson(messageData as Map<String, dynamic>);
            
            if (mounted) {
              setState(() {
                _messages.add(newMessage);
              });
              _scrollToBottom();
            }
          } catch (e) {
            print('Error processing received message: $e');
          }
        }
      });

      _signalR?.onreconnecting((error) {
        print("SignalR reconnecting: $error");
      });

      _signalR?.onreconnected((connectionId) {
        print("SignalR reconnected with ID: $connectionId");
        _signalR?.invoke("JoinConversation", args: [widget.conversation.conversationId.toString()]);
      });

      await _signalR?.start();
      print("SignalR connection started");
      
      // Join the conversation group after connection starts
      await _signalR?.invoke("JoinConversation", args: [widget.conversation.conversationId.toString()]);
      print("Joined conversation: ${widget.conversation.conversationId}");
      
    } catch (e) {
      print('SignalR initialization error: $e');
    }
  }

  void _handleSendPressed() async {
    if (_textController.text.trim().isEmpty) return;

    final messageText = _textController.text.trim();
    _textController.clear();

    try {
      await ChatApiService.sendMessage(
        conversationId: widget.conversation.conversationId,
        senderType: widget.currentUserType,
        senderEmail: widget.currentUserEmail,
        messageText: messageText,
      );
    } catch (e) {
      print('Error sending message: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to send message: $e'),
            backgroundColor: Colors.red,
          ),
        );
        // If sending fails, add the text back to the input field
        _textController.text = messageText;
      }
    }
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

  @override
  void dispose() {
    _signalR?.invoke("LeaveConversation", args: [widget.conversation.conversationId.toString()]);
    _signalR?.stop();
    _textController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final otherUserEmail = widget.conversation.growerEmail == widget.currentUserEmail
        ? widget.conversation.collectorEmail
        : widget.conversation.growerEmail;

    return Scaffold(
      backgroundColor: const Color(0xFFF0FBEF),
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              otherUserEmail.split('@')[0], // Show username part only
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            Text(
              'Online', // You can make this dynamic later
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.normal),
            ),
          ],
        ),
        backgroundColor: const Color(0xFF0a4e41),
        foregroundColor: Colors.white,
        elevation: 2,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadMessages,
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: _buildMessagesList(),
          ),
          _buildMessageComposer(),
        ],
      ),
    );
  }

  Widget _buildMessagesList() {
    if (_isLoading) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(color: Color(0xFF0a4e41)),
            SizedBox(height: 16),
            Text('Loading messages...'),
          ],
        ),
      );
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red[300],
            ),
            const SizedBox(height: 16),
            Text(
              'Failed to load messages',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.red[700],
              ),
            ),
            const SizedBox(height: 8),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              child: Text(
                _error!,
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey[600]),
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _loadMessages,
              icon: const Icon(Icons.refresh),
              label: const Text('Retry'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0a4e41),
                foregroundColor: Colors.white,
              ),
            ),
          ],
        ),
      );
    }

    if (_messages.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.chat_bubble_outline,
              size: 64,
              color: Colors.grey,
            ),
            SizedBox(height: 16),
            Text(
              'No messages yet',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.grey,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Start the conversation by sending a message!',
              style: TextStyle(color: Colors.grey),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.all(16.0),
      itemCount: _messages.length,
      itemBuilder: (context, index) {
        final message = _messages[index];
        final isMe = message.senderEmail == widget.currentUserEmail;
        return _buildMessageBubble(message, isMe);
      },
    );
  }

  Widget _buildMessageBubble(Message message, bool isMe) {
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4.0),
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.8,
        ),
        decoration: BoxDecoration(
          color: isMe ? const Color(0xFF0a4e41) : Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(20),
            topRight: const Radius.circular(20),
            bottomLeft: isMe ? const Radius.circular(20) : const Radius.circular(4),
            bottomRight: isMe ? const Radius.circular(4) : const Radius.circular(20),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
          children: [
            Text(
              message.messageText,
              style: TextStyle(
                color: isMe ? Colors.white : Colors.black87,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              DateFormat('hh:mm a').format(message.sentAt.toLocal()),
              style: TextStyle(
                color: isMe ? Colors.white70 : Colors.grey[600],
                fontSize: 11,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMessageComposer() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.2),
            spreadRadius: 1,
            blurRadius: 5,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(25),
                  border: Border.all(color: Colors.grey[300]!),
                ),
                child: TextField(
                  controller: _textController,
                  textCapitalization: TextCapitalization.sentences,
                  maxLines: null,
                  decoration: const InputDecoration(
                    hintText: 'Type a message...',
                    contentPadding: EdgeInsets.symmetric(horizontal: 20.0, vertical: 12.0),
                    border: InputBorder.none,
                  ),
                  onSubmitted: (_) => _handleSendPressed(),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Container(
              decoration: const BoxDecoration(
                color: Color(0xFF0a4e41),
                shape: BoxShape.circle,
              ),
              child: IconButton(
                icon: const Icon(Icons.send, color: Colors.white),
                onPressed: _handleSendPressed,
                splashRadius: 24,
              ),
            ),
          ],
        ),
      ),
    );
  }
}