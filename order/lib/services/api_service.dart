import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/harvest.dart';

class ApiService {
  static const String apiUrl = "https://localhost:5001/api/Harvest";

  // Fetch harvest data from API
  static Future<List<Harvest>> fetchHarvests() async {
    final response = await http.get(Uri.parse(apiUrl));
    if (response.statusCode == 200) {
      Iterable data = json.decode(response.body);
      return data.map((e) => Harvest.fromJson(e)).toList();
    } else {
      throw Exception("Failed to load harvests");
    }
  }

  // Add new harvest data to API
  static Future<void> addHarvest(Harvest harvest) async {
    final response = await http.post(
      Uri.parse(apiUrl),
      headers: {"Content-Type": "application/json"},
      body: json.encode(harvest.toJson()),
    );
    if (response.statusCode != 201) {
      throw Exception("Failed to add harvest");
    }
  }
}
