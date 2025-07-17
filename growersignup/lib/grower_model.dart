class GrowerModel {
  final int? growerOrderId;
  final double superTeaQuantity;
  final double greenTeaQuantity;
  final DateTime placeDate;
  final String transportMethod;
  final String paymentMethod;

  const GrowerModel({
    this.growerOrderId,
    required this.superTeaQuantity,
    required this.greenTeaQuantity,
    required this.placeDate,
    required this.transportMethod,
    required this.paymentMethod,
  });

  factory GrowerModel.fromJson(Map<String, dynamic> json) => GrowerModel(
    growerOrderId: json['growerOrderId'] as int?,
    superTeaQuantity: (json['superTeaQuantity'] as num).toDouble(),
    greenTeaQuantity: (json['greenTeaQuantity'] as num).toDouble(),
    placeDate: DateTime.parse(json['placeDate'] as String),
    transportMethod: json['transportMethod'] as String,
    paymentMethod: json['paymentMethod'] as String,
  );

  Map<String, dynamic> toJson() => {
    'superTeaQuantity': superTeaQuantity,
    'greenTeaQuantity': greenTeaQuantity,
    'placeDate': placeDate.toIso8601String(),
    'transportMethod': transportMethod,
    'paymentMethod': paymentMethod,
  };
}
