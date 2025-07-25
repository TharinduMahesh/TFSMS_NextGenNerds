import 'dart:convert';
import 'package:flutter/foundation.dart'; // Required for kDebugMode
import 'package:http/http.dart' as http;

class GrowerForgotPasswordApi {
  // Use http://10.0.2.2 for Android Emulator or your computer's IP for a physical device.
  // Using localhost is correct for a web app running on the same machine.
  static const String baseUrl = 'http://localhost:7061/api/GrowerAuth';

  static Future<String> sendResetEmail(String email) async {
    final url = Uri.parse('$baseUrl/forgot-password');
    
    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email}),
      ).timeout(const Duration(seconds: 15));

      // --- START: IMPROVED ERROR HANDLING ---

      // Check if the request was successful
      if (response.statusCode >= 200 && response.statusCode < 300) {
        // Successfully got a response.
        final responseBody = jsonDecode(response.body);
        return responseBody['message'] ?? 'Reset email sent successfully';
      } else {
        // The server returned an error (e.g., 400 Bad Request, 500 Internal Server Error)
        
        // Print the raw response to the debug console to see the server's full error page
        if (kDebugMode) {
          print('--- API ERROR ---');
          print('Status Code: ${response.statusCode}');
          print('Response Body: ${response.body}');
          print('-------------------');
        }

        // Try to decode the error message from the server's JSON response
        try {
          final errorData = jsonDecode(response.body);
          // Throw the specific error message from the API
          throw Exception(errorData['message'] ?? 'An unknown error occurred.');
        } catch (e) {
          // If the response body isn't valid JSON (e.g., it's an HTML error page),
          // throw a more generic error. The real error is already printed above.
          throw Exception('Failed to send reset email. Server returned status ${response.statusCode}.');
        }
      }

      // --- END: IMPROVED ERROR HANDLING ---

    } catch (e) {
      // This catches network-level errors (e.g., no internet, DNS failure, timeout)
      // or the exceptions we threw above.
      if (kDebugMode) {
        print('--- CATCH BLOCK ERROR ---');
        print('Exception Type: ${e.runtimeType}');
        print('Error: $e');
        print('-------------------------');
      }
      // Re-throw the exception so the UI layer can catch it and display a message.
      throw Exception(e.toString().replaceFirst("Exception: ", ""));
    }
  }
}
