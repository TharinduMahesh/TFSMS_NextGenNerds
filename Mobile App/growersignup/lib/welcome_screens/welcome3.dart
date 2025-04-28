import 'dart:ui'; // Required for ImageFilter.blur
import 'package:flutter/material.dart';
import 'package:growersignup/welcome_screens/welcome4.dart';

class WelcomePage3 extends StatelessWidget {
  // Optional: Callback for the 'Accept' button press
  final VoidCallback? onAcceptPressed;

  // Placeholder for your actual terms text
  final String termsText = """
Registered collectors affiliated with the factory, dealers accredited by the Sri Lanka Tea Board, and recognized tea growers are eligible to register as suppliers.

To qualify, they must demonstrate the capacity to meet the predefined specifications and quality standards set forth by the respective factory and the Sri Lanka Tea Board.
"""; // Replace with your full terms

  // --- Define Colors (adjust as needed) ---
  static const Color titleColor = Color(0xFFE0E0E0); // Light grey/off-white estimate for title
  static const Color termsTextColor = Color(0xFF333333); // Dark grey for terms text
  static const Color frostedBackgroundColor = Colors.white; // Base color for the frosted box
  static const double frostedOpacity = 0.35; // Opacity for the frosted effect
  static const double blurSigma = 5.0; // Amount of blur for the frosted effect

  // Button/Indicator colors (reuse from previous pages)
  static const Color acceptButtonBackgroundColor = Color(0xFFc8e6c9);
  static const Color acceptButtonTextColor = Color(0xFF0a4e41);
  static const Color activeIndicatorColor = Colors.white;
  static const Color inactiveIndicatorColor = Colors.white54;
  // --- End Colors ---

  const WelcomePage3({super.key, this.onAcceptPressed});

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
                      color: titleColor,
                      fontSize: 30.0,
                      fontWeight: FontWeight.bold,
                       shadows: [ // Optional shadow for better visibility
                         Shadow(
                           blurRadius: 8.0,
                           color: Colors.black54,
                           offset: Offset(1.0, 1.0),
                         ),
                       ],
                    ),
                  ),
                  const SizedBox(height: 20.0), // Space before terms box

                  // Frosted Glass Container for Terms
                  _buildFrostedTermsBox(context),

                  const Spacer(flex: 2), // Adjust spacing

                  // Accept & Continue Button
                  ElevatedButton(
                    onPressed: () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => const WelcomePage4()));
                      print('Accept & Continue button tapped!');
                       
                       // Add navigation logic here
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: acceptButtonBackgroundColor,
                      foregroundColor: acceptButtonTextColor,
                      minimumSize: Size(screenWidth * 0.7, 50), // Slightly wider text
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30.0),
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

                  // Page Indicator (Highlighting the third dot - index 2)
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(5, (index) { // Assuming 5 total pages
                      return Container(
                        width: 8.0,
                        height: 8.0,
                        margin: const EdgeInsets.symmetric(horizontal: 4.0),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          // Highlight dot at index 2 for page 3
                          color: index == 2 ? activeIndicatorColor : inactiveIndicatorColor,
                        ),
                      );
                    }),
                  ),
                  SizedBox(height: screenHeight * 0.03), // Bottom padding
                ],
              ),
            ),
          ),
        ],
      ),
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
            color: frostedBackgroundColor.withOpacity(frostedOpacity),
            borderRadius: BorderRadius.circular(20.0),
            // Optional: Add a subtle border
            // border: Border.all(color: Colors.white.withOpacity(0.2))
          ),
          child: SingleChildScrollView( // Make the content scrollable
            child: Text(
              termsText,
              textAlign: TextAlign.center,
              style: const TextStyle(
                color: termsTextColor,
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