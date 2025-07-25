import 'package:flutter/material.dart';
import 'package:growersignup/sreens/grower_home_page.dart';

class GrowerSignInSuccessPage extends StatelessWidget {
  const GrowerSignInSuccessPage({super.key});

  // --- Define Colors (reuse from sign in page or define specifically) ---
  static const Color pageBackgroundColor = Color(0xFFF0FBEF); // Very light green
  static const Color textColor = Color(0xFF0a4e41); // Dark green/teal
  static const Color buttonColor = Color(0xFF0a4e41);
  static const Color buttonTextColor = Colors.white;
  // --- End Colors ---

  @override
  Widget build(BuildContext context) {
    // Prevent user from accidentally swiping back (optional)
    return PopScope(
      canPop: false, // Prevents back button/gesture until 'Continue' is pressed
      child: Scaffold(
        backgroundColor: pageBackgroundColor,
        body: Center( // Center the content
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 40.0), // Horizontal padding
            child: Column(
              mainAxisSize: MainAxisSize.min, // Column takes minimum height
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Confirmation Text
                Text(
                  'You have been signed\nin successfully.', // Use \n for line break
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 22, // Slightly smaller font size than previous example
                    fontWeight: FontWeight.w500,
                    color: textColor,
                    height: 1.4, // Line spacing
                  ),
                ),
                const SizedBox(height: 35), // Space between text and button

                // Continue Button
                ElevatedButton(
                  onPressed: () {
                    // --- TODO: Implement Navigation Logic ---
                    // Navigate to the main part of the app, clearing the auth stack.
                    // Inside _signIn() after successful API call & token storage...
                    Navigator.of(context).pushReplacement( // Use pushReplacement
                      MaterialPageRoute(builder: (context) => const GrowerHomePage()),
                    );
                    print('Continue button tapped - navigating to main app.');
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: buttonColor,
                    foregroundColor: buttonTextColor,
                    minimumSize: const Size(double.infinity, 50), // Full width within padding
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30.0), // Pill shape
                    ),
                    elevation: 2,
                  ),
                  child: const Text(
                    'Continue',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}