import 'dart:convert';
import 'package:growersignup/models/grower/AccpetedOrderDetailsByCDto.dart';
import 'package:growersignup/models/grower/g_a_by_c_orders_model.dart';
import 'package:http/http.dart' as http;

class GOrderAcceptedApiService {
  static const String baseUrl = "http://localhost:7061/api/CollectorOrdersStatus";

  // Existing: Get pending orders
  // Existing: Get order details
  // Existing: Accept order

  // 🔹 New: Get accepted orders by collector email
  static Future<List<GAcceptedOrder>> getAcceptedOrders(String collectorEmail) async {
    final response = await http.get(Uri.parse('$baseUrl/accepted/$collectorEmail'));

    if (response.statusCode == 200) {
      final List<dynamic> jsonData = json.decode(response.body);
      return jsonData.map((e) => GAcceptedOrder.fromJson(e)).toList();
    } else {
      throw Exception('Failed to load accepted orders');
    }
  }

  // ✅ Reuse: Get order details
  static Future<AcceptedOrderDetailsByC> getOrderDetails(int orderId) async {
    final response = await http.get(Uri.parse('$baseUrl/details/$orderId'));

    if (response.statusCode == 200) {
      return AcceptedOrderDetailsByC.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to load order details');
    }
  }
}
