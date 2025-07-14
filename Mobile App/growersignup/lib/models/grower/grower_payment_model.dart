class PaymentItem {
  final String refNumber;
  final double amount;
  final DateTime paymentTime;
  final String paymentMethod;

  PaymentItem({
    required this.refNumber,
    required this.amount,
    required this.paymentTime,
    required this.paymentMethod,
  });

  factory PaymentItem.fromJson(Map<String, dynamic> json) {
    return PaymentItem(
      refNumber: json['refNumber'],
      amount: json['amount'].toDouble(),
      paymentTime: DateTime.parse(json['paymentTime']),
      paymentMethod: json['paymentMethod'],
    );
  }
}

class PaymentResponse {
  final double totalAmount;
  final List<PaymentItem> payments;

  PaymentResponse({
    required this.totalAmount,
    required this.payments,
  });

  factory PaymentResponse.fromJson(Map<String, dynamic> json) {
    return PaymentResponse(
      totalAmount: json['totalAmount'].toDouble(),
      payments: (json['payments'] as List)
          .map((item) => PaymentItem.fromJson(item))
          .toList(),
    );
  }
}
