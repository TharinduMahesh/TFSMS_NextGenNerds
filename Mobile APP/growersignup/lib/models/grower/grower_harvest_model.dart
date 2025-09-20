

import 'package:growersignup/models/grower/harwest_order_model.dart';

class GrowerHarvestSummary {
  final double totalSuperTeaQuantity;
  final double totalGreenTeaQuantity;
  List<GrowerOrder> orders;

  GrowerHarvestSummary({
    required this.totalSuperTeaQuantity,
    required this.totalGreenTeaQuantity,
    required this.orders,
  });

  double get totalHarvest => totalSuperTeaQuantity + totalGreenTeaQuantity;

  factory GrowerHarvestSummary.fromJson(Map<String, dynamic> json) {
    var ordersJson = json['orders'] as List<dynamic>;
    List<GrowerOrder> parsedOrders =
        ordersJson.map((e) => GrowerOrder.fromJson(e)).toList();

    return GrowerHarvestSummary(
      totalSuperTeaQuantity: (json['totalSuperTeaQuantity'] as num).toDouble(),
      totalGreenTeaQuantity: (json['totalGreenTeaQuantity'] as num).toDouble(),
      orders: parsedOrders,
    );
  }
}
