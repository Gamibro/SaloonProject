using BCrypt.Net;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
//using saloonBackend.BusinessLogic;
using saloonBackend.DataAccess; // Import data access layer for user operations
using saloonBackend.Models;
using saloonBackend.View;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Twilio.TwiML.Messaging;
using static System.Net.WebRequestMethods;

namespace SalonAPI.Controllers
{
    //[EnableCors("AllowFrontend")]
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        //private readonly SmsService _sms;
        private readonly DAUser _daUser;

        // Constructor: initialize configuration and DAUser with connection string
        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
            string connectionString = _configuration.GetConnectionString("DefaultConnection");
            _daUser = new DAUser(connectionString);
        }

        // Register a new user
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequestModel request)
        {
            // Check if a user with the provided email already exists

            //int existingUsers = await _daUser.GetUserCountByEmailAsync(request.Email);
            //if (existingUsers > 0)
            //{
            //    return BadRequest("User with this email already exists.");
            //}

            int existingPhoneUsers = await _daUser.GetUserCountByPhoneAsync(request.Phone);
            if(existingPhoneUsers > 0)
            {
                return BadRequest("User with this phone number already exists.");
            }



            // Hash the password before storing it
            //string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            // Insert the new user into the database
            //int insertedUserId = await _daUser.InsertUserAsync(request.Name, request.Email, request.Phone, hashedPassword);

            int insertedUserId = await _daUser.InsertUserAsync(request.Name, request.Phone);

            // Create a user object to generate the token

            var user = new User
            {
                Id = insertedUserId,
                Name = request.Name,
                Phone = request.Phone
            };

            // Generate and return JWT token
            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }

        // Login an existing user
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel request)
        {
            // Fetch user by email
            var users = await _daUser.GetUserByEmailAsync(request.Email);
            var user = users.Count > 0 ? users[0] : null;

            // If user doesn't exist or password doesn't match, return unauthorized
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid email or password.");
            }

            // Generate and return JWT token
            var token = GenerateJwtToken(user);
            return Ok(new { token });
        }
        //[HttpPost("forget-password")]
        //public async Task<IActionResult> ForgetPassword([FromBody] ForgetPasswordViewModel request)
        //{
        //    var user = await _daUser.GetUserByEmailAsync(request.Email);
        //    if (user == null || user.Count == 0)
        //    {
        //        return NotFound("User with this email does not exist.");
        //    }

        //    var resetToken = Guid.NewGuid().ToString();
        //    var expiry = DateTime.UtcNow.AddHours(1);

        //    await _daUser.StoreResetTokenAsync(request.Email, resetToken, expiry);

        //    // Instead of sending email, just return the token in response for now
        //    return Ok(new
        //    {
        //        message = "Reset token generated (email sending disabled)",
        //        resetToken
        //    });
        //}



        //[HttpPost("reset-password")]
        //public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordViewModel request)
        //{
        //    var user = await _daUser.GetUserByResetTokenAsync(request.ResetToken);

        //    if (user == null || user.ResetTokenExpiry < DateTime.UtcNow)
        //    {
        //        return BadRequest("Invalid or expired token.");
        //    }

        //    // Hash new password
        //    var newHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

        //    // Update password and clear token
        //    await _daUser.UpdatePasswordAsync(user.Email, newHash);

        //    return Ok("Password has been successfully updated.");
        //}

        //Start the OTP process by generating and sending an OTP code

        [HttpPost("otp/check")]
        public async Task<IActionResult> CheckOtp([FromBody] OtpStartRequest request)
        {
            if( string.IsNullOrEmpty(request.Phone))
            {
                return BadRequest("Email and Phone number should not be empty");
            }

           

            var user = await _daUser.GetUserByPhoneAsync(request.Phone);
            if(user ==null)
            {
                return NotFound("User with this phone number does not exits");
            }
            var rng = new Random();
            var code = rng.Next(100000, 999999).ToString();


            int updated = await _daUser.UpdateOtpAsync(user.Id, code, DateTime.UtcNow.AddMinutes(10));
            

            if (updated == 0)
            {
                return StatusCode(500, "Failed to update Otp details");

            }

            string body = $"{code}. It expires in 10 minutes";
            string url = $"https://esystems.cdl.lk/Backend/SMSGateway/api/SMS/DTSSendMessage?mobileNo={request.Phone}&message=Your OTP is {body}";

            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, "Failed to send SMS");
                }
            }
            return Ok(new { message = "OTP sent successfully" });
        }

        //Check whether the OTP code is valid

        [HttpPost("otp/verify")]
        public async Task<IActionResult> VerifyOtp([FromBody] OtpVerifyRequest request)
        {
            if (string.IsNullOrEmpty(request.Phone) || string.IsNullOrEmpty(request.Code))
            {
                return BadRequest("Email, Phone number and Code should not be empty");
            }

            var user = await _daUser.GetUserByOtpAsync(request.Phone);

          

            if (string.IsNullOrEmpty(user.OtpCode) || user.OtpExpiresAt == null)
            {
                return BadRequest("No active OTP code found");
            }

            //Console.WriteLine("The is the request code " + request.Code);
            //Console.WriteLine("This is the my otp code " + user.OtpCode);
            //Console.WriteLine("This is my id number" + user.Id);
            //Console.WriteLine("This is my OtpExpiryDate" + user.OtpExpiresAt);

            var valid = user.OtpCode == request.Code && user.OtpExpiresAt > DateTime.UtcNow;
            //Console.WriteLine(valid);

            if (!valid)
            {
                return BadRequest("Invalid or expired OTP code");
            }

            await _daUser.ClearOtpAndVerifyAsync(user.Id);

            var token = GenerateJwtToken(user);

            return Ok(new { token });


        }

        [HttpPost("sendMessages")]
        public async Task<IActionResult> SendUserMessages([FromBody] SendMessageRequest request)
        {
            if (request == null)
            {
                return BadRequest("Values cannot be empty");
            }

            var user = await _daUser.GetUserExistsByIdAsync(request.id);
            if(user == null)
            {
                return NotFound("The relevant user doesn't exist");
            }

            if(user.Phone!= request.phone)
            {
                  return BadRequest("The user's phone number doesn't match");
            }

         
            string url = $"https://esystems.cdl.lk/Backend/SMSGateway/api/SMS/DTSSendMessage?mobileNo={request.phone}&message={request.message}";

            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    return StatusCode((int)response.StatusCode, "Failed to send SMS");
                }
            }

            //_sms.Send(request.phone, request.message);



            return Ok(new { message = "Message sent successfully to the user" });

            

        }








        // Helper method to generate a JWT token for a given user
        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email)
            };

            // Create signing key using the secret from configuration
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Define the token with issuer, audience, claims, expiry and credentials
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds
            );

            // Return the serialized JWT token
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
