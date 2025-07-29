import 'package:flutter/material.dart';
import 'package:growersignup/assets/constants/contant_colors.dart';
import 'package:growersignup/sreens/welcome_screens/welcome_collector.dart';
import 'package:growersignup/sreens/welcome_screens/welcome_grower.dart';

// Define an enum for clarity, or use Strings if preferred
enum UserRole { grower, collector }

class WelcomePage4 extends StatefulWidget {
  // Callback when 'Next' is pressed, passing the selected role
  final ValueChanged<UserRole?>? onNextPressed;

  const WelcomePage4({
      super.key,
      this.onNextPressed,
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
          // Background Image
          Image.asset(
            'lib/assets/images/tea.png',
            fit: BoxFit.cover,
            color: Colors.black.withOpacity(0.3),
            colorBlendMode: BlendMode.darken,
          ),

          // Content
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
                const Text(
                  'You are a',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: primaryTextColor,
                    fontSize: 30.0, 
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 40.0),

                // Role Buttons
                _buildRoleButton(UserRole.grower, 'Grower', screenWidth),
                const SizedBox(height: 15.0),
                _buildRoleButton(UserRole.collector, 'Collector', screenWidth),

                const Spacer(flex: 3),

                // Next Button
                _buildNextButton(screenWidth),
                
                const SizedBox(height: 20.0),

                // Page Indicator
                _buildPageIndicator(),

                SizedBox(height: screenHeight * 0.05),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // Simple Role Button
  Widget _buildRoleButton(UserRole role, String title, double screenWidth) {
    final bool isSelected = _selectedRole == role;

    return SizedBox(
      width: screenWidth * 0.8,
      height: 50,
      child: ElevatedButton(
        onPressed: () {
          setState(() {
            _selectedRole = role;
          });
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: isSelected ? buttonBackgroundColor : Colors.white.withOpacity(0.9),
          foregroundColor: isSelected ? buttonTextColor : Colors.black87,
          elevation: isSelected ? 6 : 3,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10.0),
          ),
        ),
        child: Text(
          title,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }

  // Simple Next Button
  Widget _buildNextButton(double screenWidth) {
    final bool isEnabled = _selectedRole != null;
    
    return SizedBox(
      width: screenWidth * 0.8,
      height: 50,
      child: ElevatedButton(
        onPressed: isEnabled ? () {
          if (_selectedRole != null) {
            if(_selectedRole == UserRole.grower) {
              Navigator.push(context, MaterialPageRoute(builder: (context) => const WelcomeSupplierPage()));
            } else if(_selectedRole == UserRole.collector) {
              Navigator.push(context, MaterialPageRoute(builder: (context) => const WelcomeCollectorPage()));
            }
            widget.onNextPressed?.call(_selectedRole);
          }
        } : () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Please select your role'),
              duration: Duration(seconds: 2),
              backgroundColor: Colors.red,
            ),
          );
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: isEnabled ? const Color(0xFF0a4e41) : Colors.grey[400],
          foregroundColor: Colors.white,
          elevation: 4,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(10.0),
          ),
        ),
        child: const Text(
          'Next',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  // Page Indicator
  Widget _buildPageIndicator() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: List.generate(4, (index) {
        return Container(
          width: index == 2 ? 20 : 8,
          height: 8,
          margin: const EdgeInsets.symmetric(horizontal: 4),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(4),
            color: index == 2 
                ? Colors.white 
                : Colors.white.withOpacity(0.4),
          ),
        );
      }),
    );
  }
}