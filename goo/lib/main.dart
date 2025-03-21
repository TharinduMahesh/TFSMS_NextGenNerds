import 'package:flutter/material.dart';
import 'package:goo/pages/sign_in_page.dart';

void main(){
  runApp(MyApp());
}


class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Harvest App',
      theme: ThemeData(primarySwatch: Colors.green),
      home: SignInPage(), // Ensure HarvestPage is defined
    );
  }
}