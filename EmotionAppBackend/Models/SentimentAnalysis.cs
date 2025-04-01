using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EmotionAppBackend.Models;

[Table("sentiment_analysis")]
public class SentimentAnalysis
{
    [Key]
    public int SentimentAnalysisId { get; set; }
    public int DiaryId { get; set; }
    public Diary Diary { get; set; }

    //情绪分类
    public String Sentiment { get; set; }

    //情绪强度评分
    public float SentimentScore { get; set; }

    public DateOnly AnalysisTime { get; set; }
    public int UserID { get; set; }
    public User User { get; set; }
}
