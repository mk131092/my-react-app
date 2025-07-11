import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";

import { useTranslation } from "react-i18next";
const SampleRemark = ({
  show,
  handleShow,
  state,
  PageName,
  handleSave,
  title,
}) => {
  const [payload, setPayload] = useState(PageName);
  const theme = useLocalStorage("theme", "get");
  const isMobile = window.innerWidth <= 768;
  const { t } = useTranslation();
  return (
    <>
      <Dialog
        header={t(title)}
        visible={show}
        top={"25%"}
        className={theme}
        onHide={handleShow}
      >
        <div className="modal-card">
          <textarea
            style={{ width: "60vh", height: "30vh" }}
            className="form-control-txtarea p-2"
            name="CustomReason"
            onChange={(e) => {
              setPayload(e?.target?.value);
            }}
            value={payload}
            disabled={title === "Remarks" || title === "PricksRemarks"}
          ></textarea>

          {title == "Remarks" || title == "PricksRemarks" ? (
            <></>
          ) : (
            <div className="d-flex justify-content-centre">
              <div className="col-sm-6">
                <button
                  type="button"
                  className="btn btn-block btn-success btn-sm"
                  onClick={() => {
                    handleSave(payload, state?.index, state?.SINNo);
                  }}
                >
                  {t("Save")}
                </button>
              </div>
              <div className="col-sm-6">
                <button
                  type="button"
                  className="btn btn-block btn-danger btn-sm"
                  onClick={handleShow}
                >
                  {t("Close")}
                </button>
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default SampleRemark;
