const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const fs = require('fs');
const csvParser = require('csv-parse');
const json2csv = require('json2csv').parse;
const convertXML = require('xml-js');
const multer  = require('multer')

const app = express();

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
        fs.writeFile(path.join(sourceFolder, zadatakName), JSON.stringify(zadatakJSON), (err, data) => {
            if(err) throw err;            

            res.status(200).send(zadatakJSON);
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

app.get('/zadatak', (req, res) => {
    
    try {

        let sourceFolder = path.join(__dirname, '/files/zadaci');
        let fileName = req.body.naziv + 'Zad.json';

        if(req.body.naziv == null) {
            fileName = req.query.naziv + 'Zad.json';
        }

        fs.readdir(sourceFolder, (err, files) => {
            if(err) throw err;
            if(files.indexOf(fileName) !== -1) {
                fs.readFile(path.join(sourceFolder, fileName), (err, data) => {
                    if(err) throw err;
                    let zadatak = JSON.parse(data);
                    res.setHeader('Content-Type', 'application/pdf');
                    return res.download(path.join(sourceFolder, zadatak.postavka));
                });
            }
            else {
                return res.status(404).send({
                    success: false,
                    error: {
                        message: 'Zadatak "' + req.body.naziv + '" nije pronađen.'
                    }
                });
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

app.post('/addGodina', (req, res) => {

    let fileName = path.join(__dirname, '/files/godine.csv');
    let newLine = require('os').EOL;
    
    try {

        fs.stat(fileName, (err, stat) => {
            let parsedCsv = req.body.nazivGod + ',' + req.body.nazivRepVje + ',' + req.body.nazivRepSpi + newLine;

            if(err === null) {
                fs.readFile(fileName, (err, data) => {
                    if(err) throw err;
                    csvParser(data, {delimiter: ','}, (err, data) => {
                        if(err) throw err;

                        let duplicate = false;
                        for(let godina of data) {
                            if(godina[0] === req.body.nazivGod) {
                                duplicate = true;
                                res.sendFile(path.join(__dirname,'/greska.html'));
                                break;
                            }
                        }

                        if(!duplicate) {
                            fs.appendFile(fileName, parsedCsv, (err) => {
                                if(err) throw err;
            
                                res.sendFile(path.join(__dirname, '/public/addGodina.html'));
                            });
                        }
                    });                        
                });

            } else {
                fs.writeFile(fileName, parsedCsv, (err) => {
                    if(err) throw err;

                    return res.status(200).send({
                        success: true
                    });
                });
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

app.get('/godine', (req, res) => {
    let fileName = path.join(__dirname, '/files/godine.csv');
    var godine = [];

    try {

        fs.readFile(fileName, (err, data) => {
            if(err) throw err;
            csvParser(data, {delimiter: ','}, (err, data) => {
                if(err) throw err;

                for(let godina of data) {
                    godine.push({
                        nazivGod: godina[0],
                        nazivRepVje: godina[1],
                        nazivRepSpi: godina[2]
                    });
                }

                return res.status(200).send(godine);
            });
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

app.listen(8080, () => {
    console.log("Server started on port 8080");
});
