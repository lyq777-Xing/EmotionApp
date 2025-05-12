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

    /**
     * ????
     */
    [HttpPost("add")]
    public async Task<IActionResult> AddDiary([FromBody] Diary diary)
    {
        if (diary == null)
        {
            return BadRequest("Diary cannot be null");
        }
        if (string.IsNullOrEmpty(diary.Title) || string.IsNullOrEmpty(diary.Content))
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

        await _diaryService.AddDiary(diary);
        return CreatedAtAction(nameof(GetDiaries), new { id = diary.DiaryID }, diary);
    }

    /**
     * 根据用户ID获取日记
     */
    [HttpGet("list")]
    public async Task<IActionResult> GetDiariesByUserId(int userId)
    {
        if (userId <= 0)
        {
            return BadRequest("Invalid user ID");
        }
        var diaries = await _diaryService.GetDiariesByUserId(userId);
        if (diaries == null || !diaries.Any())
        {
            return NotFound("No diaries found for this user");
        }
        return Ok(diaries);
    }
}
