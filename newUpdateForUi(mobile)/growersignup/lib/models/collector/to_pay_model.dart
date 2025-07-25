class ToPayModel {
  final int refNumber;
  final double amount;
  String? growerName;
  String? growerCity;
  String? collectorEmail;

  ToPayModel({
    required this.refNumber,
    required this.amount,
    required this.growerName,
    required this.growerCity,
    required this.collectorEmail,
  });

  factory ToPayModel.fromJson(Map<String, dynamic> json) {
    return ToPayModel(
      refNumber: json['refNumber'],
      amount: json['amount'].toDouble(),
      growerName: json['growerName'],
      growerCity: json['growerCity'],
      collectorEmail: json['collectorEmail'],
    );
  }
}
