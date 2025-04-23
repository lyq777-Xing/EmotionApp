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

    [Column("emotion_category")]
    public string? EmotionCategory { get; set; }

    [Column("emotion_intensity")]
    public double? EmotionIntensity { get; set; }

    [Column("recommended_action")]
    public string RecommendedAction { get; set; }

    [Column("psychological_basis")]
    public string PsychologicalBasis { get; set; }

    [Column("content_type")]
    public string ContentType { get; set; }

    [Column("content_url")]
    public string? ContentUrl { get; set; }

    [Column("target_needs")]
    public string TargetNeeds { get; set; }

    [Column("description")]
    public string Description { get; set; }
}
