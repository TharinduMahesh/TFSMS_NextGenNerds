import 'dart:convert';

import 'package:growersignup/g_signup_model.dart';
import 'package:http/http.dart' as http;

class SignupApi {
  Future <GSignupModel> signup(GSignupModel gSignupModel) async {
    const url = 'https://localhost:7061/api/growersignup'; // Replace with your API endpoint

    try{
      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(gSignupModel.toJson()),
      );
      print('response status code: ${response.statusCode}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        print('response body: ${response.body}');
        GSignupModel newGsignupModel = GSignupModel.fromJson(jsonDecode(response.body));
        return newGsignupModel;
      } else {
        print('response status code: ${response.statusCode}');
        print('response body: ${response.body}');
        throw Exception('Failed to sign up. Status code: ${response.statusCode}');
      }
    } catch (e) {
      print('Error: $e');
      throw Exception('Failed to sign up: $e');
    }
  }
}