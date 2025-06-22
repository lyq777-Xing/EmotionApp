using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EmotionAppBackend.Services;
using EmotionAppBackend.Models;

namespace EmotionAppBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly UploadService _uploadService;
        private readonly ILogger<UploadController> _logger;

        public UploadController(UploadService uploadService, ILogger<UploadController> logger)
        {
            _uploadService = uploadService;
            _logger = logger;
        }

        /// <summary>
        /// 获取腾讯云COS临时密钥
        /// </summary>
        /// <returns>临时密钥信息</returns>
        [HttpGet("credentials")]
        public async Task<ActionResult<TemporaryCredentialsDto>> GetTemporaryCredentials()
        {
            try
            {
                var credentials = await _uploadService.GetTemporaryCredentialsAsync();
                return Ok(credentials);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "获取临时密钥失败");
                return StatusCode(500, new { message = "获取临时密钥失败", error = ex.Message });
            }
        }

        /// <summary>
        /// 获取上传配置信息
        /// </summary>
        /// <returns>上传配置</returns>
        [HttpGet("config")]
        public async Task<ActionResult<UploadConfigDto>> GetUploadConfig()
        {
            try
            {
                var config = await _uploadService.GetUploadConfigAsync();
                return Ok(config);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "获取上传配置失败");
                return StatusCode(500, new { message = "获取上传配置失败", error = ex.Message });
            }
        }

        /// <summary>
        /// 上传图片文件
        /// </summary>
        /// <param name="file">图片文件</param>
        /// <returns>上传结果</returns>
        [HttpPost("image")]
        public async Task<ActionResult<FileUploadResultDto>> UploadImage(IFormFile file)
        {
            try
            {
                if (file == null)
                {
                    return BadRequest(new { message = "请选择要上传的图片文件" });
                }

                var result = await _uploadService.UploadFileAsync(file, "image");
                
                if (result.Success)
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "图片上传失败");
                return StatusCode(500, new { message = "图片上传失败", error = ex.Message });
            }
        }

        /// <summary>
        /// 上传视频文件
        /// </summary>
        /// <param name="file">视频文件</param>
        /// <returns>上传结果</returns>
        [HttpPost("video")]
        public async Task<ActionResult<FileUploadResultDto>> UploadVideo(IFormFile file)
        {
            try
            {
                if (file == null)
                {
                    return BadRequest(new { message = "请选择要上传的视频文件" });
                }

                var result = await _uploadService.UploadFileAsync(file, "video");
                
                if (result.Success)
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "视频上传失败");
                return StatusCode(500, new { message = "视频上传失败", error = ex.Message });
            }
        }

        /// <summary>
        /// 通用文件上传接口（自动检测文件类型）
        /// </summary>
        /// <param name="file">文件</param>
        /// <returns>上传结果</returns>
        [HttpPost("file")]
        public async Task<ActionResult<FileUploadResultDto>> UploadFile(IFormFile file)
        {
            try
            {
                if (file == null)
                {
                    return BadRequest(new { message = "请选择要上传的文件" });
                }

                var result = await _uploadService.UploadFileAsync(file, "auto");
                
                if (result.Success)
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "文件上传失败");
                return StatusCode(500, new { message = "文件上传失败", error = ex.Message });
            }
        }

        /// <summary>
        /// 批量上传文件
        /// </summary>
        /// <param name="files">文件列表</param>
        /// <returns>上传结果列表</returns>
        [HttpPost("batch")]
        public async Task<ActionResult<List<FileUploadResultDto>>> UploadFiles(List<IFormFile> files)
        {
            try
            {
                if (files == null || files.Count == 0)
                {
                    return BadRequest(new { message = "请选择要上传的文件" });
                }

                var results = new List<FileUploadResultDto>();
                
                foreach (var file in files)
                {
                    var result = await _uploadService.UploadFileAsync(file, "auto");
                    results.Add(result);
                }

                return Ok(results);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "批量文件上传失败");
                return StatusCode(500, new { message = "批量文件上传失败", error = ex.Message });
            }
        }

        /// <summary>
        /// 检查临时密钥状态
        /// </summary>
        /// <returns>密钥状态信息</returns>
        [HttpGet("credentials/status")]
        public async Task<ActionResult<object>> GetCredentialsStatus()
        {
            try
            {
                var credentials = await _uploadService.GetTemporaryCredentialsAsync();
                
                return Ok(new
                {
                    isExpired = credentials.IsExpired,
                    isNearExpiry = credentials.IsNearExpiry,
                    remainingMinutes = Math.Round(credentials.RemainingMinutes, 1),
                    totalDurationMinutes = Math.Round(credentials.TotalDurationMinutes, 1),
                    startTime = credentials.StartTime,
                    expiredTime = credentials.ExpiredTime,
                    status = credentials.IsExpired ? "已过期" : 
                             credentials.IsNearExpiry ? "即将过期" : "正常"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "检查临时密钥状态失败");
                return StatusCode(500, new { message = "检查临时密钥状态失败", error = ex.Message });
            }
        }
    }
}