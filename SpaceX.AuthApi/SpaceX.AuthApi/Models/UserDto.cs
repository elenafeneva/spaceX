using System.ComponentModel.DataAnnotations;

namespace SpaceX.AuthApi.Models
{
    public class UserDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;
    }
}
