using System.Security.Cryptography;
using System.Text;

public static class MD5Utils
{
    /**
    * string类扩展方法 计算md5
    */
    public static string Md5String(this string input)
    {
        if (string.IsNullOrEmpty(input))
            return string.Empty;

        using MD5 md5 = MD5.Create();
        byte[] inputBytes = Encoding.UTF8.GetBytes(input);
        byte[] hashBytes = md5.ComputeHash(inputBytes);

        StringBuilder sb = new StringBuilder();
        foreach (byte b in hashBytes)
        {
            sb.Append(b.ToString("x2")); // 转换为16进制字符串
        }

        return sb.ToString();
    }
}
