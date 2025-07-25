import 'package:flutter/material.dart';
import 'package:growersignup/sreens/collector/orders/accepted_orders_page.dart';
import 'package:growersignup/sreens/collector/orders/pending_orders_page.dart';


class CollectorOrderSelectPage extends StatefulWidget {
  final String email;
  const CollectorOrderSelectPage({super.key, required this.email});

  @override
  State<CollectorOrderSelectPage> createState() => _CollectorHomePageState();
}

class _CollectorHomePageState extends State<CollectorOrderSelectPage> {
  int _bottomNavIndex = 0;

  // --- Define Colors (estimated) ---
  static const Color pageBackgroundColor = Color(0xFFF0FBEF);
  static const Color titleTextColor = Colors.white;
  static const Color settingsIconColor = Colors.white;
  static const Color buttonBackgroundColor = Color(0xFFDDF4DD);
  static const Color buttonTextColor = Color(0xFF0a4e41);
  static const Color buttonIconColor = buttonTextColor;
  static const Color bottomNavBarBackground = Colors.white;
  static const Color bottomNavBarSelectedColor = buttonTextColor;
  static const Color bottomNavBarUnselectedColor = Colors.grey;
  //

  // Navigation
  void _navigateToHarvest() {
    print('Requests to accept');
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => PendingOrdersPage(email: widget.email)),
    );
  }

  void _navigateToPayments() {
    print('Accepted Orders');
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => AcceptedOrdersPage(email: widget.email),
      ),
    );
  }

  void _navigateToSettings() {
    print('Navigate to Settings Page');
    // Navigator.push(context, MaterialPageRoute(builder: (context) => const SettingsPage()));
  }

  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    setState(() => _bottomNavIndex = index);
    switch (index) {
      case 0:
        print("Navigate Home (already here)");
        break;
      case 1:
        print("Navigate Notifications");
        break;
      case 2:
        // Navigator.push(
        //   context,
        //   MaterialPageRoute(
        //     builder: (context) => GrowerDetailsPage(email: widget.email),
        //   ),
        // );
        print("Navigate Profile");
        break;

      case 3:
        print("Navigate HelpCenter");
        // Navigator.push(
        //   context,
        //   MaterialPageRoute(
        //     builder: (context) => HelpCenterPage(email: widget.email),
        //   ),
        // );
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      backgroundColor: pageBackgroundColor,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        automaticallyImplyLeading: false,
        actions: [
          IconButton(
            icon: const Icon(
              Icons.settings_outlined,
              color: settingsIconColor,
              size: 28,
            ),
            onPressed: _navigateToSettings,
          ),
          const SizedBox(width: 10),
        ],
      ),
      body: Stack(
        fit: StackFit.expand,
        children: [
          //Background Image
          Image.asset(
            'lib/assets/images/tea.png',
            fit: BoxFit.cover,
            color: Colors.black.withOpacity(0.35),
            colorBlendMode: BlendMode.darken,
          ),

          // Title and Buttons
          SafeArea(
            child: Padding(
              padding: EdgeInsets.symmetric(
                horizontal: screenWidth * 0.08,
                vertical: 20,
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Title
                  Column(
                    children: [
                      SizedBox(height: kToolbarHeight - 10), // Space for AppBar
                      const Text(
                        'Collector\nRequests',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          color: titleTextColor,
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          height: 1.3,
                          shadows: [
                            Shadow(
                              blurRadius: 6.0,
                              color: Colors.black54,
                              offset: Offset(1.0, 1.0),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  // Bottom section: Buttons
                  Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _buildNavigationButton(
                        text: 'Pending Requests',
                        icon: Icons.arrow_forward_ios,
                        onTap: _navigateToHarvest,
                      ),
                      const SizedBox(height: 20),
                      _buildNavigationButton(
                        text: 'Accepted Requests',
                        icon: Icons.arrow_forward_ios,
                        onTap: _navigateToPayments,
                      ),
                      SizedBox(
                        height: screenHeight * 0.08 + 56,
                      ), // Space for FAB and bottom nav (56 is default FAB height)
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      // Position near bottom nav
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        backgroundColor: bottomNavBarBackground,
        selectedItemColor: bottomNavBarSelectedColor,
        unselectedItemColor: bottomNavBarUnselectedColor,
        currentIndex: _bottomNavIndex,
        onTap: _onBottomNavTapped,
        elevation: 8.0, // Add some elevation
        selectedLabelStyle: const TextStyle(
          fontWeight: FontWeight.w500,
          fontSize: 11,
        ),
        unselectedLabelStyle: const TextStyle(
          fontWeight: FontWeight.w500,
          fontSize: 11,
        ),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home_outlined),
            activeIcon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.notifications_outlined),
            activeIcon: Icon(Icons.notifications),
            label: 'Notification',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person),
            label: 'Profile',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.star_outline),
            activeIcon: Icon(Icons.star),
            label: 'Help Center',
          ),
        ],
      ),
    );
  }

  //  navigation buttons
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
        minimumSize: const Size(
          double.infinity,
          60,
        ), // Full width, fixed height
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18.0), // Rounded corners
        ),
        padding: const EdgeInsets.symmetric(horizontal: 20),
        elevation: 3,
      ),
      child: Row(
        mainAxisAlignment:
            MainAxisAlignment.spaceBetween, // Text on left, icon on right
        children: [
          Text(
            text,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: buttonTextColor, // Explicitly set text color
            ),
          ),
          Icon(
            icon,
            size: 20,
            color: buttonIconColor,
          ), // Explicitly set icon color
        ],
      ),
    );
  }
}
