import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { number } from "yup";
import { useLocation } from "react-router-dom";
import CloseButton from "../../components/formComponent/CloseButton";
import { useTranslation } from "react-i18next";
import SlotBookModal from "../utils/SlotBookModal";
import TestNameModal from "../utils/TestNameModal";
import DOSModal from "../utils/DOSModal";

function RegisterationTable({
  data,
  slotOpen,
  setSlotOpen,
  handleSelectSlot,
  tableData,
  LTData,
  handleFilter,
  coupon,
  index,
  handleDiscount,
  handlePLOChange,
  handleUrgent,
  handleRateTypePaymode,
  Edit,
  member,
  state,
  setTableData,
}) {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [dos, setDos] = useState(false);
  const location = useLocation();
  const [mouseHover, setMouseHover] = useState({
    index: -1,
    data: "",
  });

  const { t } = useTranslation();
  const handleClose = () => {
    setShow(false);
  };

  const handleClose2 = () => {
    setShow2(false);
  };

  const handleMainClose = () => {};
  const handleChangeDelieveryDate = (e, index, datas) => {
    console.log(datas);
    const data = [...tableData];
    if (e.target.checked) {
      data[index]["deleiveryDate"] = datas?.UrgentdeleiveryDate;
      data[index]["IsUrgent"] = 1;
      setTableData(data);
    } else {
      data[index]["deleiveryDate"] = datas?.DeliveryDate;
      data[index]["IsUrgent"] = 0;
      setTableData(data);
    }
  };

  return (
    <>
      {slotOpen?.show && (
        <SlotBookModal
          show={slotOpen?.show}
          slotOpen={slotOpen}
          setSlotOpen={setSlotOpen}
          handleSelectSlot={handleSelectSlot}
          LTData={LTData}
          tableData={tableData}
        />
      )}

      <td data-title={t("S.No")}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {index + 1}&nbsp;
        </div>
      </td>
      <td data-title={t("Slot")} className="text-center">
        {data?.Radiology == 1 ? (
          <i
            class="fa fa-gear fa-spin pointer text-success"
            onClick={() => {
              setSlotOpen({
                data: data,
                show: true,
              });
            }}
          />
        ) : (
          ""
        )}
      </td>

      <td data-title={t("TestCode")}>{data.TestCode}</td>
      <td
        data-title={t("TestName")}
        style={{
          wordWrap: "break-word",
          whiteSpace: "normal",
        }}
      >
        <div
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
          {data?.TestName}
        </div>
        <small className="text-danger" style={{ fontWeight: "bold" }}>
          {data?.RequiredAttachment !== "" &&
            data?.RequiredAttachment + " Req."}
        </small>
      </td>
      <td data-title={t("View")} onClick={() => setShow2(true)}>
        <i
          className={`fa fa-search ${
            data?.SampleRemarks != "" ? "requiredlabel" : ""
          }`}
        />
      </td>
      <td onClick={() => setDos(true)} data-title={t("DOS")}>
        <i className="fa fa-home" />
      </td>
      <td data-title={t("MRP")}>
        {state?.HideAmount == 1 ? "" : Number(data?.SetMRP).toFixed(2)}
      </td>
      <td data-title={t("Rate")}>{state?.HideAmount == 1 ? "" : data?.Rate}</td>
      <td data-title={t("Discount")}>
        {state?.HideAmount != 1 ? (
          <input
            style={{ width: "50px" }}
            type="number"
            onInput={(e) => number(e, 20)}
            min={0}
            value={data?.Discount}
            onChange={(e) => {
              if (coupon?.field == true) {
                toast.error("Remove Coupon First");
              } else {
                if (Number(data?.Rate) < Number(e.target.value)) {
                  toast.error(t("Please Give Valid Discount"));
                } else {
                  handleDiscount(e.target.value, index);
                }
              }
            }}
            disabled={
              handleRateTypePaymode === "Credit" || member
                ? true
                : LTData?.DiscountApprovedBy != ""
                  ? true
                  : location.pathname === "/EditPatientDetails"
                    ? true
                    : member
                      ? true
                      : false
            }
          />
        ) : (
          ""
        )}
      </td>
      <td data-title={t("NetAmount")}>
        {state?.HideAmount != 1 ? (
          <input
            className="currency"
            value={Number(data?.NetAmount).toFixed(2)}
            disabled
            style={{ width: "50px" }}
          />
        ) : (
          ""
        )}
      </td>
      <td data-title={t("DeliveryDate")}>{data.deliveryDate}</td>
      <td data-title={t("SC")}>
        <input
          type="checkbox"
          name="Status"
          value={data?.Status}
          disabled={data?.isDisable}
          checked={data?.Status === 2 ? true : false}
          onChange={(e) => handlePLOChange(e, index)}
        />
      </td>
      <td data-title={t("IsUrgent")}>
        <input
          type="checkbox"
          name={"IsUrgent"}
          checked={data?.IsUrgent}
          disabled={data?.isDisable}
          onChange={(e) => {
            handleChangeDelieveryDate(e, index, data);
          }}
        />
      </td>
      <td>
        {location.pathname === "/EditPatientDetails" ? (
          data?.isPrimary && (
            <CloseButton handleClick={() => handleFilter(data)} />
          )
        ) : (
          <CloseButton handleClick={() => handleFilter(data)} />
        )}
      </td>
      {show2 && (
        <TestNameModal
          show={show2}
          onHandleShow={handleClose2}
          id={data?.InvestigationID}
        />
      )}
      {dos && (
        <DOSModal
          show={dos}
          LTData={LTData}
          onHandleShow={() => setDos(false)}
          id={data?.InvestigationID}
        />
      )}
    </>
  );
}

export default RegisterationTable;
