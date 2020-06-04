const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const fs = require('fs');
const csvParser = require('csv-parse');
const json2csv = require('json2csv').parse;
const convertXML = require('xml-js');
const multer  = require('multer')
var mysql = require('mysql');
const Sequelize = require('sequelize');
const sequelize = require('./db.js');

const app = express();

const godina = sequelize.import(__dirname + "/models/godina.js");
const student = sequelize.import(__dirname + "/models/student.js");
const vjezba = sequelize.import(__dirname + "/models/vjezba.js");
const zadatak = sequelize.import(__dirname+ "/models/zadatak.js")

var connection=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'wt2018'
});
connection.connect((err)=>{
    if (err) throw err;
    console.log('connected!');
})

sequelize.sync();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '/files/zadaci'));
    },
    filename: function(req, file, cb) {
        cb(null, req.body.naziv + '.pdf');
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {

        if (path.extname(file.originalname) !== '.pdf') {
            return cb('Dokument mora biti u pdf formatu.');
        }

        let zadatakName = req.body.naziv + 'Zad.json';
        let pathToZadatak = path.join(__dirname, '/files/zadaci/', zadatakName);

        fs.access(pathToZadatak, fs.constants.R_OK, (err) => {
            if(!err) {
                return cb('Zadatak već postoji');
            }
            else {
                cb(null, true);
            }
        });
        
    } 
});

app.use('/', serveStatic(path.join(__dirname, '/public')));

app.post('/addZadatak', upload.single('postavka'), (req, res) => {

    let sourceFolder = path.join(__dirname, '/files/zadaci');
    let zadatakName = req.body.naziv + 'Zad.json';

    try {

        let zadatakJSON = {
            naziv: req.body.naziv,
            postavka: req.file.filename
        };
        connection.query('INSERT INTO zadataks SET ?', zadatakJSON, function (err, res){
            if(err) console.log(err);
            else {
                alert('godina dodana');
                response.send('<p>Uspjesno dodan Zadatak<p>');
            }
        });


    } catch(error) {

        res.status(500).send({
            success: false,
            error: {
                message: 'Greška prilikom obrade zahtjeva: ' + error.message
            }
        });

    }

});

app.get('/zadatak/:naziv', function(require, response){
    
    connection.query('Select * from zadataks where naziv=?',require.params.naziv, (err, res)=>{
        if(err) console.log(err);
        fs.readFile(__dirname + res[0].postavka, function(err, data){
            if(err) throw(err);
            response.contentType("application/pdf");
            response.send(data);
        });    
    });
});

app.post('/addGodina', function(require, response){
    
    connection.query('INSERT INTO godinas SET ?',{
        nazivGod : require.body.nazivGod,
        nazivRepSpi : require.body.nazivRepVje,
        nazivRepVje : require.body.nazivRepSpi
    } , function (err, res){
        if(err) console.log(err);
    })
});

app.get('/godine', function(require, response){
    try {
            
        godina.findAll().then(godine => {
            response.send(godine);
        });
    }
    catch(err) {
        response.status(500).send({
            message: err.message
        });
    }
});

app.get('/zadaci', (req, res) => {

    let mimeTypes = ['application/json', 'application/xml', 'text/xml', 'text/csv'];
    let responseMimeType = { name: 'application/json', priority: 4 };
    let zadaci = [];
    let newLine = require('os').EOL;
    
    try {
        
        // determine mime type by priority
        let requestMimeTypes = req.get('Accept').split(',');
        requestMimeTypes.map(s => s.trim());
        
        for(let type of requestMimeTypes) {
            let typePriority = mimeTypes.indexOf(type);
            if(typePriority !== -1 && typePriority < responseMimeType.priority) {
                responseMimeType.name = type;
                responseMimeType.priority = typePriority;
            }
        }

        // perform search
        let sourceFolder = path.join(__dirname, '/files/zadaci');    

        fs.readdir(sourceFolder, (err, files) => {
            if(err) throw err;

            for(let file of files) {
                if(file.includes('.json')) {
                    zadaci.push(JSON.parse(fs.readFileSync(path.join(sourceFolder, file), "utf-8")));
                }
            }

            // format & send response
            if(responseMimeType.name.includes('json')) {
                return res.status(200).send(zadaci);
            }

            else if(responseMimeType.name.includes('xml')) {
                let opts = {compact: true, ignoreComment: true, spaces: 4};
                let zadaciPrepareForXML = {
                    zadaci: {
                        zadatak: zadaci
                    }
                }
                let zadaciXML = convertXML.json2xml(JSON.stringify(zadaciPrepareForXML), opts);
                
                zadaciXML = '<?xml version="1.0" encoding="UTF-8"?>' + newLine + zadaciXML;

                res.setHeader('Content-Type', responseMimeType.name);
                res.status(200).send(zadaciXML);
            }

            else if(responseMimeType.name.includes('csv')) {
                const fields = ['naziv', 'postavka'];
                const opts = { fields, quote: '', header: false };

                let zadaciCSV = json2csv(zadaci, opts);
                res.setHeader('Content-Type', responseMimeType.name);
                res.status(200).send(zadaciCSV);
            }


        });


    } catch (error) {

        res.status(500).send({
            success: false,
            error: {
                message: 'Greška prilikom obrade zahtjeva: ' + error.message
            }
        });

    }
});

app.post('/addVjezba', function(require, response){
    if(require.body.sVjezbe){
        godina.findByPk(require.body.sGodine).then(g => {
            g.getVjezbe().then(vjezbe => {
                if (!vjezbe.find(x => x.dataValues.id == require.body.sVjezbe)) {
                    g.addVjezbe(require.body.sVjezbe).then(() => {
                        response.sendFile(path.join(__dirname, '/public/addVjezba.html'));
                    });
                } else {
                    response.sendFile(path.join(__dirname, '/public/addVjezba.html'));
                }
            });
        });
    }
    else{
        vjezba.create({
            naziv: require.body.naziv,
            spirala: require.body.spirala && require.body.spirala === 'on' ? true : false
        })
        .then(v => {
            v.addGodine(require.body.sGodine);
            v.save();    
        });
    
        response.sendFile(path.join(__dirname, '/public/addVjezba.html'));
    }
    
});
//zadatak 3a
app.post('/student', function(req, res){
    try {
        if (req.body){
            godina.findByPk(req.body.godina)
            .then(g => {
                var studenti = req.body.studenti;
                var m = studenti.length;
                var n = 0;

                var studentiGod = [];

                Promise.all(studenti.map(async s => {
                    await student.findOrCreate({
                        where: { index: s.index },
                        defaults: s
                    })
                    .spread((user, created) => {
                        if (created) n = n+1;
                        studentiGod.push(user);
                    });                    
                })
                ).then(() => {
                    g.setStudenti(studentiGod);
                    g.save();

                    res.send({
                        message: 'Dodano je ' + n + ' novih studenata i upisano ' + m + ' na godinu ' + g.dataValues.naziv
                    });
                });
            })
            .catch(e => {
                res.status(500).send({
                    message: e.message
                });
            });
        }
    }
    catch(err) {
        res.status(500).send({
            message: err.message
        });
    }
});

// 2c 
app.post('vjezba/:idVjezbe/Zadatak', function(req, res){
    vjezba.findByPk(req.param.idVjezbe).then(g => {
        g.getZadaci().then(zadaci => {
            if (!zadaci.find(x => x.dataValues.id == require.param.idVjezbe)) {
                g.addZadaci(require.body.naziv).then(() => {
                    response.sendFile(path.join(__dirname, '/public/addVjezba.html'));
                });
            } else {
                response.sendFile(path.join(__dirname, '/public/addVjezba.html'));
            }
        });
    });
});
app.listen(8080, () => {
    console.log("Server started on port 8080");
});
