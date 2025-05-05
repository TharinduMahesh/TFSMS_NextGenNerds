class GrowerBankModel {
  final int? BankDetailId;
  final String BankName;
  final String BranchName; // Default value
  final String AccountNumber;
  final String AccountHolderName;
  final String GrowerEmail;

  GrowerBankModel({
    this.BankDetailId,
    required this.BankName,
    required this.BranchName,
    required this.AccountNumber,
    required this.AccountHolderName,
    required this.GrowerEmail,
  });

  factory GrowerBankModel.fromJson(Map<String, dynamic> json) {
    return GrowerBankModel(
      BankDetailId: json['bankDetailId'],
      BankName: json['bankName'],
      BranchName: json['branchName'],
      AccountNumber: json['accountNumber'],
      AccountHolderName: json['accountHolderName'],
      GrowerEmail: json['GrowerEmail'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'bankName': BankName,
      'branchName': BranchName,
      'accountNumber': AccountNumber,
      'accountHolderName': AccountHolderName,
      'GrowerEmail': GrowerEmail,
    };
  }
}
