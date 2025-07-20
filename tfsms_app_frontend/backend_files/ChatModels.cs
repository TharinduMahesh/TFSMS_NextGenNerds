namespace TFSMS.Models
{
    public class ChatMessage
    {
        public string? Id { get; set; }
        public string SenderId { get; set; } = string.Empty;
        public string ReceiverId { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public bool IsDelivered { get; set; }
        public bool IsRead { get; set; }
        public string MessageType { get; set; } = "text";
    }

    public enum UserStatus
    {
        Online,
        Offline,
        Away,
        Busy
    }

    public class ChatUser
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty; // "grower" or "collector"
        public string Email { get; set; } = string.Empty;
        public string? ProfileImageUrl { get; set; }
        public UserStatus Status { get; set; } = UserStatus.Offline;
        public DateTime? LastSeen { get; set; }
        public bool IsActive { get; set; } = true;
    }

    public class UserStatusUpdate
    {
        public string UserId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime LastSeen { get; set; } = DateTime.UtcNow;
    }

    public class UsersStatusRequest
    {
        public List<string> UserIds { get; set; } = new List<string>();
    }
}
