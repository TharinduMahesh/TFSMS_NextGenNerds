import 'package:flutter/material.dart';
import 'package:growersignup/models/grower_payment_model.dart';
import 'package:growersignup/services/grower_payment_api.dart';
class GrowerPaymentsPage extends StatefulWidget {
  const GrowerPaymentsPage({Key? key}) : super(key: key);

  @override
  State<GrowerPaymentsPage> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<GrowerPaymentsPage> {
  late Future<PaymentResponse?> _paymentFuture;
  final PaymentApiService apiService =
      PaymentApiService(baseUrl: 'http://your-api-url.com'); // 👈 Replace this

  @override
  void initState() {
    super.initState();
    _paymentFuture = apiService.fetchPayments();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Payments'),
        centerTitle: true,
        backgroundColor: Colors.teal,
      ),
      body: FutureBuilder<PaymentResponse?>(
        future: _paymentFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (!snapshot.hasData || snapshot.data == null) {
            return const Center(child: Text('No payment data found.'));
          }

          final paymentData = snapshot.data!;
          return Column(
            children: [
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                color: Colors.teal[100],
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Total Payment',
                        style: TextStyle(
                            fontSize: 18, fontWeight: FontWeight.bold)),
                    Text(
                      'Rs. ${paymentData.totalPayment.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.teal,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 10),
              Expanded(
                child: ListView.builder(
                  itemCount: paymentData.payments.length,
                  itemBuilder: (context, index) {
                    final payment = paymentData.payments[index];
                    return Card(
                      margin:
                          const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      child: ListTile(
                        title: Text('Ref: ${payment.refNumber}'),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Method: ${payment.paymentMethod}'),
                            Text(
                                'Time: ${payment.paymentTime.toLocal().toString().substring(0, 16)}'),
                          ],
                        ),
                        trailing: Text(
                          'Rs. ${payment.amount.toStringAsFixed(2)}',
                          style: const TextStyle(
                              fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
