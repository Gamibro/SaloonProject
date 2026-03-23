//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;
//using saloonBackend.Dtos;
//using saloonBackend.Models;
//using saloonBackend.View;
//using System.Security.Claims;

//namespace SalonAPI.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class AppointmentController : ControllerBase
//    {
//        private readonly AppDbContext _context;
//        private static readonly Dictionary<int, decimal> ServicePrices = new()
//            {
//                { 1, 3500 },  // Haircut
//                { 2, 1200 },  // Coloring
//                { 3, 5000 },  // Styling
//                { 4, 4000 },  // Manicure
//                { 5, 4500 },  // Pedicure
//                { 6, 15500 }, // Full Set
//                { 7, 10800 }, // Highlights
//                { 8, 8000 }   // Facial
//            };


//        public AppointmentController(AppDbContext context)
//        {
//            _context = context;
//        }

//        //  Book appointment (User)
//        [Authorize]
//        [Authorize]
//        [HttpPost("book")]
//        public async Task<IActionResult> BookAppointment([FromBody] AppointmentBookingDto request)
//        {
//            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
//            var user = await _context.Users.FindAsync(userId);
//            if (user == null)
//                return NotFound("User not found.");

//            // Calculate total price based on selected services
//            decimal totalPrice = 0;
//            var appointmentServices = new List<AppointmentService>();

//            foreach (var id in request.ServiceTypeIds)
//            {
//                if (ServicePrices.TryGetValue(id, out var price))
//                {
//                    totalPrice += price;
//                    appointmentServices.Add(new AppointmentService { ServiceTypeId = id });
//                }
//                else
//                {
//                    return BadRequest($"Invalid service ID: {id}");
//                }
//            }

//            var appointment = new Appointment
//            {
//                AppointmentDate = request.AppointmentDate,
//                AppointmentTime = request.AppointmentTime,
//                UserId = userId,
//                UserName = user.Name,
//                Services = appointmentServices,
//                Price = totalPrice // 🟢 Set the price here
//            };

//            _context.Appointments.Add(appointment);
//            await _context.SaveChangesAsync();

//            return Ok(new { message = "Appointment booked successfully!", appointmentId = appointment.Id, totalPrice });
//        }


//        [HttpGet("availability")]
//        public async Task<IActionResult> GetAvailableSlots([FromQuery] string date, [FromQuery] int duration)
//        {
//            if (!DateTime.TryParse(date, out var appointmentDate))
//                return BadRequest("Invalid date format");

//            // Get all appointments for the day
//            var appointments = await _context.Appointments
//                .Include(a => a.Services)
//                .Where(a => a.AppointmentDate.Date == appointmentDate.Date)
//                .ToListAsync();

//            // Generate all possible time slots (adjust as needed)
//            var allSlots = GenerateTimeSlots();
//            var availableSlots = new List<string>();

//            // Check each slot for availability
//            foreach (var slot in allSlots)
//            {
//                var slotTime = TimeSpan.Parse(slot);
//                var slotEndTime = slotTime.Add(TimeSpan.FromMinutes(duration));

//                var isAvailable = !appointments.Any(a =>
//                {
//                    var appointmentTime = a.AppointmentTime; // Fixed: No need to parse TimeSpan
//                    var appointmentEndTime = appointmentTime.Add(TimeSpan.FromMinutes(a.DurationMinutes));

//                    return (slotTime >= appointmentTime && slotTime < appointmentEndTime) ||
//                           (slotEndTime > appointmentTime && slotEndTime <= appointmentEndTime) ||
//                           (slotTime <= appointmentTime && slotEndTime >= appointmentEndTime);
//                });

//                if (isAvailable)
//                {
//                    availableSlots.Add(slot);
//                }
//            }

//            return Ok(availableSlots);
//        }

//        private List<string> GenerateTimeSlots()
//        {
//            // Adjust this to match your business hours
//            var slots = new List<string>();
//            var startTime = new TimeSpan(9, 0, 0); // 9:00 AM
//            var endTime = new TimeSpan(17, 0, 0);  // 5:00 PM

//            for (var time = startTime; time <= endTime; time = time.Add(TimeSpan.FromMinutes(30)))
//            {
//                slots.Add(time.ToString(@"hh\:mm"));
//            }

//            return slots;
//        }
//        [HttpGet("count-by-day")]
//        public async Task<IActionResult> GetDailyAppointmentCounts()
//        {
//            var counts = await _context.Appointments
//                .GroupBy(a => a.AppointmentDate.Date)
//                .Select(g => new
//                {
//                    Date = g.Key,
//                    Count = g.Count()
//                })
//                .OrderBy(x => x.Date)
//                .ToListAsync();

//            return Ok(counts);
//        }
//        [HttpGet("count-today")]
//        public async Task<IActionResult> GetTodayAppointmentCount()
//        {
//            var today = DateTime.Today;

//            var todayCount = await _context.Appointments
//                .Where(a => a.AppointmentDate.Date == today)
//                .CountAsync();

//            return Ok(new { TodayCount = todayCount });
//        }



//        // ✅ Get all appointments (Admin)
//        [HttpGet("all")]
//        public async Task<IActionResult> GetAllAppointments()
//        {
//            var appointments = await _context.Appointments
//                .Include(a => a.Services)
//                .Include(a => a.User)
//                .ToListAsync();

//            return Ok(appointments);
//        }
//        // Get recent appointments (Admin dashboard)
//        [HttpGet("recent")]
//        public async Task<IActionResult> GetRecentAppointments([FromQuery] int count = 5)
//        {
//            var recentAppointments = await _context.Appointments
//                .Include(a => a.Services)
//                .Include(a => a.User)
//                .OrderByDescending(a => a.AppointmentDate)
//                .ThenByDescending(a => a.AppointmentTime)
//                .Take(count)
//                .ToListAsync();

//            return Ok(recentAppointments);
//        }



//        // ✅ Update appointment (Admin)
//        [HttpPut("{id}")]
//        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] AppointmentUpdateDto request)
//        {
//            var appointment = await _context.Appointments.FindAsync(id);
//            if (appointment == null)
//                return NotFound("Appointment not found.");

//            appointment.AppointmentDate = request.AppointmentDate;
//            appointment.AppointmentTime = request.AppointmentTime;

//            _context.Appointments.Update(appointment);
//            await _context.SaveChangesAsync();

//            return Ok(new { message = "Appointment updated successfully!" });
//        }

//        // ✅ Delete appointment (Admin)
//        [HttpDelete("{id}")]
//        public async Task<IActionResult> DeleteAppointment(int id)
//        {
//            var appointment = await _context.Appointments.FindAsync(id);
//            if (appointment == null)
//                return NotFound("Appointment not found.");

//            _context.Appointments.Remove(appointment);
//            await _context.SaveChangesAsync();

//            return Ok(new { message = "Appointment deleted successfully!" });
//        }
//    }
//}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using saloonBackend.DataAccess;
using saloonBackend.Models;
using saloonBackend.View;


//using saloonBackend.Dtos;
using System.Security.Claims;

namespace SalonAPI.Controllers
{
    //[EnableCors("AllowFrontend")]
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentController : ControllerBase
    {
        private readonly DAAppointment _daAppointment;

        public AppointmentController(DAAppointment daAppointment)
        {
            _daAppointment = daAppointment;
        }

        // Book appointment (User)
        [Authorize]
        //[HttpPost("book")]
        //public async Task<IActionResult> BookAppointment([FromBody] AppointmentBookingModel request)
        //{
        //    var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
        //    var (success, error, result) = await _daAppointment.BookAppointment(userId, request);

        //    if (!success) return BadRequest(error);
        //    return Ok(new { message = "Appointment booked successfully!", appointmentId = ((dynamic)result).appointmentId, totalPrice = ((dynamic)result).totalPrice });
        //}
        [HttpPost("book")]
        public async Task<IActionResult> BookAppointment(
            [FromBody] AppointmentBookingModel request)
            //[FromServices] EmailService emailService)
        {
            // Extract user ID from the JWT token
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            // Book appointment and receive result
            var (success, error, result) = await _daAppointment.BookAppointment(userId, request);

            if (!success)
                return BadRequest(error);

            // Extract appointment details from result
            var appointmentId = ((dynamic)result).appointmentId;
            var totalPrice = ((dynamic)result).totalPrice;

            // Fetch user email for confirmation
            var phone = await _daAppointment.GetUserPhoneByIdAsync(userId);

            // Send confirmation email if email is found
            //if (!string.IsNullOrEmpty(email))
            //{
            //    await emailService.SendAppointmentEmailAsync(email, request, totalPrice, appointmentId);
            //}

            // Return success response
            return Ok(new
            {
                message = "Appointment booked successfully!",
                appointmentId,
                totalPrice
            });
        }

        [HttpGet("availability")]
        public async Task<IActionResult> GetAvailableSlots([FromQuery] string date, [FromQuery] int duration)
        {
            //Validate date format
            if (!DateTime.TryParse(date, out var appointmentDate))
                return BadRequest("Invalid date format");
           
             //Get available slots for the specified date and duration
            var availableSlots = await _daAppointment.GetAvailableSlots(appointmentDate, duration);
            return Ok(availableSlots);

        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetAppointmentsByUser(int userId)
        {
            try
            {
                var appointments = await _daAppointment.GetAppointmentsByUserId(userId);

                if (appointments == null)
                {
                    return NotFound(new { message = "No appointments found" });
                }

                return Ok(appointments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }


        [HttpGet("count-by-day")]
        public async Task<IActionResult> GetDailyAppointmentCounts()
        {
            // Get number of appointments grouped by each day
            var counts = await _daAppointment.GetDailyCounts();
            return Ok(counts);
        }

        [HttpGet("count-today")]
        public async Task<IActionResult> GetTodayAppointmentCount()
        {
            // Get count of today's appointments
            var todayCount = await _daAppointment.GetTodayCount();
            return Ok(new { TodayCount = todayCount });
        }

        // Get all appointments (for Admin use)
        [HttpGet("all")]
        public async Task<IActionResult> GetAllAppointments()
        {
            // Retrieve all appointments from the database
            var appointments = await _daAppointment.GetAllAppointments();
            return Ok(appointments);
        }

        // Get recent appointments (Admin dashboard)
        [HttpGet("recent")]
        public async Task<IActionResult> GetRecentAppointments([FromQuery] int count = 5)
        {
            // Retrieve the most recent appointments, defaulting to 5
            var recentAppointments = await _daAppointment.GetRecentAppointments(count);
            return Ok(recentAppointments);
        }

        // Update appointment details (Admin only)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] AppointmentUpdateModel request)
        {
            // Attempt to update appointment
            var appointment = await _daAppointment.UpdateAppointment(id, request);
            if (appointment == null) return NotFound("Appointment not found.");

            return Ok(new { message = "Appointment updated successfully!" });
        }

        // Delete appointment (Admin only)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            // Attempt to delete appointment by ID
            var deleted = await _daAppointment.DeleteAppointment(id);
            if (!deleted) return NotFound("Appointment not found.");

            return Ok(new { message = "Appointment deleted successfully!" });
        }


       







    }
}

