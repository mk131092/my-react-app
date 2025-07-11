import React from "react";
import Input from "../../components/formComponent/Input";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { Dialog } from "primereact/dialog";
import { useTranslation } from "react-i18next";
function BarcodeLogicModal({
  show,
  handleClose,
  value,
  Id,
  onChange,
  FindBarcode,
  Edit,
  onClose,
}) {
  const { t } = useTranslation();

  const isMobile = window.innerWidth <= 768;
  const theme = useLocalStorage("theme", "get");
  return (
    <Dialog
      visible={show}
      className={theme}
      header={t("Set Your BarCode Here")}
      onHide={onClose}
      style={{
        width: isMobile ? "80vw" : "20vw",
     
      }} 
    >
      <>
        <div className="row">
          <div className="col-sm-12 col-12">
            <Input
              type="text"
              value={value}
              onChange={(e) => {
                onChange(e, Id);
              }}
              max={15}
              min={3}
              disabled={Edit && FindBarcode(Id)}
            />
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-sm-7">
            <button
              className="btn btn-block btn-success btn-sm"
              onClick={() => handleClose(value)}
            >
              {t("Set & Close")}
            </button>
          </div>
        </div>
      </>
    </Dialog>
  );
}

export default BarcodeLogicModal;
