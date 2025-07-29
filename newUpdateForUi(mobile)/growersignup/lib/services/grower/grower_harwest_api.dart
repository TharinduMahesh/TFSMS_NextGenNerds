import 'dart:convert';
import 'package:growersignup/assets/constants/baseurl.dart';
import 'package:growersignup/models/grower/grower_harvest_model.dart';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = '$cUrl';

  Future<GrowerHarvestSummary> fetchHarvestSummary(String growerEmail) async {
    final url = Uri.parse('$baseUrl/api/GrowerOrderHarwest/harvest-summary?email=$growerEmail');

    final response = await http.get(url);

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonBody = json.decode(response.body);
      return GrowerHarvestSummary.fromJson(jsonBody);
    } else {
      throw Exception('Failed to fetch harvest summary (${response.statusCode})');
    }
  }

  Future<GrowerHarvestSummary> fetchHarvestSummaryByPeriod(String email, String period) async {
    // Convert the period string to a format expected by your backend
    final periodParam = _convertPeriodToApiFormat(period);
    
    final url = Uri.parse('$baseUrl/api/GrowerOrderHarwest/harvest-summary-by-period?email=$email&period=$periodParam');

    final response = await http.get(url);

    if (response.statusCode == 200) {
      final Map<String, dynamic> jsonBody = json.decode(response.body);
      return GrowerHarvestSummary.fromJson(jsonBody);
    } else {
      throw Exception('Failed to fetch harvest summary for $period (${response.statusCode})');
    }
  }

  // Helper method to convert UI period strings to backend-expected format
  String _convertPeriodToApiFormat(String period) {
    switch (period) {
      case 'This Week':
        return 'thisweek';
      case 'Last Week':
        return 'lastweek';
      case 'This Month':
        return 'thismonth';
      case 'Last Month':
        return 'lastmonth';
      case 'Last 3 Months':
        return 'last3months';
      case 'This Year':
        return 'thisyear';
      case 'Next Week':
        return 'nextweek';
      case 'Next Month':
        return 'nextmonth';
      case 'Next 3 Months':
        return 'next3months';
      default:
        return 'thisweek'; // default fallback
    }
  }
}