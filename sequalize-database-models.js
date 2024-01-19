import {
  DB_PATH,
} from "./constants.js";

import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: DB_PATH
});

export const Info = sequelize.define("info", {
  product_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  product_name: DataTypes.TEXT,
  description: DataTypes.TEXT,
}, { tableName: "info", timestamps: false });

export const Category = sequelize.define("categories", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  description: DataTypes.TEXT,
}, { tableName: "categories", timestamps: false });

export const InfoCategory = sequelize.define('info_categories', {
  product_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  category_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  why: DataTypes.TEXT,
}, { tableName: 'info_categories', timestamps: false });