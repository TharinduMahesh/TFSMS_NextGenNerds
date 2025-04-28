import 'package:flutter/material.dart';
import 'package:tfsms_app_frontend/pages/home_page_weighing.dart';
import 'pages/main_page.dart';
import 'pages/confirmation_page.dart';
import 'pages/harvest_form_page.dart';
import 'pages/new_weighing_page.dart';
import 'pages/report_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'TFSMS App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.green,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const MainPage(),             // Main Dashboard
        '/form': (context) => const HarvestFormPage(),   // Harvest Form
        '/confirmation': (context) => const ConfirmationPage(), // After Harvest Save
        '/new-weighing': (context) => const NewWeighingPage(),   // New Weighing Entry
        '/report': (context) => const ReportPage(),      // Weighing Report
        '/home-weighing': (context) => const HomePageWeighing(), // Weighing Home Page
      },
    );
  }
}
