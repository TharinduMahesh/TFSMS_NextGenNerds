import 'package:flutter/material.dart';
import 'package:growersignup/sreens/grower_home_page.dart';
import 'package:growersignup/sreens/grower_signin_page.dart';
import 'package:growersignup/sreens/grower_signup.dart';
import 'package:growersignup/welcome_screens/welcome1.dart';
import 'package:growersignup/welcome_screens/welcome4.dart';
import 'package:growersignup/welcome_screens/welcome_grower.dart';
void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Tea Factory App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(primarySwatch: Colors.green),
      home: GrowerSignInPage(), // Replace with actual grower ID
    );
  }
}
