import 'package:flutter/material.dart';
import 'package:growersignup/sreens/grower/home_pages/contactus_page.dart';
import 'package:growersignup/sreens/grower/home_pages/fertilizer_page.dart';

class HelpCenterPage extends StatefulWidget {
  final String email; // Optional, if you need to pass email or other data
  const HelpCenterPage({super.key, required this.email});

  @override
  State<HelpCenterPage> createState() => _HelpCenterPageState();
}

class _HelpCenterPageState extends State<HelpCenterPage> {
  int _bottomNavIndex = 0; // Home is selected

  // --- Define Colors (estimated) ---
  static const Color pageBackgroundColor = Color(0xFFF0FBEF);
  static const Color titleColor = Color(0xFF0a4e41);
  static const Color appBarIconsColor = Color(0xFF333333);
  static const Color buttonTextColor = Colors.black87;
  static const Color buttonIconColor = Colors.black87;
  // Gradient colors for the buttons
  static const Color buttonGradientStart = Color(0xFFDDF4DD); // Light green
  static const Color buttonGradientEnd = Colors.white;
  // Bottom navigation colors
  static const Color bottomNavBarBackground = Colors.white;
  static const Color bottomNavBarSelectedColor = titleColor;
  static const Color bottomNavBarUnselectedColor = Colors.grey;
  // --- End Colors ---

  // --- Navigation Handlers ---
  void _navigateToCategory(String category) {
    print('Navigate to $category help page');
    switch (category) {
      case 'Fertilizer':
        Navigator.push(context, MaterialPageRoute(builder: (context) => FertilizerPage(email: widget.email)));
        break;
      // case 'Loans':
      //   Navigator.push(context, MaterialPageRoute(builder: (context) => const LoansHelpPage()));
      //   break;
      case 'Contact Us':
        Navigator.push(context, MaterialPageRoute(builder: (context) => ContactUsPage(email: widget.email)));
        break;
    }
  }

  void _openSettings() {
    print('Settings icon tapped');
    ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Settings not implemented yet'), backgroundColor: Colors.grey));
  }

  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    setState(() => _bottomNavIndex = index);
    // TODO: Implement actual navigation
    print("Bottom Nav Tapped: $index");
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: pageBackgroundColor,
      appBar: AppBar(
        backgroundColor: pageBackgroundColor,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: appBarIconsColor),
          onPressed: () => Navigator.of(context).pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: appBarIconsColor),
            onPressed: _openSettings,
          ),
          const SizedBox(width: 10),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
        child: Column(
          children: [
            // Page Title
            const Text(
              'Help Center',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: titleColor,
              ),
            ),
            const SizedBox(height: 30),

            // Category Buttons
            _buildHelpCategoryButton(
              text: 'Fertilizer',
              onTap: () => _navigateToCategory('Fertilizer'),
            ),
            const SizedBox(height: 20),
            _buildHelpCategoryButton(
              text: 'Loans',
              onTap: () => _navigateToCategory('Loans'),
            ),
            const SizedBox(height: 20),
            _buildHelpCategoryButton(
              text: 'Contact Us',
              onTap: () => _navigateToCategory('Contact Us'),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        backgroundColor: bottomNavBarBackground,
        selectedItemColor: bottomNavBarSelectedColor,
        unselectedItemColor: bottomNavBarUnselectedColor,
        currentIndex: _bottomNavIndex,
        onTap: _onBottomNavTapped,
        selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
        unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.notifications_outlined), label: 'Notification'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profile'),
          BottomNavigationBarItem(icon: Icon(Icons.star_outline), label: 'Contact us'),
        ],
      ),
    );
  }

  // Helper Widget for the gradient category buttons
  Widget _buildHelpCategoryButton({
    required String text,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 80, // Set a fixed height for the buttons
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20.0),
          gradient: const LinearGradient(
            colors: [buttonGradientStart, buttonGradientEnd],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.15),
              blurRadius: 10,
              spreadRadius: 2,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              text,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: buttonTextColor,
              ),
            ),
            const Icon(
              Icons.arrow_forward_ios,
              color: buttonIconColor,
              size: 20,
            ),
          ],
        ),
      ),
    );
  }
}