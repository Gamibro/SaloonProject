//using System.Net.Http.Json;
//using Microsoft.Extensions.Options;
//using saloonBackend.Models;

//namespace saloonBackend.BusinessLogic
//{
//    public class SmsService
//    {
//        private readonly VonageSettings _cfg;
//        private readonly IHttpClientFactory _http;
//        private readonly string _env;


//        public SmsService(IOptions<VonageSettings> options, IHttpClientFactory http, IConfiguration config)
//        {
//            _cfg = options.Value;
//            _http = http;

//            _env = config["AppSettings:Environment"];

          
//        }

      

//        public async Task Send(string toPhone, string body)
//        {

//            var to = NormalizeToMsisdnLK(toPhone);

//            //Prevent the deduction of sms credits in Vonage by setting the Configuration in Development mode
//            if (_env == "Development")
//            {

//                Console.ForegroundColor = ConsoleColor.Yellow;
//                Console.WriteLine($"[DEV WARNING] SMS not sent. Message would have gone to {to}: \"{body}\"");
//                Console.ResetColor();
//                return;

//            }


//            var client = new HttpClient();

//            var payload = new
//            {

//                api_key = _cfg.ApiKey,
//                api_secret = _cfg.ApiSecret,
//                to = to,
//                from = _cfg.FromPhone,
//                text = body,
//                type = "text"
//            };

//            var resp = await client.PostAsJsonAsync("https://rest.nexmo.com/sms/json", payload);
//            var json = await resp.Content.ReadAsStringAsync();

//            if (!resp.IsSuccessStatusCode)
//                throw new InvalidOperationException($"Vonage HTTP {(int)resp.StatusCode}: {json}");

//            using var doc = System.Text.Json.JsonDocument.Parse(json);
//            var msg = doc.RootElement.GetProperty("messages")[0];
//            var status = msg.GetProperty("status").GetString();

//            if (status != "0")
//            {
//                var err = msg.TryGetProperty("error-text", out var errTxt)
//                    ? errTxt.GetString()
//                    : "Unknown error";
//                throw new InvalidOperationException($"Vonage send failed (status {status}): {err}");
//            }
//        }



   

//        private static string NormalizeToMsisdnLK(string raw)
//        {
//            var digits = new string(raw.Where(char.IsDigit).ToArray());
//            if (digits.StartsWith("0") && digits.Length == 10) return "94" + digits[1..];
//            if (digits.StartsWith("94") && digits.Length == 11) return digits;
//            if (digits.Length == 9) return "94" + digits;
//            if (digits.Length == 12 && digits.StartsWith("0094")) return digits[2..];
//            throw new ArgumentException("Invalid Sri Lankan phone.");
//        }
//    }


//}
