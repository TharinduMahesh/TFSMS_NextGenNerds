import 'dart:convert';
import 'package:growersignup/assets/constants/baseurl.dart';
import 'package:growersignup/models/collector/to_payment_models.dart';
import 'package:http/http.dart' as http;

class PaymentApiService {
    // Adjust the base URL to your API's location
    static const String _baseUrl = "$cUrl/api/Payments";

    /// Fetches pending cash payments for a specific collector.
    Future<List<PendingPayment>> getPendingCashPayments(String collectorEmail) async {
        final response = await http.get(Uri.parse('$_baseUrl/pending/cash/$collectorEmail'));

        if (response.statusCode == 200) {
            return pendingPaymentFromJson(response.body);
        } else {
            throw Exception('Failed to load pending payments. Status code: ${response.statusCode}');
        }
    }

    /// Fetches the details for a specific payment order.
    Future<PaymentDetail> getPaymentDetails(int orderId) async {
        final response = await http.get(Uri.parse('$_baseUrl/details/$orderId'));

        if (response.statusCode == 200) {
            return PaymentDetail.fromJson(json.decode(response.body));
        } else {
            throw Exception('Failed to load payment details. Status code: ${response.statusCode}');
        }
    }

    /// Accepts a payment, marking it as "Paid".
    Future<void> acceptPayment(int paymentId) async {
        final response = await http.put(
            Uri.parse('$_baseUrl/accept/$paymentId'),
        );

        if (response.statusCode != 204) { // 204 No Content on success
            throw Exception('Failed to accept payment. Status code: ${response.statusCode}');
        }
    }
}
