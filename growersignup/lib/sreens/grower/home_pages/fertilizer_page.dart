import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:growersignup/models/fertilizer_report.dart';
import 'package:growersignup/models/fertilizer_response.dart';
import 'package:growersignup/services/fertilizer_api_service.dart';
import 'package:growersignup/providers/language_provider.dart';
import 'package:growersignup/providers/theme_provider.dart';

class FertilizerPage extends StatefulWidget {
  final String email;
  const FertilizerPage({super.key, required this.email});

  @override
  State<FertilizerPage> createState() => _FertilizerPageState();
}

class _FertilizerPageState extends State<FertilizerPage> {
  int _bottomNavIndex = 0;
  FertilizerResponse? fertilizerData;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadFertilizerData();
  }

  Future<void> _loadFertilizerData() async {
    setState(() => isLoading = true);
    var api = FertilizerApiService();
    var response = await api.getFertilizerByGrower(1);
    setState(() {
      fertilizerData = response;
      isLoading = false;
    });
  }

  void _onBottomNavTapped(int index) {
    setState(() => _bottomNavIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<LanguageProvider, ThemeProvider>(
      builder: (context, languageProvider, themeProvider, _) {
        return Scaffold(
          backgroundColor: const Color(0xFFF0FBEF),
          appBar: AppBar(
            backgroundColor: const Color(0xFFF0FBEF),
            elevation: 0,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios, color: Color(0xFF333333)),
              onPressed: () => Navigator.of(context).pop(),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.refresh, color: Color(0xFF333333)),
                onPressed: _loadFertilizerData,
              ),
              const SizedBox(width: 10),
            ],
          ),
          body: isLoading
              ? const Center(child: CircularProgressIndicator())
              : Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0),
                  child: SingleChildScrollView(
                    child: Column(
                      children: [
                        Text(
                          languageProvider.getText('fertilizerTitle'),
                          style: const TextStyle(
                              fontSize: 28,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF0a4e41)),
                        ),
                        const SizedBox(height: 20),
                        _buildSummaryCard(languageProvider),
                        const SizedBox(height: 20),
                        _buildTransactionList(languageProvider),
                        const SizedBox(height: 20),
                      ],
                    ),
                  ),
                ),
          bottomNavigationBar: BottomNavigationBar(
            type: BottomNavigationBarType.fixed,
            backgroundColor: Colors.white,
            selectedItemColor: const Color(0xFF0a4e41),
            unselectedItemColor: Colors.grey,
            currentIndex: _bottomNavIndex,
            onTap: _onBottomNavTapped,
            items: [
              BottomNavigationBarItem(
                  icon: const Icon(Icons.home_outlined),
                  label: languageProvider.getText('navHome')),
              BottomNavigationBarItem(
                  icon: const Icon(Icons.notifications_outlined),
                  label: languageProvider.getText('navNotification')),
              BottomNavigationBarItem(
                  icon: const Icon(Icons.person_outline),
                  label: languageProvider.getText('navProfile')),
              BottomNavigationBarItem(
                  icon: const Icon(Icons.star_outline),
                  label: languageProvider.getText('navContactUs')),
            ],
          ),
        );
      },
    );
  }

  Widget _buildSummaryCard(LanguageProvider languageProvider) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 20.0),
      decoration: BoxDecoration(
        color: const Color(0xFFDDF4DD),
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
          Text(
            languageProvider.getText('totalFertilizer'),
            style: const TextStyle(
              fontSize: 16,
              color: Colors.black54,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '${fertilizerData?.totalFertilizer.toStringAsFixed(0)} kg',
            style: const TextStyle(
              fontSize: 32,
              color: Colors.black87,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTransactionList(LanguageProvider languageProvider) {
    final transactions = fertilizerData?.records ?? [];
    return Column(
      children: transactions.map((tx) => _buildTransactionCard(tx, languageProvider)).toList(),
    );
  }

  Widget _buildTransactionCard(FertilizerTransaction tx, LanguageProvider languageProvider) {
    return Card(
      color: Colors.white,
      elevation: 2.0,
      shadowColor: Colors.grey.withOpacity(0.1),
      margin: const EdgeInsets.only(bottom: 15.0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15.0)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            _buildDetailRow(languageProvider.getText('refNumber'), tx.refNumber),
            _buildDetailRow(languageProvider.getText('date'), tx.date),
            _buildDetailRow(
              languageProvider.getText('amount'),
              '${tx.fertilizerAmount.toStringAsFixed(1)} kg',
              isValueBold: true,
            ),
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
          Text(label, style: const TextStyle(color: Colors.black54, fontSize: 14)),
          Text(
            value,
            style: TextStyle(
              color: Colors.black87,
              fontSize: 14,
              fontWeight: isValueBold ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }
}
