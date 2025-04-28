using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace test6API.Migrations
{
    /// <inheritdoc />
    public partial class second : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GrowerCreateAccounts",
                columns: table => new
                {
                    GrowerAccountId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GrowerFirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GrowerLastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GrowerAddress = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GrowerGender = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GrowerDOB = table.Column<DateTime>(type: "datetime2", nullable: false),
                    GrowerPhoneNum = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MoneyMethod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GrowerId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GrowerCreateAccounts", x => x.GrowerAccountId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GrowerCreateAccounts");
        }
    }
}
