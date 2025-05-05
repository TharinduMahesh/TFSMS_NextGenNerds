using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TfactoryMng.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RtLists",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    rName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    startLocation = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    endLocation = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    distance = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    collectorId = table.Column<int>(type: "int", nullable: true),
                    vehicleId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RtLists", x => x.id);
                    table.UniqueConstraint("AK_RtLists_rName", x => x.rName);
                });

            migrationBuilder.CreateTable(
                name: "TransportCosts",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    rName = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    transporterName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    costPerKM = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    totalDistanceKM = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    totalCost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransportCosts", x => x.id);
                    table.ForeignKey(
                        name: "FK_TransportCosts_RtLists_rName",
                        column: x => x.rName,
                        principalTable: "RtLists",
                        principalColumn: "rName",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TransportPerformances",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    rName = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    transporterName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    vehicleNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    arrivalTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    scheduledTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    isOnTime = table.Column<bool>(type: "bit", nullable: false),
                    remarks = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransportPerformances", x => x.id);
                    table.ForeignKey(
                        name: "FK_TransportPerformances_RtLists_rName",
                        column: x => x.rName,
                        principalTable: "RtLists",
                        principalColumn: "rName",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "YieldLists",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    rName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    collected_Yield = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    golden_Tips_Present = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    collectorID = table.Column<int>(type: "int", nullable: false),
                    vehicalID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_YieldLists", x => x.id);
                    table.ForeignKey(
                        name: "FK_YieldLists_RtLists_rName",
                        column: x => x.rName,
                        principalTable: "RtLists",
                        principalColumn: "rName",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RtLists_rName",
                table: "RtLists",
                column: "rName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TransportCosts_rName",
                table: "TransportCosts",
                column: "rName");

            migrationBuilder.CreateIndex(
                name: "IX_TransportPerformances_rName",
                table: "TransportPerformances",
                column: "rName");

            migrationBuilder.CreateIndex(
                name: "IX_YieldLists_rName",
                table: "YieldLists",
                column: "rName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TransportCosts");

            migrationBuilder.DropTable(
                name: "TransportPerformances");

            migrationBuilder.DropTable(
                name: "YieldLists");

            migrationBuilder.DropTable(
                name: "RtLists");
        }
    }
}
