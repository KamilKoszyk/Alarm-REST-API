const dbConfig = require('../config/db.config');

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
}, {dialectOptions: {
    useUTC: false, 
  }});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./userModel.js")(sequelize, Sequelize);
db.logs = require("./logModel.js")(sequelize, Sequelize);


db.users.hasMany(db.logs, {as: "user_id"});
db.logs.belongsTo(db.users);

module.exports = db;

