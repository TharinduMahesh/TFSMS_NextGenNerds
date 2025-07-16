import 'package:growersignup/models/fertilizer_report.dart';

class FertilizerResponse {
  final double totalFertilizer;
  final List<FertilizerTransaction> records;

  FertilizerResponse({
    required this.totalFertilizer,
    required this.records,
  });

  factory FertilizerResponse.fromJson(Map<String, dynamic> json) {
    var list = json['records'] as List;
    List<FertilizerTransaction> transactions =
        list.map((item) => FertilizerTransaction.fromJson(item)).toList();

    return FertilizerResponse(
      totalFertilizer: (json['totalFertilizer'] as num).toDouble(),
      records: transactions,
    );
  }
}
