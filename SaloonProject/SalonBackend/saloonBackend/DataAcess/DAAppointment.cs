
using EllipticCurve.Utils;
using saloonBackend.Helpers;
using saloonBackend.Models;
using saloonBackend.View;
using System.Data.SqlClient;

namespace saloonBackend.DataAccess
{
   
    public class DAAppointment
    {
        private readonly string _connectionString;

        private static readonly Dictionary<int, decimal> ServicePrices = new()
        {
            { 1, 3500 },  // Haircut
            { 2, 1200 },  // Coloring
            { 3, 5000 },  // Styling
            { 4, 4000 },  // Manicure
            { 5, 4500 },  // Pedicure
            { 6, 15500 }, // Facial
            { 7, 10800 }, // Waxing
            { 8, 8000 },   // Makeup
            {9,0 }//Custom
        };

        public DAAppointment(string connectionString)
        {
            _connectionString = connectionString;
        }

        //public async Task<(bool Success, string? ErrorMessage, object? Result)> BookAppointment(int userId, AppointmentBookingModel request)
        //{
        //    using var connection = new SqlConnection(_connectionString);
        //    await connection.OpenAsync();

        //    var userQuery = @"SELECT 
        //                            Name 
        //                      FROM 
        //                            Users 
        //                      WHERE 
        //                            Id = @UserId";
        //    var userNameResult = await SqlHelper.ExecuteScalarAsync(connection, userQuery, new() { ["@UserId"] = userId });
        //    if (userNameResult == null) return (false, "User not found.", null);

        //    var userName = userNameResult.ToString()!;

        //    decimal totalPrice = 0;
        //    foreach (var id in request.ServiceTypeIds)
        //    {
        //        if (!ServicePrices.TryGetValue(id, out var price))
        //        {
        //            return (false, $"Invalid service ID: {id}", null);
        //        }
        //        totalPrice += price;
        //    }

        //    using var transaction = await connection.BeginTransactionAsync();

        //    try
        //    {
        //        var insertAppointmentQuery = @"
        //            INSERT INTO 
        //                        Appointments (
        //                                      AppointmentDate,
        //                                      AppointmentTime,
        //                                      UserId,
        //                                      UserName,
        //                                      Price)
        //            OUTPUT INSERTED.Id
        //            VALUES (
        //                    @Date,
        //                    @Time,
        //                    @UserId,
        //                    @UserName,
        //                    @Price)";

        //        var appointmentIdObj = await SqlHelper.ExecuteScalarAsync(
        //            connection,
        //            insertAppointmentQuery,
        //            new()
        //            {
        //                ["@Date"] = request.AppointmentDate,
        //                ["@Time"] = request.AppointmentTime,
        //                ["@UserId"] = userId,
        //                ["@UserName"] = userName,
        //                ["@Price"] = totalPrice
        //            },
        //            (SqlTransaction)transaction);

        //        if (appointmentIdObj == null)
        //        {
        //            await transaction.RollbackAsync();
        //            return (false, "Failed to insert appointment.", null);
        //        }

        //        int appointmentId = (int)appointmentIdObj;

        //        var insertServiceQuery = @"
        //            INSERT INTO AppointmentServices 
        //                 (
        //                 AppointmentId,
        //                 ServiceTypeId
        //                 )
        //            VALUES 
        //                (@AppointmentId, 
        //                 @ServiceTypeId)";

        //        foreach (var serviceId in request.ServiceTypeIds)
        //        {
        //            await SqlHelper.ExecuteNonQueryAsync(
        //                connection,
        //                insertServiceQuery,
        //                new()
        //                {
        //                    ["@AppointmentId"] = appointmentId,
        //                    ["@ServiceTypeId"] = serviceId
        //                },
        //                (SqlTransaction)transaction);
        //        }

        //        await transaction.CommitAsync();

        //        return (true, null, new { appointmentId, totalPrice });
        //    }
        //    catch (Exception ex)
        //    {
        //        await transaction.RollbackAsync();
        //        return (false, ex.Message, null);
        //    }
        //}
        //public async Task<(bool Success, string? ErrorMessage, object? Result)> BookAppointment(int userId, AppointmentBookingModel request)
        //{
        //    using var connection = new SqlConnection(_connectionString);
        //    await connection.OpenAsync();

        //    // ✅ Check user
        //    var userQuery = @"SELECT Name FROM Users WHERE Id = @UserId";
        //    var userNameResult = await SqlHelper.ExecuteScalarAsync(connection, userQuery, new() { ["@UserId"] = userId });
        //    if (userNameResult == null) return (false, "User not found.", null);
        //    var userName = userNameResult.ToString()!;

        //    // ✅ Check staff exists (fixed StaffId casing)
        //    var staffQuery = @"SELECT COUNT(*) FROM Staff WHERE Id = @StaffId";
        //    var staffExists = (int)await SqlHelper.ExecuteScalarAsync(connection, staffQuery, new() { ["@StaffId"] = request.StaffId });
        //    if (staffExists == 0) return (false, "Selected staff member does not exist.", null);

        //    // ✅ Check staff availability
        //    var checkStaffConflictQuery = @"
        //SELECT COUNT(*) FROM Appointments
        //WHERE StaffId = @StaffId
        //  AND AppointmentDate = @Date
        //  AND AppointmentTime = @Time";

        //    var conflictCount = (int)await SqlHelper.ExecuteScalarAsync(connection, checkStaffConflictQuery, new()
        //    {
        //        ["@StaffId"] = request.StaffId,
        //        ["@Date"] = request.AppointmentDate,
        //        ["@Time"] = request.AppointmentTime
        //    });

        //    if (conflictCount > 0)
        //    {
        //        return (false, "The selected staff member is not available at the chosen time.", null);
        //    }

        //    // ✅ Calculate price
        //    decimal totalPrice = 0;
        //    foreach (var id in request.ServiceTypeIds)
        //    {
        //        if (!ServicePrices.TryGetValue(id, out var price))
        //        {
        //            return (false, $"Invalid service ID: {id}", null);
        //        }
        //        totalPrice += price;
        //    }

        //    using var transaction = await connection.BeginTransactionAsync();

        //    try
        //    {
        //        // ✅ Insert appointment with StaffId
        //        var insertAppointmentQuery = @"
        //    INSERT INTO Appointments (
        //        AppointmentDate,
        //        AppointmentTime,
        //        UserId,
        //        UserName,
        //        Price,
        //        StaffId)
        //    OUTPUT INSERTED.Id
        //    VALUES (
        //        @Date,
        //        @Time,
        //        @UserId,
        //        @UserName,
        //        @Price,
        //        @StaffId)";

        //        var appointmentIdObj = await SqlHelper.ExecuteScalarAsync(
        //            connection,
        //            insertAppointmentQuery,
        //            new()
        //            {
        //                ["@Date"] = request.AppointmentDate,
        //                ["@Time"] = request.AppointmentTime,
        //                ["@UserId"] = userId,
        //                ["@UserName"] = userName,
        //                ["@Price"] = totalPrice,
        //                ["@StaffId"] = request.StaffId
        //            },
        //            (SqlTransaction)transaction);

        //        if (appointmentIdObj == null)
        //        {
        //            await transaction.RollbackAsync();
        //            return (false, "Failed to insert appointment.", null);
        //        }

        //        int appointmentId = (int)appointmentIdObj;

        //        // ✅ Insert services
        //        var insertServiceQuery = @"
        //    INSERT INTO AppointmentServices (
        //        AppointmentId,
        //        ServiceTypeId)
        //    VALUES (
        //        @AppointmentId,
        //        @ServiceTypeId)";

        //        foreach (var serviceId in request.ServiceTypeIds)
        //        {
        //            await SqlHelper.ExecuteNonQueryAsync(
        //                connection,
        //                insertServiceQuery,
        //                new()
        //                {
        //                    ["@AppointmentId"] = appointmentId,
        //                    ["@ServiceTypeId"] = serviceId
        //                },
        //                (SqlTransaction)transaction);
        //        }

        //        await transaction.CommitAsync();

        //        return (true, null, new { appointmentId, totalPrice });
        //    }
        //    catch (Exception ex)
        //    {
        //        await transaction.RollbackAsync();
        //        return (false, ex.Message, null);
        //    }
        //}

        public async Task<(bool Success, string? ErrorMessage, object? Result)> BookAppointment(int userId, AppointmentBookingModel request)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            // ✅ Check user
            var userQuery = @"SELECT Name FROM Users WHERE Id = @UserId";
            var userNameResult = await SqlHelper.ExecuteScalarAsync(connection, userQuery, new() { ["@UserId"] = userId });
            if (userNameResult == null) return (false, "User not found.", null);
            var userName = userNameResult.ToString()!;


            // ✅ Check App Date availability
            var checkApptDateConflictQuery = @"
        SELECT COUNT(*) FROM Appointments
        WHERE AppointmentDate = @Date AND AppointmentTime = @Time";

            var conflictCount = (int)await SqlHelper.ExecuteScalarAsync(connection, checkApptDateConflictQuery, new()
            {
                
                ["@Date"] = request.AppointmentDate,
                ["@Time"] = request.AppointmentTime
            });

            if (conflictCount > 0)
            {
                return (false, "The selected appointed date is not available at the chosen time.", null);
            }

            // ✅ Calculate price
            decimal totalPrice = 0;

           
              foreach (var id in request.ServiceTypeIds)
              {
                  if (!ServicePrices.TryGetValue(id, out var price))
                  {
                     return (false, "The relevant service type id doesn't match", null);
                       
                  }
                  totalPrice += price;
              }

            
           

            using var transaction = await connection.BeginTransactionAsync();

            try
            {
                // ✅ Insert appointment with StaffId
                var insertAppointmentQuery = @"
            INSERT INTO Appointments (
                AppointmentDate,
                AppointmentTime,
                UserId,
                UserName,
                Price)
            OUTPUT INSERTED.Id
            VALUES (
                @Date,
                @Time,
                @UserId,
                @UserName,
                @Price)";

                var appointmentIdObj = await SqlHelper.ExecuteScalarAsync(
                    connection,
                    insertAppointmentQuery,
                    new()
                    {
                        ["@Date"] = request.AppointmentDate,
                        ["@Time"] = request.AppointmentTime,
                        ["@UserId"] = userId,
                        ["@UserName"] = userName,
                        ["@Price"] = totalPrice
                    },
                    (SqlTransaction)transaction);

                if (appointmentIdObj == null)
                {
                    await transaction.RollbackAsync();
                    return (false, "Failed to insert appointment.", null);
                }

                int appointmentId = (int)appointmentIdObj;

                // ✅ Insert services
                var insertServiceQuery = @"
            INSERT INTO AppointmentServices (
                AppointmentId,
                ServiceTypeId)
            VALUES (
                @AppointmentId,
                @ServiceTypeId)";

               
                foreach (var serviceId in request.ServiceTypeIds)
                {
                    await SqlHelper.ExecuteNonQueryAsync(
                      connection,
                      insertServiceQuery,
                      new()
                       {
                         ["@AppointmentId"] = appointmentId,
                         ["@ServiceTypeId"] = serviceId
                        },
                       (SqlTransaction)transaction);
                }

                

                await transaction.CommitAsync();

                return (true, null, new { appointmentId, totalPrice });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return (false, ex.Message, null);
            }
        }


        public async Task<string?> GetUserPhoneByIdAsync(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var result = await SqlHelper.ExecuteScalarAsync(connection,
                "SELECT Phone FROM Users WHERE Id = @Id",
                new() { ["@Id"] = userId });

            return result?.ToString();
        }

        public async Task<List<string>> GetAvailableSlots(DateTime appointmentDate, int duration)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var appointmentsQuery = @"
                SELECT 
                      AppointmentTime, 
                      DurationMinutes
                FROM 
                      Appointments
                WHERE
                      AppointmentDate = @Date";

            var appointments = await SqlHelper.ExecuteReaderAsync(connection, appointmentsQuery, reader => new
            {
                AppointmentTime = reader.GetTimeSpan(0),
                DurationMinutes = Convert.ToInt32(reader.GetDouble(1))  //  Safe cast from DOUBLE/FLOAT to INT
            }, new() { ["@Date"] = appointmentDate.Date});

            var allSlots = GenerateTimeSlots();
            var availableSlots = new List<string>();
            
            foreach (var slot in allSlots)
            {
                var slotTime = TimeSpan.Parse(slot);
                var slotEndTime = slotTime.Add(TimeSpan.FromMinutes(duration));

                var isAvailable = !appointments.Any(a =>
                {
                    var appointmentEndTime = a.AppointmentTime.Add(TimeSpan.FromMinutes(a.DurationMinutes));
                    return (slotTime >= a.AppointmentTime && slotTime < appointmentEndTime) ||
                           (slotEndTime > a.AppointmentTime && slotEndTime <= appointmentEndTime) ||
                           (slotTime <= a.AppointmentTime && slotEndTime >= appointmentEndTime);
                });

                if (isAvailable)
                    availableSlots.Add(slot);
            }

            return availableSlots;
        }




        private List<string> GenerateTimeSlots()
        {
            var slots = new List<string>();
            var startTime = new TimeSpan(9, 0, 0);  // Start at 9:00 AM
            var endTime = new TimeSpan(17, 0, 0);   // End at 5:00 PM

            for (var time = startTime; time <= endTime; time = time.Add(TimeSpan.FromMinutes(60)))
            {
                slots.Add(time.ToString(@"hh\:mm")); // Format to "HH:mm"
            }

            return slots;
        }


        public async Task<List<DailyCountModel>> GetDailyCounts()
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var query = @"
                SELECT 
                       CAST(AppointmentDate AS DATE) AS Date, 
                       COUNT(*) AS Count
                FROM 
                       Appointments
                GROUP BY 
                       CAST(AppointmentDate AS DATE)
                ORDER BY 
                       Date";

            return await SqlHelper.ExecuteReaderAsync(connection, query, reader => new DailyCountModel
            {
                Date = reader.GetDateTime(0),
                Count = reader.GetInt32(1)
            });
        }

        public async Task<int> GetTodayCount()
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var query = @"SELECT
                              COUNT(*) 
                          FROM 
                              Appointments
                          WHERE 
                              CAST(AppointmentDate AS DATE) = CAST(GETDATE() AS DATE)";
            var result = await SqlHelper.ExecuteScalarAsync(connection, query);
            return (int)result;
        }

        public async Task<List<Appointment>> GetAllAppointments()
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var query = @"
            SELECT 
            a.Id,
            a.AppointmentDate,
            a.AppointmentTime,
            a.UserId,
            a.UserName,
            u.Phone AS UserPhone,
            a.Price,
            a.Status,
            a.StaffId,
            st.Name AS ServiceName
            FROM    
            Appointments a

            INNER JOIN
            Users u ON a.UserId = u.Id

            LEFT JOIN 
            AppointmentServices aps ON a.Id = aps.AppointmentId
         
            LEFT JOIN
            ServiceTypes st ON aps.ServiceTypeId = st.Id

            ORDER BY
            a.AppointmentDate DESC, a.AppointmentTime DESC";

            

            return await SqlHelper.ExecuteReaderAsync(connection, query, reader => new Appointment
            {
                Id = reader.GetInt32(0),
                AppointmentDate = reader.GetDateTime(1),
                AppointmentTime = reader.GetTimeSpan(2),
                UserId = reader.GetInt32(3),
                UserName = reader.IsDBNull(4) ? null : reader.GetString(4),
                Phone = reader.IsDBNull(5) ? null : reader.GetString(5),
                Price = reader.GetDecimal(6),
                Status = reader.IsDBNull(7) ? null : reader.GetString(7),
                StaffId = reader.IsDBNull(8) ? null : reader.GetInt32(8),
                ServiceName = reader.IsDBNull(9) ? null : reader.GetString(9)
            });
        }



        public async Task<List<Appointment>> GetRecentAppointments(int count)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var query = @"
                SELECT TOP (@Count)
                    a.Id,
                    a.AppointmentDate,
                    a.AppointmentTime,
                    a.UserId,
                    a.UserName,
                    a.Price,
                    a.Status,
                    a.StaffId,
                    st.Name AS ServiceName
                FROM 
                    Appointments a
                LEFT JOIN
                    AppointmentServices aps ON a.Id = aps.AppointmentId
                LEFT JOIN 
                    ServiceTypes st ON aps.ServiceTypeId = st.Id
                ORDER BY    
                    a.AppointmentDate DESC, a.AppointmentTime DESC";

            return await SqlHelper.ExecuteReaderAsync(connection, query, reader => new Appointment
            {
                Id = reader.GetInt32(0),
                AppointmentDate = reader.GetDateTime(1),
                AppointmentTime = reader.GetTimeSpan(2),
                UserId = reader.GetInt32(3),
                UserName = reader.GetString(4),
                Price = reader.GetDecimal(5),
                Status = reader.IsDBNull(6) ? null : reader.GetString(6),
                StaffId = reader.IsDBNull(7) ? null : reader.GetInt32(7),
                ServiceName = reader.IsDBNull(8) ? null : reader.GetString(8)
            }, new() { ["@Count"] = count });
        }
        public async Task<List<Appointment>> GetAppointmentsByUserId(int userId)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var query = @"
                SELECT 
                    a.Id,
                    a.AppointmentDate,
                    a.AppointmentTime,
                    a.UserId,
                    a.UserName,
                    a.Price,
                    a.Status,
                    a.StaffId,
                    s.Name AS StaffName,
                    (
                        SELECT STUFF((
                            SELECT ', ' + st.Name
                            FROM AppointmentServices aps2
                            INNER JOIN ServiceTypes st ON aps2.ServiceTypeId = st.Id
                            WHERE aps2.AppointmentId = a.Id
                            FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 2, '')
                    ) AS ServiceNames
                FROM Appointments a
                LEFT JOIN Staff s ON a.StaffId = s.Id
                WHERE a.UserId = @UserId";

            query += " ORDER BY a.AppointmentDate DESC, a.AppointmentTime DESC";



            var parameters = new Dictionary<string, object> { ["@UserId"] = userId };

            return await SqlHelper.ExecuteReaderAsync(connection, query, reader => new Appointment
            {
                Id = reader.GetInt32(0),
                AppointmentDate = reader.GetDateTime(1),
                AppointmentTime = reader.GetTimeSpan(2),
                UserId = reader.GetInt32(3),
                UserName = reader.IsDBNull(4) ? null : reader.GetString(4),
                Price = reader.GetDecimal(5),
                Status = reader.IsDBNull(6) ? null : reader.GetString(6),
                StaffId = reader.IsDBNull(7) ? null : reader.GetInt32(7),
                StaffName = reader.IsDBNull(8) ? null : reader.GetString(8),
                ServiceName = reader.IsDBNull(9) ? null : reader.GetString(9) // <- Add this to your Appointment model
            }, parameters);
        }




        public async Task<Appointment?> UpdateAppointment(int id, AppointmentUpdateModel request)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var checkQuery = @"SELECT 
                                    COUNT(1)
                               FROM 
                                    Appointments 
                               WHERE 
                                    Id = @Id";

            var exists = (int)await SqlHelper.ExecuteScalarAsync(connection, checkQuery, new() { ["@Id"] = id }) > 0;
            if (!exists) return null;

            var updateQuery = @"UPDATE 
                                    Appointments 
                                SET 
                                    AppointmentDate = @Date,
                                    AppointmentTime = @Time 
                                WHERE 
                                    Id = @Id";
            await SqlHelper.ExecuteNonQueryAsync(connection, updateQuery, new()
            {
                ["@Date"] = request.AppointmentDate,
                ["@Time"] = request.AppointmentTime,
                ["@Id"] = id
            });

            var selectQuery = @"SELECT
                                    Id,
                                    AppointmentDate,
                                    AppointmentTime,
                                    UserId,
                                    UserName,
                                    Price,
                                    Status,
                                    StaffId    
                                FROM
                                    Appointments 
                                WHERE 
                                    Id = @Id";
            var list = await SqlHelper.ExecuteReaderAsync(connection, selectQuery, reader => new Appointment
            {
                Id = reader.GetInt32(0),
                AppointmentDate = reader.GetDateTime(1),
                AppointmentTime = reader.GetTimeSpan(2),
                UserId = reader.GetInt32(3),
                UserName = reader.GetString(4),
                Price = reader.GetDecimal(5),
                Status = reader.IsDBNull(6) ? null : reader.GetString(6),
                StaffId = reader.IsDBNull(7) ? null : reader.GetInt32(7)
            }, new() { ["@Id"] = id });

            return list.FirstOrDefault();
        }


        public async Task<bool> DeleteAppointment(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var checkQuery = @"SELECT COUNT(1)
                               FROM Appointments
                               WHERE Id = @Id";
            var exists = (int)await SqlHelper.ExecuteScalarAsync(connection, checkQuery, new() { ["@Id"] = id }) > 0;
            if (!exists) return false;

            var deleteQuery = @"DELETE 
                                FROM 
                                    Appointments
                                WHERE 
                                    Id = @Id";
            await SqlHelper.ExecuteNonQueryAsync(connection, deleteQuery, new() { ["@Id"] = id });
            return true;
        }
    }
}
