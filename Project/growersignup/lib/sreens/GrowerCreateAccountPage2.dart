import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:intl/intl.dart'; // For date formatting

class GrowerCreateAccountPage2 extends StatefulWidget {
  final Map<String, String> initialDetails;

  const GrowerCreateAccountPage2({
    super.key,
    required this.initialDetails,
  });

  @override
  State<GrowerCreateAccountPage2> createState() => _GrowerCreateAccountPage2State();
}

class _GrowerCreateAccountPage2State extends State<GrowerCreateAccountPage2> {
  final _formKey = GlobalKey<FormState>();

  // Controllers & State
  final _dobController = TextEditingController(); // Displays selected date
  final _phoneController = TextEditingController();
  DateTime? _selectedDate;
  String? _selectedPaymentMethod;

  // Dropdown options
  final List<String> _paymentOptions = ['Bank', 'Cash'];

  // --- Define Colors ---
  static const Color pageBackgroundColor = Color(0xFFF0FBEF);
  static const Color cardBackgroundColor = Colors.white;
  static const Color titleColor = Color(0xFF0a4e41);
  static const Color labelColor = Colors.black87;
  static const Color inputBorderColor = Colors.black54;
  static const Color focusedInputBorderColor = titleColor;
  static const Color dropdownBackgroundColor = Color(0xFFDDF4DD);
  static const Color dropdownTextColor = Colors.black87;
  static const Color buttonColor = Color(0xFF0a4e41);
  static const Color buttonTextColor = Colors.white;
  static const Color progressBackgroundColor = Color(0xFFE0E0E0);
  static const Color progressValueColor = buttonColor;

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    _dobController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  // --- Date Picker Logic ---
  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime(DateTime.now().year - 18, DateTime.now().month, DateTime.now().day),
      firstDate: DateTime(1920),
      lastDate: DateTime.now(),
      builder: (context, child) {
        return Theme(
          data: ThemeData.light().copyWith(
            colorScheme: const ColorScheme.light(
              primary: buttonColor,
              onPrimary: Colors.white,
              onSurface: Colors.black,
            ),
            dialogBackgroundColor: Colors.white,
          ),
          child: child!,
        );
      },
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
        _dobController.text = DateFormat('yyyy/MM/dd').format(picked);
      });
    }
  }

  // --- Final Account Creation Logic ---
  void _createAccount() {
    if (_formKey.currentState!.validate()) {
      // Form is valid, gather all data
      final combinedDetails = {
        ...widget.initialDetails,
        'dateOfBirth': _selectedDate != null ? DateFormat('yyyy-MM-dd').format(_selectedDate!) : null,
        'phoneNumber': _phoneController.text,
        'paymentMethod': _selectedPaymentMethod,
      };

      combinedDetails.removeWhere((key, value) => value == null);

      // Placeholder success feedback
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Account creation successful (simulated)!'), backgroundColor: Colors.green),
      );
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
      appBar: AppBar(
        backgroundColor: pageBackgroundColor,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: titleColor),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Create An Account',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: titleColor,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 20.0),
            child: Container(
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
                    // Date of Birth
                    _buildLabel('Date Of Birth:'),
                    _buildDateField(context),
                    const SizedBox(height: 20),

                    // Phone Number
                    _buildLabel('Phone Number:'),
                    _buildTextField(
                      controller: _phoneController,
                      hintText: '+94 - 000000000',
                      keyboardType: TextInputType.phone,
                      inputFormatters: [
                        FilteringTextInputFormatter.allow(RegExp(r'[0-9\s\-\+]')),
                      ],
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Phone number required';
                        }
                        if (value.length < 10) {
                          return 'Please enter a valid phone number';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),

                    // Payment Method Dropdown
                    _buildLabel('How to get money:'),
                    _buildDropdown(
                      hint: 'Select method',
                      value: _selectedPaymentMethod,
                      items: _paymentOptions,
                      onChanged: (value) {
                        setState(() {
                          _selectedPaymentMethod = value;
                        });
                      },
                      validator: (value) => value == null ? 'Please select a payment method' : null,
                    ),
                    const SizedBox(height: 40),

                    // Create Account Button
                    Center(
                      child: ElevatedButton(
                        onPressed: _createAccount,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: buttonColor,
                          foregroundColor: buttonTextColor,
                          minimumSize: const Size(double.infinity, 50),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30.0),
                          ),
                          elevation: 2,
                        ),
                        child: const Text(
                          'Create Account',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Progress Indicator
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: const LinearProgressIndicator(
                        value: 1.0,
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

  // Helper for TextFields
  Widget _buildTextField({
    required TextEditingController controller,
    required String hintText,
    TextInputType keyboardType = TextInputType.text,
    String? Function(String?)? validator,
    List<TextInputFormatter>? inputFormatters,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
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
    );
  }

  // Helper for Date Picker Input
  Widget _buildDateField(BuildContext context) {
    return TextFormField(
      controller: _dobController,
      decoration: InputDecoration(
        labelText: 'Date of Birth',
        suffixIcon: IconButton(
          icon: const Icon(Icons.calendar_today),
          onPressed: () => _selectDate(context),
        ),
        border: const OutlineInputBorder(),
      ),
      readOnly: true,
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'Date of birth is required';
        }
        return null;
      },
    );
  }

  // Helper for Dropdown Input
  Widget _buildDropdown({
    required String hint,
    required String? value,
    required List<String> items,
    required void Function(String?) onChanged,
    String? Function(String?)? validator,
  }) {
    return DropdownButtonFormField<String>(
      value: value,
      onChanged: onChanged,
      items: items.map((String value) {
        return DropdownMenuItem<String>(
          value: value,
          child: Text(value),
        );
      }).toList(),
      decoration: InputDecoration(
        labelText: hint,
        border: const OutlineInputBorder(),
      ),
      validator: validator,
    );
  }
}
