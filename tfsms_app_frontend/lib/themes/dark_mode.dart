import 'package:flutter/material.dart';

ThemeData darkMode = ThemeData(
  brightness: Brightness.dark,
  colorScheme: ColorScheme.dark(
    // Tea factory green color palette for dark mode
    primary: Colors.green.shade400,
    secondary: Colors.green.shade600,
    surface: Colors.grey.shade900,
    background: Colors.grey.shade900,
    inversePrimary: Colors.green.shade200,
    // Chat specific colors
    onPrimary: Colors.grey.shade900,
    onSecondary: Colors.grey.shade100,
    onSurface: Colors.grey.shade100,
    onBackground: Colors.grey.shade100,
    outline: Colors.grey.shade700,
  ),
  appBarTheme: AppBarTheme(
    backgroundColor: Colors.green.shade800,
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
    backgroundColor: Colors.grey.shade900,
    selectedItemColor: Colors.green.shade400,
    unselectedItemColor: Colors.grey.shade500,
    type: BottomNavigationBarType.fixed,
  ),
  cardTheme: CardTheme(
    color: Colors.grey.shade800,
    elevation: 4,
    shadowColor: Colors.black26,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
  ),
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: Colors.grey.shade800,
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(25),
      borderSide: BorderSide.none,
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(25),
      borderSide: BorderSide(color: Colors.grey.shade700),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(25),
      borderSide: BorderSide(color: Colors.green.shade400, width: 2),
    ),
    hintStyle: TextStyle(color: Colors.grey.shade400),
  ),
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      backgroundColor: Colors.green.shade600,
      foregroundColor: Colors.white,
      elevation: 4,
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
  textTheme: ThemeData.dark().textTheme.apply(
    bodyColor: Colors.grey.shade200,
    displayColor: Colors.white,
  ).copyWith(
    headlineLarge: TextStyle(
      color: Colors.green.shade300,
      fontWeight: FontWeight.bold,
    ),
    headlineMedium: TextStyle(
      color: Colors.green.shade400,
      fontWeight: FontWeight.w600,
    ),
    titleLarge: TextStyle(
      color: Colors.grey.shade100,
      fontWeight: FontWeight.w600,
    ),
  ),
  dividerColor: Colors.grey.shade700,
  scaffoldBackgroundColor: Colors.grey.shade900,
);
