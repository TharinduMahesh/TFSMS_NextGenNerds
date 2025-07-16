import 'dart:convert';
import 'package:growersignup/models/collector/collector_payment_detail_model.dart';
import 'package:growersignup/models/collector/to_pay_model.dart';
import 'package:http/http.dart' as http;

class PaymentApiService {
  final String baseUrl = "https://localhost:7061/api/CollectorPayments";

  /// Fetch all payments with status != Paid
  Future<List<ToPayModel>> getPendingPayments() async {
    final response = await http.get(Uri.parse('$baseUrl/unpaid'));

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => ToPayModel.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load payments');
    }
  }

  /// Get detailed info by RefNumber
  Future<PaymentDetailModel> getPaymentDetail(int refNumber) async {
    final response = await http.get(Uri.parse('$baseUrl/detail/$refNumber'));

    if (response.statusCode == 200) {
      return PaymentDetailModel.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to load payment detail');
    }
  }

  /// Complete a payment (set status to "Paid")
  Future<void> completePayment(int refNumber) async {
    final response = await http.put(Uri.parse('$baseUrl/complete/$refNumber'));

    if (response.statusCode != 204) {
      throw Exception('Failed to complete payment');
    }
  }
}
