using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace test6API.Migrations
{
    /// <inheritdoc />
    public partial class third : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "GrowerAddress",
                table: "GrowerCreateAccounts",
                newName: "GrowerPostalCode");

            migrationBuilder.AlterColumn<DateTime>(
                name: "GrowerDOB",
                table: "GrowerCreateAccounts",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<string>(
                name: "GrowerAddressLine1",
                table: "GrowerCreateAccounts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GrowerAddressLine2",
                table: "GrowerCreateAccounts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GrowerCity",
                table: "GrowerCreateAccounts",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GrowerAddressLine1",
                table: "GrowerCreateAccounts");

            migrationBuilder.DropColumn(
                name: "GrowerAddressLine2",
                table: "GrowerCreateAccounts");

            migrationBuilder.DropColumn(
                name: "GrowerCity",
                table: "GrowerCreateAccounts");

            migrationBuilder.RenameColumn(
                name: "GrowerPostalCode",
                table: "GrowerCreateAccounts",
                newName: "GrowerAddress");

            migrationBuilder.AlterColumn<DateTime>(
                name: "GrowerDOB",
                table: "GrowerCreateAccounts",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);
        }
    }
}
