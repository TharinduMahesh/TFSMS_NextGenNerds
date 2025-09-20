class GrowerOrder {
  final int growerOrderId;
  final double superTeaQuantity;
  final double greenTeaQuantity;
  final DateTime placeDate;
  final String transportMethod;
  final String paymentMethod;
  final String growerEmail;

  GrowerOrder({
    required this.growerOrderId,
    required this.superTeaQuantity,
    required this.greenTeaQuantity,
    required this.placeDate,
    required this.transportMethod,
    required this.paymentMethod,
    required this.growerEmail,
  });

  factory GrowerOrder.fromJson(Map<String, dynamic> json) {
    return GrowerOrder(
      growerOrderId: json['growerOrderId'],
      superTeaQuantity: (json['superTeaQuantity'] as num).toDouble(),
      greenTeaQuantity: (json['greenTeaQuantity'] as num).toDouble(),
      placeDate: DateTime.parse(json['placeDate']),
      transportMethod: json['transportMethod'],
      paymentMethod: json['paymentMethod'],
      growerEmail: json['growerEmail'],
    );
  }
}
