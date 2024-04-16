import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import useReverseGeocoding, {
  getReverseGeocoding,
} from "../useCustom/useReverseGeocoding";

//Configuration de pdfmake avec les polices
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const PDFExporter = ({ iconSubmitValues, itiZoneValues }) => {
  const [polygonCoordinates, setPolygonCoordinates] = useState([]);
  const [lineStringCoordinates, setLineStringCoordinates] = useState([]);
  const [itiZoneValuesWithStreetName, setitiZoneValuesWithStreetName] =
    useState([]);

  useEffect(() => {
    if (!itiZoneValues?.features) return;
    const streetNames = [];
    for (const itiZone of itiZoneValues.features) {
      const zoneStreetNames = { ...itiZone, streetNames: [] };
      if (itiZone.geometry.type === "Polygon") {
        for (const coordinate of itiZone.geometry.coordinates[0]) {
          getReverseGeocoding({
            latitude: coordinate[1],
            longitude: coordinate[0],
          }).then((streetName) => zoneStreetNames.streetNames.push(streetName));
        }
      } else if (itiZone.geometry.type === "LineString") {
        for (const coordinate of itiZone.geometry.coordinates) {
          getReverseGeocoding({
            latitude: coordinate[1],
            longitude: coordinate[0],
          }).then((streetName) => zoneStreetNames.streetNames.push(streetName));
        }
      }
      streetNames.push(zoneStreetNames);
    }
    setitiZoneValuesWithStreetName(streetNames);
  }, [itiZoneValues]);

  // Fonction pour générer le contenu du PDF
  const generatePDFContent = () => {
    const contentIcones = [];
    const contentZones = [];
    const contentItis = [];
    let zoneCount = 0;
    let itiCount = 0;

    Object.values(iconSubmitValues).forEach((icon) => {
      contentIcones.push(
        { text: icon.label, style: "header" },
        { text: `Quantité: ${icon.quantities}` },
        { text: `date de pose de l'objet: ${icon.startHours}` },
        { text: `date d'enlèvement de l'objet: ${icon.endHours}` },
        { text: icon.streetName }
      );
    });
    contentIcones.push({ text: "", margin: [0, 0, 0, 20] });

    itiZoneValuesWithStreetName.forEach((itiZone) => {
      if (itiZone.geometry.type === "Polygon") {
        zoneCount++;
        contentZones.push({ text: `Zone ${zoneCount}`, style: "header" });
        itiZone.streetNames.forEach((streetName) => {
          contentZones.push({ text: streetName });
        });
      } else if (itiZone.geometry.type === "LineString") {
        itiCount++;
        contentItis.push({ text: `Itinéraire ${itiCount}`, style: "header" });
        itiZone.streetNames.forEach((streetName) => {
          contentItis.push({ text: streetName });
        });
      }
      contentItis.push({ text: "", margin: [0, 0, 0, 20] });
    });
    const content = contentIcones.concat(contentZones, contentItis);
    return content;
  };

  // Fonction pour générer et télécharger le PDF
  const downloadPDF = () => {
    const docDefinition = {
      content: generatePDFContent(),
      styles: {
        header: {
          bold: true,
          fontSize: 14,
          margin: [0, 10, 0, 5],
        },
      },
    };

    pdfMake.createPdf(docDefinition).download("detail_projet.pdf");
  };

  return (
    <button onClick={downloadPDF}>Téléchargement des détails du projet </button>
  );
};

PDFExporter.propTypes = {
  itiZoneValues: PropTypes.object,
  iconSubmitValues: PropTypes.object,
};

export default PDFExporter;
