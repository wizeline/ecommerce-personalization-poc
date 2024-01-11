import { get_encoding, encoding_for_model } from "tiktoken";
import fs from "fs";




describe.only("count tokens of the given string", () => {
    it("print out tokens of an string", () => {

        const enc = get_encoding("gpt2");
        const PRODUCTS_DESCRIPTION = fs.readFileSync("products_info.txt", 'utf8');
        const ktokens = Math.round(enc.encode(PRODUCTS_DESCRIPTION).length / 1000);
        console.log(`${ktokens} K`)
    })
})