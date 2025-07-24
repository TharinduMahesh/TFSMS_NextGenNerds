import 'package:flutter/material.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';
import 'package:provider/provider.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

class ContactUsPage extends StatefulWidget {
  final String email;
  const ContactUsPage({super.key, required this.email});

  @override
  State<ContactUsPage> createState() => _ContactUsPageState();
}

class _ContactUsPageState extends State<ContactUsPage> {
  int _bottomNavIndex = 3;

  final String phoneNumber1 = '0778585465';
  final String phoneNumber2 = '0125454562';
  final String emailAddress = 'nnn@gmail.com';
  final String whatsappNumber = '94778585465';

  void _launchUrl(Uri url) async {
    if (!await launchUrl(url, mode: LaunchMode.externalApplication)) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Could not launch $url')));
      }
    }
  }

  void _makePhoneCall(String number) => _launchUrl(Uri(scheme: 'tel', path: number));
  void _sendEmail(String email) => _launchUrl(Uri(scheme: 'mailto', path: email));
  void _openWhatsapp(String number) => _launchUrl(Uri.parse('https://wa.me/$number'));

  void _onBottomNavTapped(int index) {
    if (_bottomNavIndex == index) return;
    setState(() => _bottomNavIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, _) {
        return Scaffold(
          backgroundColor: const Color(0xFFF0FBEF),
          body: SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 20.0),
              child: Column(
                children: [
                  Text(
                    languageProvider.getText('contactUsTitle'),
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF0a4e41),
                    ),
                  ),
                  const SizedBox(height: 25),
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24.0),
                    decoration: BoxDecoration(
                      color: Colors.white,
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
                        Text(
                          languageProvider.getText('contactIntro'),
                          textAlign: TextAlign.start,
                          style: const TextStyle(
                            fontSize: 15,
                            color: Color(0xFF333333),
                            height: 1.5,
                          ),
                        ),
                        const SizedBox(height: 30),
                        Text(
                          languageProvider.getText('contactMethodsTitle'),
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF333333),
                          ),
                        ),
                        const SizedBox(height: 15),
                        Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(15.0),
                            border: Border.all(color: Colors.grey.shade200),
                          ),
                          child: Column(
                            children: [
                              _buildContactRow(
                                icon: Icons.call_outlined,
                                title: languageProvider.getText('call'),
                                detail: '$phoneNumber1 / $phoneNumber2',
                                onTap: () => _makePhoneCall(phoneNumber1),
                              ),
                              const Divider(height: 1, indent: 20, endIndent: 20),
                              _buildContactRow(
                                icon: Icons.email_outlined,
                                title: languageProvider.getText('email'),
                                detail: emailAddress,
                                onTap: () => _sendEmail(emailAddress),
                              ),
                              const Divider(height: 1, indent: 20, endIndent: 20),
                              _buildContactRow(
                                icon: FontAwesomeIcons.whatsapp,
                                title: languageProvider.getText('whatsapp'),
                                detail: '$phoneNumber1 / $phoneNumber2',
                                onTap: () => _openWhatsapp(whatsappNumber),
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
            backgroundColor: Colors.white,
            selectedItemColor: const Color(0xFF0a4e41),
            unselectedItemColor: Colors.grey,
            currentIndex: _bottomNavIndex,
            onTap: _onBottomNavTapped,
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
                label: languageProvider.getText('navContactUs'),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildContactRow({
    required IconData icon,
    required String title,
    required String detail,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(15.0),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 20.0),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: const BoxDecoration(
                color: Colors.black,
                borderRadius: BorderRadius.all(Radius.circular(10.0)),
              ),
              child: Icon(icon, color: Colors.white, size: 22),
            ),
            const SizedBox(width: 15),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF333333),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    detail,
                    style: const TextStyle(
                      fontSize: 13,
                      color: Color(0xFF555555),
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
