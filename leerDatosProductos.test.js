import { readProductInfo, readUserHistoryPurchaseInfo, readUserInfo } from "./leerDatosProductos.js";

describe("readData", () => {

    it("return correct product description", async () => {
        const result = await readProductInfo();
        expect(result[0]).toEqual(expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            description: expect.any(String)
        }));
    })
    it("return correct user purchase history", async () => {
        const result = await readUserHistoryPurchaseInfo();
        expect(result[0]).toEqual(expect.objectContaining({
            id: expect.any(String),
            product_id: expect.any(String)
        }));
    })
    it("return correct user", async () => {
        const result = await readUserInfo();
        expect(result[0]).toEqual(expect.objectContaining({
            id: expect.any(String)
        }));
    })
})