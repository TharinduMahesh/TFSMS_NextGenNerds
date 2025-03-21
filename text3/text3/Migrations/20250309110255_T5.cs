using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace text3.Migrations
{
    /// <inheritdoc />
    public partial class T5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TransportName",
                table: "OTransports");

            migrationBuilder.AlterColumn<string>(
                name: "TransportType",
                table: "OTransports",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "TransportType",
                table: "OTransports",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TransportName",
                table: "OTransports",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
