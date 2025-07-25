import 'dart:convert';
import 'package:growersignup/models/grower/AccpetedOrderDetailsByCDto.dart';
import 'package:growersignup/models/grower/g_a_by_c_orders_model.dart';
import 'package:http/http.dart' as http;

class GOrderAcceptedDetailsApiService {
  static const String baseUrl = 'http://localhost:7061/api/CollectorOrdersStatus';

  /// Fetch accepted orders list for a grower
  static Future<List<GAcceptedOrder>> getAcceptedOrders(String email) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/accepted-orders?email=$email'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        return data.map((json) => GAcceptedOrder.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load accepted orders: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching accepted orders: $e');
    }
  }

  /// Fetch accepted order details by growerOrderId
  static Future<AcceptedOrderDetailsByC> getAcceptedOrderDetails(int orderId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/accepteddetails/$orderId'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final responseBody = json.decode(response.body);
        
        // Check if response is a list or single object
        if (responseBody is List) {
          // If it's a list, take the first item
          if (responseBody.isNotEmpty) {
            return AcceptedOrderDetailsByC.fromJson(responseBody[0]);
          } else {
            throw Exception('No order details found');
          }
        } else {
          // If it's a single object
          return AcceptedOrderDetailsByC.fromJson(responseBody);
        }
      } else {
        throw Exception('Failed to load order details: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error fetching order details: $e');
    }
  }
}