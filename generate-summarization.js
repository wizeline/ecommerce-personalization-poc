import { LLMChain, StuffDocumentsChain, MapReduceDocumentsChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from "@langchain/openai";
import { Document } from "@langchain/core/documents";
import { readProductInfo, } from "./read-database-info.js";

import dotenv from "dotenv";
import { chunkArray } from "./chunkArray.js";
dotenv.config();

export const summarizeDatabaseInfo = async () => {
  try {
    const llm = new OpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0,
      // fail at the first rate limit error
      maxRetries: 0,
      // no more than two queries at the same time
      maxConcurrency: 2,
    });

    const compressPrompt = PromptTemplate.fromTemplate(`given the following list of products description, summarize and create a list of types of users than could like them.
    
    --------------------
    {context}
    --------------------
      
    `);

    const combinePrompt = PromptTemplate.fromTemplate(`Given the following clients descriptions, summarize all of them in only 5 client descriptions that can be differentiated between as much as possible.
    
    --------------------
    {mapped_types_of_users}
    --------------------
      
    `);

    const chain = new MapReduceDocumentsChain({
      llmChain: new LLMChain({ prompt: compressPrompt, llm }),
      combineDocumentChain: new StuffDocumentsChain({
        llmChain: new LLMChain({
          prompt: combinePrompt,
          llm
        }),
        documentVariableName: "mapped_types_of_users",
      }),
      verbose: true,
      // in the map step, we are transforming. Make sure is always applied, even
      // in the selected descriptions fit in the reduce query
      ensureMapStep: true
    });


    return readProductInfo()
      .then((productsInfo) => chunkArray(productsInfo, 60))
      // a document for each chunk of products, containing a list of descriptions of the products in the chunk
      .then((chunksOfProducts) => chunksOfProducts.map((chunk) => new Document({ pageContent: chunk.map(({ description }) => `* ${description}\n\n)`) })))
      .then((documents) => chain.invoke({ input_documents: documents }));

  } catch (error) {
    console.error("Error al ejecutar la cadena:", error);
  }
}
