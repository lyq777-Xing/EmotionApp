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
}
