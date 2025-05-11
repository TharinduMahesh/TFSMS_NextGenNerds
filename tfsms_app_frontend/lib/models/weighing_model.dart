class Weighing {
  final String supplier;
  final double grossWeight;
  final double deductions;
  final double netWeight;
  final int sackCount;
  final String? containerId;
  final String status;

  Weighing({
    required this.supplier,
    required this.grossWeight,
    required this.deductions,
    required this.netWeight,
    required this.sackCount,
    this.containerId,
    required this.status,
  });

  factory Weighing.fromJson(Map<String, dynamic> json) => Weighing(
    supplier: json['supplier'],
    grossWeight: json['grossWeight'],
    deductions: json['deductions'],
    netWeight: json['netWeight'],
    sackCount: json['sackCount'],
    containerId: json['containerId'],
    status: json['status'],
  );

  Map<String, dynamic> toJson() => {
    'supplier': supplier,
    'grossWeight': grossWeight,
    'deductions': deductions,
    'netWeight': netWeight,
    'sackCount': sackCount,
    'containerId': containerId,
    'status': status,
  };
}
