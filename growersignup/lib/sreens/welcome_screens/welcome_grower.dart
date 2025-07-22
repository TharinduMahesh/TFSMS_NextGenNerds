import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';
import 'package:growersignup/assets/constants/contant_colors.dart';
import 'package:growersignup/sreens/grower/login/grower_signup.dart';

class WelcomeSupplierPage extends StatelessWidget {
  final VoidCallback? onStartPressed;

  const WelcomeSupplierPage({super.key, this.onStartPressed});

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, child) {
        return Scaffold(
          body: Stack(
            fit: StackFit.expand,
            children: [
              // Background Image with theme-based overlay
              Image.asset(
                'lib/assets/images/tea.png',
                fit: BoxFit.cover,
                color: themeProvider.isDarkMode
                    ? Colors.black.withOpacity(0.6)
                    : Colors.black.withOpacity(0.3),
                colorBlendMode: BlendMode.darken,
              ),

              // Content Column
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
                    Text(
                      languageProvider.getText('letsStart'),
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        color: Color.fromARGB(255, 250, 250, 250),
                        fontSize: 18.0,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 8.0),

                    // As a Grower Text
                    Text(
                      languageProvider.getText('asAGrower'),
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        color: Color.fromARGB(255, 250, 250, 250),
                        fontSize: 36.0,
                        fontWeight: FontWeight.bold,
                      ),
                    ),

                    const Spacer(flex: 3),

                    // Let's Start Button
                    ElevatedButton(
                      onPressed: onStartPressed ??
                          () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const GrowerSignupPage(),
                              ),
                            );
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
                      child: Text(
                        languageProvider.getText('letsStart'),
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 20.0),

                    // Dots
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(5, (index) {
                        return Container(
                          width: 8.0,
                          height: 8.0,
                          margin: const EdgeInsets.symmetric(horizontal: 4.0),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: index == 4
                                ? activeIndicatorColor
                                : inactiveIndicatorColor,
                          ),
                        );
                      }),
                    ),
                    SizedBox(height: screenHeight * 0.05),
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
