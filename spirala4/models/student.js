const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

var id_specs = {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
};

var index_specs = {
    type: Sequelize.STRING,
    unique: true
};

const student =sequelize.define('student',{
    id: id_specs,
    imePrezime: Sequelize.STRING,
    index: index_specs
},{
    timestamps:false
} );
module.exports = function(sequelize, DataTypes){
    return student;
}