import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/chat_message_model.dart';
import '../models/chat_user.dart';

class ChatApiService {
  static const String _baseUrl = 'https://localhost:7211/api/Chat';

  static Future<ChatMessageModel> sendMessage({
    required int senderId,
    required int receiverId,
    required String messageText,
  }) async {
    try {
      final url = Uri.parse('$_baseUrl/send');
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'senderId': senderId,
          'receiverId': receiverId,
          'messageText': messageText,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return ChatMessageModel.fromJson(data);
      } else {
        throw Exception('Failed to send message: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  static Future<List<ChatMessageModel>> getConversation({
    required int user1Id,
    required int user2Id,
  }) async {
    try {
      final url = Uri.parse('$_baseUrl/conversation?user1Id=$user1Id&user2Id=$user2Id');
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((json) => ChatMessageModel.fromJson(json)).toList();
      } else {
        throw Exception('Failed to fetch conversation: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // Mock method for getting users - you'll need to implement this based on your user API
  static Future<List<ChatUser>> getAvailableUsers(int currentUserId) async {
    // This is a mock implementation. Replace with actual API call to get users
    await Future.delayed(const Duration(milliseconds: 500));
    
    return [
      ChatUser(
        id: 1,
        name: 'John Doe',
        role: 'grower',
        isOnline: true,
      ),
      ChatUser(
        id: 2,
        name: 'Jane Smith',
        role: 'collector',
        isOnline: false,
        lastSeen: DateTime.now().subtract(const Duration(minutes: 30)),
      ),
      ChatUser(
        id: 3,
        name: 'Mike Johnson',
        role: 'grower',
        isOnline: true,
      ),
      ChatUser(
        id: 4,
        name: 'Sarah Wilson',
        role: 'collector',
        isOnline: false,
        lastSeen: DateTime.now().subtract(const Duration(hours: 2)),
      ),
    ].where((user) => user.id != currentUserId).toList();
  }
}
