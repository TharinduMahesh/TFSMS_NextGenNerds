import 'package:flutter/material.dart';
import 'package:goo/pages/constant.dart';
import 'package:goo/pages/supplier_home_page.dart';

class Successmsg extends StatefulWidget {
  const Successmsg({super.key});

  @override
  State<Successmsg> createState() => _MyWidgetState();
}

class _MyWidgetState extends State<Successmsg> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kbackgroundcolor,
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 50),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'You have been signed in successfully.!',
                style: TextStyle(
                  fontSize: 30,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(builder: (context) => SupplierHomePage()),);
                },
                style: ElevatedButton.styleFrom(
                    backgroundColor: kselectioncolor,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(22),
                      ),
                      minimumSize: Size(303, 51)),                            child: Text(
                        "Continue",
                      style: TextStyle(color: const Color.fromARGB(255, 255, 255, 255),fontSize: 20),
                  ),
                ),             
            ],
          ),
        ),
      ),
    );
  }
}
