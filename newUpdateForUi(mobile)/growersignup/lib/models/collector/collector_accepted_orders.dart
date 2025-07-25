class AcceptedOrder {
  final int growerOrderId;
  final double totalTea;
  final String growerName;
  final String growerCity;

  AcceptedOrder({
    required this.growerOrderId,
    required this.totalTea,
    required this.growerName,
    required this.growerCity,
  });

  factory AcceptedOrder.fromJson(Map<String, dynamic> json) {
    return AcceptedOrder(
      growerOrderId: json['growerOrderId'],
      totalTea: (json['totalTea'] as num).toDouble(),
      growerName: json['growerName'],
      growerCity: json['growerCity'],
    );
  }
}
