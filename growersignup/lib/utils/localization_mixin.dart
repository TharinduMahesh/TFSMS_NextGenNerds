import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/language_provider.dart';

mixin LocalizationMixin<T extends StatefulWidget> on State<T> {
  String getText(String key) {
    return context.read<LanguageProvider>().getText(key);
  }
  
  Map<String, String> get strings {
    return context.read<LanguageProvider>().strings;
  }
  
  String get currentLanguage {
    return context.read<LanguageProvider>().currentLanguage;
  }
}

// Extension for easier access in widgets
extension LocalizationExtension on BuildContext {
  String getText(String key) {
    return read<LanguageProvider>().getText(key);
  }
  
  Map<String, String> get strings {
    return read<LanguageProvider>().strings;
  }
  
  String get currentLanguage {
    return read<LanguageProvider>().currentLanguage;
  }
}
