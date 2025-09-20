import 'dart:convert';
import 'package:growersignup/models/fertilizer_response.dart';
import 'package:http/http.dart' as http;

class FertilizerApiService {
  static const String baseUrl = 'http://localhost:7061/api/Fertilizer';

  Future<FertilizerResponse?> getFertilizerByGrower(int growerId) async {
    final url = Uri.parse('$baseUrl/grower/$growerId');

    try {
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);
        return FertilizerResponse.fromJson(jsonData);
      } else {
        print('API Error: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('API Exception: $e');
      return null;
    }
  }
}
