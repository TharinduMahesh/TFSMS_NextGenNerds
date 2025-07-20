import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LanguageProvider with ChangeNotifier {
  Locale _currentLocale = const Locale('en');
  static const String _languageKey = 'selected_language';

  Locale get currentLocale => _currentLocale;

  LanguageProvider() {
    _loadSavedLanguage();
  }

  Future<void> _loadSavedLanguage() async {
    final prefs = await SharedPreferences.getInstance();
    final savedLanguage = prefs.getString(_languageKey);
    
    if (savedLanguage != null) {
      _currentLocale = Locale(savedLanguage);
      notifyListeners();
    }
  }

  Future<void> setLanguage(Locale locale) async {
    if (_currentLocale == locale) return;
    
    _currentLocale = locale;
    notifyListeners();
    
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_languageKey, locale.languageCode);
  }

  Future<void> setEnglish() async {
    await setLanguage(const Locale('en'));
  }

  Future<void> setSinhala() async {
    await setLanguage(const Locale('si'));
  }

  Future<void> setTamil() async {
    await setLanguage(const Locale('ta'));
  }

  String get currentLanguageName {
    switch (_currentLocale.languageCode) {
      case 'si':
        return 'සිංහල';
      case 'ta':
        return 'தமிழ்';
      default:
        return 'English';
    }
  }

  bool get isEnglish => _currentLocale.languageCode == 'en';
  bool get isSinhala => _currentLocale.languageCode == 'si';
  bool get isTamil => _currentLocale.languageCode == 'ta';

  List<Map<String, dynamic>> get supportedLanguages => [
    {
      'code': 'en',
      'name': 'English',
      'nativeName': 'English',
      'locale': const Locale('en'),
    },
    {
      'code': 'si',
      'name': 'Sinhala',
      'nativeName': 'සිංහල',
      'locale': const Locale('si'),
    },
    {
      'code': 'ta',
      'name': 'Tamil',
      'nativeName': 'தமிழ்',
      'locale': const Locale('ta'),
    },
  ];
}
