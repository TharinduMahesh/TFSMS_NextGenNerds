import 'package:flutter/material.dart';
import 'package:growersignup/sreens/grower_details_page.dart';
import 'package:growersignup/sreens/grower_location_page.dart';
import 'package:growersignup/sreens/grower_order_request_page.dart';
import 'package:growersignup/sreens/harvest_overview_page.dart';
import 'package:growersignup/sreens/grower_harvest_percentage.dart';
import 'package:growersignup/sreens/grower_payment_page.dart';
import 'package:growersignup/welcome_screens/welcome1.dart';
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
      home: GrowerLocationPage(), // Replace with actual grower ID
    );
  }
}
