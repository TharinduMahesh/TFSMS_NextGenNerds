import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/models/collector/collector_payment_detail_model.dart';
import 'package:growersignup/services/collector/collector_history_payment_api_service.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';

class PaymentDetailPage extends StatefulWidget {
  final int refNumber;
  const PaymentDetailPage({super.key, required this.refNumber});

  @override
  State<PaymentDetailPage> createState() => _PaymentDetailPageState();
}

class _PaymentDetailPageState extends State<PaymentDetailPage> {
  late Future<PaymentDetailModel> _futureDetail;
  final api = PaymentHistoryApiService();

  @override
  void initState() {
    super.initState();
    _futureDetail = api.getPaymentDetail(widget.refNumber);
  }

  Widget buildRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('$label: ', style: const TextStyle(fontWeight: FontWeight.bold)),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, child) {
        return Scaffold(
          appBar: AppBar(
            title: Text(languageProvider.getText('paymentDetails') ?? 'Payment Details'),
          ),
          body: FutureBuilder<PaymentDetailModel>(
            future: _futureDetail,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              } else if (snapshot.hasError) {
                return Center(child: Text('Error: ${snapshot.error}'));
              } else if (!snapshot.hasData) {
                return const Center(child: Text('No data found.'));
              }

              final detail = snapshot.data!;
              return Padding(
                padding: const EdgeInsets.all(16),
                child: ListView(
                  children: [
                    buildRow(languageProvider.getText('refNumber') ?? 'Ref Number', detail.refNumber.toString()),
                    buildRow(languageProvider.getText('firstName') ?? 'First Name', detail.firstName),
                    buildRow(languageProvider.getText('lastName') ?? 'Last Name', detail.lastName),
                    buildRow(languageProvider.getText('nic') ?? 'NIC', detail.nic),
                    buildRow(languageProvider.getText('phone') ?? 'Phone', detail.phoneNumber),
                    buildRow(languageProvider.getText('addressLine1') ?? 'Address Line 1', detail.addressLine1),
                    buildRow(languageProvider.getText('addressLine2') ?? 'Address Line 2', detail.addressLine2),
                    buildRow(languageProvider.getText('city') ?? 'City', detail.city),
                    buildRow(languageProvider.getText('postalCode') ?? 'Postal Code', detail.postalCode),
                    buildRow(languageProvider.getText('amount') ?? 'Amount', 'Rs. ${detail.amount.toStringAsFixed(2)}'),
                    buildRow(languageProvider.getText('status') ?? 'Status', detail.paymentStatus),
                    buildRow(languageProvider.getText('paymentDate') ?? 'Payment Date', detail.paymentDate ?? "-"),
                  ],
                ),
              );
            },
          ),
        );
      },
    );
  }
}
