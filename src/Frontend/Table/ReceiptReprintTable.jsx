import React, { useState } from "react";
import { axiosInstance, axiosReport } from "../../utils/axiosInstance";
import { dateConfig, IndexHandle } from "../../utils/helpers";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Tables from "../../components/UI/customTable";
import CustomModal from "../utils/CustomModal";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
import Tooltip from "../../components/formComponent/Tooltip";
import Loading from "../../components/loader/Loading";
import SendEmailModalReprint from "../utils/SendEmailModalReprint";
import Medical from ".././Images/Medical.png";
import file from ".././Images/file.png";
import email from ".././Images/email.png";
import SeeMoreIconInTable from "./SeeMoreIconInTable";
import SpinnerLoad from "../../components/loader/SpinnerLoad";
import UpdateRemark from "../utils/UpdateRemark";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { useTranslation } from "react-i18next";
const ReceiptReprintTable = ({
  receiptData,
  TableData,
  show,
  show2,
  currentPage,
  pageSize,
  columnConfig,
  Status,
}) => {
  const [modal, setModal] = useState(false);
  const DesignationName = useLocalStorage("userData", "get")?.DesignationName;
  const [visitID, setVisitID] = useState();
  const [showEmail, setShowEmail] = useState({
    modal: false,
    patientData: {},
  });
  const [printLoading, setPrintLoading] = useState({
    loading: false,
    index: -1,
  });
  const [showUpdateRemark, setShowUpdateRemark] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  console.log(receiptData, "tableData---");
  const [t] = useTranslation();
  const [printLoadingFP, setPrintLoadingFP] = useState({
    loading: false,
    index: -1,
  });
  const [printLoadingReciept, setPrintLoadingReciept] = useState({
    loading: false,
    index: -1,
  });
  const [showPatientImage, setShowPatientImage] = useState({
    show: false,
    data: "",
    index: -1,
    loading: false,
  });

  console.log(printLoading);
  const getColor = (status) => {
    if (status) {
      switch (status) {
        case "fullpaid":
          return "#00FA9A";
        case "partialpaid":
          return "#F6A9D1";
        case "fullyunpaid":
          return "#FF457C";
        case "credit":
          return "#b3cdb3";
        case "fullrefund":
          return "#CEE1FF";
        case "All":
          return "white";
        default:
          break;
      }
    }
  };
  const handleClose = () => {
    setShowEmail({ ...showEmail, modal: false, patientData: {} });
  };
  const getBarcodeData = (testId, VisitNo, SINNo) => {
    let arr = testId?.split(",");
    axiosInstance
      .post("SC/getBarcode", {
        LedgerTransactionNo: VisitNo,
        BarcodeNo: SINNo,
        TestID: arr,
      })
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        if (err.response.status === 504) {
          toast.error(t("Something Went Wrong"));
        }
        if (err.response.status === 401) {
          toast.error(err.response.data.message);
        }
      });
  };
  const getReceipt = (id, index) => {
    if (printLoading.index === -1) {
      setPrintLoading({
        loading: true,
        index: index,
      });
      axiosReport
        .post("getReceipt", {
          LedgerTransactionIDHash: id,
        })
        .then((res) => {
          window.open(res?.data?.url, "_blank");
          setPrintLoading({
            loading: false,
            index: -1,
          });
        })
        .catch((err) => {
          setPrintLoading({
            loading: false,
            index: -1,
          });
          toast.error(
            err?.data?.response?.message
              ? err?.data?.response?.message
              : t("Error Occured")
          );
        });
    } else {
      toast.warn("Please wait Generating Receipt");
    }
  };
  const getReceiptNew = (id, index) => {
    if (printLoading.index === -1) {
      setPrintLoadingReciept({
        loading: true,
        index: index,
      });
      axiosReport
        .post("getReceiptNew", {
          LedgerTransactionIDHash: id,
        })
        .then((res) => {
          window.open(res?.data?.url, "_blank");
          setPrintLoadingReciept({
            loading: false,
            index: -1,
          });
        })
        .catch((err) => {
          setPrintLoadingReciept({
            loading: false,
            index: -1,
          });
          toast.error(
            err?.data?.response?.message
              ? err?.data?.response?.message
              : t("Error Occured")
          );
        });
    } else {
      toast.warn("Please wait Generating Receipt");
    }
  };
  const getReceiptFullyPaid = (id, index) => {
    if (printLoadingFP.index === -1) {
      setPrintLoadingFP({
        loading: true,
        index: index,
      });
      axiosReport
        .post("getReceiptFullyPaid", {
          LedgerTransactionIDHash: id,
        })
        .then((res) => {
          setPrintLoadingFP({
            loading: false,
            index: -1,
          });
          window.open(res?.data?.url, "_blank");
        })
        .catch((err) => {
          setPrintLoadingFP({
            loading: false,
            index: -1,
          });
          toast.error(
            err?.data?.response?.message
              ? err?.data?.response?.message
              : "Error Occured"
          );
        });
    } else {
      toast.warn("Please wait Generating Receipt");
    }
  };

  const Fetch = async (guidNumber, pageName) => {
    const response = await axiosInstance.post("CommonController/GetDocument", {
      Page: pageName,
      Guid: guidNumber,
    });
    return response?.data?.message;
  };

  const getS3url = async (id) => {
    const response = await axiosInstance.post("CommonController/GetFileUrl", {
      Key: id,
    });
    return response?.data?.message;
  };

  const handlePreviewImage = async (guidNumber) => {
    const response = await Fetch(guidNumber, "patientImage");
    if (response.length > 0) {
      const imgURL = await getS3url(response[0]?.awsKey);
      setShowPatientImage({
        show: true,
        data: imgURL,
        index: -1,
        loading: false,
      });
    } else {
      toast.error("No Patient Image Found");
      setShowPatientImage({
        show: false,
        data: "",
        index: -1,
        loading: false,
      });
    }
  };

  const handlePatientImage = async (guid, index) => {
    console.log(guid);
    if (!guid) {
      toast.error("No Image found");
    } else {
      setShowPatientImage({
        show: false,
        data: "",
        index: index,
        loading: true,
      });
      await handlePreviewImage(guid);
    }
  };

  return (
    <>
      {showUpdateRemark?.modal && (
        <UpdateRemark
          show={showUpdateRemark?.modal}
          handleShow={() =>
            setShowUpdateRemark({ modal: false, data: "", index: -1 })
          }
          state={showUpdateRemark?.data}
          PageName={showUpdateRemark?.data?.Remarks}
          status={Status}
          title={"Remarks"}
          TableData={TableData}
        />
      )}
      {receiptData?.length > 0 ? (
        <>
          {showEmail?.modal && (
            <SendEmailModalReprint
              show={showEmail?.modal}
              data={showEmail?.patientData}
              handleClose={handleClose}
            />
          )}
          <div className="p-2">
            <Tables>
              <thead className="cf">
                <tr>
                  {columnConfig?.map((col, idx) =>
                    col.visible ? (
                      <th key={idx} className={col.icon ? "text-center" : ""}>
                        {!col.icon && t(col.header)}
                        {col.icon && (
                          <i
                            className={`fa ${col.icon}`}
                            aria-hidden="true"
                          ></i>
                        )}
                      </th>
                    ) : null
                  )}
                </tr>
              </thead>
              <tbody>
                {receiptData.map((data, index) => (
                  <tr
                    key={index}
                    style={{ background: getColor(data?.reportStatus) }}
                  >
                    {columnConfig?.map((col, idx) =>
                      col.visible ? (
                        <td key={idx} data-title={t(col.header)}>
                          {col.header === "Action" && (
                            <div className="d-flex">
                              <span>
                                {" "}
                                {index + 1 + IndexHandle(currentPage, pageSize)}
                              </span>
                              <span title="More Actions">
                                <SeeMoreIconInTable
                                  receiptData={data}
                                  index={index}
                                  getReceipt={getReceipt}
                                  getReceiptFullyPaid={getReceiptFullyPaid}
                                  setVisitID={setVisitID}
                                  setModal={setModal}
                                  setShowEmail={setShowEmail}
                                  show2={show2}
                                  show3={show}
                                  DesignationName={DesignationName}
                                />
                              </span>
                            </div>
                          )}
                          {col.header === "Reg Date" && (
                            <div>{dateConfig(data.Date)}</div>
                          )}

                          {col.header === "Visit No" &&
                            data?.LedgerTransactionNo}
                          {col.header === "Apex Billno" &&
                            data?.Apexbillnumber}
                          {col.header === "UHID" && data?.PatientCode}
                          {col.header === "Patient Name" && (
                            <div>
                              {showPatientImage.loading &&
                              index === showPatientImage.index ? (
                                <Loading />
                              ) : (
                                <span
                                  className="fa fa-user custom-pointer"
                                  onClick={() =>
                                    handlePatientImage(data?.PatientGuid, index)
                                  }
                                ></span>
                              )}
                              &nbsp;&nbsp;&nbsp;
                              <span>{`${data?.FirstName} ${data?.MiddleName} ${data?.LastName}`}</span>
                            </div>
                          )}
                          {col.header === "Remarks" && (
                            <div
                              // title={
                              //   data?.Remarks?.length > 2
                              //     ? data?.Remarks?.slice(0, 3) + "..."
                              //     : ""
                              // }
                              className="m-0 p-0"
                              onClick={() => {
                                setShowUpdateRemark({
                                  modal: true,
                                  data: data,
                                  index: index,
                                });
                              }}
                            >
                              {!data?.Remarks ? (
                                <i className="bi bi-chat-right-text m-0 text-icon-size-comment ml-2"></i>
                              ) : (
                                <div className="d-flex align-items-center blink-icon">
                                  {data?.Remarks
                                    ? data?.Remarks.length > 20
                                      ? data?.Remarks.slice(0, 15) + "..."
                                      : data?.Remarks
                                    : ""}
                                </div>
                              )}
                            </div>
                          )}
                          {col.header === "Age/Gender" &&
                            `${data?.Age}/${data?.Gender == "Female" ? "F" : "M"}`}
                          {col.header === "Mobile No" && data?.Mobile}
                          {col.header === "Gross Amt" && (
                            <div className="amount">{data?.GrossAmount}</div>
                          )}
                          {col.header === "Dis Amt" && (
                            <div className="amount">
                              {data?.DiscountOnTotal.toFixed(2)}
                            </div>
                          )}
                          {col.header === "Net Amt" && (
                            <div className="amount">{data?.NetAmount}</div>
                          )}
                          {col.header === "Due Amt" && (
                            <div className="amount">{data?.DueAmount}</div>
                          )}
                          {col.header === "Paid Amt" && (
                            <div className="amount">{data?.Adjustment}</div>
                          )}
                          {col.header === "Centre" && data?.Centre}
                          {col.header === "RateType" && data?.RateType}
                          {col.header === "Doctor" && data?.DoctorName}
                          {col.header === "User" && data?.CreatedByName}
                          {col.header === "Edit Info" &&
                            (data?.CentreType == "B2B" &&
                            DesignationName == "B2B" ? (
                              ""
                            ) : (
                              <Link
                                to={`/EditPatientInfo`}
                                state={{ data: data?.LedgerTransactionNo }}
                              >
                                <i
                                  className="fa fa-edit"
                                  aria-hidden="true"
                                ></i>
                              </Link>
                            ))}
                          {col.header === "Rec Edit" && (
                            <Link
                              to={`/EditPatientDetails`}
                              state={{ data: data?.LedgerTransactionNo }}
                            >
                              {t("Rec Edit")}
                            </Link>
                          )}

                          {col.header === "Cash Receipt Thermal" &&
                            data?.HideReceipt !== 1 && (
                              <>
                                {printLoadingReciept.loading &&
                                printLoadingReciept.index === index ? (
                                  <div>
                                    <SpinnerLoad />
                                  </div>
                                ) : (
                                  <i
                                    className="pi pi-money-bill text-primary"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      getReceiptNew(
                                        data?.LedgertransactionIDHash,
                                        index
                                      )
                                    }
                                  />
                                )}
                              </>
                            )}

                          {col.header === "Cash Receipt" &&
                            data?.HideReceipt !== 1 && (
                              <>
                                {printLoading.loading &&
                                printLoading.index === index ? (
                                  <div>
                                    <SpinnerLoad />
                                  </div>
                                ) : (
                                  <i
                                    className="pi pi-money-bill text-primary"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      getReceipt(
                                        data?.LedgertransactionIDHash,
                                        index
                                      )
                                    }
                                  />
                                )}
                              </>
                            )}

                          {col.header === "FullyPaid" &&
                            data?.HideReceipt !== 1 && (
                              <>
                                {printLoadingFP.loading &&
                                printLoadingFP.index === index ? (
                                  <div>
                                    <SpinnerLoad />
                                  </div>
                                ) : (
                                  <i
                                    className="pi pi-money-bill text-primary"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      getReceiptFullyPaid(
                                        data?.LedgertransactionIDHash,
                                        index
                                      )
                                    }
                                  />
                                )}
                              </>
                            )}
                          {col.header === "View Details" && (
                            <i
                              className="fa fa-search"
                              onClick={() => {
                                setModal(true);
                                setVisitID(data?.LedgerTransactionNo);
                              }}
                            />
                          )}
                          {col.header === "Send Email" && (
                            <img
                              src={email}
                              className="sizeicon"
                              onClick={() =>
                                setShowEmail({
                                  ...showEmail,
                                  modal: true,
                                  patientData: data,
                                })
                              }
                            />
                          )}
                          {col.header === "UploadDocument" && (
                            <div
                              className="text-primary"
                              style={{
                                cursor: "pointer",
                                color:
                                  data?.UploadDocumentCount > 0
                                    ? "#4ea30c"
                                    : "",
                              }}
                              onClick={() => {
                                show2({
                                  modal: true,
                                  data: data?.PatientGuid,
                                  index: index,
                                });
                              }}
                            >
                              <img src={file} className="sizeicon" />
                              &nbsp;{data?.UploadDocumentCount}
                            </div>
                          )}
                          {col.header === "Medical History" && (
                            <div
                              className="text-primary"
                              style={{
                                cursor: "pointer",
                                color:
                                  data?.MedicalHistoryCount > 0
                                    ? "#4ea30c"
                                    : "",
                              }}
                              onClick={() => {
                                show({
                                  modal: true,
                                  data: data?.PatientGuid,
                                  index: index,
                                });
                              }}
                            >
                              <img src={Medical} className="sizeicon" />
                              &nbsp;{data?.MedicalHistoryCount}
                            </div>
                          )}
                        </td>
                      ) : null
                    )}
                  </tr>
                ))}
              </tbody>
            </Tables>{" "}
          </div>
          {modal && (
            <CustomModal
              show={modal}
              visitID={visitID}
              onHide={() => setModal(false)}
            />
          )}{" "}
        </>
      ) : (
        <NoRecordFound />
      )}
    </>
  );
};

export default ReceiptReprintTable;
