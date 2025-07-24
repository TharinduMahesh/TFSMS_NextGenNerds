import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';
import 'package:growersignup/sreens/grower/orders/grower_location_page.dart';

class GrowerOrderRequestPage extends StatefulWidget {
  final String email;
  const GrowerOrderRequestPage({super.key, required this.email});

  @override
  State<GrowerOrderRequestPage> createState() => _GrowerOrderRequestPageState();
}

class _GrowerOrderRequestPageState extends State<GrowerOrderRequestPage> {
  int _bottomNavIndex = 0;

  static const Color iconColor = Color(0xFF333333);
  static const Color appBarIconsColor = Color(0xFF333333);

  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    setState(() => _bottomNavIndex = index);
    // TODO: Navigation Logic
  }

  void _openSettings() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Settings not implemented yet'), backgroundColor: Colors.grey),
    );
  }

  void _navigateToOrderForm() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => GrowerLocationPage(email: widget.email)),
    );
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Navigate to Order Form'), backgroundColor: Colors.blueAccent),
    );
  }

  @override
  Widget build(BuildContext context) {
    final themeProvider = Provider.of<ThemeProvider>(context);
    final languageProvider = Provider.of<LanguageProvider>(context);

    return Scaffold(
      backgroundColor: themeProvider.isDarkMode ? Colors.black : const Color(0xFFF0FBEF),
      appBar: AppBar(
        backgroundColor: themeProvider.isDarkMode ? Colors.black : const Color(0xFFF0FBEF),
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
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 40.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.search,
                color: iconColor,
                size: 150.0,
              ),
              const SizedBox(height: 40),
              Text(
                languageProvider.getText('requestOrderDescription'),
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.black54,
                  fontSize: 15,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 30),
              ElevatedButton(
                onPressed: _navigateToOrderForm,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF0a4e41),
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(30.0),
                  ),
                  elevation: 2,
                ),
                child: Text(
                  languageProvider.getText('requestOrder'),
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.white,
        selectedItemColor: const Color(0xFF0a4e41),
        unselectedItemColor: Colors.grey,
        currentIndex: _bottomNavIndex,
        onTap: _onBottomNavTapped,
        selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
        unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: languageProvider.getText('home')),
          BottomNavigationBarItem(icon: Icon(Icons.notifications_outlined), activeIcon: Icon(Icons.notifications), label: languageProvider.getText('notification')),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: languageProvider.getText('profile')),
          BottomNavigationBarItem(icon: Icon(Icons.star_outline), activeIcon: Icon(Icons.star), label: languageProvider.getText('contactUs')),
        ],
      ),
    );
  }
}
