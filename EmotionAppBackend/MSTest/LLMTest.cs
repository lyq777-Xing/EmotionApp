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
            Instructions = "You are a helpful assistant.",
            Kernel = kernel,
        };

        await foreach (
            AgentResponseItem<ChatMessageContent> response in agent.InvokeAsync("你是谁？")
        )
        {
            Console.WriteLine(response.Message);
        }
    }
}
