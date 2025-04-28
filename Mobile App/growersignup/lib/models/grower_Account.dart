class GrowerAccount {
  final int GrowerAccountId;
  final String GrowerFirstName;
  final String GrowerLastName;
  final String GrowerAddressLine1;
  final String GrowerAddressLine2;
  final String GrowerCity;
  final String GrowerPostalCode;
  final String GrowerGender;
  final DateTime GrowerDOB;
  final String GrowerPhoneNum;
  final String MoneyMethod;
  final String GrowerEmail;

  const GrowerAccount({
    required this.GrowerAccountId,
    required this.GrowerFirstName,  
    required this.GrowerLastName,
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

  factory GrowerAccount.fromJson(Map<String, dynamic> json) {
    return GrowerAccount(
      GrowerAccountId: json['GrowerAccountId'] as int,
      GrowerFirstName: json['GrowerFirstName'] as String,
      GrowerLastName: json['GrowerLastName'] as String,
      GrowerAddressLine1: json['GrowerAddressLine1'] as String,
      GrowerAddressLine2: json['GrowerAddressLine2'] as String,
      GrowerCity: json['GrowerCity'] as String,
      GrowerPostalCode: json['GrowerPostalCode'] as String,
      GrowerGender: json['GrowerGender'] as String,
      GrowerDOB: DateTime.parse(json['GrowerDOB']),
      GrowerPhoneNum: json['GrowerPhoneNum'] as String,
      MoneyMethod: json['MoneyMethod'] as String,
      GrowerEmail: json['GrowerEmail'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'GrowerFirstName': GrowerFirstName,
      'GrowerLastName': GrowerLastName,
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
