import { LLMChain, StuffDocumentsChain, MapReduceDocumentsChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from "@langchain/openai";
import { readProductInfo, } from "./read-database-info.js";
import fs from "fs";
const TYPES_OF_USERS = fs.readFileSync("./types_of_users.txt");



import dotenv from "dotenv";
dotenv.config();

export const mapProductsToTypesOfUsers = async () => {
  try {
    const llm = new OpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0,
      // fail at the first rate limit error
      maxRetries: 0,
      // no more than two queries at the same time
      maxConcurrency: 2,
    });

    const categorizeProductPrompt = PromptTemplate.fromTemplate(`
    you will help to decide to witch users a product will like, based on the product description.
    We will do the following:
    1. I'll give you the description and id of a product.
    2. I'll give you the list of types of users, each with a uniq id.
    3. You will answer an SQL sentence for a table named "info_categories" that contains the related categories like this one :
      
      UPDATE info_categories set 
    

    ====================


    PRODUCT_ID:
    --------------------
    {id}
    --------------------

    PRODUCT_DESCRIPTION:
    --------------------
    {description}
    --------------------
    
    USER_CATEGORIES:
    --------------------
    ${TYPES_OF_USERS}
    --------------------

    SQL_SENTENCE:

    `);

    const chain = categorizeProductPrompt.pipe(llm);


    return readProductInfo()
      .then((productsInfo) => chain.batch(productsInfo.slice(1, 3)));

  } catch (error) {
    console.error("Error al ejecutar la cadena:", error);
  }
}
