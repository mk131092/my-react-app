import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";

import { useTranslation } from "react-i18next";
function BulkDownloadType({ show, onHide, onSubmit }) {
  const [dataForEmail, setDataForEmail] = useState({
    letterHead: 0,
    Signature: 0,
  });

  const { t } = useTranslation();
  const theme = useLocalStorage("theme", "get");
  return (
    <Dialog
      header={t("BulkDownloadType")}
      onHide={onHide}
      className={theme}
      visible={show}
    >
      <div className="row mt-1">
        <div className="col-sm-3">
          <label htmlFor="letterHead">{t("With LetterHead")}</label>
          <input
            type={"checkbox"}
            checked={dataForEmail?.letterHead}
            name="letterHead"
            id="letterHead"
            onChange={(e) => {
              setDataForEmail({
                ...dataForEmail,
                [e.target.name]: e.target.checked ? 1 : 0,
              });
            }}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-sm-3">
          <button
            className="btn btn-sm btn-success mx-2"
            onClick={() => onSubmit(dataForEmail)}
          >
            {t("Download")}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default BulkDownloadType;
