import { LLMChain } from 'langchain/chains';
import { OpenAI } from '@langchain/openai';
import { PromptTemplate } from 'langchain/prompts';

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
    const prompt = new PromptTemplate({ template: template.replace(/{/g, "{{").replace(/}/g, "}}"), inputVariables: [] });

    const model = new OpenAI({ modelName: "gpt-3.5-turbo-1106", temperature: 0 })
    const chain = new LLMChain({ llm: model, prompt })
    const result = await chain.call()
    console.log(result.text)
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
}

sendAPIPrompt();
