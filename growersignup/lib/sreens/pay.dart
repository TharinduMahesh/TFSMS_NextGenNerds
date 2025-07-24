import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';

class pay extends StatefulWidget {
  const pay({super.key});

  @override
  State<pay> createState() => _PaymentsPageState();
}

class _PaymentsPageState extends State<pay> {
  @override
  Widget build(BuildContext context) {
    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, child) {
        return Scaffold(
          appBar: AppBar(
            backgroundColor: Colors.white,
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
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(languageProvider.getText('settingsNotImplemented')),
                      backgroundColor: Colors.grey,
                    ),
                  );
                },
              ),
            ],
          ),
          body: Container(
            color: const Color(0xFFF8FFEA),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(16.0),
                    decoration: BoxDecoration(
                      color: const Color(0xFFDCF4A6),
                      borderRadius: BorderRadius.circular(15.0),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Text(
                          languageProvider.getText('totalPayment'),
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          "Rs. 115 200",
                          style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  Expanded(
                    child: ListView.builder(
                      itemCount: 6,
                      itemBuilder: (context, index) {
                        return PaymentCard(
                          refNumber: "000085752257",
                          paymentTime: "25-02-2023,13:22",
                          paymentMethod: languageProvider.getText('bankTransfer'),
                          languageProvider: languageProvider,
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
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(languageProvider.getText('fabNotImplemented')),
                  backgroundColor: Colors.blueAccent,
                ),
              );
            },
            child: const Icon(Icons.add, color: Colors.white),
          ),
          floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
          bottomNavigationBar: _navigationBar(languageProvider),
        );
      },
    );
  }

  Widget _navigationBar(LanguageProvider languageProvider) {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      items: [
        BottomNavigationBarItem(icon: const Icon(Icons.home), label: languageProvider.getText('navHome')),
        BottomNavigationBarItem(icon: const Icon(Icons.notifications), label: languageProvider.getText('navNotifications')),
        BottomNavigationBarItem(icon: const Icon(Icons.person), label: languageProvider.getText('navProfile')),
        BottomNavigationBarItem(icon: const Icon(Icons.contact_support), label: languageProvider.getText('navContact')),
      ],
      selectedItemColor: Colors.black,
    );
  }
}

class PaymentCard extends StatelessWidget {
  final String refNumber;
  final String paymentTime;
  final String paymentMethod;
  final LanguageProvider languageProvider;

  const PaymentCard({
    Key? key,
    required this.refNumber,
    required this.paymentTime,
    required this.paymentMethod,
    required this.languageProvider,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 3,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15.0)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(languageProvider.getText('refNumber'), style: TextStyle(fontSize: 14, color: Colors.grey.shade600)),
            Text(refNumber, style: const TextStyle(fontSize: 16)),
            const SizedBox(height: 8),
            Text(languageProvider.getText('paymentTime'), style: TextStyle(fontSize: 14, color: Colors.grey.shade600)),
            Text(paymentTime, style: const TextStyle(fontSize: 16)),
            const SizedBox(height: 8),
            Text(languageProvider.getText('paymentMethod'), style: TextStyle(fontSize: 14, color: Colors.grey.shade600)),
            Text(paymentMethod, style: const TextStyle(fontSize: 16)),
          ],
        ),
      ),
    );
  }
}
