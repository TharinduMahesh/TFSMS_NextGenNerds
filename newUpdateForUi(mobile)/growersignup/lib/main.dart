import 'package:flutter/material.dart';
import 'package:growersignup/sreens/Grower_notification_page.dart';
import 'package:growersignup/sreens/collector/home_pages/collector_home_page.dart';
import 'package:growersignup/sreens/collector/home_pages/collector_payment_history_page.dart';
import 'package:growersignup/sreens/collector/home_pages/collector_payment_select_page.dart';
import 'package:growersignup/sreens/collector/home_pages/collector_to_pay_screen.dart';
import 'package:growersignup/sreens/collector/home_pages/show_collector_edit_page.dart';
import 'package:growersignup/sreens/collector/log_in/collector_account_page.dart';
import 'package:growersignup/sreens/collector/log_in/collector_bank_details_page.dart';
import 'package:growersignup/sreens/collector/log_in/collector_signup.dart';
import 'package:growersignup/sreens/collector/orders/order_details_page.dart';
import 'package:growersignup/sreens/collector/orders/c_order_select_page.dart';
import 'package:growersignup/sreens/collector/orders/pending_orders_page.dart';
import 'package:growersignup/sreens/collector_confirm.dart';
import 'package:growersignup/sreens/conversation_pages/chat_screen.dart';
import 'package:growersignup/sreens/conversation_pages/conversation_list_screen.dart';
import 'package:growersignup/sreens/grower/home_pages/contactus_page.dart';
import 'package:growersignup/sreens/grower/home_pages/fertilizer_page.dart';
import 'package:growersignup/sreens/grower/home_pages/grower_harvest.dart';
import 'package:growersignup/sreens/grower/home_pages/grower_home_page.dart';
import 'package:growersignup/sreens/grower/login/grower_bank_detals.dart';
import 'package:growersignup/sreens/grower/login/grower_create_account.dart';
import 'package:growersignup/sreens/grower/login/grower_signup.dart';
import 'package:growersignup/sreens/grower/orders/g_a_b_c_details.dart';
import 'package:growersignup/sreens/grower/orders/g_order_selecttion.dart';
import 'package:growersignup/sreens/grower/orders/g_peding_orders.dart';
import 'package:growersignup/sreens/grower/orders/grower_location_page.dart';
import 'package:growersignup/sreens/grower/orders/grower_order_page.dart';
import 'package:growersignup/sreens/grower/orders/grower_order_request_page.dart';
import 'package:growersignup/sreens/grower/home_pages/grower_payment_page.dart';
import 'package:growersignup/sreens/grower_account_edit_page.dart';
import 'package:growersignup/sreens/harvest_overview_page.dart';
import 'package:growersignup/sreens/grower/home_pages/help_center.dart';
import 'package:growersignup/sreens/pay.dart';
import 'package:growersignup/sreens/grower/home_pages/show_supplier_details.dart';
import 'package:growersignup/sreens/welcome_screens/welcome1.dart';
import 'package:growersignup/sreens/welcome_screens/welcome2.dart';
import 'package:growersignup/sreens/welcome_screens/welcome4.dart';

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
      home: GrowerOrderDetailsSelectPage(email: 'grower1@example.com') // Replace with actual orderId
    );
  }
}


