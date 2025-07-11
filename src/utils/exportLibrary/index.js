import * as XLSX from "xlsx";
import html2pdf from "html2pdf.js";
import store from "../../store/store";
import { setLoading } from "../../store/reducers/loadingSlice/loadingSlice";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// Function to export data to Excel
export const exportToExcel = (data, fileName) => {
  const ws = XLSX.utils.json_to_sheet(data);

  // Calculate maximum column widths
  const maxWidths = data.reduce((colWidths, row) => {
    Object.keys(row).forEach((key, index) => {
      const value = row[key]?.toString() || "";
      colWidths[index] = Math.max(colWidths[index] || 0, value.length);
    });
    return colWidths;
  }, []);

  // Set column widths in the worksheet
  ws["!cols"] = maxWidths.map((width) => ({ wch: width + 2 }));

  // Add filters to the first row
  ws["!autofilter"] = {
    ref: XLSX.utils.encode_range({
      s: { c: 0, r: 0 }, // Start column and row
      e: { c: maxWidths.length - 1, r: data.length }, // End column and row
    }),
  };

  // Create and append worksheet to a new workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  // Save the workbook
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

// Function to export HTML content to PDF
export const exportHtmlToPDF = async (elementId, fileName) => {
  store.dispatch(setLoading(true));
  const hiddenTemplate = window.document.getElementById(elementId).innerHTML;

  // Temporarily show the element
  // hiddenTemplate.style.display = "block";

  const options = {
    margin: 0.5,
    filename: `${fileName}.pdf`,
    image: { type: "jpeg", quality: 0.98 }, // Adjust quality if needed
    html2canvas: { scale: 2 }, // Adjust settings for performance
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    pagebreak: {after:"section", mode: ["avoid-all", "css", "legacy"] }, // Handling page breaks
  };

  try {
    // Convert the temporary container to PDF and save
    // Adding a footer with page numbers
    await html2pdf()
      .from(hiddenTemplate)
      .set(options)
      .toContainer()
      .toCanvas()
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages();
        console.log("getHeight:" + pdf.internal.pageSize.getHeight());
        console.log("getWidth:" + pdf.internal.pageSize.getWidth());
        // const headerContent = document.querySelector('.main-template-Container').outerHTML;

        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);

          pdf.setFontSize(8);
          pdf.setTextColor(64, 64, 64);
          pdf.text(
            "Page " + i + " of " + totalPages,
            pdf.internal.pageSize.getWidth() / 2,
            pdf.internal.pageSize.getHeight() - 0.2
          );
        }
      })
      .save();
  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    store.dispatch(setLoading(false));
  }
};

// export const generatePDF = (data) => {
//   const doc = new jsPDF();

//   // Or use javascript directly:
//   autoTable(doc, {
//     head: [["Name", "Email", "Country"]],
//     body: [
//       ["David", "david@example.com", "Sweden"],
//       ["Castille", "castille@example.com", "Spain"],
//       // ...
//     ],
//   });

//   doc.save("table.pdf");
// };
