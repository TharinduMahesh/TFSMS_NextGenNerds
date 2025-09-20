class CLoginDto {
  final String cEmail;
  final String cPassword;

  CLoginDto({
    required this.cEmail,
    required this.cPassword,
  });

  Map<String, dynamic> toJson() {
    return {
      'CEmail': cEmail,
      'CPassword': cPassword,
    };
  }
}
