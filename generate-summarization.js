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
      modelName: "gpt-4",
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
      verbose: true,
      ensureMapStep: true
    });


    return readProductInfo()
      .then((productsInfo) => chunkArray(productsInfo, 60))
      .then((chunksOfProducts) => chunksOfProducts.map((chunk) => {
        return new Document({ pageContent: chunk.map(({ description }) => `* ${description}\n\n)`) });
      }))
      .then((documents) => chain.invoke({ input_documents: documents }));

    /*
      1. Athletic Women: These clients are interested in sports and fitness
         activities, requiring shoes that offer support, durability, and
         performance-enhancing features. They may also prefer a sporty aesthetic
         in their footwear.

      2. Comfort-Seeking Women: These clients value comfort in their footwear,
         especially for extended periods of wear. They may prefer lightweight
         shoes, shoes with a snug fit, or shoes with extra features like
         breathable mesh and cushioned midsoles.

      3. Style-Conscious Women: These clients have a strong sense of personal
         style, whether it's a sleek, modern aesthetic, vintage and heritage
         styles, or feminine touches like pastel colors and floral prints. They
         may also be interested in the latest footwear technology.

      4. Men's Footwear: These clients are men who are looking for
         running-inspired shoes or appreciate a mix of retro and modern styles
         in their footwear.

      5. General Footwear Enthusiasts: These clients have a broad interest in
         footwear, appreciating features like breathability, durability, and
         comfort. They may be interested in a range of styles, from classic
         low-profile shoes to bold, minimalist designs.

      */

  } catch (error) {
    console.error("Error al ejecutar la cadena:", error);
  }
}
