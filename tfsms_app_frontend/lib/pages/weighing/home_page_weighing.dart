import 'package:flutter/material.dart';

class HomePageWeighing extends StatelessWidget {
  const HomePageWeighing({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FFF0),
      appBar: AppBar(
        title: const Text('Weighing Dashboard'),
        backgroundColor: const Color(0xFF0B3C16),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            ElevatedButton(
              onPressed: () {
                Navigator.pushNamed(context, '/new-weighing');
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0B3C16),
                minimumSize: const Size(double.infinity, 50),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
              ),
              child: const Text('+ New Weighing', style: TextStyle(fontSize: 18)),
            ),
            const SizedBox(height: 20),
            const Expanded(
              child: WeighingListView(),
            ),
          ],
        ),
      ),
    );
  }
}

class WeighingListView extends StatelessWidget {
  const WeighingListView({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: 5, // example dummy count
      itemBuilder: (context, index) {
        return Card(
          margin: const EdgeInsets.symmetric(vertical: 8),
          child: ListTile(
            title: const Text('Supplier Name'),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text('Gross: 100kg  |  Deductions: 10kg  |  Net: 90kg'),
                Text('Status: Pending'),
              ],
            ),
            trailing: const Icon(Icons.arrow_forward_ios),
          ),
        );
      },
    );
  }
}
