import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { readCandidateUsers, readCategories, readProductsWithoutCategory, setProductCategories, setUserCategory } from "./read-database-info.js";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import cliProgress from "cli-progress";

import dotenv from "dotenv";
dotenv.config();

export const mapUsersToTypeOfUsers = async () => {
  try {
    const categories = await readCategories();
    const categoryList = categories.map(({ id, description }) => `* ${id}. ${description}\n\n`)

    const prompt = PromptTemplate.fromTemplate(`
    You are an experienced personal shopper and you will help us assigning a profile to a customer.
    We will do the following:
    1. I'll give you a list of candidate customer profiles.
    2. I'll give you the customer purchase history as a list of products.
    3. You will choose the profile that bests suits the customer considering their purchase history
    4. You will explain why you have choosed that profile

    ====================

    CANDIDATE CUSTOMER PROFILES:
    --------------------
    ${categoryList}
    --------------------

    CUSTOMER PURCHASE HISTORY:
    --------------------
    {purchaseHistory}
    --------------------
    
    `);

    const llm = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      temperature: 0,
      // fail at the first rate limit error
      maxRetries: 5,
      // no more than two queries at the same time
    });

    const chain = prompt
      .pipe(llm.bind({
        functions: [{
          name: "extractor",
          description: "Extract recommended profile id from the input",
          parameters: {
            type: "object",
            properties: {
              category_id: {
                type: Number,
                description: "the recommended profile id based on the customer purchase history",
              },
              why: {
                type: "string",
                description: "the reason behind why you recommended this specific profile",
              },
            },
            required: ["category_id", "why"],
          },
        }],
        function_call: { name: "extractor" },
      }))
      .pipe(new JsonOutputFunctionsParser());

    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

    const users = await readCandidateUsers();

    bar.start(users.length, 0);

    users.forEach(async (user) => {
      const purchaseHistory = user.infos.map((info) => `* ${info.product_name}: ${info.description}\n\n`)
      await chain.invoke({purchaseHistory}).then(({category_id, why}) => setUserCategory(user.user_id, category_id, why));
      bar.increment();
    })

    bar.stop();
  } catch (error) {
    console.error("Error al ejecutar la cadena:", error);
  }
}
