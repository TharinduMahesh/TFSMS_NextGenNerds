import 'package:flutter/material.dart';

// Placeholders for pages to navigate to
// import '../harvest/harvest_page.dart';
// import '../payments/payments_page.dart';
// import '../order/grower_order_page.dart'; // For FAB
// import '../settings/settings_page.dart';


class GrowerHomePage extends StatefulWidget {
  const GrowerHomePage({super.key});

  @override
  State<GrowerHomePage> createState() => _GrowerHomePageState();
}

class _GrowerHomePageState extends State<GrowerHomePage> {
  int _bottomNavIndex = 0; // Home is selected

  // --- Define Colors (estimated) ---
  static const Color pageBackgroundColor = Color(0xFFF0FBEF); // Fallback if image fails
  static const Color titleTextColor = Colors.white;
  static const Color settingsIconColor = Colors.white;
  static const Color buttonBackgroundColor = Color(0xFFDDF4DD); // Light green
  static const Color buttonTextColor = Color(0xFF0a4e41); // Dark green text
  static const Color buttonIconColor = buttonTextColor;
  static const Color fabBackgroundColor = Colors.white;
  static const Color fabIconColor = Colors.black;
  static const Color bottomNavBarBackground = Colors.white;
  static const Color bottomNavBarSelectedColor = buttonTextColor; // Match button text color
  static const Color bottomNavBarUnselectedColor = Colors.grey;
  // --- End Colors ---

  // --- Navigation Handlers ---
  void _navigateToHarvest() {
    print('Navigate to Harvest Page');
    // Navigator.push(context, MaterialPageRoute(builder: (context) => const HarvestPage()));
    ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Navigate to Harvest'), backgroundColor: Colors.blueAccent));
  }

  void _navigateToPayments() {
    print('Navigate to Payments Page');
    // Navigator.push(context, MaterialPageRoute(builder: (context) => const PaymentsPage()));
     ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Navigate to Payments'), backgroundColor: Colors.blueAccent));
  }

  void _navigateToAddOrder() {
    print('FAB Tapped - Navigate to Add Order Page');
    // Navigator.push(context, MaterialPageRoute(builder: (context) => const GrowerOrderPage()));
    ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Navigate to Add Order Form'), backgroundColor: Colors.blueAccent));
  }

  void _navigateToSettings() {
    print('Navigate to Settings Page');
    // Navigator.push(context, MaterialPageRoute(builder: (context) => const SettingsPage()));
     ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Navigate to Settings'), backgroundColor: Colors.blueAccent));
  }

  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    setState(() => _bottomNavIndex = index);
    // TODO: Implement actual navigation for bottom bar items
    switch (index) {
      case 0: print("Navigate Home (already here)"); break;
      case 1: print("Navigate Notifications"); break;
      case 2: print("Navigate Profile"); break;
      case 3: print("Navigate Contact Us"); break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      backgroundColor: pageBackgroundColor, // Fallback background
      extendBodyBehindAppBar: true, // Make body content go behind AppBar
      appBar: AppBar(
        backgroundColor: Colors.transparent, // Fully transparent AppBar
        elevation: 0, // No shadow
        automaticallyImplyLeading: false, // No back button by default
        // title: Text("Hidden Title", style: TextStyle(color: Colors.transparent)), // Can add if needed
        actions: [
          IconButton(
            icon: const Icon(Icons.settings_outlined, color: settingsIconColor, size: 28),
            onPressed: _navigateToSettings,
          ),
          const SizedBox(width: 10),
        ],
      ),
      body: Stack(
        fit: StackFit.expand, // Make Stack children fill the screen
        children: [
          // 1. Background Image
          Image.asset(
            'lib/assets/images/tea.png', // *** YOUR IMAGE PATH ***
            fit: BoxFit.cover,
            // Optional: Add a dark overlay for better text contrast
            color: Colors.black.withOpacity(0.35),
            colorBlendMode: BlendMode.darken,
            errorBuilder: (context, error, stackTrace) {
               // Fallback if image fails to load
               return Container(color: Colors.grey.shade300, child: const Center(child: Text("Image not found")));
            },
          ),

          // 2. Overlay Content (Title and Buttons)
          SafeArea( // Ensure content is within safe areas (avoids notches, status bar)
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: screenWidth * 0.08, vertical: 20),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween, // Distribute space
                children: [
                  // Top section: Title
                  Column(
                    children: [
                      SizedBox(height: kToolbarHeight -10), // Space for AppBar elements if extendBodyBehindAppBar is true
                      const Text(
                        'Home Page\nSupplier',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: titleTextColor,
                          fontSize: 28, // Adjust size as needed
                          fontWeight: FontWeight.bold,
                          height: 1.3,
                          shadows: [ // Add shadow for better readability on image
                             Shadow(blurRadius: 6.0, color: Colors.black54, offset: Offset(1.0, 1.0)),
                           ]
                        ),
                      ),
                    ],
                  ),

                  // Bottom section: Buttons
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _buildNavigationButton(
                        text: 'Harvest',
                        icon: Icons.arrow_forward_ios,
                        onTap: _navigateToHarvest,
                      ),
                      const SizedBox(height: 20),
                      _buildNavigationButton(
                        text: 'Payments',
                        icon: Icons.arrow_forward_ios,
                        onTap: _navigateToPayments,
                      ),
                       SizedBox(height: screenHeight * 0.08 + 56), // Space for FAB and bottom nav (56 is default FAB height)
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _navigateToAddOrder,
        backgroundColor: fabBackgroundColor,
        foregroundColor: fabIconColor,
        shape: const CircleBorder(),
        elevation: 4.0,
        child: const Icon(Icons.add, size: 28),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat, // Position near bottom nav
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        backgroundColor: bottomNavBarBackground,
        selectedItemColor: bottomNavBarSelectedColor,
        unselectedItemColor: bottomNavBarUnselectedColor,
        currentIndex: _bottomNavIndex,
        onTap: _onBottomNavTapped,
        elevation: 8.0, // Add some elevation
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

  // Helper Widget for the navigation buttons
  Widget _buildNavigationButton({
    required String text,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return ElevatedButton(
      onPressed: onTap,
      style: ElevatedButton.styleFrom(
        backgroundColor: buttonBackgroundColor,
        foregroundColor: buttonTextColor, // For ripple and icon color
        minimumSize: const Size(double.infinity, 60), // Full width, fixed height
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18.0), // Rounded corners
        ),
        padding: const EdgeInsets.symmetric(horizontal: 20),
        elevation: 3,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween, // Text on left, icon on right
        children: [
          Text(
            text,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: buttonTextColor, // Explicitly set text color
            ),
          ),
          Icon(icon, size: 20, color: buttonIconColor), // Explicitly set icon color
        ],
      ),
    );
  }
}