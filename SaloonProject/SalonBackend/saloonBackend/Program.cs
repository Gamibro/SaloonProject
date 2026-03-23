using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
//using saloonBackend.BusinessLogic;
using saloonBackend.DataAccess;
using saloonBackend.Models;
using saloonBackend.View;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// --- JWT Configuration ---
var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtKey = jwtSection["Key"] ?? throw new ArgumentNullException("Jwt:Key", "JWT Key is missing in configuration");
var jwtIssuer = jwtSection["Issuer"] ?? "SalonAPI";

// --- CORS Configuration ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://salon.dockyardsoftware.com")
            .AllowAnyHeader()
            .AllowAnyMethod();
            //.AllowCredentials(); // Required when using credentials: 'include' on frontend
    });
    //options.AddPolicy("AllowLocalhost3000",
    //   policy =>
    //   {
    //       policy.WithOrigins("http://localhost:3000")
    //             .AllowAnyHeader()
    //             .AllowAnyMethod();
    //   });
});

// --- Connection String & Dependency Injection ---
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddScoped<DAAppointment>(_ => new DAAppointment(connectionString));
builder.Services.AddScoped<DAAdmin>(_ => new DAAdmin(connectionString));
builder.Services.AddScoped<DAUser>(_ => new DAUser(connectionString));
//builder.Services.AddSingleton<EmailService>();

// --- JWT Authentication Setup ---
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                if (context.Exception is SecurityTokenExpiredException)
                    context.Response.Headers.Append("Token-Expired", "true");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

////Add Twilio Settings
//builder.Services.Configure<TwilioSettings>(
//    builder.Configuration.GetSection("Twilio"));
//builder.Services.AddSingleton<SmsService>();

//builder.Services.Configure<VonageSettings>(builder.Configuration.GetSection("Vonage"));
//builder.Services.AddHttpClient();
//builder.Services.AddSingleton<SmsService>();

// --- JSON & Controllers ---
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// --- Swagger Configuration ---
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SalonAPI",
        Version = "v1",
        Contact = new OpenApiContact
        {
            Name = "Support",
            Email = "support@salonapi.com"
        }
    });

    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Enter JWT Bearer token **_only_**",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition(securityScheme.Reference.Id, securityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { securityScheme, Array.Empty<string>() }
    });
});

var app = builder.Build();

// --- Swagger in Development ---
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.ConfigObject.AdditionalItems["syntaxHighlight"] = new Dictionary<string, object>
        {
            ["activated"] = false
        };
    });
}

// --- Security Headers ---
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-Frame-Options", "DENY");
    context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
    await next();
});

// --- Middleware Order Matters ---
app.UseHttpsRedirection();


app.UseRouting();

app.UseCors("AllowFrontend"); // MUST be between Routing and thAu
//app.UseCors("AllowLocalhost3000");
app.UseAuthentication();
app.UseAuthorization();

app.UseExceptionHandler("/error");

app.MapControllers();

app.Run();
