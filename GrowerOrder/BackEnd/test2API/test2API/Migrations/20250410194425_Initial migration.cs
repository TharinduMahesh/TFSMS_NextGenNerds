using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace test2API.Migrations
{
    /// <inheritdoc />
    public partial class Initialmigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GrowerOrders",
                columns: table => new
                {
                    GrowerOrderId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SuperTeaQuantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    GreenTeaQuantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PlaceDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TransportMethod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GrowerOrders", x => x.GrowerOrderId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GrowerOrders");
        }
    }
}
