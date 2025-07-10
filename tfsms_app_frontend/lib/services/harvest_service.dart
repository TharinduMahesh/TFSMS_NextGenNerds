import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:tfsms_app_frontend/models/Harvest.dart';
class HarvestService {
  // Replace with your actual API endpoint URL
  static const String baseUrl = 'https://localhost:7211/api/Harvest';  

  static Future<String?> submitHarvest(Harvest harvest) async {
    try {
      final response = await http.post(
        Uri.parse(baseUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(harvest.toJson()),
      );

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        return data['id']; 
      } else {
        print('❌ Failed with status: ${response.statusCode}');
        print('Body: ${response.body}');
        return null;
      }
    } catch (e) {
      print('❌ Exception: $e');
      return null;
    }
  }
}
