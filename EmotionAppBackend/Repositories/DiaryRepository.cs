using EmotionAppBackend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

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

    /**
     * 根据用户ID获取日记
     */
    public async Task<List<DiaryDto>> GetDiariesByUserId(int userId)
    {
        var result = await (
            from diary in _context.Diaries
            join sa in _context.SentimentAnalys on diary.DiaryID equals sa.DiaryId into saGroup
            from sa in saGroup.DefaultIfEmpty() // left join
            where diary.UserID == userId && diary.IsDeleted == false
            select new DiaryDto
            {
                DiaryID = diary.DiaryID,
                Title = diary.Title,
                Content = diary.Content,
                CreatedAt = diary.CreatedAt,
                UpdatedAt = diary.UpdatedAt,
                DeletedAt = diary.DeletedAt,
                IsDeleted = diary.IsDeleted,
                CategoryID = diary.CategoryID,
                UserID = diary.UserID,
                Tag = diary.Tag,
                Permission = diary.Permission,
                sentiment = sa != null ? sa.Sentiment : null,
                sentimentScore = sa != null ? sa.SentimentScore : null,
            }
        ).ToListAsync();

        return result;
    }
}
