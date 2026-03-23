using saloonBackend.Models;
using saloonBackend.View;

using saloonBackend.Helpers;
using System.Data.SqlClient;

namespace saloonBackend.DataAccess
{
    public class DAAdmin
    {
        private readonly string _connectionString;

        public DAAdmin(string connectionString)
        {
            _connectionString = connectionString;
        }

        // Check if an admin with the given email exists
        public async Task<bool> AdminExistsAsync(string email)
        {
            var query = @"SELECT
                                COUNT(1) 
                          FROM 
                                Admins 
                          WHERE 
                                Email = @Email";
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var result = await SqlHelper.ExecuteScalarAsync(connection, query, new() { ["@Email"] = email });
            return (int)result > 0;
        }
        // Register a new admin and return the inserted admin's ID
        public async Task<int> RegisterAdminAsync(AdminsigninModel request, string hashedPassword)
        {
            var query = @"INSERT INTO
                                    Admins (
                                            Name,
                                            Email,
                                            PasswordHash
                                           ) 
                                    OUTPUT INSERTED.Id VALUES (@Name, @Email, @PasswordHash)";
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var result = await SqlHelper.ExecuteScalarAsync(connection, query, new()
            {
                ["@Name"] = request.Name,
                ["@Email"] = request.Email,
                ["@PasswordHash"] = hashedPassword
            });

            return (int)result;
        }
        // Get an admin by email (used for login)
        public async Task<Admin?> GetAdminByEmailAsync(string email)
        {
            var query = @"SELECT
                                Id,
                                Name,
                                Email,
                                PasswordHash 
                          FROM 
                                Admins 
                          WHERE 
                                Email = @Email";
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var list = await SqlHelper.ExecuteReaderAsync(connection, query, reader => new Admin
            {
                Id = reader.GetInt32(0),
                Name = reader.GetString(1),
                Email = reader.GetString(2),
                PasswordHash = reader.GetString(3)
            }, new() { ["@Email"] = email });

            return list.FirstOrDefault();
        }
        // Check if a staff member with the given email exists
        public async Task<bool> StaffExistsAsync(string email)
        {
            var query = @"SELECT
                            COUNT(1) 
                          FROM 
                            Staff 
                          WHERE 
                            Email = @Email";
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var result = await SqlHelper.ExecuteScalarAsync(connection, query, new() { ["@Email"] = email });
            return (int)result > 0;
        }
        //// Add a new staff member
        //public async Task AddStaffAsync(StaffCreateModel request)
        //{
        //    var query = @"INSERT INTO
        //                            Staff (
        //                                    Name,
        //                                    Email,
        //                                    Role,
        //                                    Phone
        //                                   )    
        //                            VALUES (
        //                                    @Name,
        //                                    @Email,
        //                                    @Role,
        //                                    @Phone
        //                                    )";
        //    using var connection = new SqlConnection(_connectionString);
        //    await connection.OpenAsync();

        //    await SqlHelper.ExecuteNonQueryAsync(connection, query, new()
        //    {
        //        ["@Name"] = request.Name,
        //        ["@Email"] = request.Email,
        //        ["@Role"] = request.Role,
        //        ["@Phone"] = request.Phone
        //    });
        //}
        public async Task AddStaffAsync(StaffCreateModel request)
        {
            var query = @"
        INSERT INTO Staff (Name, Email, Role, Phone, ImageData, Description)
        VALUES (@Name, @Email, @Role, @Phone, @ImageData, @Description)";

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            await SqlHelper.ExecuteNonQueryAsync(connection, query, new()
            {
                ["@Name"] = request.Name,
                ["@Email"] = request.Email,
                ["@Role"] = request.Role,
                ["@Phone"] = request.Phone,
                ["@ImageData"] = request.ImageData ?? (object)DBNull.Value,
                ["@Description"] = request.Description ?? (object)DBNull.Value
            });
        }


        public async Task EditStaffAsync(int staffId, StaffCreateModel request)
        {
            var query = @"
        UPDATE Staff
        SET Name = @Name,
            Email = @Email,
            Role = @Role,
            Phone = @Phone,
            Description = @Description,
            ImageData = @ImageData
        WHERE Id = @Id";

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            try
            {
                await SqlHelper.ExecuteNonQueryAsync(connection, query, new Dictionary<string, object?>
                {
                    ["@Id"] = staffId,
                    ["@Name"] = request.Name,
                    ["@Email"] = request.Email,
                    ["@Role"] = request.Role,
                    ["@Phone"] = request.Phone,
                    ["@Description"] = (object?)request.Description ?? DBNull.Value,
                    ["@ImageData"] = (object?)request.ImageData ?? DBNull.Value
                });
            }
            catch (SqlException ex)
            {
                Console.WriteLine("SQL Error: " + ex.Message); // Or use logging
                throw;
            }
        }



        // Check if a staff ID exists
        public async Task<bool> StaffIdExistsAsync(int id)
        {
            var query = @"SELECT 
                            COUNT(1) 
                          FROM 
                            Staff 
                          WHERE Id = @Id";
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var result = await SqlHelper.ExecuteScalarAsync(connection, query, new() { ["@Id"] = id });
            return (int)result > 0;
        }
        // Delete a staff member and unassign them from any appointments
        public async Task DeleteStaffAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            await SqlHelper.ExecuteNonQueryAsync(connection, @"UPDATE
                                                                    Appointments 
                                                               SET 
                                                                    StaffId = NULL
                                                               WHERE 
                                                                    StaffId = @Id", new() { ["@Id"] = id });

            await SqlHelper.ExecuteNonQueryAsync(connection, @"DELETE
                                                                    FROM
                                                                        Staff
                                                                    WHERE 
                                                                        Id = @Id", new() { ["@Id"] = id });
        }
        // 
        public async Task<int> AssignStaffAsync(AssignStaffModel request)
        {
            var query = @"UPDATE
                                Appointments
                          SET 
                                StaffId = @StaffId
                          WHERE 
                                Id = @AppointmentId";
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            return await SqlHelper.ExecuteNonQueryAsync(connection, query, new()
            {
                ["@StaffId"] = request.StaffId,
                ["@AppointmentId"] = request.AppointmentId
            });
        }
        // Update the status of an appointment
        public async Task<int> UpdateAppointmentStatusAsync(UpdateAppointmentStatusModel request)
        {
            var query = @"UPDATE 
                                Appointments 
                          SET 
                                Status = @Status
                          WHERE 
                                Id = @AppointmentId";
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            return await SqlHelper.ExecuteNonQueryAsync(connection, query, new()
            {
                ["@Status"] = request.Status,
                ["@AppointmentId"] = request.AppointmentId
            });
        }
        // Get the status and assigned staff ID of an appointment
        public async Task<(string Status, int? StaffId)?> GetAppointmentStatusAndStaffIdAsync(int appointmentId)
        {
            var query = @"SELECT
                                Status, 
                                StaffId 
                          FROM
                                Appointments 
                          WHERE 
                                Id = @AppointmentId";
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var result = await SqlHelper.ExecuteReaderAsync(connection, query, reader => (
                reader.GetString(0),
                reader.IsDBNull(1) ? (int?)null : reader.GetInt32(1)
            ), new() { ["@AppointmentId"] = appointmentId });

            return result.FirstOrDefault();
        }
        // Unassign staff from a specific appointment
        public async Task DeassignStaffAsync(int appointmentId)
        {
            var query = @"UPDATE 
                                Appointments 
                          SET 
                                StaffId = NULL 
                          WHERE 
                                Id = @AppointmentId";
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            await SqlHelper.ExecuteNonQueryAsync(connection, query, new() { ["@AppointmentId"] = appointmentId });
        }
        // Get the full list of staff members
        public async Task<List<StaffViewModel>> GetStaffListAsync()
        {
            var query = @"
        SELECT
            Id,
            Name,
            Email,
            Phone,
            Role,
            ImageData,
            Description
        FROM Staff";

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            return await SqlHelper.ExecuteReaderAsync(connection, query, reader => new StaffViewModel
            {
                Id = reader.GetInt32(0),
                Name = reader.GetString(1),
                Email = reader.GetString(2),
                Phone = reader.GetString(3),
                Role = reader.GetString(4),

                // Convert byte[] to base64 string (for frontend rendering)
                ImageBase64 = !reader.IsDBNull(5)
                    ? $"data:image/jpeg;base64,{Convert.ToBase64String((byte[])reader["ImageData"])}"
                    : null,

                Description = reader.IsDBNull(6) ? null : reader.GetString(6)
            });
        }


        // Count the total number of staff
        public async Task<int> GetStaffCountAsync()
        {
            var query = @"SELECT
                            COUNT(*)
                         FROM
                            Staff";
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var result = await SqlHelper.ExecuteScalarAsync(connection, query);
            return (int)result;
        }
        public async Task<SalonSettingsModel> GetSalonSettingsAsync()
        {
            const string query = "SELECT TOP 1 * FROM SalonSettings";

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand(query, connection);
            using var reader = await command.ExecuteReaderAsync();

            if (await reader.ReadAsync())
            {
                return new SalonSettingsModel
                {
                    SalonName = reader["SalonName"].ToString(),
                    OpeningTime = TimeSpan.Parse(reader["OpeningTime"].ToString()),
                    ClosingTime = TimeSpan.Parse(reader["ClosingTime"].ToString()),
                    BookingPolicy = reader["BookingPolicy"].ToString()
                };
            }

            return null;
        }

        public async Task SaveSalonSettingsAsync(SalonSettingsModel model)
        {
            const string queryCheck = "SELECT COUNT(*) FROM SalonSettings";
            const string queryInsert = @"INSERT INTO SalonSettings (SalonName, OpeningTime, ClosingTime, BookingPolicy)
                                 VALUES (@SalonName, @OpeningTime, @ClosingTime, @BookingPolicy)";
            const string queryUpdate = @"UPDATE SalonSettings
                                 SET SalonName = @SalonName,
                                     OpeningTime = @OpeningTime,
                                     ClosingTime = @ClosingTime,
                                     BookingPolicy = @BookingPolicy";

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var checkCommand = new SqlCommand(queryCheck, connection);
            var count = (int)await checkCommand.ExecuteScalarAsync();

            var queryToRun = count == 0 ? queryInsert : queryUpdate;

            using var command = new SqlCommand(queryToRun, connection);
            command.Parameters.AddWithValue("@SalonName", model.SalonName);
            command.Parameters.AddWithValue("@OpeningTime", model.OpeningTime);
            command.Parameters.AddWithValue("@ClosingTime", model.ClosingTime);
            command.Parameters.AddWithValue("@BookingPolicy", model.BookingPolicy);

            await command.ExecuteNonQueryAsync();
        }

        // Calculate revenue for a specific month (appointments marked 'Completed')
        public async Task<decimal> GetMonthlyRevenueAsync(DateTime startDate, DateTime endDate)
        {
            var query = @"SELECT 
                             SUM(Price)
                          FROM 
                             Appointments 
                          WHERE 
                             AppointmentDate >= @StartDate 
                          AND 
                             AppointmentDate < @EndDate 
                          AND 
                            Status = 'Completed'";
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var result = await SqlHelper.ExecuteScalarAsync(connection, query, new()
            {
                ["@StartDate"] = startDate,
                ["@EndDate"] = endDate
            });

            return result == DBNull.Value ? 0 : Convert.ToDecimal(result);
        }
    }
}
