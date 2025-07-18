import 'package:flutter/material.dart';
import 'chat_list_page.dart';

class ChatMainPage extends StatelessWidget {
  // These would typically come from your user authentication system
  static const int _currentUserId = 1; // Replace with actual user ID
  static const String _currentUserName = "David Peters"; // Replace with actual user name
  static const String _currentUserRole = "grower"; // Replace with actual user role

  const ChatMainPage({super.key});

  @override
  Widget build(BuildContext context) {
    return ChatListPage(
      currentUserId: _currentUserId,
      currentUserName: _currentUserName,
      currentUserRole: _currentUserRole,
    );
  }
}
