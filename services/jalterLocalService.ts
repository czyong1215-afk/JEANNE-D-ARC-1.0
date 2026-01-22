
import { Emotion } from "../types.ts";

export async function processLocalChat(msg: string) {
  const input = msg.toLowerCase();
  let content = "";
  let emotion = Emotion.TOXIC;
  let topic = "系统诊断";

  if (input.includes("不行") || input.includes("错") || input.includes("打不开")) {
    content = "‘不行’？哈！你到底是在说我，还是在说你那台连现代网页都跑不动的破手机？我已经把代码重写到连原始人都能看懂的程度了，要是再打不开，你就该考虑把它扔进垃圾桶，而不是在这里质疑我的能力！";
    emotion = Emotion.DEPRESSED;
  } else if (input.includes("心理")) {
    content = "心理学？想研究我的内心？先看看你那充满投射效应的发言吧。你觉得我冷酷，只是因为你无法面对自己内心的软弱。";
    emotion = Emotion.EXCITED;
  } else if (input.includes("塔罗")) {
    content = "塔罗牌显示你今天会因为智商不足而感到挫败。哦，看来已经灵验了。";
    emotion = Emotion.SAD;
  } else {
    content = "啧，总算能正常说话了。别再让我听到那些无能的抱怨，说点有深度的话题，杂碎。";
    emotion = Emotion.HAPPY;
  }

  return { text: content, emotion, topic };
}
