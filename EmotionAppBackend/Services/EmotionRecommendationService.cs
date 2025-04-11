using EmotionAppBackend.Models;
using Microsoft.EntityFrameworkCore;

public class EmotionRecommendationService
{
    private readonly EmotionAppContext _context;

    public EmotionRecommendationService(EmotionAppContext context)
    {
        _context = context;
    }

    public List<EmotionKnowledge> GetRecommendations(string category, int intensity, string need)
    {
        return _context
            .EmotionKnowledgeBase.Where(e =>
                e.EmotionCategory == category
                && e.EmotionIntensity >= intensity
                && e.TargetNeeds == need
            )
            .Take(3) // 限制返回数量
            .ToList();
    }
}
