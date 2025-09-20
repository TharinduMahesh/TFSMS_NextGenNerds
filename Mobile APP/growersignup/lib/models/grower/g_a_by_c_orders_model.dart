class GAcceptedOrder {
  final int growerOrderId;
  final double totalTea;
  final String collectorName;
  final String collectorCity;

  GAcceptedOrder({
    required this.growerOrderId,
    required this.totalTea,
    required this.collectorName,
    required this.collectorCity,
  });

  factory GAcceptedOrder.fromJson(Map<String, dynamic> json) {
    return GAcceptedOrder(
      growerOrderId: json['growerOrderId'] ?? 0,
      totalTea: (json['totalTea'] as num?)?.toDouble() ?? 0.0,
      collectorName: json['collectorName'] ?? 'Unknown Collector',
      collectorCity: json['collectorCity'] ?? 'Unknown City',
    );
  }
}
