// File Path: lib/services/grower/grower_signup_api.dart

import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'package:meta/meta.dart';

// -----------------------------------------------------------------
// API Configuration for Grower
// -----------------------------------------------------------------
class ApiConfigGrower {
  static const String _baseUrl = "http://localhost:7061/api/GrowerSignUp";
  static Uri get register => Uri.parse('$_baseUrl/register');
  static Uri get login => Uri.parse('$_baseUrl/login');
  static Uri verificationStatus(String email) => Uri.parse('$_baseUrl/verification-status?email=${Uri.encodeComponent(email)}');
  static Uri get forgotPassword => Uri.parse('$_baseUrl/forgot-password');
  static Uri get resetPassword => Uri.parse('$_baseUrl/reset-password');
}

// -----------------------------------------------------------------
// Data Models for Grower
// -----------------------------------------------------------------
@immutable
class GRegisterData {
  final String email;
  final String password;
  final String confirmPassword;
  const GRegisterData({required this.email, required this.password, required this.confirmPassword});
  Map<String, dynamic> toJson() => {'gEmail': email, 'gPassword': password, 'gConfirmPassword': confirmPassword};
}

@immutable
class GLoginData {
  final String email;
  final String password;
  const GLoginData({required this.email, required this.password});
  Map<String, dynamic> toJson() => {'gEmail': email, 'gPassword': password};
}

@immutable
class GLoginResponse {
  final String token;
  const GLoginResponse({required this.token});
  factory GLoginResponse.fromJson(Map<String, dynamic> json) => GLoginResponse(token: json['token'] as String);
}

@immutable
class GVerificationStatusResponse {
  final bool isVerified;
  const GVerificationStatusResponse({required this.isVerified});
  factory GVerificationStatusResponse.fromJson(Map<String, dynamic> json) => GVerificationStatusResponse(isVerified: json['isVerified'] as bool);
}

@immutable
class GResetPasswordData {
  final String token;
  final String password;
  final String confirmPassword;
  const GResetPasswordData({required this.token, required this.password, required this.confirmPassword});
  Map<String, dynamic> toJson() => {'token': token, 'password': password, 'confirmPassword': confirmPassword};
}

// -----------------------------------------------------------------
// Updated AuthService for Grower
// -----------------------------------------------------------------
class GrowerAuthService {
  final _secureStorage = const FlutterSecureStorage();
  static const _tokenKey = 'grower_auth_token'; // Use a unique key for the grower token

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

  /// Handles user registration.
  Future<String> register(GRegisterData data) async {
    try {
      final response = await http.post(
        ApiConfigGrower.register,
        headers: {'Content-Type': 'application/json'},
        body: json.encode(data.toJson()),
      );
      return response.body;
    } catch (e) {
      return "Network Error: Could not connect to the server.";
    }
  }

  /// Handles user login and saves the token on success.
  Future<GLoginResponse> login(GLoginData data) async {
    try {
      final response = await http.post(
        ApiConfigGrower.login,
        headers: {'Content-Type': 'application/json'},
        body: json.encode(data.toJson()),
      );
      if (response.statusCode == 200) {
        final loginResponse = GLoginResponse.fromJson(json.decode(response.body));
        await _saveToken(loginResponse.token); // Save token on success
        return loginResponse;
      } else {
        throw Exception(response.body);
      }
    } catch (e) {
      throw Exception('Login failed. Please try again.');
    }
  }

  /// Checks if a user's email has been verified.
  Future<GVerificationStatusResponse> checkVerificationStatus(String email) async {
    try {
      final response = await http.get(ApiConfigGrower.verificationStatus(email));
      if (response.statusCode == 200) {
        return GVerificationStatusResponse.fromJson(json.decode(response.body));
      } else {
        throw Exception('Failed to get verification status.');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  /// Sends a request to the API to initiate the password reset process.
  Future<String> requestPasswordReset(String email) async {
    try {
      final response = await http.post(
        ApiConfigGrower.forgotPassword,
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email}),
      );
      return response.body;
    } catch (e) {
      return "Network Error: Could not connect to the server.";
    }
  }

  /// Sends the reset token and new password to the API.
  Future<String> resetPassword(GResetPasswordData data) async {
    try {
      final response = await http.post(
        ApiConfigGrower.resetPassword,
        headers: {'Content-Type': 'application/json'},
        body: json.encode(data.toJson()),
      );
      return response.body;
    } catch (e) {
      return "Network Error: Could not connect to the server.";
    }
  }
}
