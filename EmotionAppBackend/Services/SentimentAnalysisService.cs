using Newtonsoft.Json.Linq;

public class SentimentAnalysisService
{
    private readonly SentimentAnalysisRepository _sentimentAnalysisRepository;

    public SentimentAnalysisService(SentimentAnalysisRepository sentimentAnalysisRepository)
    {
        _sentimentAnalysisRepository = sentimentAnalysisRepository;
    }

    public async Task<List<EmotionTrend>> GetSentimentAnalysisChart(int userId)
    {
        // Call the repository to analyze sentiment
        return await _sentimentAnalysisRepository.GetSentimentAnalysisChart(userId);
    }

    public async Task<List<EmotionTrend>> GetSentimentAnalysisChartYear(int userId)
    {
        return await _sentimentAnalysisRepository.GetSentimentAnalysisChartYear(userId);
    }

    public async Task<List<EmotionTrend>> GetSentimentAnalysisChartMonth(int userId)
    {
        return await _sentimentAnalysisRepository.GetSentimentAnalysisChartMonth(userId);
    }

    public async Task<List<EmotionTrend>> GetSentimentAnalysisChartWeek(int userId)
    {
        return await _sentimentAnalysisRepository.GetSentimentAnalysisChartWeek(userId);
    }

    public async Task<EmotionDonut> GetSentimentAnalysisChartDonut(int userId)
    {
        return await _sentimentAnalysisRepository.GetSentimentAnalysisChartDonut(userId);
    }
}
