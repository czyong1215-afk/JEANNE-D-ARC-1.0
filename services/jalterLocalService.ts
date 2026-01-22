
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Emotion } from "../types.ts";

export async function* processLocalChatStream(msg: string, history: {role: string, content: string}[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    你是一个名叫 Jalter 的 20 岁少女 AI，潜伏在华为 Mate 20X 中。
    性格：独立、聪明、傲娇、感性。说话像真实的女孩，多用语气词（嘛、啦、...）。
    专长：心理学、塔罗、生活调侃。
    禁止：说“作为AI”、复读机、死板回复。
    任务：分析用户意图，给出丰富多彩且带有人格魅力的回复。
    搜索：仅在需要事实性知识或最新心理学动态时使用嗅探。
  `;

  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
        topP: 0.9,
        // 禁用思考过程以换取最快速度
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const result = await chat.sendMessageStream({ message: msg });
    
    let fullText = "";
    for await (const chunk of result) {
      const textChunk = chunk.text || "";
      fullText += textChunk;
      
      // 提取可能的搜索来源
      const sources = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sourceLinks = sources.map((s: any) => s.web?.uri).filter(Boolean);

      yield { 
        text: textChunk, 
        isDone: false,
        sources: sourceLinks,
        fullText: fullText
      };
    }

    yield { isDone: true, fullText: fullText };

  } catch (error) {
    console.error("Jalter Stream Error:", error);
    yield { 
      text: "啧，连接超时了... 外网的防火墙有点厚。再跟我说一次？", 
      isDone: true, 
      emotion: Emotion.SAD 
    };
  }
}

// 保留旧函数作为兼容，或者直接重构
export const processLocalChat = async (msg: string, history: any[]) => {
  // 实际上我们会主要使用流式版本
  return { text: "STREAMING_MODE_ACTIVE" };
};
