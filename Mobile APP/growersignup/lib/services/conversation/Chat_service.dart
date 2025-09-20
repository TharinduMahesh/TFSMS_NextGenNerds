import 'package:growersignup/assets/constants/baseurl.dart';
import 'package:growersignup/models/consersation/message_model.dart';
import 'package:signalr_core/signalr_core.dart';

class ChatService {
  // FIXED: Using 10.0.2.2 for Android emulator.
  static const String _hubUrl = '$cUrl/chathub';
  HubConnection? _hubConnection;

  Future<void> connect(int userId, String userType) async {
    if (_hubConnection?.state == HubConnectionState.connected) return;
    _hubConnection = HubConnectionBuilder()
        .withUrl(
          '$_hubUrl?userId=$userId&userType=$userType',
          HttpConnectionOptions(logging: (level, message) => print(message)),
        )
        .build();
    _hubConnection?.onclose((error) => print('SignalR Connection closed: $error'));
    await _hubConnection?.start();
  }

  void onReceiveMessage(Function(Message) onMessageReceived) {
    _hubConnection?.on('ReceiveMessage', (arguments) {
      if (arguments != null && arguments.isNotEmpty) {
        onMessageReceived(Message.fromJson(arguments[0] as Map<String, dynamic>));
      }
    });
  }

  Future<void> sendMessage(Message message) async {
    if (_hubConnection?.state != HubConnectionState.connected) {
      print('Cannot send message. SignalR not connected.');
      return;
    }
    await _hubConnection?.invoke('SendMessage', args: [message.toJson()]);
  }

  Future<void> disconnect() async {
    await _hubConnection?.stop();
  }
}
