import 'package:flutter/material.dart';
import 'package:growersignup/models/collector/collector_accepted_orders.dart';
import 'package:growersignup/services/collector/order_accepted_api.dart';
import 'package:growersignup/sreens/collector/orders/accepted_order_details_page.dart';


class AcceptedOrdersPage extends StatefulWidget {
  final String email;

  const AcceptedOrdersPage({super.key, required this.email});

  @override
  State<AcceptedOrdersPage> createState() => _AcceptedOrdersPageState();
}

class _AcceptedOrdersPageState extends State<AcceptedOrdersPage> {
  late Future<List<AcceptedOrder>> _acceptedOrdersFuture;

  @override
  void initState() {
    super.initState();
    _acceptedOrdersFuture =
        OrderAcceptedApiService.getAcceptedOrders(widget.email);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Accepted Orders')),
      body: FutureBuilder<List<AcceptedOrder>>(
        future: _acceptedOrdersFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting)
            return const Center(child: CircularProgressIndicator());
          if (snapshot.hasError)
            return Center(child: Text('Error: ${snapshot.error}'));

          final orders = snapshot.data!;
          if (orders.isEmpty) {
            return const Center(child: Text('No accepted orders found.'));
          }

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
                      builder: (_) => AcceptedOrderDetailsPage(orderId: order.growerOrderId, email: widget.email,),
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
