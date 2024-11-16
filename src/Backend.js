const IP = 'localhost';
const PORT = '3005';

const url = IP + ":" + PORT;

export async function getData(searchObject) {

    try {
        const response = await fetch( `http://${url}/api/get-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Setzt den Content-Type auf JSON
            },
            body: JSON.stringify({
                searchObject: searchObject // Hier wird das Objekt in den Body eingefügt
            }),
        }
        );

        if(response.ok) {
            const responseJson = await response.json();

            console.log("Erfolgreich Daten abgerufen: " + JSON.stringify(responseJson.data));

            return responseJson.data;
        } else {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    } catch (error) {
        throw new Error(error);
    }
  
}


export async function addData(entries) {
    try {
        const response = await fetch( `http://${url}/api/add-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Setzt den Content-Type auf JSON
            },
            body: JSON.stringify({
                entries: entries // Hier wird das Objekt in den Body eingefügt
            }),
        }
        );

        if(response.ok) {
            console.log("Erfolgreich Daten hochgeladen");
        } else {
            const errorMessage = await response.text();
            console.log("errorMessage: " + errorMessage);
            throw new Error(errorMessage);
        }
    } catch (error) {
        throw new Error(error);
    }
}

export async function removeData(entry) {
    try {
        const response = await fetch( `http://${url}/api/remove-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Setzt den Content-Type auf JSON
            },
            body: JSON.stringify({
                entry: entry // Hier wird das Objekt in den Body eingefügt
            }),
        }
        );

        if(response.ok) {
            console.log("Erfolgreich Datensatz gelöscht");
        } else {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    } catch (error) {
        throw new Error(error);
    }
}

export async function changeData(entry) {
    try {
        const response = await fetch( `http://${url}/api/change-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Setzt den Content-Type auf JSON
            },
            body: JSON.stringify({
                entry: entry // Hier wird das Objekt in den Body eingefügt
            }),
        }
        );

        if(response.ok) {
            console.log("Erfolgreich Datensatz geändert");
        } else {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    } catch (error) {
        throw new Error(error);
    }
}

export async function createTestData(amount) {
    try {
        const response = await fetch( `http://${url}/api/create-test-data?amount=${amount}`);

        if(response.ok) {
            console.log("Erfolgreich neuen Test-Datensatz generiert");
        } else {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    } catch (error) {
        throw new Error(error);
    }
}

export async function uploadImage(formData) {
    try {
        const response = await fetch( `http://${url}/api/upload-image`, {
            method: 'POST',
            body: formData
        });

        if(response.ok) {
            console.log("Erfolgreich Bild hochgeladen.");
        } else {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    } catch (error) {
        throw new Error(error);
    }
}