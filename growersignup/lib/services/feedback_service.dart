import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/feedback.dart';

class FeedbackService {
  static const String _baseUrl = 'https://localhost:7061/api/Feedbacks'; 

  static Future<bool> submit(FeedbackModel feedback) async {
    try {
      print('📝 Submitting feedback with rating: ${feedback.rating}');
      
      final url = Uri.parse(_baseUrl);
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(feedback.toJson()),
      );

      print('📡 Response status: ${response.statusCode}');
      print('📤 Request body: ${jsonEncode(feedback.toJson())}');
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        print('✅ Feedback submitted successfully');
        return true;
      } else {
        print('❌ Failed to submit feedback: ${response.statusCode}');
        print('Response body: ${response.body}');
        return false;
      }
    } catch (e) {
      print('❌ Exception submitting feedback: $e');
      return false;
    }
  }

  // Get all feedback (for admin purposes)
  static Future<List<FeedbackModel>> getAllFeedback() async {
    try {
      print('📋 Fetching all feedback...');
      
      final url = Uri.parse(_baseUrl);
      final response = await http.get(
        url,
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        final feedbackList = data.map((json) => FeedbackModel.fromJson(json)).toList();
        
        print('✅ Found ${feedbackList.length} feedback items');
        return feedbackList;
      } else {
        print('❌ Failed to fetch feedback: ${response.statusCode}');
        return [];
      }
    } catch (e) {
      print('❌ Exception fetching feedback: $e');
      return [];
    }
  }
}
