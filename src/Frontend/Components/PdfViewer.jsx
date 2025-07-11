import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = ({ base64Pdf, pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [width, setWidth] = useState(0);
  const containerRef = useRef(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);
  
  useEffect(() => {
    console.log("Base64 PDF:", base64Pdf);
    console.log("PDF URL:", pdfUrl);
  }, [base64Pdf, pdfUrl]);
  
  return (
    <>
      <div
        ref={containerRef}
        style={{
          height: "500px",
          overflowY: "auto",
          width: "100%",
          border: "1px solid #ccc",
        }}
      >
        {console.log(base64Pdf)}
        {console.log(pdfUrl)}
        {base64Pdf  ? (
          <Document
            file={
              base64Pdf ? `data:application/pdf;base64,${base64Pdf}` : pdfUrl
            }
            onLoadSuccess={onDocumentLoadSuccess}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div key={`page_${index + 1}`} style={{ marginBottom: "10px" }}>
                <Page
                  pageNumber={index + 1}
                  width={width}
                  renderTextLayer={false}
                />
              </div>
            ))}
          </Document>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default PdfViewer;
