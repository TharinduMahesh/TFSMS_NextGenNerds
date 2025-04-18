using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace harvestbackend.Migrations
{
    /// <inheritdoc />
    public partial class initialmigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HarvestEntries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HarvestDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SuperLeafWeight = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NormalLeafWeight = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TransportMethod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HarvestEntries", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HarvestEntries");
        }
    }
}
