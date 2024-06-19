const {Sequelize, DataTypes} = require("sequelize");
const sequelize = require("../config/db")

const User = sequelize.define(" user", {
   name: {
     type: DataTypes.STRING,
     allowNull: false
   },
   email: {
     type: DataTypes.STRING,
     allowNull: true
   },
   phone: {
     type: DataTypes.STRING,
     allowNull: true
   }
});

module.exports = User
