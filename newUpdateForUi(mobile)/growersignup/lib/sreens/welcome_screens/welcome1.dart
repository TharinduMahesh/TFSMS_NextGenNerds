import 'package:flutter/material.dart';
import 'package:growersignup/assets/constants/contant_colors.dart';
import 'package:growersignup/sreens/welcome_screens/welcome2.dart';

class WelcomePage1 extends StatelessWidget {
  final VoidCallback? onNextPressed;

  const WelcomePage1({super.key, this.onNextPressed});

  @override
  Widget build(BuildContext context) {
    // Get screen size
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          // Add background image
          Image.asset(
            'lib/assets/images/tea.png',
            fit: BoxFit.cover,
            color: Colors.black.withOpacity(0.3),
            colorBlendMode: BlendMode.darken,
          ),

          //Content
          Padding(
            padding: EdgeInsets.symmetric(
              horizontal: screenWidth * 0.08,
              vertical: screenHeight * 0.05,
            ),

            child: Column(
              mainAxisAlignment: MainAxisAlignment.center, // Center vertically
              crossAxisAlignment:
                  CrossAxisAlignment.center, // Center horizontally
              children: [
                const Spacer(flex: 2),

                // Text
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
                // Text
                const Text(
                  'New Journey',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: secondaryTextColor,
                    fontSize: 36.0,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                //push button
                const Spacer(flex: 3),
                // Next Button
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const WelcomePage2(),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: buttonBackgroundColor,
                    foregroundColor: buttonTextColor,
                    minimumSize: Size(screenWidth * 0.8, 50),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(
                        10.0,
                      ), // Rounded corners
                      side: BorderSide(color: Colors.black54, width: 1),
                    ),
                    elevation: 3,
                  ),
                  child: const Text(
                    'Next',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 20.0), 
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(5, (index) {
                    return Container(
                      width: 8.0,
                      height: 8.0,
                      margin: const EdgeInsets.symmetric(horizontal: 4.0),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        //color dot to active
                        color:
                            index == 0
                                ? activeIndicatorColor
                                : inactiveIndicatorColor,
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
