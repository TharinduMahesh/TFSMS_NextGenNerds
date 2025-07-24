import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';

class GrowerNotificationsPage extends StatefulWidget {
  const GrowerNotificationsPage({super.key});

  @override
  State<GrowerNotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<GrowerNotificationsPage> {
  @override
  Widget build(BuildContext context) {
    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, child) {
        return Scaffold(
          appBar: AppBar(
            backgroundColor: Colors.white,
            elevation: 2,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios, color: Colors.black),
              onPressed: () {
                Navigator.pop(context);
              },
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.settings, color: Colors.black),
                onPressed: () {
                  // Handle settings
                },
              ),
            ],
          ),
          body: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Text(
                    languageProvider.getText('notifications') ?? "Notifications",
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF0C330D),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  languageProvider.getText('today') ?? "Today",
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
                const SizedBox(height: 10),
                const NotificationItem(
                  title: "Payment",
                  message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                  isSelected: false,
                ),
                const SizedBox(height: 20),
                Text(
                  languageProvider.getText('earlier') ?? "Earlier",
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
                const SizedBox(height: 10),
                Expanded(
                  child: ListView.builder(
                    itemCount: 6,
                    itemBuilder: (context, index) {
                      return const NotificationItem(
                        title: "Payment",
                        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                        isSelected: false,
                      );
                    },
                  ),
                ),
                const SizedBox(height: 8),
              ],
            ),
          ),
          bottomNavigationBar: _navigationBar(languageProvider),
        );
      },
    );
  }

  Widget _navigationBar(LanguageProvider languageProvider) {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      items: [
        BottomNavigationBarItem(icon: const Icon(Icons.home), label: languageProvider.getText('home') ?? 'Home'),
        BottomNavigationBarItem(icon: const Icon(Icons.notifications), label: languageProvider.getText('notifications') ?? 'Notifications'),
        BottomNavigationBarItem(icon: const Icon(Icons.person), label: languageProvider.getText('profile') ?? 'Profile'),
        BottomNavigationBarItem(icon: const Icon(Icons.contact_support), label: languageProvider.getText('contact') ?? 'Contact'),
      ],
      selectedItemColor: const Color.fromARGB(255, 0, 0, 0),
    );
  }
}

class NotificationItem extends StatelessWidget {
  const NotificationItem({
    Key? key,
    required this.title,
    required this.message,
    required this.isSelected,
  }) : super(key: key);

  final String title;
  final String message;
  final bool isSelected;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: isSelected ? Border.all(color: Colors.lightBlueAccent, width: 2.0) : null,
        borderRadius: BorderRadius.circular(8.0),
      ),
      padding: const EdgeInsets.all(8.0),
      margin: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          Stack(
            alignment: Alignment.topRight,
            children: [
              Container(
                width: 50,
                height: 50,
                decoration: const BoxDecoration(
                  color: Color(0xFF0C330D),
                  shape: BoxShape.circle,
                ),
              ),
              Positioned(
                top: 5,
                right: 5,
                child: Container(
                  width: 12,
                  height: 12,
                  decoration: const BoxDecoration(
                    color: Colors.lightGreen,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                ),
                Text(
                  message,
                  style: TextStyle(fontSize: 14, color: Colors.grey.shade700),
                ),
              ],
            ),
          ),
          const Text(
            "1m ago.",
            style: TextStyle(color: Colors.grey),
          ),
        ],
      ),
    );
  }
}
