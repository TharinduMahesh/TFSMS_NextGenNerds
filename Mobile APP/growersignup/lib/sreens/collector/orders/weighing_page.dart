import 'package:flutter/material.dart';
import 'package:growersignup/sreens/collector/orders/weighing_confirm_page.dart';

class WeighingPage extends StatefulWidget {
  static const Color primaryGreen = Color(0xFF0a4e41);
  static const Color lightGreen = Color(0xFFF0FBEF);
  static const Color cardBackground = Colors.white;
  static const Color textDark = Color(0xFF1A1A1A);
  static const Color textLight = Color(0xFF666666);
  static const Color successGreen = Color(0xFF4CAF50);
  static const Color accentGreen = Color(0xFFB2E7AE);

  final int orderId;
  final String email;
  final String superLeafWeight;
  final String greenLeafWeightFromOrder;

  const WeighingPage({
    super.key,
    required this.orderId,
    required this.email,
    required this.superLeafWeight,
    required this.greenLeafWeightFromOrder,
  });

  @override
  State<WeighingPage> createState() => _WeighingPageState();
}

class _WeighingPageState extends State<WeighingPage> {
  bool isEditing = false;

  late TextEditingController _greenLeafController;
  late TextEditingController _superLeafController;

  @override
  void initState() {
    super.initState();
    _greenLeafController =
        TextEditingController(text: widget.greenLeafWeightFromOrder);
    _superLeafController =
        TextEditingController(text: widget.superLeafWeight);
  }

  @override
  void dispose() {
    _greenLeafController.dispose();
    _superLeafController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: WeighingPage.lightGreen,
      appBar: AppBar(
        backgroundColor: WeighingPage.primaryGreen,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: const Text(
          'Weighing',
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
                  _buildInfoCard(),
                  const SizedBox(height: 24),
                  _buildWeightCard(),
                ],
              ),
            ),
            const SizedBox(height: 32),
            _buildConfirmButton(),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: WeighingPage.cardBackground,
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
              color: WeighingPage.primaryGreen,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.scale, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Enter Weight Details',
                style: TextStyle(
                  color: WeighingPage.textDark,
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Order ID: ${widget.orderId}',
                style: const TextStyle(
                  color: WeighingPage.textLight,
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildWeightCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: WeighingPage.cardBackground,
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
            icon: Icons.star,
            iconColor: WeighingPage.successGreen,
            label: 'Super Leaf Weight',
            controller: _superLeafController,
            unit: 'kg',
          ),
          const SizedBox(height: 20),
          _buildInfoRow(
            icon: Icons.eco,
            iconColor: WeighingPage.primaryGreen,
            label: 'Green Leaf Weight',
            controller: _greenLeafController,
            unit: 'kg',
          ),
          const SizedBox(height: 20),
          _buildEditModeRow(),
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
            color: WeighingPage.primaryGreen,
            borderRadius: BorderRadius.circular(6),
          ),
          child: const Icon(Icons.balance, color: Colors.white, size: 20),
        ),
        const SizedBox(width: 12),
        const Text(
          'Weight Information',
          style: TextStyle(
            color: WeighingPage.textDark,
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
    required TextEditingController controller,
    required String unit,
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
                style: const TextStyle(
                  color: WeighingPage.textLight,
                  fontSize: 14,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                controller: controller,
                enabled: isEditing,
                keyboardType:
                    const TextInputType.numberWithOptions(decimal: true),
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: isEditing
                      ? WeighingPage.textDark
                      : WeighingPage.textLight,
                ),
                decoration: InputDecoration(
                  suffixText: unit,
                  suffixStyle: const TextStyle(
                    fontSize: 14,
                    color: WeighingPage.textLight,
                    fontWeight: FontWeight.w500,
                  ),
                  filled: true,
                  fillColor:
                      isEditing ? Colors.grey[50] : Colors.grey[100],
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide.none,
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide(
                      color: isEditing
                          ? WeighingPage.primaryGreen.withOpacity(0.3)
                          : Colors.transparent,
                    ),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: const BorderSide(
                      color: WeighingPage.primaryGreen,
                      width: 2,
                    ),
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                      horizontal: 12, vertical: 16),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildEditModeRow() {
    return Row(
      children: [
        Icon(
          isEditing ? Icons.edit : Icons.lock,
          color: isEditing ? Colors.orange : Colors.grey,
          size: 20,
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                isEditing ? "Editing Enabled" : "Locked",
                style: const TextStyle(
                  color: WeighingPage.textDark,
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
              Switch(
                value: isEditing,
                onChanged: (value) {
                  setState(() => isEditing = value);
                },
                activeColor: WeighingPage.primaryGreen,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildConfirmButton() {
    return SizedBox(
      width: double.infinity,
      height: 50,
      child: ElevatedButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => WeighingConfirmPage(
                superLeafWeight: _superLeafController.text,
                greenLeafWeight: _greenLeafController.text,
                orderId: widget.orderId,
                email: widget.email,
              ),
            ),
          );
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: WeighingPage.primaryGreen,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.check_circle, color: Colors.white, size: 20),
            SizedBox(width: 8),
            Text(
              'Confirm Weighing',
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
