# Chat System Documentation

This chat system allows growers and collectors to communicate directly through the TFSMS app.

## Features

- **Real-time messaging** between growers and collectors
- **User list** showing online/offline status
- **Search functionality** to find specific users
- **Role-based avatars** (different icons for growers vs collectors)
- **Message timestamps** with smart formatting
- **Clean, modern UI** matching the app's design theme

## Backend Integration

The chat system connects to your .NET Core backend API with the following endpoints:

- `POST /api/Chat/send` - Send a new message
- `GET /api/Chat/conversation` - Get conversation history between two users

## File Structure

```
lib/
├── models/
│   ├── chat_message_model.dart  # Chat message data model
│   └── chat_user.dart           # User data model for chat
├── services/
│   └── chat_api_service.dart    # API service for chat operations
└── pages/
    └── chat/
        ├── chat_main_page.dart       # Entry point for chat
        ├── chat_list_page.dart       # List of available users
        └── chat_conversation_page.dart # Individual conversation view
```

## Usage

### Accessing Chat
1. Open the app
2. Navigate to the "Messages" tab in the bottom navigation
3. Select a user to start chatting

### Starting a Conversation
1. From the chat list, tap on any user
2. Type your message in the input field
3. Tap send or press Enter

### User Interface Elements

#### Chat List Page
- Search bar to find users
- User cards showing:
  - Name and role (grower/collector)
  - Online status indicator
  - Last seen time (if offline)

#### Conversation Page
- Message bubbles with sender identification
- Timestamps for each message
- User avatar and online status in header
- Real-time message sending

## Configuration

### User Information
Currently, the chat system uses hardcoded user information in `ChatMainPage`:

```dart
static const int _currentUserId = 1;
static const String _currentUserName = "David Peters";
static const String _currentUserRole = "grower";
```

**Important:** Replace these with actual user data from your authentication system.

### API Endpoint
The base URL is configured in `ChatApiService`:

```dart
static const String _baseUrl = 'https://localhost:7211/api/Chat';
```

Update this to match your production API URL.

### Mock Data
The `getAvailableUsers` method in `ChatApiService` currently returns mock data. Replace this with an actual API call to get real users from your backend.

## Integration Steps

1. **Update User Data**: Replace hardcoded user information with actual authenticated user data
2. **API Configuration**: Update the base URL to your production API
3. **User Management**: Implement real user fetching from your backend
4. **Authentication**: Integrate with your existing user authentication system

## Future Enhancements

- **Real-time updates** using SignalR or WebSockets
- **Push notifications** for new messages
- **File attachments** (images, PDFs)
- **Message read receipts**
- **Typing indicators**
- **Message search** within conversations
- **Group chat** functionality

## Troubleshooting

### Common Issues

1. **Network Errors**: Check API URL and network connectivity
2. **User Not Found**: Ensure user IDs are correctly passed
3. **Messages Not Sending**: Verify backend API is running and accessible

### Error Handling

The app includes comprehensive error handling with user-friendly messages:
- Network connectivity issues
- API errors
- Failed message sending
- Conversation loading failures

## Security Considerations

- All API calls should use HTTPS in production
- Implement proper authentication tokens
- Validate user permissions before allowing chat access
- Consider message encryption for sensitive communications
