class Conversation {
  final int conversationId;
  final int growerAccountId;
  final int collectorAccountId;
  final String createdAt;

  // Optional: grower/collector names if API includes them
  final String? growerName;
  final String? collectorName;

  Conversation({
    required this.conversationId,
    required this.growerAccountId,
    required this.collectorAccountId,
    required this.createdAt,
    this.growerName,
    this.collectorName,
  });

  factory Conversation.fromJson(Map<String, dynamic> json) {
    return Conversation(
      conversationId: json['conversationId'],
      growerAccountId: json['growerAccountId'],
      collectorAccountId: json['collectorAccountId'],
      createdAt: json['createdAt'],
      growerName: json['grower']?['growerFirstName'], // optional
      collectorName: json['collector']?['collectorFirstName'], // optional
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'conversationId': conversationId,
      'growerAccountId': growerAccountId,
      'collectorAccountId': collectorAccountId,
      'createdAt': createdAt,
    };
  }
}
