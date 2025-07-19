import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/harvest_request.dart';

class HarvestRequestService {
  static const String baseUrl = 'https://localhost:7203/api/HarvestRequest';

  // Get pending requests by collector transport
  static Future<List<HarvestRequest>> getPendingByCollector() async {
    try {
      print('🚛 Fetching pending requests by collector...');
      final response = await http.get(
        Uri.parse('$baseUrl/pending/by-collector'),
        headers: {'Content-Type': 'application/json'},
      );

      print('📡 Response status: ${response.statusCode}');
      
      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        print('✅ Found ${data.length} pending requests');
        
        return data.map((json) => HarvestRequest.fromJson(json)).toList();
      } else {
        print('❌ Error: ${response.statusCode}');
        throw Exception('Failed to load pending requests: ${response.statusCode}');
      }
    } catch (e) {
      print('❌ Exception: $e');
      throw Exception('Network error: $e');
    }
  }

  // Get accepted requests
  static Future<List<HarvestRequest>> getAcceptedRequests() async {
    try {
      print('✅ Fetching accepted requests...');
      final response = await http.get(
        Uri.parse('$baseUrl/accepted'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        print('✅ Found ${data.length} accepted requests');
        
        return data.map((json) => HarvestRequest.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load accepted requests: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // Update request status (Accept/Reject)
  static Future<bool> updateStatus(int id, String status) async {
    try {
      print('📝 Updating request $id to status: $status');
      final response = await http.patch(
        Uri.parse('$baseUrl/$id/status'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'status': status}),
      );

      print('📡 Response status: ${response.statusCode}');
      
      if (response.statusCode == 200) {
        print('✅ Status updated successfully');
        return true;
      } else {
        print('❌ Failed to update status: ${response.statusCode}');
        return false;
      }
    } catch (e) {
      print('❌ Exception updating status: $e');
      return false;
    }
  }

  // Update weights after weighing
  static Future<bool> updateWeights(int id, double supperWeight, double normalWeight) async {
    try {
      print('⚖️ Updating weights for request $id');
      final response = await http.patch(
        Uri.parse('$baseUrl/$id/weights'),
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'supperLeafWeight': supperWeight,
          'normalLeafWeight': normalWeight,
          'status': 'Weighed'
        }),
      );

      if (response.statusCode == 200) {
        print('✅ Weights updated successfully');
        return true;
      } else {
        print('❌ Failed to update weights: ${response.statusCode}');
        return false;
      }
    } catch (e) {
      print('❌ Exception updating weights: $e');
      return false;
    }
  }

  // Get request by ID
  static Future<HarvestRequest?> getById(int id) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/$id'),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        return HarvestRequest.fromJson(data);
      } else if (response.statusCode == 404) {
        return null;
      } else {
        throw Exception('Failed to load request: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  // Create new harvest request
  static Future<bool> createRequest(HarvestRequest harvestRequest) async {
    try {
      print('📝 Creating new harvest request...');
      final response = await http.post(
        Uri.parse(baseUrl),
        headers: {'Content-Type': 'application/json'},
        body: json.encode(harvestRequest.toJson()),
      );

      print('📡 Response status: ${response.statusCode}');
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        print('✅ Harvest request created successfully');
        return true;
      } else {
        print('❌ Failed to create request: ${response.statusCode}');
        print('Response body: ${response.body}');
        return false;
      }
    } catch (e) {
      print('❌ Exception creating request: $e');
      return false;
    }
  }
}
