using EmotionAppBackend.Models;
using Microsoft.EntityFrameworkCore;

public class EmotionKnowledgeRepository(EmotionAppContext _context)
{
    /**
     * 查询所有知识库内容
     */
    public async Task<List<EmotionKnowledge>> GetAllKnowledge() =>
        await _context.EmotionKnowledgeBase.ToListAsync();
}
