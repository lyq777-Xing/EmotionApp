using System.Net.Mail;
using COSSTS;
using COSXML;
using COSXML.Auth;
using COSXML.Model.Object;
using Microsoft.Extensions.Options;
using EmotionAppBackend.Models;
using Newtonsoft.Json.Linq;

namespace EmotionAppBackend.Services
{
    public class UploadService
    {
        private readonly TencentCOSSettings _cosSettings;
        private readonly ILogger<UploadService> _logger;

        // 支持的图片格式
        private readonly HashSet<string> _allowedImageFormats = new(StringComparer.OrdinalIgnoreCase)
        {
            ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp", ".tiff", ".ico"
        };

        // 支持的视频格式
        private readonly HashSet<string> _allowedVideoFormats = new(StringComparer.OrdinalIgnoreCase)
        {
            ".mp4", ".avi", ".mov", ".wmv", ".flv", ".mkv", ".webm", ".m4v", ".3gp", ".ts"
        };        // 最大文件大小 (100MB for images, 500MB for videos)
        private const long MaxImageSize = 100 * 1024 * 1024; // 100MB
        private const long MaxVideoSize = 500 * 1024 * 1024; // 500MB

        public UploadService(IOptions<TencentCOSSettings> cosSettings, ILogger<UploadService> logger)
        {
            _cosSettings = cosSettings.Value;
            _logger = logger;
            
            // 验证配置有效性
            if (!_cosSettings.IsValid())
            {
                var errorMessage = "腾讯云COS配置无效：请检查SecretId、SecretKey、Bucket、Region是否正确，" +
                                 $"以及CredentialDurationSeconds是否在900-7200秒范围内（当前值：{_cosSettings.CredentialDurationSeconds}）";
                _logger.LogError(errorMessage);
                throw new ArgumentException(errorMessage);
            }
            
            _logger.LogInformation("腾讯云COS配置已加载 - Bucket: {Bucket}, Region: {Region}, 密钥有效期: {Duration}秒", 
                _cosSettings.Bucket, _cosSettings.Region, _cosSettings.CredentialDurationSeconds);
        }

        /// <summary>
        /// 获取腾讯云COS临时密钥
        /// </summary>
        /// <returns>临时密钥信息</returns>
        public async Task<TemporaryCredentialsDto> GetTemporaryCredentialsAsync()
        {
            try
            {
                // 允许的操作权限
                string[] allowActions = new string[]
                {
                    "name/cos:PutObject",
                    "name/cos:PostObject",
                    "name/cos:InitiateMultipartUpload",
                    "name/cos:ListMultipartUploads",
                    "name/cos:ListParts",
                    "name/cos:UploadPart",
                    "name/cos:CompleteMultipartUpload",
                };

                // 设置参数
                Dictionary<string, object> values = new Dictionary<string, object>
                {
                    ["bucket"] = _cosSettings.Bucket,
                    ["region"] = _cosSettings.Region,
                    ["allowPrefix"] = _cosSettings.AllowPrefix,
                    ["allowActions"] = allowActions,
                    ["durationSeconds"] = _cosSettings.CredentialDurationSeconds,
                    ["secretId"] = _cosSettings.SecretId,
                    ["secretKey"] = _cosSettings.SecretKey
                };                // 获取临时密钥
                Dictionary<string, object> credential = STSClient.genCredential(values);

                var credentials = credential["Credentials"] as JObject;
                
                // 安全地获取时间戳，处理可能的类型转换问题
                var startTimeValue = credential["StartTime"];
                var expiredTimeValue = credential["ExpiredTime"];
                
                long startTimeStamp, expiredTimeStamp;
                
                // 更简洁的类型转换处理
                try
                {
                    startTimeStamp = Convert.ToInt64(startTimeValue);
                    expiredTimeStamp = Convert.ToInt64(expiredTimeValue);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "时间戳转换失败 - StartTime: {StartTime}, ExpiredTime: {ExpiredTime}", 
                        startTimeValue, expiredTimeValue);
                    throw new Exception("临时密钥时间戳解析失败", ex);
                }
                
                // 使用UTC时间避免时区问题，然后转换为本地时间
                var startTimeUtc = DateTimeOffset.FromUnixTimeSeconds(startTimeStamp).UtcDateTime;
                var expiredTimeUtc = DateTimeOffset.FromUnixTimeSeconds(expiredTimeStamp).UtcDateTime;
                var startTime = startTimeUtc.ToLocalTime();
                var expiredTime = expiredTimeUtc.ToLocalTime();
                
                // 验证时间有效性
                if (expiredTime <= startTime)
                {
                    _logger.LogError("临时密钥时间配置异常 - 开始时间: {StartTime}, 过期时间: {ExpiredTime}", 
                        startTime, expiredTime);
                    throw new Exception("临时密钥时间配置异常：过期时间必须大于开始时间");
                }
                
                if (expiredTime <= DateTime.Now)
                {
                    _logger.LogError("临时密钥已过期 - 当前时间: {Now}, 过期时间: {ExpiredTime}", 
                        DateTime.Now, expiredTime);
                    throw new Exception("获取的临时密钥已过期");
                }                var result = new TemporaryCredentialsDto
                {
                    TmpSecretId = credentials["TmpSecretId"].ToString(),
                    TmpSecretKey = credentials["TmpSecretKey"].ToString(),
                    SessionToken = credentials["Token"].ToString(),
                    StartTime = startTime,
                    ExpiredTime = expiredTime,
                    Bucket = _cosSettings.Bucket,
                    Region = _cosSettings.Region
                };

                var duration = expiredTime - startTime;
                _logger.LogInformation("临时密钥获取成功 - 开始时间: {StartTime}, 过期时间: {ExpiredTime}, 有效时长: {Duration}分钟", 
                    startTime, expiredTime, Math.Round(duration.TotalMinutes, 1));
                    
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "获取临时密钥失败");
                throw new Exception("获取临时密钥失败", ex);
            }
        }

        /// <summary>
        /// 获取上传配置信息
        /// </summary>
        /// <returns>上传配置</returns>
        public async Task<UploadConfigDto> GetUploadConfigAsync()
        {
            var credentials = await GetTemporaryCredentialsAsync();
            
            return new UploadConfigDto
            {
                Credentials = credentials,
                UploadPath = GenerateUploadPath(),
                AllowedImageFormats = _allowedImageFormats.ToList(),
                AllowedVideoFormats = _allowedVideoFormats.ToList(),
                MaxFileSize = MaxVideoSize // 返回最大的限制
            };
        }

        /// <summary>
        /// 上传文件到腾讯云COS
        /// </summary>
        /// <param name="file">文件</param>
        /// <param name="fileType">文件类型 (image/video)</param>
        /// <returns>上传结果</returns>
        public async Task<FileUploadResultDto> UploadFileAsync(IFormFile file, string fileType = "auto")
        {
            try
            {
                // 验证文件
                var validationResult = ValidateFile(file, fileType);
                if (!validationResult.isValid)
                {
                    return new FileUploadResultDto
                    {
                        Success = false,
                        Message = validationResult.errorMessage
                    };
                }

                // 获取临时密钥
                var credentials = await GetTemporaryCredentialsAsync();

                // 初始化COS客户端
                var cosXml = InitializeCosClient(credentials);

                // 生成文件路径
                var fileExtension = Path.GetExtension(file.FileName).ToLower();
                var detectedFileType = DetectFileType(fileExtension);
                var uploadPath = GenerateUploadPath(detectedFileType);
                var fileName = $"{Guid.NewGuid()}{fileExtension}";
                var objectKey = $"{uploadPath}/{fileName}";

                // 上传文件
                using var stream = file.OpenReadStream();
                var uploadResult = await UploadStreamToCosAsync(cosXml, objectKey, stream);

                if (uploadResult.success)
                {
                    var fileUrl = $"https://{_cosSettings.Bucket}.cos.{_cosSettings.Region}.myqcloud.com/{objectKey}";
                    
                    return new FileUploadResultDto
                    {
                        Success = true,
                        Message = "文件上传成功",
                        FileUrl = fileUrl,
                        FileName = fileName,
                        FileSize = file.Length,
                        FileType = detectedFileType,
                        UploadTime = DateTime.Now
                    };
                }
                else
                {
                    return new FileUploadResultDto
                    {
                        Success = false,
                        Message = uploadResult.errorMessage
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "文件上传失败: {FileName}", file.FileName);
                return new FileUploadResultDto
                {
                    Success = false,
                    Message = $"文件上传失败: {ex.Message}"
                };
            }
        }

        /// <summary>
        /// 验证文件
        /// </summary>
        private (bool isValid, string errorMessage) ValidateFile(IFormFile file, string fileType)
        {
            if (file == null || file.Length == 0)
            {
                return (false, "文件不能为空");
            }

            var extension = Path.GetExtension(file.FileName).ToLower();
            var detectedType = DetectFileType(extension);

            // 如果指定了文件类型，验证是否匹配
            if (fileType != "auto" && fileType != detectedType)
            {
                return (false, $"文件类型不匹配，期望: {fileType}, 实际: {detectedType}");
            }

            // 验证文件格式
            if (detectedType == "image" && !_allowedImageFormats.Contains(extension))
            {
                return (false, $"不支持的图片格式: {extension}");
            }
            
            if (detectedType == "video" && !_allowedVideoFormats.Contains(extension))
            {
                return (false, $"不支持的视频格式: {extension}");
            }

            if (detectedType == "unknown")
            {
                return (false, $"不支持的文件格式: {extension}");
            }

            // 验证文件大小
            var maxSize = detectedType == "image" ? MaxImageSize : MaxVideoSize;
            if (file.Length > maxSize)
            {
                var maxSizeMB = maxSize / (1024 * 1024);
                return (false, $"文件大小超过限制，最大允许: {maxSizeMB}MB");
            }

            return (true, string.Empty);
        }

        /// <summary>
        /// 根据文件扩展名检测文件类型
        /// </summary>
        private string DetectFileType(string extension)
        {
            if (_allowedImageFormats.Contains(extension))
                return "image";
            
            if (_allowedVideoFormats.Contains(extension))
                return "video";
            
            return "unknown";
        }

        /// <summary>
        /// 生成上传路径 (按年月分文件夹)
        /// </summary>
        private string GenerateUploadPath(string fileType = "")
        {
            var now = DateTime.Now;
            var basePath = "emotion_app";
            var datePath = $"{now.Year}/{now.Month}/{now.Day}";
            
            if (!string.IsNullOrEmpty(fileType))
            {
                return $"{basePath}/{datePath}/{fileType}";
            }
            
            return $"{basePath}/{datePath}";
        }

        /// <summary>
        /// 初始化COS客户端
        /// </summary>
        private CosXmlServer InitializeCosClient(TemporaryCredentialsDto credentials)
        {
            var config = new CosXmlConfig.Builder().SetRegion(_cosSettings.Region).Build();
            
            var startTime = new DateTimeOffset(credentials.StartTime).ToUnixTimeSeconds();
            var endTime = new DateTimeOffset(credentials.ExpiredTime).ToUnixTimeSeconds();
            
            var credentialProvider = new DefaultSessionQCloudCredentialProvider(
                credentials.TmpSecretId,
                credentials.TmpSecretKey,
                startTime,
                endTime,
                credentials.SessionToken
            );
            
            return new CosXmlServer(config, credentialProvider);
        }

        /// <summary>
        /// 上传流到COS
        /// </summary>
        private async Task<(bool success, string errorMessage)> UploadStreamToCosAsync(CosXmlServer cosXml, string objectKey, Stream stream)
        {
            try
            {
                var request = new PutObjectRequest(_cosSettings.Bucket, objectKey, stream);
                
                // 设置进度回调
                request.SetCosProgressCallback((completed, total) =>
                {
                    var progress = completed * 100.0 / total;
                    _logger.LogInformation("上传进度: {Progress:F2}%", progress);
                });

                var result = cosXml.PutObject(request);
                
                _logger.LogInformation("文件上传成功: {ObjectKey}, ETag: {ETag}", objectKey, result.eTag);
                return (true, string.Empty);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "上传文件到COS失败: {ObjectKey}", objectKey);
                return (false, ex.Message);
            }
        }
    }
}
