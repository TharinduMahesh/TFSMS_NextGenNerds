import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/sreens/grower/home_pages/contactus_page.dart';
import 'package:growersignup/sreens/grower/home_pages/fertilizer_page.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';

class HelpCenterPage extends StatefulWidget {
  final String email;
  const HelpCenterPage({super.key, required this.email});

  @override
  State<HelpCenterPage> createState() => _HelpCenterPageState();
}

class _HelpCenterPageState extends State<HelpCenterPage> {
  int _bottomNavIndex = 0;

  static const Color pageBackgroundColor = Color(0xFFF0FBEF);
  static const Color titleColor = Color(0xFF0a4e41);
  static const Color appBarIconsColor = Color(0xFF333333);
  static const Color buttonTextColor = Colors.black87;
  static const Color buttonIconColor = Colors.black87;
  static const Color buttonGradientStart = Color(0xFFDDF4DD);
  static const Color buttonGradientEnd = Colors.white;
  static const Color bottomNavBarBackground = Colors.white;
  static const Color bottomNavBarSelectedColor = titleColor;
  static const Color bottomNavBarUnselectedColor = Colors.grey;

  void _navigateToCategory(String category) {
    switch (category) {
      case 'Fertilizer':
        Navigator.push(context, MaterialPageRoute(builder: (context) => FertilizerPage(email: widget.email)));
        break;
      case 'Contact Us':
        Navigator.push(context, MaterialPageRoute(builder: (context) => ContactUsPage(email: widget.email)));
        break;
    }
  }

  void _openSettings() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Settings not implemented yet'), backgroundColor: Colors.grey),
    );
  }

  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    setState(() => _bottomNavIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, _) {
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
                Text(
                  languageProvider.getText('helpCenterTitle'),
                  style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: titleColor),
                ),
                const SizedBox(height: 30),
                _buildHelpCategoryButton(
                  text: languageProvider.getText('fertilizer'),
                  onTap: () => _navigateToCategory('Fertilizer'),
                ),
                const SizedBox(height: 20),
                _buildHelpCategoryButton(
                  text: languageProvider.getText('loans'),
                  onTap: () => _navigateToCategory('Loans'),
                ),
                const SizedBox(height: 20),
                _buildHelpCategoryButton(
                  text: languageProvider.getText('contactUs'),
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
            items: [
              BottomNavigationBarItem(
                icon: const Icon(Icons.home_outlined),
                label: languageProvider.getText('navHome'),
              ),
              BottomNavigationBarItem(
                icon: const Icon(Icons.notifications_outlined),
                label: languageProvider.getText('navNotification'),
              ),
              BottomNavigationBarItem(
                icon: const Icon(Icons.person_outline),
                label: languageProvider.getText('navProfile'),
              ),
              BottomNavigationBarItem(
                icon: const Icon(Icons.star_outline),
                label: languageProvider.getText('navContactUs'),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildHelpCategoryButton({
    required String text,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 80,
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
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: buttonTextColor),
            ),
            const Icon(Icons.arrow_forward_ios, color: buttonIconColor, size: 20),
          ],
        ),
      ),
    );
  }
}
