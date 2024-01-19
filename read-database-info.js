import sqlite3 from "sqlite3";

import { Op } from 'sequelize';

import {
  DB_PATH,
  PRODUCT_QUERY,
  USER_HISTORY_PURCHASE_QUERY,
  USER_QUERY,
} from "./constants.js";

import {
  Category,
  InfoCategory,
  Info,
} from "./sequalize-database-models.js"

function readSQLiteData(dbPath, query, callback) {
  const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error(err.message);
      return;
    }
  });

  db.all(query, [], (err, rows) => {
    if (err) {
      throw err;
    }
    db.close();
    callback(rows);
  });
}

export const readData = (query) =>
  new Promise((resolve, reject) => {
    readSQLiteData(DB_PATH, query, (datos) => {
      try {
        resolve(datos);
        // resolve(JSON.stringify(datos));
      } catch (err) {
        reject(err);
      }
    });
  });

export const readProductInfo = () => Info.findAll({order: ['product_id'], limit: 150, raw: true});
export const readUserHistoryPurchaseInfo = () =>
  readData(USER_HISTORY_PURCHASE_QUERY);
export const readUserInfo = () => readData(USER_QUERY);
export const readCategories = () => Category.findAll({raw: true});
export const setProductCategories = async ({product_id}, category_ids, why ) => {
  await InfoCategory.destroy({ where: { product_id } });
  await InfoCategory.bulkCreate(category_ids.map((category_id) => ({
    product_id,
    category_id,
    why,
  })));
}
export const readProductsWithoutCategory = async () => readProductInfo()
.then((infos) => {
  const product_ids_to_consider = infos.map(({product_id}) => product_id);

  return  InfoCategory.findAll({where: {product_id: {[Op.in]: product_ids_to_consider}}, attributes: ['product_id']})
    .then((infoCategories) => infoCategories.map(({product_id}) => product_id))
    .then((existingProductIdWithCategory) => Info.findAll({
      where: { 
        product_id: {
          [Op.in]: product_ids_to_consider, 
          [Op.notIn]: existingProductIdWithCategory
        }},
      raw: true
    }));
  });
