import 'package:flutter/material.dart';
import 'package:growersignup/models/consersation/conversation_model.dart';
import 'package:growersignup/services/conversation/chat_api_service.dart';
import 'package:growersignup/sreens/conversation_pages/chat_screen.dart';


class ConversationsScreen extends StatefulWidget {
  final String userType;
  final int userId;

  const ConversationsScreen({
    super.key,
    required this.userType,
    required this.userId,
  });

  @override
  State<ConversationsScreen> createState() => _ConversationsScreenState();
}

class _ConversationsScreenState extends State<ConversationsScreen> {
  final ChatApiService _apiService = ChatApiService();
  late Future<List<Conversation>> _conversationsFuture;

  @override
  void initState() {
    super.initState();
    _loadConversations();
  }

  void _loadConversations() {
    _conversationsFuture = _apiService.fetchConversations(widget.userType, widget.userId);
  }

  void _navigateToChat(Conversation conversation) {
     // Determine the name of the person you are chatting with
    final chatPartnerName = widget.userType.toLowerCase() == 'grower'
        ? (conversation.collectorName ?? 'Collector #${conversation.collectorAccountId}')
        : (conversation.growerName ?? 'Grower #${conversation.growerAccountId}');

    Navigator.of(context).push(MaterialPageRoute(
      builder: (context) => ChatDetailScreen(
        conversationId: conversation.conversationId,
        chatPartnerName: chatPartnerName,
        currentUserId: widget.userId,
        currentUserType: widget.userType,
      ),
    )).then((_) {
      // Refresh conversation list when returning from a chat
      setState(() {
        _loadConversations();
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Chats'),
        backgroundColor: Colors.green.shade700,
      ),
      body: FutureBuilder<List<Conversation>>(
        future: _conversationsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('You have no conversations yet.'));
          }

          final conversations = snapshot.data!;

          return ListView.builder(
            itemCount: conversations.length,
            itemBuilder: (context, index) {
              final convo = conversations[index];
              final title = widget.userType.toLowerCase() == 'grower'
                  ? (convo.collectorName ?? 'Collector #${convo.collectorAccountId}')
                  : (convo.growerName ?? 'Grower #${convo.growerAccountId}');

              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: Colors.green.shade100,
                    child: Text(title.substring(0, 1)),
                  ),
                  title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('Started on: ${convo.createdAt.substring(0, 10)}'),
                  trailing: const Icon(Icons.chevron_right),
                  onTap: () => _navigateToChat(convo),
                ),
              );
            },
          );
        },
      ),
    );
  }
}