import React from "react";
import "./App.css";
import Testing from "./Testing.js";
import Table from "./Table.js";
import NewEntryField from "./NewEntryField.js";
import logo from "./assets/logo.jpg"; // Korrigierter Pfad

function App() {
  return (
    <div className="App">
      <div className="container">
        {/* Blauer Balken */}
        <div className="left-bar"></div>

        {/* Hauptinhalt */}
        <div className="websiteDiv">
          <header className="header">
            {/* Firmenlogo oben rechts */}
            <img src={logo} alt="Firmenlogo" className="logo" />
            {/* Überschrift in der Mitte */}
            <h1 className="header-title">Fehlerdatenerfassungstool</h1>
          </header>
          <main>
            <Table />
            <NewEntryField />
          </main>
          <footer>
            <Testing />
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;