const express = require('express');
const cors = require('cors');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const { isArray } = require('util');
const multer = require('multer');

const app = express();
const PORT = 3005;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'], // Erlaube POST und GET Methoden
    allowedHeaders: ['Content-Type'], // Erlaube Content-Type Header
}));
app.use(express.json());

const dbFilePath = path.join(__dirname, "DB.json");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname,"images")); // Speichere in einem Ordner namens 'uploads'
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Benenne Datei eindeutig
    },
});

const upload = multer({ storage });

function getRandomCode(size=5) {
    return crypto.randomBytes(size).toString('hex'); // 5 Bytes = 10 Zeichen im Hex-Format
}

function ensureArray(array) {
    if(Array.isArray(array)) return array;
    else return Array(array);
}

function areObjectsEqual(obj1, obj2) {
    // Prüfen, ob beide Werte primitive Typen oder Referenzen sind
    if (obj1 === obj2) return true;

    // Prüfen, ob beide keine Objekte/Arrays sind (null oder andere primitive Typen)
    if (obj1 === null || obj2 === null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
        return false;
    }

    // Objektschlüssel abrufen
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // Gleiche Anzahl an Schlüsseln?
    if (keys1.length !== keys2.length) return false;

     // Rekursiv alle Schlüssel und Werte prüfen
     for (const key of keys1) {
        if (!keys2.includes(key) || !areObjectsEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}


app.get('/api/test-data', (req, res) => {
    console.log("Erfolgeich auf 'test-data' Anfrage reagiert.")
    res.json({data: "Test bestanden!"});
});

app.get('/api/get-image', (req, res) => {

    const imageFileName = req.query.fileName;

    const imageUrl = path.join(__dirname, 'images', imageFileName);

    fs.promises.access(imageUrl, fs.constants.F_OK)
        .then(() => {
            // Datei existiert, also senden
            const readStream = fs.createReadStream(imageUrl);

            // Setze den richtigen Content-Type
            res.set('Content-Type', `image/${path.extname(imageFileName).slice(1)}`);

            // Piped Stream senden
            readStream.pipe(res);

            // Optional: Bild in den Cache speichern
            let chunks = [];
            readStream.on('data', chunk => chunks.push(chunk));
        })
        .catch(() => {
            // Datei existiert nicht, 404 zurückgeben
            res.status(404).send('Bild nicht gefunden');
        });

});

app.post('/api/upload-image', upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
          // Fehler, falls keine Datei hochgeladen wurde
          return res.status(500).send("Bild konnte nicht hochgeladen werden.");
        }
    
        // Dateiname extrahieren
        const fileName = req.file.filename; // Nur der Name, ohne Pfad
    
        // Erfolgreiche Antwort mit Dateiname
        res.status(200).json({ fileName: fileName });
      } catch (error) {
        console.error("Fehler beim Hochladen:", error);
        res.status(500).send("Ein Fehler ist beim hochladen des Bildes aufgetreten:",error);
      }
});

app.get('/api/create-test-data', async (req, res) => {
    

    const entryAmount = req.query.amount || 3;

    // Funktion zum erstelen einer durch entryAmount festgelegte Anzahl an Beispiel Datensätzen (überschreibt aktuelle DB)
    const data = () => {
        let data = [];

        const mainEntry = {
            "date": {
                    "createdAt": 15,
                    "lastChanged": 15
                },
                "serialNumber": `sN_00001`,
                "errorCode": `eC_00001`,
                "description": "Das ist der Testing-Datensatz. Nicht verändern! 00001",
                "images": [
                    {
                        "fileName": "image01.jpg",
                        "description": "Test-Bild 00001"
                    },
                    {
                        "fileName": "image02.jpg",
                        "description": "Test-Bild 00001"
                    }
                ],
                "complaintNumber": `cN_00001`,
                "productGroup": {
                    "productGroup": `pC_00001`,
                    "lineArea": `lA_00001`,
                },
                "materialNumbers": [
                    {
                        "materialNumber": `mN_00001`,
                        "deliveryNoteNumber": `dNN_00001`,
                        "batchNumber": `bN_00001`,
                    },
                    {
                        "materialNumber": `mN_00001`,
                        "deliveryNoteNumber": `dNN_00001`,
                        "batchNumber": `bN_00001`,
                    }
                ]
        }

        data.push(mainEntry);

        for(let i = 0; i < entryAmount; i++) {
            const entry = {
                "date": {
                    "createdAt": Date.now(),
                    "lastChanged": Date.now()
                },
                "serialNumber": `sN_${getRandomCode()}`,
                "errorCode": `eC_${getRandomCode()}`,
                "description": "Das ist nur eine Beispiel Beschreibung!",
                "images": [
                    {
                        "fileName": "image01.jpg",
                        "description": "Bild 01"
                    },
                    {
                        "fileName": "image02.jpg",
                        "description": "Bild 02"
                    }
                ],
                "complaintNumber": `cN_${getRandomCode()}`,
                "productGroup": {
                    "productGroup": `pC_${getRandomCode()}`,
                    "lineArea": `lA_${getRandomCode()}`,
                },
                "materialNumbers": [
                    {
                        "materialNumber": `mN_${getRandomCode()}`,
                        "deliveryNoteNumber": `dNN_${getRandomCode()}`,
                        "batchNumber": `bN_${getRandomCode()}`,
                    },
                    {
                        "materialNumber": `mN_${getRandomCode()}`,
                        "deliveryNoteNumber": `dNN_${getRandomCode()}`,
                        "batchNumber": `bN_${getRandomCode()}`,
                    }
                ]
            }

            data.push(entry);
        }
        return data;
    }


    try {
        const testData = data();
        await fs.promises.writeFile(dbFilePath, JSON.stringify(testData, null, 2));
    
        res.send("Es wurden " + entryAmount + " Testdaten-Sätze erstellt und in die Datei geschrieben.");
    } catch (error) {
        console.error("Fehler beim Schreiben der Datei:", error);
        res.status(500).send("Fehler beim Erstellen der Testdaten.");
    }
    
});

app.post('/api/get-data', async (req, res) => {

    const { searchTerm, dateCreatedAtFrom, dateCreatedAtTo, dateLastChangedFrom, dateLastChangedTo, serialNumber, errorCode, description, imageDescription, complaintNumber, productGroup, lineArea, deliveryNoteNumber, batchNumber } = req.body.searchObject;

   

    try {
        const fileData = await fs.promises.readFile(dbFilePath, 'utf8');
        let data = JSON.parse(fileData);

        data = data.filter((entry) => {
            return (
                (!searchTerm || entry.serialNumber?.includes(searchTerm) || entry.errorCode?.includes(searchTerm) || entry.description?.includes(searchTerm) 
                || entry.images?.some(image => image.description?.includes(searchTerm)) ||entry.complaintNumber?.includes(searchTerm) 
                || entry.productGroup?.productGroup?.includes(searchTerm) || entry.productGroup?.lineArea?.includes(searchTerm) 
                || entry.materialNumbers?.some(m => m.deliveryNoteNumber.includes(searchTerm)) || entry.materialNumbers?.some(m => m.batchNumber?.includes(searchTerm))) &&

                (!dateCreatedAtFrom || dateCreatedAtFrom <= entry.date?.createdAt) &&
                (!dateCreatedAtTo || dateCreatedAtTo >= entry.date?.createdAt) &&
                (!dateLastChangedFrom || dateLastChangedFrom <= entry.date?.lastChanged) &&
                (!dateLastChangedTo || dateLastChangedTo >= entry.date?.lastChanged) &&
                (!serialNumber || entry.serialNumber?.includes(serialNumber)) &&
                (!errorCode || entry.errorCode?.includes(errorCode)) &&
                (!description || entry.description?.includes(description)) &&
                (!imageDescription || entry.images?.some(image => image.description?.includes(imageDescription))) &&
                (!complaintNumber || entry.complaintNumber?.includes(complaintNumber)) &&
                (!productGroup || entry.productGroup?.productGroup?.includes(productGroup)) &&
                (!lineArea || entry.productGroup?.lineArea?.includes(lineArea)) &&
                (!deliveryNoteNumber || entry.materialNumbers?.some(m => m.deliveryNoteNumber?.includes(deliveryNoteNumber))) &&
                (!batchNumber || entry.materialNumbers?.some(m => m.batchNumber?.includes(batchNumber)))
            )
        });
    
        res.setHeader('Access-Control-Allow-Origin', '*'); // Für alle Origins zulassen
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        console.log("Erfolgreich auf 'get-data' Anfrage reagiert. Länge:", data.length);
        res.status(200).json({data: data});

    } catch (error) {
        console.error('Fehler beim Lesen der Datei oder Filtern der Daten:', error);
        res.status(500).send('Fehler beim Abrufen der Daten oder Filtern der Daten: ' + error);
    }
    
});

app.post('/api/add-data', async (req, res) => {

    const entries = ensureArray(req.body.entries);

   


    try {

        const fileData = await fs.promises.readFile(dbFilePath, 'utf8');
        let data = JSON.parse(fileData);

        // Überprüfung ob bereits ein Eintrag mit der gleichen serialNumber vorhanden ist
        for(dbEntry of data) {
            if(entries.some((entry) => entry.serialNumber === dbEntry.serialNumber)) 
            {
                console.log("Eintrag wurde nicht hinzugefügt, da bereits ein Eintrag mit der gleichen Seriennummer existiert.")
                return res.status(500).send("Es existiert bereits ein Eintrag mit dieser Seriennummer. Nutze bitte eine andere oder ändere den Eintrag mit dieser Seriennummer ab.")
            }
        }
            


        data = [...data, ...entries];

        await fs.promises.writeFile(dbFilePath, JSON.stringify(data, null, 2));

        console.log('Erfolgreich Datensatz zu vorhandnen Daten hinzugefügt!');

        res.status(200).send('Erfolgreich Datensatz zu vorhandnen Daten hinzugefügt!');
    } catch (error) {
        console.error('Fehler beim Lesen oder Schreiben der Datei:', error);
        res.status(500).send('Fehler beim Lesen oder Schreiben der Datei', error);
    }

});

app.post('/api/remove-data', async (req, res) => {
    const entry = req.body.entry;


    try {

        const fileData = await fs.promises.readFile(dbFilePath, 'utf8');
        let data = JSON.parse(fileData);

        const filteredData = data.filter((dbEntry) => {
            return (!areObjectsEqual(dbEntry, entry) || dbEntry.serialNumber === "dN_00001");
        });

        await fs.promises.writeFile(dbFilePath, JSON.stringify(filteredData, null, 2));

        if(filteredData.length === data.length) {
            return res.status(500).send('Der Datensatz wurde nicht gefunden oder darf nicht gelöscht werden!');
        }

        console.log('Erfolgreich Datensatz entfernt!');

        res.status(200).send('Erfolgreich Datensatz entfernt!');
    } catch (error) {
        console.error('Fehler beim Lesen oder Schreiben der Datei:', error);
        res.status(500).send('Fehler beim Lesen oder Schreiben der Datei', error);
    }
});

app.post('/api/change-data', async (req, res) => {

    const entry = req.body.entry;

    try {

        const fileData = await fs.promises.readFile(dbFilePath, 'utf8');
        let data = JSON.parse(fileData);

        const removedData = data.filter((dbEntry) => {
            return (dbEntry.serialNumber != entry.serialNumber || dbEntry.serialNumber === "dN_00001");
        });

        if(removedData.length === data.length) {
            return res.status(500).send('Der Datensatz wurde nicht gefunden oder darf nicht verändert werden!');
        }

        const changedData = [...removedData, entry];

        await fs.promises.writeFile(dbFilePath, JSON.stringify(changedData, null, 2));

        console.log('Erfolgreich Datensatz entfernt!');

        res.status(200).send('Erfolgreich Datensatz entfernt!');
    } catch (error) {
        console.error('Fehler beim Lesen oder Schreiben der Datei:', error);
        res.status(500).send('Fehler beim Lesen oder Schreiben der Datei', error);
    }

});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));