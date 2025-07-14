import 'dart:convert';

import 'package:growersignup/models/grower/g_signin_model.dart';
import 'package:http/http.dart' as http;

class GSigninApi {

  Future <GSigninModel> growersignnp(GSigninModel gSigninModel) async {
    const url = 'https://localhost:7061/api/growersignup/login'; // Replace with your API endpoint

    try{
      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(gSigninModel.toJson()),
      );
      print('response status code: ${response.statusCode}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        print('response body: ${response.body}');
        GSigninModel newGsignupModel = GSigninModel.fromJson(jsonDecode(response.body));
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