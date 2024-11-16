import { useEffect, useState } from "react";
import React from "react";
import { getData } from "./Backend.js";
import SortButton from "./SortButton.js";
import "./Table.css";

function Table() {
  const testingSearchObject = {
    searchTerm: null,
    dateCreatedAtFrom: null,
    dateCreatedAtTo: null,
    dateLastChangedFrom: null,
    dateLastChangedTo: null,
    serialNumber: null,
    errorCode: null,
    description: null,
    imageDescription: null,
    complaintNumber: null,
    productGroup: null,
    lineArea: null,
    deliveryNoteNumber: null,
    batchNumber: null,
  };

  const [dbData, setDbData] = useState([]);
  const [sortStates, setSortStates] = useState({
    serialNumber: 0,
    errorCode: 0,
    complaintNumber: 0,
  });

  const handleSort = (column) => {
    setSortStates((prevStates) => {
      const newStates = Object.keys(prevStates).reduce((acc, key) => {
        acc[key] = key === column ? (prevStates[key] + 1) % 3 : 0;
        return acc;
      }, {});

      if (newStates[column] > 0) {
        SortTable(column, newStates[column]);
      }

      return newStates;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData(testingSearchObject);
        setDbData(data);
      } catch (error) {
        console.error(
          "Es gab einen Fehler beim Aufrufen von getDara():",
          error
        );
      }
    };
    fetchData();
  }, []);

  function SortTable(column, direction) {
    const sortedData = [...dbData].sort((a, b) => {
      if (direction === 1) {
        return a[column] > b[column] ? -1 : 1; // Descending
      } else if (direction === 2) {
        return a[column] > b[column] ? 1 : -1; // Ascending
      }
      return 0; // not sorted if direction === 0
    });
    setDbData(sortedData);
  }

  return (
    <table>
      <thead>
        <tr className="head">
          <th className="sortable line-right">
            <SortButton
              column="serialNumber"
              sorting={sortStates.serialNumber}
              onSort={handleSort}
            >
              Seriennummer
            </SortButton>
          </th>
          <th className="sortable line-right">
            <SortButton
              column="errorCode"
              sorting={sortStates.errorCode}
              onSort={handleSort}
            >
              Fehlercode
            </SortButton>
          </th>
          <th className="line-right">Beschreibung</th>
          <th colSpan="2" className="line-right">
            <div className="grid-container-2">
              <div>Bilder,</div>
              <div>Bildbeschreibung</div>
            </div>
          </th>

          <th className="sortable line-right">
            <SortButton
              column="complaintNumber"
              sorting={sortStates.complaintNumber}
              onSort={handleSort}
            >
              Reklamationsnummer
            </SortButton>
          </th>
          <th>Produktgruppe</th>
          <th className="line-right">Linienbereich</th>
          <th colSpan="3">
            <div className="grid-container-3">
              <div>Materialnummern,</div>
              <div>Lieferscheinnummer,</div>
              <div>Chargennummer</div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {dbData.map((item, index) => (
          <tr key={index}>
            <td className="line-right">
              {item.serialNumber?.trim() ? item.serialNumber : "-"}
            </td>
            <td className="line-right">
              {item.errorCode?.trim() ? item.errorCode : "-"}
            </td>
            <td className="line-right">
              {item.description?.trim() ? item.description : "-"}
            </td>

            <td colspan="2" className="line-right">
              {item.images && item.images.length > 0 ? (
                <div className="grid-container-2">
                  {item.images.map((image, idx) => (
                    <div key={idx} className="grid-row">
                      <img
                        className="image"
                        src={`http://localhost:3005/api/get-image?fileName=${image.fileName}`}
                        alt={image.description}
                        width="100"
                        height="100"
                      />
                      <div className="description">
                        {image.description || "-"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                "-"
              )}
            </td>

            <td className="line-right">
              {item.complaintNumber?.trim() ? item.complaintNumber : "-"}
            </td>
            <td>
              {item.productGroup.productGroup?.trim()
                ? item.productGroup.productGroup
                : "-"}
            </td>
            <td className="line-right">
              {item.productGroup.lineArea?.trim()
                ? item.productGroup.lineArea
                : "-"}
            </td>

            <td colSpan="3">
              {item.materialNumbers && item.materialNumbers.length > 0 ? (
                <div className="grid-container-3">
                  {item.materialNumbers.map((material, index) => (
                    <React.Fragment key={index}>
                      <div>{material.materialNumber}</div>
                      <div>{material.deliveryNoteNumber}</div>
                      <div>{material.batchNumber}</div>
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                "-"
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
