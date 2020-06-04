const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

var id_specs={
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
}
var nazivGod_specs = {
    type: Sequelize.STRING,
    unique: true
}

const godina = sequelize.define('godina', {
    id: id_specs,
    nazivGod: nazivGod_specs,
    nazivRepSpi: Sequelize.STRING,
    nazivRepVje: Sequelize.STRING
},{
    timestamps:false
} 
);

module.exports = function(sequelize, DataTypes){
    return godina;
}
