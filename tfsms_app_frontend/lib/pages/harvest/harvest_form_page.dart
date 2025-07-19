import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import '../../services/harvest_request_service.dart';
import '../../models/harvest_request.dart';

class HarvestFormPage extends StatefulWidget {
  const HarvestFormPage({super.key});

  @override
  State<HarvestFormPage> createState() => _HarvestFormPageState();
}

class _HarvestFormPageState extends State<HarvestFormPage> {
  final _formKey = GlobalKey<FormBuilderState>();

  Future<void> _saveForm() async {
    if (_formKey.currentState?.saveAndValidate() ?? false) {
      final formData = _formKey.currentState!.value;

      try {
        // Show loading indicator
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (context) => const Center(
            child: CircularProgressIndicator(),
          ),
        );

        // Create harvest request object
        final harvestRequest = HarvestRequest(
          date: formData['date'] ?? DateTime.now(),
          time: formData['time'] ?? DateTime.now(),
          supperLeafWeight: double.tryParse(formData['supperLeafWeight']?.toString() ?? '0') ?? 0.0,
          normalLeafWeight: double.tryParse(formData['normalLeafWeight']?.toString() ?? '0') ?? 0.0,
          transportMethod: formData['transportMethod'] ?? 'By Collector',
          paymentMethod: formData['paymentMethod'] ?? 'Cash',
          address: formData['address'] ?? '',
          growerAccountId: 1, // You can replace this with actual grower ID
        );

        // Submit to backend
        final success = await HarvestRequestService.createRequest(harvestRequest);
        
        // Close loading dialog
        if (mounted) {
          Navigator.of(context).pop();
        }

        if (success) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('✅ Harvest request submitted successfully!'),
                backgroundColor: Colors.green,
              ),
            );
            Navigator.pushNamed(context, '/confirmation');
          }
        } else {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('❌ Failed to submit harvest request. Please try again.'),
                backgroundColor: Colors.red,
              ),
            );
          }
        }
      } catch (e) {
        // Close loading dialog if open
        if (mounted) {
          Navigator.of(context).pop();
          
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('❌ Error: $e'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FFF0),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0B3C16),
        foregroundColor: Colors.white,
        title: const Text('Harvest Request Form'),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
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
                  const SizedBox(height: 10),
                  
                  // Date Field
                  FormBuilderDateTimePicker(
                    name: 'date',
                    inputType: InputType.date,
                    decoration: _inputDecoration('Date'),
                    initialValue: DateTime.now(),
                    validator: (value) {
                      if (value == null) return 'Please select a date';
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),

                  // Preferable Time Field
                  FormBuilderDateTimePicker(
                    name: 'time',
                    inputType: InputType.time,
                    decoration: _inputDecoration('Preferable time'),
                    initialValue: DateTime.now(),
                    validator: (value) {
                      if (value == null) return 'Please select a time';
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),
                  
                  // Supper Leaf Weight Field
                  FormBuilderTextField(
                    name: 'supperLeafWeight',
                    keyboardType: TextInputType.number,
                    decoration: _inputDecoration('Supper Leaf Weight (kg)'),
                    validator: (value) {
                      if (value == null || value.isEmpty) return 'Please enter supper leaf weight';
                      if (double.tryParse(value) == null) return 'Please enter a valid number';
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),
                  
                  // Normal Leaf Weight Field
                  FormBuilderTextField(
                    name: 'normalLeafWeight',
                    keyboardType: TextInputType.number,
                    decoration: _inputDecoration('Normal Leaf Weight (kg)'),
                    validator: (value) {
                      if (value == null || value.isEmpty) return 'Please enter normal leaf weight';
                      if (double.tryParse(value) == null) return 'Please enter a valid number';
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),
                  
                  // Transport Method Dropdown
                  FormBuilderDropdown<String>(
                    name: 'transportMethod',
                    decoration: _inputDecoration('Transport Method'),
                    initialValue: 'By Collector',
                    items: const [
                      DropdownMenuItem(value: 'By Collector', child: Text('By Collector')),
                      DropdownMenuItem(value: 'By Own', child: Text('By Own')),
                    ],
                    validator: (value) {
                      if (value == null || value.isEmpty) return 'Please select transport method';
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),
                  
                  // Payment Method Dropdown
                  FormBuilderDropdown<String>(
                    name: 'paymentMethod',
                    decoration: _inputDecoration('Payment Method'),
                    initialValue: 'Cash',
                    items: const [
                      DropdownMenuItem(value: 'Cash', child: Text('Cash')),
                      DropdownMenuItem(value: 'Bank Transfer', child: Text('Bank Transfer')),
                    ],
                    validator: (value) {
                      if (value == null || value.isEmpty) return 'Please select payment method';
                      return null;
                    },
                  ),
                  const SizedBox(height: 20),
                  
                  // Address Field
                  FormBuilderTextField(
                    name: 'address',
                    decoration: _inputDecoration('Address'),
                    maxLines: 3,
                    validator: (value) {
                      if (value == null || value.isEmpty) return 'Please enter your address';
                      return null;
                    },
                  ),
                  const SizedBox(height: 30),
                  
                  // Submit Button
                  Container(
                    width: double.infinity,
                    height: 55,
                    child: ElevatedButton(
                      onPressed: _saveForm,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFF5252),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                        ),
                        elevation: 3,
                      ),
                      child: const Text(
                        'Submit',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(String label, [String? hint]) {
    return InputDecoration(
      labelText: label,
      hintText: hint,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: Colors.grey),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: Colors.grey),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: const BorderSide(color: Color(0xFF0B3C16), width: 2),
      ),
      filled: true,
      fillColor: const Color(0xFFFAFAFA),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
    );
  }
}
