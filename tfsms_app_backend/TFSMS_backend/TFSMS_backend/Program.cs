using Microsoft.EntityFrameworkCore;
using TFSMS_app_backend.Data;

var builder = WebApplication.CreateBuilder(args);

//1. Register DbContext with SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//2. Register controllers
builder.Services.AddControllers();

//3. Add Swagger (for API documentation/testing)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//4. Define CORS policy (Allow all origins — for development only!)
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

//5. Enable Swagger only in Development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//6. Enforce HTTPS (optional in development)
app.UseHttpsRedirection();

//7. Enable CORS BEFORE routing and authorization
app.UseCors("AllowAll");

app.UseAuthorization();

//8. Map controller endpoints
app.MapControllers();

//9. Run the app
app.Run();
