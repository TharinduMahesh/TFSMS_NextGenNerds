using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using TFSMS.Models;
using TFSMS.Hubs;
using TFSMS.Services;

namespace TFSMS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly IUserService _userService;
        private readonly ILogger<ChatController> _logger;

        public ChatController(
            IHubContext<ChatHub> hubContext,
            IUserService userService,
            ILogger<ChatController> logger)
        {
            _hubContext = hubContext;
            _userService = userService;
            _logger = logger;
        }

        // GET: api/Chat/users
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers([FromQuery] string? excludeUserId = null)
        {
            try
            {
                var users = await _userService.GetChatUsersAsync(excludeUserId);
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching chat users");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/Chat/conversation
        [HttpGet("conversation")]
        public async Task<IActionResult> GetConversation(
            [FromQuery] string user1Id,
            [FromQuery] string user2Id)
        {
            try
            {
                // Since messages are not saved, return empty list
                // This endpoint is kept for potential future enhancements
                var messages = new List<ChatMessage>();
                return Ok(messages);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching conversation");
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/Chat/send
        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] ChatMessage message)
        {
            try
            {
                if (string.IsNullOrEmpty(message.SenderId) || 
                    string.IsNullOrEmpty(message.ReceiverId) || 
                    string.IsNullOrEmpty(message.Content))
                {
                    return BadRequest("Invalid message data");
                }

                // Generate message ID if not provided
                message.Id = message.Id ?? Guid.NewGuid().ToString();
                message.Timestamp = DateTime.UtcNow;
                message.IsDelivered = true;

                // Send to SignalR hub for real-time delivery
                await _hubContext.Clients.Group($"user_{message.ReceiverId}")
                    .SendAsync("ReceiveMessage", message);

                _logger.LogInformation($"Message sent from {message.SenderId} to {message.ReceiverId}");
                
                return Ok(new { success = true, messageId = message.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending message");
                return StatusCode(500, "Internal server error");
            }
        }

        // PATCH: api/Chat/user-status
        [HttpPatch("user-status")]
        public async Task<IActionResult> UpdateUserStatus([FromBody] UserStatusUpdate statusUpdate)
        {
            try
            {
                if (string.IsNullOrEmpty(statusUpdate.UserId))
                {
                    return BadRequest("User ID is required");
                }

                // Update user status in service
                await _userService.UpdateUserStatusAsync(statusUpdate.UserId, statusUpdate.Status);

                // Notify all connected clients about status change
                await _hubContext.Clients.All
                    .SendAsync("UserStatusChanged", statusUpdate.UserId, statusUpdate.Status);

                _logger.LogInformation($"User {statusUpdate.UserId} status updated to {statusUpdate.Status}");
                
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user status");
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/Chat/users-status
        [HttpPost("users-status")]
        public async Task<IActionResult> GetUsersStatus([FromBody] UsersStatusRequest request)
        {
            try
            {
                var statusMap = await _userService.GetUsersStatusAsync(request.UserIds);
                return Ok(statusMap);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching users status");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
