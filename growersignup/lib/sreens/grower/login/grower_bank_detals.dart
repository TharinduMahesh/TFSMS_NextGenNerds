import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/models/grower/grower_bank_details_model.dart';
import 'package:growersignup/services/grower/grower_bank_details_api.dart';
import 'package:growersignup/sreens/grower/login/grower_account_success_pade.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';

class GrowerBankDetailsSetupPage extends StatefulWidget {
  final String email;

  const GrowerBankDetailsSetupPage({super.key, required this.email});

  @override
  State<GrowerBankDetailsSetupPage> createState() => _GrowerBankDetailsSetupPageState();
}

class _GrowerBankDetailsSetupPageState extends State<GrowerBankDetailsSetupPage> {
  final _formKey = GlobalKey<FormState>();
  final _bankNameController = TextEditingController();
  final _branchController = TextEditingController();
  final _holderNameController = TextEditingController();
  final _accountNumberController = TextEditingController();

  @override
  void dispose() {
    _bankNameController.dispose();
    _branchController.dispose();
    _holderNameController.dispose();
    _accountNumberController.dispose();
    super.dispose();
  }

  Future<void> _submitBankDetails(LanguageProvider languageProvider) async {
    if (_formKey.currentState!.validate()) {
      final detail = GrowerBankDetail(
        bankName: _bankNameController.text.trim(),
        branch: _branchController.text.trim(),
        accountHolderName: _holderNameController.text.trim(),
        accountNumber: _accountNumberController.text.trim(),
        growerEmail: widget.email.trim(),
      );

      final success = await GrowerBankApi.addBankDetail(detail);

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(languageProvider.getText('bankSuccess')), backgroundColor: Colors.green),
        );

        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => GrowerSignInSuccessPage(email: widget.email)),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(languageProvider.getText('bankFail')), backgroundColor: Colors.redAccent),
        );
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(languageProvider.getText('fillFields')), backgroundColor: Colors.orangeAccent),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, child) {
        return Scaffold(
          backgroundColor: const Color(0xFFF0FBEF),
          body: SafeArea(
            child: Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 30.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      languageProvider.getText('bankDetails'),
                      style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF0a4e41)),
                    ),
                    const SizedBox(height: 25),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 30.0),
                      decoration: BoxDecoration(
                        color: Colors.white,
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
                            _buildTextFieldWithLabel(
                              label: languageProvider.getText('bankName'),
                              controller: _bankNameController,
                              textCapitalization: TextCapitalization.words,
                            ),
                            _buildTextFieldWithLabel(
                              label: languageProvider.getText('branch'),
                              controller: _branchController,
                              textCapitalization: TextCapitalization.words,
                            ),
                            _buildTextFieldWithLabel(
                              label: languageProvider.getText('holderName'),
                              controller: _holderNameController,
                              textCapitalization: TextCapitalization.words,
                            ),
                            _buildTextFieldWithLabel(
                              label: languageProvider.getText('accountNumber'),
                              controller: _accountNumberController,
                              keyboardType: TextInputType.number,
                              inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                            ),
                            const SizedBox(height: 30),
                            Center(
                              child: ElevatedButton(
                                onPressed: () => _submitBankDetails(languageProvider),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF0a4e41),
                                  foregroundColor: Colors.white,
                                  minimumSize: const Size(double.infinity, 50),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(30.0),
                                  ),
                                  elevation: 2,
                                ),
                                child: Text(languageProvider.getText('submit'), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                              ),
                            ),
                            const SizedBox(height: 20),
                            ClipRRect(
                              borderRadius: BorderRadius.circular(10),
                              child: const LinearProgressIndicator(
                                value: 1.0,
                                minHeight: 8,
                                backgroundColor: Color(0xFFE0E0E0),
                                valueColor: AlwaysStoppedAnimation<Color>(Colors.black),
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
      },
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
          Text(label, style: const TextStyle(color: Colors.black87, fontWeight: FontWeight.w500, fontSize: 14)),
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
                borderSide: BorderSide(color: Colors.black54.withOpacity(0.5)),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15.0),
                borderSide: BorderSide(color: Colors.black54.withOpacity(0.5)),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15.0),
                borderSide: const BorderSide(color: Color(0xFF0a4e41), width: 1.5),
              ),
              errorBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(15.0),
                borderSide: const BorderSide(color: Colors.redAccent, width: 1.0),
              ),
              contentPadding: const EdgeInsets.symmetric(vertical: 14.0, horizontal: 15.0),
            ),
            validator: (value) => value == null || value.isEmpty
                ? Provider.of<LanguageProvider>(context, listen: false).getText('fieldRequired')
                : null,
            autovalidateMode: AutovalidateMode.onUserInteraction,
          ),
        ],
      ),
    );
  }
}
