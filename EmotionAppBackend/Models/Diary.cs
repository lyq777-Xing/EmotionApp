using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EmotionAppBackend.Models;

/// <summary>
/// 🌟 日记实体类
/// </summary>
[Table("diary")] // 自定义表名 (可选)
public class Diary
{
    /// <summary>
    /// 日记唯一标识
    /// </summary>
    [Key]
    public int DiaryID { get; set; }

    /// <summary>
    /// 日记标题
    /// </summary>
    [MaxLength(255)]
    public string Title { get; set; }

    /// <summary>
    /// 日记内容
    /// </summary>
    [MaxLength(255)]
    public string Content { get; set; }

    /// <summary>
    /// 日记创建时间
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// 日记更新时间
    /// </summary>
    public DateTime? UpdatedAt { get; set; }

    /// <summary>
    /// 日记删除时间
    /// </summary>
    public DateTime? DeletedAt { get; set; }

    /// <summary>
    /// 日记删除标记
    /// </summary>
    public bool IsDeleted { get; set; } = false;

    // 分类与属性
    public int CategoryID { get; set; }

    public DiaryCategory Category { get; set; }

    // 用户
    public int UserID { get; set; }

    public User User { get; set; }

    // 情感分析
    //public int? SentimentAnalysisID { get; set; }

    //public SentimentAnalysis SentimentAnalysis { get; set; }

    // 多对多关系
    public List<Tag>? Tags { get; set; }

    // 日记权限
    public PermissionLevel Permission { get; set; }
}
