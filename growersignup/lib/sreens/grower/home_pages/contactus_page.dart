import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart'; // For launching external apps
import 'package:font_awesome_flutter/font_awesome_flutter.dart'; // For WhatsApp icon

class ContactUsPage extends StatefulWidget {
  final String email;
  const ContactUsPage({super.key, required this.email});

  @override
  State<ContactUsPage> createState() => _ContactUsPageState();
}

class _ContactUsPageState extends State<ContactUsPage> {
  int _bottomNavIndex = 3; // "Contact us" is selected (index 3)

  // --- Placeholder Contact Data (Replace with data from your API/config) ---
  final String phoneNumber1 = '0778585465';
  final String phoneNumber2 = '0125454562';
  final String emailAddress = 'nnn@gmail.com';
  final String whatsappNumber =
      '94778585465'; // Use international format without '+' for wa.me link

  // --- Define Colors (estimated) ---
  static const Color pageBackgroundColor = Color(0xFFF0FBEF);
  static const Color cardBackgroundColor = Colors.white;
  static const Color titleColor = Color(0xFF0a4e41);
  static const Color textColor = Color(0xFF333333);
  static const Color iconContainerColor = Colors.black;
  static const Color iconColor = Colors.white;
  static const Color bottomNavBarBackground = Colors.white;
  static const Color bottomNavBarSelectedColor = titleColor;
  static const Color bottomNavBarUnselectedColor = Colors.grey;
  // --- End Colors ---

  // --- URL Launcher Functions ---
  Future<void> _launchUrlHelper(Uri url) async {
    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      if (mounted) {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text('Could not launch $url')));
      }
    }
  }

  void _makePhoneCall(String number) {
    final Uri phoneUri = Uri(scheme: 'tel', path: number);
    _launchUrlHelper(phoneUri);
  }

  void _sendEmail(String email) {
    final Uri emailUri = Uri(scheme: 'mailto', path: email);
    _launchUrlHelper(emailUri);
  }

  void _openWhatsapp(String number) {
    // Note: The number should be in international format without '+' or '00'
    final Uri whatsappUri = Uri.parse('https://wa.me/$number');
    _launchUrlHelper(whatsappUri);
  }

  // --- Bottom Nav Logic ---
  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    setState(() => _bottomNavIndex = index);
    // TODO: Implement navigation
    print("Bottom Nav Tapped: $index");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: pageBackgroundColor,
      // No AppBar, title is part of the body
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 20.0),
          child: Column(
            children: [
              // Title
              const Text(
                'Contact Us',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: titleColor,
                ),
              ),
              const SizedBox(height: 25),

              // Main Card Container
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24.0),
                decoration: BoxDecoration(
                  color: cardBackgroundColor,
                  borderRadius: BorderRadius.circular(20.0),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.1),
                      spreadRadius: 1,
                      blurRadius: 8,
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Intro Text
                    const Text(
                      "We're here to assist you with any inquiries or concerns. Reach out to us for support, feedback, or general questions about our operations.",
                      textAlign: TextAlign.start,
                      style: TextStyle(
                        fontSize: 15,
                        color: textColor,
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 30),

                    // Sub-heading
                    const Text(
                      'You can contact us by,',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: textColor,
                      ),
                    ),
                    const SizedBox(height: 15),

                    // Inner container for contact methods
                    Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(15.0),
                        border: Border.all(
                          color: Colors.grey.shade200,
                          width: 1.0,
                        ),
                      ),
                      child: Column(
                        children: [
                          _buildContactRow(
                            icon: Icons.call_outlined,
                            title: 'Call',
                            detail: '$phoneNumber1 / $phoneNumber2',
                            onTap:
                                () => _makePhoneCall(
                                  phoneNumber1,
                                ), // Launch with the first number
                          ),
                          const Divider(height: 1, indent: 20, endIndent: 20),
                          _buildContactRow(
                            icon: Icons.email_outlined,
                            title: 'Email us',
                            detail: emailAddress,
                            onTap: () => _sendEmail(emailAddress),
                          ),
                          const Divider(height: 1, indent: 20, endIndent: 20),
                          _buildContactRow(
                            // Using FontAwesome for a better WhatsApp icon
                            icon: FontAwesomeIcons.whatsapp,
                            title: 'Whatsapp',
                            detail: '$phoneNumber1 / $phoneNumber2',
                            onTap:
                                () => _openWhatsapp(
                                  whatsappNumber,
                                ), // Use the specific whatsapp number
                          ),
                        ],
                      ),
                    ),
                  ],
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
            label: 'Contact us',
          ),
        ],
      ),
    );
  }

  // Helper Widget to create each contact row
  Widget _buildContactRow({
    required IconData icon,
    required String title,
    required String detail,
    required VoidCallback onTap,
  }) {
    return InkWell(
      // Make the entire row tappable
      onTap: onTap,
      borderRadius: BorderRadius.circular(
        15.0,
      ), // Match container's border radius for ripple effect
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 20.0),
        child: Row(
          children: [
            // Icon Container
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: iconContainerColor,
                borderRadius: BorderRadius.circular(10.0),
              ),
              child: Icon(icon, color: iconColor, size: 22),
            ),
            const SizedBox(width: 15),
            // Text Column
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: textColor,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    detail,
                    style: TextStyle(
                      fontSize: 13,
                      color: textColor.withOpacity(0.8),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
