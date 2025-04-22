using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/diary")]
[ApiController]
public class DiaryController : ControllerBase
{
    private readonly DiaryService _diaryService;

    //private readonly TagService _tagService; // Added missing dependency

    public DiaryController(DiaryService diaryService) // Updated constructor
    {
        _diaryService = diaryService;
        //_tagService = tagService; // Initialize the missing dependency
    }

    //[Authorize]
    [HttpGet]
    public async Task<IActionResult> GetDiaries()
    {
        var diaries = await _diaryService.GetDiaries();
        return Ok(diaries);
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddDiary([FromBody] DiaryDto diaryDto)
    {
        if (diaryDto == null)
        {
            return BadRequest("Diary cannot be null");
        }
        if (string.IsNullOrEmpty(diaryDto.title) || string.IsNullOrEmpty(diaryDto.content))
        {
            return BadRequest("Title and Content are required");
        }

        //var tags = diaryDto.tag.Split(",");
        //foreach (var tag in tags)
        //{
        //    Tag t = new Tag();
        //    t.Name = tag;
        //    t.Type = 0;
        //    t.UserID = diaryDto.userId;
        //    await _tagService.AddTag(t);

        //}

        var diary = new Diary
        {
            Title = diaryDto.title,
            Content = diaryDto.content,
            CreatedAt = DateTime.Now,
            CategoryID = diaryDto.categoryId,
            UserID = diaryDto.userId,
            Tag = diaryDto.tag,
            //Tags = tags.Select(t => new Tag { Name = t, Type = 0, UserID = diaryDto.userId }).ToList()
        };
        await _diaryService.AddDiary(diary);
        return CreatedAtAction(nameof(GetDiaries), new { id = diary.DiaryID }, diary);
    }
}
