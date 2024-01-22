import { LLMChain, StuffDocumentsChain, MapReduceDocumentsChain } from "langchain/chains";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { readCategories, readProductsWithoutCategory, setProductCategories } from "./read-database-info.js";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import cliProgress from "cli-progress";

import dotenv from "dotenv";
dotenv.config();

export const mapProductsToTypesOfUsers = async () => {
  try {
    const TYPES_OF_USERS = await readCategories()
      .then((categories) => categories.map(({ id, description }) => `* ${id}. ${description}\n\n`));


    const categorizeProductPrompt = PromptTemplate.fromTemplate(`
    you will help to decide to witch users a product will like, based on the product description.
    We will do the following:
    1. I'll give you the description and id of a product.
    2. I'll give you the list of types of users, each with a uniq id.
    3. You will answer the list of category ids that better match

    ====================


    PRODUCT_ID:
    --------------------
    {product_id}
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
      maxRetries: 5,
      // no more than two queries at the same time
    });



    const chain = categorizeProductPrompt
      .pipe(llm.bind({
        functions: [{
          name: "extractor",
          description: "Extracts recommended ids from the input",
          parameters: {
            type: "object",
            properties: {
              category_ids: {
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
            required: ["category_ids", "why"],
          },
        }],
        function_call: { name: "extractor" },
      }))
      .pipe(new JsonOutputFunctionsParser());

    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

    return readProductsWithoutCategory()
      .then(async (infos) => {

        bar.start(infos.length, 0);

        for (const info of infos) {
          await chain.invoke(info)
            .then(({ category_ids, why }) => {
              return setProductCategories(info, category_ids, why)
            })

          bar.increment();
        }
        bar.stop();
      });

  } catch (error) {
    console.error("Error al ejecutar la cadena:", error);
  }
}
