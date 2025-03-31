// 🌟 分类实体类
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("category")]
public class DiaryCategory
{
    [Key]
    public int CategoryID { get; set; }
    public string Name { get; set; }

    // 日记集合
    public List<Diary> Diaries { get; set; }
}
