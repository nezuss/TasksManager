using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using System.Reflection;

namespace WebApplication26.Controllers
{
    [Route("api/protected")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly string _connectionString;

        public TasksController(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection");
        }

        [HttpGet("tasks")]
        [Authorize]
        public IActionResult TasksGet()
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    string query = "SELECT TaskName, TaskDescription, TaskId FROM Tasks";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            List<object> tasks = new List<object>();

                            while (reader.Read())
                            {
                                tasks.Add(new
                                {
                                    Name = reader.GetString(0),
                                    Description = reader.GetString(1),
                                    Id = reader.GetInt32(2)
                                });
                            }

                            return Ok(tasks);
                        }
                    }
                }
            }
            catch (Exception ex)
            { return BadRequest(new { error = ex.Message }); }

            return BadRequest(new { result = "ERROR" });
        }

        [HttpPost("tasks/add")]
        [Authorize]
        public IActionResult TasksAdd([FromBody] AddTasksModel model)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();
                    
                    string query = "SELECT * FROM TaskCategories";
                    bool badREQ = true;

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (!reader.HasRows)
                                return BadRequest(new { error = "No categories found!" });

                            while (reader.Read())
                                if (reader.GetString(0) == model.Category)
                                    badREQ = false;
                        }
                    }

                    if (badREQ)
                        return BadRequest(new { error = "Category not found!" });

                    query = $"INSERT INTO Tasks (TaskName, TaskCategory, TaskDescription, TaskExpected) VALUES ('{model.Name}', '{model.Category}', '{model.Description}', '{model.Expected}')";

                    using (SqlCommand command = new SqlCommand(query, connection))
                        command.ExecuteNonQuery();

                    return Ok(model);
                }
            }
            catch (Exception ex)
            { return BadRequest(new { error = ex.Message }); }

            return BadRequest(new { result = "ERROR" });
        }

        [HttpPatch("tasks/update")]
        [Authorize]
        public IActionResult TasksUpdate([FromBody] UpdateTasksModel model)
        {
            if (model.Id == null || model.Id <= 0)
            { return BadRequest(new { message = "Id cannot be less then 0 or null!" }); }
            if (model.Name == null || model.Name.Length < 6)
            { return BadRequest(new { message = "Name cannot be empty or less then 6" }); }
            if (model.Category == null || model.Category.Length < 6)
            { return BadRequest(new { message = "Category cannot be empty or less then 6" }); }
            if (model.Description == null || model.Description.Length < 6)
            { return BadRequest(new { message = "Description cannot be empty or less then 6" }); }
            if (model.Expected == null || model.Expected.Length < 6)
            { return BadRequest(new { message = "Expected cannot be empty or less then 6" }); }

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    int minId = 0;
                    int maxId = 0;

                    string query = $"SELECT MIN(TaskId) FROM Tasks";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                            if (reader.Read())
                                minId = reader.GetInt32(0);
                    }

                    query = $"SELECT MAX(TaskId) FROM Tasks";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                            if (reader.Read())
                                maxId = reader.GetInt32(0);
                    }

                    if (model.Id < minId || model.Id > maxId)
                    { return BadRequest(new { message = "Id is out of range!" }); }

                    query = $"UPDATE Tasks SET TaskName = '{model.Name}', TaskCategory = '{model.Category}', TaskDescription = '{model.Description}', TaskExpected = '{model.Expected}' WHERE TaskId = {model.Id}";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.ExecuteNonQuery();
                        return Ok(model);
                    }
                }
            }
            catch (Exception ex)
            { return BadRequest(new { error = ex.Message }); }

            return BadRequest(new { result = "ERROR" });
        }

        [HttpDelete("tasks/remove")]
        [Authorize]
        public IActionResult TasksRemove([FromBody] DeleteTasksModel model)
        {
            if (model.Id == null || model.Id <= 0)
            { return BadRequest(new { message = "Id cannot be less then 0 or null!" }); }

            try
            {

                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    int minId = 0;
                    int maxId = 0;

                    string query = $"SELECT MIN(TaskId) FROM Tasks";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                            if (reader.Read())
                                minId = reader.GetInt32(0);
                    }

                    query = $"SELECT MAX(TaskId) FROM Tasks";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                            if (reader.Read())
                                maxId = reader.GetInt32(0);
                    }

                    if (model.Id < minId || model.Id > maxId)
                    { return BadRequest(new { message = "Id is out of range!" }); }

                    query = $"DELETE FROM Tasks WHERE TaskId = '{model.Id}'";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        command.ExecuteNonQuery();
                        return Ok(model);
                    }
                }
            }
            catch (Exception ex)
            { return BadRequest(new { error = ex.Message }); }

            return BadRequest(new { result = "ERROR" });
        }

        [HttpPost("tasks/submit")]
        [Authorize]
        public IActionResult TasksSubmit([FromBody] SubmitTasksModel model)
        {
            string username = User.Identity.Name;

            if (username.Length < 6)
            { return BadRequest(new { message = "Username is too short!" }); }
            if (model.TasksId == null || model.TasksResult == null || model.TasksId.Count == 0 || model.TasksResult.Count == 0)
            { return BadRequest(new { message = "TasksId or TasksResult is null or empty!" }); }
            if (model.TasksId.Count != model.TasksResult.Count)
            { return BadRequest(new { message = "TasksId and TasksResult count are not equal!" }); }

            foreach (var item in model.TasksId)
                if (item <= 0)
                    return BadRequest(new { message = "TaskId cannot be less then 0 or null!" });

            foreach (var item in model.TasksResult)
                if (item.Length <= 6)
                    return BadRequest(new { message = "TasksResult item cannot be less then 6 or null!" });

            try
            {
                int score = 0;
                int maxScore = 0;
                List<int> ids;
                List <string> results;
                DateTime now = DateTime.UtcNow;
                string time = now.ToString("yyyy-MM-ddTHH:mm:ss.fff");
                string query;

                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    for (int i = 0; i < model.TasksId.Count; i++)
                    {
                        query = $"SELECT TaskId, TaskExpected FROM Tasks";

                        using (SqlCommand command = new SqlCommand(query, connection))
                        {
                            command.ExecuteNonQuery();
                            using (SqlDataReader reader = command.ExecuteReader())
                            {
                                ids = new List<int>(reader.FieldCount);
                                results = new List<string>(reader.FieldCount);

                                while (reader.Read())
                                {
                                    ids.Add(reader.GetInt32(0));
                                    results.Add(reader.GetString(1));
                                }
                            }
                        }

                        for (int j = 0; j < ids.Count; j++)
                        {
                            if (model.TasksId[i] == ids[j])
                            {
                                maxScore++;
                                if (model.TasksResult[i] == results[j])
                                    score++;
                            }
                        }
                    }

                    query = $"INSERT INTO Submissions (SubmissionUsername, SubmissionDate, SubmissionScore, SubmissionMaxScore) VALUES ('{username}', '{time}', {score}, {maxScore})";

                    using (SqlCommand command = new SqlCommand(query, connection))
                        command.ExecuteNonQuery();

                    return Ok(model);
                }
            }
            catch (Exception ex)
            { return BadRequest(new { error = ex.Message }); }

            return BadRequest(new { result = "ERROR" });
        }

        [HttpGet("tasks/results")]
        [Authorize]
        public IActionResult TasksHistory()
        {
            string username = User.Identity.Name;

            if (username.Length < 6)
            { return BadRequest(new { message = "Username is too short!" }); }

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    connection.Open();

                    string query = $"SELECT * FROM Submissions WHERE SubmissionUsername = '{username}'";

                    using (SqlCommand command = new SqlCommand(query, connection))
                    {
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            List<object> submissions = new List<object>();

                            while (reader.Read())
                            {
                                submissions.Add(new
                                {
                                    Date = reader.GetDateTime(0),
                                    Username = reader.GetString(1),
                                    Score = reader.GetInt32(2),
                                    MaxScore = reader.GetInt32(3)
                                });
                            }

                            return Ok(submissions);
                        }
                    }
                }
            }
            catch (Exception ex)
            { return BadRequest(new { error = ex.Message }); }

            return BadRequest(new { result = "ERROR" });
        }
    }

    public class AddTasksModel
    {
        public string Name { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
        public string Expected { get; set; }
    }

    public class DeleteTasksModel
    {
        public int Id { get; set; }
    }

    public class UpdateTasksModel
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Category { get; set; }
        public string? Description { get; set; }
        public string? Expected { get; set; }
    }

    public class SubmitTasksModel
    {
        public List<int> TasksId { get; set; }
        public List<string> TasksResult { get; set; }
    }
}
