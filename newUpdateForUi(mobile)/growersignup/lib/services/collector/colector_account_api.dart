import 'dart:convert';
import 'package:growersignup/assets/constants/baseurl.dart';
import 'package:growersignup/models/collector/collector_account.dart';
import 'package:http/http.dart' as http;

class CollectorApi {
  static const String baseUrl = '$cUrl/api/CollectorAccounts';

  static Future<bool> postCollectorAccount(CollectorAccount collector) async {
    final url = Uri.parse(baseUrl);

    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(collector.toJson()),
      );

      if (response.statusCode == 201 || response.statusCode == 200) {
        return true;
      } else {
        print('Failed to create: ${response.statusCode} ${response.body}');
        return false;
      }
    } catch (e) {
      print('Exception while posting collector: $e');
      return false;
    }
  }
}
