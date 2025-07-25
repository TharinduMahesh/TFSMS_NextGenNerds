import 'dart:convert';
import 'package:growersignup/models/consersation/conversation_model.dart';
import 'package:growersignup/models/consersation/message_model.dart';
import 'package:http/http.dart' as http;

class ChatApiService {
  final String baseUrl = 'http://localhost:7061/api';

  /// Fetch conversations for a user (grower or collector)
Future<List<Conversation>> fetchConversations(String userType, int userId) async {
  final url = Uri.parse('$baseUrl/conversations/$userType/$userId');
  print('Requesting: $url');
  final response = await http.get(url);
  print('Status code: ${response.statusCode}');
  print('Body: ${response.body}');

  if (response.statusCode == 200) {
    List jsonList = json.decode(response.body);
    return jsonList.map((e) => Conversation.fromJson(e)).toList();
  } else {
    throw Exception('Failed to load conversations');
  }
}


  /// Create new conversation
  Future<Conversation> createConversation(int growerId, int collectorId) async {
    final url = Uri.parse('$baseUrl/conversations');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'growerAccountId': growerId,
        'collectorAccountId': collectorId,
      }),
    );

    if (response.statusCode == 200) {
      return Conversation.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to create conversation');
    }
  }

  /// Fetch messages for a conversation
  Future<List<Message>> fetchMessages(int conversationId) async {
    final url = Uri.parse('$baseUrl/messages/$conversationId');
    final response = await http.get(url);

    if (response.statusCode == 200) {
      List jsonList = json.decode(response.body);
      return jsonList.map((e) => Message.fromJson(e)).toList();
    } else {
      throw Exception('Failed to load messages');
    }
  }

  /// Send a new message
  Future<Message> sendMessage({
  required int conversationId,
  required String senderType,
  required int senderId,
  required String messageText,
}) async {
  final url = Uri.parse('$baseUrl/messages');
  final body = json.encode({
    'conversationId': conversationId,
    'senderType': senderType,
    'senderId': senderId,
    'messageText': messageText,
  });
  final response = await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: body,
  );
  if (response.statusCode == 200) {
    return Message.fromJson(json.decode(response.body));
  } else {
    print('Error sending message. Status: ${response.statusCode}');
    print('Response body: ${response.body}');
    throw Exception('Failed to send message');
  }
}

}
