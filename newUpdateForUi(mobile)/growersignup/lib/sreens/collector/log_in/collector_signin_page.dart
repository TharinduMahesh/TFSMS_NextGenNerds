import 'package:flutter/material.dart';
import 'package:growersignup/sreens/collector/home_pages/collector_home_page.dart';
import 'package:growersignup/sreens/collector/log_in/collector_signup.dart';

class CollectorSignInPage extends StatefulWidget {
  const CollectorSignInPage({super.key});

  @override
  State<CollectorSignInPage> createState() => _CollectorSignInPageState();
}

class _CollectorSignInPageState extends State<CollectorSignInPage> {
  final _formKey = GlobalKey<FormState>();

  // Controllers
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  bool _isPasswordVisible = false;
  bool _isSignInSelected = true;

  // Colors
  static const Color pageBackgroundColor = Color(0xFFF0FBEF);
  static const Color cardBackgroundColor = Colors.white;
  static const Color primaryColor = Color(0xFFB2E7AE);
  static const Color primaryTextColor = Color(0xFF0A4E41);
  static const Color secondaryTextColor = Colors.black54;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _signIn() async {
    if (_formKey.currentState!.validate()) {
      final email = _emailController.text.trim();

      //navigate next page
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => CollectorHomePage(email: email,)),
      );

      // TEMPORARY SIMULATED RESPONSE
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('Sign In successful (simulated)!'),
        backgroundColor: Colors.green,
      ));
    }
  }

  void _navigateToSignUp() {
    // Replace with real navigation
    Navigator.push(context, MaterialPageRoute(builder: (_) => const CollectorSignupPage()));
    print("Navigate to Sign Up page");
  }

  void _navigateToForgotPassword() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Forgot Password flow not implemented yet'),
        backgroundColor: Colors.grey,
      ),
    );
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
                      if (value == null || value.trim().isEmpty) {
                        return 'Please enter your email';
                      }
                      if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
                        return 'Invalid email format';
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
                        _isPasswordVisible
                            ? Icons.visibility_off_outlined
                            : Icons.visibility_outlined,
                        size: 20,
                        color: secondaryTextColor,
                      ),
                      onPressed: () {
                        setState(() => _isPasswordVisible = !_isPasswordVisible);
                      },
                    ),
                    validator: (value) =>
                        value == null || value.isEmpty ? 'Enter password' : null,
                  ),
                  const SizedBox(height: 10),
                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: _navigateToForgotPassword,
                      child: const Text(
                        'Forgot password?',
                        style: TextStyle(
                          color: primaryTextColor,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: _signIn,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primaryColor,
                      foregroundColor: primaryTextColor,
                      minimumSize: const Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30.0)),
                      elevation: 2,
                    ),
                    child: const Text(
                      'Sign In',
                      style:
                          TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(height: 30),
                  _buildOrSeparator(),
                  const SizedBox(height: 20),
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
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Row(
        children: [
          Expanded(
            child: GestureDetector(
              onTap: () =>
                  setState(() => _isSignInSelected = true),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                decoration: BoxDecoration(
                  color: _isSignInSelected ? primaryColor : Colors.transparent,
                  borderRadius: BorderRadius.circular(30.0),
                ),
                alignment: Alignment.center,
                child: Text(
                  'Sign In',
                  style: TextStyle(
                    color: _isSignInSelected
                        ? primaryTextColor
                        : secondaryTextColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ),
          Expanded(
            child: GestureDetector(
              onTap: _navigateToSignUp,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                decoration: BoxDecoration(
                  color: !_isSignInSelected ? primaryColor : Colors.transparent,
                  borderRadius: BorderRadius.circular(30.0),
                ),
                alignment: Alignment.center,
                child: Text(
                  'Sign Up',
                  style: TextStyle(
                    color: !_isSignInSelected
                        ? primaryTextColor
                        : secondaryTextColor,
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
      validator: validator,
      autovalidateMode: AutovalidateMode.onUserInteraction,
      decoration: InputDecoration(
        labelText: labelText,
        labelStyle:
            const TextStyle(color: secondaryTextColor, fontSize: 14),
        suffixIcon: suffixIcon,
        enabledBorder: const UnderlineInputBorder(
            borderSide: BorderSide(color: Colors.grey)),
        focusedBorder: const UnderlineInputBorder(
            borderSide: BorderSide(color: primaryTextColor, width: 1.5)),
        errorBorder: const UnderlineInputBorder(
            borderSide: BorderSide(color: Colors.redAccent)),
        focusedErrorBorder: const UnderlineInputBorder(
            borderSide: BorderSide(color: Colors.redAccent, width: 1.5)),
      ),
    );
  }

  Widget _buildOrSeparator() {
    return Row(
      children: [
        const Expanded(child: Divider(thickness: 0.8)),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12.0),
          child: Text(
            'or',
            style: TextStyle(
                color: secondaryTextColor.withOpacity(0.8), fontSize: 13),
          ),
        ),
        const Expanded(child: Divider(thickness: 0.8)),
      ],
    );
  }
}
