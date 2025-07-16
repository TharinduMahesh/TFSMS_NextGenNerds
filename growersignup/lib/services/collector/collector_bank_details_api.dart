import 'dart:convert';
import 'package:growersignup/models/collector/collector_bankdetails_model.dart';
import 'package:http/http.dart' as http;

class CollectorBankApi {
  static const String baseUrl = 'https://localhost:7061/api/collectorBankDetails';

  // POST new bank detail
  static Future<bool> addBankDetail(CollectorBankDetail detail) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(detail.toJson()),
    );

    return response.statusCode == 201; // Created
  }

  // GET bank detail by email
  static Future<CollectorBankDetail?> getBankDetail(String email) async {
    final response = await http.get(Uri.parse('$baseUrl/$email'));

    if (response.statusCode == 200) {
      final json = jsonDecode(response.body);
      return CollectorBankDetail.fromJson(json);
    } else {
      return null;
    }
  }
}
