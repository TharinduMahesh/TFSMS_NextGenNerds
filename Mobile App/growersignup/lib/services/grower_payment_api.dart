import 'dart:convert';
import 'package:growersignup/models/grower_payment_model.dart';
import 'package:http/http.dart' as http;

class PaymentApiService {
  final String baseUrl;

  PaymentApiService({required this.baseUrl});

  // Fetch all payments and total
  Future<PaymentResponse?> fetchPayments() async {
    try {
      final response = await http.get(Uri.parse('https://localhost:7061/api/payments'));

      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);
        return PaymentResponse.fromJson(jsonData);
      } else {
        print('Failed to load payments. Status: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Error fetching payments: $e');
      return null;
    }
  }

  // Add a new payment
  Future<bool> addPayment(Payment payment) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/payments'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'amount': payment.amount,
          'refNumber': payment.refNumber,
          'paymentMethod': payment.paymentMethod,
        }),
      );

      return response.statusCode == 201;
    } catch (e) {
      print('Error adding payment: $e');
      return false;
    }
  }
}
