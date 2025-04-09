import 'package:flutter/material.dart';
import 'package:test15/main_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      title: 'Flutter API',
      debugShowCheckedModeBanner: false,
      home: MainPage(),
    );
  }
}
