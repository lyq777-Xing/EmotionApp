using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmotionAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class EditDiaryTags : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DiaryTag");

            migrationBuilder.CreateTable(
                name: "diary_tag",
                columns: table => new
                {
                    DiaryID = table.Column<int>(type: "int", nullable: false),
                    TagID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_diary_tag", x => new { x.DiaryID, x.TagID });
                    table.ForeignKey(
                        name: "FK_diary_tag_diary_DiaryID",
                        column: x => x.DiaryID,
                        principalTable: "diary",
                        principalColumn: "DiaryID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_diary_tag_tag_TagID",
                        column: x => x.TagID,
                        principalTable: "tag",
                        principalColumn: "TagID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4")
                .Annotation("Relational:Collation", "utf8mb4_0900_ai_ci");

            migrationBuilder.CreateIndex(
                name: "IX_diary_tag_TagID",
                table: "diary_tag",
                column: "TagID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "diary_tag");

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

            migrationBuilder.CreateIndex(
                name: "IX_DiaryTag_TagID",
                table: "DiaryTag",
                column: "TagID");
        }
    }
}
