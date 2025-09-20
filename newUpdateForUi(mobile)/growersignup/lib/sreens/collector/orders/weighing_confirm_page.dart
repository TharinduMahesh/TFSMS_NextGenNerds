import 'package:flutter/material.dart';

import 'package:growersignup/services/grower/weighing_api.dart';
import 'package:growersignup/sreens/collector/home_pages/collector_home_page.dart';

class WeighingConfirmPage extends StatelessWidget {
  static const Color primaryGreen = Color(0xFF0a4e41);
  static const Color lightGreen = Color(0xFFF0FBEF);
  static const Color cardBackground = Colors.white;
  static const Color textDark = Color(0xFF1A1A1A);
  static const Color textLight = Color(0xFF666666);
  static const Color successGreen = Color(0xFF4CAF50);
  static const Color accentGreen = Color(0xFFB2E7AE);

  final String greenLeafWeight;
  final String superLeafWeight;
  final int orderId;
  final String email;

  const WeighingConfirmPage({
    super.key,
    required this.greenLeafWeight,
    required this.superLeafWeight,
    required this.orderId,
    required this.email,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: lightGreen,
      appBar: AppBar(
        backgroundColor: primaryGreen,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Weighing Confirmation',
          style: TextStyle(
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildStatusCard(),
                  const SizedBox(height: 24),
                  _buildSummaryCard(),
                ],
              ),
            ),
            const SizedBox(height: 32),
            _buildBackToHomeButton(context),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: cardBackground,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 5,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: const BoxDecoration(
              color: successGreen,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.check_circle, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Weighing Confirmed!',
                style: TextStyle(
                  color: textDark,
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Order ID: $orderId',
                style: const TextStyle(
                  color: textLight,
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: cardBackground,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 5,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildCardHeader(),
          const SizedBox(height: 24),
          _buildInfoRow(
            icon: Icons.eco,
            iconColor: primaryGreen,
            label: 'Green Leaf Weight',
            value: '$greenLeafWeight kg',
          ),
          const SizedBox(height: 20),
          _buildInfoRow(
            icon: Icons.star,
            iconColor: successGreen,
            label: 'Super Leaf Weight',
            value: '$superLeafWeight kg',
          ),
          const SizedBox(height: 20),
          _buildTotalWeightRow(),
          const SizedBox(height: 20),
          _buildInfoRow(
            icon: Icons.task_alt,
            iconColor: successGreen,
            label: 'Status',
            value: 'Collection Completed',
          ),
        ],
      ),
    );
  }

  Widget _buildCardHeader() {
    return Row(
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: primaryGreen,
            borderRadius: BorderRadius.circular(6),
          ),
          child: const Icon(Icons.scale, color: Colors.white, size: 20),
        ),
        const SizedBox(width: 12),
        const Text(
          'Weight Summary',
          style: TextStyle(
            color: textDark,
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }

  Widget _buildInfoRow({
    required IconData icon,
    required Color iconColor,
    required String label,
    required String value,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.all(6),
          child: Icon(icon, color: iconColor, size: 20),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(color: textLight, fontSize: 14),
              ),
              const SizedBox(height: 4),
              Text(
                value,
                style: const TextStyle(
                  color: textDark,
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildTotalWeightRow() {
    double total = (double.tryParse(greenLeafWeight) ?? 0.0) +
        (double.tryParse(superLeafWeight) ?? 0.0);

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: primaryGreen.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: primaryGreen.withOpacity(0.3), width: 1),
      ),
      child: Row(
        children: [
          const Icon(Icons.calculate, color: primaryGreen, size: 20),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Total Weight', style: TextStyle(color: textLight, fontSize: 14)),
              const SizedBox(height: 4),
              Text(
                '${total.toStringAsFixed(1)} kg',
                style: const TextStyle(
                  color: primaryGreen,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBackToHomeButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 50,
      child: ElevatedButton(
        onPressed: () async {
  final success = await OrderUpdateService.updateWeights(
    orderId: orderId,
    superLeafWeight: superLeafWeight,
    greenLeafWeight: greenLeafWeight,
  );

  if (success) {
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(
        builder: (_) => CollectorHomePage(email: email),
      ),
      (route) => false,
    );
  } else {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Failed to update weights')),
    );
  }
        },

        style: ElevatedButton.styleFrom(
          backgroundColor: primaryGreen,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
          elevation: 2,
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.home, color: Colors.white, size: 20),
            SizedBox(width: 8),
            Text(
              'Back to Home',
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
