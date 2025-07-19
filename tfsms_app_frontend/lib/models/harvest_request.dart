class HarvestRequest {
  final int? id;
  final DateTime date;
  final DateTime time;
  final double supperLeafWeight;
  final double normalLeafWeight;
  final String transportMethod;
  final String paymentMethod;
  final String address;
  final int growerAccountId;
  final String status;
  final DateTime createdAt;

  HarvestRequest({
    this.id,
    required this.date,
    required this.time,
    required this.supperLeafWeight,
    required this.normalLeafWeight,
    required this.transportMethod,
    required this.paymentMethod,
    required this.address,
    required this.growerAccountId,
    this.status = 'Pending',
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  factory HarvestRequest.fromJson(Map<String, dynamic> json) {
    return HarvestRequest(
      id: json['id'] as int?,
      date: DateTime.parse(json['date'] as String),
      time: DateTime.parse(json['time'] as String),
      supperLeafWeight: (json['supperLeafWeight'] as num).toDouble(),
      normalLeafWeight: (json['normalLeafWeight'] as num).toDouble(),
      transportMethod: json['transportMethod'] as String,
      paymentMethod: json['paymentMethod'] as String,
      address: json['address'] as String,
      growerAccountId: json['growerAccountId'] as int? ?? 1,
      status: json['status'] as String? ?? 'Pending',
      createdAt: json['createdAt'] != null 
          ? DateTime.parse(json['createdAt'] as String)
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'date': date.toIso8601String(),
      'time': time.toIso8601String(),
      'supperLeafWeight': supperLeafWeight,
      'normalLeafWeight': normalLeafWeight,
      'transportMethod': transportMethod,
      'paymentMethod': paymentMethod,
      'address': address,
      'growerAccountId': growerAccountId,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  double get totalWeight => supperLeafWeight + normalLeafWeight;

  @override
  String toString() {
    return 'HarvestRequest(id: $id, grower: $growerAccountId, total: ${totalWeight}kg, status: $status)';
  }
}
