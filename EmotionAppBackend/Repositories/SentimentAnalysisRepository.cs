using EmotionAppBackend.Models;
using Microsoft.EntityFrameworkCore;

public class SentimentAnalysisRepository(EmotionAppContext _dbContext)
{
    public async Task<List<EmotionTrend>> GetSentimentAnalysisChart(int userId)
    {
        var res = await _dbContext
            .SentimentAnalys.Where(an => an.UserID == userId)
            .Select(an => new
            {
                date = an.AnalysisTime.ToString("yyyy-MM-dd"),
                intensity = an.SentimentScore,
            })
            .ToListAsync();
        var result = new List<EmotionTrend>();
        foreach (var item in res)
        {
            var date = DateTime.Parse(item.date);
            var trend = new EmotionTrend { Date = date.ToString(), Intensity = item.intensity };
            result.Add(trend);
        }
        return result;
    }
}
