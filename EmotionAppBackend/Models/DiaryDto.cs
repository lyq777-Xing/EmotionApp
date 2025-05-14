using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EmotionAppBackend.Models;

// Fixed the syntax error by replacing 'extends' with 'inherits' keyword in C# which is ' : '.
public class DiaryDto : Diary
{
    public string? sentiment { get; set; }

    public double? sentimentScore { get; set; }

    public string? Abc { get; set; }

    public string? Maslow { get; set; }
}
