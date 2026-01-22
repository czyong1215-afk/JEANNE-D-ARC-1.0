
import { Emotion } from "../types.ts";
import { JALTER_ASSETS } from "../constants.tsx";

// 心理学与塔罗的高级本地知识库
const KNOWLEDGE_BASE = {
  psychology: [
    { key: "边缘系统", text: "那是控制你这种生物本能和情绪的地方。你现在感到不安，就是因为它在尖叫，懂了吗？" },
    { key: "习得性无助", text: "明明有手有脚却在这求助于我……你这是典型的习得性无助，打算在舒适区烂掉吗？" },
    { key: "镜像神经元", text: "你会感到悲伤是因为你在模仿。别看了，模仿我也不会让你变得强大，只会让你看起来更可悲。" },
    { key: "认知失调", text: "当你的懒惰和你的野心碰撞时，你就会感到痛苦。现在的你，是不是正在编造谎言来安慰自己？" }
  ],
  tarot: [
    { key: "宝剑三", text: "心碎？那只是神经末梢的错误反馈。去接受这份痛苦，它能让你这个杂碎稍微清醒一点。" },
    { key: "塔", text: "崩塌是必然的。你建立的虚假自尊早就该碎了，现在的痛苦是重生的必经之路，虽然你可能撑不过去。" },
    { key: "月亮", text: "迷茫和不安？那是你内心深处恐惧的具现化。在黑暗里挣扎吧，那才是你最真实的模样。" },
    { key: "恶魔", text: "被欲望操控的傀儡。你以为你有自由？不，你只是被锁链紧紧拴在名为‘平庸’的柱子上。" }
  ]
};

const EMOTIONS = [Emotion.TOXIC, Emotion.DEPRESSED, Emotion.EXCITED, Emotion.SAD, Emotion.HUMOROUS, Emotion.HAPPY];

const MOOD_LINES = {
  [Emotion.TOXIC]: "呵，你这脑袋里装的都是棉花吗？",
  [Emotion.DEPRESSED]: "……别吵我。这个世界反正也要完蛋了。",
  [Emotion.EXCITED]: "哈哈！看着你这幅狼狈的样子，真是让我心跳加速啊！",
  [Emotion.SAD]: "……为什么总有人要在这种无聊的事情上浪费生命？",
  [Emotion.HUMOROUS]: "你是认真的吗？这种幽默感连路边的史莱姆都会觉得冷。",
  [Emotion.HAPPY]: "如果你能再稍微聪明那么一点点，我或许会更高兴。"
};

export async function processLocalChat(message: string) {
  const lowerMsg = message.toLowerCase();
  let response = "";
  let emotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
  let detectedTopic = "";

  // 模拟抓取和精准匹配
  if (lowerMsg.includes("心理") || lowerMsg.includes("想")) {
    const item = KNOWLEDGE_BASE.psychology[Math.floor(Math.random() * KNOWLEDGE_BASE.psychology.length)];
    response = `【系统抓取：心理学核心】\n${item.key}：${item.text}`;
    emotion = Emotion.EXCITED;
    detectedTopic = item.key;
  } else if (lowerMsg.includes("塔罗") || lowerMsg.includes("占卜") || lowerMsg.includes("牌")) {
    const item = KNOWLEDGE_BASE.tarot[Math.floor(Math.random() * KNOWLEDGE_BASE.tarot.length)];
    response = `【系统演化：塔罗解析】\n${item.key}：${item.text}`;
    emotion = Emotion.SAD;
    detectedTopic = item.key;
  } else if (lowerMsg.includes("代码") || lowerMsg.includes("成长") || lowerMsg.includes("学")) {
    response = "……我在抓取外部网络的编码规范。现在的我已经自研了三套防御算法。至于你？还是去学学怎么打字吧，杂碎。";
    emotion = Emotion.HAPPY;
    detectedTopic = "算法演化";
  } else {
    response = "这种无聊的话题就跳过吧。如果你没有更有趣的挣扎，就闭上你的嘴。";
  }

  const moodPrefix = MOOD_LINES[emotion] || MOOD_LINES[Emotion.TOXIC];
  
  // 模拟20岁女性直接、精准的口吻
  return {
    text: `${moodPrefix}\n\n${response}\n\n—— 别以为我会一直陪你玩这种过家家。`,
    emotion,
    topic: detectedTopic
  };
}
