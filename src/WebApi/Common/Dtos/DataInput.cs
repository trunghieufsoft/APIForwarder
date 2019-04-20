using System;
using System.ComponentModel.DataAnnotations;

namespace WebApi.Common.Dtos
{
    public class LoginInput
    {
        [StringLength(255)]
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; }

        [StringLength(255)]
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }

    public class ResetPasswordInput
    {
        [StringLength(255)]
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; }

        [StringLength(255)]
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }
    }

    public class ChangePasswordInput
    {
        [StringLength(255)]
        [Required(ErrorMessage = "CurrentPassword is required")]
        public string CurrentPassword { get; set; }

        [StringLength(255)]
        [Required(ErrorMessage = "NewPassword is required")]
        public string NewPassword { get; set; }
    }

    public class UserAssign
    {
        [StringLength(255)]
        [Required(ErrorMessage = "Username is required")]
        public string Username { get; set; }
    }

    public class UserDelete
    {
        [Required(ErrorMessage = "Id is required")]
        public Guid Id { get; set; }
    }

    public class UnselectGroupsInput
    {
        [Required(ErrorMessage = "User id is required")]
        public Guid Id { get; set; }

        [StringLength(128)]
        public string Country { get; set; }

        [StringLength(128)]
        public string Groups { get; set; }

        [StringLength(4096)]
        public string Users { get; set; }
    }
}
