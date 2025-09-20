// lib/models/collector_payment_history_model.dart

class PaymentHistoryModel {
  final int refNumber;
  final double amount;
  final String growerName;
  final DateTime? paymentDate;

  PaymentHistoryModel({
    required this.refNumber,
    required this.amount,
    required this.growerName,
    required this.paymentDate,
  });

  factory PaymentHistoryModel.fromJson(Map<String, dynamic> json) {
    return PaymentHistoryModel(
      refNumber: json['refNumber'],
      amount: json['amount'].toDouble(),
      growerName: json['growerName'],
      paymentDate: json['paymentDate'] != null
          ? DateTime.parse(json['paymentDate'])
          : null,
    );
  }
}
