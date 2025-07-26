class Message {
  final int messageId;
  final int conversationId;
  final String senderType;
  final String senderEmail;
  final String messageText;
  final DateTime sentAt;

  Message({
    required this.messageId,
    required this.conversationId,
    required this.senderType,
    required this.senderEmail,
    required this.messageText,
    required this.sentAt,
  });

  // Factory constructor to create a Message object from a JSON map.
  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      messageId: json['messageId'] as int,
      conversationId: json['conversationId'] as int,
      senderType: json['senderType'] as String,
      senderEmail: json['senderEmail'] as String,
      messageText: json['messageText'] as String,
      sentAt: DateTime.parse(json['sentAt'] as String),
    );
  }
}