class GPendingOrder {
  final int growerOrderId;
  final double totalTea;

  GPendingOrder({
    required this.growerOrderId,
    required this.totalTea,
  });

  factory GPendingOrder.fromJson(Map<String, dynamic> json) {
    return GPendingOrder(
      growerOrderId: json['growerOrderId'],
      totalTea: (json['totalTea'] as num).toDouble(),
    );
  }
}
