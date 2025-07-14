import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:tfsms_app_frontend/models/Harvest.dart';
import 'package:tfsms_app_frontend/services/harvest_service.dart';

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
      final transport = formData['transportMethod'];
      final payment = formData['paymentMethod'];

      const growerAccountId = 1;
      final address = (transport == 'ByCollector') ? '' : formData['address'] ?? '';

      final harvest = Harvest(
        date: formData['date'],
        time: formData['time'],
        supperLeafWeight: double.tryParse(formData['supperLeafWeight']) ?? 0,
        normalLeafWeight: double.tryParse(formData['normalLeafWeight']) ?? 0,
        transportMethod: transport,
        paymentMethod: payment,
        address: address,
        growerAccountId: growerAccountId,
      );

      final id = await HarvestService.submitHarvest(harvest);
      if (id != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Harvest submitted successfully')),
        );
        Navigator.pushNamedAndRemoveUntil(context, '/pending', (_) => false);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to submit harvest')),
        );
      }
    }
  }

  InputDecoration _inputDecoration(String label, String? hint) {
    return InputDecoration(
      labelText: label,
      hintText: hint,
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFF9E5),
      appBar: AppBar(
        title: const Text('Harvest Request Form'),
        titleTextStyle: const TextStyle(color: Colors.white, fontSize: 20),
        backgroundColor: const Color(0xFF0B3C16),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10, offset: const Offset(0, 5))],
          ),
          child: FormBuilder(
            key: _formKey,
            child: Column(
              children: [
                const SizedBox(height: 20),
                FormBuilderDateTimePicker(
                  name: 'date',
                  inputType: InputType.date,
                  decoration: _inputDecoration('Preferable Date', 'YYYY-MM-DD'),
                ),
                const SizedBox(height: 20),
                FormBuilderDateTimePicker(
                  name: 'time',
                  inputType: InputType.time,
                  decoration: _inputDecoration('Preferable time', 'HH:mm'),
                ),
                const SizedBox(height: 20),
                FormBuilderTextField(
                  name: 'supperLeafWeight',
                  keyboardType: TextInputType.number,
                  decoration: _inputDecoration('Supper Leaf Weight (kg)', '20'),
                ),
                const SizedBox(height: 20),
                FormBuilderTextField(
                  name: 'normalLeafWeight',
                  keyboardType: TextInputType.number,
                  decoration: _inputDecoration('Normal Leaf Weight (kg)', '15'),
                ),
                const SizedBox(height: 20),
                FormBuilderDropdown(
                  name: 'transportMethod',
                  decoration: _inputDecoration('Transport Method', null),
                  initialValue: 'ByCollector',
                  items: const [
                    DropdownMenuItem(value: 'ByCollector', child: Text('By Collector')),
                    DropdownMenuItem(value: 'ByOwn', child: Text('By Own')),
                  ],
                ),
                const SizedBox(height: 20),
                FormBuilderDropdown(
                  name: 'paymentMethod',
                  decoration: _inputDecoration('Payment Method', null),
                  initialValue: 'Cash',
                  items: const [
                    DropdownMenuItem(value: 'Cash', child: Text('Cash')),
                    DropdownMenuItem(value: 'Bank', child: Text('Bank')),
                  ],
                ),
                const SizedBox(height: 20),
                FormBuilderTextField(
                  name: 'address',
                  maxLines: 2,
                  decoration: _inputDecoration('Address', 'e.g. 123 Main Street Moratuwa'),
                ),
                const SizedBox(height: 30),
                ElevatedButton(
                  onPressed: _saveForm,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color.fromARGB(255, 36, 60, 50),
                    minimumSize: const Size(double.infinity, 50),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                  ),
                  child: const Text('Submit', style: TextStyle(color: Colors.white)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
