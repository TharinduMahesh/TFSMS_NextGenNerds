import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../models/grower/grower_payment_model.dart';
import '../../../services/grower/grower_payment_api.dart';

class PaymentsPage extends StatefulWidget {
  final String email;

  const PaymentsPage({Key? key, required this.email}) : super(key: key);

  @override
  State<PaymentsPage> createState() => _PaymentsPageState();
}

class _PaymentsPageState extends State<PaymentsPage> {
  late Future<PaymentResponse?> _paymentData;

  @override
  void initState() {
    super.initState();
    _paymentData = GrowerPaymentApi.getPaymentsByEmail(widget.email);
  }

  static const Color pageBackgroundColor = Color(0xFFF0FBEF);
  static const Color appBarIconsColor = Color(0xFF333333);
  static const Color summaryCardColor = Color(0xFFDDF4DD);
  static const Color summaryLabelColor = Colors.black54;
  static const Color summaryValueColor = Colors.black87;
  static const Color cardBackgroundColor = Colors.white;
  static const Color detailLabelColor = Colors.black54;
  static const Color detailValueColor = Colors.black87;

  final currencyFormatter = NumberFormat("#,##0", "en_US");

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: pageBackgroundColor,
      appBar: AppBar(
        backgroundColor: pageBackgroundColor,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: appBarIconsColor),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text('Grower Payments', style: TextStyle(color: Colors.black)),
      ),
      body: FutureBuilder<PaymentResponse?>(
        future: _paymentData,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError || snapshot.data == null) {
            return const Center(child: Text('No payment data found.'));
          }

          final payments = snapshot.data!;
          final totalFormatted = currencyFormatter.format(payments.totalAmount);

          return SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20.0),
            child: Column(
              children: [
                const SizedBox(height: 20),
                _buildSummaryCard(totalFormatted),
                const SizedBox(height: 20),
                ...payments.payments.map(_buildTransactionCard).toList(),
                const SizedBox(height: 80),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildSummaryCard(String totalFormatted) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 20.0),
      decoration: BoxDecoration(
        color: summaryCardColor,
        borderRadius: BorderRadius.circular(20.0),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.15),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Column(
        children: [
          const Text('Total Payment',
              style: TextStyle(fontSize: 16, color: summaryLabelColor, fontWeight: FontWeight.w500)),
          const SizedBox(height: 8),
          Text('Rs $totalFormatted',
              style: const TextStyle(fontSize: 32, color: summaryValueColor, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildTransactionCard(PaymentItem item) {
    return Card(
      color: cardBackgroundColor,
      elevation: 2.0,
      margin: const EdgeInsets.only(bottom: 15.0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15.0)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            _buildDetailRow('Ref Number', item.refNumber),
            _buildDetailRow('Amount', 'Rs ${currencyFormatter.format(item.amount)}', isValueBold: true),
            _buildDetailRow('Payment Time', DateFormat('dd-MM-yyyy, HH:mm').format(item.paymentTime)),
            _buildDetailRow('Payment Method', item.paymentMethod, isValueBold: true),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value, {bool isValueBold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: detailLabelColor, fontSize: 14)),
          Text(
            value,
            style: TextStyle(
              color: detailValueColor,
              fontSize: 14,
              fontWeight: isValueBold ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }
}
