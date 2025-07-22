import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/language_provider.dart';

class LanguageSelector extends StatelessWidget {
  const LanguageSelector({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<LanguageProvider>(
      builder: (context, languageProvider, child) {
        return PopupMenuButton<String>(
          icon: const Icon(Icons.language, color: Colors.white),
          onSelected: (String language) {
            languageProvider.changeLanguage(language);
          },
          itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
            PopupMenuItem<String>(
              value: 'en',
              child: Row(
                children: [
                  Icon(
                    Icons.check,
                    color: languageProvider.currentLanguage == 'en' 
                      ? Colors.green 
                      : Colors.transparent,
                  ),
                  const SizedBox(width: 8),
                  const Text('English'),
                ],
              ),
            ),
            PopupMenuItem<String>(
              value: 'si',
              child: Row(
                children: [
                  Icon(
                    Icons.check,
                    color: languageProvider.currentLanguage == 'si' 
                      ? Colors.green 
                      : Colors.transparent,
                  ),
                  const SizedBox(width: 8),
                  const Text('සිංහල'),
                ],
              ),
            ),
            PopupMenuItem<String>(
              value: 'ta',
              child: Row(
                children: [
                  Icon(
                    Icons.check,
                    color: languageProvider.currentLanguage == 'ta' 
                      ? Colors.green 
                      : Colors.transparent,
                  ),
                  const SizedBox(width: 8),
                  const Text('தமிழ்'),
                ],
              ),
            ),
          ],
        );
      },
    );
  }
}
