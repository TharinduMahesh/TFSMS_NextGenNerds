import 'dart:convert';

/// A function to decode a list of accepted payments from a JSON string.
List<AcceptedPayment> acceptedPaymentFromJson(String str) => List<AcceptedPayment>.from(json.decode(str).map((x) => AcceptedPayment.fromJson(x)));

/// Represents a single paid (accepted) payment record for the list view.
class AcceptedPayment {
    final int paymentId;
    final int growerOrderId;
    final String growerName;
    final String growerCity;
    final double netPayment;
    final DateTime paymentDate;

    AcceptedPayment({
        required this.paymentId,
        required this.growerOrderId,
        required this.growerName,
        required this.growerCity,
        required this.netPayment,
        required this.paymentDate,
    });

    /// Factory constructor to create an AcceptedPayment instance from a JSON map.
    factory AcceptedPayment.fromJson(Map<String, dynamic> json) => AcceptedPayment(
        paymentId: json["paymentId"],
        growerOrderId: json["growerOrderId"],
        growerName: json["growerName"],
        growerCity: json["growerCity"],
        netPayment: json["netPayment"].toDouble(),
        paymentDate: DateTime.parse(json["paymentDate"]),
    );
}
