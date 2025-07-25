import 'dart:convert';
import 'package:growersignup/models/grower/grower_bank_details_model.dart';
import 'package:http/http.dart' as http;

class GrowerBankApi {
  static const String baseUrl = 'http://localhost:7061/api/GrowerBankDetails';

  // POST new bank detail
  static Future<bool> addBankDetail(GrowerBankDetail detail) async {
    final response = await http.post(
      Uri.parse(baseUrl),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(detail.toJson()),
    );

    return response.statusCode == 201; // Created
  }

  // GET bank detail by email
  static Future<GrowerBankDetail?> getBankDetail(String email) async {
    final response = await http.get(Uri.parse('$baseUrl/$email'));

    if (response.statusCode == 200) {
      final json = jsonDecode(response.body);
      return GrowerBankDetail.fromJson(json);
    } else {
      return null;
    }
  }
}
