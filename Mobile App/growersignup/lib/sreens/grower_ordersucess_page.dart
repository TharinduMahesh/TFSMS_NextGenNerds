import 'package:flutter/material.dart';
import 'package:growersignup/sreens/grower_home_page.dart';


class GrowerOrdersucessPage extends StatefulWidget {
  const GrowerOrdersucessPage({super.key});

  @override
  State<GrowerOrdersucessPage> createState() => _MyWidgetState();
}

class _MyWidgetState extends State<GrowerOrdersucessPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF8FFEA),
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
                  Navigator.push(context, MaterialPageRoute(builder: (context) => GrowerHomePage()),);
                },
                style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF0C330D),
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
