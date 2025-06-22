namespace EmotionAppBackend.Models
{
    public class TencentCOSSettings
    {
        public string SecretId { get; set; } = string.Empty;
        public string SecretKey { get; set; } = string.Empty;
        public string Bucket { get; set; } = string.Empty;
        public string Region { get; set; } = string.Empty;
        public string AllowPrefix { get; set; } = string.Empty;
        
        /// <summary>
        /// 临时密钥有效时间（秒）
        /// 推荐值：900-7200（15分钟-2小时）
        /// 默认值：1800（30分钟）
        /// </summary>
        public int CredentialDurationSeconds { get; set; } = 1800;
        
        /// <summary>
        /// 验证配置是否有效
        /// </summary>
        public bool IsValid()
        {
            return !string.IsNullOrEmpty(SecretId) &&
                   !string.IsNullOrEmpty(SecretKey) &&
                   !string.IsNullOrEmpty(Bucket) &&
                   !string.IsNullOrEmpty(Region) &&
                   CredentialDurationSeconds >= 900 &&  // 最少15分钟
                   CredentialDurationSeconds <= 7200;   // 最多2小时
        }
    }
}
