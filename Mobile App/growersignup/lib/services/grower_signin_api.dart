import 'dart:convert';

import 'package:growersignup/models/g_signin_model.dart';
import 'package:http/http.dart' as http;

class GSigninApi {
  Future<List<GSigninModel>> growersignindata() async {
    const url = 'https://localhost:7061/api/growersignup'; // Replace with your API endpoint
    try {
      final response = await http.get(Uri.parse(url));

      if (response.statusCode == 200) {
        print('response body: ${response.body}');
        List<dynamic> jsonResponse = jsonDecode(response.body);
        List<GSigninModel> growersignipList = jsonResponse.map((data) => GSigninModel.fromJson(data)).toList();
        return growersignipList;
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