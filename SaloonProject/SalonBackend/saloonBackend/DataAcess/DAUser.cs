//using saloonBackend.Dtos;
using saloonBackend.Helpers;
using saloonBackend.Models;
using saloonBackend.View;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Data.SqlClient;

namespace saloonBackend.DataAccess
{
    public class DAUser
    {
        private readonly string _connectionString;

        public DAUser(string connectionString)
        {
            _connectionString = connectionString;
        }

        //public async Task<int> GetUserCountByEmailAsync(string email)
        //{
        //    string query = @"SELECT
        //                        COUNT(*)
        //                    FROM
        //                        Users 
        //                    WHERE 
        //                        Email = @Email";

        //    using var connection = new SqlConnection(_connectionString);
        //    await connection.OpenAsync();

        //    var countObj = await SqlHelper.ExecuteScalarAsync(connection, query, new Dictionary<string, object>
        //    {
        //        ["@Email"] = email
        //    });

        //    return Convert.ToInt32(countObj);
        //}

        public async Task<int> GetUserCountByPhoneAsync(string phone)
        {
            string query = @"SELECT
                                COUNT(*)
                            FROM
                                Users
                            WHERE 
                                Phone = @Phone";

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var countObj = await SqlHelper.ExecuteScalarAsync(connection, query, new Dictionary<string, object>
            {
                ["@Phone"] = phone
            });

            return Convert.ToInt32(countObj);
        }




        //public async Task<int> InsertUserAsync(string name, string email, string phone, string passwordHash)
        //{
        //    string query = @"
        //        INSERT INTO 
        //                   Users (
        //                            Name,
        //                            Email,
        //                            Phone,
        //                            PasswordHash
        //                         )
        //        VALUES (
        //                @Name,
        //                @Email,
        //                @Phone,
        //                @PasswordHash
        //                );
        //        SELECT CAST(SCOPE_IDENTITY() AS INT);"; // SQL Server way to get last inserted ID

        //    using var connection = new SqlConnection(_connectionString);
        //    await connection.OpenAsync();

        //    var parameters = new Dictionary<string, object>
        //    {
        //        ["@Name"] = name,
        //        ["@Email"] = email,
        //        ["@Phone"] = phone,
        //        ["@PasswordHash"] = passwordHash
        //    };

        //    var insertedIdObj = await SqlHelper.ExecuteScalarAsync(connection, query, parameters);
        //    return Convert.ToInt32(insertedIdObj);
        //}

        public async Task<int> InsertUserAsync(string name, string phone)
        {
            string query = @"
                INSERT INTO Users (Name,Phone)
                VALUES (
                        @Name,
                        @Phone
                        );
                SELECT CAST(SCOPE_IDENTITY() AS INT);"; // SQL Server way to get last inserted ID

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var parameters = new Dictionary<string, object>
            {
                ["@Name"] = name,
                ["@Phone"] = phone
              
            };

            var insertedIdObj = await SqlHelper.ExecuteScalarAsync(connection, query, parameters);
            return Convert.ToInt32(insertedIdObj);
        }
        //public async Task StoreResetTokenAsync(string email, string token, DateTime expiry)
        //{
        //    string query = @"
        //UPDATE Users
        //SET ResetToken = @ResetToken,
        //    ResetTokenExpiry = @Expiry
        //WHERE Email = @Email";

        //    using var connection = new SqlConnection(_connectionString);
        //    await connection.OpenAsync();

        //    var parameters = new Dictionary<string, object>
        //    {
        //        ["@ResetToken"] = token,
        //        ["@Expiry"] = expiry,
        //        ["@Email"] = email
        //    };

        //    await SqlHelper.ExecuteNonQueryAsync(connection, query, parameters);
        //}

        //public async Task<User> GetUserByResetTokenAsync(string token)
        //{
        //    string query = "SELECT * FROM Users WHERE ResetToken = @Token";

        //    using var connection = new SqlConnection(_connectionString);
        //    await connection.OpenAsync();

        //    var parameters = new Dictionary<string, object>
        //    {
        //        ["@Token"] = token
        //    };

        //    var users = await SqlHelper.ExecuteReaderAsync(
        //        connection,
        //        query,
        //        reader =>
        //        {
        //            return new User
        //            {
        //                Id = reader.GetInt32(reader.GetOrdinal("Id")),
        //                Email = reader.GetString(reader.GetOrdinal("Email")),
        //                PasswordHash = reader.GetString(reader.GetOrdinal("PasswordHash")),
        //                ResetToken = reader["ResetToken"] as string,
        //                ResetTokenExpiry = reader["ResetTokenExpiry"] as DateTime?
        //            };
        //        },
        //        parameters
        //    );

        //    return users.FirstOrDefault(); // return null if not found
        //}

        public async Task UpdatePasswordAsync(string email, string newPasswordHash)
        {
            string query = @"
        UPDATE Users
        SET PasswordHash = @PasswordHash,
            ResetToken = NULL,
            ResetTokenExpiry = NULL
        WHERE Email = @Email";

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var parameters = new Dictionary<string, object>
            {
                ["@PasswordHash"] = newPasswordHash,
                ["@Email"] = email
            };

            await SqlHelper.ExecuteNonQueryAsync(connection, query, parameters);
        }


        public async Task<List<User>> GetUserByEmailAsync(string email)
        {
            string query = @"
                SELECT 
                    Id,
                    Name,
                    Email,
                    PasswordHash
                FROM 
                    Users
                WHERE 
                    Email = @Email";

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var parameters = new Dictionary<string, object> { ["@Email"] = email };

            var users = await SqlHelper.ExecuteReaderAsync(connection, query, reader =>
            {
                return new User
                {
                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                    Name = reader.GetString(reader.GetOrdinal("Name")),
                    Email = reader.GetString(reader.GetOrdinal("Email")),
                    PasswordHash = reader.GetString(reader.GetOrdinal("PasswordHash"))
                };
            }, parameters);

            return users;
        }


        public async Task<User> GetUserByPhoneAsync(string phone)
        {
            string query = @"
            SELECT Id, Name, Phone FROM Users WHERE Phone = @Phone";

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var parameters = new Dictionary<string, object>
            {
                
                ["@Phone"] = phone,

            };

            var user = await SqlHelper.ExecuteReaderAsync(connection, query, reader =>
            {
                return new User
                {
                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                    Name = reader.GetString(reader.GetOrdinal("Name")),
                    Phone = reader.GetString(reader.GetOrdinal("Phone")),
                    

                };


            }, parameters);

            return user.FirstOrDefault();

        }

        public async Task<User> GetUserExistsByIdAsync(int id)
        {
            string query = @"
                SELECT 
                    Id,
                    Name,
                    Email,
                    Phone,
                    PhoneVerified
                FROM 
                    Users
                WHERE 
                    Id = @Id";
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            var parameters = new Dictionary<string, object> { ["@Id"] = id };
            var users = await SqlHelper.ExecuteReaderAsync(connection, query, reader =>
            {
                return new User
                {
                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                    Name = reader.GetString(reader.GetOrdinal("Name")),
                    Email = reader.GetString(reader.GetOrdinal("Email")),
                    Phone = reader.GetString(reader.GetOrdinal("Phone")),
                    PhoneVerified = reader.GetBoolean(reader.GetOrdinal("PhoneVerified"))
                };
            }, parameters);
            return users.FirstOrDefault();

        }


        public async Task<User> GetUserByOtpAsync(string phone)
        {
            string query = @"
            SELECT Id, Name, Phone, OtpCode, OtpExpiresAt FROM Users WHERE Phone = @Phone";

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            var parameters = new Dictionary<string, object>
            {
                ["@Phone"] = phone,
            };

            var user = await SqlHelper.ExecuteReaderAsync(connection, query, reader =>
            {
                return new User
                {
                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                    Name = reader.GetString(reader.GetOrdinal("Name")),
                    OtpCode = reader.GetString(reader.GetOrdinal("OtpCode")),
                    OtpExpiresAt = reader.GetDateTime(reader.GetOrdinal("OtpExpiresAt"))


                };


            }, parameters);

            return user.FirstOrDefault();

        }

        public async Task<int> UpdateOtpAsync(int userId, string code, DateTime expiresAt)
        {
            string query = @"
            UPDATE Users
            SET OtpCode = @OtpCode,
            OtpExpiresAt = @OtpExpiresAt
            WHERE Id = @Id;";


            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            var parameters = new Dictionary<string, object>
            {
                ["@OtpCode"] = code,
                ["@OtpExpiresAt"] = expiresAt,
                ["@Id"] = userId
            };
            int rows = await SqlHelper.ExecuteNonQueryAsync(connection, query, parameters);
            return rows;
        }

        public async Task ClearOtpAndVerifyAsync(int userId)
        {
            const string query = @"UPDATE Users SET PhoneVerified = 1, OtpCode = NULL, OtpExpiresAt = NULL WHERE Id = @Id;";
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();
            var parameters = new Dictionary<string, object>
            {
                ["@Id"] = userId
            };

            await SqlHelper.ExecuteNonQueryAsync(connection, query, parameters);
        }


    }
}
