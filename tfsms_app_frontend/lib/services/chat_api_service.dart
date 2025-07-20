import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/chat_message_model.dart';
import '../models/chat_user.dart';

class ChatApiService {
  static const String _baseUrl = 'https://localhost:7203/api/Chat';

  // Get list of users available for chat (both growers and collectors)
  static Future<List<ChatUser>> getAvailableUsers(String currentUserId) async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/users?excludeUserId=$currentUserId'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> usersJson = json.decode(response.body);
        return usersJson.map((json) => ChatUser.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load users: ${response.statusCode}');
      }
    } catch (e) {
      print('❌ Error fetching users: $e');
      // Return mock data for development/testing
      return _getMockUsers(currentUserId);
    }
  }

  // Get conversation history between two users (not saved to database for your requirement)
  // This method would typically be used for temporary message caching
  static Future<List<ChatMessage>> getConversation(String user1Id, String user2Id) async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/conversation?user1Id=$user1Id&user2Id=$user2Id'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> messagesJson = json.decode(response.body);
        return messagesJson.map((json) => ChatMessage.fromJson(json)).toList();
      } else {
        // Since you don't want to save messages, return empty list
        return [];
      }
    } catch (e) {
      print('❌ Error fetching conversation: $e');
      return [];
    }
  }

  // Send a message (for API logging/notification purposes, not persistent storage)
  static Future<bool> sendMessage(ChatMessage message) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/send'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(message.toJson()),
      );

      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      print('❌ Error sending message: $e');
      return false;
    }
  }

  // Update user online status
  static Future<bool> updateUserStatus(String userId, UserStatus status) async {
    try {
      final response = await http.patch(
        Uri.parse('$_baseUrl/user-status'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'userId': userId,
          'status': status.toString().split('.').last,
          'lastSeen': DateTime.now().toIso8601String(),
        }),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('❌ Error updating user status: $e');
      return false;
    }
  }

  // Get user status
  static Future<Map<String, UserStatus>> getUsersStatus(List<String> userIds) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/users-status'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'userIds': userIds}),
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> statusData = json.decode(response.body);
        final Map<String, UserStatus> userStatusMap = {};
        
        statusData.forEach((userId, statusString) {
          userStatusMap[userId] = UserStatus.values.firstWhere(
            (e) => e.toString().split('.').last == statusString,
            orElse: () => UserStatus.offline,
          );
        });
        
        return userStatusMap;
      } else {
        return {};
      }
    } catch (e) {
      print('❌ Error getting users status: $e');
      return {};
    }
  }

  // Mock data for development and testing
  static List<ChatUser> _getMockUsers(String currentUserId) {
    final mockUsers = [
      ChatUser(
        id: '1',
        name: 'John Grower',
        role: 'grower',
        email: 'john@example.com',
        status: UserStatus.online,
      ),
      ChatUser(
        id: '2', 
        name: 'Sarah Collector',
        role: 'collector',
        email: 'sarah@example.com',
        status: UserStatus.offline,
        lastSeen: DateTime.now().subtract(const Duration(minutes: 15)),
      ),
      ChatUser(
        id: '3',
        name: 'Mike Grower',
        role: 'grower',
        email: 'mike@example.com',
        status: UserStatus.away,
      ),
      ChatUser(
        id: '4',
        name: 'Lisa Collector',
        role: 'collector',
        email: 'lisa@example.com',
        status: UserStatus.online,
      ),
      ChatUser(
        id: '5',
        name: 'David Peters',
        role: 'grower',
        email: 'david@example.com',
        status: UserStatus.busy,
      ),
    ];
    
    // Remove current user from the list
    return mockUsers.where((user) => user.id != currentUserId).toList();
  }
}
