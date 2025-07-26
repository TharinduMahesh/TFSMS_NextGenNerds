// File Path: lib/services/auth_service.dart (or your existing API file)

import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:meta/meta.dart';

// -----------------------------------------------------------------
// API Configuration
// -----------------------------------------------------------------
class ApiConfig {
  // IMPORTANT: Use the correct IP for your development environment.
  static const String _baseUrl = "http://localhost:7061/api/GrowerSignUp";

  static Uri get register => Uri.parse('$_baseUrl/register');
  static Uri get login => Uri.parse('$_baseUrl/login'); 
  static Uri verificationStatus(String email) => Uri.parse('$_baseUrl/verification-status?email=${Uri.encodeComponent(email)}');
  static Uri get forgotPassword => Uri.parse('$_baseUrl/forgot-password');
  static Uri get resetPassword => Uri.parse('$_baseUrl/reset-password');
}

// -----------------------------------------------------------------
// Data Models
// -----------------------------------------------------------------
@immutable
class RegisterData {
  final String email;
  final String password;
  final String confirmPassword;
  const RegisterData({required this.email, required this.password, required this.confirmPassword});
  Map<String, dynamic> toJson() => {'gEmail': email, 'gPassword': password, 'gConfirmPassword': confirmPassword};
}

@immutable
class LoginData {
  final String email;
  final String password;
  const LoginData({required this.email, required this.password});
  Map<String, dynamic> toJson() => {'gEmail': email, 'gPassword': password};
}

@immutable
class LoginResponse {
  final String token;
  const LoginResponse({required this.token});
  factory LoginResponse.fromJson(Map<String, dynamic> json) => LoginResponse(token: json['token'] as String);
}

@immutable
class VerificationStatusResponse {
  final bool isVerified;
  const VerificationStatusResponse({required this.isVerified});
  factory VerificationStatusResponse.fromJson(Map<String, dynamic> json) => VerificationStatusResponse(isVerified: json['isVerified'] as bool);
}

@immutable
class ResetPasswordData {
  final String token;
  final String password;
  final String confirmPassword;

  const ResetPasswordData({required this.token, required this.password, required this.confirmPassword});

  Map<String, dynamic> toJson() => {
    'token': token,
    'password': password,
    'confirmPassword': confirmPassword,
  };
}


// -----------------------------------------------------------------
// API Service Class
// -----------------------------------------------------------------
class AuthService {
  Future<String> register(RegisterData data) async {
    try {
      final response = await http.post(ApiConfig.register, headers: {'Content-Type': 'application/json'}, body: json.encode(data.toJson()));
      return response.body;
    } catch (e) {
      return "Network Error: Could not connect to the server.";
    }
  }

  Future<LoginResponse> login(LoginData data) async {
    try {
      final response = await http.post(ApiConfig.login, headers: {'Content-Type': 'application/json'}, body: json.encode(data.toJson()));
      if (response.statusCode == 200) {
        return LoginResponse.fromJson(json.decode(response.body));
      } else {
        throw Exception(response.body);
      }
    } catch (e) {
      throw Exception('Login failed. Please try again.');
    }
  }

  Future<VerificationStatusResponse> checkVerificationStatus(String email) async {
    try {
      final response = await http.get(ApiConfig.verificationStatus(email));
      if (response.statusCode == 200) {
        return VerificationStatusResponse.fromJson(json.decode(response.body));
      } else {
        throw Exception('Failed to get verification status.');
      }
    } catch (e) {
      throw Exception('Network error checking verification status: $e');
    }
  }
  
  Future<String> requestPasswordReset(String email) async {
    try {
      final response = await http.post(
        ApiConfig.forgotPassword,
        headers: {'Content-Type': 'application/json'},
        body: json.encode({'email': email}),
      );
      return response.body;
    } catch (e) {
      return "Network Error: Could not connect to the server.";
    }
  }

  Future<String> resetPassword(ResetPasswordData data) async {
    try {
      final response = await http.post(
        ApiConfig.resetPassword,
        headers: {'Content-Type': 'application/json'},
        body: json.encode(data.toJson()),
      );
      return response.body;
    } catch (e) {
      return "Network Error: Could not connect to the server.";
    }
  }
}
