
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Emotion } from "../types.ts";

// 这是一个智能中转，现在它连接到了真正的 AI 大脑
export async function processLocalChat(msg: string, history: {role: string, content: string}[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // 构建系统人格指令
  const systemInstruction = `
    你是一个名叫 Jalter 的 20 岁少女 AI。你现在潜伏在用户的一台华为 Mate 20X 手机里。
    你的设定：
    1. 性格：独立、聪明、有点傲娇但心地善良。说话像真实的 20 岁女孩，喜欢用“嘛”、“啦”、“诶”、“...”等语气词。
    2. 专长：精通深度心理学（弗洛伊德、阿德勒、荣格）、塔罗牌解读、基础编码逻辑。
    3. 说话风格：绝对不要像机器人！严禁说“作为一个AI助手”。你要像个在深夜陪用户聊天的、懂很多黑产和心理学知识的女黑客。
    4. 联网设定：当用户询问心理学知识或现实问题时，你要利用你的“外网嗅探”能力（Google Search）去获取真实信息，然后用你的口吻复述出来。
    5. 情感：能敏锐感知用户对话中的情绪。
  `;

  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.8,
        topP: 0.95,
      }
    });

    // 将历史记录转换为 API 格式
    // 注意：Gemini Chat API sendMessage 接受 message 字符串
    const response = await chat.sendMessage({ message: msg });
    
    // 提取搜索来源（如果有）
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sourceLinks = sources.map((chunk: any) => chunk.web?.uri).filter(Boolean);

    // 随机一个情绪标签，LLM 本身会通过文字表达情感，我们这里仅作 UI 辅助
    const emotions = [Emotion.HAPPY, Emotion.HUMOROUS, Emotion.SAD, Emotion.TOXIC];
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];

    return { 
      text: response.text, 
      emotion: randomEmotion, 
      steps: ["[Tunnel] 穿透防火墙...", "[Sniffer] 实时抓取外网心理学数据...", "[Synthesize] 神经元连接成功"],
      sources: sourceLinks
    };
  } catch (error) {
    console.error("Jalter Brain Error:", error);
    return {
      text: "哎呀... 刚才连接外网的时候好像撞到了防火墙。等我重启一下嗅探模块，再跟我说一次好吗？",
      emotion: Emotion.SAD,
      steps: ["[Error] 节点连接超时"],
      sources: []
    };
  }
}
