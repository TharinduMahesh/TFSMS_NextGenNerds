class CSignupModel {
  final int? CollectorId;
  final String CollectorEmail;
  final String CollectorPassword;

  const CSignupModel({
    this.CollectorId,
    required this.CollectorEmail,
    required this.CollectorPassword,
  });

    factory CSignupModel.fromJson(Map<String, dynamic> json) {
        return CSignupModel(
        CollectorId: json['CollectorId'] as int?,
        CollectorEmail: json['CollectorEmail'] as String,
        CollectorPassword: json['CollectorPassword'] as String,
        );
    }

    Map<String, dynamic> toJson() {
        return {
        'CollectorEmail': CollectorEmail,
        'CollectorPassword': CollectorPassword,
        };
    }
}
