using System.ComponentModel;
using YouLend.LoanManagement.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add Controllers (this enables the [HttpGet], [HttpPost] attributes)
builder.Services.AddControllers();

// Add Swagger for API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register the in-memory loan store as a singleton
// Singleton means one instance is shared across all requests
builder.Services.AddSingleton<LoanStore>();
builder.Services.AddHealthChecks();

// Enable CORS so the frontend can call this API
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy => 
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

// Enable Swagger UI in development mode
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => 
    {
        c.SwaggerEndpoint("swagger/v1/swagger.json", "YouLend Loan API v1");
        c.RoutePrefix = string.Empty; // Swagger at root URL
    });
}

app.UseCors();
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// Map controller routes (this connects URLs to controller methods)
app.MapControllers();
app.MapHealthChecks("/health");

app.Run();
   