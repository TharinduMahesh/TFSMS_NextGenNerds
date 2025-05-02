import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';

class HarvestFormPage extends StatefulWidget {
  const HarvestFormPage({super.key});

  @override
  State<HarvestFormPage> createState() => _HarvestFormPageState();
}

class _HarvestFormPageState extends State<HarvestFormPage> {
  final _formKey = GlobalKey<FormBuilderState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFF9E5), // Light yellow background
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white, // White box for the form
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 10,
                  spreadRadius: 2,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: FormBuilder(
              key: _formKey,
              child: Column(
                children: [
                  const SizedBox(height: 20),
                  FormBuilderDateTimePicker(
                    name: 'date',
                    inputType: InputType.date,
                    decoration: _inputDecoration('Date you can give harvest', 'Year/Month/Date'),
                  ),
                  const SizedBox(height: 20),
                  FormBuilderTextField(
                    name: 'supperLeafWeight',
                    keyboardType: TextInputType.number,
                    decoration: _inputDecoration('Supper Leaf Weight (kg)', '20kg'),
                  ),
                  const SizedBox(height: 20),
                  FormBuilderTextField(
                    name: 'normalLeafWeight',
                    keyboardType: TextInputType.number,
                    decoration: _inputDecoration('Normal Leaf Weight (kg)', '20kg'),
                  ),
                  const SizedBox(height: 20),
                  FormBuilderDropdown(
                    name: 'transportMethod',
                    decoration: _inputDecoration('How to transport', null),
                    initialValue: 'By Collector',
                    items: const [
                      DropdownMenuItem(value: 'By Collector', child: Text('By Collector')),
                      DropdownMenuItem(value: 'By own', child: Text('By own')),
                    ],
                  ),
                  const SizedBox(height: 20),
                  FormBuilderDropdown(
                    name: 'paymentMethod',
                    decoration: _inputDecoration('Payment method', null),
                    initialValue: 'Cash',
                    items: const [
                      DropdownMenuItem(value: 'Cash', child: Text('Cash')),
                      DropdownMenuItem(value: 'Bank', child: Text('Bank')),
                    ],
                  ),
                  const SizedBox(height: 30),
                  ElevatedButton(
                    onPressed: _saveForm,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF0B3C16),
                      minimumSize: const Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(30),
                      ),
                    ),
                    child: const Text('Save',  style: TextStyle(fontSize: 18, color: Colors.white)),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(String label, String? hint) {
    return InputDecoration(
      labelText: label,
      hintText: hint,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
      ),
    );
  }

  void _saveForm() {
    if (_formKey.currentState?.saveAndValidate() ?? false) {
      Navigator.pushNamed(context, '/confirmation');
    }
  }
}
