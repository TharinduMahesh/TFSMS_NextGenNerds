import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/sreens/grower/home_pages/grower_harvest.dart';
import 'package:growersignup/sreens/grower/orders/grower_order_page.dart';
import 'package:growersignup/sreens/grower/home_pages/grower_payment_page.dart';
import 'package:growersignup/sreens/grower/home_pages/help_center.dart';
import 'package:growersignup/sreens/grower/home_pages/show_supplier_details.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';

class GrowerHomePage extends StatefulWidget {
  final String email;
  const GrowerHomePage({super.key, required this.email});

  @override
  State<GrowerHomePage> createState() => _GrowerHomePageState();
}

class _GrowerHomePageState extends State<GrowerHomePage> {
  int _bottomNavIndex = 0;

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

  void _navigateToHarvest() {
    Navigator.push(context, MaterialPageRoute(builder: (_) => HarvestPage(email: widget.email)));
  }

  void _navigateToPayments() {
    Navigator.push(context, MaterialPageRoute(builder: (_) => PaymentsPage(email: widget.email)));
  }

  void _navigateToAddOrder() {
    Navigator.push(context, MaterialPageRoute(builder: (_) => GrowerOrderPage(email: widget.email)));
  }

  void _navigateToSettings() {
    // Reserved for future implementation
  }

  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    setState(() => _bottomNavIndex = index);
    switch (index) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        Navigator.push(context, MaterialPageRoute(builder: (_) => GrowerDetailsPage(email: widget.email)));
        break;
      case 3:
        Navigator.push(context, MaterialPageRoute(builder: (_) => HelpCenterPage(email: widget.email)));
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, _) {
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
                icon: const Icon(Icons.settings_outlined, color: settingsIconColor, size: 28),
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
                color: Colors.black.withOpacity(0.35),
                colorBlendMode: BlendMode.darken,
              ),
              SafeArea(
                child: Padding(
                  padding: EdgeInsets.symmetric(horizontal: screenWidth * 0.08, vertical: 20),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        children: [
                          SizedBox(height: kToolbarHeight - 10),
                          Text(
                            languageProvider.getText('growerHomeTitle'),
                            textAlign: TextAlign.center,
                            style: const TextStyle(
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
                            text: languageProvider.getText('harvest'),
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
            selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
            unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
            items: [
              BottomNavigationBarItem(
                icon: const Icon(Icons.home_outlined),
                activeIcon: const Icon(Icons.home),
                label: languageProvider.getText('navHome'),
              ),
              BottomNavigationBarItem(
                icon: const Icon(Icons.notifications_outlined),
                activeIcon: const Icon(Icons.notifications),
                label: languageProvider.getText('navNotification'),
              ),
              BottomNavigationBarItem(
                icon: const Icon(Icons.person_outline),
                activeIcon: const Icon(Icons.person),
                label: languageProvider.getText('navProfile'),
              ),
              BottomNavigationBarItem(
                icon: const Icon(Icons.star_outline),
                activeIcon: const Icon(Icons.star),
                label: languageProvider.getText('navHelp'),
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
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18.0)),
        padding: const EdgeInsets.symmetric(horizontal: 20),
        elevation: 3,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            text,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: buttonTextColor),
          ),
          Icon(icon, size: 20, color: buttonIconColor),
        ],
      ),
    );
  }
}
