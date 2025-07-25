class CollectorBankDetail {
  final int? collectorDetailId; // optional for POST
  final String bankName;
  final String branch;
  final String accountHolderName;
  final String accountNumber;
  final String collectorEmail;

  CollectorBankDetail({
    this.collectorDetailId,
    required this.bankName,
    required this.branch,
    required this.accountHolderName,
    required this.accountNumber,
    required this.collectorEmail,
  });

  // Factory constructor to create object from JSON
  factory CollectorBankDetail.fromJson(Map<String, dynamic> json) {
    return CollectorBankDetail(
      collectorDetailId: json['collectorDetailId'],
      bankName: json['bankName'],
      branch: json['branch'],
      accountHolderName: json['accountHolderName'],
      accountNumber: json['accountNumber'],
      collectorEmail: json['collectorEmail'],
    );
  }

  // Convert object to JSON for POST request
  Map<String, dynamic> toJson() {
    return {
      'bankName': bankName,
      'branch': branch,
      'accountHolderName': accountHolderName,
      'accountNumber': accountNumber,
      'collectorEmail': collectorEmail,
    };
  }
}
