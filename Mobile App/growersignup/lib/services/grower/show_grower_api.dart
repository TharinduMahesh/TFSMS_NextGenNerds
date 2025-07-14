import 'dart:convert';
import 'package:growersignup/models/grower/show_account_model.dart';
import 'package:http/http.dart' as http;

class GrowerApi {
  static const String baseUrl = 'https://localhost:7061/api/ShowGrowerAccount';

  // ✅ Get grower by email
  static Future<GrowerCreateAccount?> fetchGrowerByEmail(String email) async {
    final uri = Uri.parse('$baseUrl/by-email?email=$email');

    try {
      final response = await http.get(uri);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return GrowerCreateAccount.fromJson(data);
      } else {
        print('Failed to load grower: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Error fetching grower: $e');
      return null;
    }
  }

  // ✅ Update grower by email
  static Future<bool> updateGrower(String email, GrowerCreateAccount grower) async {
    final uri = Uri.parse('$baseUrl/update-by-email?email=$email');

    try {
      final response = await http.put(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: json.encode(grower.toJson()),
      );

      if (response.statusCode == 200) {
        return true;
      } else {
        print('Failed to update grower: ${response.statusCode}');
        return false;
      }
    } catch (e) {
      print('Error updating grower: $e');
      return false;
    }
  }
}
