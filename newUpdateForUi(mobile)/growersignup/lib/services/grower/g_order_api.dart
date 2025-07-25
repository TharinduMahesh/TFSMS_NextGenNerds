import 'dart:convert';
import 'package:growersignup/models/grower/g_order_pending_model.dart';
import 'package:growersignup/models/grower/g_pending_forg.dart';
import 'package:http/http.dart' as http;

class GOrderApiService {
  static const String baseUrl = "http://localhost:7061/api/CollectorOrdersStatus";

  // Fetch all pending orders
  static Future<List<GPendingOrder>> getPendingOrders() async {
    final response = await http.get(Uri.parse('$baseUrl/pending'));

    if (response.statusCode == 200) {
      final List<dynamic> jsonData = json.decode(response.body);
      return jsonData.map((e) => GPendingOrder.fromJson(e)).toList();
    } else {
      throw Exception('Failed to load pending orders');
    }
  }

  // Fetch order details by ID
  static Future<GOrderDetailsforg> getOrderDetails(int orderId) async {
    final response = await http.get(Uri.parse('$baseUrl/details/$orderId'));

    if (response.statusCode == 200) {
      return GOrderDetailsforg.fromJson(json.decode(response.body));
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
