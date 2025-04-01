using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/diary")]
[ApiController]
public class DiaryController : ControllerBase
{
    private readonly DiaryService _diaryService;

    public DiaryController(DiaryService diaryService)
    {
        _diaryService = diaryService;
    }

    //[Authorize]
    [HttpGet]
    public async Task<IActionResult> GetDiaries()
    {
        var diaries = await _diaryService.GetDiaries();
        return Ok(diaries);
    }

    //[HttpPost]
    //public async Task<IActionResult> CreateDiary([FromBody] Diary diary)
    //{
    //    await _diaryService.AddDiary(diary);
    //    return CreatedAtAction(nameof(GetDiaries), new { id = diary.DiaryId }, diary);
    //}
}
