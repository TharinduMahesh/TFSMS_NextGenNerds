import 'dart:convert';

import 'package:growersignup/models/grower/g_signup_model.dart';
import 'package:http/http.dart' as http;

class SignupApi {
  Future<List<GSignupModel>> growersignupdata() async {
    const url = 'https://localhost:7061/api/GrowerSignUp/register'; // Replace with your API endpoint
    try {
      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        print('response body: ${response.body}');
        List<dynamic> jsonResponse = jsonDecode(response.body);
        List<GSignupModel> growersignupList = jsonResponse.map((data) => GSignupModel.fromJson(data)).toList();
        return growersignupList;
      } else {
        print('response status code: ${response.statusCode}');
        print('response body: ${response.body}');
        throw Exception('Failed to fetch data. Status code: ${response.statusCode}');
      } 
    }
    catch (e) {
      print('Error: $e');
      throw Exception('Failed to fetch data: $e');
    }
  }


  Future <GSignupModel> signup(GSignupModel gSignupModel) async {
    const url = 'https://localhost:7061/api/GrowerSignUp/register'; // Replace with your API endpoint

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