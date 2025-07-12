import 'package:flutter/material.dart';
import 'package:growersignup/sreens/Grower_notification_page.dart';
import 'package:growersignup/sreens/collector_confirm.dart';
import 'package:growersignup/sreens/contactus_page.dart';
import 'package:growersignup/sreens/fertilizer_page.dart';
import 'package:growersignup/sreens/grower_location_page.dart';
import 'package:growersignup/sreens/grower_order_page.dart';
import 'package:growersignup/sreens/grower_order_request_page.dart';
import 'package:growersignup/sreens/grower_payment_page.dart';
import 'package:growersignup/sreens/help_center.dart';
import 'package:growersignup/sreens/pay.dart';
import 'package:growersignup/sreens/show_supplier_details.dart';
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
      home: WelcomePage1(), // Replace with actual grower ID
    );
  }
}
