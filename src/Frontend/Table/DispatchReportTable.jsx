import React, { useState } from "react";
import parse from "html-react-parser";
import { toast } from "react-toastify";
import { axiosReport, axiosInstance } from "../../utils/axiosInstance";
import { CheckDevice, dateConfig, downloadPdf } from "../../utils/helpers";
import CustomModal from "../utils/CustomModal";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
import Tables from "../../components/UI/customTable";
import Medical from ".././Images/Medical.png";
import file from ".././Images/file.png";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loader/Loading";

import Urgent from ".././Images/urgent.gif";
import SpinnerLoad from "../../components/loader/SpinnerLoad";
import { useTranslation } from "react-i18next";
import axios from "axios";
import UpdateRemark from "../utils/UpdateRemark";
function DispatchTable({
  TableData,
  dispatchData,
  show,
  show2,
  users,
  columnConfig,
  Status,
}) {
  const [modal, setModal] = useState(false);
  const [visitID, setVisitID] = useState();
  const [printLoading, setPrintLoading] = useState({
    With: false,
    Without: false,
    index: -1,
  });
  const { t } = useTranslation();
  const [showUpdateRemark, setShowUpdateRemark] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  const [formData, setFormData] = useState(dispatchData);
  const handleSelectChange = (event, ind) => {
    const { name, value } = event?.target;
    const updatedData = formData.map((ele, index) => {
      return {
        ...ele,
        [name]: value ? value : "",
      };
    });
    setFormData(updatedData);
  };
  const handleCourierSave = () => {
    const CourierData = formData
      .filter((ele, ind) => ele?.IsCourier == 1 && ele?.DocketNo !== "")
      .map((ele, ind) => {
        return {
          DocketNo: ele?.DocketNo,
          LedgertransactionId: ele?.LedgerTransactionID,
        };
      });

    axiosInstance
      .post("Dispatch/SaveDocketNo", { CourierDetail: CourierData })
      .then((res) => {
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        console(err);
      });
  };
  const checkCulture = (data) => {
    const culture = data?.IsCulture?.split("#");
    console.log(culture);
    if (culture.includes("1")) return false;
    else return true;
  };

  const navigate = useNavigate();
  const handleReport = (data, loader, index, PHead) => {
    if (printLoading.index === -1) {
      setPrintLoading({ ...printLoading, index: index });
      let TestIDHash = [];
      let documentlength = document.getElementsByClassName(
        data?.LedgerTransactionID
      );

      const extractedValues = extractValuesFromHtml(data?.Test);
      for (let i = 0; documentlength.length > i; i++) {
        const checkboxValue = documentlength[i].value;
        if (
          documentlength[i].checked &&
          extractedValues.includes(checkboxValue)
        ) {
          TestIDHash.push(
            document.getElementsByClassName(data?.LedgerTransactionID)[i].value
          );
        }
      }
      setPrintLoading({
        [loader]: true,
        index: index,
      });

      if (TestIDHash?.length === 0) {
        TestIDHash.push(...extractedValues);
      }
      const requestOptions = {
        ...(CheckDevice() == 1 && { responseType: "blob" }),
      };
      axiosReport
        .post(
          `commonReports/GetLabReport`,
          {
            TestIDHash: [...new Set(TestIDHash)],
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
  const hideButton = () => {
    const val = dispatchData?.filter((ele) => ele?.IsCourier == 1);
    return val.length > 0 ? true : false;
  };

  const handleCheck = (data) => {
    let check = true;
    const datas = parse(data?.Test);

    if (datas.length > 0) {
      const val = datas?.map((ele) => {
        return ele?.props?.className;
      });
      if (val.includes("round Status-5") || val.includes("round Status-6")) {
        return (check = true);
      } else {
        return (check = false);
      }
    } else {
      return (check =
        datas?.props?.className.includes("round Status-5") ||
        datas?.props?.className.includes("round Status-6"));
    }
  };
  const handleAllAprovedChecked = (e, data) => {
    const { checked } = e.target;
    let documentlength = document.getElementsByClassName(
      data?.LedgerTransactionID
    );
    for (let i = 0; documentlength.length > i; i++) {
      if (documentlength[i].id == data?.LedgerTransactionID) {
        documentlength[i].checked = checked;
      }
    }
  };
  console.log(dispatchData);
  const extractValuesFromHtml = (htmlString) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;

    const inputElements = tempDiv.querySelectorAll('input[type="checkbox"]');
    const extractedValues = Array.from(inputElements).map(
      (input) => input.value
    );

    return extractedValues;
  };
  // const column = [
  //   { header: "S.No", visible: true },
  //   { header: "Reg Date", visible: true },
  //   { header: "Visit No", visible: true },
  //   { header: "Barcode No", visible: true },
  //   { header: "Doctor", visible: true },
  //   { header: "Name", visible: true },
  //   { header: "Mobile", visible: true },
  //   { header: "Remarks", visible: true },
  //   { header: "Age/Gender", visible: true },
  //   { header: "Test", visible: true },
  //   { header: "Print", visible: true },
  //   { header: "UHID", visible: true },
  //   { header: "Centre", visible: true },

  //   { header: "RateType", visible: true },
  //   // {
  //   //   header: "SaveCourier",
  //   //   visible: true,
  //   //   type: "button",
  //   //   buttonProps: {
  //   //     className: "btn btn-success btn-sm btn-block",
  //   //     onClick: handleCourierSave,
  //   //   },
  //   // },
  //   {
  //     header: "Uploaded Document",
  //     visible: true,
  //     icon: "fa-file",
  //     tooltip: "Uploaded Document",
  //     style: { margin: "2px 8px" },
  //   },
  //   {
  //     header: "Medical History",
  //     visible: true,
  //     icon: "fa-calendar",
  //     tooltip: "Medical History",
  //     style: { margin: "2px 8px" },
  //   },
  //   {
  //     header: "Search",
  //     visible: true,
  //     icon: "fa-search",
  //   },
  // ];

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
      {dispatchData.length > 0 ? (
        <div className="p-2 ">
          <Tables>
            <div>
              <thead>
                <tr>
                  {columnConfig.map(
                    (col, index) =>
                      col.visible && (
                        <th key={index}>
                          {col?.icon ? (
                            <>
                              <i
                                className={`fa ${col?.icon}`}
                                data-toggle="tooltip"
                                title={col?.tooltip || col?.header}
                                style={col?.style}
                              />
                            </>
                          ) : (
                            t(col?.header)
                          )}
                        </th>
                      )
                  )}
                </tr>
              </thead>

              <tbody>
                {dispatchData.map((data, rowIndex) => (
                  <tr key={rowIndex}>
                    {columnConfig.map((col, index) =>
                      col.visible ? (
                        <td key={index} data-title={t(col.header)}>
                          {col.header === "S.No" && (
                            <div className="d-flex">
                              {rowIndex + 1} &nbsp; &nbsp;
                              {data?.isUrgent == 1 && (
                                <div>
                                  <img src={Urgent} className="sizeicon"></img>
                                </div>
                              )}
                            </div>
                          )}
                          {col.header === "Reg Date" && dateConfig(data.Date)}
                          {col.header === "Visit No" && data?.VisitNo}
                          {col.header === "Barcode No" && data?.SinNo}
                          {col.header === "Doctor" && data?.DoctorName}
                          {col.header === "Name" && data?.PatientName}
                          {col.header === "Mobile" && data?.Mobile}
                          {col.header === "Remarks" && (
                            <div
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
                          {col.header === "Test" && (
                            <div className="printTest">{parse(data?.Test)}</div>
                          )}
                          {col.header === "Print" && (
                            <div>
                              {handleCheck(data) && (
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {printLoading.Without &&
                                  printLoading.index === rowIndex ? (
                                    <div>
                                      <SpinnerLoad />
                                    </div>
                                  ) : (
                                    <i
                                      className="fa fa-print iconStyle"
                                      style={{
                                        cursor: "pointer",
                                        textAlign: "center",
                                      }}
                                      onClick={() =>
                                        handleReport(
                                          data,
                                          "Without",
                                          rowIndex,
                                          0
                                        )
                                      }
                                      title="Print without header"
                                    ></i>
                                  )}
                                  &nbsp;&nbsp;
                                  {printLoading.With &&
                                  printLoading.index === rowIndex ? (
                                    <div>
                                      <SpinnerLoad />
                                    </div>
                                  ) : (
                                    <i
                                      className="fa fa-print iconStyle"
                                      style={{
                                        color: "red",
                                        cursor: "pointer",
                                        textAlign: "center",
                                      }}
                                      onClick={() =>
                                        handleReport(data, "With", rowIndex, 1)
                                      }
                                      title="Print with header"
                                    ></i>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          {col.header === "UHID" && data?.PatientCode}
                          {col?.header === "Dept.Category" && data?.Category}
                          {col?.header === "VisitType" && data?.VisitType}
                          {col.header === "Centre" && data?.Centre}
                          {col.header === "RateType" && data?.RateTypeName}
                          {col.header === "Uploaded Document" && (
                            <div
                              className="text-primary"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                show2({
                                  modal: true,
                                  data: data?.PatientGuid,
                                  index: rowIndex,
                                })
                              }
                            >
                              <img src={file} className="sizeicon" />
                              &nbsp;{data?.UploadDocumentCount}
                            </div>
                          )}
                          {col.header === "Medical History" && (
                            <div
                              className="text-primary"
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                show({
                                  modal: true,
                                  data: data?.PatientGuid,
                                  index: rowIndex,
                                })
                              }
                            >
                              <img src={Medical} className="sizeicon" />
                              &nbsp;{data?.MedicalHistoryCount}
                              {/* Medical History icon */}
                            </div>
                          )}
                          {col.header === "Search" && (
                            <i
                              className="fa fa-search pointer text-primary"
                              onClick={() => {
                                setModal(true);
                                setVisitID(data?.VisitNo);
                              }}
                            />
                          )}
                        </td>
                      ) : null
                    )}
                  </tr>
                ))}
              </tbody>
            </div>
          </Tables>
        </div>
      ) : (
        <NoRecordFound />
      )}
      {modal && (
        <CustomModal
          show={modal}
          visitID={visitID}
          onHide={() => setModal(false)}
        />
      )}
    </>
  );
}

export default DispatchTable;
