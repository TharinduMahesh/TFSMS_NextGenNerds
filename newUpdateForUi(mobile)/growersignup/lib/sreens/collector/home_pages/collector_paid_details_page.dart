import 'package:flutter/material.dart';
import 'package:growersignup/models/collector/collector_payment_detail_model.dart';
import 'package:growersignup/services/collector/collector_history_payment_api_service.dart';

class PaymentDetailPage extends StatefulWidget {
  final String email;
  final int refNumber;

  const PaymentDetailPage({
    super.key,
    required this.refNumber,
    required this.email,
  });

  @override
  State<PaymentDetailPage> createState() => _PaymentDetailPageState();
}

class _PaymentDetailPageState extends State<PaymentDetailPage> {
  late Future<PaymentDetailModel> _futureDetail;
  final api = PaymentHistoryApiService();

  @override
  void initState() {
    super.initState();
    _futureDetail = api.getPaymentDetail(widget.refNumber, widget.email);
  }

  // Updated to handle null values safely
  Widget buildRow(String label, String? value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '$label: ',
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          Expanded(
            child: Text(value ?? '-'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Payment Details')),
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
                buildRow('Ref Number', detail.refNumber.toString()),
                buildRow('First Name', detail.firstName),
                buildRow('Last Name', detail.lastName),
                buildRow('NIC', detail.nic),
                buildRow('Phone', detail.phoneNumber),
                buildRow('Address Line 1', detail.addressLine1),
                buildRow('Address Line 2', detail.addressLine2),
                buildRow('City', detail.city),
                buildRow('Postal Code', detail.postalCode),
                buildRow('Amount', 'Rs. ${detail.amount.toStringAsFixed(2)}'),
                buildRow('Payment Date', detail.paymentDate),
              ],
            ),
          );
        },
      ),
    );
  }
}
