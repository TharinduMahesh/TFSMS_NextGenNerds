using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TfactoryMng.Migrations
{
    /// <inheritdoc />
    public partial class adfinalmigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Collectors",
                columns: table => new
                {
                    CollectorId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    CollectorNIC = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CollectorAddressLine1 = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    CollectorAddressLine2 = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    CollectorCity = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CollectorPostalCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    CollectorGender = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    CollectorDOB = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CollectorPhoneNum = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    CollectorEmail = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    RatePerKm = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Collectors", x => x.CollectorId);
                });

            migrationBuilder.CreateTable(
                name: "RtLists",
                columns: table => new
                {
                    rId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    rName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    startLocation = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    endLocation = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    distance = table.Column<int>(type: "int", nullable: true),
                    CollectorId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RtLists", x => x.rId);
                    table.ForeignKey(
                        name: "FK_RtLists_Collectors_CollectorId",
                        column: x => x.CollectorId,
                        principalTable: "Collectors",
                        principalColumn: "CollectorId",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Vehicles",
                columns: table => new
                {
                    VehicleId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LicensePlate = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Volume = table.Column<decimal>(type: "decimal(18,3)", nullable: false),
                    Model = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ConditionNotes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CollectorId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vehicles", x => x.VehicleId);
                    table.ForeignKey(
                        name: "FK_Vehicles_Collectors_CollectorId",
                        column: x => x.CollectorId,
                        principalTable: "Collectors",
                        principalColumn: "CollectorId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "GrowerLocations",
                columns: table => new
                {
                    gId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    latitude = table.Column<double>(type: "float", nullable: false),
                    longitude = table.Column<double>(type: "float", nullable: false),
                    description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    RtListId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GrowerLocations", x => x.gId);
                    table.ForeignKey(
                        name: "FK_GrowerLocations_RtLists_RtListId",
                        column: x => x.RtListId,
                        principalTable: "RtLists",
                        principalColumn: "rId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TripRecords",
                columns: table => new
                {
                    TripId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RouteId = table.Column<int>(type: "int", nullable: false),
                    CollectorId = table.Column<int>(type: "int", nullable: false),
                    ScheduledDeparture = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ScheduledArrival = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ActualDeparture = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ActualArrival = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TripRecords", x => x.TripId);
                    table.ForeignKey(
                        name: "FK_TripRecords_Collectors_CollectorId",
                        column: x => x.CollectorId,
                        principalTable: "Collectors",
                        principalColumn: "CollectorId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TripRecords_RtLists_RouteId",
                        column: x => x.RouteId,
                        principalTable: "RtLists",
                        principalColumn: "rId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "YieldLists",
                columns: table => new
                {
                    yId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    rId = table.Column<int>(type: "int", nullable: false),
                    collected_Yield = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    golden_Tips_Present = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YieldLists", x => x.yId);
                    table.ForeignKey(
                        name: "FK_YieldLists_RtLists_rId",
                        column: x => x.rId,
                        principalTable: "RtLists",
                        principalColumn: "rId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GrowerLocations_RtListId",
                table: "GrowerLocations",
                column: "RtListId");

            migrationBuilder.CreateIndex(
                name: "IX_RtLists_CollectorId",
                table: "RtLists",
                column: "CollectorId");

            migrationBuilder.CreateIndex(
                name: "IX_RtLists_rName",
                table: "RtLists",
                column: "rName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TripRecords_CollectorId",
                table: "TripRecords",
                column: "CollectorId");

            migrationBuilder.CreateIndex(
                name: "IX_TripRecords_RouteId",
                table: "TripRecords",
                column: "RouteId");

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_CollectorId",
                table: "Vehicles",
                column: "CollectorId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_LicensePlate",
                table: "Vehicles",
                column: "LicensePlate",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_YieldLists_rId",
                table: "YieldLists",
                column: "rId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GrowerLocations");

            migrationBuilder.DropTable(
                name: "TripRecords");

            migrationBuilder.DropTable(
                name: "Vehicles");

            migrationBuilder.DropTable(
                name: "YieldLists");

            migrationBuilder.DropTable(
                name: "RtLists");

            migrationBuilder.DropTable(
                name: "Collectors");
        }
    }
}
