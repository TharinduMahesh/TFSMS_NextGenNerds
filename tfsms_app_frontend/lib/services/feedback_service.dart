import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/feeedback.dart';

class FeedbackService {
  static const String _baseUrl = 'https://localhost:7211/api/Feedbacks'; 

  static Future<bool> submit(FeedbackModel feedback) async {
    final url = Uri.parse('$_baseUrl/api/feedbacks');
    final res = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(feedback.toJson()),
    );
    return res.statusCode == 201;
  }
}
