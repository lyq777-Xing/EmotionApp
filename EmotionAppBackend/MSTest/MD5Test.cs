using Microsoft.VisualStudio.TestTools.UnitTesting;

[TestClass]
public class MD5Test
{
    [TestMethod]
    public void Test()
    {
        var pwd = "123456".Md5String();
        Console.WriteLine("123456..." + pwd);
    }
}
