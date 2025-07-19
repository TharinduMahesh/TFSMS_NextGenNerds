import 'package:flutter/material.dart';
import 'package:tfsms_app_frontend/pages/feedback/feedback_page.dart';
import 'package:tfsms_app_frontend/pages/harvest/harvest_screen.dart';
import 'package:tfsms_app_frontend/pages/weighing/home_page_weighing.dart';
import 'package:tfsms_app_frontend/pages/order/order_accepted_page.dart';
import 'package:tfsms_app_frontend/pages/order/order_rejected_page.dart';
import 'package:tfsms_app_frontend/pages/collector/collector_dashboard_page.dart';
import 'package:tfsms_app_frontend/pages/collector/weighing_pages.dart';
import 'pages/main_page.dart';
import 'pages/feedback/thank_you_page.dart';
import 'pages/harvest/harvest_form_page.dart';
import 'pages/weighing/new_weighing_page.dart';


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
        
        '/thank-you': (context) => const ThankYouPage(), // Thank You Page After Feedback
        '/new-weighing': (context) => const NewWeighingPage(),   // New Weighing Entry
        '/home-weighing': (context) => const WeighingListView(), // Weighing Home Page
        '/harvest': (context) => const HarvestScreen(), // Harvest Screen
        '/accept': (context) => const OrderAcceptedPage(),// Order Accepted Page
        '/reject': (context) => const OrderRejectedPage(),// Order Rejected Page
        '/feedback': (context) => const FeedbackPage(), // Feedback Page
        '/collector-dashboard': (context) => const CollectorDashboardPage(), // Collector Dashboard
        '/weighing-list': (context) => const WeighingListPage(), // Weighing List for Collector
      },
    );
  }
}