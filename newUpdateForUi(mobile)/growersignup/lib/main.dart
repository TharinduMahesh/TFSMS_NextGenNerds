
import 'package:flutter/material.dart';
import 'package:growersignup/sreens/collector/home_pages/accepted_details.dart';
import 'package:growersignup/sreens/collector/home_pages/accepted_paymnets.dart';
import 'package:growersignup/sreens/collector/home_pages/collector_home_page.dart';
import 'package:growersignup/sreens/collector/home_pages/payment_select.dart';
import 'package:growersignup/sreens/collector/home_pages/to_pay_sreen.dart';
import 'package:growersignup/sreens/collector/log_in/collector_account_page.dart';
import 'package:growersignup/sreens/collector/log_in/collector_signin_page.dart';
import 'package:growersignup/sreens/collector/log_in/collector_signup.dart';
import 'package:growersignup/sreens/collector/orders/accepted_orders_page.dart';
import 'package:growersignup/sreens/grower/home_pages/grower_harvest.dart';
import 'package:growersignup/sreens/grower/home_pages/grower_home_page.dart';
import 'package:growersignup/sreens/grower/home_pages/grower_paid.dart';
import 'package:growersignup/sreens/grower/home_pages/pending_payment.dart';
import 'package:growersignup/sreens/grower/home_pages/pending_payments.dart';
import 'package:growersignup/sreens/grower/login/grower_signup.dart';
import 'package:growersignup/sreens/welcome_screens/welcome1.dart';

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
      // home: GrowerHomePage(email: 'Kasun@gmail.com',),
      // home: CollectorHomePage(email: 'imanuni603@gmail.com'),
      // home: PaymentsListScreen(collectorEmail: 'imanuni603@gmail.com',),
      // home: GrowerHomePage(email: 'nayodyanipun@gmail.com'),
      home: CollectorHomePage(email: 'Ha@gmail.com'),
    
      // home: PaymentSelect(email: 'imanuni603@gmail.com'),
    );
  }
}

