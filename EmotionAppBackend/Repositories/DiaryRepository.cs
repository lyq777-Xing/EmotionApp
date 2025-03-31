using EmotionAppBackend.Models;
using Microsoft.EntityFrameworkCore;

public class DiaryRepository(EmotionAppContext _context)
{
    public async Task<List<Diary>> GetAllDiaries() => await _context.Diaries.ToListAsync();
}
