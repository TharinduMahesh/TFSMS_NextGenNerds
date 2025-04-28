import 'package:flutter/material.dart';

class NewWeighingPage extends StatefulWidget {
  const NewWeighingPage({super.key});

  @override
  State<NewWeighingPage> createState() => _NewWeighingPageState();
}

class _NewWeighingPageState extends State<NewWeighingPage> {
  String selectedSupplier = 'Supplier 1';
  double grossWeight = 0;
  double deductions = 0;
  int sackCount = 0;
  String containerId = '';

  @override
  Widget build(BuildContext context) {
    double netWeight = grossWeight - deductions;

    return Scaffold(
      appBar: AppBar(
        title: const Text('New Weighing Entry'),
        backgroundColor: const Color(0xFF0B3C16),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: ListView(
          children: [
            DropdownButtonFormField<String>(
              value: selectedSupplier,
              items: ['Supplier 1', 'Supplier 2', 'Supplier 3']
                  .map((supplier) => DropdownMenuItem(value: supplier, child: Text(supplier)))
                  .toList(),
              onChanged: (value) => setState(() => selectedSupplier = value!),
              decoration: const InputDecoration(labelText: 'Select Supplier'),
            ),
            const SizedBox(height: 20),
            TextFormField(
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Gross Weight (kg)'),
              onChanged: (value) => setState(() => grossWeight = double.tryParse(value) ?? 0),
            ),
            const SizedBox(height: 20),
            TextFormField(
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Deductions (kg)'),
              onChanged: (value) => setState(() => deductions = double.tryParse(value) ?? 0),
            ),
            const SizedBox(height: 20),
            Text('Net Weight: ${netWeight.toStringAsFixed(2)} kg', style: const TextStyle(fontSize: 18)),
            const SizedBox(height: 20),
            Row(
              children: [
                const Text('Sack Count: '),
                IconButton(icon: const Icon(Icons.remove), onPressed: () => setState(() => sackCount = (sackCount > 0) ? sackCount - 1 : 0)),
                Text('$sackCount'),
                IconButton(icon: const Icon(Icons.add), onPressed: () => setState(() => sackCount++)),
              ],
            ),
            const SizedBox(height: 20),
            TextFormField(
              decoration: const InputDecoration(labelText: 'Container ID (optional)'),
              onChanged: (value) => containerId = value,
            ),
            const SizedBox(height: 30),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context); // After saving, go back to dashboard
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0B3C16),
                minimumSize: const Size(double.infinity, 50),
              ),
              child: const Text('Save Entry', style: TextStyle(fontSize: 18)),
            ),
          ],
        ),
      ),
    );
  }
}
