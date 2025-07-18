import 'package:flutter/material.dart';
import 'package:tfsms_app_frontend/models/Harvest.dart';
import '../../services/order_service.dart';

class PendingRequestsPage extends StatefulWidget {
  const PendingRequestsPage({super.key});

  @override
  State<PendingRequestsPage> createState() => _PendingRequestsPageState();
}

class _PendingRequestsPageState extends State<PendingRequestsPage> {
  final OrderService _orderService = OrderService();
  late Future<List<Harvest>> _requests;

  @override
  void initState() {
    super.initState();
    _requests = _orderService.fetchPendingRequests();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Pending Harvest Requests"),
        backgroundColor: const Color(0xFF0B3C16),
        foregroundColor: Colors.white,
      ),
      body: FutureBuilder<List<Harvest>>(
        future: _requests,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          }
          final requests = snapshot.data!;
          if (requests.isEmpty) {
            return const Center(child: Text("No pending requests."));
          }
          return ListView.builder(
            itemCount: requests.length,
            itemBuilder: (_, index) {
              final r = requests[index];
              return Card(
                margin: const EdgeInsets.all(10),
                child: ListTile(
                  title: Text("Date: ${r.date.toIso8601String().substring(0, 10)}"),
                  subtitle: Text("Supper: ${r.supperLeafWeight} kg, Normal: ${r.normalLeafWeight} kg"),
                  trailing: const Icon(Icons.arrow_forward_ios),
                  onTap: () {
                    Navigator.pushNamed(context, '/request', arguments: r.date.millisecondsSinceEpoch.toString());
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
