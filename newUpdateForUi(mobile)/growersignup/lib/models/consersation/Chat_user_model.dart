class ChatUser {
  final int id;
  final String fullName;
  final String userType;

  ChatUser({
    required this.id,
    required this.fullName,
    required this.userType,
  });

  factory ChatUser.fromJson(Map<String, dynamic> json) {
    return ChatUser(
      id: json['id'],
      fullName: json['fullName'],
      userType: json['userType'],
    );
  }
}
