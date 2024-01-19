import { LLMChain, StuffDocumentsChain, MapReduceDocumentsChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { readCategories, readProductInfo, } from "./read-database-info.js";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";

import dotenv from "dotenv";
dotenv.config();

export const mapProductsToTypesOfUsers = async () => {
  try {
    const TYPES_OF_USERS = await readCategories()
      .then((categories) => categories.map(({id, description}) => `* ${id}. ${description}\n\n`));


    const categorizeProductPrompt = PromptTemplate.fromTemplate(`
    you will help to decide to witch users a product will like, based on the product description.
    We will do the following:
    1. I'll give you the description and id of a product.
    2. I'll give you the list of types of users, each with a uniq id.
    3. You will answer the list of category ids that better match

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
    `);

    const llm = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0,
      // fail at the first rate limit error
      maxRetries: 0,
      // no more than two queries at the same time
      maxConcurrency: 2,
    })
    .bind({
      functions: [{
        name: "extractor",
        description: "Extracts recommended ids from the input",
        parameters: {
          type: "object",
          properties: {
            recomended_category_ids: {
              type: "array",
              description: "the recommended category ids based on the description of the product",
              items: {
                type: Number,
                description: 'id of a category'
              }
            },
            why: {
              type: "string",
              description: "the reasons behing why you recommended this specific categories",
            },
          },
          required: ["recomended_category_ids", "why"],
        },
      }],
      function_call: { name: "extractor" },
    })



    const chain = categorizeProductPrompt
      .pipe(llm)
      .pipe(new JsonOutputFunctionsParser());

    return readProductInfo()
      .then((productsInfo) => chain.invoke(productsInfo[1]) );

  } catch (error) {
    console.error("Error al ejecutar la cadena:", error);
  }
}
