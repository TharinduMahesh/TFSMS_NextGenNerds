import 'dart:convert';

import 'package:growersignup/assets/constants/baseurl.dart';
import 'package:growersignup/models/grower/grower_Account.dart';
import 'package:http/http.dart' as http;

class GrowerCreateApi {
  Future <GrowerAccountModel> groweraccount(GrowerAccountModel gAccountModel) async {
    const url = '$cUrl/api/growercreateaccount'; // Replace with your API endpoint

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
    Future<GrowerAccountModel?> getGrowerAccountById(int growerId) async {
    final url = Uri.parse('http://localhost:7061/api/growercreateaccount/$growerId');

    try {
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final jsonData = jsonDecode(response.body);
        return GrowerAccountModel.fromJson(jsonData);
      } else {
        print('Error ${response.statusCode}: ${response.body}');
        return null;
      }
    } catch (e) {
      print('Exception occurred: $e');
      return null;
    }
  }

  Future<void> updateGrowerAccount(GrowerAccountModel grower) async {
  final url = Uri.parse('http://localhost:7061/api/growercreateaccount/${grower.GrowerAccountId}');
  final response = await http.put(
    url,
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode(grower.toJson()),
  );

  if (response.statusCode != 200) {
    throw Exception('Failed to update grower');
  }
}

}