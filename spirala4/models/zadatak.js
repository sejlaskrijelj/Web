const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

var id_specs = {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
};

const zadatak =sequelize.define('zadatak',{
    id: id_specs,
    naziv: Sequelize.STRING,
    postavka: Sequelize.STRING
},{
    timestamps:false
} );
module.exports = function(sequelize, DataTypes){
    return zadatak;
}