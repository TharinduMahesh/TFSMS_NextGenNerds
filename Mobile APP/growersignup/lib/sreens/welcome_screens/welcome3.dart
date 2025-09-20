import 'dart:ui'; // Required for ImageFilter.blur
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:growersignup/assets/constants/contant_colors.dart';
import 'package:growersignup/sreens/welcome_screens/welcome4.dart';

class WelcomePage3 extends StatefulWidget {
  // button press
  final VoidCallback? onAcceptPressed;

  const WelcomePage3({super.key, this.onAcceptPressed});

  @override
  State<WelcomePage3> createState() => _WelcomePage3State();
}

class _WelcomePage3State extends State<WelcomePage3> {
  // terms text
  final String termsText = """
Registered collectors affiliated with the factory, dealers accredited by the Sri Lanka Tea Board, and recognized tea growers are eligible to register as suppliers.

To qualify, they must demonstrate the capacity to meet the predefined specifications and quality standards set forth by the respective factory and the Sri Lanka Tea Board.
""";

  // --- Define Colors (adjust as needed) ---
  static const double frostedOpacity = 0.35; // Opacity for the frosted effect
  static const double blurSigma = 5.0; // Amount of blur for the frosted effect

  @override
  void initState() {
    super.initState();
    _checkTermsAccepted();
  }

  // Check if terms are already accepted and skip if true
  Future<void> _checkTermsAccepted() async {
    final prefs = await SharedPreferences.getInstance();
    final bool termsAccepted = prefs.getBool('terms_accepted') ?? false;
    
    if (termsAccepted && mounted) {
      // Terms already accepted, skip to next page
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const WelcomePage4()),
      );
    }
  }

  // Save terms acceptance status
  Future<void> _acceptTerms() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('terms_accepted', true);
    
    // Call the callback if provided
    if (widget.onAcceptPressed != null) {
      widget.onAcceptPressed!();
    }
    
    // Navigate to next page
    if (mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const WelcomePage4()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          // 1. Background Image (Same as previous pages)
          Image.asset(
            'lib/assets/images/tea.png', // *** YOUR IMAGE PATH ***
            fit: BoxFit.cover,
            // No extra overlay needed here as the frosted box provides contrast
          ),

          // 2. Content Column
          SafeArea( // Ensures content avoids notches/system bars if image goes behind
            child: Padding(
              padding: EdgeInsets.symmetric(
                horizontal: screenWidth * 0.08,
                vertical: screenHeight * 0.03, // Adjust vertical padding if needed
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  const Spacer(flex: 1), // Adjust spacing

                  // "Terms of Service" Title
                  const Text(
                    'Terms of Service',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: primaryTextColor,
                      fontSize: 30.0,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 20.0),

                  // Frosted Glass Container for Terms
                  _buildFrostedTermsBox(context),

                  const Spacer(flex: 2),

                  // Accept & Continue Button
                  ElevatedButton(
                    onPressed: _acceptTerms, // Use the new method
                    style: ElevatedButton.styleFrom(
                      backgroundColor: secondaryTextColor,
                      foregroundColor: primaryTextColor,
                      minimumSize: Size(screenWidth * 0.8, 50), 
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10.0),
                      ),
                      elevation: 3,
                    ),
                    child: const Text(
                      'Accept & Continue',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(height: 20.0), // Space below button

                  // Page Indicator (matching WelcomePage1 style)
                  _buildPageIndicator(),

                  SizedBox(height: screenHeight * 0.03), // Bottom padding
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Page Indicator matching WelcomePage1 style
  Widget _buildPageIndicator() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(4, (index) {
        return Container(
          width: index == 1 ? 20 : 8, // Page 3 is active (index 2)
          height: 8,
          margin: const EdgeInsets.symmetric(horizontal: 4),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(4),
            color: index == 1 
                ? Colors.white 
                : Colors.white.withOpacity(0.4),
          ),
        );
      }),
    );
  }

  // --- Helper Widget for the Frosted Glass Terms Box ---
  Widget _buildFrostedTermsBox(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return ClipRRect( // Clip the blur effect to the rounded corners
      borderRadius: BorderRadius.circular(20.0),
      child: BackdropFilter( // Apply the blur effect
        filter: ImageFilter.blur(sigmaX: blurSigma, sigmaY: blurSigma),
        child: Container(
          width: screenWidth * 0.85, // 85% of screen width
          // Constrain the height to prevent it from taking too much space
          // Allows the SingleChildScrollView to work correctly
          constraints: BoxConstraints(
            maxHeight: screenHeight * 0.45, // Max 45% of screen height
          ),
          padding: const EdgeInsets.all(20.0),
          decoration: BoxDecoration(
            color: secondaryTextColor.withOpacity(frostedOpacity),
            borderRadius: BorderRadius.circular(20.0),
            // Optional: Add a subtle border
            // border: Border.all(color: Colors.white.withOpacity(0.2))
          ),
          child: SingleChildScrollView( // Make the content scrollable
            child: Text(
              termsText,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: blackTextColor, // Darker text for better contrast
                fontSize: 15.0,
                height: 1.5, // Line spacing
              ),
            ),
          ),
        ),
      ),
    );
  }
}