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
      product_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      description: DataTypes.TEXT,
    }, { tableName: "info", timestamps: false });

    const Category = sequelize.define("categories", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      description: DataTypes.TEXT,
    }, { tableName: "categories", timestamps: false });

    const InfoCategory = sequelize.define('info_category', {
      info_id: {
        type: DataTypes.STRING,
        references: {
          model: Info,
          key: 'product_id'
        }
      },
      category_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Category,
          key: 'id'
        }
      }
    }, { tableName: 'info_categories', timestamps: false });

    Info.hasMany(Category, { foreignKey: 'id' });
    Info.belongsToMany(Category, {
      through: 'info_categories',

      sourceKey: 'product_id',
      foreignKey: 'product_id',
      otherKey: 'category_id',

      timestamps: false,
    });
    expect(await Info.findAll({ fieldset: ['description'], include: [Category] })).toMatchInlineSnapshot(`Array []`);
  })
})