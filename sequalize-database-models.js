import {
  DB_PATH,
} from "./constants.js";

import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: DB_PATH,
  define: {
    timestamps: false,
  }
});

export const User = sequelize.define("users", {
  user_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: DataTypes.TEXT,
  email: DataTypes.TEXT,
  join_date: DataTypes.TEXT,
}, { tableName: "users", timestamps: false });

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

export const UserCategory = sequelize.define('users_categories', {
  user_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  why: DataTypes.TEXT,
}, { tableName: 'users_categories', timestamps: false });

export const UserPurchase = sequelize.define('user_purchase_history', {
  user_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  purchase_date: DataTypes.TEXT,
}, { tableName: 'user_purchase_history', timestamps: false });

Info.belongsToMany(User, {
  through: "user_purchase_history",
  foreignKey: 'product_id',
  otherKey: 'user_id',
})

User.belongsToMany(Info, {
  through: "user_purchase_history",
  foreignKey: 'user_id',
  otherKey: 'product_id',
})

Category.belongsToMany(User, {
  through: "users_categories",
  foreignKey: 'category_id',
  otherKey: 'user_id',
})

User.belongsToMany(Category, {
  through: "users_categories",
  foreignKey: 'user_id',
  otherKey: 'category_id',
})
