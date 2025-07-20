import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/language_provider.dart';

class LanguageSwitcher extends StatelessWidget {
  final bool showFullNames;
  final bool isAppBarAction;

  const LanguageSwitcher({
    super.key,
    this.showFullNames = false,
    this.isAppBarAction = false,
  });

  @override
  Widget build(BuildContext context) {
    return Consumer<LanguageProvider>(
      builder: (context, languageProvider, child) {
        if (isAppBarAction) {
          return PopupMenuButton<Locale>(
            icon: const Icon(Icons.language),
            onSelected: (Locale locale) {
              languageProvider.setLanguage(locale);
            },
            itemBuilder: (BuildContext context) {
              return languageProvider.supportedLanguages.map((lang) {
                return PopupMenuItem<Locale>(
                  value: lang['locale'],
                  child: Row(
                    children: [
                      Icon(
                        languageProvider.currentLocale.languageCode == lang['code']
                            ? Icons.radio_button_checked
                            : Icons.radio_button_unchecked,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(showFullNames ? lang['name'] : lang['nativeName']),
                    ],
                  ),
                );
              }).toList();
            },
          );
        }

        return DropdownButton<Locale>(
          value: languageProvider.currentLocale,
          underline: Container(),
          items: languageProvider.supportedLanguages.map((lang) {
            return DropdownMenuItem<Locale>(
              value: lang['locale'],
              child: Text(showFullNames ? lang['name'] : lang['nativeName']),
            );
          }).toList(),
          onChanged: (Locale? locale) {
            if (locale != null) {
              languageProvider.setLanguage(locale);
            }
          },
        );
      },
    );
  }
}

class LanguageSelectionDialog extends StatelessWidget {
  const LanguageSelectionDialog({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<LanguageProvider>(
      builder: (context, languageProvider, child) {
        return AlertDialog(
          title: const Text('Select Language'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: languageProvider.supportedLanguages.map((lang) {
              final isSelected = languageProvider.currentLocale.languageCode == lang['code'];
              return ListTile(
                leading: Icon(
                  isSelected ? Icons.radio_button_checked : Icons.radio_button_unchecked,
                  color: isSelected ? Theme.of(context).primaryColor : null,
                ),
                title: Text(lang['nativeName']),
                subtitle: Text(lang['name']),
                onTap: () {
                  languageProvider.setLanguage(lang['locale']);
                  Navigator.of(context).pop();
                },
              );
            }).toList(),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
          ],
        );
      },
    );
  }

  static void show(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => const LanguageSelectionDialog(),
    );
  }
}
