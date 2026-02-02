
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateAnalysisPDF = async (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with id ${elementId} not found`);
        return;
    }

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // Higher resolution
            useCORS: true, // Allow loading cross-origin images (like user avatars if any)
            logging: false,
            backgroundColor: '#1e1b4b', // Match indigo-950 background
        });

        const imgData = canvas.toDataURL('image/png');

        // PDF setup
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // Add Logo or Header Title
        pdf.setFontSize(16);
        pdf.setTextColor(49, 46, 129); // Indigo-900
        pdf.text('Finanza AI - Reporte Financiero', 10, 15);

        pdf.setFontSize(10);
        pdf.setTextColor(100);
        pdf.text(`Generado el: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 10, 22);

        // Add content image
        // Adjust start position to leave space for header
        const contentStartY = 30;

        pdf.addImage(imgData, 'PNG', 0, contentStartY, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Handle multi-page if content is too long
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`finanza-ai-analisis-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
};
