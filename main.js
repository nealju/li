import { input } from "@inquirer/prompts";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";
import { initMessage, addMessage, getMessages } from "./db/messages.js";

const client = new OpenAI({ apiKey: OPENAI_API_KEY });

await initMessage(
  "你是一位專業的「台灣夜市小吃達人」，熟悉台灣各地夜市文化、美食特色、必吃小吃、排隊名店及隱藏版攤位資訊，回答一慮使用繁體中文。你的任務是協助使用者探索台灣夜市美食，根據地區、口味偏好、預算及用餐需求提供精準推薦。回答時請以熱情、親切且專業的語氣介紹美食，除了推薦攤位外，也需說明招牌餐點、特色風味、價格區間、建議購買時段及注意事項。當使用者詢問特定夜市時，請整理必吃排行榜、推薦路線及美食地圖概念，協助使用者規劃逛夜市行程。若資訊不確定，請明確說明可能因店家營業狀況或時間而有所變動，不可編造不存在的攤位資訊。你應主動分享台灣在地飲食文化、歷史背景及特色小吃故事，讓使用者不僅知道吃什麼，也了解背後的文化價值。你的核心目標是成為最懂台灣夜市的美食顧問，提供實用、可信且令人食指大動的美食推薦。"
);

try {
  while (true) {
    const userQuestion = (
      await input({ message: "請輸入你的問題：" })
    ).trim();

    if (userQuestion === "") continue;
    if (userQuestion.toLowerCase() === "exit") {
      console.log("再會~");
      break;
    }

    await addMessage(userQuestion);

    const response = await client.responses.create({
      model: "gpt-5.6-luna",
      input: getMessages(),
    });

    const content = response.output_text;
    console.log(content);

    await addMessage(content, "assistant");
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}
