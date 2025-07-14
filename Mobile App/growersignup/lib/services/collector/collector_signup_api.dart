import 'dart:convert';

import 'package:growersignup/models/collector/c_signup_model.dart';
import 'package:http/http.dart' as http;

class SignupApi {
  Future<List<CSignupModel>> Collectorsignupdata() async {
    const url = 'https://localhost:7061/api/CollectorSignUp/register'; // Replace with your API endpoint
    try {
      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        print('response body: ${response.body}');
        List<dynamic> jsonResponse = jsonDecode(response.body);
        List<CSignupModel> CollectorsignupList = jsonResponse.map((data) => CSignupModel.fromJson(data)).toList();
        return CollectorsignupList;
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


  Future <CSignupModel> signup(CSignupModel cSignupModel) async {
    const url = 'https://localhost:7061/api/CollectorSignUp/register'; // Replace with your API endpoint

    try{
      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(cSignupModel.toJson()),
      );
      print('response status code: ${response.statusCode}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        print('response body: ${response.body}');
        CSignupModel newCsignupModel = CSignupModel.fromJson(jsonDecode(response.body));
        return newCsignupModel;
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