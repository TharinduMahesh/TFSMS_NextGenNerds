using TFSMS.Models;

namespace TFSMS.Services
{
    public interface IUserService
    {
        Task<List<ChatUser>> GetChatUsersAsync(string? excludeUserId = null);
        Task UpdateUserStatusAsync(string userId, string status);
        Task<Dictionary<string, string>> GetUsersStatusAsync(List<string> userIds);
    }

    public class UserService : IUserService
    {
        private readonly ILogger<UserService> _logger;
        
        // In-memory storage for online status (since you don't want persistent storage)
        private static readonly Dictionary<string, UserStatus> _userStatuses = new();
        private static readonly Dictionary<string, DateTime> _lastSeenTimes = new();

        public UserService(ILogger<UserService> logger)
        {
            _logger = logger;
        }

        public async Task<List<ChatUser>> GetChatUsersAsync(string? excludeUserId = null)
        {
            try
            {
                // TODO: Replace with actual database query to get growers and collectors
                // For now, returning mock data
                var users = new List<ChatUser>
                {
                    new ChatUser
                    {
                        Id = "1",
                        Name = "John Grower",
                        Role = "grower",
                        Email = "john@example.com",
                        Status = _userStatuses.ContainsKey("1") ? _userStatuses["1"] : UserStatus.Offline,
                        LastSeen = _lastSeenTimes.ContainsKey("1") ? _lastSeenTimes["1"] : DateTime.UtcNow.AddMinutes(-30)
                    },
                    new ChatUser
                    {
                        Id = "2",
                        Name = "Sarah Collector",
                        Role = "collector",
                        Email = "sarah@example.com",
                        Status = _userStatuses.ContainsKey("2") ? _userStatuses["2"] : UserStatus.Offline,
                        LastSeen = _lastSeenTimes.ContainsKey("2") ? _lastSeenTimes["2"] : DateTime.UtcNow.AddMinutes(-15)
                    },
                    new ChatUser
                    {
                        Id = "3",
                        Name = "Mike Grower",
                        Role = "grower",
                        Email = "mike@example.com",
                        Status = _userStatuses.ContainsKey("3") ? _userStatuses["3"] : UserStatus.Offline,
                        LastSeen = _lastSeenTimes.ContainsKey("3") ? _lastSeenTimes["3"] : DateTime.UtcNow.AddHours(-2)
                    },
                    new ChatUser
                    {
                        Id = "4",
                        Name = "Lisa Collector",
                        Role = "collector",
                        Email = "lisa@example.com",
                        Status = _userStatuses.ContainsKey("4") ? _userStatuses["4"] : UserStatus.Offline,
                        LastSeen = _lastSeenTimes.ContainsKey("4") ? _lastSeenTimes["4"] : DateTime.UtcNow.AddMinutes(-5)
                    },
                    new ChatUser
                    {
                        Id = "5",
                        Name = "David Peters",
                        Role = "grower",
                        Email = "david@example.com",
                        Status = _userStatuses.ContainsKey("5") ? _userStatuses["5"] : UserStatus.Offline,
                        LastSeen = _lastSeenTimes.ContainsKey("5") ? _lastSeenTimes["5"] : DateTime.UtcNow.AddHours(-1)
                    }
                };

                // Exclude current user if specified
                if (!string.IsNullOrEmpty(excludeUserId))
                {
                    users = users.Where(u => u.Id != excludeUserId).ToList();
                }

                _logger.LogInformation($"Retrieved {users.Count} chat users");
                return users;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting chat users");
                throw;
            }
        }

        public async Task UpdateUserStatusAsync(string userId, string status)
        {
            try
            {
                if (Enum.TryParse<UserStatus>(status, true, out UserStatus userStatus))
                {
                    _userStatuses[userId] = userStatus;
                    
                    if (userStatus == UserStatus.Offline)
                    {
                        _lastSeenTimes[userId] = DateTime.UtcNow;
                    }
                    else
                    {
                        _lastSeenTimes.Remove(userId);
                    }

                    _logger.LogInformation($"Updated user {userId} status to {status}");
                }
                else
                {
                    _logger.LogWarning($"Invalid status '{status}' for user {userId}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating user status for {userId}");
                throw;
            }
        }

        public async Task<Dictionary<string, string>> GetUsersStatusAsync(List<string> userIds)
        {
            try
            {
                var statusMap = new Dictionary<string, string>();

                foreach (var userId in userIds)
                {
                    var status = _userStatuses.ContainsKey(userId) 
                        ? _userStatuses[userId].ToString() 
                        : UserStatus.Offline.ToString();
                    
                    statusMap[userId] = status;
                }

                _logger.LogInformation($"Retrieved status for {userIds.Count} users");
                return statusMap;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting users status");
                throw;
            }
        }

        /* TODO: Replace mock data with actual database queries
        
        public async Task<List<ChatUser>> GetChatUsersAsync(string? excludeUserId = null)
        {
            // Example SQL query for your actual implementation:
            // SELECT Id, Name, Role, Email, ProfileImageUrl, IsActive 
            // FROM Users 
            // WHERE IsActive = 1 AND (Role = 'grower' OR Role = 'collector')
            // AND Id != @excludeUserId
            
            using var connection = new SqlConnection(_connectionString);
            var users = await connection.QueryAsync<ChatUser>(
                "SELECT Id, Name, Role, Email, ProfileImageUrl, IsActive FROM Users WHERE IsActive = 1 AND (Role = 'grower' OR Role = 'collector') AND (@excludeUserId IS NULL OR Id != @excludeUserId)",
                new { excludeUserId }
            );
            
            return users.ToList();
        }
        */
    }
}
