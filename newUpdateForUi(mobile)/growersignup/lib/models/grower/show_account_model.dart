class GrowerCreateAccount {
  int? growerAccountId;
  String growerFirstName;
  String growerLastName;
  String growerNIC;
  String growerAddressLine1;
  String? growerAddressLine2;
  String growerCity;
  String? growerPostalCode;
  String? growerGender;
  DateTime? growerDOB;
  String? growerPhoneNum;
  String growerEmail;

  GrowerCreateAccount({
    this.growerAccountId,
    required this.growerFirstName,
    required this.growerLastName,
    required this.growerNIC,
    required this.growerAddressLine1,
    this.growerAddressLine2,
    required this.growerCity,
    this.growerPostalCode,
    this.growerGender,
    this.growerDOB,
    this.growerPhoneNum,
    required this.growerEmail,
  });

  factory GrowerCreateAccount.fromJson(Map<String, dynamic> json) {
    return GrowerCreateAccount(
      growerAccountId: json['growerAccountId'],
      growerFirstName: json['growerFirstName'],
      growerLastName: json['growerLastName'],
      growerNIC: json['growerNIC'],
      growerAddressLine1: json['growerAddressLine1'],
      growerAddressLine2: json['growerAddressLine2'],
      growerCity: json['growerCity'],
      growerPostalCode: json['growerPostalCode'],
      growerGender: json['growerGender'],
      growerDOB: json['growerDOB'] != null ? DateTime.parse(json['growerDOB']) : null,
      growerPhoneNum: json['growerPhoneNum'],
      growerEmail: json['growerEmail'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'growerAccountId': growerAccountId,
      'growerFirstName': growerFirstName,
      'growerLastName': growerLastName,
      'growerNIC': growerNIC,
      'growerAddressLine1': growerAddressLine1,
      'growerAddressLine2': growerAddressLine2,
      'growerCity': growerCity,
      'growerPostalCode': growerPostalCode,
      'growerGender': growerGender,
      'growerDOB': growerDOB?.toIso8601String(),
      'growerPhoneNum': growerPhoneNum,
      'growerEmail': growerEmail,
    };
  }
}
