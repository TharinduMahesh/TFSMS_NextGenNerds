class CollectorAccountModel {
  final int? CollectorAccountId;
  final String CollectorFirstName;
  final String CollectorLastName;
  final String CollectorNIC;
  final String CollectorAddressLine1;
  final String CollectorAddressLine2;
  final String CollectorCity;
  final String CollectorPostalCode;
  final String CollectorGender;
  final DateTime CollectorDOB;
  final String CollectorPhoneNum;
  final String MoneyMethod;
  final String CollectorEmail;

  const CollectorAccountModel({
    this.CollectorAccountId,
    required this.CollectorFirstName,  
    required this.CollectorLastName,
    required this.CollectorNIC,
    required this.CollectorAddressLine1,
    required this.CollectorAddressLine2,
    required this.CollectorCity,
    required this.CollectorPostalCode,
    required this.CollectorGender,
    required this.CollectorDOB,
    required this.CollectorPhoneNum,
    required this.MoneyMethod,
    required this.CollectorEmail,
  });

factory CollectorAccountModel.fromJson(Map<String, dynamic> json) {
  return CollectorAccountModel(
    CollectorAccountId: json['CollectorAccountId'] != null ? json['CollectorAccountId'] as int : null,
    CollectorFirstName: json['CollectorFirstName'] ?? '',
    CollectorLastName: json['CollectorLastName'] ?? '',
    CollectorNIC: json['CollectorNIC'] ?? '',
    CollectorAddressLine1: json['CollectorAddressLine1'] ?? '',
    CollectorAddressLine2: json['CollectorAddressLine2'] ?? '',
    CollectorCity: json['CollectorCity'] ?? '',
    CollectorPostalCode: json['CollectorPostalCode'] ?? '',
    CollectorGender: json['CollectorGender'] ?? '',
    CollectorDOB: json['CollectorDOB'] != null ? DateTime.parse(json['CollectorDOB']) : DateTime.now(),
    CollectorPhoneNum: json['CollectorPhoneNum'] ?? '',
    MoneyMethod: json['MoneyMethod'] ?? '',
    CollectorEmail: json['CollectorEmail'] ?? '',
  );
}


  Map<String, dynamic> toJson() {
    return {
      'CollectorFirstName': CollectorFirstName,
      'CollectorLastName': CollectorLastName,
      'CollectorNIC': CollectorNIC,
      'CollectorAddressLine1': CollectorAddressLine1,
      'CollectorAddressLine2': CollectorAddressLine2,
      'CollectorCity': CollectorCity,
      'CollectorPostalCode': CollectorPostalCode,
      'CollectorGender': CollectorGender,
      'CollectorDOB': CollectorDOB.toIso8601String(),
      'CollectorPhoneNum': CollectorPhoneNum,
      'MoneyMethod': MoneyMethod,
      'CollectorEmail': CollectorEmail,
    };
  }
}
