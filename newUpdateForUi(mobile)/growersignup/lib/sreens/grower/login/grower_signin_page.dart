import 'package:flutter/material.dart';
import 'package:growersignup/models/grower/g_signin_model.dart';
import 'package:growersignup/services/grower/grower_signin_api.dart';
import 'package:growersignup/sreens/grower/home_pages/grower_home_page.dart';
import 'package:growersignup/sreens/grower/login/grower_forgotpassword_page.dart';
import 'package:growersignup/sreens/grower/login/grower_signup.dart';


class GrowerSignInPage extends StatefulWidget {
  const GrowerSignInPage({super.key});

  @override
  State<GrowerSignInPage> createState() => _GrowerSignInPageState();
}

class _GrowerSignInPageState extends State<GrowerSignInPage> {
  final _formKey = GlobalKey<FormState>();

  // Controllers
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  // State
  bool _isPasswordVisible = false;
  bool _isSignInSelected = true; // Default to Sign In selected

  // Colors 
  static const Color pageBackgroundColor = Color(0xFFF0FBEF); // Very light green
  static const Color cardBackgroundColor = Colors.white;
  static const Color primaryColor = Color(0xFFB2E7AE); // Light green buttons/selection
  static const Color primaryTextColor = Color(0xFF0a4e41); // Dark green text
  static const Color secondaryTextColor = Colors.black54;
  static const Color toggleUnselectedColor = Colors.transparent;
  static const Color toggleSelectedTextColor = primaryTextColor;
  static const Color toggleUnselectedTextColor = secondaryTextColor;
  static const Color forgotPasswordColor = primaryTextColor; // Or a blue link color



  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
  void _signIn() async {
    if (_formKey.currentState?.validate() ?? false) {
      // Create a GSigninModel object with the data from the text controllers
      GSigninModel gSigninModel = GSigninModel(
        email: _emailController.text,
        password: _passwordController.text,
      );

      try {
        // Call the sign-in API
        String? signInResult = await GSigninApi.growersignnp(gSigninModel);

        // If successful, show success message or navigate to another page
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Sign in successful!')));
        print('Sign in successful: $signInResult'); // Debugging output

        // Navigate to another page if needed
        Navigator.push(context, MaterialPageRoute(builder: (context) => GrowerHomePage(email: _emailController.text,)));
      } catch (e) {
        // Handle error if the API call fails
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Failed to sign in: $e')));
      }
    }
}


  // --- Navigation Helpers ---
  void _navigateToSignUp() {
     Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => GrowerSignupPage()), // Replace with your sign up page
      );
    print("Navigate to Sign Up page");
  }

  void _navigateToForgotPassword() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const ForgotPasswordPage()),
    );
    print("Navigate to Forgot Password page");
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
                  // Sign In / Sign Up Toggle
                  _buildSignInSignUpToggle(),
                  const SizedBox(height: 35),

                  // Email Field
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

                  // Password Field
                  _buildTextField(
                    controller: _passwordController,
                    labelText: 'Password',
                    obscureText: !_isPasswordVisible,
                    suffixIcon: IconButton(
                      icon: Icon(
                        _isPasswordVisible ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                        color: secondaryTextColor, size: 20,
                      ),
                       splashRadius: 20,
                      onPressed: () => setState(() => _isPasswordVisible = !_isPasswordVisible),
                    ),
                     validator: (value) {
                       if (value == null || value.isEmpty) return 'Please enter your password';
                       return null;
                     },
                  ),
                  const SizedBox(height: 8),

                  // Forgot Password Link

                  Align(
                    alignment: Alignment.centerRight,
                    child: TextButton(
                      onPressed: _navigateToForgotPassword,
                      style: TextButton.styleFrom(
                         padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 0),
                         tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                         minimumSize: Size.zero,
                      ),
                      child: const Text(
                        'Forgot password?',
                        style: TextStyle(
                          color: forgotPasswordColor, fontSize: 12, fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 25),

                  // Sign In Button
                  ElevatedButton(
                    onPressed: _signIn,
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
                      'Sign In',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(height: 30),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  // --- Helper Widgets (Same as before) ---

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
                onTap: () { if (!_isSignInSelected) setState(() => _isSignInSelected = true); },
                child: Container(
                  decoration: BoxDecoration(
                    color: _isSignInSelected ? primaryColor : toggleUnselectedColor,
                    borderRadius: BorderRadius.circular(30.0),
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    'Sign In',
                    style: TextStyle(
                      color: _isSignInSelected ? toggleSelectedTextColor : toggleUnselectedTextColor,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ),
            Expanded(
              child: GestureDetector(
                onTap: _navigateToSignUp,
                child: Container(
                  decoration: BoxDecoration(
                     color: !_isSignInSelected ? primaryColor : toggleUnselectedColor,
                     borderRadius: BorderRadius.circular(30.0),
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    'Sign up', // Match screenshot text
                    style: TextStyle(
                       color: !_isSignInSelected ? toggleSelectedTextColor : toggleUnselectedTextColor,
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
     required TextEditingController controller, required String labelText,
     TextInputType keyboardType = TextInputType.text, bool obscureText = false,
     Widget? suffixIcon, String? Function(String?)? validator,
   }) {
     return TextFormField(
        controller: controller, keyboardType: keyboardType, obscureText: obscureText,
        decoration: InputDecoration(
          labelText: labelText, labelStyle: const TextStyle(color: secondaryTextColor, fontSize: 14),
          suffixIcon: suffixIcon,
          border: const UnderlineInputBorder(borderSide: BorderSide(color: Colors.grey)),
          enabledBorder: const UnderlineInputBorder(borderSide: BorderSide(color: Colors.grey)),
          focusedBorder: const UnderlineInputBorder(borderSide: BorderSide(color: primaryTextColor, width: 1.5)),
          errorBorder: const UnderlineInputBorder(borderSide: BorderSide(color: Colors.redAccent, width: 1.0)),
          focusedErrorBorder: const UnderlineInputBorder(borderSide: BorderSide(color: Colors.redAccent, width: 1.5)),
          contentPadding: const EdgeInsets.only(top: 10.0, bottom: 8.0),
        ),
        validator: validator,
        autovalidateMode: AutovalidateMode.onUserInteraction,
      );
    }
}
