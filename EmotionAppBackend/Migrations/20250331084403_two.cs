using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmotionAppBackend.Migrations
{
    /// <inheritdoc />
    public partial class two : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Diaries_Categories_CategoryID",
                table: "Diaries");

            migrationBuilder.DropForeignKey(
                name: "FK_Diaries_users_UserID",
                table: "Diaries");

            migrationBuilder.DropForeignKey(
                name: "FK_DiaryTag_Diaries_DiaryID",
                table: "DiaryTag");

            migrationBuilder.DropForeignKey(
                name: "FK_DiaryTag_Tags_TagID",
                table: "DiaryTag");

            migrationBuilder.DropForeignKey(
                name: "FK_Tags_users_UserID",
                table: "Tags");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tags",
                table: "Tags");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Diaries",
                table: "Diaries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Categories",
                table: "Categories");

            migrationBuilder.RenameTable(
                name: "Tags",
                newName: "tag");

            migrationBuilder.RenameTable(
                name: "Diaries",
                newName: "diary");

            migrationBuilder.RenameTable(
                name: "Categories",
                newName: "category");

            migrationBuilder.RenameIndex(
                name: "IX_Tags_UserID",
                table: "tag",
                newName: "IX_tag_UserID");

            migrationBuilder.RenameIndex(
                name: "IX_Diaries_UserID",
                table: "diary",
                newName: "IX_diary_UserID");

            migrationBuilder.RenameIndex(
                name: "IX_Diaries_CategoryID",
                table: "diary",
                newName: "IX_diary_CategoryID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tag",
                table: "tag",
                column: "TagID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_diary",
                table: "diary",
                column: "DiaryID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_category",
                table: "category",
                column: "CategoryID");

            migrationBuilder.AddForeignKey(
                name: "FK_diary_category_CategoryID",
                table: "diary",
                column: "CategoryID",
                principalTable: "category",
                principalColumn: "CategoryID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_diary_users_UserID",
                table: "diary",
                column: "UserID",
                principalTable: "users",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DiaryTag_diary_DiaryID",
                table: "DiaryTag",
                column: "DiaryID",
                principalTable: "diary",
                principalColumn: "DiaryID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DiaryTag_tag_TagID",
                table: "DiaryTag",
                column: "TagID",
                principalTable: "tag",
                principalColumn: "TagID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_tag_users_UserID",
                table: "tag",
                column: "UserID",
                principalTable: "users",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_diary_category_CategoryID",
                table: "diary");

            migrationBuilder.DropForeignKey(
                name: "FK_diary_users_UserID",
                table: "diary");

            migrationBuilder.DropForeignKey(
                name: "FK_DiaryTag_diary_DiaryID",
                table: "DiaryTag");

            migrationBuilder.DropForeignKey(
                name: "FK_DiaryTag_tag_TagID",
                table: "DiaryTag");

            migrationBuilder.DropForeignKey(
                name: "FK_tag_users_UserID",
                table: "tag");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tag",
                table: "tag");

            migrationBuilder.DropPrimaryKey(
                name: "PK_diary",
                table: "diary");

            migrationBuilder.DropPrimaryKey(
                name: "PK_category",
                table: "category");

            migrationBuilder.RenameTable(
                name: "tag",
                newName: "Tags");

            migrationBuilder.RenameTable(
                name: "diary",
                newName: "Diaries");

            migrationBuilder.RenameTable(
                name: "category",
                newName: "Categories");

            migrationBuilder.RenameIndex(
                name: "IX_tag_UserID",
                table: "Tags",
                newName: "IX_Tags_UserID");

            migrationBuilder.RenameIndex(
                name: "IX_diary_UserID",
                table: "Diaries",
                newName: "IX_Diaries_UserID");

            migrationBuilder.RenameIndex(
                name: "IX_diary_CategoryID",
                table: "Diaries",
                newName: "IX_Diaries_CategoryID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tags",
                table: "Tags",
                column: "TagID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Diaries",
                table: "Diaries",
                column: "DiaryID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Categories",
                table: "Categories",
                column: "CategoryID");

            migrationBuilder.AddForeignKey(
                name: "FK_Diaries_Categories_CategoryID",
                table: "Diaries",
                column: "CategoryID",
                principalTable: "Categories",
                principalColumn: "CategoryID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Diaries_users_UserID",
                table: "Diaries",
                column: "UserID",
                principalTable: "users",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DiaryTag_Diaries_DiaryID",
                table: "DiaryTag",
                column: "DiaryID",
                principalTable: "Diaries",
                principalColumn: "DiaryID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DiaryTag_Tags_TagID",
                table: "DiaryTag",
                column: "TagID",
                principalTable: "Tags",
                principalColumn: "TagID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tags_users_UserID",
                table: "Tags",
                column: "UserID",
                principalTable: "users",
                principalColumn: "user_id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
