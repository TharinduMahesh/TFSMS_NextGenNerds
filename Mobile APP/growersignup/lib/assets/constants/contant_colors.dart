import 'package:flutter/material.dart';

const Color primaryTextColor = Color(0xFF0C330D); // Dark green/teal estimate
const Color secondaryTextColor = Color(0xFFF8FFEA); // Off-white for "Get ready for"
const Color buttonBackgroundColor = Color(0xFFDCF4A6); // Light green estimate
const Color buttonTextColor = primaryTextColor;
const Color activeIndicatorColor = Colors.white;
const Color inactiveIndicatorColor = Colors.white54;
const Color pageBackgroundColor = Color(0xFFF0FBEF); // Fallback if image fails
const Color blackTextColor = Colors.black;
const Color whiteTextColor = Colors.white;
const Color redTextColor = Colors.red;

Widget navigationBar() {
  return BottomNavigationBar(
    type: BottomNavigationBarType.fixed,
    items: const <BottomNavigationBarItem>[ 
      BottomNavigationBarItem(
        icon: Icon(Icons.home),
        label: 'Home',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.notifications),
        label: 'Notifications',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.person),
        label: 'profile',
      ),
      BottomNavigationBarItem(
        icon: Icon(Icons.contact_support),
        label: 'contact',
      ),   
    ],
    selectedItemColor: const Color.fromARGB(255, 0, 0, 0),
  );
}

