import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:growersignup/models/c_signup_model.dart';
import 'package:growersignup/sreens/collector_signin_page.dart';
import 'package:http/http.dart' as http;

class CollectorSignupPage extends StatefulWidget {
  const CollectorSignupPage({super.key});

  @override
  State<CollectorSignupPage> createState() => _CollectorSignupPageState();
}

class _CollectorSignupPageState extends State<CollectorSignupPage> {
  final _formKey = GlobalKey<FormState>();

  // Controllers for text fields
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  // State for password visibility
  bool _isPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;

  // State for the Sign In/Sign Up toggle (true if Sign Up selected)
  bool _isSignUpSelected = true; // Default to Sign Up

  // --- Define Colors (estimated) ---
  static const Color pageBackgroundColor = Color(
    0xFFF0FBEF,
  ); // Very light green
  static const Color cardBackgroundColor = Colors.white;
  static const Color primaryColor = Color(
    0xFFB2E7AE,
  ); // Light green for buttons/selection
  static const Color primaryTextColor = Color(0xFF0a4e41); // Dark green text
  static const Color secondaryTextColor = Colors.black54; // Grey text
  static const Color toggleUnselectedColor = Colors.transparent;
  static const Color toggleSelectedTextColor = primaryTextColor;
  static const Color toggleUnselectedTextColor = secondaryTextColor;
  // --- End Colors ---

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _signup(CSignupModel CollectorModel) async {
    if (_formKey.currentState!.validate()) {
      final email = _emailController.text.trim();
      final password = _passwordController.text;
      final confirmPassword = _confirmPasswordController.text;

      // Show loading feedback
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Signing up...'),
          backgroundColor: Colors.blueAccent,
        ),
      );

      try {
        final uri = Uri.parse(
          'https://localhost:7061/api/CollectorSignUp/register',
        ); // 🔁 Replace with your API endpoint
        
        
        final response = await http.post(
        Uri.parse(uri.toString()),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({'gEmail': email, 'gPassword': password,"gConfirmPassword":confirmPassword}),
      );
        

        // final response = await http.post(
        //   uri,
        //   headers: {'Content-Type': 'application/json'},
        //   body: jsonEncode({'email': email, 'password': password,"confirmPassword":confirmPassword}),
        // );

        if (response.statusCode == 200 || response.statusCode == 201) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Signup successful!'),
              backgroundColor: Colors.green,
            ),
          );

          // Navigator.push(
          //   context,
          //   MaterialPageRoute(
          //     builder: (context) => CollectorCreateAccountPage(email: email),
          //   ),
          // );
        } else {
          final error = jsonDecode(response.body);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                'Signup failed: ${error['message'] ?? 'Unknown error'}',
              ),
              backgroundColor: Colors.redAccent,
            ),
          );
        }
      } catch (e) {
        print('Error: $e');
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error connecting to server: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please fix the errors in the form'),
          backgroundColor: Colors.orangeAccent,
        ),
      );
    }
  }

  // --- Navigation Helper (Example) ---
  void _navigateToSignIn() {
    // Option 1: If Sign In is the same page structure, just toggle state
    // setState(() {
    //   _isSignUpSelected = false;
    // });

    // Option 2: Navigate to a dedicated Sign In page
    // Use Navigator.pushReplacement if you don't want users going back to signup
    // Navigator.pushReplacementNamed(context, '/signin'); // Assuming you have routes defined
    // Or use a direct widget navigation
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const CollectorSignInPage()),
    );
    print("Navigate to Sign In page");
    // Temporary toggle for demo
    setState(() {
      _isSignUpSelected = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: pageBackgroundColor,
      body: Center(
        child: SingleChildScrollView(
          // Allows scrolling if content overflows
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
                mainAxisSize: MainAxisSize.min, // Fit content height
                children: [
                  // Sign In / Sign Up Toggle
                  _buildSignInSignUpToggle(),
                  const SizedBox(height: 30),

                  // Email Field
                  _buildTextField(
                    controller: _emailController,
                    labelText: 'Email',
                    keyboardType: TextInputType.emailAddress,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your email';
                      }
                      // Basic email format check
                      if (!RegExp(
                        r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+",
                      ).hasMatch(value)) {
                        return 'Please enter a valid email address';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),

                  // Password Field
                  _buildTextField(
                    controller: _passwordController,
                    labelText: 'Password',
                    obscureText: !_isPasswordVisible,
                    suffixIcon: IconButton(
                      icon: Icon(
                        _isPasswordVisible
                            ? Icons.visibility_off
                            : Icons.visibility,
                        color: secondaryTextColor,
                      ),
                      onPressed: () {
                        setState(() {
                          _isPasswordVisible = !_isPasswordVisible;
                        });
                      },
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your password';
                      }
                      if (value.length < 6) {
                        // Example: Minimum length
                        return 'Password must be at least 6 characters';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),

                  // Confirm Password Field
                  _buildTextField(
                    controller: _confirmPasswordController,
                    labelText: 'Confirm Password',
                    obscureText: !_isConfirmPasswordVisible,
                    suffixIcon: IconButton(
                      icon: Icon(
                        _isConfirmPasswordVisible
                            ? Icons.visibility_off
                            : Icons.visibility,
                        color: secondaryTextColor,
                      ),
                      onPressed: () {
                        setState(() {
                          _isConfirmPasswordVisible =
                              !_isConfirmPasswordVisible;
                        });
                      },
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please confirm your password';
                      }
                      if (value != _passwordController.text) {
                        return 'Passwords do not match';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 35),

                  // Sign Up Button
                  ElevatedButton(
                    onPressed:
                        () => _signup(
                          CSignupModel(
                            CollectorId:
                                0, // Assuming ID is auto-generated or not needed for signup
                            CollectorEmail: _emailController.text.trim(),
                            CollectorPassword: _passwordController.text,
                          ),
                        ),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primaryColor,
                      foregroundColor: primaryTextColor,
                      minimumSize: const Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30.0),
                      ),
                      elevation: 2,
                    ),
                    child: const Text(
                      'Sign up',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
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

  // Helper Widget for the Sign In/Sign Up Toggle
  Widget _buildSignInSignUpToggle() {
    return Container(
      height: 45,
      decoration: BoxDecoration(
        color: Colors.grey[200], // Background for the unselected area
        borderRadius: BorderRadius.circular(30.0),
      ),
      child: Row(
        children: [
          Expanded(
            child: GestureDetector(
              onTap: _navigateToSignIn, // Navigate or switch state to Sign In
              child: Container(
                decoration: BoxDecoration(
                  color:
                      !_isSignUpSelected ? primaryColor : toggleUnselectedColor,
                  borderRadius: BorderRadius.circular(30.0),
                ),
                alignment: Alignment.center,
                child: Text(
                  'Sign In',
                  style: TextStyle(
                    color:
                        !_isSignUpSelected
                            ? toggleSelectedTextColor
                            : toggleUnselectedTextColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: GestureDetector(
              onTap: () {
                // Already on Sign Up, or toggle back if needed
                if (!_isSignUpSelected) {
                  setState(() {
                    _isSignUpSelected = true;
                  });
                }
              },
              child: Container(
                decoration: BoxDecoration(
                  color:
                      _isSignUpSelected ? primaryColor : toggleUnselectedColor,
                  borderRadius: BorderRadius.circular(30.0),
                ),
                alignment: Alignment.center,
                child: Text(
                  'Sign Up',
                  style: TextStyle(
                    color:
                        _isSignUpSelected
                            ? toggleSelectedTextColor
                            : toggleUnselectedTextColor,
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

  // Helper Widget for TextFields with Underline Border
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
        // Underline border style
        border: const UnderlineInputBorder(
          borderSide: BorderSide(color: Colors.grey),
        ),
        enabledBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: Colors.grey),
        ),
        focusedBorder: const UnderlineInputBorder(
          borderSide: BorderSide(
            color: primaryTextColor,
            width: 1.5,
          ), // Highlight focus
        ),
        errorBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: Colors.redAccent, width: 1.0),
        ),
        focusedErrorBorder: const UnderlineInputBorder(
          borderSide: BorderSide(color: Colors.redAccent, width: 1.5),
        ),
        contentPadding: const EdgeInsets.only(
          top: 10.0,
          bottom: 5.0,
        ), // Adjust padding
      ),
      validator: validator,
      autovalidateMode:
          AutovalidateMode.onUserInteraction, // Validate on change
    );
  }
}
