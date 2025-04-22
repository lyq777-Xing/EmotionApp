using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EmotionAppBackend.Models;

[Table("sentiment_analysis")]
public partial class SentimentAnalysis
{
    [Key]
    public int SentimentAnalysisId { get; set; }
    public int DiaryId { get; set; }
    public Diary Diary { get; set; }

    //情绪分类 消极/积极
    public String Sentiment { get; set; }

    //情绪等级 0/1
    public int EmotionLevel { get; set; } // 如 1~5 代表强度

    //情绪强度评分 0-1
    public float SentimentScore { get; set; }

    //运用ABC理论的分析结果
    public String ABC { get; set; }

    //运用马斯洛需求理论的分析结果
    public String Maslow { get; set; }

    public DateTime AnalysisTime { get; set; }
    public int UserID { get; set; }
    public User User { get; set; }
}
