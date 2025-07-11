import React, { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { axiosReport } from "../../utils/axiosInstance";
import Tables from "../../components/UI/customTable";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
import CustomModal from "../utils/CustomModal";
import Loading from "../../components/loader/Loading";
import PatientDetailModal from "../utils/PatientDetailModal";
import CustomDateModal from "../utils/CustomDateModal";

import Urgent from ".././Images/urgent.gif";
import SpinnerLoad from "../../components/loader/SpinnerLoad";
import { CheckDevice, downloadPdf } from "../../utils/helpers";
function RECultureTable({
  redata,
  GetResultEntryCulture,
  setShowMH,
  setShowUD,
}) {
  const [modal, setModal] = useState({
    show: false,
    visitId: "",
  });
  const [loading, setLoading] = useState(false);

  const [Index, setIndex] = useState(-1);
  const [datemodal, showDatemodal] = useState(false);
  const [showPH, setShowPH] = useState(false);

  const [TestID, setTestID] = useState("");
  const [printLoading, setPrintLoading] = useState({
    With: false,
    Without: false,
    index: -1,
  });
  const { t } = useTranslation();
  const getdata = (data, index) => {
    console.log(data);
    GetResultEntryCulture(
      {
        LedgerTransactionID: data?.LedgertransactionId,
        TestID: Number(data?.TestID),
        DepartmentID: Number(data?.DepartmentId),
        VisitNo: data?.LedgerTransactionNo,
        BarcodeNo: data?.BarcodeNo,
      },

      index,
      setLoading,
      "Preliminary 1"
    );
    setIndex(index);
  };
  const handleReport = (data, loader, index, PHead) => {
    if (printLoading.index === -1) {
      setPrintLoading({
        [loader]: true,
        index: index,
      });
      const requestOptions = {
        ...(CheckDevice() == 1 && { responseType: "blob" }),
      };
      axiosReport
        .post(
          `commonReports/GetLabReport`,
          {
            TestIDHash: [data?.TestIdHash],
            PHead: PHead,
            PrintColour: "1",

            IsDownload: CheckDevice(),
          },
          requestOptions
        )
        .then((res) => {
          if (CheckDevice() == 1) {
            downloadPdf(res.data);
          } else {
            if (res?.data?.success) {
              window.open(res?.data?.url, "_blank");
            } else {
              toast.error(res?.data?.message);
            }
          }
          setPrintLoading({
            [loader]: false,
            index: -1,
          });
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : err?.data?.message
          );
          setPrintLoading({
            [loader]: false,
            index: -1,
          });
        });
    } else {
      toast.warn("Please wait Generating Report");
    }
  };
  console.log(Index);
  return (
    <>
      {showPH && (
        <PatientDetailModal
          showPH={showPH}
          setShowPH={setShowPH}
          ResultData={redata}
          Index={Index}
        />
      )}

      {modal?.show && (
        <CustomModal
          show={modal?.show}
          visitID={modal?.visitId}
          onHide={() =>
            setModal({
              show: false,
              visitId: "",
            })
          }
        />
      )}
      {datemodal && (
        <CustomDateModal
          show={datemodal}
          data={TestID}
          onHide={() => showDatemodal(false)}
        />
      )}
      <div className="p-2 ">
        {redata.length > 0 ? (
          <Tables>
            <>
              <thead className="cf">
                <tr>
                  <th>{t("S.No")}</th>
                  <th>{t("Reg. Date")}</th>
                  <th>{t("Incubation Date")}</th>

                  <th>{t("Visit No.")}</th>
                  <th>{t("Barcode No")}</th>
                  <th>{t("UHID")}</th>
                  <th>{t("Patient Name")}</th>
                  <th>{t("Age/Gender")}</th>
                  <th>{t("Status")}</th>
                  <th>{t("Test")}</th>
                  <th>{t("Print")}</th>
                  <th>{t("Doctor")}</th>
                  <th>{t("Centre")}</th>
                  <th>{t("Detail")}</th>
                  <th className="text-center">
                    <i class="fa fa-file"></i>
                  </th>
                  <th
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Customize Date"
                  >
                    <i
                      className="fa fa-calendar text-centre"
                      style={{ margin: "2px 8px" }}
                    ></i>
                  </th>
                </tr>
              </thead>
              <tbody>
                {redata.map((data, index) => (
                  <tr key={index}>
                    <td data-title={t("S.No")}>
                      <span>
                        {index + 1}
                        &nbsp;
                      </span>
                      <i
                        className="fa fa-search"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setModal({
                            show: true,
                            visitId: data?.LedgerTransactionNo,
                          });
                        }}
                      />
                    </td>

                    <td data-title={t("Reg. Date")}>{data?.DATE}&nbsp;</td>
                    <td data-title={t("Incubation Date")}>
                      {data?.incubationdate} &nbsp;
                    </td>

                    <td
                      data-title={t("Visit No")}
                      onClick={() => {
                        getdata(data, index);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="text-primary">
                        {loading && index === Index ? (
                          <Loading />
                        ) : (
                          data?.LedgerTransactionNo
                        )}
                        &nbsp;
                      </div>
                    </td>
                    <td data-title={t("Barcode No")}>
                      {data?.BarcodeNo}&nbsp;
                    </td>
                    <td data-title={t("UHID")}>{data?.PatientCode}&nbsp;</td>
                    <td data-title={t("Patient Name")}>
                      {data?.PName}
                      &nbsp;
                    </td>
                    <td data-title={t("Age/Gender")}>
                      {data?.Age_Gender}&nbsp;
                    </td>
                    <td data-title={t("Status")}>{data?.SampleStatus}&nbsp;</td>
                    <td data-title={t("Test")} className="result-entry-test">
                      <p className={`round Status-${data?.Status}`}>
                        {data?.Test}
                      </p>
                      &nbsp;
                    </td>
                    <td data-title={t("Print")}>
                      {(data?.Status == "5" || data?.Status == "6") && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            cursor: "pointer",
                            padding: "5px",
                          }}
                        >
                          {printLoading.Without &&
                          printLoading.index === index ? (
                            <SpinnerLoad />
                          ) : (
                            <i
                              className="fa fa-print iconStyle"
                              style={{
                                cursor: "pointer",
                                textAlign: "center",
                              }}
                              onClick={() =>
                                handleReport(data, "Without", index, 0)
                              }
                              title="Print without header"
                            ></i>
                          )}
                          <br></br>
                          {printLoading.With && printLoading.index === index ? (
                            <SpinnerLoad />
                          ) : (
                            <i
                              className="fa fa-print iconStyle"
                              style={{
                                color: "red",
                                cursor: "pointer",
                                textAlign: "center",
                              }}
                              onClick={() =>
                                handleReport(data, "With", index, 1)
                              }
                              title="Print with header"
                            ></i>
                          )}
                        </div>
                      )}
                      &nbsp;
                    </td>
                    <td data-title={t("Doctor")}>{data?.Doctor}&nbsp;</td>
                    <td data-title={t("Centre")}>{data?.Centre}&nbsp;</td>

                    <td data-title={t("Detail")}>
                      <i
                        className="fa fa-search"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setShowPH(true);
                          setIndex(index);
                        }}
                      />
                      &nbsp;
                    </td>
                    <td data-title={t("View Doc.")}>
                      <div
                        className="text-info"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setShowUD({
                            modal: true,
                            data: data?.PatientGuid,
                            index: index,
                          });
                        }}
                      >
                        <i
                          className="fa fa-file iconStyle"
                          style={{
                            color:
                              data?.UploadDocumentCount > 0 ? "#4ea30c" : "",
                          }}
                        >
                          (&nbsp;{data?.UploadDocumentCount})
                        </i>
                      </div>
                      &nbsp;
                    </td>
                    <td
                      data-title={t("Customize Date")}
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Customize Date"
                    >
                      <div
                        className="text-info text-centre"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setTestID(data.TestID.toString());
                          showDatemodal(true);
                        }}
                      >
                        <i className="fa fa-edit"></i>
                      </div>
                      &nbsp;
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          </Tables>
        ) : (
          <NoRecordFound />
        )}
      </div>
    </>
  );
}

export default RECultureTable;
