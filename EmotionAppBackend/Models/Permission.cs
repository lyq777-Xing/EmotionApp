using System;
using System.Collections.Generic;

namespace EmotionAppBackend.Models;

/// <summary>
/// 权限表，存储系统权限信息，支持权限层级关系
/// </summary>
public partial class Permission
{
    /// <summary>
    /// 权限唯一标识
    /// </summary>
    public int PermissionId { get; set; }

    /// <summary>
    /// 权限名称，唯一标识权限
    /// </summary>
    public string PermissionName { get; set; } = null!;

    /// <summary>
    /// 权限描述
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// 父权限ID，指向permissions表自身，用于权限层级关系
    /// </summary>
    public int? ParentId { get; set; }

    /// <summary>
    /// 权限创建时间
    /// </summary>
    public DateTime? CreatedAt { get; set; }

    /// <summary>
    /// 权限信息更新时间
    /// </summary>
    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Permission> InverseParent { get; set; } = new List<Permission>();

    public virtual Permission? Parent { get; set; }

    public virtual ICollection<Role> Roles { get; set; } = new List<Role>();
}
