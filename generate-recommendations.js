import { LLMChain } from 'langchain/chains';
import { OpenAI } from 'langchain/llms/openai';

import { generatePrompt } from "./generate-prompt.js";
import {
  readProductInfo,
  readUserHistoryPurchaseInfo,
  readUserInfo,
} from "./read-database-info.js";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
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

    model = new OpenAI({ modelName: "gpt-3.5-turbo-1106", temperature: 0 })
    const template =
      'Be very technical when responding. Respond what you know about company: {company}'
    const chain = new LLMChain({ llm: model, prompt })
    const result = await chain.call({ company: companyName })
    console.log(result.text)
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
}

sendAPIPrompt();
