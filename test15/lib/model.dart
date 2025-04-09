class User {
  final int? userId;
  final String quantity;
  final String transportmethod;
  final String paymentmethod;

  const User({
    this.userId,
    required this.quantity,
    required this.transportmethod,
    required this.paymentmethod,
  });

  const User.empty({
    this.userId = 0,
    this.quantity = '',
    this.transportmethod = '',
    this.paymentmethod = '',
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
    userId: json['userId'],
    quantity: json['quantity'],
    transportmethod: json['transportmethod'],
    paymentmethod: json['paymentmethod'],
  );

  Map<String, dynamic> toJson() => {
    "userId": userId,
    "quantity": quantity,
    "transportmethod": transportmethod,
    "paymentmethod": paymentmethod,
  };
}
