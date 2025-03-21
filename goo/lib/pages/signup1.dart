import 'package:flutter/material.dart';
import 'package:goo/pages/constant.dart';
import 'package:goo/pages/signup2.dart';

class SignUpPage extends StatelessWidget {
  SignUpPage({super.key});

  final TextEditingController firstNameController = TextEditingController();
  final TextEditingController lastNameController = TextEditingController();
  final TextEditingController nicController = TextEditingController();
  final TextEditingController address1Controller = TextEditingController();
  final TextEditingController address2Controller = TextEditingController();
  final TextEditingController cityController = TextEditingController();
  final TextEditingController postalCodeController = TextEditingController();
  final TextEditingController genderController = TextEditingController(text: "Male");

 @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kbackgroundcolor, // Light greenish background
      body: Center(
        child: SingleChildScrollView(
          child: Container(
            width: 350, 
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(color: Colors.black26, blurRadius: 5),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Center(
                  child: Text(
                    "Create An Account",
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 20),

                // Full Name
                const Text("Full Name:"),
                const SizedBox(height: 5),
                TextField(
                  controller: firstNameController,
                  decoration: inputDecoration("Enter First name"),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: lastNameController,
                  decoration: inputDecoration("Enter Last name"),
                ),

                const SizedBox(height: 15),

                // NIC Number
                const Text("NIC Number:"),
                const SizedBox(height: 5),
                TextField(
                  controller: nicController,
                  decoration: inputDecoration("Enter NIC number"),
                  keyboardType: TextInputType.number,
                ),

                const SizedBox(height: 15),

                // Address
                const Text("Address:"),
                const SizedBox(height: 5),
                TextField(
                  controller: address1Controller,
                  decoration: inputDecoration("Address line 1"),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: address2Controller,
                  decoration: inputDecoration("Address line 2"),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: cityController,
                  decoration: inputDecoration("City"),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: postalCodeController,
                  decoration: inputDecoration("Postal code"),
                  keyboardType: TextInputType.number,
                ),

                const SizedBox(height: 15),

                // Gender
                const Text("Gender:"),
                const SizedBox(height: 5),
                TextField(
                  controller: genderController,
                  readOnly: true,
                  decoration: inputDecoration("Male"),
                ),

                const SizedBox(height: 20),

                Center(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => SignUpPage2()), // Navigate to SignUpPage2
                      );
                    },

                    style: ElevatedButton.styleFrom(
                      backgroundColor: kselectioncolor,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(22),
                            ),
                            minimumSize: Size(208, 42)),
                            child: Text(
                              "Next",
                          style: TextStyle(color: const Color.fromARGB(255, 255, 255, 255),fontSize: 20),
                        ),
                  ),
                ),

                const SizedBox(height: 10),
              ],
            ),
          ),
        ),
      ),
    );
  }

  InputDecoration inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 15, vertical: 12),
    );
  }
}