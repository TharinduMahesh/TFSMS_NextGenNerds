import 'dart:convert';

import 'package:growersignup/models/grower_Account.dart';
import 'package:http/http.dart' as http;

class SignupApi {
  Future <GrowerAccount> groweraccount(GrowerAccount gSignupModel) async {
    const url = 'https://localhost:7061/api/growercreateaccount'; // Replace with your API endpoint

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
        GrowerAccount newGsignupModel = GrowerAccount.fromJson(jsonDecode(response.body));
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