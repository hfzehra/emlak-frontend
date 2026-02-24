﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePropertyWithNewFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Properties");

            migrationBuilder.RenameColumn(
                name: "Title",
                table: "Properties",
                newName: "TenantName");

            migrationBuilder.AddColumn<string>(
                name: "HomeownerName",
                table: "Properties",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PropertyNumber",
                table: "Properties",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "RentDate",
                table: "Properties",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            // Mevcut kayıtlar için unique PropertyNumber değerleri oluştur
            migrationBuilder.Sql(@"
                UPDATE Properties 
                SET PropertyNumber = 'EMK-' + CAST(NEWID() AS NVARCHAR(36)),
                    HomeownerName = ISNULL(TenantName, 'Belirtilmemiş'),
                    TenantName = ISNULL(TenantName, 'Belirtilmemiş'),
                    RentDate = GETDATE()
                WHERE PropertyNumber = '' OR PropertyNumber IS NULL
            ");

            migrationBuilder.CreateIndex(
                name: "IX_Properties_PropertyNumber",
                table: "Properties",
                column: "PropertyNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Properties_PropertyNumber",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "HomeownerName",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "PropertyNumber",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "RentDate",
                table: "Properties");

            migrationBuilder.RenameColumn(
                name: "TenantName",
                table: "Properties",
                newName: "Title");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
