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
      'dto': {
        'rating': rating,
        'tags': tags.join(','), // Convert array to comma-separated string
        'comment': comment,
        'submittedAt': submittedAt.toIso8601String(),
      }
    };
  }

  factory FeedbackModel.fromJson(Map<String, dynamic> json) {
    // Handle both old and new formats
    final data = json['dto'] ?? json;
    final tagsData = data['tags'];
    List<String> tagsList;
    
    if (tagsData is String) {
      // If tags is a string, split by comma
      tagsList = tagsData.isEmpty ? [] : tagsData.split(',');
    } else if (tagsData is List) {
      // If tags is already a list
      tagsList = List<String>.from(tagsData);
    } else {
      tagsList = [];
    }
    
    return FeedbackModel(
      rating: (data['rating'] as num).toDouble(),
      tags: tagsList,
      comment: data['comment'] ?? '',
      submittedAt: DateTime.parse(data['submittedAt'] ?? DateTime.now().toIso8601String()),
    );
  }
}
