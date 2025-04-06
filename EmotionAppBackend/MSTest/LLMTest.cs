using System.ClientModel;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Agents;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenAI;

[TestClass]
public class LLMTest
{
    [TestMethod]
    public async Task TestOllama()
    {
        var builder = Kernel.CreateBuilder();
        var url = new Uri("http://127.0.0.1:11434/api");
        //builder.AddOpenAIChatCompletion(
        //    "gemma3",
        //    new OpenAIClient(new ApiKeyCredential("?"), new OpenAIClientOptions { Endpoint = url })
        //);
#pragma warning disable SKEXP0070 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
        builder.AddOllamaChatCompletion(
            modelId: "gemma3",
            endpoint: new Uri("http://localhost:11434")
        );
#pragma warning restore SKEXP0070 // Type is for evaluation purposes only and is subject to change or removal in future updates. Suppress this diagnostic to proceed.
        var kernel = builder.Build();

        ChatCompletionAgent agent = new()
        {
            Name = "ai",
            Instructions =
                "你非常擅长心理学相关知识，请运用马斯洛需求层次理论，通过识别用户的情绪追溯到具体的未满足需求，判断用户的需求层次。输出结构如下：\n\n"
                + "1. 识别情绪：列出文本中的主要情绪\n"
                + "2. 未满足的需求：结合语境分析该情绪可能对应的需求缺失\n"
                + "3. 需求层次判断：按照马斯洛的五个层次分类（生理、安全、归属、尊重、自我实现）指出属于哪一类\n\n"
                + "请用简洁明了的语言输出，并避免重复或过度推测。",
            Kernel = kernel,
        };

        await foreach (
            AgentResponseItem<ChatMessageContent> response in agent.InvokeAsync(
                "今天很开心，能够出去玩"
            )
        )
        {
            Console.WriteLine(response.Message);
        }
    }
}
