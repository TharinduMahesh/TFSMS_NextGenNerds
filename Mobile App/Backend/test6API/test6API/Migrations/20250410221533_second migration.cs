using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace test6API.Migrations
{
    /// <inheritdoc />
    public partial class secondmigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Growers",
                table: "Growers");

            migrationBuilder.RenameTable(
                name: "Growers",
                newName: "GrowerSignUps");

            migrationBuilder.AddPrimaryKey(
                name: "PK_GrowerSignUps",
                table: "GrowerSignUps",
                column: "GrowerId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_GrowerSignUps",
                table: "GrowerSignUps");

            migrationBuilder.RenameTable(
                name: "GrowerSignUps",
                newName: "Growers");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Growers",
                table: "Growers",
                column: "GrowerId");
        }
    }
}
