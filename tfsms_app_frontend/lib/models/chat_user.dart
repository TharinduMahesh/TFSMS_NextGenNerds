enum UserStatus {
  online,
  offline,
  away,
  busy
}

class ChatUser {
  final String id;
  final String name;
  final String role; // 'grower' or 'collector'
  final String email;
  final String? profileImageUrl;
  final UserStatus status;
  final DateTime? lastSeen;
  final bool isActive;

  ChatUser({
    required this.id,
    required this.name,
    required this.role,
    required this.email,
    this.profileImageUrl,
    this.status = UserStatus.offline,
    this.lastSeen,
    this.isActive = true,
  });

  factory ChatUser.fromJson(Map<String, dynamic> json) {
    return ChatUser(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      role: json['role'] ?? 'grower',
      email: json['email'] ?? '',
      profileImageUrl: json['profileImageUrl'],
      status: UserStatus.values.firstWhere(
        (e) => e.toString().split('.').last == (json['status'] ?? 'offline'),
        orElse: () => UserStatus.offline,
      ),
      lastSeen: json['lastSeen'] != null 
          ? DateTime.parse(json['lastSeen']) 
          : null,
      isActive: json['isActive'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'role': role,
      'email': email,
      'profileImageUrl': profileImageUrl,
      'status': status.toString().split('.').last,
      'lastSeen': lastSeen?.toIso8601String(),
      'isActive': isActive,
    };
  }

  bool get isOnline => status == UserStatus.online;
  
  String get statusText {
    switch (status) {
      case UserStatus.online:
        return 'Online';
      case UserStatus.away:
        return 'Away';
      case UserStatus.busy:
        return 'Busy';
      case UserStatus.offline:
        if (lastSeen != null) {
          final now = DateTime.now();
          final difference = now.difference(lastSeen!);
          
          if (difference.inMinutes < 1) {
            return 'Just now';
          } else if (difference.inMinutes < 60) {
            return '${difference.inMinutes}m ago';
          } else if (difference.inHours < 24) {
            return '${difference.inHours}h ago';
          } else {
            return '${difference.inDays}d ago';
          }
        }
        return 'Offline';
    }
  }

  ChatUser copyWith({
    String? id,
    String? name,
    String? role,
    String? email,
    String? profileImageUrl,
    UserStatus? status,
    DateTime? lastSeen,
    bool? isActive,
  }) {
    return ChatUser(
      id: id ?? this.id,
      name: name ?? this.name,
      role: role ?? this.role,
      email: email ?? this.email,
      profileImageUrl: profileImageUrl ?? this.profileImageUrl,
      status: status ?? this.status,
      lastSeen: lastSeen ?? this.lastSeen,
      isActive: isActive ?? this.isActive,
    );
  }
}
