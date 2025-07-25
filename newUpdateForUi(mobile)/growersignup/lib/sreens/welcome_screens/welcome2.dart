import 'package:flutter/material.dart';
import 'package:growersignup/assets/constants/contant_colors.dart';
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
  //hold the selected language
  String? _selectedLanguage; 
  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          //Background Image
          Image.asset(
            'lib/assets/images/tea.png',
            fit: BoxFit.cover,
            color: Colors.black.withOpacity(0.3),
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
                // Select Language Text
                const Text(
                  'Select Language',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: primaryTextColor,
                    fontSize: 28.0,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 30.0), 
                // Language Buttons
                _buildLanguageButton('Sinhala'),
                const SizedBox(height: 15.0),
                _buildLanguageButton('English'),
                const SizedBox(height: 15.0),
                _buildLanguageButton('Tamil'),

                const Spacer(flex: 3), 

                // Next Button
                ElevatedButton(
                  onPressed: () {
                     //check language is selected
                     if (_selectedLanguage != null) {
                        Navigator.push(context, MaterialPageRoute(builder: (context) => const WelcomePage3()));
                         print('Language selected: $_selectedLanguage');
                         widget.onNextPressed?.call(); 
                     } else {
                         //Show a message 
                         ScaffoldMessenger.of(context).showSnackBar(
                           const SnackBar(content: Text('Please select a language'), duration: Duration(seconds: 2), backgroundColor: Color(0xFFA52A2A),),
                         );
                     }
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
                  
                  child: const Text(
                    'Next',
                    style: TextStyle(
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
  }

  // build Language Buttons 
  Widget _buildLanguageButton(String language) {
    final bool isSelected = _selectedLanguage == language;
    final screenWidth = MediaQuery.of(context).size.width;

    // Button style
    return ElevatedButton(
      
      onPressed: () {
        // what language selected
        setState(() {
          _selectedLanguage = language;
        });
        
        // Call the callback if provided
        widget.onLanguageSelected?.call(language);
        print('Selected language: $language');
        
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
        language,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }
}