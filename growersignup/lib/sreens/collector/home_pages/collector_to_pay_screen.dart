import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/models/collector/to_pay_model.dart';
import 'package:growersignup/services/collector/collector_payment_api_service.dart';
import 'package:growersignup/sreens/collector/home_pages/collector_payment_detail_screen.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';

class ToPayScreen extends StatefulWidget {
  final String email;
  const ToPayScreen({super.key, required this.email});

  @override
  State<ToPayScreen> createState() => _ToPayScreenState();
}

class _ToPayScreenState extends State<ToPayScreen> {
  late Future<List<ToPayModel>> futurePayments;
  final api = PaymentApiService();

  @override
  void initState() {
    super.initState();
    futurePayments = api.getPendingPayments();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, child) {
        return Scaffold(
          appBar: AppBar(
            title: Text(languageProvider.getText('toPay') ?? 'To Pay'),
          ),
          body: FutureBuilder<List<ToPayModel>>(
            future: futurePayments,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const Center(child: CircularProgressIndicator());
              }

              if (snapshot.hasError) {
                return Center(child: Text("Error: ${snapshot.error}"));
              }

              final payments = snapshot.data!;
              final totalAmount =
                  payments.fold(0.0, (sum, item) => sum + item.amount);

              return Column(
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    width: double.infinity,
                    color: Colors.green[100],
                    child: Text(
                      "${languageProvider.getText('totalToPay') ?? 'Total To Pay'}: Rs. ${totalAmount.toStringAsFixed(2)}",
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  Expanded(
                    child: ListView.builder(
                      itemCount: payments.length,
                      itemBuilder: (context, index) {
                        final p = payments[index];
                        return ListTile(
                          title: Text(
                            "${languageProvider.getText('ref') ?? 'Ref'}: ${p.refNumber} - Rs. ${p.amount.toStringAsFixed(2)}",
                          ),
                          subtitle: Text("${p.growerName} • ${p.growerCity}"),
                          trailing: const Icon(Icons.arrow_forward_ios),
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => PaymentDetailScreen(
                                  refNumber: p.refNumber,
                                  email: widget.email,
                                ),
                              ),
                            ).then((_) {
                              setState(() {
                                futurePayments = api.getPendingPayments();
                              });
                            });
                          },
                        );
                      },
                    ),
                  ),
                ],
              );
            },
          ),
        );
      },
    );
  }
}
