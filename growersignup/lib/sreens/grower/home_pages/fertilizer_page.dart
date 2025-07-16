import 'package:flutter/material.dart';
import 'package:growersignup/models/fertilizer_report.dart';
import 'package:growersignup/models/fertilizer_response.dart';
import 'package:growersignup/services/fertilizer_api_service.dart';

class FertilizerPage extends StatefulWidget {
  final String email;
  const FertilizerPage({super.key,required this.email});

  @override
  State<FertilizerPage> createState() => _FertilizerPageState();
}

class _FertilizerPageState extends State<FertilizerPage> {
  int _bottomNavIndex = 0;
  FertilizerResponse? fertilizerData;
  bool isLoading = true;

  static const Color pageBackgroundColor = Color(0xFFF0FBEF);
  static const Color titleColor = Color(0xFF0a4e41);
  static const Color appBarIconsColor = Color(0xFF333333);
  static const Color summaryCardColor = Color(0xFFDDF4DD);
  static const Color summaryLabelColor = Colors.black54;
  static const Color summaryValueColor = Colors.black87;
  static const Color cardBackgroundColor = Colors.white;
  static const Color detailLabelColor = Colors.black54;
  static const Color detailValueColor = Colors.black87;
  static const Color bottomNavBarBackground = Colors.white;
  static const Color bottomNavBarSelectedColor = titleColor;
  static const Color bottomNavBarUnselectedColor = Colors.grey;

  @override
  void initState() {
    super.initState();
    _loadFertilizerData();
  }

  Future<void> _loadFertilizerData() async {
    setState(() => isLoading = true);
    var api = FertilizerApiService();
    var response = await api.getFertilizerByGrower(1); // Replace with actual GrowerId
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
    return Scaffold(
      backgroundColor: pageBackgroundColor,
      appBar: AppBar(
        backgroundColor: pageBackgroundColor,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: appBarIconsColor),
          onPressed: () => Navigator.of(context).pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: appBarIconsColor),
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
                    const Text(
                      'Fertilizer',
                      style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: titleColor),
                    ),
                    const SizedBox(height: 20),
                    _buildSummaryCard(),
                    const SizedBox(height: 20),
                    _buildTransactionList(),
                    const SizedBox(height: 20),
                  ],
                ),
              ),
            ),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        backgroundColor: bottomNavBarBackground,
        selectedItemColor: bottomNavBarSelectedColor,
        unselectedItemColor: bottomNavBarUnselectedColor,
        currentIndex: _bottomNavIndex,
        onTap: _onBottomNavTapped,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.notifications_outlined), label: 'Notification'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profile'),
          BottomNavigationBarItem(icon: Icon(Icons.star_outline), label: 'Contact us'),
        ],
      ),
    );
  }

  Widget _buildSummaryCard() {
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
          const Text(
            'Total Fertilizer',
            style: TextStyle(
              fontSize: 16,
              color: summaryLabelColor,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '${fertilizerData?.totalFertilizer.toStringAsFixed(0)} kg',
            style: const TextStyle(
              fontSize: 32,
              color: summaryValueColor,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTransactionList() {
    final transactions = fertilizerData?.records ?? [];
    return Column(
      children: transactions.map((tx) => _buildTransactionCard(tx)).toList(),
    );
  }

  Widget _buildTransactionCard(FertilizerTransaction tx) {
    return Card(
      color: cardBackgroundColor,
      elevation: 2.0,
      shadowColor: Colors.grey.withOpacity(0.1),
      margin: const EdgeInsets.only(bottom: 15.0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15.0)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            _buildDetailRow('Ref Number', tx.refNumber),
            _buildDetailRow('Date', tx.date),
            _buildDetailRow('Amount', '${tx.fertilizerAmount.toStringAsFixed(1)} kg', isValueBold: true),
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
