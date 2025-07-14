import 'package:flutter/material.dart';
import 'package:tfsms_app_frontend/pages/order/order_accepted_page.dart';
import 'package:tfsms_app_frontend/services/order_service.dart';

class WeighingDetailPage extends StatefulWidget {
  final String requestId;
  final double initialSupper;
  final double initialNormal;

  const WeighingDetailPage({
    super.key,
    required this.requestId,
    required this.initialSupper,
    required this.initialNormal,
  });

  @override
  State<WeighingDetailPage> createState() => _WeighingDetailPageState();
}

class _WeighingDetailPageState extends State<WeighingDetailPage> {
  final _supperController = TextEditingController();
  final _normalController = TextEditingController();
  final OrderService _orderService = OrderService();

  @override
  void initState() {
    super.initState();
    _supperController.text = widget.initialSupper.toString();
    _normalController.text = widget.initialNormal.toString();
  }

  Future<void> _confirmWeights() async {
    final supper = double.tryParse(_supperController.text) ?? widget.initialSupper;
    final normal = double.tryParse(_normalController.text) ?? widget.initialNormal;
    final ok = await _orderService.updateWeights(widget.requestId, supper, normal);
    if (ok) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (_) => OrderAcceptedPage(requestId: widget.requestId),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to update weights')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Weighing Details')),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            TextField(
              controller: _supperController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Supper Leaf Weight'),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _normalController,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(labelText: 'Normal Leaf Weight'),
            ),
            const SizedBox(height: 30),
            ElevatedButton(
              onPressed: _confirmWeights,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0B3C16),
                minimumSize: const Size.fromHeight(50),
              ),
              child: const Text('Confirm', style: TextStyle(color: Colors.white)),
            )
          ],
        ),
      ),
    );
  }
}
