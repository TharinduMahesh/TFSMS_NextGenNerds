import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../models/grower/grower_payment_model.dart';

class GrowerPaymentApi {
  static const String baseUrl = 'https://localhost:7061/api/Payments';

  static Future<PaymentResponse?> getPaymentsByEmail(String email) async {
    final url = Uri.parse('$baseUrl/$email');

    try {
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);
        return PaymentResponse.fromJson(jsonData);
      } else {
        print('Failed to load payments. Status code: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching payments: $e');
    }

    return null;
  }
}
