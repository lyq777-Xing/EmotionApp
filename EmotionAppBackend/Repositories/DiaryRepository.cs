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

    /**
     * 根据日记ID获取日记
     */
    public async Task<DiaryDto?> GetDiaryById(int diaryId)
    {
        var diary = await (
            from d in _context.Diaries
            join sa in _context.SentimentAnalys on d.DiaryID equals sa.DiaryId into saGroup
            from sa in saGroup.DefaultIfEmpty() // LEFT JOIN
            where d.DiaryID == diaryId && d.IsDeleted == false
            select new DiaryDto
            {
                DiaryID = d.DiaryID,
                Title = d.Title,
                Content = d.Content,
                CreatedAt = d.CreatedAt,
                UpdatedAt = d.UpdatedAt,
                DeletedAt = d.DeletedAt,
                IsDeleted = d.IsDeleted,
                CategoryID = d.CategoryID,
                UserID = d.UserID,
                Tag = d.Tag,
                Permission = d.Permission,

                sentiment = sa != null ? sa.Sentiment : null,
                sentimentScore = sa != null ? sa.SentimentScore : null,
                Abc = sa != null ? sa.ABC : null,
                Maslow = sa != null ? sa.Maslow : null,
            }
        ).FirstOrDefaultAsync();

        return diary;
    }
}
