class OrderDetails {
  final int growerOrderId;
  final double superTeaQuantity;
  final double greenTeaQuantity;
  final double totalTea;
  final String paymentMethod;
  final DateTime placeDate;

  final String growerName;
  final String addressLine1;
  final String? addressLine2;
  final String city;
  final String? postalCode;
  final String nic;
  final String phoneNumber;

  OrderDetails({
    required this.growerOrderId,
    required this.superTeaQuantity,
    required this.greenTeaQuantity,
    required this.totalTea,
    required this.paymentMethod,
    required this.placeDate,
    required this.growerName,
    required this.addressLine1,
    this.addressLine2,
    required this.city,
    this.postalCode,
    required this.nic,
    required this.phoneNumber,
  });

  factory OrderDetails.fromJson(Map<String, dynamic> json) {
    final superTea = (json['superTeaQuantity'] as num).toDouble();
    final greenTea = (json['greenTeaQuantity'] as num).toDouble();

    return OrderDetails(
      growerOrderId: json['growerOrderId'],
      superTeaQuantity: superTea,
      greenTeaQuantity: greenTea,
      totalTea: superTea + greenTea,
      paymentMethod: json['paymentMethod'],
      placeDate: DateTime.parse(json['placeDate']),
      growerName: json['growerName'],
      addressLine1: json['addressLine1'],
      addressLine2: json['addressLine2'],
      city: json['city'],
      postalCode: json['postalCode'],
      nic: json['nic'],
      phoneNumber: json['phoneNumber'],
    );
  }
}
