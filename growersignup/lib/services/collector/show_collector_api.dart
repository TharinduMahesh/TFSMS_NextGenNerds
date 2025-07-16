import 'dart:convert';
import 'package:growersignup/models/collector/show_collector_model.dart';
import 'package:http/http.dart' as http;

class CollectorApiService {
  final String baseUrl = 'https://localhost:7061/api/ShowCollectorAccount';

  // 🔍 Get collector details by email
  Future<CollectorCreateAccount?> fetchCollectorByEmail(String email) async {
    final response = await http.get(
      Uri.parse('$baseUrl/by-email?email=$email'),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return CollectorCreateAccount.fromJson(data);
    } else {
      print("Failed to fetch collector: ${response.body}");
      return null;
    }
  }

  // ✏️ Update collector details by email
  Future<bool> updateCollectorByEmail(String email, CollectorCreateAccount collector) async {
    final response = await http.put(
      Uri.parse('$baseUrl/update-by-email?email=$email'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(collector.toJson()),
    );

    if (response.statusCode == 200) {
      print("Collector updated successfully.");
      return true;
    } else {
      print("Update failed: ${response.body}");
      return false;
    }
  }
}
