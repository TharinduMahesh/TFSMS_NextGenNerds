import 'package:flutter/material.dart';

class GrowerOrderSavedPage extends StatelessWidget {
  const GrowerOrderSavedPage({super.key});

  // --- Define Colors (reuse from GrowerOrderPage or define specifically) ---
  static const Color pageBackgroundColor = Color(0xFFF8FDEF); // Very light green/beige
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
        body: Center( // Center the content vertically and horizontally
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 40.0), // Add horizontal padding
            child: Column(
              mainAxisSize: MainAxisSize.min, // Take up minimum vertical space needed
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // Confirmation Text
                Text(
                  'Got your harvest\ndetails.', // Use \n for line break
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 24, // Adjust size as needed
                    fontWeight: FontWeight.w500, // Medium weight
                    color: textColor,
                    height: 1.4, // Adjust line spacing if needed
                  ),
                ),
                const SizedBox(height: 35), // Space between text and button

                // Continue Button
                ElevatedButton(
                  onPressed: () {
                    // --- TODO: Implement Navigation Logic ---
                    // Decide where the user should go next.
                    // Option 1: Go back one step (if the form was pushed on top)
                     Navigator.of(context).pop();

                    // Option 2: Pop until the home screen or dashboard
                    // Navigator.of(context).popUntil((route) => route.isFirst);

                    // Option 3: Navigate to a specific named route, clearing the stack
                    // Navigator.of(context).pushNamedAndRemoveUntil('/home', (route) => false);

                    print('Continue button tapped - navigating away.');
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: buttonColor,
                    foregroundColor: buttonTextColor,
                    minimumSize: const Size(double.infinity, 50), // Make button wide within padding
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30.0), // Pill shape
                    ),
                    elevation: 2, // Slight shadow
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