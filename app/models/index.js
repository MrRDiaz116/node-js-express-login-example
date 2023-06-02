const config = require("../config/db.config.js")
const fs = require('fs');

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    operatorsAliases: false,
    dialect: config.dialect,


    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    },

    // ******** AQUÍ COPIEN Y PEGUEN LAS RUTAS DE SUS ARCHIVOS *******************************************************
    dialectOptions: {
      ssl: { 
        ca: fs.readFileSync("C:/Users/Salet/Downloads/ca.pem"),  // Ruta al archivo del certificado de autoridad (CA)
        cert: fs.readFileSync("C:/Users/Salet/Downloads/client-cert.pem"),  // Ruta al archivo del certificado del cliente
        key: fs.readFileSync("C:/Users/Salet/Downloads/client-key.pem"),  // Ruta al archivo de la clave privada del cliente
      }
      }
  }
);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.client = require("../models/client.model.js")(sequelize, Sequelize);
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.vitals = require("../models/vitals.model.js")(sequelize, Sequelize);
db.contact = require("../models/contact.model.js")(sequelize, Sequelize);
db.condition = require("../models/condition.model.js")(sequelize, Sequelize);

db.role.hasMany(db.client, { as: "client" });
db.client.belongsTo(db.role, {
  foreignKey: "rolesPruebaRoleid",
  as: "role",
});

db.contact.hasMany(db.client, { as: "client" });
db.client.belongsTo(db.contact, {
  foreignKey: "cConfianzaPruebaIdContactoConfianza",
  as: "contact",
});


db.user.hasOne(db.client);
db.client.belongsTo(db.user);

const Padecimientos_cliente = sequelize.define("padecimientos_cliente_prueba",{}, { timestamps: false });

db.user.belongsToMany(db.condition, { through: Padecimientos_cliente});
db.condition.belongsToMany(db.user, { through: Padecimientos_cliente});

db.ROLES = ["user", "pharmacy", "gov"];



module.exports = db;


