using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace test6API.Migrations
{
    /// <inheritdoc />
    public partial class initialMigraion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Growers",
                columns: table => new
                {
                    GrowerId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GrowerEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GrowerPassword = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Growers", x => x.GrowerId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Growers");
        }
    }
}
