
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/assets/constants/contant_colors.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';
import 'package:growersignup/widgets/settings_button.dart';
import 'package:growersignup/sreens/welcome_screens/welcome2.dart';

class WelcomePage1 extends StatelessWidget {


  final VoidCallback? onNextPressed;

  const WelcomePage1({super.key, this.onNextPressed});
 


  @override
  Widget build(BuildContext context) {
    // Get screen size
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, child) {
        return Scaffold(
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          body: Stack(
            fit: StackFit.expand,
            children: [
              // Add background image
              Image.asset(
                'lib/assets/images/tea.png',
                fit: BoxFit.cover,
                color: Colors.black.withOpacity(themeProvider.isDarkMode ? 0.5 : 0.3),
                colorBlendMode: BlendMode.darken,
              ),

              // Settings button in top-right corner
              Positioned(
                top: 40,
                right: 20,
                child: SettingsButton(),
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
                    Text(
                      languageProvider.getText('getReady'),
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        color: secondaryTextColor,
                        fontSize: 18.0,
                        fontWeight: FontWeight.w500, // Medium weight
                      ),
                    ),
                    const SizedBox(height: 8.0), // Space between text lines
                    // Text
                    Text(
                      languageProvider.getText('newJourney'),
                      textAlign: TextAlign.center,
                      style: const TextStyle(
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
                          side: const BorderSide(color: Colors.black54, width: 1),
                        ),
                        elevation: 3,
                      ),
                      child: Text(
                        languageProvider.getText('next'),
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
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
      },
    );
  }
}
