class GOrderDetailsforg {
  final int growerOrderId;
  final double superTeaQuantity;
  final double greenTeaQuantity;
  final double totalTea;
  final String paymentMethod;
  final DateTime placeDate;

  GOrderDetailsforg({
    required this.growerOrderId,
    required this.superTeaQuantity,
    required this.greenTeaQuantity,
    required this.totalTea,
    required this.paymentMethod,
    required this.placeDate,
  });

  factory GOrderDetailsforg.fromJson(Map<String, dynamic> json) {
    final superTea = (json['superTeaQuantity'] as num).toDouble();
    final greenTea = (json['greenTeaQuantity'] as num).toDouble();

    return GOrderDetailsforg(
      growerOrderId: json['growerOrderId'],
      superTeaQuantity: superTea,
      greenTeaQuantity: greenTea,
      totalTea: superTea + greenTea,
      paymentMethod: json['paymentMethod'],
      placeDate: DateTime.parse(json['placeDate']),
    );
  }
}
