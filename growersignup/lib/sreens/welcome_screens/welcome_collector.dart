import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';
import 'package:growersignup/sreens/collector/log_in/collector_signup.dart';

class WelcomeCollectorPage extends StatelessWidget {
  final VoidCallback? onStartPressed;

  // Original colors (unchanged)
  static const Color primaryTextColor = Color(0xFFFAFAFA);
  static const Color secondaryTextColor = Color(0xFFE0E0E0);
  static const Color startButtonBackgroundColor = Color(0xFFc8e6c9);
  static const Color startButtonTextColor = Color(0xFF0a4e41);
  static const Color activeIndicatorColor = Colors.white;
  static const Color inactiveIndicatorColor = Colors.white54;

  const WelcomeCollectorPage({super.key, this.onStartPressed});

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, child) {
        final overlayOpacity = themeProvider.isDarkMode ? 0.6 : 0.3;

        return Scaffold(
          body: Stack(
            fit: StackFit.expand,
            children: [
              Image.asset(
                'lib/assets/images/tea.png',
                fit: BoxFit.cover,
                color: Colors.black.withOpacity(overlayOpacity),
                colorBlendMode: BlendMode.darken,
              ),

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

                    Text(
                      languageProvider.getText("letsStart"),
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        color: secondaryTextColor,
                        fontSize: 18.0,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 8.0),

                    Text(
                      languageProvider.getText("asACollector"),
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        color: primaryTextColor,
                        fontSize: 36.0,
                        fontWeight: FontWeight.bold,
                        shadows: [
                          Shadow(
                            blurRadius: 8.0,
                            color: Colors.black54,
                            offset: Offset(1.0, 1.0),
                          ),
                        ],
                      ),
                    ),

                    const Spacer(flex: 3),

                    ElevatedButton(
                      onPressed: onStartPressed ??
                          () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const CollectorSignupPage(),
                              ),
                            );
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
                      child: Text(
                        languageProvider.getText("letsStart"),
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
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
