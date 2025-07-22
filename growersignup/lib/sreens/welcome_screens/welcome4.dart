import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';
import 'package:growersignup/widgets/settings_button.dart';
import 'package:growersignup/assets/constants/contant_colors.dart';
import 'package:growersignup/sreens/welcome_screens/welcome_collector.dart';
import 'package:growersignup/sreens/welcome_screens/welcome_grower.dart';

enum UserRole { supplier, collector }

class WelcomePage4 extends StatefulWidget {
  final ValueChanged<UserRole?>? onNextPressed;

  const WelcomePage4({
    super.key,
    this.onNextPressed,
  });

  @override
  State<WelcomePage4> createState() => _WelcomePage4State();
}

class _WelcomePage4State extends State<WelcomePage4> {
  UserRole? _selectedRole;

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, child) {
        final isDark = themeProvider.isDarkMode;

        return Scaffold(
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
          appBar: AppBar(
            backgroundColor: Colors.transparent,
            elevation: 0,
            automaticallyImplyLeading: false,
            actions: const [
              SettingsButton(),
              SizedBox(width: 10),
            ],
          ),
          body: Stack(
            fit: StackFit.expand,
            children: [
              // Background Image with dynamic dark overlay
              Image.asset(
                'lib/assets/images/tea.png',
                fit: BoxFit.cover,
                color: isDark ? Colors.black.withOpacity(0.6) : Colors.black.withOpacity(0.3),
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

                    // Title
                    Text(
                      languageProvider.getText('youAreA'),
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: const Color.fromARGB(255, 205, 216, 205),
                        fontSize: 30.0,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 35.0),

                    // Role Selection Buttons
                    _buildRoleButton(
                        UserRole.supplier, languageProvider.getText('grower'), themeProvider),
                    const SizedBox(height: 15.0),
                    _buildRoleButton(
                        UserRole.collector, languageProvider.getText('collector'), themeProvider),

                    const Spacer(flex: 3),

                    // Next Button
                    ElevatedButton(
                      onPressed: () {
                        if (_selectedRole != null) {
                          if (_selectedRole == UserRole.supplier) {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => const WelcomeSupplierPage()));
                          } else if (_selectedRole == UserRole.collector) {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => const WelcomeCollectorPage()));
                          }
                          widget.onNextPressed?.call(_selectedRole);
                        } else {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(languageProvider.getText('pleaseSelectRole')),
                              duration: const Duration(seconds: 2),
                              backgroundColor: Colors.orangeAccent,
                            ),
                          );
                        }
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
                        languageProvider.getText('next'),
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 20.0),

                    // Indicator Dots
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(5, (index) {
                        return Container(
                          width: 8.0,
                          height: 8.0,
                          margin: const EdgeInsets.symmetric(horizontal: 4.0),
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: index == 3
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

  Widget _buildRoleButton(UserRole role, String label, ThemeProvider themeProvider) {
    final bool isSelected = _selectedRole == role;
    final screenWidth = MediaQuery.of(context).size.width;

    return ElevatedButton(
      onPressed: () {
        setState(() {
          _selectedRole = role;
        });
      },
      style: ElevatedButton.styleFrom(
        backgroundColor: isSelected ? buttonBackgroundColor : pageBackgroundColor,
        foregroundColor: isSelected ? buttonTextColor : primaryTextColor,
        minimumSize: Size(screenWidth * 0.8, 50),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10.0),
        ),
        elevation: isSelected ? 4 : 2,
      ),
      child: Text(
        label,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}
