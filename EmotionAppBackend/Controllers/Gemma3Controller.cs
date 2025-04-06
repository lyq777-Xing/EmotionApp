using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[Route("api/gemma3")]
[ApiController]
public class Gemma3Controller : ControllerBase
{
    //[Authorize]
    [HttpGet]
    public async Task<IActionResult> getLLMResult(string theory, string context)
    {
        var gemma3Utils = new Gemma3Utils();
        var res = await gemma3Utils.gemma3Ollama(theory, context);
        return Ok(res);
    }
}
