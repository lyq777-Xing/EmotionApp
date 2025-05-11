using System;
using System.Collections.Generic;

namespace EmotionAppBackend.Models;

/// <summary>
/// 用户表，存储用户的基本信息
/// </summary>
public partial class User
{
    /// <summary>
    /// 用户唯一标识
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// 用户名，唯一标识用户
    /// </summary>
    public string Username { get; set; } = null!;

    /// <summary>
    /// 用户密码
    /// </summary>
    public string Password { get; set; } = null!;

    /// <summary>
    /// 用户头像
    /// </summary>
    public string? Img { get; set; }

    /// <summary>
    /// 用户邮箱，唯一标识用户
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// 用户手机号，唯一标识用户
    /// </summary>
    public string? Phone { get; set; }

    /// <summary>
    /// 用户创建时间
    /// </summary>
    public DateTime? CreatedAt { get; set; }

    /// <summary>
    /// 用户信息更新时间
    /// </summary>
    public DateTime? UpdatedAt { get; set; }

    // 日记集合
    public List<Diary>? Diaries { get; set; }

    //public List<Tag> Tags { get; set; }

    public virtual ICollection<Role> Roles { get; set; } = new List<Role>();

    public List<SentimentAnalysis>? SentimentAnalysis { get; set; }
}
