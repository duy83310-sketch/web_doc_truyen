// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;
// models/index.js (ESModule-friendly, supports model files exported with module.exports)
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===== Sequelize connection ===== */
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  }
);

try {
  await sequelize.authenticate();
  console.log('✅ MySQL connected');
} catch (err) {
  console.error('❌ MySQL connection failed:', err.message);
}

/* ===== Load models ===== */
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

const files = fs.readdirSync(__dirname).filter(file =>
  file !== path.basename(__filename) && file.endsWith('.js')
);

for (const file of files) {
  const modelUrl = pathToFileURL(path.join(__dirname, file)).href;
  const module = await import(modelUrl);
  const modelFactory = module.default;

  if (typeof modelFactory === 'function') {
    const model = modelFactory(sequelize, DataTypes);
    db[model.name] = model;
  }
}

/* ===== Associations ===== */
Object.values(db).forEach(model => {
  if (model?.associate) model.associate(db);
});

export default db;
