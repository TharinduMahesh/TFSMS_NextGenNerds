import 'package:flutter/material.dart';
import 'package:growersignup/models/collector/collector_payment_detail_model.dart';
import 'package:growersignup/services/collector/collector_payment_api_service.dart';

class PaymentDetailScreen extends StatefulWidget {
  final String email;
  final int refNumber;

  const PaymentDetailScreen({super.key, required this.refNumber,required this.email});

  @override
  State<PaymentDetailScreen> createState() => _PaymentDetailScreenState();
}

class _PaymentDetailScreenState extends State<PaymentDetailScreen> {
  late Future<PaymentDetailModel> futureDetail;
  final api = PaymentApiService();
  bool isPaying = false;

  @override
  void initState() {
    super.initState();
    futureDetail = api.getPaymentDetail(widget.refNumber);
  }

  void _markAsPaid() async {
    setState(() => isPaying = true);
    try {
      await api.completePayment(widget.refNumber);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Payment marked as Paid")),
      );
      Navigator.pop(context); // go back to main screen
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error: $e")),
      );
    } finally {
      setState(() => isPaying = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Payment Details"),
      ),
      body: FutureBuilder<PaymentDetailModel>(
        future: futureDetail,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          }

          final p = snapshot.data!;
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                detailRow("Ref Number", p.refNumber.toString()),
                detailRow("Amount", "Rs. ${p.amount.toStringAsFixed(2)}"),
                detailRow("Payment Status", p.paymentStatus),
                detailRow("Payment Date", p.paymentDate ?? "Not Paid"),
                const SizedBox(height: 16),
                const Divider(),
                const SizedBox(height: 16),
                detailRow("NIC", p.nic),
                detailRow("Name", "${p.firstName} ${p.lastName}"),
                detailRow("Phone", p.phoneNumber),
                detailRow("Address", "${p.addressLine1}, ${p.addressLine2}"),
                detailRow("City", p.city),
                detailRow("Postal Code", p.postalCode),
                const SizedBox(height: 32),
                if (p.paymentStatus != "Paid")
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: isPaying ? null : _markAsPaid,
                      child: isPaying
                          ? const CircularProgressIndicator()
                          : const Text("Mark as Paid"),
                    ),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget detailRow(String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          SizedBox(width: 140, child: Text("$title:", style: const TextStyle(fontWeight: FontWeight.bold))),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}
