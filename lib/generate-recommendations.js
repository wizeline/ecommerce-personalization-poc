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
import { Category, Info, InfoCategory, User } from "./sequalize-database-models.js";
import { Op } from "sequelize";
dotenv.config();

async function generateRecommendationsForUser(userId) {
  try {
    const user = await User.findOne({ where: { user_id: userId }, include: Category });
    if (!user) {
      throw new Error(`User with id '${userId}' not found`)
    }
    if (user.categories.length === 0) {
      throw new Error(`User with id '${userId}' doesn't have an associated category yet`)
    }
    const category = user.categories[0];
    const reason = category.users_categories.why;
    const recommendations = await Info.findAll({
      include: [
        {
          model: Category,
          where: { id: category.id },
        }
      ],
      where: { description: { [Op.ne]: "None" } }
    })

    const readableResponse = `
    The user '${user.name}' was assigned the following category using their purchase history and a list of candidate categories as context:

    "${category.description}"

    The LLM justified this association with the following:

    "${reason}"

    Considering that we used the LLM to also assign a category to the available products, the final list of recommendations for the user is the following:

    ${recommendations.map((product) => `  * ${product.product_id} - ${product.product_name}`).join("\n")}
    `
    console.log(readableResponse);
  } catch (error) {
    console.error("Error al enviar la solicitud:", error);
  }
}

generateRecommendationsForUser("U002");
