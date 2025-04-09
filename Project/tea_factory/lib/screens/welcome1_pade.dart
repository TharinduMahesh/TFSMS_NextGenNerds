import 'package:flutter/material.dart';
import 'package:tea_factory/screens/welcome2_pagr.dart';

class WelcomePage1 extends StatelessWidget {
  // Optional: Add a callback for the 'Next' button press
  final VoidCallback? onNextPressed;

  const WelcomePage1({super.key, this.onNextPressed});

  @override
  Widget build(BuildContext context) {
    // Define colors (adjust these to match your design exactly)
    const Color primaryTextColor = Color(0xFF0a4e41); // Dark green/teal estimate
    const Color secondaryTextColor = Color(0xFFFAFAFA); // Off-white for "Get ready for"
    const Color buttonBackgroundColor = Color(0xFFc8e6c9); // Light green estimate
    const Color buttonTextColor = primaryTextColor;
    const Color activeIndicatorColor = Colors.white;
    const Color inactiveIndicatorColor = Colors.white54;

    // Get screen size for responsive padding/margins if needed
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      // Set extendBodyBehindAppBar to true if you want the image
      // to go behind the system status bar (time, battery icon etc.)
      // extendBodyBehindAppBar: true,
      // appBar: AppBar(
      //   backgroundColor: Colors.transparent, // Make app bar transparent
      //   elevation: 0, // Remove shadow
      // ),
      body: Stack(
        fit: StackFit.expand, // Make stack children fill the screen
        children: [
          // 1. Background Image
          Image.asset(
            'lib/assets/images/tea.png', // *** YOUR IMAGE PATH ***
            fit: BoxFit.cover, // Cover the entire screen
            // Optional: Add color blend mode for overlay effect
            color: Colors.black.withOpacity(0.3), // Add a slight dark overlay
            colorBlendMode: BlendMode.darken,
          ),

          // 2. Content Column (Text, Button, Indicator)
          Padding(
            padding: EdgeInsets.symmetric(
              horizontal: screenWidth * 0.08, // 8% horizontal padding
              vertical: screenHeight * 0.05, // 5% vertical padding
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center, // Center vertically
              crossAxisAlignment: CrossAxisAlignment.center, // Center horizontally
              children: [
                // Spacer to push content down from the top
                const Spacer(flex: 2), // Adjust flex for positioning

                // "Get ready for" Text
                const Text(
                  'Get ready for',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: secondaryTextColor,
                    fontSize: 18.0,
                    fontWeight: FontWeight.w500, // Medium weight
                  ),
                ),
                const SizedBox(height: 8.0), // Space between text lines

                // "New Journey" Text
                const Text(
                  'New Journey',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: secondaryTextColor, // Or use primaryTextColor if design is different
                    fontSize: 36.0,
                    fontWeight: FontWeight.bold, // Bold weight
                    // Optional: Add a subtle shadow for better readability
                    // shadows: [
                    //   Shadow(
                    //     blurRadius: 8.0,
                    //     color: Colors.black.withOpacity(0.6),
                    //     offset: Offset(1.0, 1.0),
                    //   ),
                    // ],
                  ),
                ),

                // Spacer to push button towards the bottom
                const Spacer(flex: 3), // Adjust flex for positioning

                // Next Button
                ElevatedButton(
                  onPressed: (){
                    Navigator.push(context, MaterialPageRoute(builder: (context) => const WelcomePage2()));
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: buttonBackgroundColor,
                    foregroundColor: buttonTextColor, // Text color
                    minimumSize: Size(screenWidth * 0.6, 50), // Button size
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30.0), // Rounded corners
                      // Optional: Add border if needed
                      // side: BorderSide(color: Colors.black54, width: 1),
                    ),
                    elevation: 3, // Button shadow
                  ),
                  child: const Text(
                    'Next',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(height: 20.0), // Space below button

                // Page Indicator (Hardcoded for now)
                // This should be dynamic when used with a PageView
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(5, (index) { // Assuming 5 total pages
                    return Container(
                      width: 8.0,
                      height: 8.0,
                      margin: const EdgeInsets.symmetric(horizontal: 4.0),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        // Make the first dot active for this page (index 0)
                        color: index == 0 ? activeIndicatorColor : inactiveIndicatorColor,
                      ),
                    );
                  }),
                ),
                SizedBox(height: screenHeight * 0.05), // Bottom padding space
              ],
            ),
          ),
        ],
      ),
    );
  }
}