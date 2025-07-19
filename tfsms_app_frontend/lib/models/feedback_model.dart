class FeedbackModel {
  final double rating;
  final String tags;
  final String? comment;
  final DateTime createdAt;

  FeedbackModel({
    required this.rating,
    required this.tags,
    this.comment,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  // Convert to JSON for API submission - matches C# backend model
  Map<String, dynamic> toJson() {
    return {
      'Rating': rating,
      'Tags': tags,
      'Comment': comment,
      'CreatedAt': createdAt.toIso8601String(),
    };
  }

  // Create from JSON response
  factory FeedbackModel.fromJson(Map<String, dynamic> json) {
    return FeedbackModel(
      rating: (json['Rating'] ?? 0.0).toDouble(),
      tags: json['Tags'] ?? '',
      comment: json['Comment'],
      createdAt: json['CreatedAt'] != null 
          ? DateTime.parse(json['CreatedAt'])
          : DateTime.now(),
    );
  }

  @override
  String toString() {
    return 'FeedbackModel(rating: $rating, tags: $tags, comment: ${comment ?? "null"})';
  }
}
