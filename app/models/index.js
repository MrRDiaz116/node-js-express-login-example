const config = require("../config/db.config.js")

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.client = require("./client.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.vitals = require("../models/vitals.model.js")(sequelize, Sequelize);

db.role.hasMany(db.client, { as: "client" });
db.client.belongsTo(db.role, {
  foreignKey: "rolesPruebaRoleid",
  as: "role",
});

db.user.hasOne(db.client);
db.client.belongsTo(db.user);



db.ROLES = ["user", "pharmacy", "gov"];

module.exports = db;
