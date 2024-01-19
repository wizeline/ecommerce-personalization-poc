import { mapProductsToTypesOfUsers } from "./map-products-to-types-of-users.js";

import { Sequelize, Op, DataTypes } from 'sequelize';
import {
  Info,
  InfoCategory
} from "./sequalize-database-models.js";
import { readProductsWithoutCategory } from "./read-database-info.js";

describe("map-products-to-types-of-users", () => {

  it("runs properly", () => {
    return mapProductsToTypesOfUsers().then(console.log);
  }, 120000)

  it("can update database easily", async () => {


    const sequelize = new Sequelize({
      dialect: "sqlite",
      storage: "./retailDB.sqlite"
    })

    const Info = sequelize.define("info", {
      product_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      product_name: DataTypes.TEXT,
      description: DataTypes.TEXT,
    }, { tableName: "info", timestamps: false });

    const Category = sequelize.define("categories", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      description: DataTypes.TEXT,
    }, { tableName: "categories", timestamps: false });

    const InfoCategory = sequelize.define('info_categories', {
      product_id: DataTypes.STRING,
      category_id: DataTypes.INTEGER,
      why: DataTypes.TEXT,
    }, { tableName: 'info_categories', timestamps: false });

    // InfoCategory.hasOne(Info, { sourceKey: 'product_id', foreignKey: 'product_id' });
    // InfoCategory.hasOne(Category, { sourceKey: 'category_id', foreignKey: 'id' });

    // Info.hasMany(Category, { foreignKey: 'id' });
    Info.belongsToMany(Category, {
      through: 'info_categories',
      sourceKey: 'product_id',
      foreignKey: 'product_id',
      otherKey: 'category_id',
    });
    Category.belongsToMany(Info, {
      through: 'info_categories',
      sourceKey: 'id',
      foreignKey: 'category_id',
      otherKey: 'product_id',
    });


    const { product_id } = await Info.findOne();

    // delete associated categories
    InfoCategory.destroy({ where: { product_id } });

    // has no categories associated
    let theProductCategories = await InfoCategory.findAll({ where: { product_id } });
    expect(theProductCategories.length).toEqual(0);

    // associate two random categories
    const twoCategories = await Category.findAll({ limit: 2 });
    InfoCategory.bulkCreate(twoCategories.map(({ id: category_id }) => ({
      product_id,
      category_id,
      why: "just a test",
    })));

    theProductCategories = await InfoCategory.findAll({ where: { product_id } });
    expect(theProductCategories.length).toEqual(2);

    const firstCategory = await Category.findOne({ where: { id: twoCategories[0].id }, include: [Info] });
    expect(firstCategory.infos.length).toEqual(1);
  })

  it.only("select not categorized productrs", async () => {
    return readProductsWithoutCategory().then(console.log);
    // expect(result).toMatchInlineSnapshot("");
  })
})