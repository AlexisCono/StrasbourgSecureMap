import React from "react";
import PropTypes from "prop-types";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import ReverseGeocoding from "./ReverseGeocoding";

// Configuration de pdfmake avec les polices
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const PDFExporter = ({ iconSubmitValues }) => {
  // Fonction pour générer le contenu du PDF
  const generatePDFContent = () => {
    const content = [];

    Object.values(iconSubmitValues).forEach((icon) => {
      const coor = icon.coor;
      const [lng, lat] = coor.split(" ").map(parseFloat);
      const streetName = <ReverseGeocoding latitude={lat} longitude={lng} />;
      console.log(streetName);

      content.push(
        { text: `Nom: ${icon.label}` },
        { text: `Quantité: ${icon.quantities}` },
        { text: `date de pose de l'objet: ${icon.startHours}` },
        { text: `date de dépose de l'objet: ${icon.endHours}` },
        { text: `Coordonnée: ${streetName}` },
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
  iconSubmitValues: PropTypes.object.isRequired,
};

export default PDFExporter;
