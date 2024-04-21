import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { getReverseGeocoding } from "../useCustom/useReverseGeocoding";
import { timeConvert } from "../function/timeConvert";
import logoImage from "../../public/image/logo3.png"; // Importez l'image depuis votre dossier public

//Configuration de pdfmake avec les polices
pdfMake.vfs = pdfFonts.pdfMake.vfs;

// Fonction pour convertir l'image en données URL
const getImageDataURL = (imgSrc) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = (error) => reject(error);
  });
};

const PDFExporter = ({ iconSubmitValues, itiZoneValues }) => {
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
        { text: `${icon.label} x ${icon.quantities}`, bold: true },
        icon.startHours && {
          text: [
            { text: "Date de pose de l'objet: ", italics: true },
            { text: timeConvert(icon.startHours) },
          ],
        },
        icon.endHours && {
          text: [
            { text: "Date d'enlèvement de l'objet: ", italics: true },
            { text: timeConvert(icon.endHours) },
          ],
        },
        { text: icon.streetName },
        icon.describe && [
          { text: "Description: ", italics: true },
          { text: icon.describe },
        ],

        { text: "", margin: [0, 0, 0, 5] }
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

  const downloadPDF = () => {
    // Demander à l'utilisateur de saisir le nom du fichier
    const defaultFileName = "details_projet"; // Valeur par défaut
    const fileName = window.prompt("Entrez le nom du projet", defaultFileName);

    // Si l'utilisateur clique sur Annuler ou laisse le champ vide, ne rien faire
    if (!fileName) return;

    getImageDataURL(logoImage)
      .then((dataURL) => {
        const docDefinition = {
          header: {
            text: fileName,
            fontSize: 16,
            bold: true,
            alignment: "center",
            margin: [0, 10, 5, 10],
          },

          content: generatePDFContent(),

          footer: {
            image: dataURL, // Utilisez les données URL de l'image
            fit: [50, 35],
            alignment: "left",
            margin: [10, 5, 20, 5],
          },
        };

        pdfMake.createPdf(docDefinition).download(`${fileName}.pdf`);
      })
      .catch((error) => {
        console.error("Error loading image:", error);
      });
  };

  return (
    <button className="Telechargement" onClick={downloadPDF}>
      Télécharger les détails du projet
    </button>
  );
};

PDFExporter.propTypes = {
  itiZoneValues: PropTypes.object,
  iconSubmitValues: PropTypes.object,
};

export default PDFExporter;
