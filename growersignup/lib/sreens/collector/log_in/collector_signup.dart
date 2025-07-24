import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/models/collector/c_signup_model.dart';
import 'package:growersignup/sreens/collector/log_in/collector_signin_page.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';
import 'package:http/http.dart' as http;

class CollectorSignupPage extends StatefulWidget {
  const CollectorSignupPage({super.key});

  @override
  State<CollectorSignupPage> createState() => _CollectorSignupPageState();
}

class _CollectorSignupPageState extends State<CollectorSignupPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _isPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;
  bool _isSignUpSelected = true;

  static const Color pageBackgroundColor = Color(0xFFF0FBEF);
  static const Color cardBackgroundColor = Colors.white;
  static const Color primaryColor = Color(0xFFB2E7AE);
  static const Color primaryTextColor = Color(0xFF0a4e41);
  static const Color secondaryTextColor = Colors.black54;
  static const Color toggleUnselectedColor = Colors.transparent;
  static const Color toggleSelectedTextColor = primaryTextColor;
  static const Color toggleUnselectedTextColor = secondaryTextColor;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _signup(CSignupModel model) async {
    if (_formKey.currentState!.validate()) {
      final email = _emailController.text.trim();
      final password = _passwordController.text;
      final confirmPassword = _confirmPasswordController.text;

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Signing up...'),
          backgroundColor: Colors.blueAccent,
        ),
      );

      try {
        final uri = Uri.parse('https://localhost:7061/api/CollectorSignUp/register');

        final response = await http.post(
          uri,
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'gEmail': email,
            'gPassword': password,
            'gConfirmPassword': confirmPassword,
          }),
        );

        if (response.statusCode == 200 || response.statusCode == 201) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Signup successful!'), backgroundColor: Colors.green),
          );
        } else {
          final error = jsonDecode(response.body);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Signup failed: ${error['message'] ?? 'Unknown error'}'),
              backgroundColor: Colors.redAccent,
            ),
          );
        }
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error connecting to server: $e'), backgroundColor: Colors.red),
        );
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fix the errors in the form'), backgroundColor: Colors.orangeAccent),
      );
    }
  }

  void _navigateToSignIn() {
    Navigator.push(context, MaterialPageRoute(builder: (context) => const CollectorSignInPage()));
    setState(() {
      _isSignUpSelected = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, child) {
        return Scaffold(
          backgroundColor: pageBackgroundColor,
          body: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 40.0),
              child: Container(
                padding: const EdgeInsets.all(24.0),
                decoration: BoxDecoration(
                  color: cardBackgroundColor,
                  borderRadius: BorderRadius.circular(20.0),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.15),
                      spreadRadius: 2,
                      blurRadius: 10,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _buildSignInSignUpToggle(),
                      const SizedBox(height: 30),
                      _buildTextField(
                        controller: _emailController,
                        labelText: languageProvider.getText('email'),
                        keyboardType: TextInputType.emailAddress,
                        validator: (value) {
                          if (value == null || value.isEmpty) return 'Please enter your email';
                          if (!RegExp(r"^[\w\.-]+@[\w\.-]+\.\w+$").hasMatch(value)) return 'Enter a valid email';
                          return null;
                        },
                      ),
                      const SizedBox(height: 20),
                      _buildTextField(
                        controller: _passwordController,
                        labelText: languageProvider.getText('password'),
                        obscureText: !_isPasswordVisible,
                        suffixIcon: IconButton(
                          icon: Icon(_isPasswordVisible ? Icons.visibility_off : Icons.visibility, color: secondaryTextColor),
                          onPressed: () => setState(() => _isPasswordVisible = !_isPasswordVisible),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) return 'Enter password';
                          if (value.length < 6) return 'Minimum 6 characters';
                          return null;
                        },
                      ),
                      const SizedBox(height: 20),
                      _buildTextField(
                        controller: _confirmPasswordController,
                        labelText: languageProvider.getText('confirmPassword'),
                        obscureText: !_isConfirmPasswordVisible,
                        suffixIcon: IconButton(
                          icon: Icon(_isConfirmPasswordVisible ? Icons.visibility_off : Icons.visibility, color: secondaryTextColor),
                          onPressed: () => setState(() => _isConfirmPasswordVisible = !_isConfirmPasswordVisible),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) return 'Confirm password';
                          if (value != _passwordController.text) return 'Passwords do not match';
                          return null;
                        },
                      ),
                      const SizedBox(height: 35),
                      ElevatedButton(
                        onPressed: () => _signup(
                          CSignupModel(
                            CollectorId: 0,
                            CollectorEmail: _emailController.text.trim(),
                            CollectorPassword: _passwordController.text,
                          ),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: primaryColor,
                          foregroundColor: primaryTextColor,
                          minimumSize: const Size(double.infinity, 50),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30.0)),
                          elevation: 2,
                        ),
                        child: Text(
                          languageProvider.getText('signUp'),
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                      ),
                      const SizedBox(height: 25),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildSignInSignUpToggle() {
    return Container(
      height: 45,
      decoration: BoxDecoration(
        color: Colors.grey[200],
        borderRadius: BorderRadius.circular(30.0),
      ),
      child: Row(
        children: [
          Expanded(
            child: GestureDetector(
              onTap: _navigateToSignIn,
              child: Container(
                decoration: BoxDecoration(
                  color: !_isSignUpSelected ? primaryColor : toggleUnselectedColor,
                  borderRadius: BorderRadius.circular(30.0),
                ),
                alignment: Alignment.center,
                child: Text(
                  'Sign In',
                  style: TextStyle(
                    color: !_isSignUpSelected ? toggleSelectedTextColor : toggleUnselectedTextColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: GestureDetector(
              onTap: () => setState(() => _isSignUpSelected = true),
              child: Container(
                decoration: BoxDecoration(
                  color: _isSignUpSelected ? primaryColor : toggleUnselectedColor,
                  borderRadius: BorderRadius.circular(30.0),
                ),
                alignment: Alignment.center,
                child: Text(
                  'Sign Up',
                  style: TextStyle(
                    color: _isSignUpSelected ? toggleSelectedTextColor : toggleUnselectedTextColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String labelText,
    TextInputType keyboardType = TextInputType.text,
    bool obscureText = false,
    Widget? suffixIcon,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      obscureText: obscureText,
      decoration: InputDecoration(
        labelText: labelText,
        labelStyle: const TextStyle(color: secondaryTextColor, fontSize: 14),
        suffixIcon: suffixIcon,
        border: const UnderlineInputBorder(borderSide: BorderSide(color: Colors.grey)),
        enabledBorder: const UnderlineInputBorder(borderSide: BorderSide(color: Colors.grey)),
        focusedBorder: const UnderlineInputBorder(borderSide: BorderSide(color: primaryTextColor, width: 1.5)),
        errorBorder: const UnderlineInputBorder(borderSide: BorderSide(color: Colors.redAccent)),
        focusedErrorBorder: const UnderlineInputBorder(borderSide: BorderSide(color: Colors.redAccent, width: 1.5)),
        contentPadding: const EdgeInsets.only(top: 10.0, bottom: 5.0),
      ),
      validator: validator,
      autovalidateMode: AutovalidateMode.onUserInteraction,
    );
  }
}
