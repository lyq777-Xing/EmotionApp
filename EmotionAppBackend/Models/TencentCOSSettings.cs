namespace EmotionAppBackend.Models
{
    public class TencentCOSSettings
    {
        public string SecretId { get; set; } = string.Empty;
        public string SecretKey { get; set; } = string.Empty;
        public string Bucket { get; set; } = string.Empty;
        public string Region { get; set; } = string.Empty;
        public string AllowPrefix { get; set; } = string.Empty;
        public int CredentialDurationSeconds { get; set; } = 1800;
    }
}
