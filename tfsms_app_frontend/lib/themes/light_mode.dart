import 'package:flutter/material.dart';

ThemeData lightMode = ThemeData(
  brightness: Brightness.light,
  colorScheme: ColorScheme.light(
    // Tea factory green color palette
    primary: Colors.green.shade600,
    secondary: Colors.green.shade300,
    surface: Colors.white,
    background: Colors.grey.shade50,
    inversePrimary: Colors.green.shade800,
    // Chat specific colors
    onPrimary: Colors.white,
    onSecondary: Colors.green.shade900,
    onSurface: Colors.grey.shade800,
    onBackground: Colors.grey.shade900,
    outline: Colors.grey.shade300,
  ),
  appBarTheme: AppBarTheme(
    backgroundColor: Colors.green.shade700,
    foregroundColor: Colors.white,
    elevation: 2,
    centerTitle: false,
    titleTextStyle: const TextStyle(
      color: Colors.white,
      fontSize: 20,
      fontWeight: FontWeight.w600,
    ),
  ),
  bottomNavigationBarTheme: BottomNavigationBarThemeData(
    backgroundColor: Colors.white,
    selectedItemColor: Colors.green.shade600,
    unselectedItemColor: Colors.grey.shade600,
    type: BottomNavigationBarType.fixed,
  ),
  cardTheme: CardTheme(
    color: Colors.white,
    elevation: 2,
    shadowColor: Colors.grey.shade200,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
  ),
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: Colors.grey.shade100,
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(25),
      borderSide: BorderSide.none,
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(25),
      borderSide: BorderSide(color: Colors.grey.shade300),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(25),
      borderSide: BorderSide(color: Colors.green.shade600, width: 2),
    ),
    hintStyle: TextStyle(color: Colors.grey.shade600),
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: Colors.green.shade600,
      foregroundColor: Colors.white,
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
    ),
  ),
  floatingActionButtonTheme: FloatingActionButtonThemeData(
    backgroundColor: Colors.green.shade600,
    foregroundColor: Colors.white,
  ),
  textTheme: ThemeData.light().textTheme.apply(
    bodyColor: Colors.grey.shade800,
    displayColor: Colors.grey.shade900,
  ).copyWith(
    headlineLarge: TextStyle(
      color: Colors.green.shade800,
      fontWeight: FontWeight.bold,
    ),
    headlineMedium: TextStyle(
      color: Colors.green.shade700,
      fontWeight: FontWeight.w600,
    ),
    titleLarge: TextStyle(
      color: Colors.grey.shade900,
      fontWeight: FontWeight.w600,
    ),
  ),
  dividerColor: Colors.grey.shade300,
  scaffoldBackgroundColor: Colors.grey.shade50,
);
