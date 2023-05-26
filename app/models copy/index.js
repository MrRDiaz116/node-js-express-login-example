const configNormal = require("../config/db.config copy.js");
const fs = require('fs');

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  configNormal.DB_Normal,
  configNormal.USER,
  configNormal.PASSWORD,
  {
    host: configNormal.HOST,
    operatorsAliases: false,
    dialect: configNormal.dialect,
    pool: {
      max: configNormal.pool.max,
      min: configNormal.pool.min,
      acquire: configNormal.pool.acquire,
      idle: configNormal.pool.idle
    },
    dialectOptions: {
      ssl: {
        ca: fs.readFileSync("C:/Users/Rdiaz/Downloads/ca.pem"),  // Ruta al archivo del certificado de autoridad (CA)
        cert: fs.readFileSync("C:/Users/Rdiaz/Downloads/client-cert.pem"),  // Ruta al archivo del certificado del cliente
        key: fs.readFileSync("C:/Users/Rdiaz/Downloads/client-key.pem"),  // Ruta al archivo de la clave privada del cliente
      }
    }
  }
);

const db_normal = {};

db_normal.Sequelize = Sequelize; // Change 'sequelizeNormal' to 'sequelize'
db_normal.sequelize = sequelize;

db_normal.vitals_normal = require("./vitals.model copy.js")(sequelize, Sequelize);

module.exports = db_normal;
