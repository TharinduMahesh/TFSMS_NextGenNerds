import 'package:flutter/material.dart';
import 'package:growersignup/models/consersation/message_model.dart';
import 'package:growersignup/services/conversation/chat_api_service.dart';
import 'package:signalr_core/signalr_core.dart'; // For real-time updates

class ChatDetailScreen extends StatefulWidget {
  final int conversationId;
  final String chatPartnerName;
  final int currentUserId;
  final String currentUserType;

  const ChatDetailScreen({
    super.key,
    required this.conversationId,
    required this.chatPartnerName,
    required this.currentUserId,
    required this.currentUserType,
  });

  @override
  State<ChatDetailScreen> createState() => _ChatDetailScreenState();
}

class _ChatDetailScreenState extends State<ChatDetailScreen> {
  final ChatApiService _apiService = ChatApiService();
  final TextEditingController _messageController = TextEditingController();
  final List<Message> _messages = [];
  bool _isLoading = true;
  HubConnection? _hubConnection;

  @override
  void initState() {
    super.initState();
    _loadMessages();
    _startSignalR();
  }

  @override
  void dispose() {
    _hubConnection?.stop();
    _messageController.dispose();
    super.dispose();
  }

  Future<void> _loadMessages() async {
    try {
      final messages = await _apiService.fetchMessages(widget.conversationId);
      setState(() {
        _messages.addAll(messages);
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load messages: $e')),
      );
    }
  }

  Future<void> _startSignalR() async {
    _hubConnection = HubConnectionBuilder()
        .withUrl("http://localhost:7061/chathub") // Your SignalR hub URL
        .withAutomaticReconnect()
        .build();

    _hubConnection?.on("ReceiveMessage", (args) {
      if (mounted && args != null && args.isNotEmpty) {
        final message = Message.fromJson({
           // Assuming your backend sends a full message object on broadcast
          'messageId': DateTime.now().millisecondsSinceEpoch, // Temp ID
          'conversationId': args[0],
          'senderType': args[1],
          'senderId': args[2],
          'messageText': args[3],
          'sentAt': DateTime.now().toIso8601String(),
        });

        // Only add the message if it belongs to the current open conversation
        if (message.conversationId == widget.conversationId) {
          setState(() {
            _messages.insert(0, message);
          });
        }
      }
    });

    try {
      await _hubConnection?.start();
      print("✅ SignalR Connected for chat.");
    } catch (e) {
      print("❌ SignalR connection failed: $e");
    }
  }

  Future<void> _sendMessage() async {
    final text = _messageController.text.trim();
    if (text.isEmpty) return;

    // Optimistically add to UI
    final tempMessage = Message(
      messageId: 0, // Temp
      conversationId: widget.conversationId,
      senderType: widget.currentUserType,
      senderId: widget.currentUserId,
      messageText: text,
      sentAt: DateTime.now().toIso8601String(),
    );
    setState(() {
      _messages.insert(0, tempMessage);
      _messageController.clear();
    });

    try {
      // Send to API to save in DB
      final sentMessage = await _apiService.sendMessage(
        conversationId: widget.conversationId,
        senderType: widget.currentUserType,
        senderId: widget.currentUserId,
        messageText: text,
      );
      // Replace temp message with actual message from server
      setState(() {
        final index = _messages.indexOf(tempMessage);
        if (index != -1) {
          _messages[index] = sentMessage;
        }
      });

       // Broadcast via SignalR
      if (_hubConnection?.state == HubConnectionState.connected) {
        await _hubConnection?.invoke("SendMessage", args: [
          widget.conversationId,
          widget.currentUserType,
          widget.currentUserId,
          text,
        ]);
      }

    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to send message'), backgroundColor: Colors.red),
      );
      // Remove optimistic message on failure
      setState(() => _messages.remove(tempMessage));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.chatPartnerName),
        backgroundColor: Colors.green.shade700,
      ),
      body: Column(
        children: [
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : ListView.builder(
                    reverse: true, // Shows latest messages at the bottom
                    padding: const EdgeInsets.all(8.0),
                    itemCount: _messages.length,
                    itemBuilder: (context, index) {
                      final message = _messages[index];
                      final isMe = message.senderId == widget.currentUserId &&
                          message.senderType.toLowerCase() == widget.currentUserType.toLowerCase();
                      return _buildMessageBubble(message, isMe);
                    },
                  ),
          ),
          _buildMessageInput(),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(Message message, bool isMe) {
    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: isMe ? Colors.green.shade600 : Colors.grey.shade300,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(16),
            topRight: const Radius.circular(16),
            bottomLeft: isMe ? const Radius.circular(16) : Radius.zero,
            bottomRight: isMe ? Radius.zero : const Radius.circular(16),
          ),
        ),
        child: Text(
          message.messageText,
          style: TextStyle(color: isMe ? Colors.white : Colors.black87),
        ),
      ),
    );
  }

  Widget _buildMessageInput() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        boxShadow: const [
          BoxShadow(offset: Offset(0, -1), blurRadius: 2, color: Colors.black12)
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
              ),
              onSubmitted: (_) => _sendMessage(),
            ),
          ),
          IconButton(
            icon: Icon(Icons.send, color: Colors.green.shade700),
            onPressed: _sendMessage,
          ),
        ],
      ),
    );
  }
}