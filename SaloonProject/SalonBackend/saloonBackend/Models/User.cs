namespace saloonBackend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; }
        public string PasswordHash { get; set; } = string.Empty;
        public string? ResetToken { get; set; }
        public DateTime? ResetTokenExpiry { get; set; }

        public Boolean PhoneVerified { get; set; }

        public string OtpCode { get; set; }

        public DateTime? OtpExpiresAt { get; set; }
        public List<Appointment> Appointments { get; set; }
    }
}
