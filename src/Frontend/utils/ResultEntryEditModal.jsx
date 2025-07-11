import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Tables from "../../components/UI/customTable";
import Input from "../../components/formComponent/Input";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { Dialog } from "primereact/dialog";

function ResultEntryEditModal({ show, handleClose, handleSave }) {
  const [EditData, setEditData] = useState(show?.data);
  // i18n start

  const { t } = useTranslation();

  // i18n end
  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = EditData?.DisplayReading
      ? EditData?.DisplayReading.split("-")
      : ["", ""];

    if (name === "MinValue") {
      data[0] = value;
      const val = `${data[0]}-${data[1]}`;
      setEditData({ ...EditData, [name]: value, DisplayReading: val });
    }
    if (name === "MaxValue") {
      data[1] = value;
      const val = `${data[0]}-${data[1]}`;
      setEditData({ ...EditData, [name]: value, DisplayReading: val });
    }
    if (name === "ReadingFormat") {
      setEditData({ ...EditData, [name]: value });
    }
  };
  const isMobile = window.innerWidth <= 768;
  const theme = useLocalStorage("theme", "get");
  return (
    <Dialog
      header={"Change Paramenter Value"}
      onHide={handleClose}
      visible={show}
      className={theme}  style={{
        width: isMobile ? "80vw" : "30vw",
     
      }}
    >
      <div className="">
      
          <Tables>
            <thead className="cf">
              <tr>
                <th>{t("Min Value")}</th>
                <th>{t("Max Value")}</th>
                <th>{t("Unit Type")}</th>
                <th>{t("Display Reading")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-title={t("Min Value")}>
                  <Input
                    type="text"
                    className="select-input-box form-control input-sm"
                    name="MinValue"
                    value={EditData?.MinValue}
                    onChange={handleChange}
                  />
                </td>
                <td data-title={t("Max Value")}>
                  <Input
                    type="text"
                    className="select-input-box form-control input-sm"
                    name="MaxValue"
                    value={EditData?.MaxValue}
                    onChange={handleChange}
                  />
                </td>
                <td data-title={t("Unit Type")}>
                  <Input
                    type="text"
                    className="select-input-box form-control input-sm"
                    name="ReadingFormat"
                    value={EditData?.ReadingFormat}
                    onChange={handleChange}
                  />
                </td>
                <td data-title={t("Display Reading")}>
                  <Input
                  max={2}
                    type="text"
                    className="select-input-box form-control input-sm"
                    name="DisplayReading"
                    value={EditData?.DisplayReading}
                    onChange={handleChange}
                    readOnly
                  />
                </td>
              </tr>
            </tbody>
          </Tables>
      

        <div className="row mt-2">
          <div className="col-sm-6">
            <button
              type="button"
              className="btn btn-success btn-block btn-sm"
              onClick={() => handleSave(EditData, "Edit")}
            >
              {t("Save")}
            </button>
          </div>
          <div className="col-sm-6">
            <button
              type="button"
              className="btn btn-danger btn-block btn-sm"
              onClick={handleClose}
            >
              {t("Close")}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default ResultEntryEditModal;
