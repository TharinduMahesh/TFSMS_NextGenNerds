class Message {
  final int messageId;
  final int conversationId;
  final String senderType;
  final int senderId;
  final String messageText;
  final String sentAt;

  Message({
    required this.messageId,
    required this.conversationId,
    required this.senderType,
    required this.senderId,
    required this.messageText,
    required this.sentAt,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      messageId: json['messageId'],
      conversationId: json['conversationId'],
      senderType: json['senderType'],
      senderId: json['senderId'],
      messageText: json['messageText'],
      sentAt: json['sentAt'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'messageId': messageId,
      'conversationId': conversationId,
      'senderType': senderType,
      'senderId': senderId,
      'messageText': messageText,
      'sentAt': sentAt,
    };
  }
}
