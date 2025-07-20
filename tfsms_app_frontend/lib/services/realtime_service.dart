import 'dart:async';
import 'dart:io';
import '../models/chat_message_model.dart';
import '../models/chat_user.dart';

class SignalRService {
  static SignalRService? _instance;
  static SignalRService get instance => _instance ??= SignalRService._internal();
  
  SignalRService._internal();
  
  WebSocket? _webSocket;
  static const String baseUrl = 'localhost:7203';
  static const String wsUrl = 'ws://$baseUrl/ws';
  
  // Stream controllers for real-time updates
  final StreamController<ChatMessage> _messageController = StreamController<ChatMessage>.broadcast();
  final StreamController<Map<String, UserStatus>> _userStatusController = StreamController<Map<String, UserStatus>>.broadcast();
  final StreamController<String> _typingController = StreamController<String>.broadcast();
  
  Stream<ChatMessage> get messageStream => _messageController.stream;
  Stream<Map<String, UserStatus>> get userStatusStream => _userStatusController.stream;
  Stream<String> get typingStream => _typingController.stream;
  
  String? _currentUserId;
  bool _isConnected = false;
  Timer? _reconnectTimer;
  
  Future<void> connect(String userId) async {
    if (_isConnected && _currentUserId == userId) return;
    
    _currentUserId = userId;
    
    try {
      // For demo purposes, we'll simulate the connection
      // In a real app, you would connect to your WebSocket server
      await _simulateConnection();
      
      _isConnected = true;
      print('✅ Real-time service connected for user: $userId');
      
      // Start simulating periodic status updates
      _startStatusSimulation();
      
    } catch (e) {
      print('❌ Real-time connection failed: $e');
      _isConnected = false;
      _scheduleReconnect();
    }
  }
  
  Future<void> _simulateConnection() async {
    // Simulate connection delay
    await Future.delayed(const Duration(milliseconds: 500));
    
    // In a real implementation, you would establish WebSocket connection:
    // _webSocket = await WebSocket.connect(wsUrl);
    // _setupWebSocketListeners();
  }
  
  void _startStatusSimulation() {
    // Simulate periodic status updates for demo
    Timer.periodic(const Duration(seconds: 30), (timer) {
      if (!_isConnected) {
        timer.cancel();
        return;
      }
      
      // Simulate random status changes
      final mockStatusUpdate = {
        '${DateTime.now().millisecondsSinceEpoch % 5 + 1}': UserStatus.values[DateTime.now().millisecondsSinceEpoch % 4],
      };
      _userStatusController.add(mockStatusUpdate);
    });
  }
  
  Future<void> sendMessage(ChatMessage message) async {
    if (!_isConnected) {
      throw Exception('Real-time service not connected');
    }
    
    try {
      // In a real implementation, send via WebSocket:
      // _webSocket?.add(jsonEncode({
      //   'type': 'message',
      //   'data': message.toJson(),
      // }));
      
      // For demo, simulate immediate delivery
      await Future.delayed(const Duration(milliseconds: 100));
      print('✅ Message sent via real-time service');
      
    } catch (e) {
      print('❌ Error sending message: $e');
      rethrow;
    }
  }
  
  Future<void> updateUserStatus(UserStatus status) async {
    if (!_isConnected || _currentUserId == null) {
      return;
    }
    
    try {
      // In a real implementation:
      // _webSocket?.add(jsonEncode({
      //   'type': 'status_update',
      //   'userId': _currentUserId!,
      //   'status': status.toString().split('.').last,
      // }));
      
      print('✅ User status updated to $status');
      
    } catch (e) {
      print('❌ Error updating user status: $e');
    }
  }
  
  Future<void> sendTypingIndicator(String receiverId) async {
    if (!_isConnected || _currentUserId == null) {
      return;
    }
    
    try {
      // In a real implementation:
      // _webSocket?.add(jsonEncode({
      //   'type': 'typing',
      //   'receiverId': receiverId,
      //   'senderId': _currentUserId!,
      // }));
      
      print('✅ Typing indicator sent');
      
    } catch (e) {
      print('❌ Error sending typing indicator: $e');
    }
  }
  
  void _scheduleReconnect() {
    _reconnectTimer?.cancel();
    _reconnectTimer = Timer(const Duration(seconds: 5), () {
      if (_currentUserId != null && !_isConnected) {
        print('🔄 Attempting to reconnect...');
        connect(_currentUserId!);
      }
    });
  }
  
  Future<void> disconnect() async {
    try {
      // Update status to offline before disconnecting
      if (_currentUserId != null) {
        await updateUserStatus(UserStatus.offline);
      }
      
      _webSocket?.close();
      _webSocket = null;
      _isConnected = false;
      _currentUserId = null;
      _reconnectTimer?.cancel();
      
      print('✅ Real-time service disconnected');
    } catch (e) {
      print('❌ Error disconnecting: $e');
    }
  }
  
  bool get isConnected => _isConnected;
  
  void dispose() {
    _messageController.close();
    _userStatusController.close();
    _typingController.close();
    disconnect();
  }
}
