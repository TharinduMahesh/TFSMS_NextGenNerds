import 'dart:convert';
import 'package:growersignup/models/collector/pending_order_details.dart';
import 'package:growersignup/models/collector/collector_accepted_orders.dart';
import 'package:http/http.dart' as http;

class OrderAcceptedApiService {
  static const String baseUrl = "http://localhost:7061/api/GrowerOrdersStatus";

  // Existing: Get pending orders
  // Existing: Get order details
  // Existing: Accept order

  // 🔹 New: Get accepted orders by collector email
  static Future<List<AcceptedOrder>> getAcceptedOrders(String collectorEmail) async {
    final response = await http.get(Uri.parse('$baseUrl/accepted/$collectorEmail'));

    if (response.statusCode == 200) {
      final List<dynamic> jsonData = json.decode(response.body);
      return jsonData.map((e) => AcceptedOrder.fromJson(e)).toList();
    } else {
      throw Exception('Failed to load accepted orders');
    }
  }

  // ✅ Reuse: Get order details
  static Future<OrderDetails> getOrderDetails(int orderId) async {
    final response = await http.get(Uri.parse('$baseUrl/details/$orderId'));

    if (response.statusCode == 200) {
      return OrderDetails.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to load order details');
    }
  }
}
