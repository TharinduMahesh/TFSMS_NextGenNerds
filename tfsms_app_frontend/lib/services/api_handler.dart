import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/harvest_entity.dart';

class ApiHandler {
  static const String baseUrl = 'http://your_api_endpoint/api/harvest';

  static Future<bool> saveHarvest(HarvestEntity harvest) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(harvest.toJson()),
    );
    return response.statusCode == 200;
  }
}
