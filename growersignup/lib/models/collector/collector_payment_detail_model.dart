class PaymentDetailModel {
  final int refNumber;
  final String firstName;
  final String lastName;
  final String addressLine1;
  final String addressLine2;
  final String city;
  final String postalCode;
  final String nic;
  final String phoneNumber;
  final double amount;
  final String paymentStatus;
  final String? paymentDate;
  String? collectorEmail;

  PaymentDetailModel({
    required this.refNumber,
    required this.firstName,
    required this.lastName,
    required this.addressLine1,
    required this.addressLine2,
    required this.city,
    required this.postalCode,
    required this.nic,
    required this.phoneNumber,
    required this.amount,
    required this.paymentStatus,
    this.paymentDate,
    this.collectorEmail,
  });

  factory PaymentDetailModel.fromJson(Map<String, dynamic> json) {
    return PaymentDetailModel(
      refNumber: json['refNumber'],
      firstName: json['firstName'],
      lastName: json['lastName'],
      addressLine1: json['addressLine1'],
      addressLine2: json['addressLine2'],
      city: json['city'],
      postalCode: json['postalCode'],
      nic: json['nic'],
      phoneNumber: json['phoneNumber'],
      amount: json['amount'].toDouble(),
      paymentStatus: json['paymentStatus'],
      paymentDate: json['paymentDate'],
      collectorEmail: json['collectorEmail'],
    );
  }
}
