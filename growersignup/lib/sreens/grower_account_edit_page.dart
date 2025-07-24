import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/models/grower/grower_Account.dart';
import 'package:growersignup/services/grower/grower_create_api.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';

class GrowerAccountEditPage extends StatefulWidget {
  final GrowerAccountModel grower;

  const GrowerAccountEditPage({super.key, required this.grower});

  @override
  State<GrowerAccountEditPage> createState() => _GrowerAccountEditPageState();
}

class _GrowerAccountEditPageState extends State<GrowerAccountEditPage> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController firstNameController;
  late TextEditingController lastNameController;
  late TextEditingController phoneController;
  late TextEditingController emailController;

  @override
  void initState() {
    super.initState();
    firstNameController = TextEditingController(text: widget.grower.GrowerFirstName);
    lastNameController = TextEditingController(text: widget.grower.GrowerLastName);
    phoneController = TextEditingController(text: widget.grower.GrowerPhoneNum);
    emailController = TextEditingController(text: widget.grower.GrowerEmail);
  }

  @override
  void dispose() {
    firstNameController.dispose();
    lastNameController.dispose();
    phoneController.dispose();
    emailController.dispose();
    super.dispose();
  }

  Future<void> _saveChanges() async {
    if (_formKey.currentState!.validate()) {
      final updatedGrower = GrowerAccountModel(
        GrowerAccountId: widget.grower.GrowerAccountId,
        GrowerFirstName: firstNameController.text,
        GrowerLastName: lastNameController.text,
        GrowerNIC: widget.grower.GrowerNIC,
        GrowerAddressLine1: widget.grower.GrowerAddressLine1,
        GrowerAddressLine2: widget.grower.GrowerAddressLine2,
        GrowerCity: widget.grower.GrowerCity,
        GrowerPostalCode: widget.grower.GrowerPostalCode,
        GrowerGender: widget.grower.GrowerGender,
        GrowerDOB: widget.grower.GrowerDOB,
        GrowerPhoneNum: phoneController.text,
        GrowerEmail: emailController.text,
      );

      final service = GrowerCreateApi();
      await service.updateGrowerAccount(updatedGrower);

      Navigator.pop(context); // Return to detail page
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, child) {
        return Scaffold(
          appBar: AppBar(
            title: Text(languageProvider.getText('editGrower') ?? 'Edit Grower'),
          ),
          body: Padding(
            padding: const EdgeInsets.all(16),
            child: Form(
              key: _formKey,
              child: ListView(
                children: [
                  TextFormField(
                    controller: firstNameController,
                    decoration: InputDecoration(
                      labelText: languageProvider.getText('firstName') ?? 'First Name',
                    ),
                    validator: (value) => value!.isEmpty
                        ? (languageProvider.getText('enterFirstName') ?? 'Enter first name')
                        : null,
                  ),
                  TextFormField(
                    controller: lastNameController,
                    decoration: InputDecoration(
                      labelText: languageProvider.getText('lastName') ?? 'Last Name',
                    ),
                    validator: (value) => value!.isEmpty
                        ? (languageProvider.getText('enterLastName') ?? 'Enter last name')
                        : null,
                  ),
                  TextFormField(
                    controller: phoneController,
                    decoration: InputDecoration(
                      labelText: languageProvider.getText('phone') ?? 'Phone',
                    ),
                  ),
                  TextFormField(
                    controller: emailController,
                    decoration: InputDecoration(
                      labelText: languageProvider.getText('email') ?? 'Email',
                    ),
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton(
                    onPressed: _saveChanges,
                    child: Text(languageProvider.getText('saveChanges') ?? 'Save Changes'),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
