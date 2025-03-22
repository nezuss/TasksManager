using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace WebApplication26.Controllers
{
    [Route("api/protected")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly string _connectionString;

        public CategoryController(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection");
        }

        [HttpGet("categories/")]
        [Authorize]
        public IActionResult GetCategory()
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    string query = "SELECT TaskCategoryName FROM TaskCategories";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            List<object> data = new List<object>();

                            while (reader.Read())
                            {
                                data.Add(new
                                {
                                    Name = reader.GetString(0)
                                });
                            }

                            return Ok(data);
                        }
                    }
                }
            }
            catch (Exception e) { return BadRequest(new { error = e.Message }); }

            return BadRequest();
        }

        [HttpPost("categories/add")]
        [Authorize]
        public IActionResult AddCategory([FromBody] AddCategoryModel model)
        {
            string username = User.Identity.Name;

            if (username.Length < 6)
            { return BadRequest(new { message = "Username is too short!" }); }

            if (model.Name.Length < 6)
            { return BadRequest(new { message = "Name is too short!" }); }

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    string query = $"SELECT TaskCategoryName FROM TaskCategories WHERE TaskCategoryName = '{model.Name}'";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        var name = command.ExecuteScalar() as string;

                        if (model.Name == name)
                        { return BadRequest(new { message = "Category name exists!" }); }
                    }

                    query = $"INSERT INTO TaskCategories(TaskCategoryName) VALUES('{model.Name}')";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e) { return BadRequest(new { error = e.Message }); }

            return Ok(model);
        }

        [HttpDelete("categories/remove")]
        [Authorize]
        public IActionResult RemoveCategory([FromBody] RemoveCategoryModel model)
        {
            string username = User.Identity.Name;

            if (username.Length < 6)
            { return BadRequest(new { message = "Username is too short!" }); }

            if (model.Name.Length < 6)
            { return BadRequest(new { message = "Name is too short!" }); }

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    string query = $"SELECT TaskCategoryName FROM TaskCategories WHERE TaskCategoryName = '{model.Name}'";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        var name = command.ExecuteScalar() as string;

                        if (model.Name != name)
                        { return BadRequest(new { message = "Name not exists!" }); }
                    }

                    query = $"DELETE FROM TaskCategories WHERE TaskCategoryName = '{model.Name}'";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e) { return BadRequest(new { error = e.Message }); }

            return Ok(model);
        }

        [HttpPatch("categories/update")]
        [Authorize]
        public IActionResult UpdateCategory([FromBody] UpdateCategoryModel model)
        {
            if (model.PrevName.Length < 6)
            { return BadRequest(new { message = "Prev name is too short!" }); }

            if (model.Name.Length < 6)
            { return BadRequest(new { message = "Name is too short!" }); }

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    string username = User.Identity.Name;

                    string query = $"SELECT TaskCategoryName FROM TaskCategories WHERE TaskCategoryName = '{model.Name}'";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        var name = command.ExecuteScalar() as string;

                        if (model.Name == name)
                        { return BadRequest(new { message = "New name exists!" }); }
                    }

                    query = $"SELECT TaskCategoryName FROM TaskCategories WHERE TaskCategoryName = '{model.PrevName}'";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        var name = command.ExecuteScalar() as string;

                        if (model.PrevName != name)
                        { return BadRequest(new { message = "Name not exists!" }); }
                    }

                    query = $"UPDATE TaskCategories SET TaskCategoryName = '{model.Name}' WHERE TaskCategoryName = '{model.PrevName}'";
                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.ExecuteNonQuery();
                    }
                }
            }
            catch (Exception e) { return BadRequest(new { error = e.Message }); }

            return Ok(model);
        }
    }

    public class AddCategoryModel
    {
        public string Name { get; set; }
    }

    public class RemoveCategoryModel
    {
        public string Name { get; set; }
    }

    public class UpdateCategoryModel
    {
        public string PrevName { get; set; }
        public string Name { get; set; }
    }
}