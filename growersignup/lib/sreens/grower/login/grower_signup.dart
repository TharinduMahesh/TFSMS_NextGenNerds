import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/models/grower/g_signup_model.dart';
import 'package:growersignup/sreens/grower/login/grower_create_account.dart';
import 'package:growersignup/sreens/grower/login/grower_signin_page.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';
import 'package:http/http.dart' as http;

class GrowerSignupPage extends StatefulWidget {
  const GrowerSignupPage({super.key});

  @override
  State<GrowerSignupPage> createState() => _GrowerSignupPageState();
}

class _GrowerSignupPageState extends State<GrowerSignupPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  bool _isPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;
  bool _isSignUpSelected = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _signup(GSignupModel growerModel) async {
    if (_formKey.currentState!.validate()) {
      final email = _emailController.text.trim();
      final password = _passwordController.text;
      final confirmPassword = _confirmPasswordController.text;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(Provider.of<LanguageProvider>(context, listen: false).getText('signingUp')), backgroundColor: Colors.blueAccent),
      );

      try {
        final uri = Uri.parse('https://localhost:7061/api/GrowerSignUp/register');
        final response = await http.post(
          Uri.parse(uri.toString()),
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({'gEmail': email, 'gPassword': password, 'gConfirmPassword': confirmPassword}),
        );

        if (response.statusCode == 200 || response.statusCode == 201) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(Provider.of<LanguageProvider>(context, listen: false).getText('signupSuccess')), backgroundColor: Colors.green),
          );
          Navigator.push(context, MaterialPageRoute(builder: (context) => GrowerCreateAccountPage(email: email)));
        } else {
          final error = jsonDecode(response.body);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('${Provider.of<LanguageProvider>(context, listen: false).getText('signupFailed')}: ${error['message'] ?? 'Unknown error'}'), backgroundColor: Colors.redAccent),
          );
        }
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('${Provider.of<LanguageProvider>(context, listen: false).getText('connectionError')}: $e'), backgroundColor: Colors.red),
        );
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(Provider.of<LanguageProvider>(context, listen: false).getText('formError')), backgroundColor: Colors.orangeAccent),
      );
    }
  }

  void _navigateToSignIn() {
    Navigator.push(context, MaterialPageRoute(builder: (context) => const GrowerSignInPage()));
    setState(() {
      _isSignUpSelected = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final languageProvider = Provider.of<LanguageProvider>(context);
    final themeProvider = Provider.of<ThemeProvider>(context);

    return Scaffold(
      backgroundColor: themeProvider.isDarkMode ? Colors.black : const Color(0xFFF0FBEF),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 40.0),
          child: Container(
            padding: const EdgeInsets.all(24.0),
            decoration: BoxDecoration(
              color: themeProvider.isDarkMode ? Colors.grey[850] : Colors.white,
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
                  _buildSignInSignUpToggle(languageProvider, themeProvider),
                  const SizedBox(height: 30),
                  _buildTextField(
                    controller: _emailController,
                    labelText: languageProvider.getText('email'),
                    keyboardType: TextInputType.emailAddress,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return languageProvider.getText('enterEmail');
                      }
                      if (!RegExp(r"^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$").hasMatch(value)) {
                        return languageProvider.getText('invalidEmail');
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),
                  _buildTextField(
                    controller: _passwordController,
                    labelText: languageProvider.getText('password'),
                    obscureText: !_isPasswordVisible,
                    suffixIcon: IconButton(
                      icon: Icon(_isPasswordVisible ? Icons.visibility_off : Icons.visibility, color: Colors.grey),
                      onPressed: () {
                        setState(() {
                          _isPasswordVisible = !_isPasswordVisible;
                        });
                      },
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return languageProvider.getText('enterPassword');
                      }
                      if (value.length < 6) {
                        return languageProvider.getText('passwordLength');
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),
                  _buildTextField(
                    controller: _confirmPasswordController,
                    labelText: languageProvider.getText('confirmPassword'),
                    obscureText: !_isConfirmPasswordVisible,
                    suffixIcon: IconButton(
                      icon: Icon(_isConfirmPasswordVisible ? Icons.visibility_off : Icons.visibility, color: Colors.grey),
                      onPressed: () {
                        setState(() {
                          _isConfirmPasswordVisible = !_isConfirmPasswordVisible;
                        });
                      },
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return languageProvider.getText('confirmPasswordHint');
                      }
                      if (value != _passwordController.text) {
                        return languageProvider.getText('passwordMismatch');
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 35),
                  ElevatedButton(
                    onPressed: () => _signup(GSignupModel(GrowerId: 0, GrowerEmail: _emailController.text.trim(), GrowerPassword: _passwordController.text)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFB2E7AE),
                      foregroundColor: const Color(0xFF0a4e41),
                      minimumSize: const Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30.0)),
                      elevation: 2,
                    ),
                    child: Text(
                      languageProvider.getText('signup'),
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
  }

  Widget _buildSignInSignUpToggle(LanguageProvider languageProvider, ThemeProvider themeProvider) {
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
                  color: !_isSignUpSelected ? const Color(0xFFB2E7AE) : Colors.transparent,
                  borderRadius: BorderRadius.circular(30.0),
                ),
                alignment: Alignment.center,
                child: Text(
                  languageProvider.getText('signIn'),
                  style: TextStyle(
                    color: !_isSignUpSelected ? const Color(0xFF0a4e41) : Colors.black54,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: GestureDetector(
              onTap: () {
                if (!_isSignUpSelected) {
                  setState(() {
                    _isSignUpSelected = true;
                  });
                }
              },
              child: Container(
                decoration: BoxDecoration(
                  color: _isSignUpSelected ? const Color(0xFFB2E7AE) : Colors.transparent,
                  borderRadius: BorderRadius.circular(30.0),
                ),
                alignment: Alignment.center,
                child: Text(
                  languageProvider.getText('signUp'),
                  style: TextStyle(
                    color: _isSignUpSelected ? const Color(0xFF0a4e41) : Colors.black54,
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
        labelStyle: const TextStyle(color: Colors.black54, fontSize: 14),
        suffixIcon: suffixIcon,
        border: const UnderlineInputBorder(borderSide: BorderSide(color: Colors.grey)),
        enabledBorder: const UnderlineInputBorder(borderSide: BorderSide(color: Colors.grey)),
        focusedBorder: const UnderlineInputBorder(borderSide: BorderSide(color: Color(0xFF0a4e41), width: 1.5)),
        errorBorder: const UnderlineInputBorder(borderSide: BorderSide(color: Colors.redAccent, width: 1.0)),
        focusedErrorBorder: const UnderlineInputBorder(borderSide: BorderSide(color: Colors.redAccent, width: 1.5)),
        contentPadding: const EdgeInsets.only(top: 10.0, bottom: 5.0),
      ),
      validator: validator,
      autovalidateMode: AutovalidateMode.onUserInteraction,
    );
  }
}
