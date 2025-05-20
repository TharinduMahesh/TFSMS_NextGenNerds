using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TfactoryMng.Migrations
{
    /// <inheritdoc />
    public partial class FixYieldListRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
                name: "IX_YieldLists_rId",
                table: "YieldLists",
                column: "rId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "YieldLists");
        }
    }
}
