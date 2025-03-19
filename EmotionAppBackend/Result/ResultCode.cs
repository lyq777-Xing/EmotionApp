using System.ComponentModel;

public enum ResultCode
{
    [Description("请求成功")]
    Success = 1,
    [Description("请求失败")]
    Fail = 0,
    [Description("请求异常")]
    Error = -1
}