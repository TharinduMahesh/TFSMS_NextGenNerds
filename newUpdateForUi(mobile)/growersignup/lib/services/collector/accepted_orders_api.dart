import 'dart:convert';
import 'package:growersignup/assets/constants/baseurl.dart';
import 'package:growersignup/models/collector/accepted_payments_models.dart';
import 'package:growersignup/models/collector/to_payment_models.dart';
import 'package:http/http.dart' as http;

/// A service class to interact with the AcceptedPayments API.
class AcceptedPaymentsApiService {
    // Replace with your actual API base URL and port.
    static const String _baseUrl = "$cUrl/api/AcceptedPayments"; // Example port

    /// Fetches a list of all accepted (paid) cash payments for a collector.
    Future<List<AcceptedPayment>> getPaidCashPayments(String collectorEmail) async {
        final response = await http.get(Uri.parse('$_baseUrl/paid/cash/$collectorEmail'));

        if (response.statusCode == 200) {
            return acceptedPaymentFromJson(response.body);
        } else {
            throw Exception('Failed to load accepted payments. Status code: ${response.statusCode}');
        }
    }

    /// Fetches the details for a specific paid order.
    /// This reuses the PaymentDetail model from the pending payments workflow.
    Future<PaymentDetail> getPaymentDetails(int orderId) async {
        final response = await http.get(Uri.parse('$_baseUrl/details/$orderId'));

        if (response.statusCode == 200) {
            return PaymentDetail.fromJson(json.decode(response.body));
        } else {
            throw Exception('Failed to load payment details. Status code: ${response.statusCode}');
        }
    }
}
