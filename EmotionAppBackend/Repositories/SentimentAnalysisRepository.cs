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
        return (
            from item in res
            let date = DateTime.Parse(item.date)
            select new EmotionTrend { Date = date.ToString(), Intensity = item.intensity }
        ).ToList();
    }

    public async Task<List<EmotionTrend>> GetSentimentAnalysisChartYear(int userId)
    {
        var oneYearAgo = DateTime.Now.AddYears(-1); // 当前时间往前推一年

        var res = await _dbContext
            .SentimentAnalys.Where(an => (an.UserID == userId && an.AnalysisTime >= oneYearAgo))
            .OrderBy(an => an.AnalysisTime) // ✅ 按时间升序排序
            .Select(an => new
            {
                date = an.AnalysisTime.ToString("yyyy-MM-dd"),
                intensity = an.SentimentScore,
            })
            .ToListAsync();

        return (
            from item in res
            let date = DateTime.Parse(item.date)
            select new EmotionTrend
            {
                Date = date.ToString("yyyy-MM-dd"),
                Intensity = item.intensity,
            }
        ).ToList();
    }

    public async Task<List<EmotionTrend>> GetSentimentAnalysisChartMonth(int userId)
    {
        var oneMonthAgo = DateTime.Now.AddMonths(-1); // 当前时间往前推一个月
        var res = await _dbContext
            .SentimentAnalys.Where(an => (an.UserID == userId && an.AnalysisTime >= oneMonthAgo))
            .OrderBy(an => an.AnalysisTime) // ✅ 按时间升序排序
            .Select(an => new
            {
                date = an.AnalysisTime.ToString("yyyy-MM-dd"),
                intensity = an.SentimentScore,
            })
            .ToListAsync();
        return (
            from item in res
            let date = DateTime.Parse(item.date)
            select new EmotionTrend
            {
                Date = date.ToString("yyyy-MM-dd"),
                Intensity = item.intensity,
            }
        ).ToList();
    }

    public async Task<List<EmotionTrend>> GetSentimentAnalysisChartWeek(int userId)
    {
        var oneWeekAgo = DateTime.Now.AddDays(-7); // 当前时间往前推一周
        var res = await _dbContext
            .SentimentAnalys.Where(an => (an.UserID == userId && an.AnalysisTime >= oneWeekAgo))
            .OrderBy(an => an.AnalysisTime) // ✅ 按时间升序排序
            .Select(an => new
            {
                date = an.AnalysisTime.ToString("yyyy-MM-dd"),
                intensity = an.SentimentScore,
            })
            .ToListAsync();
        return (
            from item in res
            let date = DateTime.Parse(item.date)
            select new EmotionTrend
            {
                Date = date.ToString("yyyy-MM-dd"),
                Intensity = item.intensity,
            }
        ).ToList();
    }

    public async Task<EmotionDonut> GetSentimentAnalysisChartDonut(int userId)
    {
        var oneWeekAgo = DateTime.Now.AddDays(-7); // 当前时间往前推一周
        var res = await _dbContext
            .SentimentAnalys.Where(an => (an.UserID == userId && an.AnalysisTime >= oneWeekAgo))
            .OrderBy(an => an.AnalysisTime) // ✅ 按时间升序排序
            .Select(an => new
            {
                date = an.AnalysisTime.ToString("yyyy-MM-dd"),
                emotionLevel = an.EmotionLevel,
            })
            .ToListAsync();
        EmotionDonut emotionDonut = new EmotionDonut();
        emotionDonut.happy = 0;
        emotionDonut.sad = 0;
        foreach (var re in res)
        {
            if (re.emotionLevel == 0)
            {
                emotionDonut.sad++;
            }
            else if (re.emotionLevel == 1)
            {
                emotionDonut.happy++;
            }
        }
        return emotionDonut;
    }
}
