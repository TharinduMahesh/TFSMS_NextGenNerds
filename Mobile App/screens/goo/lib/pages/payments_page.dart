import 'package:flutter/material.dart';
import 'package:goo/pages/constant.dart';

class PaymentsPage extends StatefulWidget {
  const PaymentsPage({super.key});

  @override
  State<PaymentsPage> createState() => _PaymentsPageState();
}

class _PaymentsPageState extends State<PaymentsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor:const Color.fromARGB(255, 255, 255, 255),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Colors.black),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings, color: Colors.black),
            onPressed: () {
              // Handle settings press
            },
          ),
        ],
      ),
      body: Container(
        color: kbackgroundcolor,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16.0),
                decoration: BoxDecoration(
                  color: kdefaultselector,
                  borderRadius: BorderRadius.circular(15.0),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const Text(
                      "Total Payment",
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      "Rs. 115 200",
                      style: const TextStyle(
                          fontSize: 28, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
        
              // Payment History List
              Expanded(
                child: ListView.builder(
                  itemCount: 6, // Adjust as needed
                  itemBuilder: (context, index) {
                    return PaymentCard(
                      refNumber: "000085752257",
                      paymentTime: "25-02-2023,13:22",
                      paymentMethod: "Bank Transfer",
                    );
                  },
                ),
              ),
        
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.black,
        onPressed: () {
          // Handle FAB press
        },
        child: const Icon(Icons.add, color: Colors.white),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
      bottomNavigationBar: navigationBar(),
    );
  }
}

class PaymentCard extends StatelessWidget {
  const PaymentCard({
    Key? key,
    required this.refNumber,
    required this.paymentTime,
    required this.paymentMethod,
  }) : super(key: key);

  final String refNumber;
  final String paymentTime;
  final String paymentMethod;

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(15.0),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Ref Number",
              style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
            ),
            Text(
              refNumber,
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 8),
            Text(
              "Payment Time",
              style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
            ),
            Text(
              paymentTime,
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 8),
            Text(
              "Payment Method",
              style: TextStyle(fontSize: 14, color: Colors.grey.shade600),
            ),
            Text(
              paymentMethod,
              style: const TextStyle(fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}
