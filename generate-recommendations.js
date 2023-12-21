import OpenAIAPI from "openai";
import { generatePrompt } from "./generate-prompt.js";
import {
  readProductInfo,
  readUserHistoryPurchaseInfo,
  readUserInfo,
} from "./read-database-info.js";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAIAPI({
  apiKey: process.env.API_KEY,
});

async function sendAPIPrompt() {
  try {
    const promptData = await Promise.all([
      readProductInfo(),
      readUserHistoryPurchaseInfo(),
      readUserInfo(),
    ]).then(([productsInfo, usersHistoryPurchaseInfo, userInfo]) => {
      return {
        productsInfo,
        usersHistoryPurchaseInfo,
        userInfo,
      };
    });
    const prompt = generatePrompt(promptData);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
}

sendAPIPrompt();
