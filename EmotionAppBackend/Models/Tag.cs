//// 🌟 标签实体类
//using System.ComponentModel.DataAnnotations;
//using System.ComponentModel.DataAnnotations.Schema;
//using EmotionAppBackend.Models;

//[Table("tag")]
//public class Tag
//{
//    [Key]
//    public int TagID { get; set; }
//    public string Name { get; set; }

//    //0为系统标签，1为用户自定义标签
//    public TagType Type { get; set; } // 系统标签、用户自定义标签

//    // 创建者
//    public int UserID { get; set; }
//    public User User { get; set; }

//    // 多对多关系

//    [InverseProperty("Tags")]
//    public List<Diary> Diaries { get; set; }
//}
