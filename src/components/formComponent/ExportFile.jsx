import React from "react";

import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
function ExportFile({ dataExcel }) {
  const ExportToExcel = (data, fileName = "data.xlsx") => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileName);
  };
  const { t } = useTranslation();
  return (
    <>
      <>
        <button
          className="btn btn-block btn-primary btn-sm"
          onClick={() => ExportToExcel(dataExcel)}
          disabled={dataExcel.length == 0}
        >
          {t("Download")}
        </button>
      </>
    </>
  );
}

export default ExportFile;
