using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Identity;

namespace WebApplication26.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly string _connectionString;

        public AuthController(IConfiguration config)
        {
            _config = config;
            _connectionString = config.GetConnectionString("DefaultConnection");
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            if (model.Username.Length < 6)
            { Console.WriteLine(model.Username); return BadRequest(new { message = "Username is too short!" }); }

            if (model.Password.Length < 6)
            { return BadRequest(new { message = "Password is too short!" }); }

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    string query = $"SELECT Password FROM Users WHERE Username = '{model.Username}'";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        var password = command.ExecuteScalar() as string;
                        if (password == null) return Unauthorized();

                        var hasher = new PasswordHasher<object>();
                        var result = hasher.VerifyHashedPassword(null, password, model.Password);

                        if (result == PasswordVerificationResult.Success)
                        {
                            var token = GenerateJwtToken(model.Username);
                            return Ok(new { token });
                        }
                        else return Unauthorized();
                    }
                }
            }
            catch (Exception e) { Console.WriteLine(e.Message); }
            return Unauthorized();
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterModel model)
        {
            if (model.Username.Length < 6)
            { return BadRequest(new { message = "Username is too short!" }); }

            if (model.Password.Length < 6)
            { return BadRequest(new { message = "Password is too short!" }); }

            if (model.Password != model.ConfirmPassword)
            { return BadRequest(new { message = "Passwords are not same!" }); }

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();

                string query = $"SELECT Username FROM Users WHERE Username = '{model.Username}'";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    var username = command.ExecuteScalar() as string;

                    if (model.Username == username)
                    { return BadRequest(new { message = "User exists!" }); }
                }
            }

            var hasher = new PasswordHasher<object>();
            model.Password = hasher.HashPassword(null, model.Password);
            
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    string query = $"INSERT INTO Users (Username, Password) VALUES ('{model.Username}', '{model.Password}')";

                    using (SqlCommand command = new SqlCommand(query, connection))
                        command.ExecuteNonQuery();
                }
            }
            catch (Exception e) { Console.WriteLine(e.Message); }

            var token = GenerateJwtToken(model.Username);

            return Ok(new { token });
        }

        private string GenerateJwtToken(string username)
        {
            var key = _config["Jwt:Key"];
            if (string.IsNullOrEmpty(key))
            {
                throw new Exception("Ошибка: Jwt:Key не найден в конфигурации!");
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username)
            };

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: credentials);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            Console.WriteLine("Сгенерированный токен: " + jwt);

            return jwt;
        }

    }

    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class RegisterModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}