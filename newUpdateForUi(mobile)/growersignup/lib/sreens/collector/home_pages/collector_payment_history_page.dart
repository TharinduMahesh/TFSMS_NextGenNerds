import 'package:flutter/material.dart';
import 'package:growersignup/models/collector/collector_payment_history_model.dart';
import 'package:growersignup/services/collector/collector_history_payment_api_service.dart';
import 'package:growersignup/sreens/collector/home_pages/collector_paid_details_page.dart';

class PaymentHistoryPage extends StatefulWidget {
  final String email;
  const PaymentHistoryPage({super.key,required this.email});

  @override
  State<PaymentHistoryPage> createState() => _PaymentHistoryPageState();
}

class _PaymentHistoryPageState extends State<PaymentHistoryPage> {
  late Future<List<PaymentHistoryModel>> _futurePayments;
  final api = PaymentHistoryApiService();

  @override
  void initState() {
    super.initState();
    _futurePayments = api.getPaidPayments(widget.email);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Payment History')),
      body: FutureBuilder<List<PaymentHistoryModel>>(
        future: _futurePayments,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No payment history found.'));
          }

          final payments = snapshot.data!;
          return ListView.builder(
            itemCount: payments.length,
            itemBuilder: (context, index) {
              final payment = payments[index];
              return ListTile(
                leading: const Icon(Icons.payment),
                title: Text('Ref #: ${payment.refNumber}'),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Grower: ${payment.growerName}'),
                    Text('Amount: Rs. ${payment.amount.toStringAsFixed(2)}'),
                    Text('Date: ${payment.paymentDate?.toLocal().toString().split(' ')[0] ?? "-"}'),
                  ],
                ),
                trailing: const Icon(Icons.arrow_forward_ios),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => PaymentDetailPage(refNumber: payment.refNumber, email: widget.email,),
                    ),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}
