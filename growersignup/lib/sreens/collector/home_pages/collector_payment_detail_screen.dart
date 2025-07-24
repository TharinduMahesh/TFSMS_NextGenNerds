import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/models/collector/collector_payment_detail_model.dart';
import 'package:growersignup/services/collector/collector_payment_api_service.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';

class PaymentDetailScreen extends StatefulWidget {
  final String email;
  final int refNumber;

  const PaymentDetailScreen({
    super.key,
    required this.refNumber,
    required this.email,
  });

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
        SnackBar(content: Text(context.read<LanguageProvider>().getText('paymentMarkedPaid') ?? "Payment marked as Paid")),
      );
      Navigator.pop(context);
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
    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, child) {
        return Scaffold(
          appBar: AppBar(
            title: Text(languageProvider.getText('paymentDetails') ?? "Payment Details"),
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
                    detailRow(languageProvider.getText('refNumber') ?? "Ref Number", p.refNumber.toString()),
                    detailRow(languageProvider.getText('amount') ?? "Amount", "Rs. ${p.amount.toStringAsFixed(2)}"),
                    detailRow(languageProvider.getText('status') ?? "Payment Status", p.paymentStatus),
                    detailRow(languageProvider.getText('paymentDate') ?? "Payment Date", p.paymentDate ?? languageProvider.getText('notPaid') ?? "Not Paid"),
                    const SizedBox(height: 16),
                    const Divider(),
                    const SizedBox(height: 16),
                    detailRow(languageProvider.getText('nic') ?? "NIC", p.nic),
                    detailRow(languageProvider.getText('name') ?? "Name", "${p.firstName} ${p.lastName}"),
                    detailRow(languageProvider.getText('phone') ?? "Phone", p.phoneNumber),
                    detailRow(languageProvider.getText('address') ?? "Address", "${p.addressLine1}, ${p.addressLine2}"),
                    detailRow(languageProvider.getText('city') ?? "City", p.city),
                    detailRow(languageProvider.getText('postalCode') ?? "Postal Code", p.postalCode),
                    const SizedBox(height: 32),
                    if (p.paymentStatus != "Paid")
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: isPaying ? null : _markAsPaid,
                          child: isPaying
                              ? const CircularProgressIndicator()
                              : Text(languageProvider.getText('markAsPaid') ?? "Mark as Paid"),
                        ),
                      ),
                  ],
                ),
              );
            },
          ),
        );
      },
    );
  }

  Widget detailRow(String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          SizedBox(
            width: 140,
            child: Text(
              "$title:",
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}
