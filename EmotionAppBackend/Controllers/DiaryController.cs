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

    /**
     * 根据日记ID获取日记
     */
    [HttpGet("detail/{diaryId}")]
    public async Task<IActionResult> GetDiaryById(int diaryId)
    {
        if (diaryId <= 0)
        {
            return BadRequest("Invalid diary ID");
        }
        var diary = await _diaryService.GetDiaryById(diaryId);
        if (diary == null)
        {
            return NotFound(new { message = "Diary not found" });
        }
        return Ok(diary);
    }
}
