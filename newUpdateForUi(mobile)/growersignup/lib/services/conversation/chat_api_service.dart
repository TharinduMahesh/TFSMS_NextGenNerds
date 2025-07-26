import 'dart:convert';
import 'package:growersignup/models/consersation/conversation_model.dart';
import 'package:growersignup/models/consersation/message_model.dart';
import 'package:http/http.dart' as http;

class ChatApiService {
  // IMPORTANT: Replace with your actual backend URL.
  // For local development with an Android emulator, use 10.0.2.2.
  // For an iOS simulator, use localhost or 127.0.0.1.
  static const String _baseUrl = "http://localhost:7061/api"; // Example for Android emulator

  // Fetches all conversations for a given user email.
  // Corresponds to: GET /api/chat/conversations/{userEmail}
  static Future<List<Conversation>> getConversations(String userEmail) async {
    final response = await http.get(Uri.parse('$_baseUrl/chat/conversations/$userEmail'));

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => Conversation.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load conversations. Status code: ${response.statusCode}');
    }
  }

  // Fetches all messages for a specific conversation ID.
  // Corresponds to: GET /api/chat/messages/{conversationId}
  static Future<List<Message>> getMessages(int conversationId) async {
    final response = await http.get(Uri.parse('$_baseUrl/chat/messages/$conversationId'));

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => Message.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load messages. Status code: ${response.statusCode}');
    }
  }

  // Sends a new message to the backend.
  // Corresponds to: POST /api/chat/messages
  static Future<Message> sendMessage({
    required int conversationId,
    required String senderType,
    required String senderEmail,
    required String messageText,
  }) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/chat/messages'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: jsonEncode(<String, dynamic>{
        'conversationId': conversationId,
        'senderType': senderType,
        'senderEmail': senderEmail,
        'messageText': messageText,
      }),
    );

    if (response.statusCode == 200) {
      // The API returns the created message, so we parse and return it.
      return Message.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to send message. Status code: ${response.statusCode}');
    }
  }
}