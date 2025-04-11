using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

/**
 * 情绪干预知识库
 */
[Table("emotion_knowledge_base")]
public class EmotionKnowledge
{
    [Key]
    public int Id { get; set; }
    public string EmotionCategory { get; set; }
    public int EmotionIntensity { get; set; }
    public string RecommendedAction { get; set; }
    public string PsychologicalBasis { get; set; }
    public string ContentType { get; set; }
    public string ContentUrl { get; set; }
    public string TargetNeeds { get; set; }
    public string Description { get; set; }
}
