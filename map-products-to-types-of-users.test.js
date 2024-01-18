import { mapProductsToTypesOfUsers } from "./map-products-to-types-of-users.js";

import { Sequelize, Model, DataTypes } from 'sequelize';


describe("map-products-to-types-of-users", () => {

  it("runs properly", () => {
    return mapProductsToTypesOfUsers().then(console.log);
  }, 120000)

  it.only("can update database easily", async () => {


    const sequelize = new Sequelize({
      dialect: "sqlite",
      storage: "./retailDB.sqlite"
    })

    const Info = sequelize.define("info", {
      description: DataTypes.TEXT,
    }, { tableName: "info" });

    expect(await Info.findOne({ where: ['description'] })).toMatchInlineSnapshot(`Array []`);
  })
})