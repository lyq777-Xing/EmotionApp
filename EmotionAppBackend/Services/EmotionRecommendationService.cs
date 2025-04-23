using EmotionAppBackend.Models;
using Microsoft.EntityFrameworkCore;

public class EmotionRecommendationService
{
    private readonly EmotionAppContext _context;

    public EmotionRecommendationService(EmotionAppContext context)
    {
        _context = context;
    }

    public List<EmotionKnowledge> GetRecommendations(string category, double intensity)
    {
        var recommendations = _context
            .EmotionKnowledgeBase.Where(e =>
                e.EmotionCategory == category && e.EmotionIntensity >= intensity
            )
            //.Select(e => new EmotionKnowledge
            //{
            //    EmotionCategory = e.EmotionCategory ?? "愉快", // Replace NULL with a default value
            //    EmotionIntensity = e.EmotionIntensity ?? 0.0, // Replace NULL with a default value
            //})
            .Take(3) // Limit the results
            .ToList();
        return recommendations;
    }
}
