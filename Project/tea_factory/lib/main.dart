import 'package:flutter/material.dart';
import 'package:tea_factory/screens/welcome1_pade.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Your App Name',
      theme: ThemeData(
        primarySwatch: Colors.blue, // Or your custom theme
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const WelcomePage1(), // Display the welcome page
      debugShowCheckedModeBanner: false,
    );
  }
}