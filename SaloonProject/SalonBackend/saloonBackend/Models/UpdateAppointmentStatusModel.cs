namespace saloonBackend.Models
{
    public class UpdateAppointmentStatusModel
    {
        public int AppointmentId { get; set; }
        public string? UserName { get; set; }
        public string Status { get; set; } = "Scheduled"; // Default to "Scheduled"
        public decimal Price { get; set; }
    }
}
