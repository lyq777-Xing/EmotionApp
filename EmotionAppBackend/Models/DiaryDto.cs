using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EmotionAppBackend.Models;

public class DiaryDto
{
    public int categoryId { get; set; }
    public string tag { get; set; }
    public string title { get; set; }
    public string content { get; set; }
    public int permission { get; set; }

    public int userId { get; set; }
}
