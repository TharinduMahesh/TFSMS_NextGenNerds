// File Path: lib/services/collector/collector_signup_api.dart

import 'dart:convert';
import 'package:growersignup/assets/constants/baseurl.dart';
import 'package:http/http.dart' as http;
import 'package:meta/meta.dart';
// --- NEW IMPORTS FOR LOGOUT ---
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
// --- END NEW IMPORTS ---

// -----------------------------------------------------------------
// API Configuration for Collector
// -----------------------------------------------------------------
class ApiConfigCollector {
  // IMPORTANT: Use the correct IP for your development environment.
  static const String _baseUrl = "$cUrl/api/CollectorSignUp";

  static Uri get register => Uri.parse('$_baseUrl/register');
  static Uri get login => Uri.parse('$_baseUrl/login');
  static Uri verificationStatus(String email) => Uri.parse('$_baseUrl/verification-status?email=${Uri.encodeComponent(email)}');
  static Uri get forgotPassword => Uri.parse('$_baseUrl/forgot-password');
  static Uri get resetPassword => Uri.parse('$_baseUrl/reset-password');
}

// -----------------------------------------------------------------
// Data Models for Collector (Replaces c_signin_model.dart and c_signup_model.dart)
// -----------------------------------------------------------------
@immutable
class CRegisterData {
  final String email;
  final String password;
  final String confirmPassword;

  const CRegisterData({required this.email, required this.password, required this.confirmPassword});

  Map<String, dynamic> toJson() => {
    'cEmail': email,
    'cPassword': password,
    'cConfirmPassword': confirmPassword,
  };
}

@immutable
class CLoginData {
  final String email;
  final String password;
  const CLoginData({required this.email, required this.password});

  Map<String, dynamic> toJson() => {
    'cEmail': email,
    'cPassword': password,
  };
}

@immutable
class CLoginResponse {
  final String token;
  const CLoginResponse({required this.token});
  factory CLoginResponse.fromJson(Map<String, dynamic> json) => CLoginResponse(token: json['token'] as String);
}

@immutable
class CVerificationStatusResponse {
  final bool isVerified;
  const CVerificationStatusResponse({required this.isVerified});
  factory CVerificationStatusResponse.fromJson(Map<String, dynamic> json) => CVerificationStatusResponse(isVerified: json['isVerified'] as bool);
}

@immutable
class CResetPasswordData {
  final String token;
  final String password;
  final String confirmPassword;

  const CResetPasswordData({required this.token, required this.password, required this.confirmPassword});

  Map<String, dynamic> toJson() => {
    'token': token,
    'password': password,
    'confirmPassword': confirmPassword,
  };
}


// -----------------------------------------------------------------
// Updated API Service Class for Collector (with Token Management)
// -----------------------------------------------------------------
class CollectorAuthService {
  // --- NEW: Secure Storage for Token Management ---
  final _secureStorage = const FlutterSecureStorage();
  static const _tokenKey = 'collector_auth_token'; // Use a unique key for the collector token

  /// Saves the JWT token securely.
  Future<void> _saveToken(String token) async {
    await _secureStorage.write(key: _tokenKey, value: token);
  }

  /// Retrieves the saved JWT token.
  Future<String?> getToken() async {
    return await _secureStorage.read(key: _tokenKey);
  }

  /// Deletes the token to log the user out.
  Future<void> logout() async {
    await _secureStorage.delete(key: _tokenKey);
  }

  /// Checks if user is logged in by checking if token exists
  Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  /// Clears all stored data (can be used for complete logout)
  Future<void> clearAllData() async {
    await _secureStorage.deleteAll();
  }
  // --- END: Token Management Methods ---

  /// Handles user registration.
  Future<String> register(CRegisterData data) async {
    try {
      final response = await http.post(
        ApiConfigCollector.register,
        headers: {'Content-Type': 'application/json'},
        body: json.encode(data.toJson()),
      );
      return response.body;
    } catch (e) {
      return "Network Error: Could not connect to the server.";
    }
  }

  /// Handles user login and saves the token on success.
  Future<CLoginResponse> login(CLoginData data) async {
    try {
      final response = await http.post(
        ApiConfigCollector.login,
        headers: {'Content-Type': 'application/json'},
        body: json.encode(data.toJson()),
      );
      if (response.statusCode == 200) {
        final loginResponse = CLoginResponse.fromJson(json.decode(response.body));
        await _saveToken(loginResponse.token); // Save token on success
        return loginResponse;
      } else {
        throw Exception(response.body);
      }
    } catch (e) {
      throw Exception('Login failed. Please try again.');
    }
  }

  /// Checks if a collector's email has been verified.
  Future<CVerificationStatusResponse> checkVerificationStatus(String email) async {
    try {
      final response = await http.get(ApiConfigCollector.verificationStatus(email));
      if (response.statusCode == 200) {
        return CVerificationStatusResponse.fromJson(json.decode(response.body));
      } else {
        throw Exception('Failed to get verification status.');
      }
    } catch (e) {
      throw Exception('Network error checking verification status: $e');
    }
  }
  
  /// Sends a request to the API to initiate the password reset process.
  Future<String> requestPasswordReset(String email) async {
    try {
      final response = await http.post(
        ApiConfigCollector.forgotPassword,
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email}),
      );
      return response.body;
    } catch (e) {
      return "Network Error: Could not connect to the server.";
    }
  }

  /// Sends the reset token and new password to the API.
  Future<String> resetPassword(CResetPasswordData data) async {
    try {
      final response = await http.post(
        ApiConfigCollector.resetPassword,
        headers: {'Content-Type': 'application/json'},
        body: json.encode(data.toJson()),
      );
      return response.body;
    } catch (e) {
      return "Network Error: Could not connect to the server.";
    }
  }
}