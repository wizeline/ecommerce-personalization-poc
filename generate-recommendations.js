import { LLMChain } from "langchain/chains";
import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

import { generatePrompt } from "./generate-prompt.js";
import {
  readProductInfo,
  readUserHistoryPurchaseInfo,
  readUserInfo,
} from "./read-database-info.js";
import dotenv from "dotenv";
dotenv.config();

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
    const template = generatePrompt(promptData);

    const prompt = PromptTemplate.fromTemplate(template);

    const model = new OpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0,
    });
    const chain = new LLMChain({ llm: model, prompt });
    const result = await chain.call();
    console.log(result.text);

    // User profile assigned to U014:
    // Profile 4: Men's Footwear - The user has purchased multiple men's shoes,
    // including running-inspired shoes and a mix of retro and modern styles.
    // This profile aligns with the user's preference for men's footwear.
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
}

sendAPIPrompt();
