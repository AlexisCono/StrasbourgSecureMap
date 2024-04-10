import React, { useState } from "react";
import Button from "./Button";
import Banner from "./Banner";
import MapboxApiKeyForm from "./MapboxApiKeyForm";
import InteractiveMap from "./InteractiveMap"; // Importez votre composant InteractiveMap

const HomePage = () => {
  const [jsonData, setJsonData] = useState(null);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    try {
      const fileContent = await selectedFile.text();
      const parsedData = JSON.parse(fileContent);
      setJsonData(parsedData);
    } catch (error) {
      console.error("Error parsing JSON file:", error);
    }
  };

  return (
    <div>
      <Banner />
      <header className="App-header">
        <img
          src="./image/Logo4.png"
          style={{ width: "18%", height: "auto", marginTop: "1%" }}
          alt="Logo"
        ></img>
        <div className="buttonAccueil" style={{ marginTop: "1%" }}>
          <Button href="/interactiveMap" classe="buttonHref">
            Nouveau projet
          </Button>
          <div style={{ width: "50px" }}></div>
        </div>
        <input type="file" onChange={handleFileChange} />
      </header>
    </div>
  );
};

export default HomePage;
