import 'dart:convert';

// Helper function for parsing a list of paid orders
List<GrowerPaidOrder> growerPaidOrderFromJson(String str) => List<GrowerPaidOrder>.from(json.decode(str).map((x) => GrowerPaidOrder.fromJson(x)));

/// Represents a single paid order in the grower's history list.
class GrowerPaidOrder {
    final int growerOrderId;
    final String collectorName;
    final String collectorCity;
    final double netPayment;

    GrowerPaidOrder({
        required this.growerOrderId,
        required this.collectorName,
        required this.collectorCity,
        required this.netPayment,
    });

    factory GrowerPaidOrder.fromJson(Map<String, dynamic> json) => GrowerPaidOrder(
        growerOrderId: json["growerOrderId"],
        collectorName: json["collectorName"],
        collectorCity: json["collectorCity"],
        netPayment: json["netPayment"].toDouble(),
    );
}

/// Represents the full details of a paid order.
/// This can reuse the GrowerOrderDetail model structure if it's identical.
/// For clarity, we can define it separately if needed, but we will reuse the existing one.
