class PaymentDetailModel {
  final int refNumber;
  final String? firstName;
  final String? lastName;
  final String? addressLine1;
  final String? addressLine2;
  final String? city;
  final String? postalCode;
  final String? nic;
  final String? phoneNumber;
  final double amount;
  final String? paymentStatus;
  final String? paymentDate;

  PaymentDetailModel({
    required this.refNumber,
    this.firstName,
    this.lastName,
    this.addressLine1,
    this.addressLine2,
    this.city,
    this.postalCode,
    this.nic,
    this.phoneNumber,
    required this.amount,
    this.paymentStatus,
    this.paymentDate,
  });

  factory PaymentDetailModel.fromJson(Map<String, dynamic> json) {
    return PaymentDetailModel(
      refNumber: json['refNumber'],
      firstName: json['firstName'] as String?,
      lastName: json['lastName'] as String?,
      addressLine1: json['addressLine1'] as String?,
      addressLine2: json['addressLine2'] as String?,
      city: json['city'] as String?,
      postalCode: json['postalCode'] as String?,
      nic: json['nic'] as String?,
      phoneNumber: json['phoneNumber'] as String?,
      amount: (json['amount'] as num).toDouble(),
      paymentStatus: json['paymentStatus'] as String?,
      paymentDate: json['paymentDate'] as String?,
    );
  }
}
