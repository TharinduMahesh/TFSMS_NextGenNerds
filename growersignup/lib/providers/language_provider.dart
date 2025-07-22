import 'package:flutter/material.dart';
import 'package:growersignup/assets/constants/app_strings.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LanguageProvider extends ChangeNotifier {
  String _currentLanguage = 'en';
  Map<String, String> _strings = AppStrings.english;

  String get currentLanguage => _currentLanguage;
  Map<String, String> get strings => _strings;

  LanguageProvider() {
    _loadLanguage();
  }

  Future<void> _loadLanguage() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    _currentLanguage = prefs.getString('selected_language') ?? 'en';
    _updateStrings();
    notifyListeners();
  }

  Future<void> changeLanguage(String language) async {
    if (_currentLanguage != language) {
      _currentLanguage = language;
      _updateStrings();
      
      // Save to SharedPreferences
      SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.setString('selected_language', language);
      
      notifyListeners();
    }
  }

  void _updateStrings() {
    switch (_currentLanguage) {
      case 'si':
        _strings = AppStrings.sinhala;
        break;
      case 'ta':
        _strings = AppStrings.tamil;
        break;
      case 'en':
      default:
        _strings = AppStrings.english;
        break;
    }
  }

  String getText(String key) {
    return _strings[key] ?? key;
  }
}
