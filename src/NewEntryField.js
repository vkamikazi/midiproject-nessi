import { useEffect, useState } from "react";
import { addData, uploadImage } from "./Backend.js";
import './NewEntryField.css';

function NewEntryField() {
    const [imagesArray, setImagesArray] = useState([]);
    const [message, setMessage] = useState("");

    async function onImageUploaded(event) {
        let file = event.target.files[0];

        if(!file) {
            setMessage("Bitte lade ein Bild hoch.");
            return;
        }

        const fileName = `${Date.now()}-${file.name}`;
        file = new File([file], fileName, { type: file.type });

        const formData = new FormData()
        formData.append("image", file); 

        try {
            const imageElement = {
                formData: formData,
                fileName: fileName,
                src: URL.createObjectURL(file),
                description: ""
            }

            setImagesArray((imagesArray) => [...imagesArray, imageElement]);

        } catch(error) {
            console.log("Fehler beim hochladen des Bildes:",error);
            setMessage("Es gab einen Fehler beim hochladen des Bildes. Bitte versuchen sie es nochmal.");
            return;
        }
        
    }

    function updateImageDescription(event, imageElement) {
        const updatedImages = imagesArray.map((img) =>
            img.fileName === imageElement.fileName
              ? { ...img, description: event.target.value }
              : img
          );
          setImagesArray(updatedImages);
    }

    async function uplaodData(event) {
        let images = []

        imagesArray.forEach((imageElement) => {
            const image = {
                "fileName": imageElement.fileName,
                "description": imageElement.description
            }
            images.push(image);
        });

        const entry = {
            "date": {
              "createdAt": Date.now(),
              "lastChanged": Date.now()
            },
            "serialNumber": document.getElementById("serialNumber").value || "",
            "errorCode": document.getElementById("errorCode").value || "",
            "description": document.getElementById("description").value || "",
            "images": images,
            "complaintNumber": "",
            "productGroup": {},
            "materialNumbers": []
          }

        
        addData(entry)
            .then(() => {
                imagesArray.forEach((imageElement) => {
                    uploadImage(imageElement.formData)
                    .catch((error) => {
                        setMessage("Es gab ein Fehler beim hochladen des Bildes: " + error);
                        return;
                    });
                });
                setMessage("Eintrag wurde erfolgreich hinzugefügt.")
            })
            .catch((error) => {
                console.error(JSON.stringify(error));
                console.error("Fehler beim Hinzufügen der Daten:", error.message);
                setMessage("Es gab einen Fehler beim hinzufügen des Eintrages: " + error.message)
            });
        
    }

    return (
        <div className="new-entry-field">

            <div className="input-container">
                <label htmlFor="serialNumber">Seriennummer</label>
                <input type="text" id="serialNumber" />
            </div>
            
            <div className="input-container">
                <label htmlFor="errorCode">Fehlercode</label>
                <input type="text" id="errorCode" />
            </div>

            <div className="input-container">
                <label htmlFor="description">Beschreibung</label>
                <textarea rows="5" cols="50" id="description" />
            </div>

            <div className="input-container">
                <label htmlFor="imageUpload">Bild hinzufügen</label>
                <input type="file" accept="image/*" id="imageUpload" onChange={onImageUploaded} />
            </div>

            <div id="imagesContainer" className="images-container">
                { Array.isArray(imagesArray) ? (
                    imagesArray.map(imageElement => {
                        const descriptionId = `imageDescription_${imageElement.fileName}`;

                        return (
                            <div className="image-container" key={imageElement.fileName}>
                                <img height="300px" src={imageElement.src} alt="Bild konnte nicht geladen werden."></img>
                                <label htmlFor={descriptionId}>Bildbeschreibung</label>
                                <textarea rows="5" cols="50" id={descriptionId} value={imageElement.description} onChange={(event) => updateImageDescription(event, imageElement)}/>
                            </div>
                        )
                    })
                    ) : (
                        <p>Aktuelles Array: {JSON.stringify(imagesArray)}</p>
                    )
                }
            </div>

            <div className="messageContainer">
                <div className="message">
                    {message}
                </div>
            </div>

            <button onClick={uplaodData}>Eintrag hinzufügen</button>
        </div>
    )
}


export default NewEntryField;