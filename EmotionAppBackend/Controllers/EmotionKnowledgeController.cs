using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
//[controller] 是一个占位符，表示当前控制器的名称（去掉后缀 Controller）。
public class EmotionKnowledgeController : ControllerBase
{
    private readonly EmotionRecommendationService _recommendationService;

    public EmotionKnowledgeController(EmotionRecommendationService recommendationService)
    {
        _recommendationService = recommendationService;
    }

    //GET /api/EmotionKnowledge/recommend? category = happiness & intensity = 5 & need = relaxation
    [HttpGet("recommend")]
    public IActionResult GetRecommendation(
        [FromQuery] string category,
        [FromQuery] double intensity
    )
    {
        var result = _recommendationService.GetRecommendations(category, intensity);
        return Ok(result);
    }

    /**
     * 获取所有知识库内容
     */
    [HttpGet("list")]
    public async Task<IActionResult> GetList()
    {
        var result = await _recommendationService.GetAllKnowledge();
        return Ok(result);
    }
}
