import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import Tables from "../../components/UI/customTable";
import { useTranslation } from "react-i18next";


const RejectReasonModal = ({ show, handleShow, state, title }) => {
  const [tableData, setTableData] = useState([]);

  const { t } = useTranslation();
  const theme = useLocalStorage("theme", "get");

  const getRejectReason = () => {
    axiosInstance
      .post("SC/GetRejectReason", { TestId: Number(state?.TestId) })
      .then((res) => {
        console.log(res?.data?.message.length);
        if (res?.data?.message.length > 0) {
          setTableData(res?.data?.message);
        } else {
          onHide();
          toast.error("No Data Available");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getRejectReason();
  }, []);

  const isMobile = window.innerWidth <= 768;

  return (
    <>
      <Dialog
        header={title}
        visible={show}
        top={"25%"}
        className={theme}
        onHide={handleShow}
        style={{
          width: isMobile ? "55vw" : "45vw",
        }}
      >
        <div className="modal-card">
          <div className="col-12">
            <Tables>
              <thead style={{ width: "auto" }}>
                <tr>
                  <th>{t("S.No")}</th>
                  <th>{t("Test Name")}</th>
                  <th>{t("Rejected Date")}</th>
                  <th>{t("Rejected Reason")}</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((data, index) => (
                  <tr key={index}>
                    <td data-title={t("S.No")}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          margin: "0",
                        }}
                      >
                        {index + 1}
                      </div>
                    </td>
                    <td
                      data-title={t("Test Name")}
                      style={{
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {data.RejectionReason}&nbsp;
                    </td>
                    <td data-title={t("Rejected Date")}>
                      {data?.dtEntry}&nbsp;
                    </td>
                    <td data-title={t("Rejected Reason")}>
                      {data?.CustomReason}&nbsp;
                    </td>
                  </tr>
                ))}
              </tbody>
            </Tables>
          </div>
          <div className="col-sm-3">
            <button
              type="button"
              className="btn btn-block btn-danger btn-sm"
              onClick={handleShow}
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default RejectReasonModal;
