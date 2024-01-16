import { LLMChain, StuffDocumentsChain, MapReduceDocumentsChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { readProductInfo, } from "./read-database-info.js";

import dotenv from "dotenv";
dotenv.config();

export const summarizeDatabaseInfo = async () => {
  try {
    const llm = new OpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0,
    });

    const compressPrompt = PromptTemplate.fromTemplate(`given a product with the following description, give me a list of 5 types of clients that could like it.
    
    --------------------
    {context}
    --------------------
      
    `);

    const combinePrompt = PromptTemplate.fromTemplate(`Given the following clients descriptions, summarize all of them in only 5 client descriptions.
    
    --------------------
    {mapped_types_of_users}
    --------------------
      
    `);



    const compressChain = new LLMChain({ prompt: compressPrompt, llm });
    const combineLLMChain = new LLMChain({
      prompt: combinePrompt,
      llm
    });
    const combineDocumentChain = new StuffDocumentsChain({
      llmChain: combineLLMChain,
      documentVariableName: "mapped_types_of_users",
    });


    const chain = new MapReduceDocumentsChain({
      llmChain: compressChain,
      combineDocumentChain,
      returnIntermediateSteps: true,
      verbose: true,
      ensureMapStep: true
    });


    return readProductInfo().then((productsInfo) => {
      const selectedProducts = productsInfo.slice(1, 3);
      const documents = selectedProducts.map(({ id, description }) => new Document({ pageContent: description, metadata: { id } }))
      return chain.invoke({ input_documents: documents })
    })
  } catch (error) {
    console.error("Error al ejecutar la cadena:", error);
  }
}
