import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/models/collector/collector_payment_history_model.dart';
import 'package:growersignup/services/collector/collector_history_payment_api_service.dart';
import 'package:growersignup/sreens/collector/home_pages/collector_paid_details_page.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';

class PaymentHistoryPage extends StatefulWidget {
  final String email;
  const PaymentHistoryPage({super.key, required this.email});

  @override
  State<PaymentHistoryPage> createState() => _PaymentHistoryPageState();
}

class _PaymentHistoryPageState extends State<PaymentHistoryPage> {
  late Future<List<PaymentHistoryModel>> _futurePayments;
  final api = PaymentHistoryApiService();

  @override
  void initState() {
    super.initState();
    _futurePayments = api.getPaidPayments();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, child) {
        return Scaffold(
          appBar: AppBar(
            title: Text(languageProvider.getText('paymentHistory') ?? 'Payment History'),
          ),
          body: FutureBuilder<List<PaymentHistoryModel>>(
            future: _futurePayments,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              } else if (snapshot.hasError) {
                return Center(child: Text('Error: ${snapshot.error}'));
              } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                return Center(
                  child: Text(languageProvider.getText('noPaymentHistory') ?? 'No payment history found.'),
                );
              }

              final payments = snapshot.data!;
              return ListView.builder(
                itemCount: payments.length,
                itemBuilder: (context, index) {
                  final payment = payments[index];
                  return ListTile(
                    leading: const Icon(Icons.payment),
                    title: Text('${languageProvider.getText('refNumber') ?? 'Ref #'}: ${payment.refNumber}'),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('${languageProvider.getText('grower') ?? 'Grower'}: ${payment.growerName}'),
                        Text('${languageProvider.getText('amount') ?? 'Amount'}: Rs. ${payment.amount.toStringAsFixed(2)}'),
                        Text('${languageProvider.getText('date') ?? 'Date'}: ${payment.paymentDate?.toLocal().toString().split(' ')[0] ?? "-"}'),
                      ],
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios),
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => PaymentDetailPage(refNumber: payment.refNumber),
                        ),
                      );
                    },
                  );
                },
              );
            },
          ),
        );
      },
    );
  }
}
