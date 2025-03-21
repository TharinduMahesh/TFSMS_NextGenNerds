import 'package:flutter/material.dart';
import 'package:goo/pages/constant.dart';
import 'package:goo/pages/successmsg.dart';
// ignore: depend_on_referenced_packages
import 'package:intl/intl.dart'; // For date formatting

class SignUpPage2 extends StatefulWidget {
  const SignUpPage2({super.key});

  @override
  State<SignUpPage2> createState() => _CreateAccountPageState();
}

class _CreateAccountPageState extends State<SignUpPage2> {
  final TextEditingController dobController = TextEditingController();
  final TextEditingController phoneController =
      TextEditingController(text: "+94 - ");
  String? selectedBank = "Bank";
  String? selectedCash = "Cash";

  InputDecoration inputDecoration(String hintText) {
    return InputDecoration(
      hintText: hintText,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
      ),
      contentPadding: EdgeInsets.symmetric(vertical: 10, horizontal: 15),
    );
  }

  Future<void> _selectDate(BuildContext context) async {
    DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (picked != null) {
      setState(() {
        dobController.text = DateFormat("yyyy/MM/dd").format(picked);
      });
    }
  }

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
                // Back Button
                Align(
                  alignment: Alignment.topLeft,
                  child: IconButton(
                    icon: const Icon(Icons.arrow_back),
                    onPressed: () {
                      Navigator.pop(context);
                    },
                  ),
                ),
                const Center(
                  child: Text(
                    "Create An Account",
                    style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(height: 20),
                const Text("Date Of Birth:"),
                const SizedBox(height: 5),
                TextField(
                  controller: dobController,
                  readOnly: true,
                  onTap: () => _selectDate(context),
                  decoration: inputDecoration("Year/Mon/Date").copyWith(
                    suffixIcon: const Icon(Icons.calendar_today),
                  ),
                ),
                const SizedBox(height: 15),

                const Text("Phone Number:"),
                const SizedBox(height: 5),
                TextField(
                  controller: phoneController,
                  keyboardType: TextInputType.phone,
                  decoration: inputDecoration("+94 - 000000000"),
                ),

                const SizedBox(height: 25),
                const Text("How to get money :"),
                Center(
                  child: Column(
                    children: [
                      const SizedBox(height: 10),
                      selectbutton("Bank"),
                      const SizedBox(height: 3),
                      selectbutton("Cash"),
                      const SizedBox(height: 30),
                    ],
                  ),
                ),

                // Create Account Button
                Center(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => Successmsg()),
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
                              "Create Account",
                          style: TextStyle(color: const Color.fromARGB(255, 255, 255, 255),fontSize: 20),
                        ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

Widget selectbutton(String text) {
  return Padding(
    padding: const EdgeInsets.all(4),
    child: ElevatedButton(
      onPressed: () {
        // Handle button press
      },
      style: ElevatedButton.styleFrom(
          backgroundColor: Color(0xFFDCF4A6),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(22),
          ),
          minimumSize: Size(264, 42)),
      child: Text(
        text,
        style: TextStyle(color: Colors.black),
      ),
    ),
  );
}
