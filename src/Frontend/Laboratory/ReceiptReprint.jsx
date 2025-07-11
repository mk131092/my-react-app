import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

import { axiosInstance } from "../../utils/axiosInstance";
import {
  AddBlankData,
  AllDataDropDownPayload,
  Time,
  autocompleteOnBlur,
  number,
  shouldIncludeAIIMSID,
} from "../../utils/helpers";
import {
  BindEmployeeReports,
  getDoctorSuggestion,
  getPaymentModes,
} from "../../utils/NetworkApi/commonApi";
import { Record, SearchBy } from "../../utils/Constants";
import Input from "../../components/formComponent/Input";
import { SelectBox } from "../../components/formComponent/SelectBox";
import DatePicker from "../../components/formComponent/DatePicker";
import CustomTimePicker from "../../components/formComponent/TimePicker";
import Loading from "../../components/loader/Loading";
// import ReceiptReprintTable from "../Table/ReceiptReprintTable";
import Heading from "../../components/UI/Heading";
import Accordion from "@app/components/UI/Accordion";
import MedicialModal from "../utils/MedicialModal";
import UploadFile from "../utils/UploadFileModal/UploadFile";
import { useTranslation } from "react-i18next";
import ReceiptReprintTable from "../Table/ReceiptReprintTable";
import Pagination from "../../Pagination/Pagination";
import ReceiptReprintFilter from "./ReceiptReprintFilter";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import ReactSelect from "../../components/formComponent/ReactSelect";
const ReceiptReprint = () => {
  // const column = [
  //   { header: "Action", visible: true },
  //   { header: "Reg Date", visible: true },
  //   { header: "RateType", visible: true },
  //   { header: "Visit No", visible: true },
  //   { header: "UHID", visible: true },
  //   { header: "Patient Name", visible: true },
  //   { header: "Remarks", visible: true },
  //   { header: "Age/Gender", visible: true },
  //   { header: "Mobile No", visible: true },
  //   { header: "Gross Amt", visible: true },
  //   { header: "Dis Amt", visible: true },
  //   { header: "Net Amt", visible: true },
  //   { header: "Due Amt", visible: true },
  //   { header: "Paid Amt", visible: true },
  //   { header: "Centre", visible: true },
  //   { header: "Doctor", visible: true },
  //   { header: "User", visible: true },
  //   { header: "Rec Edit", visible: true },
  //   { header: "Edit Info", visible: true },
  //   { header: "Cash Receipt", visible: true },
  //   { header: "FullyPaid", visible: true },
  //   { header: "View Details", visible: true, icon: "fa-info-circle" },
  //   { header: "Send Email", visible: true, icon: "fa-envelope-open" },
  //   { header: "UploadDocument", visible: true, icon: "fa-file" },
  //   { header: "Medical History", visible: true, icon: "fa-medkit" },
  // ];
  const [columnConfig, setColumnConfig] = useState([]);
  const [RateTypes, setRateTypes] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [user, SetUser] = useState([]);
  const [receiptData, setReceiptData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [indexMatch, setIndexMatch] = useState(0);
  const [t] = useTranslation();
  const [Identity, setIdentity] = useState([]);
  const [dropFalse, setDropFalse] = useState(true);
  const [show4, setShow4] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  const [show5, setShow5] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  const navigate = useNavigate();
  const today = new Date();
  const [formData, setFormData] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    CentreID: "",
    ItemValue: "",
    RateTypeID: "",
    SelectTypes: "",
    FromTime: new Date(today.setHours(0, 0, 0, 0)),
    ToTime: new Date(today.setHours(23, 59, 59, 999)),
    DoctorReferal: "",
    DoctorName: "",
    User: "",
    Status: "",
  });
  const [PageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return receiptData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, receiptData, PageSize]);

  const paginationShow = useMemo(() => {
    const data = columnConfig?.filter((ele) => ele?.visible);
    return data?.length > 0 ? true : false;
  }, [columnConfig]);

  const validation = () => {
    let error = "";
    if (
      formData?.SelectTypes.trim() !== "" &&
      formData?.ItemValue.trim() === ""
    ) {
      error = { ...error, ItemValue: "Please Choose Value" };
    }
    if (formData.SelectTypes === "Mobile") {
      if (formData?.SelectTypes !== "" && formData?.ItemValue === "") {
        error = { ...error, ItemValue: t("This Field is Required") };
      } else if (formData.ItemValue.length !== 10) {
        error = { ...error, ItemValue: t("Invalid Mobile Number") };
      }
    }

    return error;
  };

  const handleListSearch = (data, name) => {
    switch (name) {
      case "DoctorName":
        setFormData({
          ...formData,
          [name]: data.Name,
          DoctorReferal: data.Name ? data.DoctorReferalID : "",
        });

        setIndexMatch(0);
        setDoctorSuggestion([]);
        setDropFalse(false);
        break;
      default:
        break;
    }
  };

  const handleKeyDown = (e) => {
    if (e?.key === "Enter") {
      TableData("All");
    }
  };

  const handleSearchSelectChange=(label, value)=>{
    if(label==="CentreID"){
      setFormData({ ...formData, [label]: value?.value, RateTypeID: "" });
      setRateTypes([]);
      if (value?.value == "") {
        fetchRateTypes(CentreData.map((ele) => ele.value));
      } else {
        fetchRateTypes([value?.value]);
      }
    } else if(label==="User"){
      setFormData({ ...formData, ["User"]: String(value?.value)})
    } else {
      setFormData({ ...formData, [label]: value?.value})
    }
  }


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "DoctorName") {
      setDropFalse(true);
    }
  };

  const dateSelect = (value, name) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const TableData = (Status) => {
    setLoading(true);
    const rateTypes = RateTypes.map((item) => {
      return item?.value;
    });
    axiosInstance
      .post("Lab/getReceiptReprint", {
        CentreID: AllDataDropDownPayload(
          formData.CentreID,
          CentreData,
          "value"
        ),
        SelectTypes: formData.SelectTypes,
        ItemValue: formData.ItemValue.trim(),
        RateTypeID:
          formData?.RateTypeID == null || formData?.RateTypeID == ""
            ? rateTypes
            : [formData?.RateTypeID],
        DoctorReferal: formData.DoctorReferal,
        FromDate: moment(formData.FromDate).format("DD/MMM/YYYY"),
        ToDate: moment(formData.ToDate).format("DD/MMM/YYYY"),
        FromTime: Time(formData.FromTime),
        ToTime: Time(formData.ToTime),
        User: formData?.User,
        Status: Status,
      })
      .then((res) => {
        setReceiptData(res?.data?.message);
        setLoading(false);
      })
      .catch((err) => {
        setReceiptData([]);
        setLoading(false);
      });
  };

  const handleIndex = (e) => {
    switch (e.which) {
      case 38:
        if (indexMatch !== 0) {
          setIndexMatch(indexMatch - 1);
        } else {
          setIndexMatch(doctorSuggestion.length - 1);
        }
        break;
      case 40:
        if (doctorSuggestion.length - 1 === indexMatch) {
          setIndexMatch(0);
        } else {
          setIndexMatch(indexMatch + 1);
        }
        break;
      case 13:
        handleListSearch(doctorSuggestion[indexMatch], "DoctorName");
        setIndexMatch(0);
        break;
      default:
        break;
    }
  };

  const handleUploadCount = (name, value, secondName) => {
    let data = [...receiptData];

    if (name === "UploadDocumentCount") {
      data[show5?.index][name] = value;
      data[show5?.index][secondName] = value === 0 ? 0 : 1;
      setReceiptData(data);
    } else {
      data[show4?.index][name] = value;
      data[show4?.index][secondName] = value === 0 ? 0 : 1;
      setReceiptData(data);
    }
  };
  const handleTime = (time, name) => {
    setFormData({ ...formData, [name]: time });
  };
  const fetchRateTypes = async (id) => {
    try {
      const res = await axiosInstance.post("Centre/GetRateType", {
        CentreId: id,
      });
      const list = res?.data?.message.map((item) => ({
        label: item?.RateTypeName,
        value: item?.RateTypeID,
      }));
      setRateTypes(list);
    } catch (err) {
      console.log(err);
    }
  };
  const getAccessCentres = () => {
    axiosInstance
      .get("Centre/getAccessCentres")
      .then((res) => {
        let data = res.data.message;
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        let allValues = CentreDataValue.map((ele) => ele.value);
        setCentreData(CentreDataValue);

        fetchRateTypes(allValues);
      })
      .catch((err) => console.log(err));
  };
  const EmployeeID = useLocalStorage("userData", "get")?.EmployeeID;
  const getFilterResultOption = () => {
    axiosInstance
      .post("Lab/getFilterTableReprintData", {
        PageName: "Reprint",
        EmployeeId: EmployeeID?.toString(),
      })
      .then((res) => {
        let data = res?.data?.message;

        setColumnConfig(data);
      })
      .catch((err) => setColumnConfig([]));
  };

  useEffect(() => {
    getAccessCentres();
    BindEmployeeReports(SetUser);
    getFilterResultOption();
    getPaymentModes("Identity", setIdentity);
  }, []);

  useEffect(() => {
    getDoctorSuggestion(formData, setDoctorSuggestion, setFormData);
  }, [formData?.DoctorName]);

  return (
    <>
      {show4?.modal && (
        <MedicialModal
          show={show4.modal}
          handleClose={() => {
            setShow4({
              modal: false,
              data: "",
              index: -1,
            });
          }}
          MedicalId={show4?.data}
          handleUploadCount={handleUploadCount}
        />
      )}

      {show5?.modal && (
        <UploadFile
          show={show5?.modal}
          handleClose={() => {
            setShow5({ modal: false, data: "", index: -1 });
          }}
          options={Identity}
          documentId={show5?.data}
          pageName="Patient Registration"
          handleUploadCount={handleUploadCount}
        />
      )}

      <Accordion
        name={t("Receipt Reprint")}
        defaultValue={true}
        isBreadcrumb={true}
        linkTo="/receiptreprint"
        linkTitle={
          <div
            className="link-title-container mt-2 d-none  d-md-flex"
            id="pr_id_11"
          >
            <label>
              {t("Total Patient")} :
              <span className="text-danger" style={{ marginLeft: "10px" }}>
                {receiptData?.length}
              </span>
            </label>
            |
            <label>
              {t("Gross Amount")} :
              <span className="text-danger" style={{ marginLeft: "10px" }}>
                {receiptData
                  ?.reduce(
                    (accumulator, currentValue) =>
                      accumulator + currentValue?.GrossAmount,
                    0
                  )
                  .toFixed(2)}
              </span>
            </label>
            |
            <label>
              {t("Discount Amount")} :
              <span className="text-danger" style={{ marginLeft: "10px" }}>
                {receiptData
                  ?.reduce(
                    (accumulator, currentValue) =>
                      accumulator + currentValue?.DiscountOnTotal,
                    0
                  )
                  .toFixed(2)}
              </span>
            </label>
            |
            <label>
              {t("Net Amount")} :
              <span className="text-danger" style={{ marginLeft: "10px" }}>
                {receiptData
                  ?.reduce(
                    (accumulator, currentValue) =>
                      accumulator + currentValue?.NetAmount,
                    0
                  )
                  .toFixed(2)}
              </span>
            </label>
            |
            <label>
              {t("Due Amount")} :
              <span className="text-danger" style={{ marginLeft: "10px" }}>
                {receiptData
                  ?.reduce(
                    (accumulator, currentValue) =>
                      accumulator + currentValue?.DueAmount,
                    0
                  )
                  .toFixed(2)}
              </span>
            </label>
            |
            <label>
              {t("Paid Amount")} :
              <span className="text-danger" style={{ marginLeft: "10px" }}>
                {receiptData
                  ?.reduce(
                    (accumulator, currentValue) =>
                      accumulator + currentValue?.Adjustment,
                    0
                  )
                  .toFixed(2)}
              </span>
            </label>
          </div>
        }
      >
        <Accordion defaultValue={true} title={t("Receipt Reprint Details")} />
        <div className="row  px-2 mt-2 mb-1">
          <div className="col-md-2">
            <div className="d-flex" style={{ display: "flex" }}>
              <div style={{ width: "50%" }}>
                <SelectBox
                  options={[
                    ...SearchBy,
                    ...(shouldIncludeAIIMSID()
                      ? [{ label: "AIIMSID", value: "AIIMSID" }]
                      : []),
                  ]}
                  id="SelectTypes"
                  lable="SelectTypes"
                  selectedValue={formData.SelectTypes}
                  name="SelectTypes"
                  onChange={handleChange}
                />
              </div>
              <div style={{ width: "50%" }}>
                {formData?.SelectTypes === "Mobile" ? (
                  <div style={{ width: "100%" }}>
                    <Input
                      type="number"
                      name="ItemValue"
                      max={10}
                      onKeyDown={handleKeyDown}
                      value={formData.ItemValue}
                      onChange={handleChange}
                      onInput={(e) => number(e, 10)}
                    />
                    {errors?.ItemValue && (
                      <div className="error-message">{errors?.ItemValue}</div>
                    )}
                  </div>
                ) : (
                  <div style={{ width: "100%" }}>
                    <Input
                      type="text"
                      name="ItemValue"
                      max={20}
                      onKeyDown={handleKeyDown}
                      value={formData.ItemValue}
                      onChange={handleChange}
                      on
                    />
                    {errors?.ItemValue && (
                      <div className="error-message">{errors?.ItemValue}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-md-2">
          <ReactSelect
              dynamicOptions={AddBlankData(CentreData, "All Centre")}
              name="CentreID"
              lable={t("Centre")}
              id="Centre"
              removeIsClearable={true}
              placeholderName={t("Centre")}
              value={formData?.CentreID}
              onChange={handleSearchSelectChange}
            />
            
          </div>

          <div className="col-md-2">
          <ReactSelect
                          dynamicOptions={[{ label: "All RateType", value: "" }, ...RateTypes]}
                          name="RateTypeID"
                          lable={t("RateType")}
                          id="RateType"
                          removeIsClearable={true}
                          placeholderName={t("RateType")}
                          value={formData?.RateTypeID}
                          onChange={handleSearchSelectChange}
                        />
           
          </div>

          <div className="col-md-2">
            <Input
              type="text"
              lable="Refer Doctor"
              id="DoctorName"
              name="DoctorName"
              value={formData.DoctorName}
              onChange={handleChange}
              placeholder=" "
              onBlur={(e) => {
                autocompleteOnBlur(setDoctorSuggestion);
                setTimeout(() => {
                  const data = doctorSuggestion.filter(
                    (ele) => ele?.Name === e.target.value
                  );
                  if (data.length === 0) {
                    setFormData({ ...formData, DoctorName: "" });
                  }
                }, 500);
              }}
              onKeyDown={handleIndex}
              autoComplete="off"
            />
            {dropFalse && doctorSuggestion.length > 0 && (
              <ul className="suggestion-data">
                {doctorSuggestion.map((data, index) => (
                  <li
                    onClick={() => handleListSearch(data, "DoctorName")}
                    className={`${index === indexMatch && "matchIndex"}`}
                    key={index}
                  >
                    {data?.Name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="col-md-2">
          <ReactSelect
                          dynamicOptions={[{ label: "Select Employee", value: "" }, ...user]}
                          name="User"
                          lable={t("Employee")}
                          id="Employee"
                          removeIsClearable={true}
                          placeholderName={t("Employee")}
                          value={formData?.User}
                          onChange={handleSearchSelectChange}
                        />
        
          </div>
        </div>
        <div className="row px-2 mt-1 mb-1">
          <div className="col-md-2">
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
          <div className="col-md-1">
            <CustomTimePicker
              name="FromTime"
              placeholder="FromTime"
              value={formData?.FromTime}
              id="FromTime"
              lable="FromTime"
              onChange={handleTime}
            />
          </div>
          <div className="col-md-2">
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
          <div className="col-md-1">
            <CustomTimePicker
              name="ToTime"
              placeholder="ToTime"
              value={formData?.ToTime}
              id="ToTime"
              lable="ToTime"
              onChange={handleTime}
            />
          </div>
          <div className="col-md-1">
            <button
              type="button"
              value={"Search"}
              id="btnSearch"
              className="btn btn-block btn-success btn-sm"
              onClick={() => TableData("All")}
            >
              {t("Search")}
            </button>
          </div>
          <div
            onClick={() => {
              TableData("fullpaid");
            }}
            className="col-md-1 d-flex"
          >
            <button
              className="statusConfirmed"
              style={{ backgroundColor: "#00FA9A" }}
            ></button>
            <label className="reprintLable" style={{ cursor: "pointer" }}>
              {t("Full Paid")}
            </label>
          </div>
          <div
            onClick={() => {
              TableData("partialpaid");
            }}
            className="col-md-1 d-flex"
          >
            <button
              className="statusConfirmed"
              style={{ backgroundColor: "#F6A9D1" }}
            ></button>
            <label className="reprintLable" style={{ cursor: "pointer" }}>
              {t("Partial Paid")}
            </label>
          </div>
          <div
            onClick={() => {
              TableData("fullyunpaid");
            }}
            className="col-md-1 d-flex"
          >
            <button
              className="statusConfirmed"
              style={{ backgroundColor: "#FF457C" }}
            ></button>
            <label className="reprintLable" style={{ cursor: "pointer" }}>
              {t("Fully Unpaid")}
            </label>
          </div>

          <div
            onClick={() => {
              TableData("fullrefund");
            }}
            className="col-md-1 d-flex"
          >
            <button
              className="statusConfirmed"
              style={{ backgroundColor: "#CEE1FF" }}
            ></button>
            <label className="reprintLable" style={{ cursor: "pointer" }}>
              {t("Full Refund")}
            </label>
          </div>
          <div
            onClick={() => {
              TableData("credit");
            }}
            className="col-md-1 d-flex"
          >
            <button
              className="statusConfirmed"
              style={{ backgroundColor: "#b3cdb3" }}
            ></button>
            <label className="reprintLable" style={{ cursor: "pointer" }}>
              {t("Credit")}
            </label>
          </div>
        </div>
      </Accordion>
      <Accordion
        title={
          <>
            {currentTableData?.length == 0 ? (
              t("Search Result")
            ) : (
              <div className="d-flex">
                <span className="mt-1">
                  {" "}
                  {t("Click Icon To Filter Results")}{" "}
                </span>
                <span className="header ml-1" style={{ cursor: "pointer" }}>
                  <ReceiptReprintFilter
                    columnConfig={columnConfig}
                    setColumnConfig={setColumnConfig}
                    PageName="Reprint"
                  />
                </span>
              </div>
            )}
          </>
        }
        notOpen={true}
        defaultValue={true}
      >
        <div className="">
          {loading ? (
            <Loading />
          ) : (
            <>
              <ReceiptReprintTable
                Status={formData?.Status}
                TableData={TableData}
                show={setShow4}
                show2={setShow5}
                setReceiptData={setReceiptData}
                receiptData={currentTableData}
                currentPage={currentPage}
                pageSize={PageSize}
                columnConfig={columnConfig}
              />
              {paginationShow && currentTableData?.length > 0 && (
                <div className="d-flex flex-wrap justify-content-end">
                  <label className="mt-4 mx-2">{t("No Of Record/Page")}</label>
                  <SelectBox
                    className="mt-3 p-1 RecordSize mr-2"
                    // options={Record}
                    selectedValue={PageSize}
                    options={[
                      { label: "All", value: receiptData?.length },
                      ...Record,
                    ]}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  />{" "}
                  <Pagination
                    className="pagination-bar mb-2"
                    currentPage={currentPage}
                    totalCount={receiptData?.length}
                    pageSize={PageSize}
                    onPageChange={(page) => setCurrentPage(page)}
                  />{" "}
                </div>
              )}
            </>
          )}
        </div>{" "}
      </Accordion>
    </>
  );
};

export default ReceiptReprint;
