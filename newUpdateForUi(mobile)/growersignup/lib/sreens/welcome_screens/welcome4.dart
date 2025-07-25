import 'package:flutter/material.dart';
import 'package:growersignup/assets/constants/contant_colors.dart';
import 'package:growersignup/sreens/welcome_screens/welcome_collector.dart';
import 'package:growersignup/sreens/welcome_screens/welcome_grower.dart';

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
  // select role
  UserRole? _selectedRole; 

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

                // "You are a" Title
                const Text(
                  'You are a',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: primaryTextColor,
                    fontSize: 30.0, 
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 35.0), // Space before buttons

                // Role Buttons
                _buildRoleButton(UserRole.supplier, 'Grower'),
                const SizedBox(height: 15.0),
                _buildRoleButton(UserRole.collector, 'Collector'),

                const Spacer(flex: 3),

                // Next Button
                ElevatedButton(
                  onPressed: () {
                     if (_selectedRole != null) {
                         if(_selectedRole == UserRole.supplier) {
                            Navigator.push(context, MaterialPageRoute(builder: (context) => const WelcomeSupplierPage()));
                             print('Grower role selected');
                         } else if(_selectedRole == UserRole.collector) {
                          Navigator.push(context, MaterialPageRoute(builder: (context) => const WelcomeCollectorPage()));
                             print('Collector role selected');
                         }
                         widget.onNextPressed?.call(_selectedRole);
                     } else {
                         // select a role msg
                         ScaffoldMessenger.of(context).showSnackBar(
                           const SnackBar(content: Text('Please select your role'), duration: Duration(seconds: 2), backgroundColor: Color(0xFFA52A2A),),
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
                  child: const Text(
                    'Next',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(height: 20.0),

                // dots
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: List.generate(5, (index) { 
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
                SizedBox(height: screenHeight * 0.05),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRoleButton(UserRole role, String label) {
    final bool isSelected = _selectedRole == role;
    final screenWidth = MediaQuery.of(context).size.width;

    return ElevatedButton(
      onPressed: () {
        setState(() {
          _selectedRole = role;
        });
        print('Selected role: $label');
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