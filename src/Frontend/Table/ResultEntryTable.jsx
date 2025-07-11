import React, { useState, useRef, useEffect } from "react";
import parse from "html-react-parser";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { CheckDevice, dateConfig, downloadPdf } from "../../utils/helpers";
import Loading from "../../components/loader/Loading";
import CustomModal from "../utils/CustomModal";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
import Medical from ".././Images/Medical.png";
import file from ".././Images/file.png";
import Tables from "../../components/UI/customTable";
import { axiosReport } from "../../utils/axiosInstance";
import CustomDateModal from "../utils/CustomDateModal";
import CryptoJS from "crypto-js";
import Urgent from ".././Images/urgent.gif";
import SpinnerLoad from "../../components/loader/SpinnerLoad";
import Tooltip from "../../components/formComponent/Tooltip";
import UpdateRemark from "../utils/UpdateRemark";
import { Link } from "react-router-dom";
function RETable({
  redata,
  GetResultEntry,
  show,
  show2,
  columnConfig,
  TableData,
  Status,
  selectedRowIndex,
  setSelectedRowIndex,
  doctorAdmin,
  machine,
}) {
  const [modal, setModal] = useState(false);
  const [datemodal, showDatemodal] = useState(false);
  const [visitID, setVisitID] = useState();
  const [TestID, setTestID] = useState();
  const [loading, setLoading] = useState(false);
  const [Index, setIndex] = useState(-1);
  const [printLoading, setPrintLoading] = useState({
    With: false,
    Without: false,
    index: -1,
  });
  const [showUpdateRemark, setShowUpdateRemark] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  // console.log(redata)
  const tdRefs = useRef([]);
  useEffect(() => {
    if (tdRefs?.current[selectedRowIndex]) {
      tdRefs?.current[selectedRowIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [selectedRowIndex]);

  const { t } = useTranslation();
  console.log(selectedRowIndex);
  const handleCheck = (data) => {
    let check = true;
    const datas = parse(data?.TestName);

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

  const handleReport = (data, loader, index, PHead) => {
    if (printLoading.index === -1) {
      setPrintLoading({ ...printLoading, index: index });
      let TestIDHash = [];
      let documentlength = document.getElementsByClassName(
        data?.LedgerTransactionID
      );

      const extractedValues = extractValuesFromHtml(data?.TestName);

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

  const copyToClipboard = (phone) => {
    console.log(phone);
    navigator.clipboard.writeText(phone);
    // toast.success("Copied T");
  };
  const handleClickResultEntry = (data, index) => {
    setIndex(index);
    // console.log(doctorAdmin)
    setSelectedRowIndex(index);
    GetResultEntry(
      {
        TestID: data?.TestID,
        LedgerTransactionID: "",
        DepartmentID: "",
        symbol: "",
        Mobile: data?.Mobile,
        VisitNo: data?.VisitNo,
        PEmail: data?.PEmail,
        MacID: machine[0]?.value ?? "",
        LedgertransactionIDHash: data?.LedgertransactionIDHash,
        isOutSource: data?.isOutSource,
        index: index,
        ApprovedBy:
          doctorAdmin?.length == 1 ? doctorAdmin[0]?.value?.toString() : "0",
      },

      index,
      setLoading
    );
    // }
  };

  const encryptData = (data, index) => {
    const secretKey = "resultentry";
    const filteredData = {
      TestID: data?.TestID,
      Mobile: data?.Mobile,
      VisitNo: data?.VisitNo,
      PEmail: data?.PEmail,
      LedgertransactionIDHash: data?.LedgertransactionIDHash,
      isOutSource: data?.isOutSource,
      index: index,
      ApprovedBy:
        doctorAdmin?.length == 1 ? doctorAdmin[0]?.value?.toString() : "0",
      MacID: machine[0]?.value ?? "",
    };
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(filteredData),
      secretKey
    ).toString();
    return encodeURIComponent(encrypted);
  };
  const extractValuesFromHtml = (htmlString) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;

    const inputElements = tempDiv.querySelectorAll('input[type="checkbox"]');
    const extractedValues = Array.from(inputElements).map(
      (input) => input.value
    );

    return extractedValues;
  };

  const handleAllAprovedChecked = (e, data) => {
    const { checked } = e.target;

    let documentlength = document.getElementsByClassName(
      data?.LedgerTransactionID
    );
    const extractedValues = extractValuesFromHtml(data?.Test);

    for (let i = 0; i < documentlength.length; i++) {
      const checkboxValue = documentlength[i].value;

      if (extractedValues.includes(checkboxValue)) {
        documentlength[i].checked = checked;
      }
    }
  };

  // const columns = [
  //   { header: "S.No", visible: true },
  //   { header: "Reg Date", visible: true },
  //   { header: "Visit No", visible: true },
  //   { header: "Barcode No", visible: true },
  //   { header: "UHID", visible: true },
  //   { header: "Name", visible: true },
  //   { header: "Mobile", visible: true },
  //   { header: "Age/Gender", visible: true },
  //   { header: "Test", visible: true },
  //   { header: "Print", visible: true },
  //   { header: "Doctor", visible: true },
  //   { header: "Centre", visible: true },
  //   { header: "RateType", visible: true },
  //   { header: "Dep. Receive Time", visible: true },
  //   { header: "Remarks", visible: true },
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
  //     icon: "fa-h-square",
  //     tooltip: "Medical History",
  //     style: { margin: "2px 8px" },
  //   },
  //   {
  //     header: "Customize Date",
  //     visible: true,
  //     icon: "fa fa-edit",
  //     tooltip: "Medical History",
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
      {redata.length > 0 ? (
        <div className="p-2 ">
          <Tables>
            <div>
              <thead
                className=""
                style={{
                  position: "sticky",
                  top: 0,
                }}
              >
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
              <tbody
                style={{
                  backgroundColor:
                    printLoading?.With || printLoading?.Without
                      ? "rgba(181, 209, 218, 0.5)"
                      : "",
                }}
              >
                {redata.map((data, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: data?.isOutSource == 1 ? "pink" : "",
                    }}
                    ref={(el) => (tdRefs.current[index] = el)}
                  >
                    {columnConfig.map(
                      (col, colIndex) =>
                        col.visible && (
                          <td
                            key={colIndex}
                            style={{
                              backgroundColor:
                                data?.isOutSource == 1
                                  ? "pink"
                                  : selectedRowIndex === index
                                    ? "#FCFACA"
                                    : "",
                            }}
                            data-title={t(col.header)}
                            onClick={() => {
                              col.header === "Visit No" &&
                                copyToClipboard(data?.VisitNo);
                            }}
                          >
                            {col.header === "S.No" && (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                }}
                              >
                                <div>{index + 1}</div>
                                &nbsp;
                                {data.StatSample == 1 ? (
                                  <div>
                                    <span
                                      className="fa fa-cog fa-spin"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title="STATSample"
                                    ></span>
                                  </div>
                                ) : (
                                  <></>
                                )}
                                &nbsp;
                                <div>
                                  <i
                                    className="fa fa-search"
                                    onClick={() => {
                                      setModal(true);
                                      setVisitID(data?.VisitNo);
                                    }}
                                    style={{ cursor: "pointer" }}
                                  />
                                </div>
                                &nbsp; &nbsp;
                                {data?.isUrgent == 1 && (
                                  <div>
                                    <img
                                      src={Urgent}
                                      className="sizeicon"
                                    ></img>
                                  </div>
                                )}
                              </div>
                            )}
                            {col.header === "Reg Date" &&
                              dateConfig(data?.Date)}
                            {col.header === "Visit No" && (
                              <div
                                style={{
                                  cursor: "pointer",
                                  display: "flex",
                                  justifyContent: "space-around",
                                }}
                              >
                                <div
                                  className="text-primary"
                                  onClick={() => {
                                    handleClickResultEntry(data, index);
                                  }}
                                >
                                  {loading && index === Index ? (
                                    <Loading />
                                  ) : (
                                    data?.VisitNo
                                  )}
                                </div>
                                <Link
                                  to={{
                                    pathname: "/ResultEntry",
                                    search: `?id=${encryptData(data, index)}`,
                                  }}
                                  target="_blank"
                                >
                                  <i
                                    className="ml-2 mr-2 mb-1 bi bi-box-arrow-in-up-right text-icon-size-arrow"
                                    style={{ color: "#1FA4E3" }}
                                  ></i>{" "}
                                </Link>
                              </div>
                            )}
                            {col.header === "Barcode No" && data?.SinNo}
                            {col.header === "UHID" && data?.PatientCode}
                            {col.header === "Name" && data?.PatientName}
                            {col.header === "Mobile" && data?.Mobile}
                            {col.header === "Age/Gender" &&
                              `${data?.Age}/${data?.Gender == "Female" ? "F" : "M"}`}
                            {col.header === "Test" && (
                              <div className="printTest">
                                {parse(data?.TestName)}
                              </div>
                            )}
                            {col.header === "Print" && handleCheck(data) && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  cursor: "pointer",
                                }}
                              >
                                {printLoading.Without &&
                                printLoading.index === index ? (
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
                                      handleReport(data, "Without", index, 0)
                                    }
                                    title="Print without header"
                                  ></i>
                                )}
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                {printLoading.With &&
                                printLoading.index === index ? (
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
                                      handleReport(data, "With", index, 1)
                                    }
                                    title="Print with header"
                                  ></i>
                                )}
                              </div>
                            )}
                            {col.header === "Doctor" && data?.DoctorName}
                            {col?.header === "Dept.Category" && data?.Category}
                            {col?.header === "VisitType" && data?.VisitType}
                            {col.header === "Centre" && data?.Centre}
                            {col.header === "RateType" && data?.RateTypeName}
                            {col.header === "Dep. Receive Time" &&
                              moment(data?.SampleReceiveDate).format(
                                "DD/MMM/YYYY hh:mm:ss"
                              )}
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
                                )}{" "}
                              </div>
                            )}
                            {col.header === "Uploaded Document" && (
                              <img
                                src={file}
                                className="sizeicon"
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
                              />
                            )}
                            {col.header === "Medical History" && (
                              <img
                                src={Medical}
                                className="sizeicon"
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
                              />
                            )}
                            {col.header === "Customize Date" && (
                              <i
                                className="fa fa-edit"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  setTestID(data.TestID);
                                  showDatemodal(true);
                                }}
                              />
                            )}
                          </td>
                        )
                    )}
                  </tr>
                ))}
              </tbody>
            </div>
          </Tables>
        </div>
      ) : (
        <div className="">
          <NoRecordFound />
        </div>
      )}
      {modal && (
        <CustomModal
          show={modal}
          visitID={visitID}
          onHide={() => setModal(false)}
        />
      )}
      {datemodal && (
        <CustomDateModal
          Status={Status}
          SearchFunction={TableData}
          show={datemodal}
          data={TestID}
          onHide={() => showDatemodal(false)}
        />
      )}
    </>
  );
}

export default RETable;
