using Microsoft.VisualStudio.TestTools.UnitTesting;

[TestClass]
public class ResultJunit
{
    [TestMethod]
    public void ResultTest()
    {
        // 测试 ResultTool 的成功和失败方法
        var successResult = ResultTool.Success("success");
        // 调用 ToString 方法以确保没有异常
        Console.WriteLine("successResult..." + successResult.Data);
        var failResult = ResultTool.Fail(ResultCode.Error, "An error occurred.");
        Console.WriteLine("failResult..." + failResult.Msg);
    }
}