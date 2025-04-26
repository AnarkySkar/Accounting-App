import { redirect } from "next/navigation";

import { BarChartData } from "@/types";

// @ts-ignore
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";
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

export async function generatePDF(
  elementId: string,
  filename = "document.pdf"
) {
  //@ts-ignore
  const html2pdf = (await import("html2pdf.js/dist/html2pdf.min.js")).default;

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID "${elementId}" not found.`);
    return;
  }

  const clone = element.cloneNode(true);

  const wrapper = document.createElement("div");
  wrapper.style.backgroundColor = "#0A0A0A";
  wrapper.style.width = "210mm";
  wrapper.style.minHeight = "296.8mm";

  wrapper.appendChild(clone);

  const opt = {
    filename: filename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      scrollY: 0,
      scrollX: 0,
      windowWidth: wrapper.scrollWidth,
      windowHeight: wrapper.scrollHeight,
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf()
    .set(opt)
    .from(wrapper)
    .save()
    .catch((error: any) => {
      console.error("Error generating PDF:", error);
    });
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
