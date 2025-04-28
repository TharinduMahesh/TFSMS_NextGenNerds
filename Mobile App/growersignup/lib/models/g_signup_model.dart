class GSignupModel {
  final int GrowerId;
  final String GrowerEmail;
  final String GrowerPassword;

  const GSignupModel({
    required this.GrowerId,
    required this.GrowerEmail,
    required this.GrowerPassword,
  });

    factory GSignupModel.fromJson(Map<String, dynamic> json) {
        return GSignupModel(
        GrowerId: json['GrowerId'] as int,
        GrowerEmail: json['GrowerEmail'] as String,
        GrowerPassword: json['GrowerPassword'] as String,
        );
    }

    Map<String, dynamic> toJson() {
        return {
        'GrowerEmail': GrowerEmail,
        'GrowerPassword': GrowerPassword,
        };
    }
}
