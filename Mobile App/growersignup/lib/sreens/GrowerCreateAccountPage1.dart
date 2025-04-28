import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // For input formatters if needed
import 'package:growersignup/sreens/GrowerCreateAccountPage2.dart';

class GrowerCreateAccountPage1 extends StatefulWidget {
  final String GrowerEmail;

  const GrowerCreateAccountPage1({super.key, required this.GrowerEmail});

  @override
  State<GrowerCreateAccountPage1> createState() => _GrowerCreateAccountPage1State();
}

class _GrowerCreateAccountPage1State extends State<GrowerCreateAccountPage1> {
  final _formKey = GlobalKey<FormState>();

  // Controllers for text fields
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _nicController = TextEditingController();
  final _address1Controller = TextEditingController();
  final _address2Controller = TextEditingController();
  final _cityController = TextEditingController();
  final _postalCodeController = TextEditingController();
  final _genderController = TextEditingController(); // Consider using Dropdown later

  // --- Define Colors (estimated) ---
  static const Color pageBackgroundColor = Color(0xFFF0FBEF); // Very light green
  static const Color cardBackgroundColor = Colors.white;
  static const Color titleColor = Color(0xFF0a4e41); // Dark green text
  static const Color labelColor = Colors.black87;
  static const Color inputBorderColor = Colors.black54;
  static const Color focusedInputBorderColor = titleColor;
  static const Color nextButtonColor = Color(0xFF0a4e41);
  static const Color nextButtonTextColor = Colors.white;
  static const Color progressBackgroundColor = Color(0xFFE0E0E0); // Light grey for progress bg
  static const Color progressValueColor = nextButtonColor; // Dark green progress
  // --- End Colors ---

  @override
  void dispose() {
    // Dispose controllers
    _firstNameController.dispose();
    _lastNameController.dispose();
    _nicController.dispose();
    _address1Controller.dispose();
    _address2Controller.dispose();
    _cityController.dispose();
    _postalCodeController.dispose();
    _genderController.dispose();
    super.dispose();
  }

  void _goToNextPage() {
    if (_formKey.currentState!.validate()) {
      // Form is valid, gather data
      final personalDetails = {
        'firstName': _firstNameController.text,
        'lastName': _lastNameController.text,
        'nic': _nicController.text,
        'address1': _address1Controller.text,
        'address2': _address2Controller.text,
        'city': _cityController.text,
        'postalCode': _postalCodeController.text,
        'gender': _genderController.text, // Remember this might change if using a dropdown
      };

      print("--- Page 1 Details ---");
      print(personalDetails);
      print("----------------------");

      // *** Navigate to Page 2, passing the data ***
      // Navigator.push(
      //   context,
      //   MaterialPageRoute(
      //     builder: (context) => GrowerCreateAccountPage2(
      //       initialDetails: personalDetails,
      //     ),
      //   ),
      // );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill all required fields correctly'), backgroundColor: Colors.orangeAccent),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: pageBackgroundColor,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 30.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Page Title
                const Text(
                  'Create An Account',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: titleColor,
                  ),
                ),
                const SizedBox(height: 25),

                // White Card Container
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 30.0),
                  decoration: BoxDecoration(
                    color: cardBackgroundColor,
                    borderRadius: BorderRadius.circular(20.0),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.withOpacity(0.15),
                        spreadRadius: 1,
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Full Name Fields
                        _buildLabel('Full Name:'),
                        _buildTextField(
                          controller: _firstNameController,
                          hintText: 'Enter First name',
                          validator: (value) => value == null || value.isEmpty ? 'First name required' : null,
                        ),
                        const SizedBox(height: 10),
                        _buildTextField(
                          controller: _lastNameController,
                          hintText: 'Enter Last name',
                          validator: (value) => value == null || value.isEmpty ? 'Last name required' : null,
                        ),
                        const SizedBox(height: 20),

                        // NIC Number
                        _buildLabel('NIC Number:'),
                        _buildTextField(
                          controller: _nicController,
                          hintText: 'Enter NIC number',
                          keyboardType: TextInputType.text,
                          validator: (value) => value == null || value.isEmpty ? 'NIC number required' : null,
                        ),
                        const SizedBox(height: 20),

                        // Address Fields
                         _buildLabel('Address:'),
                        _buildTextField(
                          controller: _address1Controller,
                          hintText: 'Address line 1',
                          keyboardType: TextInputType.streetAddress,
                           validator: (value) => value == null || value.isEmpty ? 'Address line 1 required' : null,
                        ),
                        const SizedBox(height: 10),
                         _buildTextField(
                          controller: _address2Controller,
                          hintText: 'Address line 2 (Optional)',
                          keyboardType: TextInputType.streetAddress,
                        ),
                         const SizedBox(height: 10),
                         _buildTextField(
                          controller: _cityController,
                          hintText: 'City',
                           validator: (value) => value == null || value.isEmpty ? 'City required' : null,
                        ),
                         const SizedBox(height: 10),
                         _buildTextField(
                          controller: _postalCodeController,
                          hintText: 'Postal code',
                          keyboardType: TextInputType.number,
                           validator: (value) => value == null || value.isEmpty ? 'Postal code required' : null,
                        ),
                        const SizedBox(height: 20),

                        // Gender Field
                        _buildLabel('Gender:'),
                         _buildTextField(
                          controller: _genderController,
                          hintText: 'Enter Gender',
                           validator: (value) => value == null || value.isEmpty ? 'Gender required' : null,
                        ),
                        const SizedBox(height: 30),




                        // Next Button
                        Center(
                          child: ElevatedButton(
                            onPressed: _goToNextPage,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: nextButtonColor,
                              foregroundColor: nextButtonTextColor,
                              minimumSize: const Size(double.infinity, 50),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(30.0),
                              ),
                              elevation: 2,
                            ),
                            child: const Text(
                              'Next',
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ),
                        const SizedBox(height: 20),

                        // Progress Indicator
                        ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: const LinearProgressIndicator(
                            value: 0.5, // Example: Step 1 of 2
                            minHeight: 8,
                            backgroundColor: progressBackgroundColor,
                            valueColor: AlwaysStoppedAnimation<Color>(progressValueColor),
                          ),
                        ),
                        const SizedBox(height: 5),
                      ],
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

  // Helper Widget for Labels
  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 5.0),
      child: Text(
        text,
        style: const TextStyle(
          color: labelColor,
          fontWeight: FontWeight.w500,
          fontSize: 14,
        ),
      ),
    );
  }

  // Helper Widget for TextFields (Rounded Border Style)
  Widget _buildTextField({
    required TextEditingController controller,
    required String hintText,
    TextInputType keyboardType = TextInputType.text,
    bool obscureText = false,
    String? Function(String?)? validator,
    List<TextInputFormatter>? inputFormatters,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      obscureText: obscureText,
      inputFormatters: inputFormatters,
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: TextStyle(color: Colors.grey[500], fontSize: 14),
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: BorderSide(color: inputBorderColor.withOpacity(0.5)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: BorderSide(color: inputBorderColor.withOpacity(0.5)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: const BorderSide(color: focusedInputBorderColor, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: const BorderSide(color: Colors.redAccent, width: 1.0),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: const BorderSide(color: Colors.redAccent, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(vertical: 14.0, horizontal: 15.0),
      ),
      validator: validator,
      autovalidateMode: AutovalidateMode.onUserInteraction,
    );
  }
}
