# Real-Time Chat System Implementation Guide

## Overview
This guide provides step-by-step instructions to implement a real-time chat system for your Tea Factory SMS application, allowing growers and collectors to communicate directly without saving messages to the database.

## System Architecture

```
┌─────────────────┐    SignalR     ┌─────────────────┐    HTTP/API    ┌─────────────────┐
│  Flutter App    │ ←──────────── │  ASP.NET Core   │ ←─────────── │    SQL Server   │
│  (Frontend)     │               │   (Backend)     │              │   (User Data)   │
│                 │               │                 │              │                 │
│ - Chat UI       │               │ - SignalR Hub   │              │ - User Info     │
│ - Real-time     │               │ - Chat API      │              │ - Status Only   │
│ - Status        │               │ - User Service  │              │ - No Messages   │
└─────────────────┘               └─────────────────┘              └─────────────────┘
```

## Features Implemented

✅ **Real-time messaging** with SignalR  
✅ **Online/offline status** tracking  
✅ **Typing indicators**  
✅ **User search** functionality  
✅ **Role-based avatars** (grower/collector)  
✅ **No message persistence** (as requested)  
✅ **Auto-reconnection** handling  
✅ **Modern Flutter UI**  

## Implementation Steps

### Step 1: Flutter Frontend Setup

#### 1.1 Install Dependencies
The following packages have been added to your `pubspec.yaml`:
```yaml
dependencies:
  signalr_netcore: ^1.3.7  # For SignalR connection
```

#### 1.2 Files Created

**Models:**
- `lib/models/chat_message_model.dart` - Message data model
- `lib/models/chat_user.dart` - User data model with status

**Services:**
- `lib/services/signalr_service.dart` - Real-time communication
- `lib/services/chat_api_service.dart` - HTTP API calls

**UI Pages:**
- `lib/pages/chat/chat_main_page.dart` - Main chat entry point
- `lib/pages/chat/chat_list_page.dart` - Users list with search
- `lib/pages/chat/chat_conversation_page.dart` - Chat conversation

#### 1.3 Route Added
Added to `main.dart`:
```dart
'/chat': (context) => const ChatMainPage(),
```

### Step 2: Backend ASP.NET Core Setup

#### 2.1 Required NuGet Packages
Add these packages to your ASP.NET Core project:
```xml
<PackageReference Include="Microsoft.AspNetCore.SignalR" Version="1.1.0" />
```

#### 2.2 Backend Files Created

**Controllers:**
- `backend_files/ChatController.cs` - Chat API endpoints

**SignalR Hub:**
- `backend_files/ChatHub.cs` - Real-time communication hub

**Models:**
- `backend_files/ChatModels.cs` - Data models

**Services:**
- `backend_files/UserService.cs` - User management service

**Configuration:**
- `backend_files/Program.cs` - Updated startup configuration

### Step 3: Database Requirements

#### 3.1 Users Table Update
Ensure your Users table has these columns:
```sql
-- Assuming you already have a Users table, add these if missing:
ALTER TABLE Users ADD COLUMN Role NVARCHAR(50) -- 'grower' or 'collector'
ALTER TABLE Users ADD COLUMN IsActive BIT DEFAULT 1
ALTER TABLE Users ADD COLUMN Email NVARCHAR(255)
```

#### 3.2 No Additional Tables Needed
Since messages are not saved, no additional tables are required.

## Integration with Existing System

### Step 4: Update Your Main Navigation

Add a chat button to your main dashboard/navigation:

```dart
// In your main navigation widget
FloatingActionButton(
  onPressed: () {
    Navigator.pushNamed(context, '/chat');
  },
  child: const Icon(Icons.chat),
  backgroundColor: Colors.green,
)

// Or add to bottom navigation bar
BottomNavigationBarItem(
  icon: Icon(Icons.chat),
  label: 'Messages',
)
```

### Step 5: User Authentication Integration

Update the hardcoded user data in `ChatMainPage`:

```dart
class _ChatMainPageState extends State<ChatMainPage> {
  // Replace these with actual authenticated user data
  late String _currentUserId;
  late String _currentUserName;  
  late String _currentUserRole;

  @override
  void initState() {
    super.initState();
    // Get from your authentication service
    _currentUserId = AuthService.getCurrentUserId();
    _currentUserName = AuthService.getCurrentUserName();
    _currentUserRole = AuthService.getCurrentUserRole();
  }
}
```

## Running the Application

### Step 6: Start Backend

1. Copy the backend files to your ASP.NET Core project
2. Update `UserService.cs` to query your actual Users table
3. Run your backend API:
```bash
dotnet run
```

### Step 7: Start Frontend

1. Get Flutter dependencies:
```bash
flutter pub get
```

2. Run the Flutter app:
```bash
flutter run
```

## Configuration

### Backend Configuration

Update API URLs in Flutter services to match your backend:
```dart
// In signalr_service.dart and chat_api_service.dart
static const String baseUrl = 'https://your-backend-url:port';
```

### CORS Configuration

Ensure CORS is properly configured in your backend for your Flutter app's URL:
```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.WithOrigins("http://localhost:8080") // Your Flutter app URL
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});
```

## Testing the Chat System

### Test Scenarios

1. **Basic Messaging:**
   - Open chat on two devices/browsers
   - Send messages between users
   - Verify real-time delivery

2. **Status Tracking:**
   - Go online/offline
   - Check status updates in real-time
   - Test away/busy statuses

3. **Typing Indicators:**
   - Start typing in one chat
   - Verify typing indicator on other device

4. **User Search:**
   - Search for users by name
   - Filter by grower/collector role

## Troubleshooting

### Common Issues

1. **SignalR Connection Failed:**
   - Check backend URL is correct
   - Verify CORS configuration
   - Ensure SignalR hub is mapped correctly

2. **Messages Not Sending:**
   - Check network connectivity
   - Verify API endpoints are working
   - Check browser console for errors

3. **Status Not Updating:**
   - Ensure SignalR connection is active
   - Check UserService implementation
   - Verify hub broadcasting

### Debug Tips

- Enable logging in both Flutter and ASP.NET Core
- Use browser dev tools to check network requests
- Monitor SignalR connection status
- Check API response codes

## Production Considerations

### Security
- Implement proper authentication tokens
- Add user permission validation
- Use HTTPS in production
- Consider message encryption

### Scalability
- Implement proper connection management
- Add rate limiting for messages
- Consider Redis backplane for multiple servers
- Monitor memory usage for in-memory status

### Performance
- Implement connection pooling
- Add message queuing for high volume
- Optimize SignalR group management
- Consider CDN for static assets

## Future Enhancements

### Planned Features
- Push notifications for offline users
- File attachments (images, documents)
- Group chat functionality
- Message read receipts
- Message search within conversations
- User blocking/reporting
- Chat moderation tools

### Database Integration (Optional)
If you decide to save messages later, you can add:
```sql
CREATE TABLE ChatMessages (
    Id UNIQUEIDENTIFIER PRIMARY KEY,
    SenderId NVARCHAR(255),
    ReceiverId NVARCHAR(255),
    Content NVARCHAR(MAX),
    Timestamp DATETIME2,
    IsDelivered BIT,
    IsRead BIT,
    MessageType NVARCHAR(50)
);
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API logs and Flutter console
3. Test individual components separately
4. Verify network connectivity and CORS

---

**Next Steps:**
1. Copy backend files to your ASP.NET Core project
2. Update user authentication integration
3. Configure API URLs
4. Test the chat system
5. Deploy to production

The chat system is now ready for your tea factory application with real-time messaging capabilities!
