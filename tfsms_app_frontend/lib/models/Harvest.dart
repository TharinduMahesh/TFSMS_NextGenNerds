// lib/models/harvest.dart

class Harvest {
  final DateTime date;
  final double supperLeafWeight;
  final double normalLeafWeight;
  final String transportMethod;
  final String paymentMethod;

  Harvest({
    required this.date,
    required this.supperLeafWeight,
    required this.normalLeafWeight,
    required this.transportMethod,
    required this.paymentMethod,
  });

  Map<String, dynamic> toJson() {
    return {
      'date': date.toIso8601String(),
      'supperLeafWeight': supperLeafWeight,
      'normalLeafWeight': normalLeafWeight,
      'transportMethod': transportMethod,
      'paymentMethod': paymentMethod,
    };
  }
}
