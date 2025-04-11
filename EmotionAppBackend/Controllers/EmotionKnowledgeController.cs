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

    [HttpGet("recommend")]
    public IActionResult GetRecommendation(
        [FromQuery] string category,
        [FromQuery] int intensity,
        [FromQuery] string need
    )
    {
        var result = _recommendationService.GetRecommendations(category, intensity, need);
        return Ok(result);
    }
}
