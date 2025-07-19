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

  // Add fromJson factory constructor
  factory Harvest.fromJson(Map<String, dynamic> json) {
    return Harvest(
      date: DateTime.parse(json['date']),
      supperLeafWeight: (json['supperLeafWeight'] ?? 0.0).toDouble(),
      normalLeafWeight: (json['normalLeafWeight'] ?? 0.0).toDouble(),
      transportMethod: json['transportMethod'] ?? '',
      paymentMethod: json['paymentMethod'] ?? '',
    );
  }

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
