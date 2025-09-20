// payment_api_service.dart

import 'dart:convert';
import 'package:growersignup/assets/constants/baseurl.dart';
import 'package:growersignup/models/grower/pending_payments.dart';
import 'package:http/http.dart' as http;

class PaymentApiService {
  // TODO: Replace with your actual base URL. For local development,
  // use 10.0.2.2 for the Android emulator.
  final String _baseUrl = "$cUrl/api"; 

  /// Fetches a list of pending cash payments for a specific grower.
  Future<List<PaymentDto>> getPendingCashPayments(String growerEmail) async {
    final response = await http.get(
      Uri.parse('$_baseUrl/GPayments/PendingCashPayments/$growerEmail'),
    );

    if (response.statusCode == 200) {
      final List<dynamic> decodedJson = jsonDecode(response.body);
      return decodedJson.map((json) => PaymentDto.fromJson(json)).toList();
    } else if (response.statusCode == 404) {
        return [];
    }
    else {
      throw Exception('Failed to load pending payments. Status code: ${response.statusCode}');
    }
  }

  /// Fetches a list of paid cash payments for a specific grower.
  Future<List<PaymentDto>> getPaidCashPayments(String growerEmail) async {
    final response = await http.get(
      Uri.parse('$_baseUrl/GPayments/PaidCashPayments/$growerEmail'),
    );

    if (response.statusCode == 200) {
      final List<dynamic> decodedJson = jsonDecode(response.body);
      return decodedJson.map((json) => PaymentDto.fromJson(json)).toList();
    } else if (response.statusCode == 404) {
        return [];
    }
    else {
      throw Exception('Failed to load paid payments. Status code: ${response.statusCode}');
    }
  }

  /// Fetches the detailed information for a specific grower order.
  Future<PaymentDetailDto> getPaymentDetails(int growerOrderId) async {
    final response = await http.get(
      Uri.parse('$_baseUrl/GPayments/PaymentDetails/$growerOrderId'),
    );

    if (response.statusCode == 200) {
      return PaymentDetailDto.fromJson(jsonDecode(response.body));
    } else {
      throw Exception('Failed to load payment details. Status code: ${response.statusCode}');
    }
  }
}
