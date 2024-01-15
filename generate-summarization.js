import { LLMChain } from "langchain/chains";
import { OpenAI } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import {
  readProductInfo,
  readUserHistoryPurchaseInfo,
  readUserInfo,
} from "./read-database-info.js";
import { encoding_for_model } from "tiktoken";

import dotenv from "dotenv";
dotenv.config();

async function summarizeDatabaseInfo() {
  try {
    const model = new OpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0,
    });

    const databaseInfo = await Promise.all([
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

    const text = JSON.stringify(databaseInfo);

    const enc = encoding_for_model("gpt-3.5-turbo");
    const numTokens = enc.encode(text).length;
    console.log(`Número de tokens: ${numTokens}`);
    enc.free();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 5000,
      chunkOverlap: 50,
    });

    const chunks = textSplitter.create_documents([text]);
    console.log(chunks);

    const chain = LLMChain.load({
      model,
      chainType: "map_reduce",
      verbose: false,
    });

    const summary = await chain.run(chunks);
    console.log(summary);
  } catch (error) {
    console.error("Error al ejecutar la cadena:", error);
  }
}

summarizeDatabaseInfo();
