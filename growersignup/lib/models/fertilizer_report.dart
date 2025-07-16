class FertilizerTransaction {
  final String refNumber;
  final String date;
  final double fertilizerAmount;

  FertilizerTransaction({
    required this.refNumber,
    required this.date,
    required this.fertilizerAmount,
  });

  factory FertilizerTransaction.fromJson(Map<String, dynamic> json) {
    return FertilizerTransaction(
      refNumber: json['refNumber'],
      date: json['date'],
      fertilizerAmount: (json['fertilizerAmount'] as num).toDouble(),
    );
  }
}
