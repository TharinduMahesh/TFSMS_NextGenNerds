import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../themes/theme_provider.dart';
import '../providers/language_provider.dart';
import '../l10n/app_localizations.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final localizations = AppLocalizations.of(context);
    
    return Scaffold(
      appBar: AppBar(
        title: Text(localizations.settings),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),
            Text(
              localizations.language,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Consumer<LanguageProvider>(
              builder: (context, languageProvider, child) {
                return Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.language),
                            const SizedBox(width: 12),
                            Text(
                              localizations.language,
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        ...languageProvider.supportedLanguages.map((lang) {
                          return RadioListTile<Locale>(
                            title: Text(lang['nativeName']),
                            subtitle: Text(lang['name']),
                            value: lang['locale'],
                            groupValue: languageProvider.currentLocale,
                            onChanged: (Locale? locale) {
                              if (locale != null) {
                                languageProvider.setLanguage(locale);
                              }
                            },
                          );
                        }).toList(),
                      ],
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 24),
            Text(
              localizations.appearance,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Consumer<ThemeProvider>(
              builder: (context, themeProvider, child) {
                return Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.palette),
                            const SizedBox(width: 12),
                            Text(
                              localizations.appearance,
                              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        RadioListTile<bool>(
                          title: Text(localizations.lightMode),
                          subtitle: const Text('Bright theme for daytime use'),
                          value: false,
                          groupValue: themeProvider.isDarkMode,
                          onChanged: (bool? value) {
                            if (value != null) {
                              themeProvider.setLightMode();
                            }
                          },
                        ),
                        RadioListTile<bool>(
                          title: Text(localizations.darkMode),
                          subtitle: const Text('Dark theme for low-light use'),
                          value: true,
                          groupValue: themeProvider.isDarkMode,
                          onChanged: (bool? value) {
                            if (value != null) {
                              themeProvider.setDarkMode();
                            }
                          },
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 24),
            Text(
              'App Settings',
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Card(
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.notifications),
                    title: Text(localizations.notifications),
                    subtitle: const Text('Manage notification preferences'),
                    trailing: Switch(
                      value: true,
                      onChanged: (bool value) {
                        // Handle notification settings
                      },
                    ),
                  ),
                  const Divider(),
                  ListTile(
                    leading: const Icon(Icons.language),
                    title: Text(localizations.language),
                    subtitle: Consumer<LanguageProvider>(
                      builder: (context, languageProvider, child) {
                        return Text(languageProvider.currentLanguageName);
                      },
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios),
                    onTap: () {
                      Navigator.pushNamed(context, '/language-settings');
                    },
                  ),
                  const Divider(),
                  ListTile(
                    leading: const Icon(Icons.info),
                    title: Text(localizations.about),
                    subtitle: const Text('App version and information'),
                    trailing: const Icon(Icons.arrow_forward_ios),
                    onTap: () {
                      // Handle about page
                    },
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
