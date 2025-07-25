import 'package:flutter/material.dart';
import 'package:growersignup/models/collector/pending_order.dart';
import 'package:growersignup/services/collector/order_status_api_service.dart';
import 'order_details_page.dart';

class PendingOrdersPage extends StatefulWidget {
  final String email;
  const PendingOrdersPage({super.key,required this.email});

  @override
  State<PendingOrdersPage> createState() => _PendingOrdersPageState();
}

class _PendingOrdersPageState extends State<PendingOrdersPage> {
  late Future<List<PendingOrder>> _ordersFuture;

  @override
  void initState() {
    super.initState();
    _ordersFuture = OrderApiService.getPendingOrders();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pending Orders')),
      body: FutureBuilder<List<PendingOrder>>(
        future: _ordersFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting)
            return const Center(child: CircularProgressIndicator());
          if (snapshot.hasError)
            return Center(child: Text('Error: ${snapshot.error}'));

          final orders = snapshot.data!;
          return ListView.builder(
            itemCount: orders.length,
            itemBuilder: (context, index) {
              final order = orders[index];
              return ListTile(
                title: Text('Order #${order.growerOrderId}'),
                subtitle: Text('${order.growerName} - ${order.growerCity}'),
                trailing: Text('${order.totalTea} kg'),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (_) => OrderDetailsPage(orderId: order.growerOrderId, email: widget.email,),
                    ),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}
