namespace EmotionAppBackend.Models
{
    public class TemporaryCredentialsDto
    {
        public string TmpSecretId { get; set; } = string.Empty;
        public string TmpSecretKey { get; set; } = string.Empty;
        public string SessionToken { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime ExpiredTime { get; set; }
        public string Bucket { get; set; } = string.Empty;
        public string Region { get; set; } = string.Empty;
    }

    public class UploadConfigDto
    {
        public TemporaryCredentialsDto Credentials { get; set; } = new();
        public string UploadPath { get; set; } = string.Empty;
        public List<string> AllowedImageFormats { get; set; } = new();
        public List<string> AllowedVideoFormats { get; set; } = new();
        public long MaxFileSize { get; set; }
    }

    public class FileUploadResultDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string FileType { get; set; } = string.Empty;
        public DateTime UploadTime { get; set; }
    }
}
