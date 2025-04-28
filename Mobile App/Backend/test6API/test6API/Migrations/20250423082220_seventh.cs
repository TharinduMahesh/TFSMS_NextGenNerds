using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace test6API.Migrations
{
    /// <inheritdoc />
    public partial class seventh : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GrowerId",
                table: "GrowerCreateAccounts");

            migrationBuilder.AddColumn<string>(
                name: "GrowerEmail",
                table: "GrowerCreateAccounts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GrowerEmail",
                table: "GrowerCreateAccounts");

            migrationBuilder.AddColumn<int>(
                name: "GrowerId",
                table: "GrowerCreateAccounts",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
