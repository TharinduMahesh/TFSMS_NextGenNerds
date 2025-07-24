import 'package:flutter/material.dart';
import 'package:growersignup/welcome_screens/welcome_collector.dart';
import 'package:growersignup/welcome_screens/welcome_grower.dart';

// Define an enum for clarity, or use Strings if preferred
enum UserRole { supplier, collector }

class WelcomePage4 extends StatefulWidget {
  // Callback when 'Next' is pressed, passing the selected role
  final ValueChanged<UserRole?>? onNextPressed;
  // Optional: Callback specifically for when a role is selected
  // final ValueChanged<UserRole?>? onRoleSelected;

  const WelcomePage4({
      super.key,
      this.onNextPressed,
      // this.onRoleSelected,
  });

  @override
  State<WelcomePage4> createState() => _WelcomePage4State();
}

class _WelcomePage4State extends State<WelcomePage4> {
  // State variable to hold the selected role
  UserRole? _selectedRole; // Use the enum type

  // --- Define Colors (adjust/reuse) ---
  static const Color titleColor = Color(0xFFFAFAFA); // Off-white for title
  // Role Buttons
  static const Color buttonBackgroundColor = Color(0xFF0a4e41); // Dark green/teal estimate
  static const Color buttonTextColor = Color(0xFFFAFAFA); // Off-white text
  static const Color selectedButtonBackgroundColor = Color(0xFF157463); // Slightly lighter green
  static const Color selectedButtonTextColor = Colors.white;
  // Next Button colors
  static const Color nextButtonBackgroundColor = Color(0xFFc8e6c9);
  static const Color nextButtonTextColor = Color(0xFF0a4e41);
  // Indicator colors
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
          // 1. Background Image
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
                const Spacer(flex: 2),

                // "You are a" Title
                const Text(
                  'You are a',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: titleColor,
                    fontSize: 30.0, // Increased size
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
                const SizedBox(height: 35.0), // Space before buttons

                // Role Buttons
                _buildRoleButton(UserRole.supplier, 'Supplier'),
                const SizedBox(height: 15.0),
                _buildRoleButton(UserRole.collector, 'Collector'),

                const Spacer(flex: 3),

                // Next Button
                ElevatedButton(
                  onPressed: () {
                     if (_selectedRole != null) {
                         if(_selectedRole == UserRole.supplier) {
                            Navigator.push(context, MaterialPageRoute(builder: (context) => const WelcomeSupplierPage()));
                             print('Supplier role selected');
                         } else if(_selectedRole == UserRole.collector) {
                          Navigator.push(context, MaterialPageRoute(builder: (context) => const WelcomeCollectorPage()));
                             print('Collector role selected');
                         }
                         // Call the callback, passing the selected role
                         widget.onNextPressed?.call(_selectedRole);
                     } else {
                         // Prompt user to select a role
                         ScaffoldMessenger.of(context).showSnackBar(
                           const SnackBar(content: Text('Please select your role'), duration: Duration(seconds: 2), backgroundColor: Colors.orangeAccent,),
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
                const SizedBox(height: 20.0),

                // Page Indicator (Highlighting the fourth dot - index 3)
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(5, (index) { // Assuming 5 total pages
                    return Container(
                      width: 8.0,
                      height: 8.0,
                      margin: const EdgeInsets.symmetric(horizontal: 4.0),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        // Highlight dot at index 3 for page 4
                        color: index == 3 ? activeIndicatorColor : inactiveIndicatorColor,
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

  // --- Helper Widget to build Role Buttons ---
  Widget _buildRoleButton(UserRole role, String label) {
    final bool isSelected = _selectedRole == role;
    final screenWidth = MediaQuery.of(context).size.width;

    return ElevatedButton(
      onPressed: () {
        // Update the state when a button is tapped
        setState(() {
          _selectedRole = role;
        });
        // Optional: Call specific role selection callback if needed
        // widget.onRoleSelected?.call(role);
        print('Selected role: $label');
      },
      style: ElevatedButton.styleFrom(
        backgroundColor: isSelected ? selectedButtonBackgroundColor : buttonBackgroundColor,
        foregroundColor: isSelected ? selectedButtonTextColor : buttonTextColor,
         minimumSize: Size(screenWidth * 0.65, 50), // Button size
         shape: RoundedRectangleBorder(
           borderRadius: BorderRadius.circular(30.0),
           // Optional: Add a border to the selected button
           // side: isSelected
           //     ? const BorderSide(color: Colors.white, width: 1.5)
           //     : BorderSide.none,
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