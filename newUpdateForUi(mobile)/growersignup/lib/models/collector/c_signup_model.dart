class CRegisterDto {
  final String cEmail;
  final String cPassword;
  final String cConfirmPassword;

  CRegisterDto({
    required this.cEmail,
    required this.cPassword,
    required this.cConfirmPassword,
  });

  Map<String, dynamic> toJson() {
    return {
      'CEmail': cEmail,
      'CPassword': cPassword,
      'CConfirmPassword': cConfirmPassword,
    };
  }
}
