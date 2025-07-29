using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using TfactoryMng.Data;
using TfactoryMng.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IRouteService, RouteService>();
builder.Services.AddScoped<IYieldService, YieldService>(); 
builder.Services.AddScoped<ICollectorService, CollectorService>();
builder.Services.AddScoped<ITripRecordService, TripRecordService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IVehicleService, VehicleService>();

builder.Services.AddControllers()
    .AddJsonOptions(options => {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAngularApp");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var Services = scope.ServiceProvider;
    var context = Services.GetRequiredService<AppDbContext>();
    context.Database.EnsureCreated();
}

app.Run();