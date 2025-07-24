import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/sreens/grower/home_pages/grower_home_page.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';

class GrowerOrdersucessPage extends StatefulWidget {
  final String email;
  const GrowerOrdersucessPage({super.key, required this.email});

  @override
  State<GrowerOrdersucessPage> createState() => _GrowerOrdersucessPageState();
}

class _GrowerOrdersucessPageState extends State<GrowerOrdersucessPage> {
  @override
  Widget build(BuildContext context) {
    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, child) {
        return Scaffold(
          backgroundColor: const Color(0xFFF8FFEA),
          body: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 50),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    languageProvider.getText('orderSuccessMessage'),
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 30,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => GrowerHomePage(email: widget.email),
                        ),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0C330D),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(22),
                      ),
                      minimumSize: const Size(303, 51),
                    ),
                    child: Text(
                      languageProvider.getText('continue'),
                      style: const TextStyle(color: Colors.white, fontSize: 20),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
