using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddHomeownerEntityWithNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HomeownerName",
                table: "Properties");

            migrationBuilder.AddColumn<Guid>(
                name: "HomeownerId",
                table: "Properties",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Homeowners",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CompanyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Homeowners", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Homeowners_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Properties_HomeownerId",
                table: "Properties",
                column: "HomeownerId");

            migrationBuilder.CreateIndex(
                name: "IX_Homeowners_CompanyId",
                table: "Homeowners",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Properties_Homeowners_HomeownerId",
                table: "Properties",
                column: "HomeownerId",
                principalTable: "Homeowners",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Properties_Homeowners_HomeownerId",
                table: "Properties");

            migrationBuilder.DropTable(
                name: "Homeowners");

            migrationBuilder.DropIndex(
                name: "IX_Properties_HomeownerId",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "HomeownerId",
                table: "Properties");

            migrationBuilder.AddColumn<string>(
                name: "HomeownerName",
                table: "Properties",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");
        }
    }
}
