import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/theme_provider.dart';
import '../providers/language_provider.dart';

class SettingsButton extends StatelessWidget {
  const SettingsButton({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer2<ThemeProvider, LanguageProvider>(
      builder: (context, themeProvider, languageProvider, child) {
        return IconButton(
          icon: Icon(
            Icons.settings,
            color: Theme.of(context).iconTheme.color ?? 
                   (themeProvider.isDarkMode ? Colors.white : Colors.black),
          ),
          onPressed: () => _showSettingsBottomSheet(context, themeProvider, languageProvider),
        );
      },
    );
  }

  void _showSettingsBottomSheet(BuildContext context, ThemeProvider themeProvider, LanguageProvider languageProvider) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Theme.of(context).cardColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      builder: (BuildContext context) {
        return DraggableScrollableSheet(
          initialChildSize: 0.4,
          minChildSize: 0.3,
          maxChildSize: 0.6,
          expand: false,
          builder: (context, scrollController) {
            return Container(
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(20.0)),
              ),
              child: Column(
                children: [
                  // Handle bar
                  Container(
                    width: 50,
                    height: 5,
                    margin: const EdgeInsets.symmetric(vertical: 10),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade400,
                      borderRadius: BorderRadius.circular(2.5),
                    ),
                  ),
                  
                  // Title
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
                    child: Text(
                      languageProvider.getText('settings'),
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  
                  const Divider(),
                  
                  Expanded(
                    child: ListView(
                      controller: scrollController,
                      padding: const EdgeInsets.symmetric(horizontal: 20.0),
                      children: [
                        // Theme Toggle
                        ListTile(
                          leading: Icon(
                            themeProvider.isDarkMode ? Icons.dark_mode : Icons.light_mode,
                            color: Theme.of(context).primaryColor,
                          ),
                          title: Text(
                            languageProvider.getText('darkMode'),
                            style: Theme.of(context).textTheme.bodyLarge,
                          ),
                          trailing: Switch(
                            value: themeProvider.isDarkMode,
                            onChanged: (value) {
                              themeProvider.setTheme(value);
                            },
                            activeColor: Theme.of(context).primaryColor,
                          ),
                        ),
                        
                        const SizedBox(height: 10),
                        
                        // Language Selection
                        ListTile(
                          leading: Icon(
                            Icons.language,
                            color: Theme.of(context).primaryColor,
                          ),
                          title: Text(
                            languageProvider.getText('language'),
                            style: Theme.of(context).textTheme.bodyLarge,
                          ),
                          subtitle: Text(
                            _getCurrentLanguageName(languageProvider.currentLanguage),
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                          trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                          onTap: () => _showLanguageDialog(context, languageProvider),
                        ),
                        
                        const SizedBox(height: 20),
                        
                        // Close button
                        ElevatedButton(
                          onPressed: () => Navigator.of(context).pop(),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Theme.of(context).primaryColor,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: Text(
                            languageProvider.getText('close'),
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
  
  String _getCurrentLanguageName(String languageCode) {
    switch (languageCode) {
      case 'en':
        return 'English';
      case 'si':
        return 'සිංහල';
      case 'ta':
        return 'தமிழ்';
      default:
        return 'English';
    }
  }

  void _showLanguageDialog(BuildContext context, LanguageProvider languageProvider) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          backgroundColor: Theme.of(context).cardColor,
          title: Text(
            languageProvider.getText('selectLanguage'),
            style: Theme.of(context).textTheme.titleLarge,
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildLanguageOption(context, languageProvider, 'en', 'English', '🇺🇸'),
              _buildLanguageOption(context, languageProvider, 'si', 'සිංහල', '🇱🇰'),
              _buildLanguageOption(context, languageProvider, 'ta', 'தமிழ்', '🇱🇰'),
            ],
          ),
        );
      },
    );
  }

  Widget _buildLanguageOption(BuildContext context, LanguageProvider languageProvider, 
                             String code, String name, String flag) {
    return ListTile(
      leading: Text(flag, style: const TextStyle(fontSize: 24)),
      title: Text(
        name,
        style: Theme.of(context).textTheme.bodyLarge,
      ),
      trailing: languageProvider.currentLanguage == code 
        ? Icon(Icons.check, color: Theme.of(context).primaryColor)
        : null,
      onTap: () {
        languageProvider.changeLanguage(code);
        Navigator.of(context).pop(); // Close language dialog
        Navigator.of(context).pop(); // Close settings sheet
      },
    );
  }
}
