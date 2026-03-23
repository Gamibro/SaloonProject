namespace saloonBackend.Models
{
    public class StaffCreateModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string Phone { get; set; }
        public IFormFile Image { get; set; }
        public string Description { get; set; }
        public byte[]? ImageData { get; set; }
        public string? ImageDataBase64 { get; set; }


    }
}
