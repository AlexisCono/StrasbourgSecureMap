import React from "react";
import PropTypes from "prop-types";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import useReverseGeocoding from "./ReverseGeocoding";

//Configuration de pdfmake avec les polices
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const PDFExporter = ({ iconSubmitValues, itiZoneValues }) => {
  // Fonction pour générer le contenu du PDF

  // const streetName = useReverseGeocoding({ latitude, longitude });

  const generatePDFContent = () => {
    const content = [];

    Object.values(iconSubmitValues).forEach((icon) => {
      content.push(
        { text: icon.label, style: "header" },
        { text: `Quantité: ${icon.quantities}` },
        { text: `date de pose de l'objet: ${icon.startHours}` },
        { text: `date d'enlèvement de l'objet: ${icon.endHours}` },
        { text: icon.streetName },
        { text: "", margin: [0, 0, 0, 20] }
      );
    });

    Object.values(itiZoneValues.features).forEach((itiZone, index) => {
      console.log(index);
      content.push(
        { text: `Coordonnées de la zone: ${itiZone.geometry.coordinates}` },
        { text: "", margin: [0, 0, 0, 20] }
      );
    });

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

    pdfMake.createPdf(docDefinition).download("icon_data.pdf");
  };

  return <button onClick={downloadPDF}>Télécharger les données PDF</button>;
};

PDFExporter.propTypes = {
  itiZoneValues: PropTypes.object,
  iconSubmitValues: PropTypes.object,
};

export default PDFExporter;
