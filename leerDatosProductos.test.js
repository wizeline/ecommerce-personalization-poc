const { leerDatosProductos } = require("./leerDatosProductos")

describe("leerDatosProducots", () => {

    it("return correct product description", async () => {
        expect(await leerDatosProductos("")).toEqual("");
    })
})