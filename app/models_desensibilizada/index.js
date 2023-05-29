const config_desensibilizada = require("../config/db_desensibilizada.config");
const fs = require('fs');

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config_desensibilizada.DB,
  config_desensibilizada.USER,
  config_desensibilizada.PASSWORD,
  {
    host: config_desensibilizada.HOST,
    operatorsAliases: false,
    dialect: config_desensibilizada.dialect,
    pool: {
      max: config_desensibilizada.pool.max,
      min: config_desensibilizada.pool.min,
      acquire: config_desensibilizada.pool.acquire,
      idle: config_desensibilizada.pool.idle
    },
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync("C:/Users/Salet/Downloads/ca.pem"),  // Ruta al archivo del certificado de autoridad (CA)
        cert: fs.readFileSync("C:/Users/Salet/Downloads/client-cert.pem"),  // Ruta al archivo del certificado del cliente
        key: fs.readFileSync("C:/Users/Salet/Downloads/client-key.pem"),  // Ruta al archivo de la clave privada del cliente
      }
    }
  }
);

const db_desensibilizada = {};

db_desensibilizada.Sequelize = Sequelize;
db_desensibilizada.sequelize = sequelize;

db_desensibilizada.vitals_desensibilizada = require("./vitals_desensibilizada.model.js")(sequelize, Sequelize);

module.exports = db_desensibilizada;
