import 'dart:convert';
import 'package:growersignup/assets/constants/baseurl.dart';
import 'package:growersignup/models/consersation/Chat_user_model.dart';
import 'package:growersignup/models/consersation/message_model.dart';
import 'package:http/http.dart' as http;

class ApiService {
  // FIXED: Using 10.0.2.2 for Android emulator to connect to localhost.
  // For physical devices or iOS simulator, use your computer's local IP.
  static const String _baseUrl = '$cUrl/api';

  Future<ChatUser> getUserDetails(String email, String userType) async {
    final uri = Uri.parse('$_baseUrl/Users/details').replace(
      queryParameters: {'email': email, 'userType': userType},
    );
    print('Attempting to call: $uri');
    try {
      final response = await http.get(uri);
      if (response.statusCode == 200) {
        return ChatUser.fromJson(json.decode(response.body));
      } else {
        throw Exception('Failed to load user. Status: ${response.statusCode}. Body: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error while getting user details: $e');
    }
  }

  // NEW METHOD: Fetches a list of all growers.
  Future<List<ChatUser>> getGrowers({String? search}) async {
    var uri = Uri.parse('$_baseUrl/Users/growers');
    if (search != null && search.isNotEmpty) {
      uri = uri.replace(queryParameters: {'search': search});
    }
    print('Attempting to call: $uri');
    try {
      final response = await http.get(uri);
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => ChatUser.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load growers. Status: ${response.statusCode}. Body: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error while fetching growers: $e');
    }
  }

  Future<List<ChatUser>> getCollectors({String? search}) async {
    var uri = Uri.parse('$_baseUrl/Users/collectors');
    if (search != null && search.isNotEmpty) {
      uri = uri.replace(queryParameters: {'search': search});
    }
    print('Attempting to call: $uri');
    try {
      final response = await http.get(uri);
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => ChatUser.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load collectors. Status: ${response.statusCode}. Body: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error while fetching collectors: $e');
    }
  }

  Future<List<Message>> getChatHistory(int senderId, String senderType, int receiverId, String receiverType) async {
    final uri = Uri.parse('$_baseUrl/Chat/history/$senderId/$senderType/$receiverId/$receiverType');
    print('Attempting to call: $uri');
    try {
      final response = await http.get(uri);
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => Message.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load chat history. Status: ${response.statusCode}. Body: ${response.body}');
      }
    } catch (e) {
      throw Exception('Network error while fetching chat history: $e');
    }
  }
}
