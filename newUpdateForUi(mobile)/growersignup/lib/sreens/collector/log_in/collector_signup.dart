import 'package:flutter/material.dart';
import 'package:growersignup/models/collector/c_signup_model.dart';
import 'package:growersignup/services/collector/collector_signup_api.dart';
import 'package:growersignup/sreens/collector/log_in/collector_account_page.dart';
import 'package:growersignup/sreens/collector/log_in/collector_signin_page.dart'; 

class CollectorSignupPage extends StatefulWidget {
  const CollectorSignupPage({super.key});

  @override
  State<CollectorSignupPage> createState() => _CollectorSignupPageState();
}

class _CollectorSignupPageState extends State<CollectorSignupPage> {
  final _formKey = GlobalKey<FormState>();

  // Controllers
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  // State
  bool _isPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;
  bool _isSignUpSelected = true; // Default to Sign Up selected
  bool _isLoading = false;

  static const Color pageBackgroundColor = Color(0xFFF0FBEF);
  static const Color cardBackgroundColor = Colors.white;
  static const Color primaryColor = Color(0xFFB2E7AE);
  static const Color primaryTextColor = Color(0xFF0a4e41);
  static const Color secondaryTextColor = Colors.black54;
  static const Color toggleSelectedTextColor = primaryTextColor;
  static const Color toggleUnselectedTextColor = secondaryTextColor;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _signUp() async {
    if (!_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please fix the errors in the form'),
          backgroundColor: Colors.orangeAccent,
        ),
      );
      return;
    }

    setState(() => _isLoading = true);

    final dto = CRegisterDto(
      cEmail: _emailController.text.trim(),
      cPassword: _passwordController.text,
      cConfirmPassword: _confirmPasswordController.text,
    );

    try {
      final result = await CollectorAuthService.registerCollector(dto);

      if (result == "Registered successfully." || result == "Registered successfully") {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Signup successful! Please proceed.'),
            backgroundColor: Colors.green,
          ),
        );

        // TODO: Navigate to next page for Collector details input
        Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => CollectorAccountCreatePage1(email: _emailController.text.trim(),)));

      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Signup failed: $result'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Signup failed: $e'),
          backgroundColor: Colors.redAccent,
        ),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _navigateToSignIn() {
    // TODO: Implement navigation to Collector Sign In page
    Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => CollectorSignInPage()));
    print("Navigate to Sign In page");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: pageBackgroundColor,
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 40.0),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 30.0),
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
                  const SizedBox(height: 35),
                  _buildTextField(
                    controller: _emailController,
                    labelText: 'Email',
                    keyboardType: TextInputType.emailAddress,
                    validator: (value) {
                      if (value == null || value.isEmpty) return 'Please enter your email';
                      if (!RegExp(r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+").hasMatch(value)) {
                        return 'Please enter a valid email address';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),
                  _buildTextField(
                    controller: _passwordController,
                    labelText: 'Password',
                    obscureText: !_isPasswordVisible,
                    suffixIcon: IconButton(
                      icon: Icon(
                        _isPasswordVisible ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                        color: secondaryTextColor,
                        size: 20,
                      ),
                      splashRadius: 20,
                      onPressed: () => setState(() => _isPasswordVisible = !_isPasswordVisible),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) return 'Please enter your password';
                      if (value.length < 6) return 'Password must be at least 6 characters';
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),
                  _buildTextField(
                    controller: _confirmPasswordController,
                    labelText: 'Confirm Password',
                    obscureText: !_isConfirmPasswordVisible,
                    suffixIcon: IconButton(
                      icon: Icon(
                        _isConfirmPasswordVisible ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                        color: secondaryTextColor,
                        size: 20,
                      ),
                      splashRadius: 20,
                      onPressed: () => setState(() => _isConfirmPasswordVisible = !_isConfirmPasswordVisible),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) return 'Please confirm your password';
                      if (value != _passwordController.text) return 'Passwords do not match';
                      return null;
                    },
                  ),
                  const SizedBox(height: 35),
                  _isLoading
                      ? const CircularProgressIndicator()
                      : ElevatedButton(
                          onPressed: _signUp,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: primaryColor,
                            foregroundColor: primaryTextColor,
                            minimumSize: const Size(double.infinity, 50),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30.0)),
                            elevation: 2,
                          ),
                          child: const Text(
                            'Sign up',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                        ),
                  const SizedBox(height: 30),
                  _buildOrSeparator(),
                  const SizedBox(height: 30),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSignInSignUpToggle() {
    return Container(
      height: 45,
      decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(30.0),
          border: Border.all(color: Colors.grey.shade300, width: 1.0)),
      child: Row(
        children: [
          Expanded(
            child: GestureDetector(
              onTap: _navigateToSignIn,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                decoration: BoxDecoration(
                  color: !_isSignUpSelected ? primaryColor : Colors.transparent,
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
              onTap: () {
                if (!_isSignUpSelected) setState(() => _isSignUpSelected = true);
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                decoration: BoxDecoration(
                  color: _isSignUpSelected ? primaryColor : Colors.transparent,
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
        labelStyle: TextStyle(color: secondaryTextColor, fontSize: 14),
        suffixIcon: suffixIcon,
        border: const UnderlineInputBorder(borderSide: BorderSide(color: Colors.grey)),
        enabledBorder: const UnderlineInputBorder(borderSide: BorderSide(color: Colors.grey)),
        focusedBorder: UnderlineInputBorder(borderSide: BorderSide(color: primaryTextColor, width: 1.5)),
        errorBorder: const UnderlineInputBorder(borderSide: BorderSide(color: Colors.redAccent, width: 1.0)),
        focusedErrorBorder: const UnderlineInputBorder(borderSide: BorderSide(color: Colors.redAccent, width: 1.5)),
        contentPadding: const EdgeInsets.only(top: 10.0, bottom: 8.0),
      ),
      validator: validator,
      autovalidateMode: AutovalidateMode.onUserInteraction,
    );
  }

  Widget _buildOrSeparator() {
    return Row(
      children: [
        const Expanded(child: Divider(thickness: 0.8)),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12.0),
          child: Text('or', style: TextStyle(color: secondaryTextColor.withOpacity(0.8), fontSize: 13)),
        ),
        const Expanded(child: Divider(thickness: 0.8)),
      ],
    );
  }
}
