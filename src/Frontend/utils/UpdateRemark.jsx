import { Dialog } from "primereact/dialog";
import React, { useState } from "react";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";

import { useTranslation } from "react-i18next";
const UpdateRemark = ({
  show,
  handleShow,
  state,
  PageName,
  title,
  TableData,
  status,
}) => {
  const [payload, setPayload] = useState(PageName);
  const { t } = useTranslation();
  const handleUpdateRemark = (payload, ledgerId) => {
    if (payload !== "") {
      let updatePayload = {
        Remarks: payload,
        LedgerTransactionID: ledgerId,
      };
      axiosInstance
        .post("CommonController/UpdateRemarks", updatePayload)
        .then((res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);
            handleShow();
            TableData(status);
          } else {
            toast.error(res?.data?.message);
          }
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
        });
    } else {
      toast.error("Remark Can't Be Saved Blank");
    }
  };

  const theme = useLocalStorage("theme", "get");
  console.log({ PageName, state });

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
          ></textarea>

          <div className="d-flex justify-content-centre">
            <div className="col-sm-6">
              <button
                type="button"
                className="btn btn-block btn-success btn-sm"
                onClick={() => {
                  handleUpdateRemark(payload, state?.LedgerTransactionID);
                }}
              >
                    {t("Update")}
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
        </div>
      </Dialog>
    </>
  );
};

export default UpdateRemark;
