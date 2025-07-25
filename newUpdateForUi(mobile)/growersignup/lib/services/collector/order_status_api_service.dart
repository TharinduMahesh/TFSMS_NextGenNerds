import 'dart:convert';
import 'package:growersignup/models/collector/pending_order.dart';
import 'package:growersignup/models/collector/pending_order_details.dart';
import 'package:http/http.dart' as http;

class OrderApiService {
  static const String baseUrl = "http://localhost:7061/api/GrowerOrdersStatus";

  // Fetch all pending orders
  static Future<List<PendingOrder>> getPendingOrders() async {
    final response = await http.get(Uri.parse('$baseUrl/pending'));

    if (response.statusCode == 200) {
      final List<dynamic> jsonData = json.decode(response.body);
      return jsonData.map((e) => PendingOrder.fromJson(e)).toList();
    } else {
      throw Exception('Failed to load pending orders');
    }
  }

  // Fetch order details by ID
  static Future<OrderDetails> getOrderDetails(int orderId) async {
    final response = await http.get(Uri.parse('$baseUrl/details/$orderId'));

    if (response.statusCode == 200) {
      return OrderDetails.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to load order details');
    }
  }

  // Accept an order
  static Future<void> acceptOrder(int orderId, String collectorEmail) async {
    final response = await http.put(
      Uri.parse('$baseUrl/accept'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'orderId': orderId,
        'collectorEmail': collectorEmail,
      }),
    );

    if (response.statusCode != 204) {
      throw Exception('Failed to accept order');
    }
  }
}
