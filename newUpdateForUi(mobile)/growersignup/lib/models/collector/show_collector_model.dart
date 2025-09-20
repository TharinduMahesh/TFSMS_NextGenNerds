class CollectorCreateAccount {
  int? collectorAccountId;
  String collectorFirstName;
  String collectorLastName;
  String collectorNIC;
  String collectorAddressLine1;
  String? collectorAddressLine2;
  String collectorCity;
  String? collectorPostalCode;
  String? collectorGender;
  DateTime? collectorDOB;
  String collectorPhoneNum;
  String collectorVehicleNum;
  String collectorEmail;

  CollectorCreateAccount({
    this.collectorAccountId,
    required this.collectorFirstName,
    required this.collectorLastName,
    required this.collectorNIC,
    required this.collectorAddressLine1,
    this.collectorAddressLine2,
    required this.collectorCity,
    this.collectorPostalCode,
    this.collectorGender,
    this.collectorDOB,
    required this.collectorPhoneNum,
    required this.collectorVehicleNum,
    required this.collectorEmail,
  });

  factory CollectorCreateAccount.fromJson(Map<String, dynamic> json) {
    return CollectorCreateAccount(
      collectorAccountId: json['collectorAccountId'],
      collectorFirstName: json['collectorFirstName'],
      collectorLastName: json['collectorLastName'],
      collectorNIC: json['collectorNIC'],
      collectorAddressLine1: json['collectorAddressLine1'],
      collectorAddressLine2: json['collectorAddressLine2'],
      collectorCity: json['collectorCity'],
      collectorPostalCode: json['collectorPostalCode'],
      collectorGender: json['collectorGender'],
      collectorDOB: json['collectorDOB'] != null
          ? DateTime.parse(json['collectorDOB'])
          : null,
      collectorPhoneNum: json['collectorPhoneNum'],
      collectorVehicleNum: json['collectorVehicleNum'],
      collectorEmail: json['collectorEmail'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "collectorAccountId": collectorAccountId,
      "collectorFirstName": collectorFirstName,
      "collectorLastName": collectorLastName,
      "collectorNIC": collectorNIC,
      "collectorAddressLine1": collectorAddressLine1,
      "collectorAddressLine2": collectorAddressLine2,
      "collectorCity": collectorCity,
      "collectorPostalCode": collectorPostalCode,
      "collectorGender": collectorGender,
      "collectorDOB": collectorDOB?.toIso8601String(),
      "collectorPhoneNum": collectorPhoneNum,
      "collectorVehicleNum": collectorVehicleNum,
      "collectorEmail": collectorEmail,
    };
  }
}
