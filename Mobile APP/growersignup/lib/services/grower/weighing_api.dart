import 'dart:convert';
import 'package:http/http.dart' as http;

class OrderUpdateService {
  static Future<bool> updateWeights({
    required int orderId,
    required String superLeafWeight,
    required String greenLeafWeight,
  }) async {
    final url = Uri.parse('http://localhost:7061/api/CollectorOrdersStatus/updateweights/$orderId');

    final response = await http.put(
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'SuperLeafWeight': double.tryParse(superLeafWeight) ?? 0,
        'GreenLeafWeight': double.tryParse(greenLeafWeight) ?? 0,
      }),
    );

    return response.statusCode == 200;
  }
}