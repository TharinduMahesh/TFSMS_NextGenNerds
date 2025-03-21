import 'package:flutter/material.dart';

const kbackgroundcolor = Color(0xFFF8FFEA);
const kdefaultselector = Color(0xFFDCF4A6);
const kselectioncolor = Color(0xFF0C330D);  

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

