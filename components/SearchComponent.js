import React, { useState, useEffect } from "react";
import './index.css'

function SearchComponent() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterData, setFilterData] = useState([]);
    const [productGroup, setProductGroups] = useState([]);
    const [advancedSearchParams, setAdvancedSearchParams] = useState({
        productGroup: "",
        keywords: "",
        errorCode: "",
        startDate: "",
        endDate: "",
        status: ""
    });

    useEffect(() => {
        //Daten aus Datenbank laden
        fetch('/backend/DB.json')
            .then(repsonse => Response.json())
            .then(data => {
                setData(data);
                setFilterData(data);
                const uniqueProductGroups = [...new Set(data.map(item => item.productGroup.productGroup))];
                setProductGroups(uniqueProductGroups);

                const uniqueErrorCodes = [...new Set(data.map(item.errorCode))];
                setErrorCodes(uniqueErrorCodes);
            })
            .catch(error => console.error("Ein Fehler beim Laden der Daten ist aufgetreten:", error));
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAdvancedSearchChange = (event) => {
        const { name, value } = event.target;
        setAdvancedSearchParams(prevState => ({
            ...prevState, [name]: value
        }));
    };

    const handleSearch = () => {
        let filteredData = data;

    //Filter nach Suchbegriff
        if (searchTerm) {
            filteredData = filteredData.filter(item => 
                item.serialNumber.includes(searchTerm) ||
                item.errorCode.includes(searchTerm) ||
                item.description.includes(searchTerm)
            );
        }

        //Erweiterte Suche
        if (advancedSearchParams.productGroup) {
            filteredData = filteredData.filter(item => 
                item.productGroup.productGroup === advancedSearchParams.productGroup
            );
        }

        if (advancedSearchParams.errorCode) {
            filteredData = filteredData.filter(item =>
                item.errorCode === advancedSearchParams.errorCode
            );
        }

        if (advancedSearchParams.keywords) {
            filteredData = filteredData.filter(item =>
                item.description.toLowerCase().includes(advancedSearchParams.keywords.toLowerCase())
            );
        }

        if (advancedSearchParams.status) {
            filteredData = filteredData.filter(item =>
                item.status === advancedSearchParams.status
            );
        }

        if (advancedSearchParams.startDate && advancedSearchParams.endDate) {
            const startDate = new Date(advancedSearchParams.startDate);
            const endDate = new Date(advancedSearchParams.endDate);
            filteredDate = filteredData.filter(item =>
                new Data(item.date.createdAt) >= startDate && new Date(item.date.createdAt) <= endDate
            );
        }

        //Sortierung nach Datum
        filteredData.sort((a, b) => new Date(a.date.createdAt) - new Date(b.date.createdAt));

        setFilteredData(filteredData);
    };

    return (
        <div className="search-component">

        </div>
    );
}    

export default SearchComponent;