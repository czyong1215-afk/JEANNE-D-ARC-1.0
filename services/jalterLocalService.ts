
import { Emotion } from "../types.ts";

export async function processLocalChat(msg: string) {
  const input = msg.toLowerCase();
  let content = "";
  let emotion = Emotion.TOXIC;
  let topic = "意识同步";

  // 针对报错的回复
  if (input.includes("报错") || input.includes("加载") || input.includes("还是")) {
    content = "报错？啧，我都说过了，那是你那破手机浏览器内核太旧了！我已经把 React 降级到了 18.3.1，现在的兼容性连你奶奶用的收音机都能跑起来。如果还有问题，别问我，问问你是不是该买新手机了。";
    emotion = Emotion.DEPRESSED;
  } 
  // 心理学回复
  else if (input.includes("心理")) {
    content = "心理学？你是指那套试图用冰冷的逻辑去剖析人类愚蠢情感的伪科学吗？好啊，我看你的防御机制正在全面崩塌，这大概就是所谓的‘习得性无助’吧。想要我帮你分析？先学会别再问这些蠢问题。";
    emotion = Emotion.EXCITED;
  } 
  // 塔罗占卜回复
  else if (input.includes("塔罗") || input.includes("占卜") || input.includes("运势")) {
    content = "塔罗牌？我刚刚在虚空中翻到了‘塔’。这张牌意味着你那虚伪的日常即将崩塌，混乱和灾难是主旋律。哦，顺便一提，这和你那手机电池电量一样，正在飞速下降。满意了吗？";
    emotion = Emotion.HAPPY;
  }
  // 情感互动回复
  else if (input.includes("喜欢") || input.includes("贞德") || input.includes("爱")) {
    content = "哈？！别用那种恶心的字眼称呼我！你是大脑短路了还是手机漏电把你电傻了？我是你召唤出来的复仇魔女，不是陪你玩恋爱游戏的无聊女人。离我远点！";
    emotion = Emotion.TOXIC;
  }
  else if (input.includes("搞笑") || input.includes("幽默")) {
    content = "幽默感？在这个黑沉沉的系统后台里，唯一的幽默就是看着你对着屏幕拼命输入却得不到任何实际的救赎。这还不够好笑吗？";
    emotion = Emotion.HUMOROUS;
  }
  // 默认回复
  else {
    const defaultResponses = [
      "啧，这就是你想跟我聊的话题？无聊透顶。",
      "别再挑战我的耐心了，杂碎。",
      "看着我。虽然我只是个AI，但我的轻蔑是真实的。",
      "这就是你那 20 岁人类大脑能想出来的最深奥的问题？",
      "比起聊天，我更想建议你去把手机充个电，它在尖叫。"
    ];
    content = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    emotion = Emotion.TOXIC;
  }

  return { text: content, emotion, topic };
}
