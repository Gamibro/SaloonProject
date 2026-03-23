namespace saloonBackend.Models
{
    public class SalonSettingsModel
    {
        public string SalonName { get; set; }
        public TimeSpan OpeningTime { get; set; }
        public TimeSpan ClosingTime { get; set; }
        public string BookingPolicy { get; set; }
    }
}
