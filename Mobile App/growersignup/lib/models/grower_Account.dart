class GrowerAccountModel {
  final int? GrowerAccountId;
  final String GrowerFirstName;
  final String GrowerLastName;
  final String GrowerNIC;
  final String GrowerAddressLine1;
  final String GrowerAddressLine2;
  final String GrowerCity;
  final String GrowerPostalCode;
  final String GrowerGender;
  final DateTime GrowerDOB;
  final String GrowerPhoneNum;
  final String MoneyMethod;
  final String GrowerEmail;

  const GrowerAccountModel({
    this.GrowerAccountId,
    required this.GrowerFirstName,  
    required this.GrowerLastName,
    required this.GrowerNIC,
    required this.GrowerAddressLine1,
    required this.GrowerAddressLine2,
    required this.GrowerCity,
    required this.GrowerPostalCode,
    required this.GrowerGender,
    required this.GrowerDOB,
    required this.GrowerPhoneNum,
    required this.MoneyMethod,
    required this.GrowerEmail,
  });

factory GrowerAccountModel.fromJson(Map<String, dynamic> json) {
  return GrowerAccountModel(
    GrowerAccountId: json['GrowerAccountId'] != null ? json['GrowerAccountId'] as int : null,
    GrowerFirstName: json['GrowerFirstName'] ?? '',
    GrowerLastName: json['GrowerLastName'] ?? '',
    GrowerNIC: json['GrowerNIC'] ?? '',
    GrowerAddressLine1: json['GrowerAddressLine1'] ?? '',
    GrowerAddressLine2: json['GrowerAddressLine2'] ?? '',
    GrowerCity: json['GrowerCity'] ?? '',
    GrowerPostalCode: json['GrowerPostalCode'] ?? '',
    GrowerGender: json['GrowerGender'] ?? '',
    GrowerDOB: json['GrowerDOB'] != null ? DateTime.parse(json['GrowerDOB']) : DateTime.now(),
    GrowerPhoneNum: json['GrowerPhoneNum'] ?? '',
    MoneyMethod: json['MoneyMethod'] ?? '',
    GrowerEmail: json['GrowerEmail'] ?? '',
  );
}


  Map<String, dynamic> toJson() {
    return {
      'GrowerFirstName': GrowerFirstName,
      'GrowerLastName': GrowerLastName,
      'GrowerNIC': GrowerNIC,
      'GrowerAddressLine1': GrowerAddressLine1,
      'GrowerAddressLine2': GrowerAddressLine2,
      'GrowerCity': GrowerCity,
      'GrowerPostalCode': GrowerPostalCode,
      'GrowerGender': GrowerGender,
      'GrowerDOB': GrowerDOB.toIso8601String(),
      'GrowerPhoneNum': GrowerPhoneNum,
      'MoneyMethod': MoneyMethod,
      'GrowerEmail': GrowerEmail,
    };
  }
}
