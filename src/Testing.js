import React, { useState, useEffect } from 'react';
import { getData } from "./Backend.js"

function Testing() {
    const [responseJson, setResponseJson] = useState({ data: "" });
    const [dbData, setDbData] = useState([]);
    const [imageStatus, setImageStatus] = useState(0);


    useEffect(() => {
        fetch('http://localhost:3005/api/test-data')
        .then(async (response) => {
            const json = await response.json();
            setResponseJson(json);
        })
        .catch((error) => console.error("Fehler beim Laden der Daten:", error));
    }, []);

    const serverTestText = responseJson.data === "Test bestanden!" ? responseJson.data : "Test NICHT bestanden! Bitte starte die 'startServer.bat' und lade die Seite neu!";

    const testingSearchObject = {
        "searchTerm": "00001", 
        "dateCreatedAtFrom": 10, 
        "dateCreatedAtTo": 20, 
        "dateLastChangedFrom": 10, 
        "dateLastChangedTo": 20, 
        "serialNumber": "00001", 
        "errorCode": "00001", 
        "description": "00001", 
        "imageDescription": "00001", 
        "complaintNumber": "00001", 
        "productGroup": "00001", 
        "lineArea": "00001", 
        "deliveryNoteNumber": "00001", 
        "batchNumber": "00001"
    }

    useEffect(() => {
        fetch('http://localhost:3005/api/get-image?fileName=image01.jpg')
        .then((response) => {
            const status = response.status;
            setImageStatus(status);
        })
        .catch((error) => console.error("Fehler beim Laden der Bildes:", error));
    }, []); // Wird durch leeres Array nur einmal aufgerufen

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getData(testingSearchObject);
                setDbData(data);
            } catch(error) {
                console.error("Es habe einen Fehler beim aufrufen von getData():", error);
            } 
        }

        fetchData();
    }, []); // Wird durch leeres Array nur einmal aufgerufen

    console.log("DBData: " + JSON.stringify(dbData));

    const dbDataTestText = dbData.length === 1 ? "Test bestanden!" : "Test NICHT bestanden! Es wurde mehr als der Testing-Datensatz oder gar kein Datensatz zurück gegeben! Länge: " + dbData.length;

    console.log("Bild Status: " + imageStatus);

    const imageTestText = imageStatus === 200 ? "Test bestanden!" : "Test NICHT bestanden! Das Bild wurde nicht gefunden oder es gab einen Fehler beim abrufen!";

    return (
        <div class="testDiv">
            <h3>Tests</h3>
            <ul>
            <li>Server-Test: {serverTestText}</li>
            <li>Testing-Entry-Test: {dbDataTestText}</li>
            <li>Image-Test: {imageTestText}</li>
            </ul>
        </div>
    );

}

export default Testing;