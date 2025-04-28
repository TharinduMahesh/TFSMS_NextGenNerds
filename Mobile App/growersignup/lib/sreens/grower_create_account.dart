import 'package:flutter/material.dart';
import 'package:flutter/services.dart'; // For input formatters
import 'package:growersignup/models/grower_Account.dart';
import 'package:growersignup/services/grower_create_api.dart';
import 'package:growersignup/sreens/grower_account_success_pade.dart';
import 'package:intl/intl.dart'; // For date formatting

// Placeholder for success page or login page
// import 'account_created_page.dart';
// import 'grower_signin_page.dart';

class GrowerCreateAccountPage extends StatefulWidget {
  final String email;
  const GrowerCreateAccountPage({super.key, required this.email});

  @override
  State<GrowerCreateAccountPage> createState() =>
      _GrowerCreateAccountPageState();
}

class _GrowerCreateAccountPageState extends State<GrowerCreateAccountPage> {
  final _formKey = GlobalKey<FormState>();

  // == Controllers for ALL Text Fields ==
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _nicController = TextEditingController();
  final _address1Controller = TextEditingController();
  final _address2Controller = TextEditingController();
  final _cityController = TextEditingController();
  final _postalCodeController = TextEditingController();
  final _dobController = TextEditingController(); // For display only
  final _phoneController = TextEditingController();

  final _growerCreateApi = GrowerCreateApi(); // Assuming you have an API class

  // == State Variables for Dropdowns / Date Picker ==
  DateTime? _selectedDate;
  String? _selectedGender;
  String? _selectedPaymentMethod;

  // == Options Lists ==
  final List<String> _genderOptions = [
    'Male',
    'Female',
    'Other',
    'Prefer not to say',
  ];
  final List<String> _paymentOptions = ['Bank', 'Cash'];

  // --- Define Colors (Consolidated & estimated) ---
  static const Color pageBackgroundColor = Color(0xFFF0FBEF);
  static const Color cardBackgroundColor = Colors.white;
  static const Color titleColor = Color(0xFF0a4e41);
  static const Color labelColor = Colors.black87;
  static const Color inputBorderColor = Colors.black54;
  static const Color focusedInputBorderColor = titleColor;
  static const Color dropdownBackgroundColor = Color(
    0xFFE8F5E9,
  ); // Slightly adjusted dropdown green
  static const Color dropdownTextColor = Colors.black87;
  static const Color buttonColor = Color(0xFF0a4e41);
  static const Color buttonTextColor = Colors.white;
  // --- End Colors ---

  @override
  void dispose() {
    // Dispose ALL controllers
    _firstNameController.dispose();
    _lastNameController.dispose();
    _nicController.dispose();
    _address1Controller.dispose();
    _address2Controller.dispose();
    _cityController.dispose();
    _postalCodeController.dispose();
    _dobController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  void _createAccount() async {
  if (_formKey.currentState?.validate() ?? false) {
    GrowerAccountModel? newGrower = GrowerAccountModel(
      GrowerFirstName: _firstNameController.text,
      GrowerLastName: _lastNameController.text,
      GrowerNIC: _nicController.text,
      GrowerAddressLine1: _address1Controller.text,
      GrowerAddressLine2: _address2Controller.text,
      GrowerCity: _cityController.text,
      GrowerPostalCode: _postalCodeController.text,
      GrowerGender: _selectedGender ?? '',
      GrowerDOB: _selectedDate ?? DateTime.now(), // Use _selectedDate directly or a default value
      GrowerPhoneNum: _phoneController.text,
      MoneyMethod: _selectedPaymentMethod ?? '',
      GrowerEmail: widget.email,
    );
    try {
      
        // Call the sign-in API
        GrowerAccountModel newGAccountModel = await _growerCreateApi.groweraccount(newGrower);
        // If successful, show success message or navigate to another page
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Sign in successful!')));
        print('Sign in successful: ${newGAccountModel.toJson()}'); // Debugging output

        // Navigate to another page if needed
        Navigator.push(context, MaterialPageRoute(builder: (context) => GrowerSignInSuccessPage()));
        
      } catch (e) {
        // Handle error if the API call fails
        print('Error during sign in: $e');
      }

  }
}




  // --- Date Picker Logic ---
  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate:
          _selectedDate ??
          DateTime(
            DateTime.now().year - 18,
            DateTime.now().month,
            DateTime.now().day,
          ),
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: pageBackgroundColor,
      appBar: AppBar(
        // Keep AppBar for navigation context
        backgroundColor: pageBackgroundColor,
        elevation: 0,
        leading: IconButton(
          // Allow user to go back if needed
          icon: const Icon(Icons.arrow_back_ios, color: titleColor),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text(
          'Create An Account',
          style: TextStyle(
            fontSize: 22, // Adjusted size
            fontWeight: FontWeight.bold,
            color: titleColor,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(
              horizontal: 20.0,
              vertical: 20.0,
            ),
            child: Container(
              // White Card Container
              padding: const EdgeInsets.symmetric(
                horizontal: 20.0,
                vertical: 30.0,
              ),
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
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text("Received Gmail: ${widget.email}"),
                    // == Personal Details ==
                    _buildLabel('Full Name:'),
                    _buildTextField(
                      controller: _firstNameController,
                      hintText: 'Enter First name',
                      validator:
                          (v) => v == null || v.isEmpty ? 'Required' : null,
                      textCapitalization: TextCapitalization.words,
                    ),
                    const SizedBox(height: 10),
                    _buildTextField(
                      controller: _lastNameController,
                      hintText: 'Enter Last name',
                      validator:
                          (v) => v == null || v.isEmpty ? 'Required' : null,
                      textCapitalization: TextCapitalization.words,
                    ),
                    const SizedBox(height: 20),

                    _buildLabel('NIC Number:'),
                    _buildTextField(
                      controller: _nicController,
                      hintText: 'Enter NIC number',
                      validator:
                          (v) => v == null || v.isEmpty ? 'Required' : null,
                      // Add specific format validation if needed
                    ),
                    const SizedBox(height: 20),

                    _buildLabel('Address:'),
                    _buildTextField(
                      controller: _address1Controller,
                      hintText: 'Address line 1',
                      validator:
                          (v) => v == null || v.isEmpty ? 'Required' : null,
                      textCapitalization: TextCapitalization.words,
                    ),
                    const SizedBox(height: 10),
                    _buildTextField(
                      controller: _address2Controller,
                      hintText: 'Address line 2 (Optional)',
                      textCapitalization: TextCapitalization.words,
                      // No validator for optional field
                    ),
                    const SizedBox(height: 10),
                    _buildTextField(
                      controller: _cityController,
                      hintText: 'City',
                      validator:
                          (v) => v == null || v.isEmpty ? 'Required' : null,
                      textCapitalization: TextCapitalization.words,
                    ),
                    const SizedBox(height: 10),
                    _buildTextField(
                      controller: _postalCodeController,
                      hintText: 'Postal code',
                      keyboardType: TextInputType.number,
                      validator:
                          (v) => v == null || v.isEmpty ? 'Required' : null,
                    ),
                    const SizedBox(height: 20),

                    // == Gender Dropdown ==
                    _buildLabel('Gender:'),
                    _buildDropdown(
                      hint: 'Select Gender',
                      value: _selectedGender,
                      items: _genderOptions,
                      onChanged:
                          (value) => setState(() => _selectedGender = value),
                      validator:
                          (value) =>
                              value == null ? 'Please select gender' : null,
                    ),
                    const SizedBox(height: 20),

                    // == Date of Birth ==
                    _buildLabel('Date Of Birth:'),
                    _buildDateField(context),
                    const SizedBox(height: 20),

                    // == Contact & Payment ==
                    _buildLabel('Phone Number:'),
                    _buildTextField(
                      controller: _phoneController,
                      hintText: '+94 - 000000000',
                      keyboardType: TextInputType.phone,
                      inputFormatters: [
                        FilteringTextInputFormatter.allow(
                          RegExp(r'[0-9\s\-\+]'),
                        ),
                      ],
                      validator: (v) {
                        if (v == null || v.isEmpty) return 'Required';
                        if (v.length < 10)
                          return 'Invalid phone number'; // Example
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),

                    _buildLabel('How to get money:'),
                    _buildDropdown(
                      hint: 'Select method',
                      value: _selectedPaymentMethod,
                      items: _paymentOptions,
                      onChanged:
                          (value) =>
                              setState(() => _selectedPaymentMethod = value),
                      validator:
                          (value) =>
                              value == null
                                  ? 'Please select payment method'
                                  : null,
                    ),
                    const SizedBox(height: 40), // Space before button
                    // == Submit Button ==
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
                          elevation: 3,
                        ),
                        child: const Text(
                          'Create Account',//here
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 10), // Padding at the bottom of card
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  // --- Helper Widgets (Reused) ---

  Widget _buildLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6.0, top: 0), // Adjusted padding
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

Widget _buildTextField({
  required TextEditingController controller,
  required String hintText,
  TextInputType keyboardType = TextInputType.text,
  bool obscureText = false,
  String? Function(String?)? validator,
  List<TextInputFormatter>? inputFormatters,
  TextCapitalization textCapitalization = TextCapitalization.none,
}) {
  return TextFormField(
    controller: controller,
    obscureText: obscureText,
    keyboardType: keyboardType,
    validator: validator,
    inputFormatters: inputFormatters,
    textCapitalization: textCapitalization,
    decoration: InputDecoration(
      hintText: hintText,
      filled: true,
      fillColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 14.0),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10.0),
        borderSide: const BorderSide(color: inputBorderColor),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10.0),
        borderSide: const BorderSide(color: focusedInputBorderColor, width: 2),
      ),
    ),
  );
}


  Widget _buildDateField(BuildContext context) {
    return TextFormField(
      controller: _dobController,
      readOnly: true,
      decoration: InputDecoration(
        hintText: 'Year/Mon/Date',
        hintStyle: TextStyle(color: Colors.grey[500], fontSize: 14),
        filled: true,
        fillColor: Colors.white,
        suffixIcon: Icon(
          Icons.calendar_today_outlined,
          color: inputBorderColor.withOpacity(0.7),
        ),
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
          borderSide: const BorderSide(
            color: focusedInputBorderColor,
            width: 1.5,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: const BorderSide(color: Colors.redAccent, width: 1.0),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: const BorderSide(color: Colors.redAccent, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(
          vertical: 14.0,
          horizontal: 15.0,
        ),
        isDense: true,
      ),
      onTap: () {
        FocusScope.of(context).requestFocus(FocusNode());
        _selectDate(context);
      },
      validator:
          (value) =>
              (value == null || value.isEmpty)
                  ? 'Please select date of birth'
                  : null,
      autovalidateMode: AutovalidateMode.onUserInteraction,
    );
  }

  Widget _buildDropdown({
    required String hint,
    required String? value,
    required List<String> items,
    required ValueChanged<String?> onChanged,
    String? Function(String?)? validator,
  }) {
    return DropdownButtonFormField<String>(
      value: value,
      items:
          items
              .map(
                (item) => DropdownMenuItem<String>(
                  value: item,
                  child: Text(
                    item,
                    style: const TextStyle(
                      color: dropdownTextColor,
                      fontSize: 14,
                    ),
                  ),
                ),
              )
              .toList(),
      onChanged: onChanged,
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: TextStyle(color: Colors.grey[600], fontSize: 14),
        filled: true,
        fillColor: dropdownBackgroundColor,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: BorderSide.none,
        ), // Changed to match text field border
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: const BorderSide(
            color: focusedInputBorderColor,
            width: 1.5,
          ),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: const BorderSide(color: Colors.redAccent, width: 1.0),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: const BorderSide(color: Colors.redAccent, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(
          vertical: 14.0,
          horizontal: 15.0,
        ), // Match text field padding
        isDense: true,
      ),
      dropdownColor: dropdownBackgroundColor.withOpacity(0.95),
      icon: Icon(
        Icons.keyboard_arrow_down,
        color: dropdownTextColor.withOpacity(0.8),
      ),
      validator: validator,
      autovalidateMode: AutovalidateMode.onUserInteraction,
    );
  }
}
