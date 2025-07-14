import 'package:flutter/material.dart';
import 'package:tfsms_app_frontend/models/Harvest.dart';
import 'package:tfsms_app_frontend/pages/weighing/weighing_page.dart';
import 'package:tfsms_app_frontend/services/order_service.dart';


class RequestDetailsPage extends StatefulWidget {
  const RequestDetailsPage({super.key});

  @override
  State<RequestDetailsPage> createState() => _RequestDetailsPageState();
}

class _RequestDetailsPageState extends State<RequestDetailsPage> {
  final OrderService _orderService = OrderService();
  late String requestId;
  Harvest? request;
  bool isLoading = true;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    requestId = ModalRoute.of(context)!.settings.arguments as String;
    _loadRequestDetails();
  }

  Future<void> _loadRequestDetails() async {
    final result = await _orderService.fetchRequest(requestId);
    if (result != null) {
      setState(() {
        request = result;
        isLoading = false;
      });
    } else {
      setState(() {
        isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to load request details')),
      );
    }
  }

  Widget _buildDetail(String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey.shade300),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Text(value),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FFF0),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: const BackButton(color: Colors.black),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : request == null
              ? const Center(child: Text('Request not found'))
              : Center(
                  child: Container(
                    margin: const EdgeInsets.all(16),
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(25),
                    ),
                    child: ListView(
                      shrinkWrap: true,
                      children: [
                        const Center(
                          child: Text(
                            'Harvest Request Details',
                            style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                          ),
                        ),
                        const SizedBox(height: 20),
                        _buildDetail('Supplier Name', request!.supplierName ?? 'N/A'),
                        _buildDetail('Date', request!.date.toIso8601String().substring(0, 10)),
                        _buildDetail('Time', request!.time.toIso8601String().substring(11, 16)),
                        _buildDetail('Supper Leaf Weight (kg)', '${request!.supperLeafWeight}'),
                        _buildDetail('Normal Leaf Weight (kg)', '${request!.normalLeafWeight}'),
                        _buildDetail('Payment Method', request!.paymentMethod),
                        _buildDetail('Address', request!.address),
                        const SizedBox(height: 24),
                        Row(
                          children: [
                            Expanded(
                              child: ElevatedButton(
                                onPressed: () async {
                                  final accepted = await _orderService.updateRequestStatus(requestId, 'Accepted');
                                  if (accepted && request != null) {
                                    Navigator.pushReplacement(
                                      context,
                                      MaterialPageRoute(
                                        builder: (_) => WeighingPage(
                                          requestId: request!.id!,
                                          initialSupper: request!.supperLeafWeight,
                                          initialNormal: request!.normalLeafWeight,
                                        ),
                                      ),
                                    );
                                  }
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF0B3C16),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                                  minimumSize: const Size.fromHeight(50),
                                ),
                                child: const Text('Accept'),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: ElevatedButton(
                                onPressed: () async {
                                  final rejected = await _orderService.updateRequestStatus(requestId, 'Rejected');
                                  if (rejected) {
                                    Navigator.pushReplacementNamed(context, '/orderRejected', arguments: requestId);
                                  }
                                },
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.red,
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                                  minimumSize: const Size.fromHeight(50),
                                ),
                                child: const Text('Reject'),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
    );
  }
}
