class Conversation {
  final int conversationId;
  final int growerAccountId;
  final String growerEmail;
  final int collectorAccountId;
  final String collectorEmail;
  final DateTime createdAt;

  Conversation({
    required this.conversationId,
    required this.growerAccountId,
    required this.growerEmail,
    required this.collectorAccountId,
    required this.collectorEmail,
    required this.createdAt,
  });

  // Factory constructor to create a Conversation object from a JSON map.
  // This is crucial for parsing the API response.
  factory Conversation.fromJson(Map<String, dynamic> json) {
    return Conversation(
      conversationId: json['conversationId'] as int,
      growerAccountId: json['growerAccountId'] as int,
      growerEmail: json['growerEmail'] as String,
      collectorAccountId: json['collectorAccountId'] as int,
      collectorEmail: json['collectorEmail'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
    );
  }
}
