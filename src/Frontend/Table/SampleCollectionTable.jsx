import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";
import { NoOfPricks, SampleSource } from "../../utils/Constants";
import { getSampleType } from "../../utils/NetworkApi/commonApi";
import { axiosInstance } from "../../utils/axiosInstance";
import SampleRemark from "../utils/SampleRemark";
import DOSModal from "../utils/DOSModal";
import { SelectBox } from "../../components/formComponent/SelectBox";
import RejectModal from "../utils/RejectModal";

import { useTranslation } from "react-i18next";
import SampleHisto from "./SampleHisto";
import Tooltip from "../../components/formComponent/Tooltip";
function SampleCollectionTable({
  data,
  index,
  payload,
  setPayload,
  setSearchInvdata,
  searchInvdata,
  TableData,
  handleBarcode,
  handleCloseBarcodeModal,
  handleValQty,
  snr,
}) {
  const [t] = useTranslation();
  const [sampleTypeDropdown, setSampleTypeDropdown] = useState([]);
  const [show, setShow] = useState(false);
  const [remarkShow, setRemarkShow] = useState(false);
  const [dos, setDos] = useState(false);
  const [mouseHover, setMouseHover] = useState({
    index: -1,
    data: "",
  });
  const handleShow = () => {
    setShow(!show);
  };
  const handleChange = (e, index, sin, selected) => {
    const { name, value } = e.target;
    const data = [...searchInvdata];
    if (name === "SampleTypeID") {
      const selctedvalue = sampleTypeDropdown.find((ele) => ele.value == value);
      data[index][name] = selctedvalue?.value;
      data[index]["SampleType"] = selctedvalue?.label;
      setSearchInvdata(data);
    } else if (name === "NoOfPricks") {
      const newdata = searchInvdata.map((ele) => {
        if (
          sin === ele?.SINNo &&
          (ele.Status === 1 || ele.Status === 4) &&
          ele.PricksNotRequired == 0
        ) {
          return {
            ...ele,
            [name]: value,
            PricksRemarks: value === "" ? "" : ele?.PricksRemarks,
          };
        } else {
          return { ...ele };
        }
      });
      newdata[index][name] = value;
      setSearchInvdata(newdata);
    } else if (name === "PricksRemarks") {
      const newdata = searchInvdata.map((ele) => {
        if (
          sin === ele?.SINNo &&
          (ele.Status === 1 || ele.Status === 4) &&
          ele.PricksNotRequired == 0
        ) {
          return {
            ...ele,
            [name]: value,
          };
        } else {
          return { ...ele };
        }
      });
      newdata[index][name] = value;
      setSearchInvdata(newdata);
    } else {
      data[index][name] = value;
      setSearchInvdata(data);
    }
  };
  const getBarcodeData = (testId, VisitNo, SINNo) => {
    const arr = [];
    arr.push(testId);
    axiosInstance
      .post("SC/getBarcode", {
        LedgerTransactionNo: VisitNo,
        BarcodeNo: SINNo,
        TestID: arr,
      })
      .then((res) => {
        if (res?.data?.message != "") window.open(res?.data?.message);
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

  const getAllDepartmentBarcodeData = (LedgerTransactionID, DepartmentID) => {
    axiosInstance
      .post("SC/getDepartmentwiseBarcode", {
        LedgerTransactionID: Number(LedgerTransactionID),
        DepartmentId: Number(DepartmentID),
      })
      .then((res) => {
        if (res?.data?.message != "") window.open(res?.data?.message);
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

  const handlePayload = (e, index, data) => {
    const { checked } = e.target;
    if (checked) {
      if (data?.SINNo?.length >= 3) {
        const val = [...searchInvdata];
        val[index]["isSelected"] = checked;
        setSearchInvdata(val);
        setPayload([...payload, data]);
      } else {
        toast.error(
          t("Barcode is Required Field and Should Contain atleast 3 character")
        );
      }
    } else {
      const val = [...searchInvdata];
      val[index]["isSelected"] = checked;
      setSearchInvdata(val);
      const filterdata = payload.filter((ele) => ele?.TestID !== data?.TestID);
      setPayload(filterdata);
    }
  };

  useEffect(() => {
    getSampleType(setSampleTypeDropdown, data?.InvestigationID);
  }, []);

  // console.log(data?.isSelected);
  const handleShowRemark = () => {
    setRemarkShow((prev) => !prev);
  };
  console.log(searchInvdata);
  const handleSaveRemarks = (value, index, sin) => {
    handleShowRemark();
    const newdata = searchInvdata.map((ele) => {
      if (
        sin === ele?.SINNo &&
        (ele.Status === 1 || ele.Status === 4) &&
        ele.PricksNotRequired == 0
      ) {
        return {
          ...ele,
          ["PricksRemarks"]: value,
        };
      } else {
        return { ...ele };
      }
    });
    newdata[index]["PricksRemarks"] = value;
    setSearchInvdata(newdata);
  };

  return (
    <>
      {remarkShow && (
        <SampleRemark
          show={remarkShow}
          PageName={data?.PricksRemarks}
          handleShow={handleShowRemark}
          state={data}
          handleSave={handleSaveRemarks}
          title={"Enter Remark"}
        />
      )}
      {dos && (
        <DOSModal
          show={dos}
          LTData={data}
          onHandleShow={() => setDos(false)}
          id={data?.InvestigationID}
        />
      )}
      {show && (
        <RejectModal
          show={show}
          handleShow={handleShow}
          data={data}
          TableData={TableData}
        />
      )}
      <td className={`color-Status-${data.Status} `} data-title={t("S.No")}>
        {index + 1}
        {data.StatSample == 1 ? (
          <span
            className="fa fa-cog fa-spin"
            data-toggle="tooltip"
            data-placement="top"
            title="STATSample"
          ></span>
        ) : (
          <></>
        )}
      </td>

      <td
        data-title={t("Test")}
        onMouseEnter={() => {
          if (data?.SampleRemarks != "") {
            setMouseHover({
              index: index,
              data: data?.SampleRemarks,
            });
          }
        }}
        onMouseLeave={() => {
          if (data?.SampleRemarks != "") {
            setMouseHover({
              index: -1,
              data: "",
            });
          }
        }}
      >
        {mouseHover?.index === index && data?.SampleRemarks && (
          <div className="sampleremarktest">
            <span>{mouseHover?.data}</span>
          </div>
        )}
        {data?.Test}
      </td>
      <td data-title={t("Barcode No")}>
        <input
          value={data?.SINNo}
          name="SINNo"
          className="form-control"
          max={15}
          disabled={
            // !!data?.SINNo||

            [1, 2].includes(data?.BarcodeLogic)
              ? true
              : data?.isSelected === true
                ? true
                : false
          }
          onChange={(e) =>
            handleBarcode(e, data?.BarcodeLogic, data?.SampleTypeID)
          }
          onBlur={(e) => {
            handleCloseBarcodeModal(
              e.target.value,
              data?.LedgerTransactionID,
              data?.BarcodeLogic,
              data?.SampleTypeID
            );
          }}
        />
      </td>
      {/* <td data-title={t("Barcode No")}>
        <input
          value={data?.SINNo}
          name="SINNo"
          className="form-control"
          max={15}
          disabled={
            !!data?.SINNo ||
            [1, 2].includes(data?.BarcodeLogic) ||
            data?.isSelected
          }
          onChange={(e) =>
            handleBarcode(e, data?.BarcodeLogic, data?.SampleTypeID)
          }
          onBlur={(e) =>
            handleCloseBarcodeModal(
              e.target.value,
              data?.LedgerTransactionID,
              data?.BarcodeLogic,
              data?.SampleTypeID
            )
          }
        />
      </td> */}

      <td
        data-title={t("Barcode Print")}
        // style={{ textAlign: "center", color: "black !important" }}
      >
        {data?.Status == 2 || data?.Status == 3 ? (
          <div
            className="pt-2"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div
              onClick={() => {
                getBarcodeData(data?.TestID, data?.VisitNo, [data?.SINNo]);
              }}
            >
              <Tooltip label={"TestWise"}>
                <i className="fa fa-print " style={{ cursor: "pointer" }}></i>
              </Tooltip>
            </div>
            <div
              onClick={() => {
                getAllDepartmentBarcodeData(
                  data?.LedgerTransactionID,
                  data?.DepartmentID
                );
              }}
            >
              <Tooltip label={"DepartmentWise"}>
                <i
                  className="fa fa-print pl-4 "
                  style={{ cursor: "pointer", color: "red" }}
                ></i>
              </Tooltip>
            </div>
          </div>
        ) : (
          <> &nbsp;</>
        )}
      </td>
      <td data-title={t("Source")}>
        <SelectBox
          onChange={(e) => handleChange(e, index)}
          name="Source"
          options={SampleSource}
          selectedValue={data?.Source}
        />
      </td>
      <td
        data-title={t("DOS")}
        style={{
          textAlign: "center",
        }}
        onClick={() => setDos(true)}
      >
        <i className="fa fa-home iconStyle p-1" />
      </td>

      <td data-title={t("Vial Qty")}>
        {(data.Status === 1 || data.Status === 4) && data?.SINNo !== "" ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <i
              class="fa fa-minus text-danger pointer"
              onClick={() => handleValQty("sub", data?.SINNo, data?.isSelected)}
            ></i>
            {/* <button className="btn btn-sm btn-danger">-</button> */}
            <span className="mx-2 ">{data?.valQty}</span>
            <i
              class="fa fa-plus text-success pointer"
              onClick={() => handleValQty("add", data?.SINNo, data?.isSelected)}
            ></i>
            {/* <button className="btn btn-sm btn-primary">+</button> */}
          </div>
        ) : (
          <>{data?.VialQty}</>
        )}
      </td>
      <td data-title={t("No Of Pricks")}>
        <SelectBox
          options={NoOfPricks}
          id="NoOfPricks"
          name="NoOfPricks"
          isDisabled={
            !(data.Status === 1 || data.Status === 4) ||
            data?.PricksNotRequired == 1
          }
          selectedValue={data?.NoOfPricks}
          onChange={(e) => {
            handleChange(e, index, data?.SINNo, data?.isSelected);
          }}
        />
      </td>
      <td data-title={t("Remarks")}>
        {!(data.Status === 1 || data.Status === 4) ||
        data?.NoOfPricks === "" ||
        !data?.NoOfPricks ? (
          <button className="btn btn-primary btn-sm form-control input-sm disabled">
            {t("Remark")}
          </button>
        ) : (
          <button
            className="btn btn-primary btn-sm form-control input-sm"
            name="PricksRemarks"
            onClick={handleShowRemark}
          >
            {t("Remark")}
          </button>
        )}
      </td>
      <td data-title={t("SampleTypeID")}>
        <SelectBox
          name="SampleTypeID"
          options={sampleTypeDropdown}
          onChange={(e) => handleChange(e, index)}
          selectedValue={data?.SampleTypeID}
        />
        {data?.IsHisto == 1 && (
          <>
            <SampleHisto
              lable="No. Of Container"
              name="Container"
              handleChange={(e) => handleChange(e, index)}
              value={data?.Container}
            />
            <SampleHisto
              lable="No. Of Slide"
              name="Slide"
              handleChange={(e) => handleChange(e, index)}
              value={data?.Slide}
            />
            <SampleHisto
              lable="No. Of Block"
              name="Block"
              handleChange={(e) => handleChange(e, index)}
              value={data?.Block}
            />
          </>
        )}
      </td>
      <td data-title={t("Reject")}>
        {data.Approved === 0 && data.Status != 4 && (
          <div
            onClick={() => {
              handleShow();
            }}
            className="m-0 p-0"
          >
            <Tooltip label="Reject">
              <i
                className="bi bi-ban m-0 text-icon-size-comment ml-3"
                style={{ color: "red" }}
              ></i>{" "}
            </Tooltip>
          </div>
        )}
      </td>
      <td
        data-title={t("Select")}
        className="text-center"
        style={{ textAlign: "center" }}
      >
        {data.Status !== 2 &&
          data.Status !== 3 &&
          data.Status !== 10 &&
          data.Status !== 6 &&
          data.Status !== 5 &&
          data.Approved !== 1 &&
          (data.Status === 1 ||
            (data.Status === 4 && data?.isSampleReCollection == 1) ||
            snr) && (
            <input
              disabled={
                data.Status == 1 ||
                (data.Status === 4 && data?.isSampleReCollection == 1) ||
                snr
                  ? false
                  : true
              }
              checked={data?.isSelected}
              type="checkbox"
              onChange={(e) => {
                setTimeout(handlePayload(e, index, data), 3000);
              }}
            />
          )}
      </td>
    </>
  );
}

export default SampleCollectionTable;
