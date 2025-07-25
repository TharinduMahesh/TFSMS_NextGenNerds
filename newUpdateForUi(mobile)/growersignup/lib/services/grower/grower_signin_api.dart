import 'dart:convert';

import 'package:growersignup/models/grower/g_signin_model.dart';
import 'package:http/http.dart' as http;

class GSigninApi {

    static Future<String?> growersignnp(GSigninModel gSigninModel) async {
    const String baseUrl = 'http://localhost:7061/api/growersignup/login';
    final url = Uri.parse('$baseUrl/login');
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(gSigninModel.toJson()),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['token']; // JWT token
    } else {
      return null;
    }
  }

}