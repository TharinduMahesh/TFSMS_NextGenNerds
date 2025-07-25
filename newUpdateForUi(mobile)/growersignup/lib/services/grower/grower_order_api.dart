import 'dart:convert';


import 'package:growersignup/models/grower/grower_order_model.dart';
import 'package:http/http.dart' as http;

class GrowerOrderApi {
  Future<GrowerOrderModel> getGrowerOrder(GrowerOrderModel growerModel) async {
    const url = 'http://localhost:7061/api/growerorders'; // Replace with your API URL

    try{
      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(growerModel.toJson()),
      );
      print('response status code: ${response.statusCode}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        print('response body: ${response.body}');
        GrowerOrderModel newGrowerModel = GrowerOrderModel.fromJson(jsonDecode(response.body));
        return newGrowerModel;
      } else {
        print('response status code: ${response.statusCode}');
        print('response body: ${response.body}');
        throw Exception('Failed to load grower order');
      }
    } catch (e) {
      print('Error: $e');
      throw Exception('Failed to load grower order: $e');
    }
  }
}