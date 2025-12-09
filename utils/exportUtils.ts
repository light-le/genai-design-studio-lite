import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const exportAsImage = async (elementId: string, format: 'png' | 'jpeg' = 'png') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: 2, // Higher resolution
      backgroundColor: null, // Transparent if png
    });

    const link = document.createElement('a');
    link.download = `design-export.${format}`;
    link.href = canvas.toDataURL(`image/${format}`, 0.9);
    link.click();
  } catch (err) {
    console.error("Export failed", err);
    alert("Could not export image. Please ensure no cross-origin images blocked the canvas.");
  }
};

export const exportAsPDF = async (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: 2,
    });

    const imgData = canvas.toDataURL('image/png');
    // Calculate PDF size based on canvas aspect ratio
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Use landscape if image is wider
    const orientation = canvas.width > canvas.height ? 'l' : 'p';
    const pdf = new jsPDF(orientation, 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Center image
    const x = (pdfWidth - imgWidth) / 2;
    const y = (pdfHeight - imgHeight) / 2;

    pdf.addImage(imgData, 'PNG', x > 0 ? x : 0, y > 0 ? y : 0, imgWidth, imgHeight);
    pdf.save('design-export.pdf');
  } catch (err) {
    console.error("Export PDF failed", err);
  }
};
