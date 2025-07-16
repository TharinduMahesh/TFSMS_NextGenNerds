import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:growersignup/models/collector/collector_account.dart';
import 'package:growersignup/services/collector/colector_account_api.dart';
import 'package:growersignup/sreens/collector/log_in/collector_bank_details_page.dart';

class CollectorAccountCreatePage1 extends StatefulWidget {
  final String email;
  const CollectorAccountCreatePage1({super.key, required this.email});

  @override
  State<CollectorAccountCreatePage1> createState() => _CollectorAccountCreatePage1State();
}

class _CollectorAccountCreatePage1State extends State<CollectorAccountCreatePage1> {
  final _formKey = GlobalKey<FormState>();

  // Controllers for all input fields
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _nicController = TextEditingController();
  final _address1Controller = TextEditingController();
  final _address2Controller = TextEditingController();
  final _cityController = TextEditingController();
  final _postalCodeController = TextEditingController();
  final _genderController = TextEditingController();
  final _dobController = TextEditingController();
  final _phoneController = TextEditingController();
  final _vehicleNumController = TextEditingController();

  DateTime? selectedDOB;

  // --- Define Colors ---
  static const Color pageBackgroundColor = Color(0xFFF0FBEF);
  static const Color cardBackgroundColor = Colors.white;
  static const Color titleColor = Color(0xFF0a4e41);
  static const Color labelColor = Colors.black87;
  static const Color inputBorderColor = Colors.black54;
  static const Color focusedInputBorderColor = titleColor;
  static const Color nextButtonColor = Color(0xFF0a4e41);
  static const Color nextButtonTextColor = Colors.white;
  static const Color progressBackgroundColor = Color(0xFFE0E0E0);
  static const Color progressValueColor = Colors.black;

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _nicController.dispose();
    _address1Controller.dispose();
    _address2Controller.dispose();
    _cityController.dispose();
    _postalCodeController.dispose();
    _genderController.dispose();
    _dobController.dispose();
    _phoneController.dispose();
    _vehicleNumController.dispose();
    super.dispose();
  }

  void _goToNextPage() async {
    if (_formKey.currentState!.validate() && selectedDOB != null) {
      final collector = CollectorAccount(
        collectorFirstName: _firstNameController.text.trim(),
        collectorLastName: _lastNameController.text.trim(),
        collectorNIC: _nicController.text.trim(),
        collectorAddressLine1: _address1Controller.text.trim(),
        collectorAddressLine2: _address2Controller.text.trim(),
        collectorCity: _cityController.text.trim(),
        collectorPostalCode: _postalCodeController.text.trim(),
        collectorGender: _genderController.text.trim(),
        collectorDOB: selectedDOB!,
        collectorPhoneNum: _phoneController.text.trim(),
        collectorVehicleNum: _vehicleNumController.text.trim(),
        collectorEmail: widget.email,
      );

      final success = await CollectorApi.postCollectorAccount(collector);

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Collector account created successfully'), backgroundColor: Colors.green),
        );
        // Navigate to the next page
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => collectorBankDetailsSetupPage(email: widget.email)),
        );
        // TODO: Navigate or clear form
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to create collector account'), backgroundColor: Colors.redAccent),
        );
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill all required fields'), backgroundColor: Colors.orangeAccent),
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
              children: [
                const Text(
                  'Create An Account',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: titleColor),
                ),
                const SizedBox(height: 25),

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

                        _buildLabel('NIC Number:'),
                        _buildTextField(
                          controller: _nicController,
                          hintText: 'Enter NIC number',
                          validator: (value) => value == null || value.isEmpty ? 'NIC required' : null,
                        ),
                        const SizedBox(height: 20),

                        _buildLabel('Address:'),
                        _buildTextField(
                          controller: _address1Controller,
                          hintText: 'Address line 1',
                          keyboardType: TextInputType.streetAddress,
                          validator: (value) => value == null || value.isEmpty ? 'Address required' : null,
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

                        _buildLabel('Gender:'),
                        _buildTextField(
                          controller: _genderController,
                          hintText: 'Enter gender',
                          validator: (value) => value == null || value.isEmpty ? 'Gender required' : null,
                        ),
                        const SizedBox(height: 20),

                        _buildLabel('Phone Number:'),
                        _buildTextField(
                          controller: _phoneController,
                          hintText: 'Enter phone number',
                          keyboardType: TextInputType.phone,
                          validator: (value) => value == null || value.isEmpty ? 'Phone number required' : null,
                        ),
                        const SizedBox(height: 20),

                        _buildLabel('Vehicle Number:'),
                        _buildTextField(
                          controller: _vehicleNumController,
                          hintText: 'Enter vehicle number',
                          validator: (value) => value == null || value.isEmpty ? 'Vehicle number required' : null,
                        ),
                        const SizedBox(height: 20),

                        _buildLabel('Date of Birth:'),
                        TextFormField(
                          controller: _dobController,
                          readOnly: true,
                          decoration: InputDecoration(
                            hintText: 'Select date of birth',
                            suffixIcon: const Icon(Icons.calendar_today),
                            filled: true,
                            fillColor: Colors.white,
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          onTap: () async {
                            final picked = await showDatePicker(
                              context: context,
                              initialDate: DateTime(2000),
                              firstDate: DateTime(1960),
                              lastDate: DateTime.now(),
                            );
                            if (picked != null) {
                              setState(() {
                                selectedDOB = picked;
                                _dobController.text = "${picked.year}-${picked.month.toString().padLeft(2, '0')}-${picked.day.toString().padLeft(2, '0')}";
                              });
                            }
                          },
                          validator: (_) => selectedDOB == null ? 'DOB required' : null,
                        ),
                        const SizedBox(height: 30),

                        Center(
                          child: ElevatedButton(
                            onPressed: _goToNextPage,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: nextButtonColor,
                              foregroundColor: nextButtonTextColor,
                              minimumSize: const Size(double.infinity, 50),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30.0)),
                              elevation: 2,
                            ),
                            child: const Text('Next', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                          ),
                        ),
                        const SizedBox(height: 20),

                        ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: LinearProgressIndicator(
                            value: 0.33,
                            minHeight: 8,
                            backgroundColor: progressBackgroundColor,
                            valueColor: const AlwaysStoppedAnimation<Color>(progressValueColor),
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

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 5.0),
      child: Text(text, style: const TextStyle(color: labelColor, fontWeight: FontWeight.w500, fontSize: 14)),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hintText,
    TextInputType keyboardType = TextInputType.text,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      textCapitalization: TextCapitalization.words,
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: TextStyle(color: Colors.grey[500], fontSize: 14),
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12.0)),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12.0), borderSide: BorderSide(color: inputBorderColor.withOpacity(0.5))),
        focusedBorder: const OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12.0)), borderSide: BorderSide(color: focusedInputBorderColor, width: 1.5)),
        errorBorder: const OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12.0)), borderSide: BorderSide(color: Colors.redAccent, width: 1.0)),
        contentPadding: const EdgeInsets.symmetric(vertical: 14.0, horizontal: 15.0),
      ),
      validator: validator,
      autovalidateMode: AutovalidateMode.onUserInteraction,
    );
  }
}
