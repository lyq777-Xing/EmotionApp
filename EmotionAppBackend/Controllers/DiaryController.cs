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
}
