import 'package:flutter/material.dart';
import 'package:growersignup/sreens/grower/orders/grower_location_page.dart';

// Placeholder for the actual order form page
// import '../grower/grower_order_page.dart';

class GrowerOrderRequestPage extends StatefulWidget {
  final String email; // Optional, if you need to pass email or other data
  const GrowerOrderRequestPage({super.key, required this.email});

  @override
  State<GrowerOrderRequestPage> createState() => _GrowerOrderRequestPageState();
}

class _GrowerOrderRequestPageState extends State<GrowerOrderRequestPage> {
  int _bottomNavIndex = 0; // Home selected

  // --- Define Colors (estimated) ---
  static const Color pageBackgroundColor = Color(0xFFF0FBEF); // Light green
  static const Color iconColor = Color(0xFF333333); // Dark grey/black icon
  static const Color textColor = Colors.black54; // Muted text color
  static const Color buttonColor = Color(0xFF0a4e41); // Dark green button
  static const Color buttonTextColor = Colors.white;
  static const Color appBarIconsColor = Color(0xFF333333); // Match icon color?
  static const Color bottomNavBarBackground = Colors.white;
  static const Color bottomNavBarSelectedColor = buttonColor; // Match button color
  static const Color bottomNavBarUnselectedColor = Colors.grey;
  // --- End Colors ---

  // --- Bottom Nav Logic ---
  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    setState(() => _bottomNavIndex = index);
    // TODO: Implement navigation based on index
    switch (index) {
      case 0: print("Navigate Home"); break; // Already here?
      case 1: print("Navigate Notifications"); break;
      case 2: print("Navigate Profile"); break;
      case 3: print("Navigate Contact Us"); break;
    }
  }

   void _openSettings() {
     print('Settings icon tapped');
     ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Settings not implemented yet'), backgroundColor: Colors.grey),
      );
  }

  void _navigateToOrderForm() {
     print('Request Order button tapped');
     // TODO: Navigate to the GrowerOrderPage or similar form
     Navigator.push(context, MaterialPageRoute(builder: (context) => GrowerLocationPage(email: widget.email))); // Pass email if needed
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Navigate to Order Form'), backgroundColor: Colors.blueAccent),
      );
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
        // No title needed as per screenshot
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: appBarIconsColor),
            onPressed: _openSettings,
          ),
          const SizedBox(width: 10),
        ],
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 40.0), // Add padding
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center, // Center content vertically
            children: [
              // Large Icon
              const Icon(
                Icons.search, // Standard search icon
                color: iconColor,
                size: 150.0, // Make it large
              ),
              const SizedBox(height: 40), // Space below icon

              // Descriptive Text
              const Text(
                'Request a Collector get picked up by\na nearby community',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: textColor,
                  fontSize: 15,
                  height: 1.4, // Line spacing
                ),
              ),
              const SizedBox(height: 30), // Space below text

              // Request Button
              ElevatedButton(
                onPressed: _navigateToOrderForm,
                style: ElevatedButton.styleFrom(
                  backgroundColor: buttonColor,
                  foregroundColor: buttonTextColor,
                  minimumSize: const Size(double.infinity, 50), // Full width
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30.0), // Pill shape
                  ),
                  elevation: 2,
                ),
                child: const Text(
                  'Request Order',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
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
           BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: 'Home'),
           BottomNavigationBarItem(icon: Icon(Icons.notifications_outlined), activeIcon: Icon(Icons.notifications), label: 'Notification'),
           BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: 'Profile'),
           BottomNavigationBarItem(icon: Icon(Icons.star_outline), activeIcon: Icon(Icons.star), label: 'Contact us'),
        ],
      ),
    );
  }
}