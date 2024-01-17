import { chunkArray } from "./chunkArray.js";
import { summarizeDatabaseInfo } from "./generate-summarization.js";
import { readProductInfo } from "./read-database-info.js";

describe("generate-summarization.js", () => {

  it.only("runs properly", () => {
    return summarizeDatabaseInfo().then(console.log);
  }, 120000)


  it("separate in batches", () => {
    return readProductInfo().then((productsInfo) => {
      const chunked = chunkArray(productsInfo, 30);
      expect(productsInfo.length).toEqual(300);
      expect(chunked.length).toEqual(2);
    });
  })
})