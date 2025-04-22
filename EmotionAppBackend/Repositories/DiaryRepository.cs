using EmotionAppBackend.Models;
using Microsoft.EntityFrameworkCore;

public class DiaryRepository(EmotionAppContext _context)
{
    public async Task<List<Diary>> GetAllDiaries() => await _context.Diaries.ToListAsync();

    /**
     * 添加日记
     */
    public async Task AddDiary(Diary diary)
    {
        if (diary == null)
        {
            throw new ArgumentNullException(nameof(diary), "Diary cannot be null");
        }
        diary.CreatedAt = DateTime.Now;
        await _context.Diaries.AddAsync(diary);
        await _context.SaveChangesAsync();
    }
}
