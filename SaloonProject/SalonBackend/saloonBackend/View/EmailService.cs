//using saloonBackend.Models;
//using SendGrid;
//using SendGrid.Helpers.Mail;
//using System.Net.Mail;

//namespace saloonBackend.View
//{
//    public class EmailService
//    {
//        private readonly string _apiKey;
//        private readonly string _fromEmail;
//        private readonly string _fromName;

//        public EmailService(IConfiguration configuration)
//        {
//            _apiKey = configuration["SendGrid:ApiKey"]!;
//            _fromEmail = configuration["SendGrid:FromEmail"]!;
//            _fromName = configuration["SendGrid:FromName"]!;
//        }

//        public async Task SendAppointmentEmailAsync(string toEmail, AppointmentBookingModel request, decimal totalPrice, int appointmentId)
//        {
//            var client = new SendGridClient(_apiKey);

//            var from = new EmailAddress(_fromEmail, _fromName);
//            var to = new EmailAddress(toEmail);

//            var subject = "Appointment Confirmation";

//            var htmlContent = $@"
//                <!DOCTYPE html>
//                <html>
//                <head>
//                    <meta charset='UTF-8'>
//                    <style>
//                        body {{
//                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//                            background-color: #f9f9f9;
//                            margin: 0;
//                            padding: 0;
//                        }}
//                        .container {{
//                            background-color: #ffffff;
//                            max-width: 500px;
//                            margin: 40px auto;
//                            padding: 30px;
//                            border-radius: 12px;
//                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//                        }}
//                        h2 {{
//                            color: #4CAF50;
//                            text-align: center;
//                            margin-bottom: 10px;
//                        }}
//                        .emoji {{
//                            font-size: 24px;
//                            margin-right: 6px;
//                        }}
//                        p {{
//                            font-size: 15px;
//                            line-height: 1.7;
//                        }}
//                        .details {{
//                            background-color: #f0f8ff;
//                            padding: 15px;
//                            border-radius: 8px;
//                            margin-top: 15px;
//                        }}
//                        .footer {{
//                            margin-top: 30px;
//                            font-size: 13px;
//                            color: #888;
//                            text-align: center;
//                        }}
//                    </style>
//                </head>
//                <body>
//                    <div class='container'>
//                        <h2><span class='emoji'>🎉</span> Appointment Confirmed!</h2>
//                        <p>Hi there! 👋</p>
//                        <p>Your appointment has been successfully booked. Here are the details:</p>

//                        <div class='details'>
//                            <p><strong>🆔 Appointment ID:</strong> {appointmentId}</p>
//                            <p><strong>📅 Date:</strong> {request.AppointmentDate:yyyy-MM-dd}</p>
//                            <p><strong>⏰ Time:</strong> {request.AppointmentTime}</p>
//                            <p><strong>💰 Total Price:</strong> Rs. {totalPrice}</p>
//                        </div>

//                        <p>✨ Thank you for choosing <strong>Your Salon</strong>! We can’t wait to pamper you. 💇‍♀️💅</p>

//                        <div class='footer'>
//                            &copy; {(DateTime.Now.Year)} Elegant Salon. All rights reserved. 💖
//                        </div>
//                    </div>
//                </body>
//                </html>";



//            var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent: null, htmlContent: htmlContent);
//            var response = await client.SendEmailAsync(msg);

//            if ((int)response.StatusCode >= 400)
//            {
//                throw new Exception("Failed to send appointment confirmation email.");
//            }
//        }
//    }
//}
//using RestSharp;
//using System.Text.Json;
//using System.Threading.Tasks;

//public class EmailService
//{
//    private readonly string _apiKey = "re_P46bskPf_DdhucDRqyRD8B7gDzcftCoaE"; 

//    public async Task<bool> SendResetEmailAsync(string toEmail, string resetToken)
//    {
//        var client = new RestClient("https://api.resend.com/emails");

//        var body = new
//        {
//            from = "Elegand Salon <noreply@elegandsalon.com>",
// // Must be verified in Resend
//            to = toEmail,
//            subject = "Your Password Reset Token",
//            html = $"<p>Your reset token is: <strong>{resetToken}</strong></p>"
//        };

//        var request = new RestRequest();
//        request.AddHeader("Authorization", $"Bearer {_apiKey}");
//        request.AddJsonBody(body);

//        var response = await client.ExecutePostAsync(request);
//        return response.IsSuccessful;
//    }
//}
