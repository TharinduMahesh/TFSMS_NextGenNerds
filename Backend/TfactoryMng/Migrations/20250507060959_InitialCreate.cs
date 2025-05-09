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
                    rId = table.Column<int>(type: "int", nullable: false)
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
                    table.PrimaryKey("PK_RtLists", x => x.rId);
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

            migrationBuilder.CreateIndex(
                name: "IX_GrowerLocations_RtListId",
                table: "GrowerLocations",
                column: "RtListId");

            migrationBuilder.CreateIndex(
                name: "IX_RtLists_rName",
                table: "RtLists",
                column: "rName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GrowerLocations");

            migrationBuilder.DropTable(
                name: "RtLists");
        }
    }
}
