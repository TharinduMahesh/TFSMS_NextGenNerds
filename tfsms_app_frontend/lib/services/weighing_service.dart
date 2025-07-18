import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:tfsms_app_frontend/models/Harvest.dart';

class WeighingService {
  static const String baseUrl = 'https://localhost:7203/api/HarvestRequest';

  /// Fetch all accepted harvest requests for weighing
  Future<List<Harvest>> fetchAcceptedRequests() async {
    try {
      print('⚖️ Fetching accepted requests from: $baseUrl/accepted');
      final res = await http.get(
        Uri.parse('$baseUrl/accepted'),
        headers: {'Accept': 'application/json'},
      );
      
      print('📡 Response status: ${res.statusCode}');
      print('📡 Response body length: ${res.body.length}');
      print('📡 Response body preview: ${res.body.length > 500 ? res.body.substring(0, 500) + "..." : res.body}');
      
      if (res.statusCode == 200) {
        if (res.body.isEmpty) {
          print('⚠️ Empty response body');
          return [];
        }
        
        final responseData = jsonDecode(res.body);
        print('📦 Decoded response type: ${responseData.runtimeType}');
        
        // Handle different response formats
        List<dynamic> data;
        if (responseData is List) {
          // Direct array response from your C# controller
          data = responseData;
          print('✅ Received array with ${data.length} accepted requests');
        } else if (responseData is Map<String, dynamic>) {
          // Handle wrapped response if needed
          if (responseData.containsKey('data')) {
            data = responseData['data'] as List;
            print('✅ Received object with data property containing ${data.length} items');
          } else {
            // Try to convert single object to array
            data = [responseData];
            print('✅ Converted single object to array');
          }
        } else {
          throw Exception('Unexpected response format: ${responseData.runtimeType}');
        }
        
        print('✅ Processing ${data.length} accepted requests for weighing');
        
        List<Harvest> harvests = [];
        for (int i = 0; i < data.length; i++) {
          try {
            print('🔄 Processing accepted request ${i + 1}/${data.length}');
            final harvest = Harvest.fromJson(data[i] as Map<String, dynamic>);
            harvests.add(harvest);
          } catch (e) {
            print('❌ Error parsing accepted request ${i + 1}: $e');
            print('❌ Item data: ${data[i]}');
            // Continue processing other items instead of failing completely
            continue;
          }
        }
        
        print('✅ Successfully parsed ${harvests.length} out of ${data.length} accepted requests');
        return harvests;
      } else {
        print('❌ HTTP ${res.statusCode}: ${res.body}');
        throw Exception('Failed to fetch accepted requests: ${res.statusCode}');
      }
    } catch (e) {
      print('❌ Exception in fetchAcceptedRequests: $e');
      throw Exception('Failed to load accepted requests: $e');
    }
  }

  /// Get specific harvest request by ID
  Future<Harvest?> getRequestById(String id) async {
    try {
      print('🔍 Fetching request details for ID: $id');
      final res = await http.get(
        Uri.parse('$baseUrl/$id'),
        headers: {'Accept': 'application/json'},
      );
      
      print('📡 Response status: ${res.statusCode}');
      
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        print('✅ Request found: ${data['supplierName']}');
        return Harvest.fromJson(data as Map<String, dynamic>);
      } else if (res.statusCode == 404) {
        print('⚠️ Request not found: $id');
        return null;
      } else {
        print('❌ Error fetching request: ${res.statusCode}');
        return null;
      }
    } catch (e) {
      print('❌ Exception fetching request: $e');
      return null;
    }
  }

  /// Update weights after weighing is complete
  Future<bool> updateWeights(String id, double supperWeight, double normalWeight) async {
    try {
      print('⚖️ Updating weights for request $id');
      print('📦 Supper: ${supperWeight}kg, Normal: ${normalWeight}kg');
      
      final res = await http.patch(
        Uri.parse('$baseUrl/$id/weights'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode({
          'supperLeafWeight': supperWeight,
          'normalLeafWeight': normalWeight,
          'status': 'Weighed'
        }),
      );
      
      print('📡 Response status: ${res.statusCode}');
      
      if (res.statusCode == 200) {
        print('✅ Weights updated successfully');
        return true;
      } else {
        print('❌ Failed to update weights: ${res.statusCode}');
        print('Response body: ${res.body}');
        return false;
      }
    } catch (e) {
      print('❌ Exception updating weights: $e');
      return false;
    }
  }

  /// Update request status (e.g., to "Completed" after weighing)
  Future<bool> updateStatus(String id, String status) async {
    try {
      print('📝 Updating status for request $id to: $status');
      final res = await http.patch(
        Uri.parse('$baseUrl/$id/status'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode({'status': status}),
      );
      
      print('📡 Response status: ${res.statusCode}');
      
      if (res.statusCode == 200) {
        print('✅ Status updated successfully to: $status');
        return true;
      } else {
        print('❌ Failed to update status: ${res.statusCode}');
        print('Response body: ${res.body}');
        return false;
      }
    } catch (e) {
      print('❌ Exception updating status: $e');
      return false;
    }
  }

  /// Complete weighing process - update both weights and status
  Future<bool> completeWeighing(String id, double supperWeight, double normalWeight) async {
    try {
      print('🎯 Completing weighing process for request $id');
      
      // Update weights first
      final weightsUpdated = await updateWeights(id, supperWeight, normalWeight);
      
      if (weightsUpdated) {
        // Then update status to completed
        final statusUpdated = await updateStatus(id, 'Completed');
        
        if (statusUpdated) {
          print('✅ Weighing process completed successfully');
          return true;
        } else {
          print('⚠️ Weights updated but status update failed');
          return false;
        }
      } else {
        print('❌ Failed to update weights');
        return false;
      }
    } catch (e) {
      print('❌ Exception in completeWeighing: $e');
      return false;
    }
  }
}