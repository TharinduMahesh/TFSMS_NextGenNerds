import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:tfsms_app_frontend/models/Harvest.dart';

class OrderService {
  static const String baseUrl = 'https://localhost:7211/api/HarvestRequest';

  Future<List<Harvest>> fetchPendingRequests() async {
    final res = await http.get(Uri.parse('$baseUrl/pending'));
    if (res.statusCode == 200) {
      final data = jsonDecode(res.body) as List;
      return data.map((e) => Harvest.fromJson(e)).toList();
    } else {
      throw Exception('Failed to load pending');
    }
  }

  Future<Harvest?> fetchRequest(String id) async {
    final res = await http.get(Uri.parse('$baseUrl/$id'));
    if (res.statusCode == 200) {
      return Harvest.fromJson(jsonDecode(res.body));
    }
    return null;
  }

  Future<bool> updateRequestStatus(String id, String status) async {
    final res = await http.patch(
      Uri.parse('$baseUrl/$id/status'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'status': status}),
    );
    return res.statusCode == 200;
  }

  Future<bool> updateWeights(String id, double supper, double normal) async {
    final res = await http.patch(
      Uri.parse('$baseUrl/$id/weights'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'supperLeafWeight': supper,
        'normalLeafWeight': normal,
        'status': 'Weighed'
      }),
    );
    return res.statusCode == 200;
  }

  Future<List<Harvest>> fetchAcceptedRequests() async {
    final res = await http.get(Uri.parse('$baseUrl/accepted'));
    if (res.statusCode == 200) {
      return (jsonDecode(res.body) as List)
          .map((e) => Harvest.fromJson(e))
          .toList();
    } else {
      throw Exception('Failed to load accepted');
    }
  }
}
