import 'package:flutter/material.dart';
import 'order_accepted_page.dart';
import 'order_rejected_page.dart';

class OrderDetailsPage extends StatelessWidget {
  const OrderDetailsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final dateController = TextEditingController(text: '2025/02/17');
    final supperLeafController = TextEditingController(text: '20kg');
    final normalLeafController = TextEditingController(text: '15kg');
    final paymentMethodController = TextEditingController(text: 'Cash');
    final timeController = TextEditingController(text: '4:00PM');
    final locationController = TextEditingController(text: '123,Main road ,Haputale');

    return Scaffold(
      backgroundColor: const Color(0xFFF8FFF0),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: const BackButton(color: Colors.black),
        actions: const [
          Padding(
            padding: EdgeInsets.only(right: 16),
            child: Icon(Icons.settings, color: Colors.black),
          ),
        ],
      ),
      body: Center(
        child: Container(
          margin: const EdgeInsets.all(16),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(25),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Request Details',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
              _readonlyField('Date you can give harvest:', dateController),
              const SizedBox(height: 16),
              _readonlyField('Supper Leaf Weight(kg):', supperLeafController),
              const SizedBox(height: 16),
              _readonlyField('Normal Leaf Weight(kg):', normalLeafController),
              const SizedBox(height: 16),
              _readonlyField('Payment method:', paymentMethodController),
              const SizedBox(height: 16),
              _readonlyField('Preferred Time:', timeController),
              const SizedBox(height: 16),
              _readonlyField('Location:', locationController),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const OrderAcceptedPage()),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF0B3C16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                        minimumSize: const Size.fromHeight(50),
                      ),
                      child: const Text('Accept'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (_) => const OrderRejectedPage()),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                        minimumSize: const Size.fromHeight(50),
                      ),
                      child: const Text('Reject'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _readonlyField(String label, TextEditingController controller) {
    return TextField(
      controller: controller,
      readOnly: true,
      decoration: InputDecoration(
        labelText: label,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }
}
