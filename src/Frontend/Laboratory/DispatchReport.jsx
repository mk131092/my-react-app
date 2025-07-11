import React, { useEffect, useState } from "react";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BindEmployeeReports,
  DepartmentWiseItemList,
  getDoctorSuggestion,
  getPaymentModes,
} from "../../utils/NetworkApi/commonApi";
import { axiosInstance } from "../../utils/axiosInstance";
import {
  AddBlankData,
  AllDataDropDownPayload,
  Time,
  autocompleteOnBlur,
  getTrimmedData,
  number,
  shouldIncludeAIIMSID,
} from "../../utils/helpers";
import Accordion from "@app/components/UI/Accordion";

import { useTranslation } from "react-i18next";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Input from "../../components/formComponent/Input";
import DispatchReportTable from "../Table/DispatchReportTable";
import { DateTypeSearch2, SampleStatus, SearchBy } from "../../utils/Constants";
import DatePicker from "../../components/formComponent/DatePicker";
import CustomTimePicker from "../../components/formComponent/TimePicker";
import Loading from "../../components/loader/Loading";
import MedicialModal from "../utils/MedicialModal";
import Heading from "../../components/UI/Heading";
import UploadFile from "../utils/UploadFileModal/UploadFile";
import AutoComplete from "../../components/formComponent/AutoComplete";
import ReceiptReprintFilter from "./ReceiptReprintFilter";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";

import DispatchMoreFilter from "./DispatchMoreFilter";
import ReactSelect from "../../components/formComponent/ReactSelect";
const DispatchReport = () => {
  const [CentreData, setCentreData] = useState([]);
  const [RateTypes, setRateTypes] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [toggleDate, setToggleDate] = useState({
    FromDate: false,
    ToDate: false,
  });
  const [t] = useTranslation();
  const [user, SetUser] = useState([]);
  const [TestSuggestion, setTestSuggestion] = useState([]);
  const [dispatchData, setDispatchData] = useState([]);
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [indexMatch, setIndexMatch] = useState(0);
  const [dropFalse, setDropFalse] = useState(true);
  const [show, setShow] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  console.log(dispatchData);
  const [selects, setSelects] = useState(false);
  const [testCount, setTestCount] = useState(0);
  const [Identity, setIdentity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const today = new Date();
  const [formData, setFormData] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    CentreID: "",
    ItemValue: "",
    RateID: "",
    SelectTypes: "",
    RefundFilter: null,
    FromTime: new Date(today.setHours(0, 0, 0, 0)),
    ToTime: new Date(today.setHours(23, 59, 59, 999)),
    DoctorReferal: "",
    DepartmentID: "",
    DoctorName: "",
    TestName: "",
    DateTypeSearch: "Date",
    User: "",
    IsUrgent: "",
    SampleStatus: "",
    IsCourier: "",
  });
  const [columnConfig, setColumnConfig] = useState([]);
  const handleIndex = (e, name) => {
    switch (name) {
      case "DoctorName":
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
            handleListSearch(doctorSuggestion[indexMatch], name);
            setIndexMatch(0);
            break;
          default:
            break;
        }
        break;
      case "TestName":
        switch (e.which) {
          case 38:
            if (indexMatch !== 0) {
              setIndexMatch(indexMatch - 1);
            } else {
              setIndexMatch(TestSuggestion.length - 1);
            }
            break;
          case 40:
            if (TestSuggestion.length - 1 === indexMatch) {
              setIndexMatch(0);
            } else {
              setIndexMatch(indexMatch + 1);
            }
            break;
          case 13:
            handleListSearch(TestSuggestion[indexMatch], name);
            setIndexMatch(0);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };
  const navigate = useNavigate();
  const location = useLocation();
  const [show4, setShow4] = useState({
    modal: false,
    data: "",
    index: -1,
  });

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

      case "TestName":
        setFormData({
          ...formData,
          [name]: data.TestName,
        });
        setIndexMatch(0);

        setSelects(false);
        setTestSuggestion([]);
        break;
      default:
        break;
    }
  };

  const handleUploadCount = (name, value, secondName) => {
    let data = [...dispatchData];
    if (name === "UploadDocumentCount") {
      data[show?.index][name] = value;
      data[show?.index][secondName] = value === 0 ? 0 : 1;
      setDispatchData(data);
    } else {
      data[show4?.index][name] = value;
      data[show4?.index][secondName] = value === 0 ? 0 : 1;
      setDispatchData(data);
    }
  };

  useEffect(() => {
    getDoctorSuggestion(formData, setDoctorSuggestion, setFormData);
    if (formData?.DoctorName === "") {
      setDropFalse(true);
    }
  }, [formData?.DoctorName]);

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

  const dateSelect = (value, name) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleKeyDown = (e) => {
    if (e?.key === "Enter") {
      TableData("");
    }
  };

  const handleSearchSelectChange=(label, value)=>{
    if(label==="CentreID"){
      setFormData({ ...formData, [label]: value?.value, RateTypeID: "" });

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

  const handleSelectChange = (event) => {
    const { name, value, checked, type } = event?.target;
     if (name === "IsUrgent") {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    } else if (name === "IsCourier") {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name == "TestName") {
      if (value == "") {
        setSelects(false);
      } else setSelects(true);
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
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

  const getDepartment = () => {
    axiosInstance
      .get("Department/getDepartment")
      .then((res) => {
        let data = res.data.message;
        let DeptDataValue = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        setDepartmentData(DeptDataValue);
      })
      .catch((err) => console.log(err));
  };

  const User = localStorage.getItem("User") ? true : false;

  const API_DATA = JSON.parse(localStorage.getItem("data"));

  console.log(API_DATA);

  const TableData = (status, dateTypeSearch, urgent) => {
    setLoading(true);
    const rateTypes = RateTypes.map((item) => {
      return item?.value;
    });
    if (User == "1") {
      axiosInstance
        .post(
          "Dispatch/PatientLabSearch",
          getTrimmedData({
            CentreID: [parseInt(API_DATA?.defaultCentreID)],
            SelectTypes: "VisitNo",
            ItemValue: API_DATA?.visitNo,
            RateTypeID: [parseInt(API_DATA?.rateTypeId)],
            DoctorReferal: formData.DoctorReferal,
            FromDate: moment(API_DATA?.bookingDate).format("DD/MMM/YYYY"),
            ToDate: moment(API_DATA?.bookingDate).format("DD/MMM/YYYY"),
            FromTime: Time(formData.FromTime),
            ToTime: Time(formData.ToTime),
            DepartmentID: [parseInt(API_DATA?.departmentId)],
            SampleStatus: status,
            TestName: formData?.TestName,
            DateTypeSearch: dateTypeSearch
              ? dateTypeSearch
              : formData?.DateTypeSearch,
            User: formData?.User,
            IsUrgent: urgent ? urgent : formData?.IsUrgent ? 1 : 0,
            IsCourier: formData?.IsCourier ? 1 : 0,
          })
        )
        .then((res) => {
          const data = modifyArray(res?.data?.message);
          setTestCount(res?.data?.message?.length);
          setDispatchData(data);
          // setLoad(true);
          setLoading(false);
        })
        .catch((err) => setLoading(false));
    } else {
      axiosInstance
        .post(
          "Dispatch/PatientLabSearch",
          getTrimmedData({
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
            DepartmentID: AllDataDropDownPayload(
              formData.DepartmentID,
              DepartmentData,
              "value"
            ),
            SampleStatus: status,
            TestName: formData?.TestName,
            DateTypeSearch: dateTypeSearch
              ? dateTypeSearch
              : formData?.DateTypeSearch,
            User: formData?.User,
            IsUrgent: urgent ? urgent : formData?.IsUrgent ? 1 : 0,
            IsCourier: formData?.IsCourier ? 1 : 0,
          })
        )
        .then((res) => {
          const data = modifyArray(res?.data?.message);
          setTestCount(res?.data?.message?.length);
          setDispatchData(data);
          // setLoad(true);
          setLoading(false);
        })
        .catch((err) => setLoading(false));
    }
  };

  const handleInnerChecked = (e, newIndex, index) => {
    const { name, checked } = e.target;
    const val = [...dispatchData];
    val[index]["TestDetail"][newIndex][name] = checked;
    setDispatchData(val);
  };

  function createCheckbox(item) {
    console.log(item);
    if (item.status == 5 || item.status == 6) {
      return `<input type=\"checkbox\" onchange={handleCheck}  value=\"${item.TestIdHash}\" id=\"${item.LedgerTransactionID}\" class=${item.LedgerTransactionID} />`;
    } else {
      return "";
    }
  }

  function modifyArray(dataArray) {
    let modifiedArray = [];
    let tempObject = {};

    dataArray.forEach((item) => {
      if (tempObject[item.LedgerTransactionID]) {
        tempObject[item.LedgerTransactionID].Test += `<p class="round Status-${
          item.status
        }">${createCheckbox(item)}${item.Test}</p>`;
        tempObject[item.LedgerTransactionID].IsCulture += `${item.IsCulture}#`;
      } else {
        tempObject[item.LedgerTransactionID] = { ...item };
        tempObject[item.LedgerTransactionID].Test = `<p class="round Status-${
          item.status
        }">${createCheckbox(item)}${item.Test}</p>`;
        tempObject[item.LedgerTransactionID].IsCulture = `${item.IsCulture}#`;
      }
    });

    let keys = Object.keys(tempObject).reverse();
    for (let key of keys) {
      modifiedArray.push(tempObject[key]);
    }

    return modifiedArray;
  }

  const handleTime = (time, name) => {
    setFormData({ ...formData, [name]: time });
  };
  useEffect(() => {
    getAccessCentres();
    getDepartment();
    BindEmployeeReports(SetUser);
    getPaymentModes("Identity", setIdentity);
  }, []);

  const handleSelectChange1 = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    value != -1 && TableData(value);
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

  useEffect(() => {
    if (formData?.TestName.length > 2) {
      DepartmentWiseItemList(
        formData.DepartmentID,
        formData?.TestName,
        setTestSuggestion
      );
    }
  }, [formData?.TestName]);
  const EmployeeID = useLocalStorage("userData", "get")?.EmployeeID;
  const getFilterResultOption = () => {
    axiosInstance
      .post("Lab/getFilterTableReprintData", {
        PageName: "DispatchReport",
        EmployeeId: EmployeeID?.toString(),
      })
      .then((res) => {
        let data = res?.data?.message;

        setColumnConfig(data);
      })
      .catch((err) => setColumnConfig([]));
  };

  const handleLogout = () => {
    window.sessionStorage.clear();
    window.localStorage.clear();
    navigate("/PatientPortalLogin");
  };

  useEffect(() => {
    getFilterResultOption();
    if (User == "1") {
      TableData("");
    }
  }, []);
  const items = [
    {
      label: "Status",
      icon: "pi pi-fw pi-cog",
      items: [
        {
          label: "Not Collected",
          value: "1",
          status: true,
          command: () => TableData("1"),
          icon: "circle-icon Status-1",
        },
        {
          label: "Collected",
          value: "2",
          status: true,
          icon: "circle-icon Status-2",
          command: () => TableData("2"),
        },
        {
          label: "Receive",
          value: "3",
          icon: "circle-icon Status-3",
          status: true,
          command: () => TableData("3"),
        },
        {
          label: "Rejected",
          value: "4",
          icon: "circle-icon Status-4",
          status: true,
          command: () => TableData("4"),
        },
        {
          label: "Result Done",
          value: "10",
          icon: "circle-icon Status-10",
          status: true,
          command: () => TableData("10"),
        },
        {
          label: "Approved",
          value: "5",
          icon: "circle-icon Status-5",
          status: true,
          command: () => TableData("5"),
        },
        {
          label: "Hold",
          icon: "circle-icon Status-11",
          value: "11",
          status: true,
          command: () => TableData("11"),
        },
        {
          label: "Re-Run",
          value: "14",
          icon: "circle-icon Status-14",
          status: true,
          command: () => TableData("14"),
        },
        {
          label: "Mac Data",
          value: "13",
          icon: "circle-icon Status-13",
          status: true,
          command: () => TableData("13"),
        },
        {
          label: "Dispatched",
          value: "15",
          icon: "circle-icon Status-15",
          status: true,
          command: () => TableData("15"),
        },
        {
          label: "Printed",
          value: "6",
          icon: "circle-icon Status-6",
          status: true,
          command: () => TableData("6"),
        },
        {
          label: "OutSource",
          value: "18",
          icon: "circle-icon Status-18",
          status: true,
          command: () => TableData("18"),
        },
        {
          label: "All",
          icon: "circle-icon Status-all",
          value: "",
          status: true,
          command: () => TableData(""),
        },
      ],
    },
    {
      label: "Date Type Search",
      icon: "pi pi-fw pi-search",
      items: [
        {
          label: "Registration Date",
          value: "1",
          status: true,
          command: () => TableData(formData.SampleStatus, "ivac.dtEntry"),
          icon: "pi pi-calendar iconField",
        },
        {
          label: "Received Date",
          value: "2",
          status: true,
          icon: "pi pi-user-edit iconField",
          command: () => TableData(formData.SampleStatus, "ivac.ReceiveDate"),
        },
      ],
    },
    {
      label: "Urgent Case",
      icon: "pi pi-hourglass",
      command: () =>
        TableData(
          document.getElementById("SampleStatus").value,
          formData.DateTypeSearch,
          1
        ),
    },
  ];
  const totalPatient = () => {
    const visitNos = dispatchData.map((item) => item.VisitNo);
    const uniqueVisitNos = new Set(visitNos);
    return uniqueVisitNos.size;
  };

  return (
    <>
      {User ? (
        <>
          <Heading
            isBreadcrumb={true}
            name={t("Dispatch Report")}
            logout={true}
            handleLogout={handleLogout}
          />
        </>
      ) : (
        <Heading
          name={t("Dispatch Report")}
          defaultValue={true}
          linkTo="/dispatchreport"
          isBreadcrumb={true}
          linkTitle={
            <div className="link-title-container" id="pr_id_11">
              <div className="link-title-item">
                {t("Total Patient") + " : " + totalPatient()}
              </div>
              <div className="link-title-item">
                {t("Total Test Count") + " : " + testCount}
              </div>
            </div>
          }
        />
      )}
      <Accordion title={t("Dispatch Report Details")} defaultValue={"true"}>
        <div className="row pt-2 pl-2 pr-2">
          <div className="col-sm-2">
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
                  onChange={handleSelectChange}
                  isDisabled={User}
                />
              </div>
              <div style={{ width: "50%" }}>
                {formData?.SelectTypes === "Mobile" ? (
                  <div style={{ width: "100%" }}>
                    <Input
                      type="number"
                      name="ItemValue"
                      max={10}
                      value={formData.ItemValue}
                      onKeyDown={handleKeyDown}
                      onChange={handleChange}
                      onInput={(e) => number(e, 10)}
                      disabled={User}
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
                      disabled={User}
                    />
                    {errors?.ItemValue && (
                      <div className="error-message">{errors?.ItemValue}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-sm-2  ">
          <ReactSelect
              dynamicOptions={AddBlankData(CentreData, "All Centre")}
              name="CentreID"
              lable={t("Centre")}
              id="Centre"
              removeIsClearable={true}
              placeholderName={t("Centre")}
              value={formData?.CentreID}
              onChange={handleSearchSelectChange}
              isDisabled={User}
            />
        
          </div>

          <div className="col-sm-2 ">
            <ReactSelect
                          dynamicOptions={[{ label: "All RateType", value: "" }, ...RateTypes]}
                          name="RateTypeID"
                          lable={t("RateType")}
                          id="RateType"
                          removeIsClearable={true}
                          placeholderName={t("RateType")}
                          value={formData?.RateTypeID}
                          onChange={handleSearchSelectChange}
                          isDisabled={User}
                        />
           
          </div>

          <div className="col-sm-2  ">
          <ReactSelect
              dynamicOptions={AddBlankData(DepartmentData, "All Department")}
              name="DepartmentID"
              lable={t("Department")}
              id="Department"
              removeIsClearable={true}
              placeholderName={t("Department")}
              value={formData?.DepartmentID}
              onChange={handleSearchSelectChange}
              isDisabled={User}
            />
           
          </div>

          <div className="col-sm-2  ">
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
              autoComplete="off"
              disabled={User}
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

          <div className="col-sm-2  ">
            <Input
              type="text"
              name="TestName"
              lable="Search By Test Name"
              id="TestName"
              value={formData.TestName}
              placeholder=" "
              onChange={handleChange}
              onKeyDown={(e) => handleIndex(e, "TestName")}
              disabled={User}
            />
            {TestSuggestion.length > 0 && (
              <AutoComplete
                selects={selects}
                test={TestSuggestion}
                handleListSearch={handleListSearch}
                indexMatch={indexMatch}
              />
            )}
          </div>

          <div className="col-sm-2">
            <ReactSelect
                          dynamicOptions={[{ label: "Select Employee", value: "" }, ...user]}
                          name="User"
                          lable={t("Employee")}
                          id="Employee"
                          removeIsClearable={true}
                          placeholderName={t("Employee")}
                          value={formData?.User}
                          onChange={handleSearchSelectChange}
                          isDisabled={User}
                        />
            
          </div>
          <div className="col-sm-2  ">
            <SelectBox
              options={DateTypeSearch2}
              formdata={formData?.DateTypeSearch}
              name="DateTypeSearch"
              lable="DateTypeSearch"
              id="DateTypeSearch"
              onChange={handleSelectChange}
              isDisabled={User}
            />
          </div>
          <div className="col-sm-2">
            <DatePicker
              className="custom-calendar"
              name="FromDate"
              value={formData?.FromDate}
              onChange={dateSelect}
              placeholder=" "
              id="FromDate"
              lable="FromDate"
              maxDate={new Date(formData?.ToDate)}
              disabled={User}
            />
          </div>
          <div className="col-sm-1">
            <CustomTimePicker
              name="FromTime"
              placeholder="FromTime"
              value={formData?.FromTime}
              id="FromTime"
              lable="FromTime"
              onChange={handleTime}
              disabled={User}
            />
          </div>
          <div className="col-sm-2">
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
              disabled={User}
            />
          </div>
          <div className="col-sm-1">
            <CustomTimePicker
              name="ToTime"
              placeholder="ToTime"
              value={formData?.ToTime}
              id="ToTime"
              lable="ToTime"
              onChange={handleTime}
              disabled={User}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={[...SampleStatus]}
              onChange={handleSelectChange1}
              name="SampleStatus"
              lable="SampleStatus"
              id="SampleStatus"
              selectedValue={formData.SampleStatus}
              isDisabled={User}
            />
          </div>

          <div className="col-sm-1 d-flex mb-2 col-3">
            <input
              id="IsUrgent"
              type="checkbox"
              name="IsUrgent"
              checked={formData?.IsUrgent}
              onChange={handleSelectChange}
              disabled={User}
            />
            <label htmlFor="IsUrgent" className="ml-2">
              {t("IsUrgent")}
            </label>
          </div>
          {/* <div className="col-sm-1 d-flex mb-2">
            <input
              type="checkbox"
              name="IsCourier"
              id="IsCourier"
              checked={formData?.IsCourier}
              onChange={handleSelectChange}
              disabled={User}
            />
            <label htmlFor="IsCourier" className="ml-2">
              IsCourier
            </label>
          </div> */}
          <div className="col-sm-1 col-4">
            <button
              onClick={() =>
                TableData(document.getElementById("SampleStatus").value)
              }
              className="btn btn-primary btn-block btn-sm"
              disabled={User}
            >
              {t("Search")}
            </button>
          </div>
          <div className="col-sm-9 col-4"></div>
          <div className="col-sm-1 col-1" style={{ textAlign: "end" }}>
            <DispatchMoreFilter items={items} />
          </div>
        </div>
      </Accordion>
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

      {show?.modal && (
        <UploadFile
          show={show?.modal}
          handleClose={() => {
            setShow({ modal: false, data: "", index: -1 });
          }}
          options={Identity}
          documentId={show?.data}
          pageName="Patient Registration"
          handleUploadCount={handleUploadCount}
        />
      )}

      <div className="mt-2">
        {loading ? (
          <Loading />
        ) : (
          <>
            <Accordion
              notOpen={true}
              title={
                <>
                  {dispatchData?.length == 0 ? (
                    t("Search Result")
                  ) : (
                    <div className="d-flex">
                      <span className="mt-1">
                        {" "}
                        {t("Click Icon To Filter Results")}{" "}
                      </span>
                      <span
                        className="header ml-1"
                        style={{ cursor: "pointer" }}
                      >
                        <ReceiptReprintFilter
                          columnConfig={columnConfig}
                          setColumnConfig={setColumnConfig}
                          PageName="DispatchReport"
                        />
                      </span>
                    </div>
                  )}
                </>
              }
              defaultValue={true}
            >
              <DispatchReportTable
                dispatchData={dispatchData}
                show={setShow4}
                show2={setShow}
                handleInnerChecked={handleInnerChecked}
                columnConfig={columnConfig}
                TableData={TableData}
                Status={formData?.SampleStatus}
              />
            </Accordion>
          </>
        )}
      </div>
    </>
  );
};

export default DispatchReport;
