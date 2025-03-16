using System;
using System.Collections.Generic;

namespace EmotionAppBackend.Models;

/// <summary>
/// 角色表，存储系统角色信息
/// </summary>
public partial class Role
{
    /// <summary>
    /// 角色唯一标识
    /// </summary>
    public int RoleId { get; set; }

    /// <summary>
    /// 角色名称，唯一标识角色
    /// </summary>
    public string RoleName { get; set; } = null!;

    /// <summary>
    /// 角色描述
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// 角色创建时间
    /// </summary>
    public DateTime? CreatedAt { get; set; }

    /// <summary>
    /// 角色信息更新时间
    /// </summary>
    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Permission> Permissions { get; set; } = new List<Permission>();

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
