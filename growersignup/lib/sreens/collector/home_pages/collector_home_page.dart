import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/sreens/collector/home_pages/collector_payment_select_page.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';

class CollectorHomePage extends StatefulWidget {
  final String email;
  const CollectorHomePage({super.key, required this.email});

  @override
  State<CollectorHomePage> createState() => _CollectorHomePageState();
}

class _CollectorHomePageState extends State<CollectorHomePage> {
  int _bottomNavIndex = 0;

  // --- Define Colors (estimated) ---
  static const Color pageBackgroundColor = Color(0xFFF0FBEF);
  static const Color titleTextColor = Colors.white;
  static const Color settingsIconColor = Colors.white;
  static const Color buttonBackgroundColor = Color(0xFFDDF4DD);
  static const Color buttonTextColor = Color(0xFF0a4e41);
  static const Color buttonIconColor = buttonTextColor;
  static const Color fabBackgroundColor = Colors.white;
  static const Color fabIconColor = Colors.black;
  static const Color bottomNavBarBackground = Colors.white;
  static const Color bottomNavBarSelectedColor = buttonTextColor;
  static const Color bottomNavBarUnselectedColor = Colors.grey;
  //

  void _navigateToHarvest() {
    print('Navigate to Harvest Page');
  }

  void _navigateToPayments() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => CollectorPaymentSelectPage(email: widget.email),
      ),
    );
  }

  void _navigateToAddOrder() {
    print('FAB Tapped - Navigate to Add Order Page');
  }

  void _navigateToSettings() {
    print('Navigate to Settings Page');
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
        print("Navigate Profile");
        break;
      case 3:
        print("Navigate HelpCenter");
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, child) {
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
              Image.asset(
                'lib/assets/images/tea.png',
                fit: BoxFit.cover,
                color: Colors.black.withOpacity(
                    themeProvider.isDarkMode ? 0.5 : 0.35),
                colorBlendMode: BlendMode.darken,
              ),
              SafeArea(
                child: Padding(
                  padding: EdgeInsets.symmetric(
                    horizontal: screenWidth * 0.08,
                    vertical: 20,
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        children: [
                          SizedBox(height: kToolbarHeight - 10),
                          const Text(
                            'Home Page\nCollector',
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
                      Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          _buildNavigationButton(
                            text: languageProvider.getText('harvestRequests'),
                            icon: Icons.arrow_forward_ios,
                            onTap: _navigateToHarvest,
                          ),
                          const SizedBox(height: 20),
                          _buildNavigationButton(
                            text: languageProvider.getText('payments'),
                            icon: Icons.arrow_forward_ios,
                            onTap: _navigateToPayments,
                          ),
                          SizedBox(height: screenHeight * 0.08 + 56),
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
          floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
          bottomNavigationBar: BottomNavigationBar(
            type: BottomNavigationBarType.fixed,
            backgroundColor: bottomNavBarBackground,
            selectedItemColor: bottomNavBarSelectedColor,
            unselectedItemColor: bottomNavBarUnselectedColor,
            currentIndex: _bottomNavIndex,
            onTap: _onBottomNavTapped,
            elevation: 8.0,
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
      },
    );
  }

  Widget _buildNavigationButton({
    required String text,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return ElevatedButton(
      onPressed: onTap,
      style: ElevatedButton.styleFrom(
        backgroundColor: buttonBackgroundColor,
        foregroundColor: buttonTextColor,
        minimumSize: const Size(double.infinity, 60),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(18.0),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 20),
        elevation: 3,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            text,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: buttonTextColor,
            ),
          ),
          Icon(
            icon,
            size: 20,
            color: buttonIconColor,
          ),
        ],
      ),
    );
  }
}
