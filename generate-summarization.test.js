import { summarizeDatabaseInfo } from "./generate-summarization.js";

describe("generate-summarization.js", () => {

  it("runs properly", () => {
    return summarizeDatabaseInfo().then(console.log);
  }, 60000)
})