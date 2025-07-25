import 'dart:convert';
import 'package:growersignup/models/grower/grower_harvest_model.dart';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://localhost:7061';

  Future<GrowerHarvestSummary> fetchHarvestSummary(String growerEmail) async {
    final url = Uri.parse('$baseUrl/api/GrowerOrderHarwest/harvest-summary?email=$growerEmail');

    final response = await http.get(url);

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonBody = json.decode(response.body);
      return GrowerHarvestSummary.fromJson(jsonBody);
    } else {
      throw Exception('Failed to fetch harvest summary (${response.statusCode})');
    }
  }
}
