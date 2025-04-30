using System.Reflection;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using MiniTaskHub.Api.Data;
using MiniTaskHub.Api.Mappings;
using MiniTaskHub.Api.Models;
using MiniTaskHub.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// ────── Add Services to the Container ──────

// Add Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddAutoMapper(typeof(MappingProfile));

// Add Swagger with XML comments
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
});

// Add Entity Framework Core with SQL Server
builder.Services.AddDbContext<TaskHubDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Application Services
builder.Services.AddScoped<ITaskService, TaskService>();

// Configure CORS for Angular Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// ────── Build the App ──────

var app = builder.Build();

// ────── Configure the HTTP Request Pipeline ──────

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Global error handler
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Response.ContentType = "application/json";

        var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
        var error = new ErrorResponse
        {
            Message = "An unexpected error occured.",
            Details = app.Environment.IsDevelopment() ? exceptionHandlerPathFeature?.Error.ToString() : null
        };
        await context.Response.WriteAsJsonAsync(error);
    });
});

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

app.MapGet("/api/throw", (HttpContext _) => throw new Exception("An unexpected error occurred."));

app.Run();
