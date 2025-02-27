using Microsoft.AspNetCore.Mvc;
[ApiController]
[Route("/")]
public class HomeController : Controller
{
    // 处理 GET 请求，返回视图
    [HttpGet]
    [Route("test")]
    public async Task<Result> Test()
    {
        await Task.Delay(1010);
        return new Result(233);
    }
    public record Result(int value);
}