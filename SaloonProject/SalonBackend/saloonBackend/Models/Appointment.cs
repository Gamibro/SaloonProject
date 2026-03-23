namespace saloonBackend.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public string? UserName { get; set; }  // Add this if not already

        public DateTime AppointmentDate { get; set; }
        public TimeSpan AppointmentTime { get; set; } 
        public int UserId { get; set; }
        public User User { get; set; }

        public string? Phone { get; set; }

        public int? StaffId { get; set; }
        public string? StaffName { get; set; }
        
        public string Status { get; set; } = "Scheduled"; // Default to "Scheduled"
        public double DurationMinutes { get; internal set; }
        public decimal Price { get; set; }
        public int? ServiceTypeId { get; set; }
        public string ServiceName { get; set; }


    }
}
