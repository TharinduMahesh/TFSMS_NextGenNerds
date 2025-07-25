import 'package:flutter/material.dart';
import 'package:growersignup/models/collector/pending_order_details.dart';
import 'package:growersignup/services/collector/order_status_api_service.dart';

class OrderDetailsPage extends StatefulWidget {
  final String email;
  final int orderId;

  const OrderDetailsPage({super.key, required this.orderId,required this.email});

  @override
  State<OrderDetailsPage> createState() => _OrderDetailsPageState();
}

class _OrderDetailsPageState extends State<OrderDetailsPage> {
  late Future<OrderDetails> _detailsFuture;

  @override
  void initState() {
    super.initState();
    _detailsFuture = OrderApiService.getOrderDetails(widget.orderId);
  }

  void _acceptOrder() async {
    try {
      await OrderApiService.acceptOrder(widget.orderId, widget.email);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Order accepted')),
      );
      Navigator.pop(context); // Go back to pending list
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e')),
      );
    }
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
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
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
                const Spacer(),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _acceptOrder,
                    child: const Text('Accept Order'),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
