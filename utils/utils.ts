import { redirect } from "next/navigation";
import { BarChartData } from "@/types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

// Funzione di generazione PDF migliorata
export async function generatePDF(elementId: string) {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error("Element not found:", elementId);
      return;
    }

    // Cast element to HTMLElement to access style properties
    const htmlElement = element as HTMLElement;
    
    console.log("Generating PDF from element:", elementId);

    // Hide any elements with the hide-on-pdf class
    const elementsToHide = htmlElement.querySelectorAll('.hide-on-pdf');
    elementsToHide.forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });

    // Use html2canvas with better options
    const canvas = await html2canvas(htmlElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: true,
      ignoreElements: (element) => element.classList.contains('hide-on-pdf')
    });

    // Show elements again
    elementsToHide.forEach((el) => {
      (el as HTMLElement).style.display = '';
    });

    const imgData = canvas.toDataURL("image/png");
    
    // Use portrait orientation for invoices
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("invoice.pdf");
    
    console.log("PDF generated successfully");
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}

export const mapBarChartData = (
  barChartData: BarChartData[],
  filterType: "year" | "week" | "month" | "custom"
) => {
  return barChartData.map((dataPoint) => {
    const date = new Date(dataPoint.date_group);
    const [year, month] = dataPoint.date_group.split("-");

    const name =
      filterType === "year"
        ? new Date(`${year}-${month}-01`).toLocaleDateString("en-US", {
            month: "short",
          }) 
        : filterType === "week"
          ? date.toLocaleDateString("en-US", {
              weekday: "short",
            })
          : filterType === "month"
            ? date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
              }) 
            : date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              });

    return {
      name,
      total: dataPoint.total_amount,
    };
  });
};

export const returnStatusLabels = (status: string) => {
  switch (status) {
    case "open":
      return "Open";
    case "in_progress":
      return "In Progress";
    case "done":
      return "Done";
    default:
      return "Open";
  }
};