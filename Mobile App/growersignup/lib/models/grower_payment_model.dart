class PaymentResponse {
  final double totalPayment;
  final List<Payment> payments;

  PaymentResponse({
    required this.totalPayment,
    required this.payments,
  });

  factory PaymentResponse.fromJson(Map<String, dynamic> json) {
    return PaymentResponse(
      totalPayment: (json['totalPayment'] as num).toDouble(),
      payments: (json['payments'] as List<dynamic>)
          .map((e) => Payment.fromJson(e))
          .toList(),
    );
  }
}

class Payment {
  final int paymentId;
  final double amount;
  final String refNumber;
  final DateTime paymentTime;
  final String paymentMethod;

  Payment({
    required this.paymentId,
    required this.amount,
    required this.refNumber,
    required this.paymentTime,
    required this.paymentMethod,
  });

  factory Payment.fromJson(Map<String, dynamic> json) {
    return Payment(
      paymentId: json['paymentId'] as int,
      amount: (json['amount'] as num).toDouble(),
      refNumber: json['refNumber'] as String,
      paymentTime: DateTime.parse(json['paymentTime']),
      paymentMethod: json['paymentMethod'] as String,
    );
  }
}
