class Message {
  final int messageId;
  final int senderId;
  final int receiverId;
  final String senderType;
  final String receiverType;
  final String content;
  final DateTime timestamp;
  final bool isRead;

  Message({
    required this.messageId,
    required this.senderId,
    required this.receiverId,
    required this.senderType,
    required this.receiverType,
    required this.content,
    required this.timestamp,
    required this.isRead,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      messageId: json['messageId'] ?? 0,
      senderId: json['senderId'],
      receiverId: json['receiverId'],
      senderType: json['senderType'],
      receiverType: json['receiverType'],
      content: json['content'],
      timestamp: DateTime.parse(json['timestamp']),
      isRead: json['isRead'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'messageId': 0,
      'senderId': senderId,
      'receiverId': receiverId,
      'senderType': senderType,
      'receiverType': receiverType,
      'content': content,
      'timestamp': timestamp.toIso8601String(),
      'isRead': isRead,
    };
  }
}
