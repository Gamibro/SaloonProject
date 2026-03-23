namespace saloonBackend.Models
{
    public class AppointmentBookingModel
    {
        public DateTime AppointmentDate { get; set; }
        public TimeSpan AppointmentTime { get; set; }
        public List<int> ServiceTypeIds { get; set; }
        //public int StaffId { get; set; }
    }
}
