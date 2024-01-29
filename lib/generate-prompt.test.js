import { generatePrompt } from "./generate-prompt"
import { readProductInfo, readUserHistoryPurchaseInfo, readUserInfo } from "./read-database-info.js";

import fs from "fs";



describe("generate prompt correctly", () => {

    it("create a prompt including product info, history of purchase and id of users", () => {
        expect(generatePrompt({
            productsInfo: [{
                name: "a pair of shoes",
                description: "this is a glancy pair of shoes",
                id: "P0023"
            }], usersHistoryPurchaseInfo: [
                {
                    "UX0034": ["P0023", "P0024", "P0024"]
                }
            ], userInfo: [{ id: "UX0034" }, { id: "UX0035" }, { id: "UX0036" }]
        })).toMatchSnapshot();
    });

    it.skip("generates proper output for a real example", async () => {
        const info = {
            productsInfo: await readProductInfo(),
            usersHistoryPurchaseInfo: await readUserHistoryPurchaseInfo(),
            userInfo: await readUserInfo(),
        }

        const prompt = generatePrompt(info);
        fs.writeFileSync("prompt.txt", prompt)
        expect(prompt).toMatchSnapshot();
    })
})