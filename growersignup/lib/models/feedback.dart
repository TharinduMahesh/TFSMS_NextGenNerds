class FeedbackModel {
  final double rating;
  final List<String> tags;
  final String comment;
  final DateTime submittedAt;

  FeedbackModel({
    required this.rating,
    required this.tags,
    required this.comment,
    DateTime? submittedAt,
  }) : submittedAt = submittedAt ?? DateTime.now();

  Map<String, dynamic> toJson() {
    return {
      'rating': rating,
      'tags': tags,
      'comment': comment,
      'submittedAt': submittedAt.toIso8601String(),
    };
  }

  factory FeedbackModel.fromJson(Map<String, dynamic> json) {
    return FeedbackModel(
      rating: (json['rating'] as num).toDouble(),
      tags: List<String>.from(json['tags'] ?? []),
      comment: json['comment'] ?? '',
      submittedAt: DateTime.parse(json['submittedAt'] ?? DateTime.now().toIso8601String()),
    );
  }
}
