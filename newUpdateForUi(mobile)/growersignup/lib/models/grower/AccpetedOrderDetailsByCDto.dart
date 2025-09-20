class AcceptedOrderDetailsByC {
  final int growerOrderId;
  final String? collectorFirstName;
  final String? collectorSecondName;
  final double superTeaQuantity;
  final double greenTeaQuantity;
  double get totalTea => superTeaQuantity + greenTeaQuantity;
  final String? paymentMethod;
  final DateTime placeDate;
  final String? collectorAddressLine1;
  final String? collectorAddressLine2;
  final String? collectorCity;
  final String? collectorPostalCode;
  final String? collectorPhoneNum;
  final String? collectorVehicleNum;

  // Helper getters for display
  String get collectorName => '${collectorFirstName ?? ''} ${collectorSecondName ?? ''}'.trim();
  String get fullAddress => [
    collectorAddressLine1,
    collectorAddressLine2,
    collectorCity
  ].where((element) => element != null && element.isNotEmpty).join(', ');

  AcceptedOrderDetailsByC({
    required this.growerOrderId,
    this.collectorFirstName,
    this.collectorSecondName,
    required this.superTeaQuantity,
    required this.greenTeaQuantity,
    this.paymentMethod,
    required this.placeDate,
    this.collectorAddressLine1,
    this.collectorAddressLine2,
    this.collectorCity,
    this.collectorPostalCode,
    this.collectorPhoneNum,
    this.collectorVehicleNum,
  });

  factory AcceptedOrderDetailsByC.fromJson(Map<String, dynamic> json) {
    return AcceptedOrderDetailsByC(
      growerOrderId: json['growerOrderId'] ?? 0,
      collectorFirstName: json['collectorFirstName'],
      collectorSecondName: json['collectorSecondName'],
      superTeaQuantity: (json['superTeaQuantity'] as num?)?.toDouble() ?? 0.0,
      greenTeaQuantity: (json['greenTeaQuantity'] as num?)?.toDouble() ?? 0.0,
      paymentMethod: json['paymentMethod'],
      placeDate: json['placeDate'] != null 
          ? DateTime.parse(json['placeDate']) 
          : DateTime.now(),
      collectorAddressLine1: json['collectorAddressLine1'],
      collectorAddressLine2: json['collectorAddressLine2'],
      collectorCity: json['collectorCity'],
      collectorPostalCode: json['collectorPostalCode'],
      collectorPhoneNum: json['collectorPhoneNum'],
      collectorVehicleNum: json['collectorVehicleNum'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'growerOrderId': growerOrderId,
      'collectorFirstName': collectorFirstName,
      'collectorSecondName': collectorSecondName,
      'superTeaQuantity': superTeaQuantity,
      'greenTeaQuantity': greenTeaQuantity,
      'paymentMethod': paymentMethod,
      'placeDate': placeDate.toIso8601String(),
      'collectorAddressLine1': collectorAddressLine1,
      'collectorAddressLine2': collectorAddressLine2,
      'collectorCity': collectorCity,
      'collectorPostalCode': collectorPostalCode,
      'collectorPhoneNum': collectorPhoneNum,
      'collectorVehicleNum': collectorVehicleNum,
    };
  }
}