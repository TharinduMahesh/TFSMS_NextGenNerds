import 'package:flutter/material.dart';

class WelcomeCollectorPage extends StatelessWidget {
  // Callback for the 'Let's Start' button press
  final VoidCallback? onStartPressed;

  // --- Define Colors (reuse/adjust) ---
  static const Color primaryTextColor = Color(0xFFFAFAFA); // Off-white for main text
  static const Color secondaryTextColor = Color(0xFFE0E0E0); // Lighter gray for "Let's start"
  // Button colors
  static const Color startButtonBackgroundColor = Color(0xFFc8e6c9);
  static const Color startButtonTextColor = Color(0xFF0a4e41);
  // Indicator colors
  static const Color activeIndicatorColor = Colors.white;
  static const Color inactiveIndicatorColor = Colors.white54;
  // --- End Colors ---


  const WelcomeCollectorPage({super.key, this.onStartPressed});

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          // 1. Background Image
          Image.asset(
            'lib/assets/images/tea.png', // *** YOUR IMAGE PATH ***
            fit: BoxFit.cover,
             color: Colors.black.withOpacity(0.3), // Apply consistent overlay
             colorBlendMode: BlendMode.darken,
          ),

          // 2. Content Column
          Padding(
            padding: EdgeInsets.symmetric(
              horizontal: screenWidth * 0.08,
              vertical: screenHeight * 0.05,
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const Spacer(flex: 2), // Adjust spacing

                // "Let's start" Text
                const Text(
                  "Let's start",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: secondaryTextColor,
                    fontSize: 18.0,
                    fontWeight: FontWeight.w500, // Medium weight
                  ),
                ),
                const SizedBox(height: 8.0), // Space between text lines

                // "As a Supplier" Text
                const Text(
                  'As a Supplier',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: primaryTextColor,
                    fontSize: 36.0, // Larger size
                    fontWeight: FontWeight.bold,
                     shadows: [ // Optional shadow for better contrast
                       Shadow(
                         blurRadius: 8.0,
                         color: Colors.black54,
                         offset: Offset(1.0, 1.0),
                       ),
                     ],
                  ),
                ),

                const Spacer(flex: 3), // Pushes button down

                // Let's Start Button
                ElevatedButton(
                  onPressed: onStartPressed ?? () {
                     print('Let\'s Start button tapped! (Supplier)');
                     // Add navigation logic to Supplier Login/Signup or Main App
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: startButtonBackgroundColor,
                    foregroundColor: startButtonTextColor,
                    minimumSize: Size(screenWidth * 0.6, 50),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30.0),
                    ),
                    elevation: 3,
                  ),
                  child: const Text(
                    "Let's Start",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(height: 20.0), // Space below button

                // Page Indicator (Highlighting the last dot - index 4)
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(5, (index) { // Assuming 5 total pages
                    return Container(
                      width: 8.0,
                      height: 8.0,
                      margin: const EdgeInsets.symmetric(horizontal: 4.0),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        // Highlight dot at index 4 for page 5
                        color: index == 4 ? activeIndicatorColor : inactiveIndicatorColor,
                      ),
                    );
                  }),
                ),
                 SizedBox(height: screenHeight * 0.05), // Bottom padding
              ],
            ),
          ),
        ],
      ),
    );
  }
}