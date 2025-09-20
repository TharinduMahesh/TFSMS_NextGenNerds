import 'dart:convert';

// For the first screen (List of pending payments)
List<PendingPayment> pendingPaymentFromJson(String str) => List<PendingPayment>.from(json.decode(str).map((x) => PendingPayment.fromJson(x)));

class PendingPayment {
    final int paymentId;
    final int growerOrderId;
    final String growerName;
    final String growerCity;
    final double netPayment;

    PendingPayment({
        required this.paymentId,
        required this.growerOrderId,
        required this.growerName,
        required this.growerCity,
        required this.netPayment,
    });

    factory PendingPayment.fromJson(Map<String, dynamic> json) => PendingPayment(
        paymentId: json["paymentId"],
        growerOrderId: json["growerOrderId"],
        growerName: json["growerName"],
        growerCity: json["growerCity"],
        netPayment: json["netPayment"].toDouble(),
    );
}

// For the second screen (Detailed view of a payment)
class PaymentDetail {
    final double totalAmount;
    final double superTeaQuantity;
    final double greenTeaQuantity;
    final String growerName;
    final String growerAddressLine1;
    final String? growerAddressLine2;
    final String growerCity;
    final String? growerPostalCode;
    final String growerPhoneNum;

    PaymentDetail({
        required this.totalAmount,
        required this.superTeaQuantity,
        required this.greenTeaQuantity,
        required this.growerName,
        required this.growerAddressLine1,
        this.growerAddressLine2,
        required this.growerCity,
        this.growerPostalCode,
        required this.growerPhoneNum,
    });

    factory PaymentDetail.fromJson(Map<String, dynamic> json) => PaymentDetail(
        totalAmount: json["totalAmount"].toDouble(),
        superTeaQuantity: json["superTeaQuantity"].toDouble(),
        greenTeaQuantity: json["greenTeaQuantity"].toDouble(),
        growerName: json["growerName"],
        growerAddressLine1: json["growerAddressLine1"],
        growerAddressLine2: json["growerAddressLine2"],
        growerCity: json["growerCity"],
        growerPostalCode: json["growerPostalCode"],
        growerPhoneNum: json["growerPhoneNum"],
    );
}
