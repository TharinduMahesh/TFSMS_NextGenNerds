class PendingOrder {
  final int growerOrderId;
  final double totalTea;
  final String growerName;
  final String growerCity;

  PendingOrder({
    required this.growerOrderId,
    required this.totalTea,
    required this.growerName,
    required this.growerCity,
  });

  factory PendingOrder.fromJson(Map<String, dynamic> json) {
    return PendingOrder(
      growerOrderId: json['growerOrderId'],
      totalTea: (json['totalTea'] as num).toDouble(),
      growerName: json['growerName'],
      growerCity: json['growerCity'],
    );
  }
}
