import 'package:flutter/material.dart';
import 'package:growersignup/models/grower_Account.dart';
import 'package:growersignup/services/grower_create_api.dart';

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
        MoneyMethod: widget.grower.MoneyMethod,
        GrowerEmail: emailController.text,
      );

      final service = GrowerCreateApi();
      await service.updateGrowerAccount(updatedGrower);

      Navigator.pop(context); // Return to detail page
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Edit Grower')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              TextFormField(
                controller: firstNameController,
                decoration: const InputDecoration(labelText: 'First Name'),
                validator: (value) => value!.isEmpty ? 'Enter first name' : null,
              ),
              TextFormField(
                controller: lastNameController,
                decoration: const InputDecoration(labelText: 'Last Name'),
                validator: (value) => value!.isEmpty ? 'Enter last name' : null,
              ),
              TextFormField(
                controller: phoneController,
                decoration: const InputDecoration(labelText: 'Phone'),
              ),
              TextFormField(
                controller: emailController,
                decoration: const InputDecoration(labelText: 'Email'),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _saveChanges,
                child: const Text('Save Changes'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
