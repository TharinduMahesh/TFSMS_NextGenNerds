class GrowerBankDetail {
  final int? growerDetailId; // optional for POST
  final String bankName;
  final String branch;
  final String accountHolderName;
  final String accountNumber;
  final String growerEmail;

  GrowerBankDetail({
    this.growerDetailId,
    required this.bankName,
    required this.branch,
    required this.accountHolderName,
    required this.accountNumber,
    required this.growerEmail,
  });

  // Factory constructor to create object from JSON
  factory GrowerBankDetail.fromJson(Map<String, dynamic> json) {
    return GrowerBankDetail(
      growerDetailId: json['growerDetailId'],
      bankName: json['bankName'],
      branch: json['branch'],
      accountHolderName: json['accountHolderName'],
      accountNumber: json['accountNumber'],
      growerEmail: json['growerEmail'],
    );
  }

  // Convert object to JSON for POST request
  Map<String, dynamic> toJson() {
    return {
      'bankName': bankName,
      'branch': branch,
      'accountHolderName': accountHolderName,
      'accountNumber': accountNumber,
      'growerEmail': growerEmail,
    };
  }
}
