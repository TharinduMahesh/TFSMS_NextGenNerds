import 'dart:convert';
import 'dart:async'; // Required for TimeoutException
import 'package:growersignup/models/collector/c_signin_model.dart';
import 'package:growersignup/models/collector/c_signup_model.dart';
import 'package:http/http.dart' as http;

class CollectorAuthService {
  // --- FIXED: Changed https to http for web compatibility ---
  static const String baseUrl = 'http://localhost:7061/api/CollectorSignUp';

  /// Collector Registration
  static Future<String?> registerCollector(CRegisterDto dto) async {
    final url = Uri.parse('$baseUrl/register');
    print("--- Attempting to Register Collector ---");
    print("Target URL: $url");

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(dto.toJson()),
      ).timeout(const Duration(seconds: 15)); // Added a timeout

      print("Response Status Code: ${response.statusCode}");
      print("Response Body: ${response.body}");

      if (response.statusCode == 200 || response.statusCode == 201) {
        return 'Registered successfully';
      } else {
        // Safely decode error message from the server
        final errorBody = jsonDecode(response.body);
        return errorBody['message'] ?? 'Registration failed with status: ${response.statusCode}';
      }
    } on http.ClientException catch (e) {
      // This is the most likely error for CORS issues in web builds
      print("--- HTTP CLIENT EXCEPTION (NETWORK/CORS ERROR) ---");
      print("This often happens in web builds due to CORS policy.");
      print("Full Error Message: ${e.message}");
      print("Underlying Error: ${e.toString()}");
      return "Network Error: Could not connect. Check CORS policy on the server.";
    } on TimeoutException catch (e) {
      print("--- TIMEOUT EXCEPTION ---");
      print("The server did not respond in time.");
      print("Error: $e");
      return "Connection Timeout: The server took too long to respond.";
    } catch (e) {
      print("--- AN UNEXPECTED ERROR OCCURRED ---");
      print("Error Type: ${e.runtimeType}");
      print("Error: $e");
      return "An unexpected error occurred.";
    }
  }

  /// Collector Login
  static Future<String?> loginCollector(CLoginDto dto) async {
    final url = Uri.parse('$baseUrl/login');
    print("--- Attempting to Log In Collector ---");
    print("Target URL: $url");

    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(dto.toJson()),
      ).timeout(const Duration(seconds: 15));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['token']; // JWT token
      } else {
        return null;
      }
    } catch (e) {
      print("--- ERROR DURING LOGIN ---");
      print("Error: $e");
      return null;
    }
  }
}
