using Microsoft.AspNetCore.Mvc;

[Route("api/analysis")]
[ApiController]
public class SentimentAnalysisController : ControllerBase
{
    private readonly SentimentAnalysisService _sentimentAnalysisService;

    public SentimentAnalysisController(SentimentAnalysisService sentimentAnalysisService)
    {
        _sentimentAnalysisService = sentimentAnalysisService;
    }

    //实现情绪强度分析图
    [HttpGet("chart/all")]
    public async Task<IActionResult> GetSentimentAnalysisChart(int userId)
    {
        var result = await _sentimentAnalysisService.GetSentimentAnalysisChart(userId);
        return Ok(result);
    }

    /**
     * 近一年的情绪强度分析图
     */
    [HttpGet("chart/year")]
    public async Task<IActionResult> GetSentimentAnalysisChartYear(int userId)
    {
        var result = await _sentimentAnalysisService.GetSentimentAnalysisChartYear(userId);
        return Ok(result);
    }

    /**
     * 最近一月的情绪强度分析图
     */

    [HttpGet("chart/month")]
    public async Task<IActionResult> GetSentimentAnalysisChartMonth(int userId)
    {
        var result = await _sentimentAnalysisService.GetSentimentAnalysisChartMonth(userId);
        return Ok(result);
    }

    /**
     * 近一周的情绪强度分析图
     */
    [HttpGet("chart/week")]
    public async Task<IActionResult> GetSentimentAnalysisChartWeek(int userId)
    {
        var result = await _sentimentAnalysisService.GetSentimentAnalysisChartWeek(userId);
        return Ok(result);
    }

    /**
     * 获取近一周的情绪正负向分析图
     */
    [HttpGet("chart/donut")]
    public async Task<IActionResult> GetSentimentAnalysisChartDonut(int userId)
    {
        var result = await _sentimentAnalysisService.GetSentimentAnalysisChartDonut(userId);
        return Ok(result);
    }
}
