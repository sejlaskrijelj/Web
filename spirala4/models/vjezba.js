const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

var id_specs = {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
};
var naziv_specs = {
    type: Sequelize.STRING,
    unique: true
}

const vjezba =sequelize.define('vjezba',{
    id: id_specs,
    naziv: naziv_specs,
    spirala: Sequelize.BOOLEAN
},{
    timestamps:false
} );
module.exports = function(sequelize, DataTypes){
    return vjezba;
}