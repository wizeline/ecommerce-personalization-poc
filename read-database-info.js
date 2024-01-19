import sqlite3 from "sqlite3";
sqlite3.verbose();

import {
  DB_PATH,
  PRODUCT_QUERY,
  USER_HISTORY_PURCHASE_QUERY,
  USER_QUERY,
} from "./constants.js";

import { Sequelize, Model, DataTypes } from 'sequelize';

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


const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: DB_PATH
});

const Category = sequelize.define("categories", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  description: DataTypes.TEXT,
}, { tableName: "categories", timestamps: false });

export const readProductInfo = () => readData(PRODUCT_QUERY);
export const readUserHistoryPurchaseInfo = () =>
  readData(USER_HISTORY_PURCHASE_QUERY);
export const readUserInfo = () => readData(USER_QUERY);
export const readCategories = () => Category.findAll();
