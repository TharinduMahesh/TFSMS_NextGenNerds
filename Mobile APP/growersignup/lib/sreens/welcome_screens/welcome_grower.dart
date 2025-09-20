import 'package:flutter/material.dart';
import 'package:growersignup/assets/constants/contant_colors.dart';
import 'package:growersignup/sreens/grower/login/grower_signup.dart';

class WelcomeSupplierPage extends StatelessWidget {
  // button press
  final VoidCallback? onStartPressed;

  const WelcomeSupplierPage({super.key, this.onStartPressed});

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          //  Background Image
          Image.asset(
            'lib/assets/images/tea.png', 
            fit: BoxFit.cover,
             color: Colors.black.withOpacity(0.3), 
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
                const Spacer(flex: 2), 

                // Let's start Text
                const Text(
                  "Let's start",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: primaryTextColor,
                    fontSize: 18.0,
                    fontWeight: FontWeight.w500, 
                  ),
                ),
                const SizedBox(height: 8.0), 

                // As a Grower Text
                const Text(
                  'As a Grower',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: primaryTextColor,
                    fontSize: 36.0,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const Spacer(flex: 3), 

                // Let's Start Button
                ElevatedButton(
                  onPressed: onStartPressed ?? () {
                     print('Let\'s Start button tapped! (Grower)');
                     Navigator.push(context, MaterialPageRoute(builder: (context) => const GrowerSignupPage()));
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: buttonBackgroundColor,
                    foregroundColor: primaryTextColor,
                    minimumSize: Size(screenWidth * 0.8, 50),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10.0),
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
                const SizedBox(height: 20.0), 

                // Page Indicator (matching WelcomePage1 style)
                _buildPageIndicator(),

                 SizedBox(height: screenHeight * 0.05), // Bottom padding
              ],
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
          width: index == 3 ? 20 : 8, // Page 4 is active (index 3) - This is the final page
          height: 8,
          margin: const EdgeInsets.symmetric(horizontal: 4),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(4),
            color: index == 3 
                ? Colors.white 
                : Colors.white.withOpacity(0.4),
          ),
        );
      }),
    );
  }
}