class CollectorAccount {
  int? collectorAccountId;
  String collectorFirstName;
  String collectorLastName;
  String collectorNIC;
  String collectorAddressLine1;
  String collectorAddressLine2;
  String collectorCity;
  String collectorPostalCode;
  String collectorGender;
  DateTime collectorDOB;
  String collectorPhoneNum;
  String collectorVehicleNum;
  String collectorEmail;

  CollectorAccount({
    this.collectorAccountId,
    required this.collectorFirstName,
    required this.collectorLastName,
    required this.collectorNIC,
    required this.collectorAddressLine1,
    required this.collectorAddressLine2,
    required this.collectorCity,
    required this.collectorPostalCode,
    required this.collectorGender,
    required this.collectorDOB,
    required this.collectorPhoneNum,
    required this.collectorVehicleNum,
    required this.collectorEmail,
  });

  factory CollectorAccount.fromJson(Map<String, dynamic> json) {
    return CollectorAccount(
      collectorAccountId: json['collectorAccountId'],
      collectorFirstName: json['collectorFirstName'],
      collectorLastName: json['collectorLastName'],
      collectorNIC: json['collectorNIC'],
      collectorAddressLine1: json['collectorAddressLine1'],
      collectorAddressLine2: json['collectorAddressLine2'],
      collectorCity: json['collectorCity'],
      collectorPostalCode: json['collectorPostalCode'],
      collectorGender: json['collectorGender'],
      collectorDOB: DateTime.parse(json['collectorDOB']),
      collectorPhoneNum: json['collectorPhoneNum'],
      collectorVehicleNum: json['collectorVehicleNum'],
      collectorEmail: json['collectorEmail'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "collectorFirstName": collectorFirstName,
      "collectorLastName": collectorLastName,
      "collectorNIC": collectorNIC,
      "collectorAddressLine1": collectorAddressLine1,
      "collectorAddressLine2": collectorAddressLine2,
      "collectorCity": collectorCity,
      "collectorPostalCode": collectorPostalCode,
      "collectorGender": collectorGender,
      "collectorDOB": collectorDOB.toIso8601String(),
      "collectorPhoneNum": collectorPhoneNum,
      "collectorVehicleNum": collectorVehicleNum,
      "collectorEmail": collectorEmail,
    };
  }
}
