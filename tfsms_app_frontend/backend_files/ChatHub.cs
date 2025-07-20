using Microsoft.AspNetCore.SignalR;

namespace TFSMS.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ILogger<ChatHub> _logger;

        public ChatHub(ILogger<ChatHub> logger)
        {
            _logger = logger;
        }

        // Called when a user connects
        public override async Task OnConnectedAsync()
        {
            _logger.LogInformation($"User {Context.ConnectionId} connected to chat hub");
            await base.OnConnectedAsync();
        }

        // Called when a user disconnects
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _logger.LogInformation($"User {Context.ConnectionId} disconnected from chat hub");
            
            // You might want to update user status to offline here
            // This would require mapping ConnectionId to UserId
            
            await base.OnDisconnectedAsync(exception);
        }

        // Join user to their personal group for receiving messages
        public async Task JoinUserGroup(string userId)
        {
            try
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
                _logger.LogInformation($"User {userId} joined their personal group");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error adding user {userId} to group");
            }
        }

        // Leave user's personal group
        public async Task LeaveUserGroup(string userId)
        {
            try
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
                _logger.LogInformation($"User {userId} left their personal group");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error removing user {userId} from group");
            }
        }

        // Send message to specific user
        public async Task SendMessage(string receiverId, object message)
        {
            try
            {
                await Clients.Group($"user_{receiverId}")
                    .SendAsync("ReceiveMessage", message);
                
                _logger.LogInformation($"Message sent to user {receiverId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending message to user {receiverId}");
            }
        }

        // Update user status
        public async Task UpdateUserStatus(string userId, string status)
        {
            try
            {
                // Broadcast status update to all connected clients
                await Clients.All.SendAsync("UserStatusChanged", userId, status);
                _logger.LogInformation($"User {userId} status updated to {status}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating status for user {userId}");
            }
        }

        // Send typing indicator
        public async Task SendTypingIndicator(string receiverId, string senderId)
        {
            try
            {
                await Clients.Group($"user_{receiverId}")
                    .SendAsync("UserTyping", senderId);
                
                _logger.LogInformation($"Typing indicator sent from {senderId} to {receiverId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending typing indicator from {senderId} to {receiverId}");
            }
        }

        // Join a room (for future group chat functionality)
        public async Task JoinRoom(string roomId)
        {
            try
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"room_{roomId}");
                _logger.LogInformation($"Connection {Context.ConnectionId} joined room {roomId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error joining room {roomId}");
            }
        }

        // Leave a room
        public async Task LeaveRoom(string roomId)
        {
            try
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"room_{roomId}");
                _logger.LogInformation($"Connection {Context.ConnectionId} left room {roomId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error leaving room {roomId}");
            }
        }

        // Send message to room (for future group chat functionality)
        public async Task SendToRoom(string roomId, object message)
        {
            try
            {
                await Clients.Group($"room_{roomId}")
                    .SendAsync("ReceiveRoomMessage", message);
                
                _logger.LogInformation($"Message sent to room {roomId}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error sending message to room {roomId}");
            }
        }
    }
}
