import 'package:flutter/material.dart';
import 'package:tea_factory/screens/welcome3_page.dart';

class WelcomePage2 extends StatefulWidget {
  // Optional: Callback for the 'Next' button press
  final VoidCallback? onNextPressed;
  // Optional: Callback to inform parent about language selection
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
  // State variable to hold the selected language
  String? _selectedLanguage; // Can be 'Sinhala', 'English', 'Tamil', or null

  // --- Define Colors (reuse/adjust from WelcomePage1) ---
  static const Color titleColor = Color(0xFFFAFAFA); // Off-white for title
  static const Color buttonBackgroundColor = Color(0xFF0a4e41); // Dark green/teal estimate for lang buttons
  static const Color buttonTextColor = Color(0xFFFAFAFA); // Off-white text
  // Style for the SELECTED language button (e.g., slightly lighter or with border)
  static const Color selectedButtonBackgroundColor = Color(0xFF157463); // Slightly lighter green
  static const Color selectedButtonTextColor = Colors.white;
  // Next Button colors (same as WelcomePage1)
  static const Color nextButtonBackgroundColor = Color(0xFFc8e6c9); // Light green estimate
  static const Color nextButtonTextColor = Color(0xFF0a4e41); // Dark green/teal estimate
  // Indicator colors (same as WelcomePage1)
  static const Color activeIndicatorColor = Colors.white;
  static const Color inactiveIndicatorColor = Colors.white54;
  // --- End Colors ---

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          // 1. Background Image (Same as Page 1)
          Image.asset(
            'lib/assets/images/tea.png', // *** YOUR IMAGE PATH ***
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
                const Spacer(flex: 2), // Pushes content down

                // "Select Language" Title
                const Text(
                  'Select Language',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: titleColor,
                    fontSize: 28.0,
                    fontWeight: FontWeight.bold,
                    shadows: [ // Optional shadow for contrast
                       Shadow(
                         blurRadius: 6.0,
                         color: Colors.black54,
                         offset: Offset(1.0, 1.0),
                       ),
                     ],
                  ),
                ),
                const SizedBox(height: 30.0), // Space before buttons

                // Language Buttons
                _buildLanguageButton('Sinhala'),
                const SizedBox(height: 15.0),
                _buildLanguageButton('English'),
                const SizedBox(height: 15.0),
                _buildLanguageButton('Tamil'),

                const Spacer(flex: 3), // Pushes Next button down

                // Next Button (Same structure as Page 1)
                ElevatedButton(
                  onPressed: () {
                     // Optionally check if a language is selected
                     if (_selectedLanguage != null) {
                        Navigator.push(context, MaterialPageRoute(builder: (context) => const WelcomePage3()));
                         print('Language selected: $_selectedLanguage');
                         widget.onNextPressed?.call(); // Call the callback if provided
                     } else {
                         // Optional: Show a message to select a language
                         ScaffoldMessenger.of(context).showSnackBar(
                           const SnackBar(content: Text('Please select a language'), duration: Duration(seconds: 2), backgroundColor: Colors.redAccent,),
                         );
                     }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: nextButtonBackgroundColor,
                    foregroundColor: nextButtonTextColor,
                    minimumSize: Size(screenWidth * 0.6, 50),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30.0),
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

                // Page Indicator (Highlighting the second dot - index 1)
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

  // --- Helper Widget to build Language Buttons ---
  Widget _buildLanguageButton(String language) {
    final bool isSelected = _selectedLanguage == language;
    final screenWidth = MediaQuery.of(context).size.width;


    return ElevatedButton(
      onPressed: () {
        // Update the state when a button is tapped
        setState(() {
          _selectedLanguage = language;
        });
        // Call the callback if provided
        widget.onLanguageSelected?.call(language);
        print('Selected language: $language');
      },
      style: ElevatedButton.styleFrom(
        backgroundColor: isSelected ? selectedButtonBackgroundColor : buttonBackgroundColor,
        foregroundColor: isSelected ? selectedButtonTextColor : buttonTextColor,
         minimumSize: Size(screenWidth * 0.65, 50), // Slightly wider buttons
         shape: RoundedRectangleBorder(
           borderRadius: BorderRadius.circular(30.0),
           // Optional: Add a border to the selected button
           // side: isSelected
           //     ? const BorderSide(color: Colors.white, width: 1.5)
           //     : BorderSide.none,
         ),
         elevation: isSelected ? 4 : 2, // Slightly more elevation when selected
      ),
      child: Text(
        language,
        style: const TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w500, // Medium weight
        ),
      ),
    );
  }
}