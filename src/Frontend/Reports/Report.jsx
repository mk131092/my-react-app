import React, { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import DatePicker from "../../components/formComponent/DatePicker";
import Input from "../../components/formComponent/Input";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Loading from "../../components/loader/Loading";
import Accordion from "@app/components/UI/Accordion";
import { useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { axiosInstance, axiosReport } from "../../utils/axiosInstance";
import { SelectBoxWithCheckbox } from "../../components/formComponent/MultiSelectBox";
import { workSheetSampleStatus } from "../../utils/Constants";
import CustomTimePicker from "../../components/formComponent/TimePicker";
import {
  BindApprovalDoctorReports,
  BindEmployeeReports,
  BindProEmployee,
  getAccessCentresReports,
  getAccessDataRateReport,
  getPaymentModes,
  getVisitType,
} from "../../utils/NetworkApi/commonApi";

import Heading from "../../components/UI/Heading";
import { commonDataState, Time } from "../../utils/helpers";
import ReactSelect from "../../components/formComponent/ReactSelect";
import Tables from "../../components/UI/customTable";
import axios from "axios";
const DocumentType = [
  {
    label: "Select Document Type",
    value: 0,
  },
  {
    label: "PDF",
    value: 2,
  },
  {
    label: "Excel",
    value: 1,
  },
];

const SearchByDate = [
  {
    label: "Select Document Type",
    value: "",
  },
  {
    label: "Registeration Date",
    value: "RegisterationDate",
  },
  {
    label: "Sample Collection Date",
    value: "SampleCollectionDate",
  },
  {
    label: "Sample Receiving Date ",
    value: "SampleReceivingDate",
  },
  {
    label: "Approved Date",
    value: "ApprovedDate",
  },
  {
    label: "Sample Rejection Date",
    value: "SampleRejectionDate",
  },
];

function GetReport() {
  const { t } = useTranslation();
  const location = useLocation();
  const { id } = useParams();
  const [load, setLoad] = useState(true);
  const [CentreData, setCentreData] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [VisitType, setVisitType] = useState([]);
  const [DoctorName, setDoctorAdmin] = useState([]);
  const [EmployeeName, setEmployeeName] = useState([]);
  const [mapTest, setMapTest] = useState([]);
  const [ObservationData, setObservationData] = useState([]);
  const [rateType, setRateType] = useState([]);
  const [reportType, setReportType] = useState("0");
  const [FieldShow, setFieldShow] = useState({});
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [proEmployee, setProEmployee] = useState([]);
  const [PatientSource, setPatientSource] = useState([]);
  const [htmlData, setHtmlData] = useState([]);
  const handleRadioChange = (e) => {
    setReportType(e.target.value);
  };
  const currentPathname = window.location.pathname;
  const today = new Date();
  const allowedExcelOnlyPaths = [
    "/getreport/departmentwisetestreport",
    "/getreport/referedbytestreport",
    "/getreport/valuewisemisreport",
    "/getreport/departmentwisevisittypetestreport"
  ];
  const [formData, setFormData] = useState({
    Centre: [],
    FromDate: new Date(),
    FromTime: new Date(today.setHours(0, 0, 0, 0)),
    ToTime: new Date(today.setHours(23, 59, 59, 999)),
    ToDate: new Date(),
    DocumentType: allowedExcelOnlyPaths.includes(
      location.pathname?.toLowerCase().trim()
    )
      ? 1
      : 2,
    Test: [],
    User: [],
    RateType: [],
    Department: [],
    VisitType: "",
    ReportType: "",
    TestId: [],
    FromRange: "",
    ToRange: "",
    ObservationId: [],
    InvestigationId: [],
    PatientType: "",
    Doctor: [],
    DateType: "",
    Urgent: "",
    Status: "",
    PatientName: "",
    VisitNo: "",
    DiscountApprovalUser: [],
    Barcodeno: "",
    ChkisUrgent: 0,
    chkTATDelay: 0,
    SearchByDate: "",
    ProEmployee: "",
    LabNo: "",
    ProReportType: "Summary",
    Source: "",
  });

  const getFilteredDocumentType = () => {
    const cleanPath = location.pathname?.toLowerCase().trim();
    return allowedExcelOnlyPaths.includes(cleanPath)
      ? DocumentType.filter((doc) => doc.label === "Excel")
      : DocumentType;
  };

  console.log(htmlData);
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (name === "Department") {
      setFormData({ ...formData, [name]: Number(value) });
    } else if (name === "Centre") {
      setFormData({ ...formData, [name]: Number(value) });
      getAccessDataRateReport(setRateType, value.toString());
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
      });
    }
  };
  const handleSearchSelectChange = (label, value) => {
    console.log({ label, value });
    if (label === "PatientType") {
      setFormData({
        ...formData,
        ["PatientType"]: value?.value?.toString(),
      });
    }
    if (label === "VisitType") {
      setFormData({
        ...formData,
        ["VisitType"]: value?.value?.toString(),
      });
    }
    if (label === "TestId") {
      const selected = Array.isArray(value?.value)
        ? value?.value
        : [value?.value];
      setFormData((prev) => ({
        ...prev,
        TestId: selected,
        ObservationId: [],
      }));
      if (value?.value) {
        getObservationList(value.value);
      }
    }
    if (label === "ObservationId") {
      const selected = Array.isArray(value?.value)
        ? value?.value
        : [value?.value];

      setFormData((prev) => ({
        ...prev,
        ObservationId: selected,
      }));
    }
  };

  const dateSelect = (date, name) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const handleTime = (time, name) => {
    setFormData({ ...formData, [name]: time });
  };
  const getDepartmentReports = (state) => {
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
        state(DeptDataValue);
      })
      .catch((err) => console.log(err));
  };
  const getInvestigationList = () => {
    axiosInstance
      .get("Investigations/BindInvestigationList")
      .then((res) => {
        let data = res.data.message;

        let filteredData = FieldShow?.TestId
          ? data.filter(
              (ele) => ele.DataType === "Profile" || ele.DataType === "Test"
            )
          : data;
        let MapTest = filteredData.map((ele) => {
          return {
            value: ele.InvestigationID,
            label: ele.TestName,
          };
        });
        setMapTest(MapTest);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getInvestigationList();
  }, []);
  const getObservationList = (id) => {
    axiosInstance
      .post("Investigations/BindLabObservationList", {
        InvestigationID: id,
      })
      .then((res) => {
        let data = res.data.message;
        let Observation = data.map((ele) => {
          return {
            value: ele.labObservationID,
            label: ele.TestName,
          };
        });
        setObservationData(Observation);
      })
      .catch((err) => console.log(err));
  };

  const getDepartmentWiseTest = (id) => {
    axiosInstance
      .post("CommonController/DepartmentWiseItemList", {
        DepartmentID: id,
        TestName: "",
      })
      .then((res) => {
        let data = res.data.message;
        let TestData = data.map((ele) => {
          return {
            value: ele.InvestigationID,
            label: ele.TestName,
          };
        });
        setMapTest(TestData);
      })
      .catch((err) => console.log(err));
  };

  const getPatientInfoReport = () => {
    setLoadingSearch(true);
    axios
      .post(
        `/reports/v1/commonReports/${id}`,
        {
          ...formData,
          ToDate: moment(formData?.ToDate).format("DD-MMM-YYYY"),
          FromDate: moment(formData?.FromDate).format("DD-MMM-YYYY"),
          FromTime: Time(formData.FromTime),
          ToTime: Time(formData.ToTime),
          DocumentType: Number(formData?.DocumentType),
          ReportType: reportType?.toString(),
          ledgertransactionid: "",
          Centre:
            formData?.Centre?.length > 0
              ? formData?.Centre
              : commonDataState(CentreData),
          Test:
            formData?.Test?.length > 0
              ? formData?.Test
              : commonDataState(mapTest),
          User:
            formData?.User?.length > 0
              ? formData?.User
              : commonDataState(EmployeeName),
          RateType:
            formData?.RateType?.length > 0
              ? formData?.RateType
              : commonDataState(rateType),
          Department:
            formData?.Department?.length > 0
              ? Array.isArray(formData?.Department)
                ? formData?.Department
                : Array(formData?.Department)
              : commonDataState(Department),
          TestId:
            formData?.TestId?.length > 0
              ? formData?.TestId
              : commonDataState(mapTest),
          ObservationId:
            formData?.ObservationId?.length > 0
              ? formData?.ObservationId
              : commonDataState(ObservationData),
          InvestigationId:
            formData?.InvestigationId?.length > 0
              ? formData?.InvestigationId
              : commonDataState(mapTest),
          Doctor:
            formData?.Doctor?.length > 0
              ? formData.Doctor
              : [...commonDataState(DoctorName), 1],
          DiscountApprovalUser:
            formData?.DiscountApprovalUser?.length > 0
              ? formData?.DiscountApprovalUser
              : commonDataState(EmployeeName),
        },
        formData?.DocumentType == 1 && { method: "GET", responseType: "blob" }
      )
      .then((res) => {
        setLoadingSearch(false);

        if (formData?.DocumentType == 1) {
          console.log(res);
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${id}.xlsx`);
          document.body.appendChild(link);
          link.click();
        }
        if (formData?.DocumentType == 2) {
          window.open(res?.data?.url, "_blank");
        }
        if (formData?.DocumentType == 3) {
          setHtmlData(res?.data?.message);
        }
      })
      .catch((err) => {
        setLoadingSearch(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
      });
  };

  const getPatientInfoField = (id) => {
    setLoad(true);
    axiosReport
      .get(`commonReports/getFields/${id}`)
      .then((res) => {
        setLoad(false);
        bindApiResponseAccording(res?.data?.message);
        setFieldShow({
          ...res?.data?.message,
          AsOnNowOutstanding: id == "OutStandingReport" ? true : false,
          DateWiseOutstanding: id == "OutStandingReport" ? true : false,
        });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const bindApiResponseAccording = (data) => {
    const {
      Centre,
      User,
      RateType,
      Department,
      DiscountApproval,
      DiscountApprovalUser,
      ReportType,
      Test,
      PatientType,
      Doctor,
      DateType,
      Urgent,
      Status,
      MultipleCentre,
      MultipleRateType,
      MultipleDepartment,
      MultipleUser,
      MultipleReportType,
      MultipleDoctor,
      MultipleStatus,
      MultiplePatientType,
      MultipleDateType,
      MultipleTest,
      Barcodeno,
      ChkisUrgent,
      chkTATDelay,
      SearchByDate,
      AsOnNowOutstanding,
      DateWiseOutstanding,
      ProEmployee,
      Source,
      VisitType,
      Observation,
      ObservationId,
    } = data;
    if (Centre || MultipleCentre) {
      getAccessCentresReports(setCentreData);
    }
    if (Department || MultipleDepartment) {
      getDepartmentReports(setDepartment);
    }
    if (User || MultipleUser || DiscountApprovalUser) {
      BindEmployeeReports(setEmployeeName);
    }
    if (Doctor || MultipleDoctor) {
      BindApprovalDoctorReports(setDoctorAdmin);
    }
    if (RateType || MultipleRateType) {
      getAccessDataRateReport(setRateType, formData?.Centre.toString()).then(
        (res) => {
          console.log(res);
        }
      );
    }
    if (ProEmployee) {
      BindProEmployee(setProEmployee);
    }
    if (Source) {
      getPaymentModes("Source", setPatientSource);
    }
    if (VisitType) {
      getVisitType(setVisitType);
    }
    if (PatientType) {
      getVisitType(setVisitType);
    }
  };
  const handleSelectMultiChange = (select, name) => {
    const val = select?.map((ele) => ele?.value);
    setFormData({ ...formData, [name]: val });
    if (name === "Department") {
      setFormData({ ...formData, [name]: val });
      if (val) {
        getDepartmentWiseTest(val);
      }
    }
    if (name === "Centre") getAccessDataRateReport(setRateType, val.toString());
  };

  useEffect(() => {
    setFormData({
      Centre: [],
      FromDate: new Date(),
      FromTime: new Date(today.setHours(0, 0, 0, 0)),
      ToTime: new Date(today.setHours(23, 59, 59, 999)),
      ToDate: new Date(),
      DocumentType: allowedExcelOnlyPaths.includes(
        location.pathname?.toLowerCase().trim()
      )
        ? 1
        : 2,
      User: [],
      RateType: [],
      Department: [],
      VisitType: "",
      ReportType: "",
      PatientType: "",
      Doctor: [],
      DateType: "",
      Urgent: "",
      Status: "",
      PatientName: "",
      VisitNo: "",
      Test: [],
      InvestigationId: [],
      TestId: [],
      FromRange: "",
      ToRange: "",
      ObservationId: [],
      DiscountApprovalUser: [],
      Barcodeno: "",
      ChkisUrgent: 0,
      chkTATDelay: 0,
      SearchByDate: "",
      ProEmployee: "",
      ProReportType: "Summary",
      LabNo: "",
      Source: "",
    });
    getPatientInfoField(id);
  }, [location?.pathname]);

  let pathNameTitle = location.pathname
    .split("/")
    .slice(-1)[0]
    .replace(/([a-z])([A-Z])/g, "$1 $2");
  return (
    <>
      {load ? (
        <Loading />
      ) : (
        <>
          <Accordion
            name={`${t("Get Reports For")}  ${t(pathNameTitle)}`}
            defaultValue={true}
            isBreadcrumb={true}
          >
            <div className="row px-2 mt-2 p-1">
              {FieldShow?.Centre && (
                <div className="col-sm-2">
                  <SelectBox
                    className="required-fields"
                    lable="Select Centre"
                    options={[
                      { label: "All Centre", value: [] },
                      ...CentreData,
                    ]}
                    selectedValue={formData?.Centre}
                    name="Centre"
                    onChange={handleSelectChange}
                  />
                </div>
              )}
              {console.log(CentreData)}
              {FieldShow?.MultipleCentre && (
                <div className="col-sm-2">
                  <SelectBoxWithCheckbox
                    label="All Centre"
                    options={CentreData}
                    value={formData?.Centre}
                    name="Centre"
                    onChange={handleSelectMultiChange}
                    lable={t("Select Centre")}
                  />
                </div>
              )}

              {FieldShow?.RateType && (
                <div className="col-sm-2">
                  <SelectBox
                    options={[
                      { label: "All Rate Type", value: [] },
                      ...rateType,
                    ]}
                    selectedValue={formData?.RateType}
                    name="RateType"
                    lable="Select RateType"
                    onChange={handleSelectChange}
                    className="required-fields"
                  />
                </div>
              )}

              {FieldShow?.MultipleRateType && (
                <div className="col-sm-2">
                  <SelectBoxWithCheckbox
                    label="All RateType"
                    options={rateType}
                    value={formData?.RateType}
                    name="RateType"
                    onChange={handleSelectMultiChange}
                    lable={t("Select RateType")}
                  />
                </div>
              )}

              {FieldShow?.Department && (
                <div className="col-sm-2 ">
                  <SelectBox
                    className="required-fields"
                    options={[
                      { label: "All Department", value: [] },
                      ...Department,
                    ]}
                    selectedValue={formData.Department}
                    name="Department"
                    onChange={handleSelectChange}
                    lable={t("Select Department")}
                  />
                </div>
              )}

              {FieldShow?.Source && (
                <div className="col-sm-2 ">
                  <SelectBox
                    className="required-fields"
                    options={[
                      { label: "Select Source", value: "" },
                      ...PatientSource,
                    ]}
                    selectedValue={formData.Source}
                    name="Source"
                    onChange={handleSelectChange}
                    lable={t("Select Source")}
                  />
                </div>
              )}

              {FieldShow?.MultipleDepartment && (
                <div className="col-sm-2">
                  <SelectBoxWithCheckbox
                    label="All Department"
                    options={Department}
                    value={formData?.Department}
                    name="Department"
                    onChange={handleSelectMultiChange}
                    lable={t("Select Department")}
                  />
                </div>
              )}
              {FieldShow?.VisitType && (
                <div className="col-sm-2 ">
                  <ReactSelect
                    name="VisitType"
                    id="VisitType"
                    removeIsClearable={true}
                    dynamicOptions={VisitType}
                    placeholderName="VisitType"
                    value={formData?.VisitType}
                    onChange={handleSearchSelectChange}
                  />
                </div>
              )}
              {FieldShow?.PatientType && (
                <div className="col-sm-2 ">
                  <ReactSelect
                    name="PatientType"
                    id="PatientType"
                    removeIsClearable={true}
                    dynamicOptions={VisitType}
                    placeholderName="PatientType"
                    value={formData?.PatientType}
                    onChange={handleSearchSelectChange}
                  />
                </div>
              )}
              {FieldShow?.TestId && (
                <div className="col-sm-3">
                  <ReactSelect
                    dynamicOptions={[
                      { label: "All Test", value: [] },
                      ...mapTest,
                    ]}
                    removeIsClearable={true}
                    value={formData?.TestId}
                    name="TestId"
                    placeholderName="Test"
                    onChange={handleSearchSelectChange}
                  />
                </div>
              )}
              {FieldShow?.ObservationId && (
                <div className="col-sm-3">
                  <ReactSelect
                    dynamicOptions={[
                      { label: "Select Observations", value: [] },
                      ...ObservationData,
                    ]}
                    removeIsClearable={true}
                    value={formData?.ObservationId}
                    name="ObservationId"
                    placeholderName="Observation"
                    onChange={handleSearchSelectChange}
                  />
                </div>
              )}
              {FieldShow?.FromRange && (
                <div className="col-sm-2">
                  <Input
                    lable="FromRange"
                    id="FromRange"
                    name="FromRange"
                    onChange={handleSelectChange}
                    value={formData?.FromRange}
                    placeholder=" "
                  />
                </div>
              )}
              {FieldShow?.ToRange && (
                <div className="col-sm-2">
                  <Input
                    lable="ToRange"
                    id="ToRange"
                    name="ToRange"
                    onChange={handleSelectChange}
                    value={formData?.ToRange}
                    placeholder=" "
                  />
                </div>
              )}

              {FieldShow?.SearchByDate && (
                <div className="col-sm-2 ">
                  <SelectBox
                    className="required-fields"
                    options={SearchByDate}
                    selectedValue={formData.SearchByDate}
                    name="SearchByDate"
                    onChange={handleSelectChange}
                    lable={t("Search By Date")}
                  />
                </div>
              )}

              {FieldShow?.FromDate && (
                <div className="col-sm-2">
                  <DatePicker
                    className="custom-calendar"
                    name="FromDate"
                    value={formData?.FromDate}
                    onChange={dateSelect}
                    onChangeTime={handleTime}
                    secondName={FieldShow?.FromTime && "FromTime"}
                    maxDate={new Date()}
                    lable={t("FromDate")}
                  />
                </div>
              )}
              {FieldShow?.FromTime && (
                <div className="col-sm-1">
                  <CustomTimePicker
                    value={formData?.FromTime}
                    onChange={handleTime}
                    id="FromTime"
                    lable="FromTime"
                    name="FromTime"
                    placeholder="FromTime"
                  />
                </div>
              )}
              {FieldShow?.ToDate && (
                <div className="col-sm-2 ">
                  <DatePicker
                    className="custom-calendar"
                    name="ToDate"
                    value={formData?.ToDate}
                    onChange={dateSelect}
                    onChangeTime={handleTime}
                    secondName={FieldShow?.ToTime && "ToTime"}
                    maxDate={new Date()}
                    minDate={new Date(formData.FromDate)}
                    lable={t("ToDate")}
                  />
                </div>
              )}
              {FieldShow?.ToTime && (
                <div className="col-sm-1">
                  <CustomTimePicker
                    value={formData?.ToTime}
                    onChange={handleTime}
                    id="ToTime"
                    lable="ToTime"
                    name="ToTime"
                    placeholder="ToTime"
                  />
                </div>
              )}

              {FieldShow?.DataType && (
                <div className="col-sm-2 ">
                  <SelectBox
                    className="required-fields"
                    options={[
                      { label: "DateType", value: "" },
                      ...DateTypeSearch,
                    ]}
                    formdata={formData?.DateType}
                    name="DateType"
                    onChange={handleSelectChange}
                    lable={t("select DateType")}
                  />
                </div>
              )}

              {FieldShow?.User && (
                <div className="col-sm-2 ">
                  <SelectBox
                    className="required-fields"
                    options={[
                      { label: "All Employee", value: [] },
                      ...EmployeeName,
                    ]}
                    formdata={formData?.User}
                    name="User"
                    lable="Select Employee"
                    onChange={handleSelectChange}
                    label={t("Select Employee")}
                  />
                </div>
              )}

              {FieldShow?.PatientName && (
                <div className="col-sm-2 ">
                  <Input
                    lable="PatientName"
                    id="PatientName"
                    name="PatientName"
                    onChange={handleSelectChange}
                    value={formData?.PatientName}
                    placeholder=" "
                  />
                </div>
              )}
              {FieldShow?.VisitNo && (
                <div className="col-sm-2 ">
                  <Input
                    lable="VisitNo"
                    id="VisitNo"
                    placeholder=" "
                    name="VisitNo"
                    onChange={handleSelectChange}
                    value={formData?.VisitNo}
                    label={t("Visit No")}
                  />
                </div>
              )}
              {FieldShow?.MultipleUser && (
                <div className="col-sm-2 ">
                  <SelectBoxWithCheckbox
                    label="All Employee"
                    options={EmployeeName}
                    value={formData?.User}
                    name="User"
                    onChange={handleSelectMultiChange}
                    lable={t("Select Employee")}
                  />
                </div>
              )}

              {FieldShow?.Doctor && (
                <div className="col-sm-2 ">
                  <SelectBox
                    options={[
                      { label: "All Doctor", value: [] },
                      ...DoctorName,
                    ]}
                    formdata={formData?.Doctor}
                    name="Doctor"
                    onChange={handleSelectChange}
                    lable={t("Select Doctor")}
                  />
                </div>
              )}

              {FieldShow?.MultipleDoctor && (
                <div className="col-sm-2 ">
                  <SelectBoxWithCheckbox
                    label={t("All Doctor")}
                    options={[{ label: "Self", value: 1 }, ...DoctorName]}
                    value={formData?.Doctor}
                    name="Doctor"
                    onChange={handleSelectMultiChange}
                    lable={t("Select Doctor")}
                  />
                </div>
              )}

              {FieldShow?.MultipleTest && (
                <div className="col-sm-2">
                  <SelectBoxWithCheckbox
                    label={t("All Test")}
                    options={mapTest}
                    value={formData?.Test}
                    name="InvestigationId"
                    onChange={handleSelectMultiChange}
                    lable={t("Select Test")}
                  />
                </div>
              )}
              {FieldShow?.Test && (
                <div className="col-sm-2">
                  <SelectBoxWithCheckbox
                    label={t("All Test")}
                    options={mapTest}
                    value={formData?.InvestigationId}
                    name="InvestigationId"
                    onChange={handleSelectMultiChange}
                    lable={t("Select Test")}
                  />
                </div>
              )}
              {FieldShow?.Status && (
                <div className="col-sm-2">
                  <SelectBox
                    options={workSheetSampleStatus}
                    selectedValue={formData.Status}
                    name="Status"
                    onChange={handleSelectChange}
                    lable={t("Status")}
                  />
                </div>
              )}

              {FieldShow?.DiscountApprovalUser && (
                <div className="col-sm-2">
                  <SelectBoxWithCheckbox
                    label={t("All DiscountApprovalUser")}
                    options={[...EmployeeName]}
                    value={formData.DiscountApprovalUser}
                    name="DiscountApprovalUser"
                    onChange={handleSelectMultiChange}
                    lable={t("DiscountApprovalUser")}
                  />
                </div>
              )}

              {FieldShow?.Barcodeno && (
                <div className="col-sm-2 ">
                  <Input
                    className="form-control required-fields"
                    name="Barcodeno"
                    onChange={handleSelectChange}
                    value={formData?.Barcodeno}
                    label={t("Barcode No")}
                  />
                </div>
              )}
              {FieldShow?.LabNo && (
                <div className="col-sm-2 ">
                  <Input
                    className="form-control required-fields"
                    name="LabNo"
                    onChange={handleSelectChange}
                    value={formData?.LabNo}
                    label={t("Lab No")}
                  />
                </div>
              )}
              {FieldShow?.ProEmployee && (
                <div className="col-sm-2">
                  <SelectBoxWithCheckbox
                    label={t("All ProEmployee")}
                    options={proEmployee}
                    value={formData?.ProEmployee}
                    name="ProEmployee"
                    onChange={handleSelectMultiChange}
                    lable={t("Select ProEmployee")}
                  />
                </div>
              )}
              <div className="col-sm-2 ">
                <SelectBox
                  className="required-fields"
                  options={getFilteredDocumentType()}
                  selectedValue={formData.DocumentType}
                  name="DocumentType"
                  onChange={handleSelectChange}
                  lable={t("Select DocumentType")}
                />
              </div>

              {FieldShow?.Urgent && (
                <div
                  className="col-sm-2 d-flex"
                  style={{
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <label>
                    <small>{t("Urgent")}</small>
                  </label>
                  <input
                    type="checkbox"
                    name="Urgent"
                    value={formData?.Urgent}
                    onChange={handleSelectChange}
                  />
                </div>
              )}
              {FieldShow?.ChkisUrgent && (
                <div
                  className="col-sm-2 d-flex"
                  style={{
                    justifyContent: "space-around",
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <label>
                    <small>{t("Check Is Urgent")}</small>
                  </label>
                  <input
                    type="checkbox"
                    name="ChkisUrgent"
                    value={formData?.ChkisUrgent}
                    onChange={handleSelectChange}
                  />
                </div>
              )}
              {FieldShow?.chkTATDelay && (
                <div
                  className="col-sm-2 d-flex"
                  style={{
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <label>
                    <small>{t("Check TAT Delay")}</small>
                  </label>
                  <input
                    type="checkbox"
                    name="chkTATDelay"
                    value={formData?.chkTATDelay}
                    onChange={handleSelectChange}
                  />
                </div>
              )}
              {FieldShow?.ProReporttype && (
                <div className="col-sm-3">
                  <label>
                    <small>{t("Report type")}&nbsp;</small>
                  </label>
                  <div
                    className="d-flex"
                    style={{
                      alignItems: "center",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <label>
                      <small>{t("Summary")}&nbsp;</small>
                    </label>
                    <input
                      type="radio"
                      value="Summary"
                      checked={formData.ProReportType === "Summary"}
                      name="ProReportType"
                      onChange={handleSelectChange}
                    />
                    <label>
                      <small>{t("Detail")}&nbsp;</small>
                    </label>
                    <input
                      type="radio"
                      value="Detail"
                      checked={formData.ProReportType === "Detail"}
                      name="ProReportType"
                      onChange={handleSelectChange}
                    />
                    <label>
                      <small>{t("Test Count")}&nbsp;</small>
                    </label>
                    <input
                      type="radio"
                      value="TestCount"
                      checked={formData.ProReportType === "TestCount"}
                      name="ProReportType"
                      onChange={handleSelectChange}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="row px-2 mb-2">
              <div className="col-sm-1">
                {loadingSearch ? (
                  <Loading />
                ) : (
                  <button
                    className="btn-block btn btn-success btn-sm "
                    onClick={getPatientInfoReport}
                  >
                    {t("Get Report")}
                  </button>
                )}
              </div>

              <div className="col-sm-2">
                {FieldShow?.AsOnNowOutstanding && (
                  <>
                    <input
                      type="radio"
                      name="AsOnNowOutstanding"
                      value="0"
                      checked={reportType == "0" ? true : false}
                      onChange={handleRadioChange}
                    />
                    <label style={{ marginLeft: "10px" }}>
                      {t("As On Now Outstanding")}
                    </label>
                  </>
                )}
              </div>
              <div className="col-sm-2">
                {FieldShow?.DateWiseOutstanding && (
                  <>
                    <input
                      type="radio"
                      name="DateWiseOutstanding"
                      value="1"
                      onChange={handleRadioChange}
                      checked={reportType == "1" ? true : false}
                    />
                    <label style={{ marginLeft: "10px" }}>
                      {t("Datewise Outstanding")}
                    </label>
                  </>
                )}
              </div>
            </div>
          </Accordion>
          {htmlData?.length > 0 && (
            <Accordion title={t("HTML Data")} defaultValue={true}>
              <Tables>
                <thead>
                  <tr>
                    {Object.keys(htmlData[0])?.map((ele, index) => (
                      <th key={index}>{ele}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {htmlData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.keys(htmlData[0]).map((header, colIndex) => (
                        <td key={colIndex}>{row[header]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Tables>
            </Accordion>
          )}
        </>
      )}
    </>
  );
}

export default GetReport;
