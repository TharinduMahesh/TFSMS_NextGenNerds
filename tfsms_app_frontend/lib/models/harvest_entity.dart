class HarvestEntity {
  final DateTime date;
  final double superLeafWeight;
  final double normalLeafWeight;
  final String transportMethod;
  final String paymentMethod;

  HarvestEntity({
    required this.date,
    required this.superLeafWeight,
    required this.normalLeafWeight,
    required this.transportMethod,
    required this.paymentMethod,
  });

  Map<String, dynamic> toJson() {
    return {
      'date': date.toIso8601String(),
      'superLeafWeight': superLeafWeight,
      'normalLeafWeight': normalLeafWeight,
      'transportMethod': transportMethod,
      'paymentMethod': paymentMethod,
    };
  }
}
