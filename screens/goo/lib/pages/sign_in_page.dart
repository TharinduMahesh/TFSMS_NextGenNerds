import 'package:flutter/material.dart';
import 'package:goo/pages/constant.dart';
import 'package:goo/pages/signup1.dart';

class SignInPage extends StatefulWidget {
  const SignInPage({super.key});

  @override
  State<SignInPage> createState() => _SignInPageState();
}

class _SignInPageState extends State<SignInPage> {
  bool _obscurePassword = true; // For password visibility toggle

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kbackgroundcolor,
      body: Center(
        child: Container(
          width: MediaQuery.of(context).size.width * 0.8, // Responsive width
          padding: const EdgeInsets.all(20.0),
          decoration: BoxDecoration(
            color: const Color.fromARGB(255, 255, 255, 255),
            borderRadius: BorderRadius.circular(30.0),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Sign In / Sign Up Toggle
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  TextButton(
                    onPressed: () {
                      // Handle Sign In tab
                    },
                    style: TextButton.styleFrom(
                      backgroundColor: kdefaultselector,
                      padding: const EdgeInsets.symmetric(
                          horizontal: 20, vertical: 10),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20)),
                    ),
                    child: const Text("Sign In",
                        style: TextStyle(color: Colors.black)),
                  ),
                  TextButton(
                    onPressed: () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => SignUpPage()),);
                    },
                    style: TextButton.styleFrom(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 20, vertical: 10),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                        side: const BorderSide(color: Colors.grey),
                      ),
                    ),
                    child: const Text("Sign Up",
                        style: TextStyle(color: Colors.grey)),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Email Text Field
              const TextField(
                decoration: InputDecoration(
                  labelText: "Email",
                  border: UnderlineInputBorder(),
                ),
              ),
              const SizedBox(height: 10),

              // Password Text Field
              TextField(
                obscureText: _obscurePassword,
                decoration: InputDecoration(
                  labelText: "Password",
                  border: const UnderlineInputBorder(),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePassword ? Icons.visibility_off : Icons.visibility,
                      color: Colors.grey,
                    ),
                    onPressed: () {
                      setState(() {
                        _obscurePassword = !_obscurePassword;
                      });
                    },
                  ),
                ),
              ),
              const SizedBox(height: 20),
              TextField(
                obscureText: _obscurePassword,
                decoration: InputDecoration(
                  labelText: "Re Enter Password",
                  border: const UnderlineInputBorder(),
                  suffixIcon: IconButton(
                    icon: Icon(
                      _obscurePassword ? Icons.visibility_off : Icons.visibility,
                      color: Colors.grey,
                    ),
                    onPressed: () {
                      setState(() {
                        _obscurePassword = !_obscurePassword;
                      });
                    },
                  ),
                ),
              ),
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () {
                    // Handle forgot password
                  },
                  child: const Text(
                    "Forgot password?",
                    style: TextStyle(color: Colors.grey, fontSize: 12),
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // Sign In Button
              ElevatedButton(
                onPressed: () {
                  // Handle Sign In button press
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: kdefaultselector,
                  padding: const EdgeInsets.symmetric(
                      horizontal: 50, vertical: 15),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(25.0),
                  ),
                ),
                child: const Text(
                  "Sign In",
                  style: TextStyle(color: Colors.black, fontSize: 16),
                ),
              ),
              const SizedBox(height: 20),

              // OR separator
              Row(
                children: [
                  Expanded(child: Divider(color: Colors.grey.shade400)),
                  const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 8.0),
                    child: Text("or", style: TextStyle(color: Colors.grey)),
                  ),
                  Expanded(child: Divider(color: Colors.grey.shade400)),
                ],
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}