namespace saloonBackend.Models
{
    public class StaffViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Phone { get; set; } = null!;
        public string Role { get; set; } = null!;
        public string? ImageBase64 { get; set; }
        public string Description { get; set; }

    }
}
