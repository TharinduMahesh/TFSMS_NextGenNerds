import 'dart:convert';

import 'package:growersignup/models/grower_Account.dart';
import 'package:http/http.dart' as http;

class GrowerCreateApi {
  Future <GrowerAccountModel> groweraccount(GrowerAccountModel gAccountModel) async {
    const url = 'https://localhost:7061/api/growercreateaccount'; // Replace with your API endpoint

    try{
      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(gAccountModel.toJson()),
      );
      print('response status code: ${response.statusCode}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        print('response body: ${response.body}');
        GrowerAccountModel newGrower = GrowerAccountModel.fromJson(jsonDecode(response.body));
        return newGrower;
        

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