//// Updated AdminAuthController using ADO.NET with SqlHelper
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.Extensions.Configuration;
//using Microsoft.IdentityModel.Tokens;
//using saloonBackend.Models;
//using saloonBackend.View;
//using saloonBackend.Dtos;
//using saloonBackend.Helpers;
//using System.Data.SqlClient;
//using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;
//using System.Text;

//namespace saloonBackend.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class AdminAuthController : ControllerBase
//    {
//        private readonly IConfiguration _configuration;
//        private readonly string _connectionString;

//        public AdminAuthController(IConfiguration configuration)
//        {
//            _configuration = configuration;
//            _connectionString = configuration.GetConnectionString("DefaultConnection");
//        }

//        [HttpPost("register")]
//        public async Task<IActionResult> Register([FromBody] AdminsigninModel request)
//        {
//            var existsQuery = "SELECT COUNT(1) FROM Admins WHERE Email = @Email";
//            var exists = (int)(await SqlHelper.ExecuteScalarAsync(_connectionString, existsQuery, new() { ["@Email"] = request.Email })) > 0;
//            if (exists) return BadRequest("Admin with this email already exists.");

//            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
//            var insertQuery = "INSERT INTO Admins (Name, Email, PasswordHash) OUTPUT INSERTED.Id VALUES (@Name, @Email, @PasswordHash)";
//            var adminId = (int)(await SqlHelper.ExecuteScalarAsync(_connectionString, insertQuery, new()
//            {
//                ["@Name"] = request.Name,
//                ["@Email"] = request.Email,
//                ["@PasswordHash"] = hashedPassword
//            }));

//            var admin = new Admin { Id = adminId, Name = request.Name, Email = request.Email };
//            var token = GenerateJwtToken(admin);
//            return Ok(new { token });
//        }

//        [HttpPost("login")]
//        public async Task<IActionResult> Login([FromBody] AdminLoginvViewmodel request)
//        {
//            var query = "SELECT Id, Name, Email, PasswordHash FROM Admins WHERE Email = @Email";
//            var admins = await SqlHelper.ExecuteReaderAsync(_connectionString, query, reader => new Admin
//            {
//                Id = reader.GetInt32(reader.GetOrdinal("Id")),
//                Name = reader.GetString(reader.GetOrdinal("Name")),
//                Email = reader.GetString(reader.GetOrdinal("Email")),
//                PasswordHash = reader.GetString(reader.GetOrdinal("PasswordHash"))
//            }, new() { ["@Email"] = request.Email });

//            var admin = admins.FirstOrDefault();
//            if (admin == null || !BCrypt.Net.BCrypt.Verify(request.Password, admin.PasswordHash))
//                return Unauthorized("Invalid email or password.");

//            var token = GenerateJwtToken(admin);
//            return Ok(new { token });
//        }

//        [HttpPost("staff")]
//        public async Task<IActionResult> AddStaff([FromBody] StaffCreateDto request)
//        {
//            var existsQuery = "SELECT COUNT(1) FROM Staff WHERE Email = @Email";
//            var exists = (int)(await SqlHelper.ExecuteScalarAsync(_connectionString, existsQuery, new() { ["@Email"] = request.Email })) > 0;
//            if (exists) return BadRequest("Staff member with this email already exists.");

//            var insertQuery = "INSERT INTO Staff (Name, Email, Role, Phone) VALUES (@Name, @Email, @Role, @Phone)";
//            await SqlHelper.ExecuteNonQueryAsync(_connectionString, insertQuery, new()
//            {
//                ["@Name"] = request.Name,
//                ["@Email"] = request.Email,
//                ["@Role"] = request.Role,
//                ["@Phone"] = request.Phone
//            });

//            return Ok(request);
//        }

//        [HttpDelete("staff/{id}")]
//        public async Task<IActionResult> DeleteStaff(int id)
//        {
//            var checkQuery = "SELECT COUNT(1) FROM Staff WHERE Id = @Id";
//            var exists = (int)(await SqlHelper.ExecuteScalarAsync(_connectionString, checkQuery, new() { ["@Id"] = id })) > 0;
//            if (!exists) return NotFound("Staff member not found.");

//            var unassignQuery = "UPDATE Appointments SET StaffId = NULL WHERE StaffId = @Id";
//            var deleteQuery = "DELETE FROM Staff WHERE Id = @Id";
//            await SqlHelper.ExecuteNonQueryAsync(_connectionString, unassignQuery, new() { ["@Id"] = id });
//            await SqlHelper.ExecuteNonQueryAsync(_connectionString, deleteQuery, new() { ["@Id"] = id });

//            return Ok("Staff member deleted.");
//        }

//        [HttpPost("assign-staff")]
//        public async Task<IActionResult> AssignStaffToAppointment([FromBody] AssignStaffDto request)
//        {
//            var query = "UPDATE Appointments SET StaffId = @StaffId WHERE Id = @AppointmentId";
//            var rows = await SqlHelper.ExecuteNonQueryAsync(_connectionString, query, new()
//            {
//                ["@StaffId"] = request.StaffId,
//                ["@AppointmentId"] = request.AppointmentId
//            });

//            return rows > 0 ? Ok("Staff assigned to appointment.") : NotFound("Appointment or Staff not found.");
//        }

//        [HttpPost("update-appointment-status")]
//        public async Task<IActionResult> UpdateAppointmentStatus([FromBody] UpdateAppointmentStatusDto request)
//        {
//            var validStatuses = new[] { "Scheduled", "Ongoing", "Completed", "Cancelled" };
//            if (!validStatuses.Contains(request.Status))
//                return BadRequest("Invalid status. Allowed: Scheduled, Ongoing, Completed, Cancelled.");

//            var query = "UPDATE Appointments SET Status = @Status WHERE Id = @AppointmentId";
//            var rows = await SqlHelper.ExecuteNonQueryAsync(_connectionString, query, new()
//            {
//                ["@Status"] = request.Status,
//                ["@AppointmentId"] = request.AppointmentId
//            });

//            return rows > 0 ? Ok($"Appointment status updated to {request.Status}.") : NotFound("Appointment not found.");
//        }

//        [HttpPost("deassign-staff")]
//        public async Task<IActionResult> DeassignStaffFromAppointment([FromBody] AssignStaffDto request)
//        {
//            var getQuery = "SELECT Status, StaffId FROM Appointments WHERE Id = @AppointmentId";
//            var results = await SqlHelper.ExecuteReaderAsync(_connectionString, getQuery, reader => new
//            {
//                Status = reader.GetString(reader.GetOrdinal("Status")),
//                StaffId = reader.IsDBNull(reader.GetOrdinal("StaffId")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("StaffId"))
//            }, new() { ["@AppointmentId"] = request.AppointmentId });

//            var appointment = results.FirstOrDefault();
//            if (appointment == null)
//                return NotFound("Appointment not found.");

//            if (appointment.Status != "Completed")
//                return BadRequest("Cannot de-assign staff from an incomplete appointment.");

//            if (appointment.StaffId == null)
//                return BadRequest("No staff member is currently assigned to this appointment.");

//            var updateQuery = "UPDATE Appointments SET StaffId = NULL WHERE Id = @AppointmentId";
//            await SqlHelper.ExecuteNonQueryAsync(_connectionString, updateQuery, new() { ["@AppointmentId"] = request.AppointmentId });

//            return Ok("Staff member has been de-assigned from the appointment.");
//        }

//        [HttpGet("staffview")]
//        public async Task<IActionResult> GetStaffList()
//        {
//            var query = "SELECT Id, Name, Email, Phone, Role FROM Staff";
//            var staffList = await SqlHelper.ExecuteReaderAsync(_connectionString, query, reader => new
//            {
//                Id = reader.GetInt32(0),
//                Name = reader.GetString(1),
//                Email = reader.GetString(2),
//                Phone = reader.GetString(3),
//                Role = reader.GetString(4)
//            });

//            return Ok(new { count = staffList.Count, staff = staffList });
//        }

//        [HttpGet("staffcount")]
//        public async Task<IActionResult> GetStaffCount()
//        {
//            var query = "SELECT COUNT(*) FROM Staff";
//            var count = (int)(await SqlHelper.ExecuteScalarAsync(_connectionString, query));
//            return Ok(new { StaffCount = count });
//        }

//        [HttpPost("monthly-revenue")]
//        public async Task<IActionResult> GetMonthlyRevenue([FromBody] MonthlyRevenueRequest request)
//        {
//            var query = @"SELECT SUM(Price) FROM Appointments WHERE AppointmentDate >= @StartDate AND AppointmentDate < @EndDate AND Status = 'Completed'";
//            var startDate = new DateTime(request.Year, request.Month, 1);
//            var endDate = startDate.AddMonths(1);

//            var revenue = await SqlHelper.ExecuteScalarAsync(_connectionString, query, new()
//            {
//                ["@StartDate"] = startDate,
//                ["@EndDate"] = endDate
//            });

//            return Ok(new { Revenue = revenue == DBNull.Value ? 0 : Convert.ToDecimal(revenue) });
//        }

//        private string GenerateJwtToken(Admin admin)
//        {
//            var claims = new[]
//            {
//                new Claim(ClaimTypes.NameIdentifier, admin.Id.ToString()),
//                new Claim(ClaimTypes.Name, admin.Name),
//                new Claim(ClaimTypes.Email, admin.Email),
//                new Claim(ClaimTypes.Role, "Admin")
//            };

//            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
//            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//            var token = new JwtSecurityToken(
//                issuer: _configuration["Jwt:Issuer"],
//                audience: _configuration["Jwt:Issuer"],
//                claims: claims,
//                expires: DateTime.Now.AddHours(1),
//                signingCredentials: creds
//            );

//            return new JwtSecurityTokenHandler().WriteToken(token);
//        }
//    }
//}
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using saloonBackend.DataAccess;
using saloonBackend.Helpers;
using saloonBackend.Models;
using saloonBackend.View;
using System.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace saloonBackend.Controllers

{
    //[EnableCors("AllowFrontend")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminAuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly DAAdmin _daAdmin;

        // Constructor: initializes configuration and data access layer
        public AdminAuthController(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = configuration.GetConnectionString("DefaultConnection");
            _daAdmin = new DAAdmin(_connectionString);
        }

        // Admin Registration Endpoint
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AdminsigninModel request)
        {
            // Check if admin already exists
            if (await _daAdmin.AdminExistsAsync(request.Email))
                return BadRequest("Admin with this email already exists.");

            // Hash password and register admin
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
            int adminId = await _daAdmin.RegisterAdminAsync(request, hashedPassword);

            // Generate JWT token and return
            var admin = new Admin { Id = adminId, Name = request.Name, Email = request.Email };
            var token = GenerateJwtToken(admin);
            return Ok(new { token });
        }

        // Admin Login Endpoint
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AdminLoginvViewmodel request)
        {
            // Fetch admin by email and verify password
            var admin = await _daAdmin.GetAdminByEmailAsync(request.Email);
            if (admin == null || !BCrypt.Net.BCrypt.Verify(request.Password, admin.PasswordHash))
                return Unauthorized("Invalid email or password.");

            // Generate JWT token and return
            var token = GenerateJwtToken(admin);
            return Ok(new { token });
        }

        // Add new staff member
        //[HttpPost("staff")]
        //public async Task<IActionResult> AddStaff([FromBody] StaffCreateModel request)
        //{
        //    // Check if staff already exists
        //    if (await _daAdmin.StaffExistsAsync(request.Email))
        //        return BadRequest("Staff member with this email already exists.");

        //    // Add staff
        //    await _daAdmin.AddStaffAsync(request);
        //    return Ok(request);
        //}
        [HttpPost("staff")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> AddStaff([FromForm] StaffCreateModel request)
        {
            if (await _daAdmin.StaffExistsAsync(request.Email))
                return BadRequest("Staff member with this email already exists.");

            if (request.Image != null && request.Image.Length > 0)
            {
                using var memoryStream = new MemoryStream();
                await request.Image.CopyToAsync(memoryStream);
                request.ImageData = memoryStream.ToArray(); // store in DB
            }

            await _daAdmin.AddStaffAsync(request);
            return Ok("Staff added");
        }



        // Delete staff member by ID
        [HttpDelete("staff/{id}")]
        public async Task<IActionResult> DeleteStaff(int id)
        {
            // Check if staff ID exists
            if (!await _daAdmin.StaffIdExistsAsync(id))
                return NotFound("Staff member not found.");

            // Delete staff
            await _daAdmin.DeleteStaffAsync(id);
            return Ok("Staff member deleted.");
        }

        // Assign staff to appointment
        [HttpPost("assign-staff")]
        public async Task<IActionResult> AssignStaffToAppointment([FromBody] AssignStaffModel request)
        {
            // Assign and return status
            var rows = await _daAdmin.AssignStaffAsync(request);
            return rows > 0 ? Ok("Staff assigned to appointment.") : NotFound("Appointment or Staff not found.");
        }

        // Update status of an appointment
        [HttpPost("update-appointment-status")]
        public async Task<IActionResult> UpdateAppointmentStatus([FromBody] UpdateAppointmentStatusModel request)
        {
            // Validate status
            var validStatuses = new[] { "Scheduled", "Ongoing", "Completed", "Cancelled", "Pending" };
            if (!validStatuses.Contains(request.Status))
                return BadRequest("Invalid status. Allowed: Scheduled, Ongoing, Completed, Cancelled");

            // Update and return result
            var rows = await _daAdmin.UpdateAppointmentStatusAsync(request);
            return rows > 0 ? Ok($"Appointment status updated to {request.Status}.") : NotFound("Appointment not found.");
        }

        // Deassign staff from appointment
        [HttpPost("deassign-staff")]
        public async Task<IActionResult> DeassignStaffFromAppointment([FromBody] AssignStaffModel request)
        {
            // Get appointment info
            var appointment = await _daAdmin.GetAppointmentStatusAndStaffIdAsync(request.AppointmentId);
            if (appointment == null)
                return NotFound("Appointment not found.");

            // Check if appointment is completed and staff is assigned
            if (appointment.Value.Status != "Completed")
                return BadRequest("Cannot de-assign staff from an incomplete appointment.");

            if (appointment.Value.StaffId == null)
                return BadRequest("No staff member is currently assigned to this appointment.");

            // Deassign staff
            await _daAdmin.DeassignStaffAsync(request.AppointmentId);
            return Ok("Staff member has been de-assigned from the appointment.");
        }
        [HttpPut("EditStaff/{id}")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> EditStaff(int id, [FromForm] StaffCreateModel request)
        {
            if (request == null)
                return BadRequest("Invalid staff data.");

            try
            {
                if (request.Image != null && request.Image.Length > 0)
                {
                    using var memoryStream = new MemoryStream();
                    await request.Image.CopyToAsync(memoryStream);
                    request.ImageData = memoryStream.ToArray(); // store in DB
                }

                await _daAdmin.EditStaffAsync(id, request);
                return Ok("Staff updated successfully.");
            }
            catch (SqlException ex)
            {
                return StatusCode(500, $"SQL Error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"General Error: {ex.Message}");
            }
        }


        [HttpGet("GetSalonSettings")]
        public async Task<IActionResult> GetSalonSettings()
        {
            var settings = await _daAdmin.GetSalonSettingsAsync();
            if (settings == null)
                return NotFound("Settings not found.");
            return Ok(settings);
        }

        [HttpPost("SaveSalonSettings")]
        public async Task<IActionResult> SaveSalonSettings([FromBody] SalonSettingsModel model)
        {
            if (model == null)
                return BadRequest("Invalid data.");

            await _daAdmin.SaveSalonSettingsAsync(model);
            return Ok("Settings saved successfully.");
        }


        // Get list of all staff members
        [HttpGet("staffview")]
        public async Task<IActionResult> GetStaffList()
        {
            var staffList = await _daAdmin.GetStaffListAsync();
            return Ok(new { count = staffList.Count, staff = staffList });
        }

        // Get total staff count
        [HttpGet("staffcount")]
        public async Task<IActionResult> GetStaffCount()
        {
            int count = await _daAdmin.GetStaffCountAsync();
            return Ok(new { StaffCount = count });
        }

        // Get monthly revenue data
        [HttpPost("monthly-revenue")]
        public async Task<IActionResult> GetMonthlyRevenue([FromBody] MonthlyRevenueRequestModel request)
        {
            var startDate = new DateTime(request.Year, request.Month, 1);
            var endDate = startDate.AddMonths(1);
            var revenue = await _daAdmin.GetMonthlyRevenueAsync(startDate, endDate);
            return Ok(new { Revenue = revenue });
        }



        // Helper method: Generate JWT token for authenticated admin
        private string GenerateJwtToken(Admin admin)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, admin.Id.ToString()),
                new Claim(ClaimTypes.Name, admin.Name),
                new Claim(ClaimTypes.Email, admin.Email),
                new Claim(ClaimTypes.Role, "Admin")
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
