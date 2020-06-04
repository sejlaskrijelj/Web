const Sequelize = require("sequelize");
const sequelize = require("./baza.js");
const godina = sequelize.import(__dirname + "/models/godina.js");
const student = sequelize.import(__dirname + "/models/student.js");
const vjezba = sequelize.import(__dirname + "/models/vjezba.js");
const zadatak = sequelize.import(__dirname + "/models/zadatak.js");

var godina_vjezba = {
    as: 'vjezbe',
    through: 'godina_vjezba',
    foreignKey: 'idgodina'
};
var vjezba_zadatak = {
    as: 'vjezbe',
    through: 'vjezba_zadatak',
    foreignKey: 'idzadatak'
};
var godine_vjezba = {
    as: 'godine',
    through: 'godina_vjezba',
    foreignKey: 'idvjezba'
};
var vjezba_zadatak = {
    as: 'zadaci',
    through: 'vjezba_zadatak',
    foreignKey: 'idvjezba'
};

godina.hasMany(student, { 
    foreignKey: 'studentGod',
     as: 'studenti' 
});

godina.belongsToMany(vjezba, godina_vjezba);
zadatak.belongsToMany(vjezba, vjezba_zadatak);
vjezba.belongsToMany(godina, godine_vjezba);
vjezba.belongsToMany(zadatak, vjezba_zadatak);



module.exports = sequelize;