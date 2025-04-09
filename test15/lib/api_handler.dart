import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:test15/model.dart';

class ApiHandler {
  Future<User> getUserData(User user) async {
    const url = 'https://localhost:7252/api/users';

    try {
      final response = await http.post(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json; charset=UTF-8'},

        body: json.encode(user.toJson()),
      );

      print("response status code: ${response.statusCode}");

      if (response.statusCode == 200 || response.statusCode == 201) {
        print("response body: ${response.body}");
        User newUser = User.fromJson(json.decode(response.body));
        return newUser;
      } else {
        print("Failed to load data: ${response.statusCode}");
        print("Response body: ${response.body}");
        throw Exception('Failed to load data');
      }
    } catch (e) {
      print("Error: $e");
      throw Exception('Failed to load data');
    }
  }
}
