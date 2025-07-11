import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  AddBlankData,
  AllDataDropDownPayload,
  number,
  Time,
} from "../../utils/helpers";
import {
  getAccessCentres,
  getAccessRateType,
} from "../../utils/NetworkApi/commonApi";
import { axiosInstance } from "../../utils/axiosInstance";
import Accordion from "@app/components/UI/Accordion";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Input from "../../components/formComponent/Input";
import DatePicker from "../../components/formComponent/DatePicker";
import TimePicker from "../../components/formComponent/TimePicker";
import { SearchBy } from "../../utils/Constants";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";
import NoRecordFound from "../../components/formComponent/NoRecordFound";

const CancelReceipt = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [RateData, setRateData] = useState([]);
  const [receiptData, setReceiptData] = useState([]);
  const [CentreData, setCentreData] = useState([]);

  const today = new Date();
  const [formData, setFormData] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    CentreID: "",
    ItemValue: "",
    RateID: "",
    SelectTypes: "",
    FromTime: new Date(today.setHours(0, 0, 0, 0)),
    ToTime: new Date(today.setHours(23, 59, 59, 999)),
    DoctorReferal: "",
    DoctorName: "",
    User: "",
    Status: "",
  });
  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const TableData = (Status) => {
    setLoading(true);
    axiosInstance
      .post("Lab/getCancelReceiptData", {
        CentreID: AllDataDropDownPayload(
          formData.CentreID,
          CentreData,
          "value"
        ),
        SelectTypes: formData.SelectTypes,
        ItemValue: formData.ItemValue,
        RateTypeID: Array.isArray(formData.RateID)
          ? formData.RateID
          : [formData.RateID],
        DoctorReferal: formData.DoctorReferal,
        FromDate: moment(formData.FromDate).format("DD/MMM/YYYY"),
        ToDate: moment(formData.ToDate).format("DD/MMM/YYYY"),
        FromTime: Time(formData.FromTime),
        ToTime: Time(formData.ToTime),
        User: formData?.User,
        Status: Status,
      })
      .then((res) => {
        if (res?.data?.success) {
          setReceiptData(res?.data?.message);
        } else {
          toast.error(res?.data?.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        setReceiptData([]);
        setLoading(false);
      });
  };

  const handleChangeNew = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const data = [...receiptData];
      data[index][name] = checked;
      setReceiptData(data);
    } else {
      const data = receiptData?.map((ele) => {
        return {
          ...ele,
          isChecked: checked,
        };
      });
      setReceiptData(data);
    }
  };

  const dateSelect = (value, name) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleTime = (time, name) => {
    setFormData({ ...formData, [name]: time });
  };
  useEffect(() => {
    getAccessCentres(setCentreData);
    getAccessRateType(setRateData);
  }, []);

  const handleSave = () => {
    setLoading(true);
    const UpdateData = receiptData?.filter((ele) => ele?.isChecked === true);
    if (UpdateData.length === 0) {
      toast.error("Please select at least one checkbox");
      setLoading(false);
      return;
    }
    const SaveData = UpdateData?.map((ele) => {
      return {
        LedgerTransactionNo: ele?.LedgerTransactionNo,
        Amount: ele?.GrossAmount,
      };
    });
    axiosInstance
      .post("Lab/UpdateReceiptData", { SaveData: SaveData })
      .then((res) => {
        toast.success(res?.data?.message);
        setLoading(false);
        TableData();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
        setLoading(false);
      });
  };
  return (
    <>
      <Accordion
        name={t("Cancel Receipt")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row pt-2 pl-2 pr-2 mt-1">
          <div className="col-sm-2">
            <div className="d-flex" style={{ display: "flex" }}>
              <div style={{ width: "40%" }}>
                <SelectBox
                  options={SearchBy}
                  id="SelectTypes"
                  lable="SelectTypes"
                  selectedValue={formData.SelectTypes}
                  name="SelectTypes"
                  onChange={handleSelectChange}
                />
              </div>
              <div style={{ width: "60%" }}>
                {formData?.SelectTypes === "Mobile" ? (
                  <div style={{ width: "100%" }}>
                    <Input
                      type="number"
                      name="ItemValue"
                      max={10}
                      value={formData.ItemValue}
                      onChange={handleChange}
                      onInput={(e) => number(e, 10)}
                    />
                  </div>
                ) : (
                  <div style={{ width: "100%" }}>
                    <Input
                      type="text"
                      name="ItemValue"
                      max={20}
                      value={formData.ItemValue}
                      onChange={handleChange}
                      on
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={AddBlankData(CentreData, "All Centre")}
              id="Centre"
              lable="Centre"
              selectedValue={formData.CentreID}
              name="CentreID"
              onChange={handleSelectChange}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={[{ label: "All Rate Type", value: "" }, ...RateData]}
              id="Rate"
              lable="Rate Type"
              selectedValue={formData.RateID}
              name="RateID"
              onChange={handleSelectChange}
            />
          </div>
          <div className="col-sm-2">
            <div>
              <DatePicker
                className="custom-calendar"
                name="FromDate"
                value={formData?.FromDate}
                onChange={dateSelect}
                placeholder=" "
                id="FromDate"
                lable="FromDate"
                maxDate={new Date(formData?.ToDate)}
              />
            </div>
          </div>
          <div className="col-sm-1">
            <TimePicker
              name="FromTime"
              placeholder="FromTime"
              value={formData?.FromTime}
              id="FromTime"
              lable="FromTime"
              onChange={handleTime}
            />
          </div>
          <div className="col-sm-2">
            <div>
              <DatePicker
                className="custom-calendar"
                name="ToDate"
                value={formData?.ToDate}
                onChange={dateSelect}
                placeholder=" "
                id="ToDate"
                lable="ToDate"
                maxDate={new Date()}
                minDate={new Date(formData?.FromDate)}
              />
            </div>
          </div>
          <div className="col-sm-1">
            <TimePicker
              name="ToTime"
              placeholder="ToTime"
              value={formData?.ToTime}
              id="ToTime"
              lable="ToTime"
              onChange={handleTime}
            />
          </div>
        </div>
        <div className="row pt-1 pl-2 pr-2">
          <div className="col-sm-1 pb-2">
            <input
              type="button"
              value={t("Search")}
              id="btnSearch"
              className="btn btn-block btn-info btn-sm input-sm"
              onClick={() => TableData("All")}
            />
          </div>
        </div>
      </Accordion>
      {loading ? (
        <Loading />
      ) : (
        <>
          {receiptData?.length > 0 ? (
            <>
              <Tables>
                <thead>
                  <tr>
                    <th>{t("S.No")}</th>
                    <th>{t("Reg Date")}</th>
                    <th>{t("RateType")}</th>
                    <th>{t("Visit No")}</th>
                    <th>{t("Patient Name")}</th>
                    <th>{t("Age/Gender")}</th>
                    <th>{t("Mobile No")}</th>
                    <th>{t("Gross Amt")}</th>
                    <th>{t("Dis Amt")}</th>
                    <th>{t("Net Amt")}</th>
                    <th>{t("Due Amt")}</th>
                    <th>{t("Paid Amt")}</th>
                    <th>{t("Centre")}</th>
                    <th>{t("User")}</th>
                    <th>{t("Cancel")}</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptData?.map((ele, index) => (
                    <tr key={index}>
                      <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                      <td data-title={t("Reg Date")}>{ele?.Date}&nbsp;</td>
                      <td data-title={t("RateType")}>{ele?.RateType}&nbsp;</td>
                      <td data-title={t("Visit No")}>
                        {ele?.LedgerTransactionNo}&nbsp;
                      </td>
                      <td data-title={t("Patient Name")}>
                        {`${ele?.FirstName || ""} ${ele?.MiddleName || ""} ${
                          ele?.LastName || ""
                        }`}
                        &nbsp;
                      </td>
                      <td data-title={t("Age/Gender")}>
                        {" "}
                        {ele?.Age} / {ele?.Gender}&nbsp;
                      </td>
                      <td data-title={t("Mobile No")}>{ele?.Mobile}&nbsp;</td>
                      <td data-title={t("Gross Amt")}>
                        {ele?.GrossAmount}&nbsp;
                      </td>
                      <td data-title={t("Dis Amt")}>
                        {ele?.DiscountOnTotal.toFixed(2)}&nbsp;
                      </td>
                      <td data-title={t("Net Amt")}>{ele?.NetAmount}&nbsp;</td>
                      <td data-title={t("Due Amt")}>{ele?.DueAmount}&nbsp;</td>
                      <td data-title={t("Paid Amt")}>
                        {ele?.Adjustment}&nbsp;
                      </td>
                      <td data-title={t("Centre")}>{ele?.Centre}&nbsp;</td>
                      <td data-title={t("User")}>{ele?.CreatedByName}&nbsp;</td>
                      <td data-title={t("Action")}>
                        <input
                          type="checkbox"
                          checked={ele?.isChecked}
                          name="isChecked"
                          onChange={(e) => handleChangeNew(e, index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Tables>
              <div
                className="row"
                style={{
                  position: "sticky",
                  bottom: -2,
                  marginTop: "3px",
                }}
              >
                <div
                  className="col-sm-2"
                  //   style={{ marginBottom: "6px", marginTop: "6px" }}
                >
                  <button
                    className="btn btn-success btn-sm btn-block"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            </>
          ) : (
            <NoRecordFound />
          )}
        </>
      )}
    </>
  );
};

export default CancelReceipt;
