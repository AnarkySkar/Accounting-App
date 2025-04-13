import { redirect } from "next/navigation";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { BarChartData } from "@/types";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export async function generatePDF(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Set a slight delay to ensure all elements are rendered properly
  await new Promise(resolve => setTimeout(resolve, 100));

  // Cast element to HTMLElement to access style properties
  const htmlElement = element as HTMLElement;

  // Use html2canvas with improved options
  const canvas = await html2canvas(htmlElement, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false
  });

  const imgData = canvas.toDataURL("image/png");
  
  // Use portrait orientation for invoices
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [canvas.width, canvas.height],
  });

  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save("invoice.pdf");
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
          }) // Get the month from YYYY-MM
        : filterType === "week"
          ? date.toLocaleDateString("en-US", {
              weekday: "short",
            })
          : filterType === "month"
            ? date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
              }) // Get day and month (MM-DD)
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