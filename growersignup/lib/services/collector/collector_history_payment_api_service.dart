import 'dart:convert';
import 'package:growersignup/models/collector/collector_payment_detail_model.dart';
import 'package:growersignup/models/collector/collector_payment_history_model.dart';
import 'package:http/http.dart' as http;

class PaymentHistoryApiService {
  final String baseUrl = "https://localhost:7061/api/CollectorPaid";

  /// Get list of all completed payments
  Future<List<PaymentHistoryModel>> getPaidPayments() async {
    final response = await http.get(Uri.parse('$baseUrl/history'));

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => PaymentHistoryModel.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load payment history');
    }
  }

  /// Get full detail of one payment by RefNumber
  Future<PaymentDetailModel> getPaymentDetail(int refNumber) async {
    final response = await http.get(Uri.parse('$baseUrl/detail/$refNumber'));

    if (response.statusCode == 200) {
      return PaymentDetailModel.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to load payment detail');
    }
  }
}
