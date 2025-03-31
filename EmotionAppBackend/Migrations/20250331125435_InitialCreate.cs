using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmotionAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");
             
            migrationBuilder.CreateTable(
                name: "diary",
                columns: table => new
                {
                    DiaryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Title = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Content = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DeletedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    IsDeleted = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CategoryID = table.Column<int>(type: "int", nullable: false),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    Permission = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_diary", x => x.DiaryID);
                    table.ForeignKey(
                        name: "FK_diary_category_CategoryID",
                        column: x => x.CategoryID,
                        principalTable: "category",
                        principalColumn: "CategoryID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_diary_users_UserID",
                        column: x => x.UserID,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateTable(
                name: "tag",
                columns: table => new
                {
                    TagID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: false, collation: "utf8mb4_0900_ai_ci")
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Type = table.Column<int>(type: "int", nullable: false),
                    UserID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tag", x => x.TagID);
                    table.ForeignKey(
                        name: "FK_tag_users_UserID",
                        column: x => x.UserID,
                        principalTable: "users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");
             
            migrationBuilder.CreateTable(
                name: "DiaryTag",
                columns: table => new
                {
                    DiaryID = table.Column<int>(type: "int", nullable: false),
                    TagID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiaryTag", x => new { x.DiaryID, x.TagID });
                    table.ForeignKey(
                        name: "FK_DiaryTag_diary_DiaryID",
                        column: x => x.DiaryID,
                        principalTable: "diary",
                        principalColumn: "DiaryID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DiaryTag_tag_TagID",
                        column: x => x.TagID,
                        principalTable: "tag",
                        principalColumn: "TagID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            //migrationBuilder.CreateIndex(
            //    name: "IX_diary_CategoryID",
            //    table: "diary",
            //    column: "CategoryID");

            //migrationBuilder.CreateIndex(
            //    name: "IX_diary_UserID",
            //    table: "diary",
            //    column: "UserID");

            //migrationBuilder.CreateIndex(
            //    name: "IX_DiaryTag_TagID",
            //    table: "DiaryTag",
            //    column: "TagID");

            //migrationBuilder.CreateIndex(
            //    name: "parent_id",
            //    table: "permissions",
            //    column: "parent_id");

            //migrationBuilder.CreateIndex(
            //    name: "permission_name",
            //    table: "permissions",
            //    column: "permission_name",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "permission_id",
            //    table: "role_permissions",
            //    column: "permission_id");

            //migrationBuilder.CreateIndex(
            //    name: "role_name",
            //    table: "roles",
            //    column: "role_name",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "IX_tag_UserID",
            //    table: "tag",
            //    column: "UserID");

            //migrationBuilder.CreateIndex(
            //    name: "role_id",
            //    table: "user_roles",
            //    column: "role_id");

            //migrationBuilder.CreateIndex(
            //    name: "email",
            //    table: "users",
            //    column: "email",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "phone",
            //    table: "users",
            //    column: "phone",
            //    unique: true);

            //migrationBuilder.CreateIndex(
            //    name: "username",
            //    table: "users",
            //    column: "username",
            //    unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DropTable(
            //    name: "DiaryTag");

            //migrationBuilder.DropTable(
            //    name: "role_permissions");

            //migrationBuilder.DropTable(
            //    name: "user_roles");

            //migrationBuilder.DropTable(
            //    name: "diary");

            //migrationBuilder.DropTable(
            //    name: "tag");

            //migrationBuilder.DropTable(
            //    name: "permissions");

            //migrationBuilder.DropTable(
            //    name: "roles");

            //migrationBuilder.DropTable(
            //    name: "category");

            //migrationBuilder.DropTable(
            //    name: "users");
        }
    }
}
