import 'package:flutter/material.dart';

class ReportPage extends StatelessWidget {
  const ReportPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Weighing Report'),
        backgroundColor: const Color(0xFF0B3C16),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            ElevatedButton(
              onPressed: () {
                // Date filter functionality
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                minimumSize: const Size(double.infinity, 50),
              ),
              child: const Text('Select Date', style: TextStyle(fontSize: 18)),
            ),
            const SizedBox(height: 20),
            const Expanded(
              child: SupplierSummaryList(),
            ),
          ],
        ),
      ),
    );
  }
}

class SupplierSummaryList extends StatelessWidget {
  const SupplierSummaryList({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: 3,
      itemBuilder: (context, index) {
        return Card(
          margin: const EdgeInsets.symmetric(vertical: 8),
          child: ListTile(
            title: const Text('Supplier Name'),
            subtitle: const Text('Total KG: 300kg\nNet Weight: 270kg'),
            trailing: ElevatedButton(
              onPressed: () {
                // Confirm export or anything
              },
              child: const Text('Confirm All'),
            ),
          ),
        );
      },
    );
  }
}
