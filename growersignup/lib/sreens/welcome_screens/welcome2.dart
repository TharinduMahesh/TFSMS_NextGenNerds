import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/assets/constants/contant_colors.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';
import 'package:growersignup/widgets/settings_button.dart';
import 'package:growersignup/sreens/welcome_screens/welcome3.dart';

class WelcomePage2 extends StatefulWidget {
  // Next button press
  final VoidCallback? onNextPressed;
  // language selection
  final ValueChanged<String>? onLanguageSelected;

  const WelcomePage2({
      super.key,
      this.onNextPressed,
      this.onLanguageSelected
    });

  @override
  State<WelcomePage2> createState() => _WelcomePage2State();
}

class _WelcomePage2State extends State<WelcomePage2> {
  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, child) {
        return Scaffold(
          backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: Stack(
        fit: StackFit.expand,
        children: [
          //Background Image
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
                // Select Language Text
                Text(
                  languageProvider.getText('selectLanguage'),
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: primaryTextColor,
                    fontSize: 28.0,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 30.0), 
                // Language Buttons
                _buildLanguageButton('si', 'සිංහල', languageProvider),
                const SizedBox(height: 15.0),
                _buildLanguageButton('en', 'English', languageProvider),
                const SizedBox(height: 15.0),
                _buildLanguageButton('ta', 'தமிழ்', languageProvider),

                const Spacer(flex: 3), 

                // Next Button
                ElevatedButton(
                  onPressed: () {
                     // Navigate to next page - language is already saved in provider
                     Navigator.push(context, MaterialPageRoute(builder: (context) => const WelcomePage3()));
                     widget.onNextPressed?.call(); 
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: buttonBackgroundColor,
                    foregroundColor: primaryTextColor, // Button text color
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
                const SizedBox(height: 20.0), // Space below button

                // dots
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(5, (index) { // Assuming 5 total pages
                    return Container(
                      width: 8.0,
                      height: 8.0,
                      margin: const EdgeInsets.symmetric(horizontal: 4.0),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        // Highlight dot at index 1 for page 2
                        color: index == 1 ? activeIndicatorColor : inactiveIndicatorColor,
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
      },
    );
  }

  // build Language Buttons 
  Widget _buildLanguageButton(String languageCode, String languageName, LanguageProvider languageProvider) {
    final bool isSelected = languageProvider.currentLanguage == languageCode;
    final screenWidth = MediaQuery.of(context).size.width;

    // Button style
    return ElevatedButton(
      
      onPressed: () {
        // Change language using LanguageProvider
        languageProvider.changeLanguage(languageCode);
        
        // Call the callback if provided
        widget.onLanguageSelected?.call(languageCode);
        print('Selected language: $languageCode');
        
      },
      
      // Button style
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
        languageName,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}