import 'package:flutter/material.dart';
import 'package:growersignup/models/collector/pending_order_details.dart';
import 'package:growersignup/services/collector/order_accepted_api.dart';


class AcceptedOrderDetailsPage extends StatefulWidget {
  final String email;
  final int orderId;

  const AcceptedOrderDetailsPage({super.key, required this.orderId, required this.email});

  @override
  State<AcceptedOrderDetailsPage> createState() => _AcceptedOrderDetailsPageState();
}

class _AcceptedOrderDetailsPageState extends State<AcceptedOrderDetailsPage> {
  late Future<OrderDetails> _detailsFuture;

  @override
  void initState() {
    super.initState();
    _detailsFuture = OrderAcceptedApiService.getOrderDetails(widget.orderId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Order Details')),
      body: FutureBuilder<OrderDetails>(
        future: _detailsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting)
            return const Center(child: CircularProgressIndicator());
          if (snapshot.hasError)
            return Center(child: Text('Error: ${snapshot.error}'));

          final details = snapshot.data!;
          return Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Total Tea: ${details.totalTea} kg',
                    style: const TextStyle(
                        fontSize: 18, fontWeight: FontWeight.bold)),
                const SizedBox(height: 10),
                Text('Placed on: ${details.placeDate.toLocal()}'),
                const Divider(),
                Text('Super Tea: ${details.superTeaQuantity} kg'),
                Text('Green Tea: ${details.greenTeaQuantity} kg'),
                Text('Payment Method: ${details.paymentMethod}'),
                const Divider(),
                Text('Grower: ${details.growerName}'),
                Text('NIC: ${details.nic}'),
                Text('Phone: ${details.phoneNumber}'),
                Text('Address: ${details.addressLine1}, ${details.addressLine2 ?? ''}, ${details.city}'),
                Text('Postal Code: ${details.postalCode ?? '-'}'),
              ],
            ),
          );
        },
      ),
    );
  }
}
