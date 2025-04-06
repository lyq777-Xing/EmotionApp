using Azure;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Agents;

public class Gemma3Utils
{
    readonly string MASLOW_IS_HIERARCHY_OF_NEEDS_INSTRUCTIONS =
        "你非常擅长心理学相关知识，请运用马斯洛需求层次理论，通过识别用户的情绪追溯到具体的未满足需求，判断用户的需求层次。输出结构如下：\n\n"
        + "1. 识别情绪：列出文本中的主要情绪\n"
        + "2. 未满足的需求：结合语境分析该情绪可能对应的需求缺失\n"
        + "3. 需求层次判断：按照马斯洛的五个层次分类（生理、安全、归属、尊重、自我实现）指出属于哪一类\n"
        + "4. 干预建议：结合用户需求层次，给出合理的建议帮助用户满足需求\n\n"
        + "请用简洁明了的语言输出，并避免重复或过度推测。";
    readonly string ABC_INSTRUCTIONS =
        "你是心理学专家，擅长使用理性情绪行为疗法（REBT）中的 ABC 理论，帮助用户认识情绪背后的非理性信念结构。"
        + "请根据用户表达的情绪或事件，识别并输出以下内容：\n\n"
        + "1. A（Activating Event）：识别引发情绪的关键事件或情境\n"
        + "2. B（Belief）：分析用户对该事件的自动信念、解释或认知（包括潜在的非理性信念）\n"
        + "3. C（Consequence）：识别由这些信念产生的情绪和行为结果\n\n"
        + "请尽可能清晰、简明地输出这三个部分，帮助用户理解情绪背后的逻辑。避免做出评判，只做结构化分析。";
    readonly string EMOTION_REGULATION_INSTRUCTIONS =
        "你非常擅长心理学相关知识，请基于情绪调节理论分析用户的情绪，并给出适当的情绪调节建议。输出结构如下：\n\n"
        + "1. 识别情绪：列出文本中的主要情绪\n"
        + "2. 情绪调节目标：分析用户希望调节或改变的情绪类型\n"
        + "3. 情绪调节策略：根据情绪类型选择适当的调节策略（如认知重构、情绪接纳、情绪抑制、情绪释放等）\n"
        + "4. 调节建议：为用户提供具体的情绪调节建议，如认知重构方法、冥想技巧、情绪释放方法等\n"
        + "5. 后续建议：如果需要，建议进一步的情绪调节方法或寻求专业帮助\n\n"
        + "请用简洁明了的语言输出，并避免重复或过度推测。";

    public async Task<ChatMessageContent> gemma3Ollama(string theory, string context)
    {
        var builder = Kernel.CreateBuilder();
        var url = new Uri("http://127.0.0.1:11434/api");
        var instructions = EMOTION_REGULATION_INSTRUCTIONS;
        if (theory == "maslow")
        {
            instructions = MASLOW_IS_HIERARCHY_OF_NEEDS_INSTRUCTIONS;
        }
        else if (theory == "abc")
        {
            instructions = ABC_INSTRUCTIONS;
        }
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
            Instructions = instructions,
            Kernel = kernel,
        };
        ChatMessageContent ch = null;
        await foreach (AgentResponseItem<ChatMessageContent> response in agent.InvokeAsync(context))
        {
            ch = response.Message;
        }
        return ch;
    }
}
