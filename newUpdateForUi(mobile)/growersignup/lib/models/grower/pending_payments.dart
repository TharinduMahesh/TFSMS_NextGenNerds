// payment_models.dart

import 'package:flutter/foundation.dart';

/// Data Transfer Object for the payment list (first page).
class PaymentDto {
  final int growerOrderId;
  final String collectorFirstName;
  final String collectorLastName;
  final String collectorCity;
  final double grossPayment;

  PaymentDto({
    required this.growerOrderId,
    required this.collectorFirstName,
    required this.collectorLastName,
    required this.collectorCity,
    required this.grossPayment,
  });

  /// Factory constructor to create a PaymentDto from a JSON object.
  factory PaymentDto.fromJson(Map<String, dynamic> json) {
    return PaymentDto(
      growerOrderId: json['growerOrderId'] as int,
      collectorFirstName: json['collectorFirstName'] as String,
      collectorLastName: json['collectorLastName'] as String,
      collectorCity: json['collectorCity'] as String,
      grossPayment: (json['grossPayment'] as num).toDouble(),
    );
  }
}

/// Data Transfer Object for the payment details (second page).
class PaymentDetailDto {
  final double superTeaQuantity;
  final double greenTeaQuantity;
  final String growerFirstName;
  final String growerLastName;
  final String collectorPhoneNum;
  final String collectorVehicleNum;
  final String? grossPayment;

  PaymentDetailDto({
    required this.superTeaQuantity,
    required this.greenTeaQuantity,
    required this.growerFirstName,
    required this.growerLastName,
    required this.collectorPhoneNum,
    required this.collectorVehicleNum,
    this.grossPayment,
  });

  /// Factory constructor to create a PaymentDetailDto from a JSON object.
  factory PaymentDetailDto.fromJson(Map<String, dynamic> json) {
    return PaymentDetailDto(
      superTeaQuantity: (json['superTeaQuantity'] as num).toDouble(),
      greenTeaQuantity: (json['greenTeaQuantity'] as num).toDouble(),
      growerFirstName: json['growerFirstName'] as String,
      growerLastName: json['growerLastName'] as String,
      collectorPhoneNum: json['collectorPhoneNum'] as String,
      collectorVehicleNum: json['collectorVehicleNum'] as String,
    );
  }
}
