import 'package:flutter/material.dart';
import 'package:tfsms_app_frontend/models/Harvest.dart';
import 'package:tfsms_app_frontend/pages/weighing/weighing_detail_page.dart';
import 'package:tfsms_app_frontend/services/order_service.dart';


class WeighingPage extends StatefulWidget {
  const WeighingPage({super.key, required String requestId, required double initialSupper, required double initialNormal});

  @override
  State<WeighingPage> createState() => _WeighingPageState();
}

class _WeighingPageState extends State<WeighingPage> {
  final OrderService _orderService = OrderService();
  late Future<List<Harvest>> _acceptedRequests;

  @override
  void initState() {
    super.initState();
    _acceptedRequests = _orderService.fetchAcceptedRequests();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Accepted Requests'),
        backgroundColor: const Color(0xFF0B3C16),
      ),
      body: FutureBuilder<List<Harvest>>(
        future: _acceptedRequests,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          final requests = snapshot.data!;
          if (requests.isEmpty) {
            return const Center(child: Text('No accepted requests'));
          }

          return ListView.builder(
            itemCount: requests.length,
            itemBuilder: (_, index) {
              final r = requests[index];
              return Card(
                margin: const EdgeInsets.all(10),
                child: ListTile(
                  title: Text('Date: ${r.date.toIso8601String().split("T").first}'),
                  subtitle: Text('Supper: ${r.supperLeafWeight}kg, Normal: ${r.normalLeafWeight}kg'),
                  trailing: const Icon(Icons.arrow_forward_ios),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => WeighingDetailPage(
                          requestId: r.id!,
                          initialSupper: r.supperLeafWeight,
                          initialNormal: r.normalLeafWeight,
                        ),
                      ),
                    );
                  },
                ),
              );
            },
          );
        },
      ),
    );
  }
}
