import 'package:flutter/material.dart';
import 'package:growersignup/sreens/grower/home_pages/grower_home_page.dart';

class GrowerSignInSuccessPage extends StatelessWidget {
  final String name; // Optional, if you need to pass name or other data
  final String email; // Optional, if you need to pass email or other data
  const GrowerSignInSuccessPage({super.key, required this.email,required this.name});

  // Define Colors 
  static const Color pageBackgroundColor = Color(0xFFF0FBEF); // Very light green
  static const Color textColor = Color(0xFF0a4e41); // Dark green/teal
  static const Color buttonColor = Color(0xFF0a4e41);
  static const Color buttonTextColor = Colors.white;

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false, 
      child: Scaffold(
        backgroundColor: pageBackgroundColor,
        body: Center( 
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 40.0), 
            child: Column(
              mainAxisSize: MainAxisSize.min, 
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(
                  'You have been signed\nin successfully.', 
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 22, 
                    fontWeight: FontWeight.w500,
                    color: textColor,
                    height: 1.4, 
                  ),
                ),
                const SizedBox(height: 35), 

                // Continue Button
                ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).pushReplacement( 
                      MaterialPageRoute(builder: (context) => GrowerHomePage(email: email,)),
                    );
                    print('Continue button tapped - navigating to main app.');
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: buttonColor,
                    foregroundColor: buttonTextColor,
                    minimumSize: const Size(double.infinity, 50), 
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30.0), 
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