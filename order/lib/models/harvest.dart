class Harvest {
  int? id;
  String weight;
  String harvestDate;
  String transportMethod;
  String paymentMethod;

  Harvest({
    this.id,
    required this.weight,
    required this.harvestDate,
    required this.transportMethod,
    required this.paymentMethod,
  });

  factory Harvest.fromJson(Map<String, dynamic> json) {
    return Harvest(
      id: json['id'],
      weight: json['weight'],
      harvestDate: json['harvestDate'],
      transportMethod: json['transportMethod'],
      paymentMethod: json['paymentMethod'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'weight': weight,
      'harvestDate': harvestDate,
      'transportMethod': transportMethod,
      'paymentMethod': paymentMethod,
    };
  }
}
