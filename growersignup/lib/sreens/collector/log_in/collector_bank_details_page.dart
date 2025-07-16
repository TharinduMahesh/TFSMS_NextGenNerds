import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:growersignup/models/collector/collector_bankdetails_model.dart';
import 'package:growersignup/services/collector/collector_bank_details_api.dart';
import 'package:growersignup/sreens/collector/log_in/collector_account_success.dart'; // For input formatters

class collectorBankDetailsSetupPage extends StatefulWidget {
  final String email;

  const collectorBankDetailsSetupPage({super.key, required this.email});

  @override
  State<collectorBankDetailsSetupPage> createState() => _collectorBankDetailsSetupPageState();
}

class _collectorBankDetailsSetupPageState extends State<collectorBankDetailsSetupPage> {
  final _formKey = GlobalKey<FormState>();

  final _bankNameController = TextEditingController();
  final _branchController = TextEditingController();
  final _holderNameController = TextEditingController();
  final _accountNumberController = TextEditingController();

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
    _bankNameController.dispose();
    _branchController.dispose();
    _holderNameController.dispose();
    _accountNumberController.dispose();
    super.dispose();
  }

  Future<void> _submitBankDetails() async {
    if (_formKey.currentState!.validate()) {
      final detail = CollectorBankDetail(
        bankName: _bankNameController.text.trim(),
        branch: _branchController.text.trim(),
        accountHolderName: _holderNameController.text.trim(),
        accountNumber: _accountNumberController.text.trim(),
        collectorEmail: widget.email.trim(),
      );

      final success = await CollectorBankApi.addBankDetail(detail);

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Bank details saved successfully!'), backgroundColor: Colors.green),
        );

        Navigator.of(context).pushReplacement( 
                      MaterialPageRoute(builder: (context) => CollectorSignInSuccessPage(email: widget.email,)),
                      );

        // Navigate or proceed
        // Navigator.push(...);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to save bank details'), backgroundColor: Colors.redAccent),
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
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  'Bank Details',
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
                        spreadRadius: 1, blurRadius: 8, offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildTextFieldWithLabel(
                          label: 'Bank Name:',
                          controller: _bankNameController,
                          textCapitalization: TextCapitalization.words,
                        ),
                        _buildTextFieldWithLabel(
                          label: 'Branch',
                          controller: _branchController,
                          textCapitalization: TextCapitalization.words,
                        ),
                        _buildTextFieldWithLabel(
                          label: 'Holder Name',
                          controller: _holderNameController,
                          textCapitalization: TextCapitalization.words,
                        ),
                        _buildTextFieldWithLabel(
                          label: 'Account Number',
                          controller: _accountNumberController,
                          keyboardType: TextInputType.number,
                          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                        ),
                        const SizedBox(height: 30),
                        Center(
                          child: ElevatedButton(
                            onPressed: _submitBankDetails,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: nextButtonColor,
                              foregroundColor: nextButtonTextColor,
                              minimumSize: const Size(double.infinity, 50),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(30.0),
                              ),
                              elevation: 2,
                            ),
                            child: const Text('Submit', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                          ),
                        ),
                        const SizedBox(height: 20),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: LinearProgressIndicator(
                            value: 1.0,
                            minHeight: 8,
                            backgroundColor: progressBackgroundColor,
                            valueColor: const AlwaysStoppedAnimation<Color>(progressValueColor),
                          ),
                        ),
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

  Widget _buildTextFieldWithLabel({
    required String label,
    required TextEditingController controller,
    TextInputType? keyboardType,
    List<TextInputFormatter>? inputFormatters,
    TextCapitalization textCapitalization = TextCapitalization.none,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 18.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(color: labelColor, fontWeight: FontWeight.w500, fontSize: 14)),
          const SizedBox(height: 8),
          TextFormField(
            controller: controller,
            keyboardType: keyboardType,
            inputFormatters: inputFormatters,
            textCapitalization: textCapitalization,
            decoration: InputDecoration(
              filled: true,
              fillColor: Colors.white,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15.0),
                borderSide: BorderSide(color: inputBorderColor.withOpacity(0.5)),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15.0),
                borderSide: BorderSide(color: inputBorderColor.withOpacity(0.5)),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15.0),
                borderSide: const BorderSide(color: focusedInputBorderColor, width: 1.5),
              ),
              errorBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15.0),
                borderSide: const BorderSide(color: Colors.redAccent, width: 1.0),
              ),
              contentPadding: const EdgeInsets.symmetric(vertical: 14.0, horizontal: 15.0),
            ),
            validator: (value) => value == null || value.isEmpty ? 'This field is required' : null,
            autovalidateMode: AutovalidateMode.onUserInteraction,
          ),
        ],
      ),
    );
  }
}
