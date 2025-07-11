import React, { useEffect, useRef, useState } from "react";
import {
  DateTypeSearch2,
  Flag,
  Order,
  SampleStatus,
  SearchBy,
} from "../../utils/Constants";
import Accordion from "@app/components/UI/Accordion";
import {
  AddBlankData,
  AllDataDropDownPayload,
  CheckDevice,
  DyanmicStatusResponse,
  Time,
  autocompleteOnBlur,
  dateConfig,
  getTrimmedData,
  number,
  onlyNumbers,
  shouldIncludeAIIMSID,
} from "../../utils/helpers";
import { axiosInstance, axiosReport } from "../../utils/axiosInstance";
import {
  DepartmentWiseItemList,
  getDoctorSuggestion,
  getPaymentModes,
} from "../../utils/NetworkApi/commonApi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Tables from "../../components/UI/customTable";
import { toast } from "react-toastify";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { isChecked } from "../util/Commonservices";
import { Dialog } from "primereact/dialog";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import PatientDetailModal from "../utils/PatientDetailModal";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
import CustomTimePicker from "../../components/formComponent/TimePicker";
import RETable from "../Table/ResultEntryTable";
import Loading from "../../components/loader/Loading";
import MedicialModal from "../utils/MedicialModal";
import UploadFile from "../utils/UploadFileModal/UploadFile";
import RSadvanceFilter from "../utils/RSadvanceFilter";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Input from "../../components/formComponent/Input";
import AutoComplete from "../../components/formComponent/AutoComplete";
import DatePicker from "../../components/formComponent/DatePicker";
import OldReportModal from "../utils/OldReportModal";
import ResultEntryEditModal from "../utils/ResultEntryEditModal";
import ResultEditAddModal from "../utils/ResultEditAddModal";
import TemplateMasterModal from "../utils/TemplateMasterModal";
import RerunResultEntryModal from "../utils/RerunResultEntryModal";
import AuditTrailMoadal from "../utils/AuditTrailMoadal";
import Reason from "../utils/Reason";
import SampleRemark from "../utils/SampleRemark";
import ReceiptReprintFilter from "./ReceiptReprintFilter";
import ResultEntryTableCustom from "./ResultEntryTableCustom";
import Tooltip from "../../components/formComponent/Tooltip";
import RejectModal from "../utils/RejectModal";
import CryptoJS from "crypto-js";
import ReactSelect from "../../components/formComponent/ReactSelect";
const ResultEntry = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [TestSuggestion, setTestSuggestion] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [doctorAdmin, setDoctorAdmin] = useState([]);
  const [RateTypes, setRateTypes] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [ResultTestData, setResultTestData] = useState([]);
  const [ResultData, setResultData] = useState([]);
  const [HiddenDropDownHelpMenu, setHiddenDropDownHelpMenu] = useState(false);
  const [indexMatch, setIndexMatch] = useState(0);
  const [buttonsData, setButtonsData] = useState([]);
  const [helpmenu, setHelpMenu] = useState([]);
  // const [DlcCheckChecked, setDlcCheckChecked] = useState(true);
  const [dropFalse, setDropFalse] = useState(true);
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [statusValue, setStatusValue] = useState("");
  const [modalpayload, setmodalPayload] = useState({});
  const [machine, setMachine] = useState([]);
  const [machineId, setMachineId] = useState([]);
  const [show, setShow] = useState({
    moadal: false,
    data: {},
  });

  const [testCount, setTestCount] = useState(0);
  const [columnConfig, setColumnConfig] = useState([]);
  const [approve, setshowApprove] = useState({
    msg: "",
    show: false,
  });
  const [PreviousTestResult, setPreviousTestResult] = useState([]);
  const [headerTestResult, setHeaderTestResult] = useState([]);
  const [show2, setShow2] = useState({
    moadal: false,
    data: {},
  });
  const [PrintReportLoading, setPrintReportLoading] = useState(false);
  const [showAdvanceFilter, setShowAdvanceFilter] = useState({
    show: false,
    data: "",
  });
  const [selects, setSelects] = useState(false);
  const [show3, setShow3] = useState({
    modal: false,
    data: {},
  });

  const [show4, setShow4] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  // console.log(ResultData);
  const [show5, setShow5] = useState({
    modal: false,
    data: "",
  });

  const [mouseHover, setMouseHover] = useState({
    index: -1,
    data: [],
  });
  const [testHeaderHover, setTestHeaderHover] = useState({
    index: -1,
    data: [],
  });

  const [toggleDate, setToggleDate] = useState({
    FromDate: false,
    ToDate: false,
  });
  const [showReject, setShowReject] = useState({
    show: false,
    data: {},
  });
  const [showRemark, setShowRemark] = useState(false);
  const [showPrickRemark, setShowPrickRemark] = useState(false);
  const [redata, SetReData] = useState([]);
  const [showdetails, setshowDetails] = useState(true);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [Identity, setIdentity] = useState([]);
  const [showAuditTrail, setShowAuditTrail] = useState({
    show: false,
    data: "",
    testname: "",
  });
  const [show6, setShow6] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const [show7, setShow7] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  const today = new Date();
  const [formData, setFormData] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    CentreID: "",
    ItemValue: "",
    RateTypeID: "",
    SelectTypes: "",
    RefundFilter: null,
    FromTime: new Date(today.setHours(0, 0, 0, 0)),
    ToTime: new Date(today.setHours(23, 59, 59, 999)),
    DoctorReferal: "",
    DepartmentID: "",
    DoctorName: "",
    TestName: "",
    SampleStatus: "3",
    DateTypeSearch: "Date",
    IsUrgent: "",
    MachineID: "",
    IsTat: 0,
    Order: "DESC",
    Flag: "",
    moreFilter: 0,
    parameterId: [],
    valueCheck: "=",
    valueToSearch: "",
    valueRangeFrom: "",
    valueRangeTo: "",
  });
  const [reason, setReason] = useState({
    HoldShow: false,
    Hdata: "",
    type: "",
  });
  const [isPreviousResultAvailable, setIsPreviousResultAvailable] =
    useState(false);
  const [showOldReportModal, setShowOldReportModal] = useState({
    show: false,
    data: {},
  });
  const [showPH, setShowPH] = useState(false);
  const handleShowReject = () => {
    setShowReject({
      show: false,
      data: {},
    });
  };
  const handleCloseReject = () => {
    setResultData([]);
  };
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const decryptData = (encryptedData) => {
    const secretKey = "resultentry";
    const bytes = CryptoJS.AES.decrypt(
      decodeURIComponent(encryptedData),
      secretKey
    );
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };
  const [dynamicFilter, setDynamicFilter] = useState([]);
  const ResultEntryFilter = () => {
    setLoading(true);
    axiosInstance
      .post("Lab/getFilterTableReprintData", {
        PageName: "ResultEntryFilter",
        EmployeeId: EmployeeID?.toString(),
      })
      .then((res) => {
        let data = res?.data?.message;

        setDynamicFilter(data);
        setLoading(false);
      })
      .catch((err) => {
        setDynamicFilter([]);
        setLoading(false);
      });
  };
  useEffect(() => {
    ResultEntryFilter();
  }, []);
  const isVisible = (header) =>
    dynamicFilter.find((f) => f?.header === header)?.visible;

  const id = searchParams.get("id")
    ? decryptData(searchParams.get("id"))
    : null;
  // console.log(id);
  useEffect(() => {}, []);
  // console.log(ResultData, redata);
  const EmployeeID = useLocalStorage("userData", "get")?.EmployeeID;
  const OnAppGoToMainList = useLocalStorage(
    "userData",
    "get"
  )?.OnAppGoToMainList;
  console.log(OnAppGoToMainList);
  const getFilterResultOption = () => {
    axiosInstance
      .post("Lab/getFilterTableReprintData", {
        PageName: "ResultEntry",
        EmployeeId: EmployeeID?.toString(),
      })
      .then((res) => {
        let data = res?.data?.message;

        setColumnConfig(data);
      })
      .catch((err) => setColumnConfig([]));
  };

  const BindMachineName = () => {
    axiosInstance
      .get("MachineGroup/BindMachineName")
      .then((res) => {
        let data = res?.data?.message;

        let val = data?.map((ele) => {
          return {
            value: ele?.MachineId,
            label: ele?.MachineName,
          };
        });

        val.unshift({ label: "All Machine", value: 0 });
        setMachineId(val);
      })
      .catch((err) => {
        console.log(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occur"
        );
      });
  };
  const getMachine = () => {
    axiosInstance
      .get("Investigations/BindMachineList")
      .then((res) => {
        let data = res.data.message;
        let Machine = data.map((ele) => {
          return {
            value: ele.MachineId,
            label: ele.MachineName,
          };
        });
        setMachine(Machine);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getMachine();
    BindMachineName();
    getFilterResultOption();
  }, []);

  const handleIndexNew = (e, name) => {
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
            handleListSearchNew(doctorSuggestion[indexMatch], name);
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
            handleListSearchNew(TestSuggestion[indexMatch], name);
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

  useEffect(() => {
    if (formData?.TestName.length > 2) {
      DepartmentWiseItemList(
        formData.DepartmentID,
        formData?.TestName,
        setTestSuggestion
      );
    }
  }, [formData?.TestName]);

  const handleListSearchNew = (data, name) => {
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

        setSelects(false);
        setIndexMatch(0);
        setTestSuggestion([]);
        break;
      default:
        break;
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
      error = { ...error, ItemValue: t("Please Choose Value") };
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

  const myRefs = useRef([]);

  const handleKeyUp = (e, targetElem, index) => {
    if (e.key === "Enter" && targetElem) {
      targetElem.focus();
    }
  };

  const handleToggle = (name) => {
    setToggleDate({ ...toggleDate, [name]: !toggleDate[name] });
  };

  const dateSelect = (value, name) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearchSelectChange = (label, value) => {
    if (label === "CentreID") {
      setFormData({ ...formData, [label]: value?.value, RateTypeID: "" });
      if (value?.value == "") {
        fetchRateTypes(CentreData.map((ele) => ele.value));
      } else {
        fetchRateTypes([value?.value]);
      }
    } else {
      setFormData({ ...formData, [label]: value?.value });
    }
  };

  const handleSelectChange = (event) => {
    const { name, value, checked, type } = event?.target;
    if (name == "IsUrgent") {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  // console.log(ResultTestData)
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

  const handleSave = (data, modal) => {
    if (modal === "Edit") {
      if (Number(data?.MinValue) >= Number(data?.MaxValue)) {
        toast.error(t("Please Enter Correct Min and Max Value"));
      } else {
        let val = ResultData.map((ele) => {
          if (ele.labObservationID == data?.labObservationID) {
            return {
              ...ele,
              DisplayReading: data?.DisplayReading,
              MinValue: data?.MinValue,
              MaxValue: data?.MaxValue,
              ReadingFormat: data?.ReadingFormat,
              SaveRangeStatus: 1,
            };
          } else {
            return ele;
          }
        });
        setResultData(val);
        setShow({ moadal: false, data: {} });
      }
    }

    if (modal === "AddComment") {
      if (data?.pageName === "Single") {
        let val = ResultData.map((ele) => {
          if (ele.labObservationID == data?.labObservationID) {
            return {
              ...ele,
              COMMENT: data?.COMMENT,
              SaveRangeStatus: 1,
            };
          } else {
            return ele;
          }
        });
        setResultData(val);
        setShow2({ moadal: false, data: {} });
      } else {
        let val = ResultTestData.map((ele) => {
          if (ele.TestID == data?.TestID) {
            return {
              ...ele,
              COMMENT: data?.COMMENT,
              SaveRangeStatus: 1,
              labObservationID: -1,
            };
          } else {
            return ele;
          }
        });
        setResultTestData(val);
        setShow2({ moadal: false, data: {} });
      }
    }

    if (modal === "TemplateMaster") {
      // console.log(data);
      let val = ResultData.map((ele) => {
        if (ele.labObservationID == data?.labObservationID) {
          console.log(data);
          return {
            ...ele,
            COMMENT: data?.COMMENT,
            CommentID: data?.CommentID,
          };
        } else {
          return ele;
        }
      });
      setResultData(val);
      setShow3({ moadal: false, data: {} });
    }
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

  const TableData = (status) => {
    const rateTypes = RateTypes.map((item) => {
      return item?.value;
    });
    setLoading(true);
    axiosInstance
      .post(
        "RE/GetResultEntry",
        getTrimmedData({
          CentreID: AllDataDropDownPayload(
            formData.CentreID,
            CentreData,
            "value"
          ),
          SelectTypes: formData.SelectTypes,
          ItemValue: formData.ItemValue,
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
          DateTypeSearch: formData?.DateTypeSearch,
          IsUrgent: formData?.IsUrgent ? 1 : 0,
          MachineID:
            formData?.MachineID == "" ? "0" : formData?.MachineID?.toString(),
          IsTat: formData?.IsTat,
          Order: formData?.Order,
          Flag: formData?.Flag,
          moreFilter: formData?.moreFilter,
          parameterId: formData?.parameterId,
          valueCheck: formData?.valueCheck,
          valueToSearch: formData?.valueToSearch,
          valueRangeFrom: formData?.valueRangeFrom,
          valueRangeTo: formData?.valueRangeTo,
        })
      )
      .then((res) => {
        setSelectedRowIndex(-1);
        setTestCount(res?.data?.message?.length);
        const final = modifyArray(res?.data?.message);
        // console.log(final)
        const currentIndex = final?.map((ele, index) => {
          return {
            ...ele,
            index: index,
            currentIndex: index,
          };
        });
        SetReData(currentIndex);
        setStatusValue(status === "" ? status : parseInt(status));
        setLoad(true);
        setLoading(false);
        setShowAdvanceFilter({ show: false, data: "" });
      })
      .catch((err) => setLoading(false));
  };

  function createCheckbox(item) {
    // console.log(item);
    if (item.Status == 5 || item.Status == 6) {
      return `<input type=\"checkbox\" onchange={handleCheck}  value=\"${item.TestIdhash}\" id=\"${item.LedgerTransactionID}\" class=${item.LedgerTransactionID} />`;
    } else {
      return "";
    }
  }

  function modifyArray(dataArray) {
    let modifiedArray = [];
    let tempObject = {};

    dataArray.forEach((item) => {
      let key = `${item.LedgerTransactionID}-${item.DepartmentID}`;

      if (tempObject[key]) {
        tempObject[key].TestName +=
          `<p class="round Status-${item.Status}">${createCheckbox(item)}${item.TestName}</p>`;
        tempObject[key].TestID += `${item.TestID},`;
      } else {
        tempObject[key] = { ...item };
        tempObject[key].TestName =
          `<p class="round Status-${item.Status}">${createCheckbox(item)}${item.TestName}</p>`;
        tempObject[key].TestID = `${item.TestID},`;
      }
    });

    for (let key in tempObject) {
      tempObject[key].TestID = tempObject[key].TestID.slice(0, -1);
      modifiedArray.push(tempObject[key]);
    }

    return modifiedArray;
  }
  const setArrangeMentOfData = (data, subData) => {
    let mainData = [];
    subData.map((ele, index) => {
      data.map((eleInner, indexInner) => {
        if (ele?.TestID === eleInner?.TestID) {
          eleInner.Printwithhead = eleInner.Printwithhead
            ? eleInner.Printwithhead
            : 0;
          mainData = [...mainData, eleInner];
        }
      });
    });
    setResultData(mainData);
  };
  // console.log(ResultData, redata);
  const GetResultEntry = (payload, index, loading) => {
    loading && loading(true);
    // console.log(payload);
    setSelectedRowIndex(index);
    axiosInstance
      .post("RE/GetResultEntryData", {
        ...payload,

        MacID:
          payload?.MacID != ""
            ? payload?.MacID
            : (machine[0]?.value?.toString() ?? ""),
      })
      .then((res) => {
        const data = res?.data?.message?.message;
        if (data.length > 0) {
          let valueMap = data.reduce((acc, item) => {
            acc[item.labObservationID] = parseFloat(item.Value) || "0";
            return acc;
          }, {});

          data.forEach((item) => {
            if (item.Formula) {
              try {
                let formula = item.Formula;

                formula = formula.replace(
                  /(\d+)&/g,
                  (_, id) => valueMap[id] || ""
                );

                const resultItem = ResultData?.find(
                  (res) => res.labObservationID === item.labObservationID
                );

                if (resultItem) {
                  formula = formula.replace(
                    new RegExp("Age&", "g"),
                    Math.round(resultItem.TotalAgeInDays / 365)
                  );

                  formula = formula.replace(
                    new RegExp("Gender&", "g"),
                    resultItem.Gender
                  );
                }

                let calculatedValue = Math.round(eval(formula) * 100) / 100;

                if (!isNaN(calculatedValue)) {
                  item.Value = calculatedValue?.toString();
                  valueMap[item.labObservationID] = calculatedValue;
                }

                if (isNaN(calculatedValue) || calculatedValue == "Infinity") {
                  item.Value = "0";
                }

                if (item?.MinValue == null) item.MinValue = "0";
                if (item?.MaxValue == null) item.MaxValue = "0";

                if (
                  (parseFloat(item.MaxValue) !== 0 &&
                    parseFloat(item.MinValue) !== 0) ||
                  parseFloat(item.MaxValue) > 0 ||
                  parseFloat(item.MinValue) > 0 ||
                  parseFloat(item.MaxValue) < 0 ||
                  parseFloat(item.MinValue) < 0
                ) {
                  const val = parseFloat(item.Value);
                  const min = parseFloat(item.MinValue);
                  const max = parseFloat(item.MaxValue);

                  if (val > max) item.Flag = "High";
                  else if (val < min) item.Flag = "Low";
                  else item.Flag = "Normal";
                }

                if (item.Value === "") {
                  item.Flag = "";
                }
              } catch (error) {
                item.Value = "";
              }
            }
          });

          // console.log(payload);
          const val = data.map((ele) => {
            return {
              ...ele,
              isChecked: true,
              RerunIscheck: false,
              SaveRangeStatus: 0,
              currentIndex: index,
              Mobile: payload?.Mobile,
              MinValue: ele?.MinValue == null ? "0" : ele?.MinValue,
              MaxValue: ele?.MaxValue == null ? "0" : ele?.MaxValue,
              index: payload?.index,
              HelpMenuBold: Number(ele?.HelpMenuBold),
              PEmail: payload?.PEmail,
              MachineId: payload?.MacID ?? "",
              MacID: payload?.MacID ?? "",
              COMMENT: ele?.COMMENT ? ele?.COMMENT : "",
              ApprovedBy: payload?.ApprovedBy ?? "0",
              LedgertransactionIDHash: payload?.LedgertransactionIDHash,
              TotalAgeInDays: ele?.TotalAgeInDays,
              VisitNo: payload?.VisitNo,
              isOutSource: payload?.isOutSource,
            };
          });
          const dataTestHeader = res?.data?.message?.testHeader;
          let isPreviousResult = false;
          const valTestHeader = dataTestHeader?.map((ele) => {
            if (ele?.OldValueDate && ele?.OldValueDate !== "") {
              isPreviousResult = true;
            }
            return {
              ...ele,
              isChecked: true,
              isDocumentUpload: 0,

              currentIndex: index,
              TestCenterId: val[0]?.TestCentreID,
              Mobile: payload?.Mobile,
              LedgertransactionIDHash: payload?.LedgertransactionIDHash,
              isOutSource: payload?.isOutSource,
              PEmail: payload?.PEmail,
              index: payload?.index,
              MachineId: payload?.MacID ?? "",
              MacID: payload?.MacID ?? "",
              labObservationID: ele?.InvestigationID,
              Printwithhead: ele?.Printwithhead ? ele?.Printwithhead : 0,
              ApprovedBy: payload?.ApprovedBy ?? "0",
              VisitNo: payload?.VisitNo,
              ShowDLC: ele?.IsDLCCheck,
              // ApprovedBy:""
            };
          });
          setIsPreviousResultAvailable(isPreviousResult);
          setArrangeMentOfData(val, valTestHeader);
          setResultTestData(valTestHeader);
          loading && loading(false);
        } else {
          toast.error(t("No Data Found"));
          loading && loading(false);
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : t("No Record Found")
        );
        loading && loading(false);
      });
  };

  const handleDoctorName = (e) => {
    const { name, value } = e.target;
    const data = ResultTestData?.map((ele) => {
      return {
        ...ele,
        [name]: value,
      };
    });

    setResultTestData(data);
  };
  //Hdata?.Hold_Reason
  // console.log(ResultData);
  const ApplyFormula = (testid) => {
    if (ResultData.length) {
      for (let i = 0; i < ResultData.length; i++) {
        var Formula = "";
        Formula = ResultData[i].Formula;
        if (Formula != "" && ResultData[i].TestID === testid) {
          for (var j = 0; j < ResultData.length; j++) {
            try {
              var aa = Number(ResultData[j].Value);
              if (aa == "") {
                aa = "0";
              }
              if (ResultData[i].ReportType == "1") {
                Formula = Formula.replace(
                  new RegExp(ResultData[j].labObservationID + "&", "g"),
                  aa
                );
                Formula = Formula.replace(
                  new RegExp("Age&", "g"),
                  Math.round(ResultData[j].TotalAgeInDays / 365)
                );
                Formula = Formula.replace(
                  new RegExp("Gender&", "g"),
                  ResultData[j].Gender
                );
                console.log(Formula);
              }
            } catch (e) {}
          }
          try {
            console.log(Formula);
            var vv = Math.round(eval(Formula) * 100) / 100;
            if (vv == "0" || isNaN(vv)) {
              ResultData[i].Value = "0";
            } else {
              ResultData[i].Value = vv.toString();
            }
          } catch (e) {
            ResultData[i].Value = "";
          }
          var ans = ResultData[i].Value;
          if (
            (parseFloat(ResultData[i]["MaxValue"]) != 0 &&
              parseFloat(ResultData[i]["MinValue"]) != 0) ||
            parseFloat(ResultData[i]["MaxValue"]) > 0 ||
            parseFloat(ResultData[i]["MinValue"]) > 0 ||
            parseFloat(ResultData[i]["MaxValue"]) < 0 ||
            parseFloat(ResultData[i]["MinValue"] < 0)
          ) {
            if (
              parseFloat(ResultData[i].Value) >
              parseFloat(ResultData[i]["MaxValue"])
            ) {
              ResultData[i]["Flag"] = "High";
            }
            if (
              parseFloat(ResultData[i].Value) <
              parseFloat(ResultData[i]["MinValue"])
            ) {
              ResultData[i]["Flag"] = "Low";
            }

            if (
              parseFloat(ResultData[i].Value) >=
                parseFloat(ResultData[i]["MinValue"]) &&
              parseFloat(ResultData[i].Value) <=
                parseFloat(ResultData[i]["MaxValue"])
            ) {
              ResultData[i]["Flag"] = "Normal";
            }
          }
          if (ResultData[i].Value === "") {
            ResultData[i]["Flag"] = "";
          }

          if (isNaN(ans) || ans == "Infinity") {
            ResultData[i].Value = "";
          }
        }
      }
    }
  };

  function isValidDecimal(value) {
    if (
      (value.match(/</g) || []).length + (value.match(/>/g) || []).length >
      1
    ) {
      return false;
    }
    const afterSign =
      value.includes("<") || value.includes(">")
        ? value.split(/[<>]/)[1]
        : value;

    const decimalRegex = /^\d*\.?\d*$/;
    return decimalRegex.test(afterSign);
  }

  const handleDLCValue = (e, index) => {
    const data = [...ResultData];
    const { value, name } = e.target;
    if (value === "") data[index][name] = "";
    else data[index][name] = onlyNumbers(value) ? value : data[index][name];

    setResultData(data);
  };
  
  const handleCheckbox = (e, index, testid) => {
    const data = [...ResultData];
    const dataTestHeader = [...ResultTestData];
    const { value, checked, type, name } = e.target;
    if (index >= 0) {
      if (name === "Value") {
        if (isValidDecimal(value, data[index]["RoundOff"])) {
          data[index][name] = value;
        } else {
          data[index][name] = value;
          data[index]["Flag"] = "Normal";
        }
      }

      if (type === "checkbox") {
        data[index][name] = checked;
      }
      if (name === "isOmit" || name === "IsCriticalCheck") {
        data[index][name] = checked ? 1 : 0;
      }
      if (name === "Value" && (type === "text" || type === "number")) {
        let modifiedValue = value;
        if (value.includes("<")) {
          modifiedValue = parseFloat(value?.split("<")[1]) - 0.1;
        } else if (value.includes(">")) {
          modifiedValue = parseFloat(value?.split(">")[1]) + 0.1;
        } else {
          modifiedValue = value;
        }

        if (
          (parseFloat(data[index]["MaxValue"]) != 0 &&
            parseFloat(data[index]["MinValue"]) != 0) ||
          parseFloat(data[index]["MaxValue"]) > 0 ||
          parseFloat(data[index]["MinValue"]) > 0 ||
          parseFloat(data[index]["MaxValue"]) < 0 ||
          parseFloat(data[index]["MinValue"]) < 0
        ) {
          if (parseFloat(modifiedValue) > parseFloat(data[index]["MaxValue"])) {
            data[index]["Flag"] = "High";
          }
          if (parseFloat(modifiedValue) < parseFloat(data[index]["MinValue"])) {
            data[index]["Flag"] = "Low";
          }

          if (
            parseFloat(modifiedValue) >= parseFloat(data[index]["MinValue"]) &&
            parseFloat(modifiedValue) <= parseFloat(data[index]["MaxValue"])
          ) {
            data[index]["Flag"] = "Normal";
          }
        }

        if (value === "") {
          data[index]["Flag"] = "";
        }
      }

      setResultData(data);
    } else {
      const val = data.map((ele) => {
        if (testid === ele?.TestID) {
          return {
            ...ele,
            [name]: checked,
          };
        } else {
          return ele;
        }
      });

      const valTestHeader = dataTestHeader?.map((ele) => {
        if (testid === ele?.TestID) {
          return {
            ...ele,
            isChecked: checked,
          };
        } else {
          return ele;
        }
      });
      setResultTestData(valTestHeader);
      setResultData(val);
    }
    ApplyFormula(testid);
  };

  const getHelpMenuData = (e, labObservationId) => {
    if (e?.which !== 13) {
      setHiddenDropDownHelpMenu(true);
      axiosInstance
        .post("RE/getHelpMenuInvestigationWise", {
          InvestigationID: labObservationId,
        })
        .then((res) => {
          setHelpMenu(res.data?.message);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleIndex = (e, index) => {
    const { name } = e.target;
    switch (name) {
      case "Value":
        switch (e.which) {
          case 38:
            if (indexMatch !== 0) {
              setIndexMatch(indexMatch - 1);
            } else {
              setIndexMatch(helpmenu.length - 1);
            }
            break;
          case 40:
            if (helpmenu.length - 1 === indexMatch) {
              setIndexMatch(0);
            } else {
              setIndexMatch(indexMatch + 1);
            }
            break;
          case 13:
            if (HiddenDropDownHelpMenu) {
              handleListSearch(helpmenu[indexMatch], name, index);
              setIndexMatch(0);
            }
            break;
          default:
            break;
        }
        break;

      default:
        break;
    }
  };

  // console.log(HiddenDropDownHelpMenu, helpmenu);
  const handleListSearch = (data, name, index) => {
    // console.log(data);
    const val = [...ResultData];
    val[index][name] = data?.label;
    val[index].HelpMenuBold = Number(data?.HelpMenuBold);
    setResultData(val);
    setHelpMenu([]);
    setHiddenDropDownHelpMenu(false);
  };
  const onChangeDLC = (e, index) => {
    const { checked } = e.target;
    const datas = [...ResultTestData];
    datas[index]["IsDLCCheck"] = checked ? 1 : 0;
    setResultTestData(datas);
  };
  const fetchApi = (field, payload, headerData) => {
    // console.log(field, headerData);
    setLoading(true);
    const ModifiedHeaderData = headerData?.map((ele) => {
      return {
        ...ele,
        IsHold: ele?.IsHold ?? 0,
      };
    });
    const result = getUnFilledValue(ModifiedHeaderData, payload);
    const isOutSource = headerData[0]?.isOutSource == 1;
    const isSaveOrApproved =
      field === "Save" ||
      field === "Approved" ||
      field === "Dual Authentication";

    const result1 = isOutSource
      ? ModifiedHeaderData
      : isSaveOrApproved
        ? result?.newArr1
        : ModifiedHeaderData;
    const result2 = isOutSource
      ? payload
      : isSaveOrApproved
        ? result?.newArr2
        : payload;
    if (result1?.length > 0) {
      if (field == "Approved") {
        const details = {
          data: result2.map((ele) => {
            return {
              ...ele,
              CommentID: ele?.CommentID?.toString(),
              HelpMenuBold: ele?.HelpMenuBold ?? 0,
            };
          }),
          ResultStatus: field,
          IsCritical: 0,
          HeaderInfo: result1.map((ele) => {
            return {
              ...ele,
              ApprovedBy:
                doctorAdmin?.length == 1
                  ? doctorAdmin[0]?.value?.toString()
                  : ele?.ApprovedBy,
            };
          }),
        };
        setmodalPayload({ ...details, IsCritical: 1 });
        axiosInstance
          .post("RE/SaveResultEntry", {
            data: result2.map((ele) => ({
              ...ele,
              CommentID: ele?.CommentID?.toString(),
              HelpMenuBold: ele?.HelpMenuBold ?? 0,
            })),
            ResultStatus: field,
            IsCritical: 0,
            HeaderInfo: result1.map((ele) => ({
              ...ele,
              ApprovedBy:
                doctorAdmin?.length === 1
                  ? doctorAdmin[0]?.value?.toString()
                  : ele?.ApprovedBy,
            })),
          })

          .then((res) => {
            if (res?.data?.message?.startsWith("Dlc Count for Test")) {
              toast.error(res.data?.message);
            } else {
              if (handleSplitData(res?.data?.message, "&")[0] == "1") {
                setshowApprove({
                  ...approve,
                  show: true,
                  msg: handleSplitData(res?.data?.message, "&")[1],
                });
              } else {
                const testidhash = ResultTestData.map((obj) => obj.TestID);
                if (OnAppGoToMainList == 0) {
                  GetResultEntry(
                    {
                      TestID: testidhash.join(","),
                      LedgerTransactionID: "",
                      DepartmentID: "",
                      symbol: "",
                      Mobile: ResultData[0]?.Mobile,
                      VisitNo: ResultData[0]?.VisitNo,
                      PEmail: ResultData[0]?.PEmail,
                      MacID: ResultData[0]?.MacID,
                      LedgertransactionIDHash:
                        ResultData[0]?.LedgertransactionIDHash,
                      isOutSource: ResultData[0]?.isOutSource,
                      index: ResultData[0]?.index,
                      ApprovedBy: ResultData[0]?.ApprovedBy,
                    },
                    ResultData[0]?.index,
                    setLoading
                  );
                } else {
                  setResultTestData([]);
                  setResultData([]);
                }

                // handleReport("Yes", headerData);
                toast.success(res?.data?.message);
                // setDlcCheckChecked(true);
              }
            }
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);

            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Error Occured"
            );
            // setResultData([]);
          });
      } else {
        // console.log(headerData);

        axiosInstance
          .post("RE/SaveResultEntry", {
            data: result2.map((ele) => ({
              ...ele,
              CommentID: ele?.CommentID?.toString(),
              HelpMenuBold: ele?.HelpMenuBold ?? 0,
            })),
            ResultStatus: field,
            HeaderInfo: result1,
          })
          .then((res) => {
            setLoading(false);
            toast.success(res.data.message);
            // setResultData([]);
            // console.log(payload);
            // setDlcCheckChecked(true);
            const testidhash = ResultTestData.map((obj) => obj.TestID);
            console.log(testidhash);
            // (field === "Hold" || field === "Unhold") &&
            GetResultEntry(
              {
                TestID: testidhash.join(","),
                LedgerTransactionID: "",
                DepartmentID: "",
                symbol: "",
                Mobile: ResultData[0]?.Mobile,
                VisitNo: ResultData[0]?.VisitNo,
                PEmail: ResultData[0]?.PEmail,
                MacID: ResultData[0]?.MacID,
                LedgertransactionIDHash: ResultData[0]?.LedgertransactionIDHash,
                isOutSource: ResultData[0]?.isOutSource,
                index: ResultData[0]?.index,
                ApprovedBy: ResultData[0]?.ApprovedBy,
              },
              ResultData[0]?.index,
              setLoading
            );
          })
          .catch((err) => {
            setLoading(false);
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Error Occured"
            );
            // setResultData([]);
          });
      }
    } else {
      setLoading(false);
      toast.error("Please Enter An Entry For Any UnApproved Test.");
    }
  };

  const getUnFilledValue = (arr1, arr2) => {
    const uniqueV = [...new Set(arr1.map((item) => item.InvestigationID))];
    const filteredV = uniqueV.filter((InvestigationID) => {
      const values = arr2
        .filter((item) => item.InvestigationID === InvestigationID)
        .map((item) => ({ Value: item.Value, Comment: item.COMMENT }));

      return values.some(
        ({ Value, Comment }) => Value !== "" || Comment !== ""
      );
    });

    const newArr1 = arr1.filter((item) =>
      filteredV.includes(item.InvestigationID)
    );

    const newArr2 = arr2.filter((item) =>
      filteredV.includes(item.InvestigationID)
    );

    return { newArr1, newArr2 };
  };
  const handleSplitData = (id, symbol) => {
    const data = id?.split(symbol);
    return data;
  };

  // const handleStatusFilter = (status) => {
  //   const data = ResultTestData.filter(
  //     (ele) => ele?.Status === status && ele?.isChecked === true
  //   );
  //   return data;
  // };

  const checkDlc = (result1) => {
    const result = result1.some((item) => item.IsDLCCheck == 1) ? true : false;
    return result && DlcCheckChecked;
  };
  const validateData = (field, payload, message, headerData) => {
    if (payload?.length > 0) {
      if (
        [
          "Save",
          "Hold",
          "Unhold",
          "Not Approved",
          "Dual Authentication",
        ].includes(field)
      ) {
        fetchApi(field, payload, headerData);
      } else {
        let showMessage = t("All Required fields are mandatory");
        let flag = 1;
        let DlcSum = 0;
        let dlc = false;
        // console.log(headerData);
        for (var i = 0; i < payload.length > 0; i++) {
          // if (payload[i].dlcCheck == "1" && DlcCheckChecked) {
          //   dlc = true;
          //   DlcSum =
          //     parseFloat(DlcSum) +
          //     parseFloat(payload[i].Value === "" ? 0 : payload[i].Value);
          // }
          if (payload[i].ReportType === "1") {
            if (payload[i].isMandatory === 1 && payload[i].Value == "") {
              flag = 0;
            }
            if (payload[i].AMRMin > 0 || payload[i].AMRMax > 0) {
              if (
                payload[i].Value > payload[i].AMRMax ||
                payload[i].Value < payload[i].AMRMin
              ) {
                toast.error(
                  payload[i].TestName +
                    " value is greater or less than" +
                    payload[i].AMRMin +
                    " or " +
                    payload[i].AMRMax
                );
                return;
              }
            }
          }
          if (["2", "3"].includes(payload[i].ReportType)) {
            if (
              payload[i].isMandatory === 1 &&
              (payload[i].COMMENT == "" || payload[i].COMMENT == null)
            ) {
              flag = 0;
            }
          }
        }
        for (let i = 0; i < headerData.length; i++) {
          if (headerData[i]["ApprovedBy"] == "0") {
            flag = 0;
            showMessage = t("Kindly Select Doctor");
            break;
          }
        }
        for (let i = 0; i < headerData.length; i++) {
          if (
            headerData[i]["DualAuthentication"] == 1 &&
            headerData[i]["DualAuthenticatedcount"] != 2
          ) {
            flag = 0;
            showMessage = `Can't Be Approved. For ${headerData[i]?.PackageName} Dual Authentication Is Required`;
            break;
          }
        }

        if (flag == 1) {
          fetchApi(field, payload, headerData);
        } else {
          toast.error(showMessage);
        }
      }
    } else {
      toast.error(message);
    }
  };
  // console.log(ResultTestData);
  const handleKeyDown = (e) => {
    if (e?.key === "Enter") {
      TableData("");
    }
  };
  const handleResultSubmit = (field, headData) => {
    const errorToast = `This Test is ${DyanmicStatusResponse(ResultTestData)}`;
    if (field === "Approved") {
      const data = ResultData.filter(
        (ele) =>
          [3, 10, 14, 13, 20].includes(ele?.Status) && ele?.isChecked === true
      );
      const val = ResultTestData.filter(
        (ele) =>
          [3, 10, 14, 13, 20].includes(ele?.Status) && ele?.isChecked === true
      );
      validateData(field, data, errorToast, val);
    } else if (field === "Save") {
      const data = ResultData.filter(
        (ele) =>
          [3, 10, 14, 13, 20].includes(ele?.Status) && ele?.isChecked === true
      );
      const val = ResultTestData.filter(
        (ele) =>
          [3, 10, 14, 13, 20].includes(ele?.Status) && ele?.isChecked === true
      );
      validateData(field, data, errorToast, val);
    } else if (field === "Dual Authentication") {
      const data = ResultData.filter(
        (ele) =>
          [3, 10, 14, 13, 20].includes(ele?.Status) && ele?.isChecked === true
      );
      const val = ResultTestData.filter(
        (ele) =>
          [3, 10, 14, 13, 20].includes(ele?.Status) && ele?.isChecked === true
      );
      validateData(field, data, errorToast, val);
    } else if (field === "Not Approved") {
      const data = ResultData.filter((ele) => ele.TestID === headData.TestID);
      const val = ResultTestData.filter(
        (ele) => ele?.TestID === headData.TestID
      );
      validateData(field, data, "This test is Not Approved", val);
    } else if (field === "Hold") {
      const payload = ResultData.filter(
        (ele) => ele.Status !== 5 && ele.isChecked === true
      );
      const val = ResultTestData.filter(
        (ele) => ele.Status !== 5 && ele.isChecked === true
      );
      validateData(field, payload, errorToast, val);
    } else if (field === "Unhold") {
      const data = ResultData.filter((ele) => ele.TestID === headData.TestID);
      const val = ResultTestData.filter(
        (ele) => ele?.TestID === headData.TestID
      );
      const UnholdData = val?.map((ele) => {
        return {
          ...ele,
          IsHold: 0,
        };
      });

      validateData(field, data, t("This Test is not Hold"), UnholdData);
    } else {
      const payload = ResultData.filter((ele) => ele.isChecked === true);
      validateData(field, payload);
      // } else {
      //   if (field === "Not Approved") {
      //     const payload = ResultData.filter((ele) => ele.isChecked === true);
      //     fetchApi(field, payload);
      //   } else {
      //     toast.error(
      //       `This already approved ${ResultTestData[statusMatchIndex]["PackageName"]}, Please Uncheck to continue or unhold to continue`
      //     );
      //   }
      // }
    }
  };
  // console.log(helpmenu);
  const DeltaResponse = (data) => {
    axiosInstance
      .post("RE/DeltaCheck", {
        TestID: data?.TestID,
        LabObservation_ID: data?.labObservationID,
      })
      .then((res) => {
        const data = res.data.message;
        if (data.length > 0) {
          setPreviousTestResult(data);
        } else {
          setPreviousTestResult([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const TestHeaderResponce = (data) => {
    axiosInstance
      .post("RE/TestWiseDeltaValue", {
        TestID: data?.TestID,
        LabObservation_ID: data?.labObservationID,
      })
      .then((res) => {
        const data = res.data.message;
        if (data.length > 0) {
          setHeaderTestResult(data);
        } else {
          setHeaderTestResult([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getUniqueTest = () => {
    const data = ResultTestData[0]?.AllTestDetails?.split("#");
    const finalDatas = [...new Set(data)];
    const finalData = finalDatas?.map((ele) => {
      return {
        TestID: Number(ele?.split("$")[0]),
        TestName: ele?.split("$")[1],
        labObservationID: Number(ele?.split("$")[2]),
        Status: ele?.split("$")[3],
      };
    });
    return finalData ?? [];
  };
  const AuditTrailResponce = async (data) => {
    await axiosInstance
      .post("RE/TestWiseDeltaValue", {
        TestID: data?.TestID,
        LabObservation_ID: data?.labObservationID,
      })
      .then((res) => {
        const resData = res.data.message;
        if (resData.length > 0) {
          setShowAuditTrail({
            show: true,
            data: resData,
            testname: data?.PackageName,
          });
        } else {
          setShowAuditTrail({ show: false, data: "", testname: "" });
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setShowAuditTrail({ show: false, data: "", testname: "" });
      });
  };

  const handleAuditTrailModal = () => {
    setShowAuditTrail({ show: false, data: "", testname: "" });
  };

  const handleApproveReport = (Url, headerData) => {
    axiosInstance
      .post("RE/SendReport", {
        LedgerTransactionNo: headerData[0]?.LedgerTransactionNo,
        PatientName: headerData[0]?.PatientName,
        MobileNo: headerData[0]?.Mobile,
        LedgerTransactionID: headerData[0]?.LedgerTransactionID,
        PEmail: headerData[0]?.PEmail,
        URL: Url,
        LedgertransactionIDHash: headerData[0]?.LedgertransactionIDHash,
      })
      .then((res) => console.log(res?.data?.message))
      .catch((err) => {
        // toast.error(
        //   err?.response?.data?.message
        //     ? err?.response?.data?.message
        //     : "Something Went Wrong"
        // );
      });
  };
  // console.log(ResultTestData);
  console.log(ResultData);
  const checkDualAuthentication =
    ResultTestData?.length > 0
      ? ResultTestData?.some((ele) => ele?.DualAuthentication == 1)
      : false;
  const handleReport = (key, headerData) => {
    const data = ResultTestData.filter((ele) => ele?.isChecked === true);
    let TestIDHash = data.map((ele) => {
      return ele?.TestIDHash;
    });

    // setPrintReportLoading(true);
    axiosReport
      .post(`commonReports/GetLabReport`, {
        TestIDHash: TestIDHash,
        PHead: 0,
        PrintColour: "0",
        IsDownload: CheckDevice(),
      })
      .then((res) => {
        if (res?.data?.success) {
          if (key == "Yes") {
            handleApproveReport(res?.data?.url, headerData);
            // setPrintReportLoading(false);
          } else {
            window.open(res?.data?.url, "_blank");
            // setPrintReportLoading(false);
          }
        } else {
          // setPrintReportLoading(false);
          key == "no" && toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
        // setPrintReportLoading(false);
      });
  };

  const getButtondata = () => {
    axiosInstance
      .get("RE/EmployeeAccessDetails")
      .then((res) => {
        setButtonsData(res.data.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : t("Something Went Wrong")
        );
      });
  };

  const handleInnerChecked = (e, newIndex, index) => {
    const { name, checked } = e.target;
    const val = [...redata];
    val[index]["TestDetail"][newIndex][name] = checked;
    SetReData(val);
  };
  const getGradientClass = () => {
    let condition = localStorage.getItem("Theme");
    switch (condition) {
      case "Default":
        return "gradient-lightblue";
      case "light Green":
        return "gradient-lightgreen";
      case "Peach":
        return "gradient-peach";
      case "Pale Pink":
        return "gradient-pink";
      case "Red":
        return "gradient-red";
      case "SkyBlue":
        return "gradient-skyblue";
      case "Grey":
        return "gradient-grey";
      default:
        return "";
    }
  };

  const handleTime = (time, name) => {
    setFormData({ ...formData, [name]: time });
  };
  const BindApprovalDoctor = () => {
    setLoading(true);
    axiosInstance
      .get("CommonController/BindApprovalDoctor")
      .then((res) => {
        // console.log(res)
        setLoading(false);

        let data = res.data.message;
        let doctorData = data.map((ele) => {
          return {
            value: ele?.employeeid,
            label: ele?.name,
          };
        });
        setDoctorAdmin(doctorData);
        if (id) {
          GetResultEntry(
            {
              TestID: id?.TestID,
              LedgerTransactionID: "",
              DepartmentID: "",
              symbol: "",
              Mobile: id?.Mobile,
              VisitNo: id?.VisitNo,
              PEmail: id?.PEmail,
              MacID: id?.MacID,
              LedgertransactionIDHash: id?.LedgertransactionIDHash,
              isOutSource: id?.isOutSource,
              index: id?.index,
              ApprovedBy: id?.ApprovedBy,
            },
            id?.index,
            setLoading
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleSelectChange1 = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    value != -1 && TableData(value);
  };
  // console.log(modalpayload);
  console.log(ResultTestData);
  const handleApifromModal = () => {
    setshowApprove({ ...approve, show: false });
    axiosInstance
      .post("RE/SaveResultEntry", modalpayload)
      .then((res) => {
        setLoading(false);
        handleReport("Yes", modalpayload?.HeaderInfo);
        const testidhash = ResultTestData.map((obj) => obj.TestID);
        // console.log(modalpayload);
        if (OnAppGoToMainList == 0) {
          GetResultEntry(
            {
              TestID: testidhash.join(","),
              LedgerTransactionID: "",
              DepartmentID: "",
              symbol: "",
              Mobile: ResultData[0]?.Mobile,
              VisitNo: ResultData[0]?.VisitNo,
              PEmail: ResultData[0]?.PEmail,
              MacID: ResultData[0]?.MacID,
              LedgertransactionIDHash: ResultData[0]?.LedgertransactionIDHash,
              isOutSource: ResultData[0]?.isOutSource,
              index: ResultData[0]?.index,
              ApprovedBy: ResultData[0]?.ApprovedBy,
            },
            ResultData[0]?.index,
            setLoading
          );
        } else {
          setResultTestData([]);
          setResultData([]);
        }
        toast.success(res?.data?.message);
        // setDlcCheckChecked(true);
      })
      .catch((err) => {
        if (err.response.status === 504) {
          toast.error(t("Something Went Wrong"));
        }
        toast.error(err.response.data.message);
        setLoading(false);
        // setResultData([]);
      });
  };

  useEffect(() => {
    getAccessCentres();
    getDepartment();
    BindApprovalDoctor();
    getPaymentModes("Identity", setIdentity);
    getButtondata();
  }, []);

  const handleDeltaCheckReport = (parameterData) => {
    const payloadData = parameterData.reduce(
      (acc, current) => {
        if (!acc.Patientcode) {
          acc.Patientcode = current?.PatientCode;
        }

        acc.testid.push(current.TestID);

        return acc;
      },
      {
        Patientcode: "",
        testid: [],
      }
    );
    // console.log(payloadData);
    axiosReport
      .post("commonReports/DeltaCheckData", {
        ...payloadData,
        Patientcode: payloadData?.Patientcode ?? "",
        testid: Array.isArray(payloadData?.testid)
          ? payloadData?.testid
          : [payloadData?.testid],
      })
      .then((res) => {
        window.open(res?.data?.url, "_blank");
      })
      .catch((err) => {
        console.log(err);
      });
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

  const handleShowRemark = () => {
    setShowRemark(false);
  };
  const handleShowPrickRemarks = () => {
    setShowPrickRemark(false);
  };

  const handleUploadCount = (name, value, secondName) => {
    let data = [...redata];
    if (name === "UploadDocumentCount") {
      data[show6?.index][name] = value;
      data[show6?.index][secondName] = value === 0 ? 0 : 1;
      SetReData(data);
    } else {
      data[show4?.index][name] = value;
      data[show4?.index][secondName] = value === 0 ? 0 : 1;
      SetReData(data);
    }
  };

  const handleNotApproveRemark = (e, data) => {
    const { name, value } = e.target;
    const TestHeader = [...ResultTestData];
    const index = ResultTestData.indexOf(data);
    TestHeader[index][name] = value;
    if (name == "HoldReason") TestHeader[index]["IsHold"] = 1;
    setResultTestData(TestHeader);
  };

  const printHeader = (isPrint, guid) => {
    console.log(isPrint, guid);
    let newResultTestData = [...ResultTestData].map((ele) => {
      return {
        ...ele,
        Printwithhead:
          ele?.TestIDHash === guid ? (isPrint ?? 0) : ele?.Printwithhead,
      };
    });
    setResultTestData(newResultTestData);
    let newResultData = [...ResultData].map((ele) => {
      return {
        ...ele,
        Printwithhead:
          ele?.TestIDHash === guid ? (isPrint ?? 0) : ele?.Printwithhead,
      };
    });
    setResultData(newResultData);
  };
  console.log(show5.data);
  const totalPatient = () => {
    const visitNos = redata.map((item) => item.VisitNo);
    const uniqueVisitNos = new Set(visitNos);
    return uniqueVisitNos.size;
  };

  const prop = () => {
    // const uniqueTestIDs = new Set();
    // redata.forEach((item) => {
    //   const testIDs = item.TestID.split(",").map((id) => id.trim());
    //   testIDs.forEach((id) => uniqueTestIDs.add(id));
    // });
    return redata.length ?? 0;
  };

  const closeAModal = () => {
    setshowApprove({ ...approve, show: false });
  };

  const theme = useLocalStorage("theme", "get");
  return (
    <>
      {approve?.show && (
        <Dialog
          header={""}
          onHide={closeAModal}
          visible={approve?.show}
          className={theme}
        >
          <div className="box-success">
            <div className="row">
              <label className="col-sm-12" htmlFor="PreBooking ID">
                <span>{approve?.msg}</span>
              </label>
            </div>
            <div className="row">
              <div className="col-sm-2">
                <button
                  type="button"
                  className="btn btn-sm btn-block btn-success"
                  onClick={handleApifromModal}
                >
                  Yes
                </button>
              </div>
              <div className="col-sm-2">
                <button
                  type="button"
                  className="btn btn-sm btn-block btn-danger"
                  onClick={() => {
                    setshowApprove({ ...approve, show: false });
                  }}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
      {showPH && (
        <PatientDetailModal
          showPH={showPH}
          setShowPH={(data) => {
            setShowPH(false);
          }}
          ResultData={ResultData}
        />
      )}
      {ResultData.length === 0 ? (
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

          {show6?.modal && (
            <UploadFile
              show={show6?.modal}
              handleClose={() => {
                setShow6({ modal: false, data: "", index: -1 });
              }}
              options={Identity}
              documentId={show6?.data}
              pageName="Patient Registration"
              handleUploadCount={handleUploadCount}
              formData={formData}
            />
          )}
          {showAdvanceFilter.show && (
            <RSadvanceFilter
              show={showAdvanceFilter.show}
              handleShow={() => {
                setShowAdvanceFilter({ show: false, data: "" });
                setFormData((data) => ({
                  ...data,
                  parameterId: [],
                  valueCheck: "=",
                  valueToSearch: "",
                  valueRangeFrom: "",
                  valueRangeTo: "",
                  moreFilter: 0,
                }));
              }}
              handleFilterChange={handleChange}
              data={formData}
              handleAdvSearch={() => {
                setFormData((data) => ({
                  ...data,
                  moreFilter: 1,
                }));
                TableData(
                  document.getElementById("SampleStatus")?.value ??
                    formData?.SampleStatus
                );
              }}
            />
          )}
          {/* <Heading isBreadcrumb={true} name="Result Entry" /> */}
          <Accordion
            name={t("Result Entry")}
            defaultValue={true}
            linkTo="/receiptreprint"
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
          >
            <Accordion
              defaultValue={true}
              title={
                <div className="d-flex">
                  <span className="mt-1"> {t("Result Entry Details")} </span>
                  <span className="header ml-1" style={{ cursor: "pointer" }}>
                    <ReceiptReprintFilter
                      columnConfig={dynamicFilter}
                      setColumnConfig={setDynamicFilter}
                      PageName="ResultEntryFilter"
                    />
                  </span>
                </div>
              }
            />{" "}
            {/* {areAllVisibleKeysTrue() && ( */}
            <>
              {" "}
              <div className="row  px-2 pt-2">
                {isVisible("SelectTypes") && (
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
                              <div className="error-message">
                                {errors?.ItemValue}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ width: "100%" }}>
                            <Input
                              type="text"
                              name="ItemValue"
                              onKeyDown={handleKeyDown}
                              max={20}
                              value={formData.ItemValue}
                              onChange={handleChange}
                            />
                            {errors?.ItemValue && (
                              <div className="error-message">
                                {errors?.ItemValue}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {isVisible("CentreID") && (
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
                    />
                  </div>
                )}
                {isVisible("RateTypeID") && (
                  <div className="col-sm-2 ">
                    <ReactSelect
                      dynamicOptions={[
                        { label: "All RateType", value: "" },
                        ...RateTypes,
                      ]}
                      name="RateTypeID"
                      lable={t("RateType")}
                      id="RateType"
                      removeIsClearable={true}
                      placeholderName={t("RateType")}
                      value={formData?.RateTypeID}
                      onChange={handleSearchSelectChange}
                    />
                  </div>
                )}
                {isVisible("DepartmentID") && (
                  <div className="col-sm-2  ">
                    <ReactSelect
                      dynamicOptions={AddBlankData(
                        DepartmentData,
                        "All Department"
                      )}
                      name="DepartmentID"
                      lable={t("Department")}
                      id="Department"
                      removeIsClearable={true}
                      placeholderName={t("Department")}
                      value={formData?.DepartmentID}
                      onChange={handleSearchSelectChange}
                    />
                  </div>
                )}
                {isVisible("DoctorName") && (
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
                    />
                    {dropFalse && doctorSuggestion.length > 0 && (
                      <ul className="suggestion-data">
                        {doctorSuggestion.map((data, index) => (
                          <li
                            onClick={() =>
                              handleListSearchNew(data, "DoctorName")
                            }
                            className={`${index === indexMatch && "matchIndex"}`}
                            key={index}
                          >
                            {data?.Name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
                {isVisible("TestName") && (
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
                    />
                    {TestSuggestion.length > 0 && (
                      <AutoComplete
                        selects={selects}
                        test={TestSuggestion}
                        handleListSearch={handleListSearchNew}
                        indexMatch={indexMatch}
                      />
                    )}
                  </div>
                )}

                {isVisible("DateTypeSearch") && (
                  <div className="col-sm-2">
                    <SelectBox
                      lable="DateTypeSearch"
                      options={DateTypeSearch2}
                      selectedValue={formData?.DateTypeSearch}
                      name="DateTypeSearch"
                      onChange={handleSelectChange}
                    />
                  </div>
                )}
                {isVisible("FromDate") && (
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
                    />
                  </div>
                )}
                {isVisible("FromTime") && (
                  <div className="col-sm-1">
                    <CustomTimePicker
                      name="FromTime"
                      placeholder="FromTime"
                      value={formData?.FromTime}
                      id="FromTime"
                      lable="FromTime"
                      onChange={handleTime}
                    />
                  </div>
                )}
                {isVisible("ToDate") && (
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
                    />
                  </div>
                )}
                {isVisible("ToTime") && (
                  <div className="col-sm-1">
                    <CustomTimePicker
                      name="ToTime"
                      placeholder="ToTime"
                      value={formData?.ToTime}
                      id="ToTime"
                      lable="ToTime"
                      onChange={handleTime}
                    />
                  </div>
                )}
                {isVisible("SampleStatus") && (
                  <div className="col-sm-2">
                    <SelectBox
                      options={[...SampleStatus]}
                      onChange={handleSelectChange1}
                      name="SampleStatus"
                      lable="SampleStatus"
                      id="SampleStatus"
                      selectedValue={formData.SampleStatus}
                    />
                  </div>
                )}
                {isVisible("MachineID") && (
                  <div className="col-sm-2   ">
                    <ReactSelect
                      dynamicOptions={machineId ?? []}
                      name="MachineID"
                      lable={t("MachineID")}
                      id="MachineID"
                      removeIsClearable={true}
                      placeholderName={t("MachineID")}
                      value={formData?.MachineID}
                      onChange={handleSearchSelectChange}
                      className="input-sm"
                    />
                  </div>
                )}
                {isVisible("IsTat") && (
                  <div className="col-sm-2   ">
                    <SelectBox
                      options={[
                        { label: "TAT Report - All", value: 0 },
                        { label: "In TAT", value: 1 },
                        { label: "Out TAT", value: 2 },
                      ]}
                      selectedValue={formData?.IsTat}
                      lable="IsTat"
                      id="IsTat"
                      name="IsTat"
                      onChange={handleSelectChange}
                    />
                  </div>
                )}
                {isVisible("Flag") && (
                  <div className="col-sm-2">
                    <SelectBox
                      options={[{ label: "Select Flag", value: "" }, ...Flag]}
                      name="Flag"
                      lable="Flag"
                      id="Flag"
                      onChange={handleSelectChange}
                      selectedValue={formData?.Flag}
                    />
                  </div>
                )}
                {isVisible("Order") && (
                  <div className="col-sm-1">
                    <SelectBox
                      options={[{ label: "Select Order", value: "" }, ...Order]}
                      name="Order"
                      lable="Order"
                      id="Order"
                      onChange={handleSelectChange}
                      selectedValue={formData?.Order}
                    />
                  </div>
                )}
                {isVisible("IsUrgent") && (
                  <div className="col-sm-1 ">
                    <input
                      id="IsUrgent"
                      type="checkbox"
                      // className="mt-2"
                      name="IsUrgent"
                      checked={formData?.IsUrgent}
                      onChange={handleSelectChange}
                    />
                    <label htmlFor="IsUrgent">
                      &nbsp;&nbsp; {t("IsUrgent")}
                    </label>
                  </div>
                )}
                {/* {isVisible("SearchButton") && ( */}
                <div className="col-sm-1 p-1">
                  <button
                    name="SearchButton"
                    onClick={() =>
                      TableData(
                        document.getElementById("SampleStatus")?.value ??
                          formData?.SampleStatus
                      )
                    }
                    className="btn btn-primary btn-sm w-100"
                  >
                    {t("Search")}
                  </button>
                </div>
                {/* )} */}
                {isVisible("MoreFilterButton") && (
                  <div className="col-sm-1 d-flex align-items-center">
                    <button
                      name="MoreFilterButton"
                      onClick={() => {
                        setShowAdvanceFilter({ show: true, data: formData });
                      }}
                      className="btn btn-success btn-sm w-100"
                    >
                      {t("MoreFilter")}
                    </button>
                  </div>
                )}
              </div>
            </>
          </Accordion>
          <Accordion
            title={
              <>
                {redata?.length === 0 ? (
                  t("Search Result")
                ) : (
                  <div className="d-flex">
                    <span className="mt-1">
                      {t("Click Icon To Filter Results")}
                    </span>
                    <span className="header ml-1" style={{ cursor: "pointer" }}>
                      <ReceiptReprintFilter
                        columnConfig={columnConfig}
                        setColumnConfig={setColumnConfig}
                        PageName="ResultEntry"
                      />
                    </span>
                  </div>
                )}
              </>
            }
            notOpen={true}
            defaultValue={true}
          >
            {loading ? (
              <Loading />
            ) : load ? (
              <div className="">
                <>
                  <RETable
                    TableData={TableData}
                    Status={formData?.SampleStatus}
                    redata={redata}
                    GetResultEntry={GetResultEntry}
                    show={setShow4}
                    show2={setShow6}
                    handleInnerChecked={handleInnerChecked}
                    columnConfig={columnConfig}
                    selectedRowIndex={selectedRowIndex}
                    setSelectedRowIndex={setSelectedRowIndex}
                    doctorAdmin={doctorAdmin}
                    machine={machine}
                  />
                </>
              </div>
            ) : (
              <div className="">
                <NoRecordFound />
              </div>
            )}{" "}
          </Accordion>
        </>
      ) : (
        <>
          <>
            {showOldReportModal.show && (
              <OldReportModal
                show={showOldReportModal.show}
                value={showOldReportModal.data}
                handleClose={() => {
                  setShowOldReportModal({ show: false, data: "" });
                }}
              />
            )}
            {show.moadal && (
              <ResultEntryEditModal
                show={show}
                handleClose={() => {
                  setShow({ moadal: false, data: {} });
                }}
                handleSave={handleSave}
              />
            )}
            {show2.moadal && (
              <ResultEditAddModal
                show={show2}
                handleClose={() => {
                  setShow2({ moadal: false, data: {} });
                }}
                handleSave={handleSave}
              />
            )}
            {show3?.modal && (
              <TemplateMasterModal
                show={show3}
                handleClose={() => {
                  setShow3({ modal: false, data: {} });
                }}
                handleSave={handleSave}
              />
            )}
            {show7?.modal && (
              <RerunResultEntryModal
                show={show7?.modal}
                data={show7?.data}
                handleClose={() => {
                  setShow7({ modal: false, data: {} });
                }}
              />
            )}
            {reason?.HoldShow && (
              <Reason
                show={reason?.HoldShow}
                reason={reason}
                setReason={setReason}
                handleNotApproveRemark={handleNotApproveRemark}
                handleResultSubmit={handleResultSubmit}
              />
            )}
            {show5?.modal && (
              <UploadFile
                show={show5?.modal}
                handleClose={(data) => {
                  setShow5({
                    modal: false,
                    data: "",
                    pageName: "",
                    blockUpload: "",
                  });
                  printHeader(data, show5.data);
                }}
                documentId={show5.data}
                pageName={show5?.pageName}
                formData={formData}
                isPrintHeader={show5?.Printwithhead}
                blockUpload={show5.blockUpload}
                LedgerTransactionIDHash={
                  ResultTestData[0]?.LedgertransactionIDHash
                }
              />
            )}
            {showRemark && (
              <SampleRemark
                show={showRemark}
                handleShow={handleShowRemark}
                state={handleShowRemark}
                PageName={ResultTestData[0]?.Remarks}
                handleSave={handleShowRemark}
                title={"Remarks"}
              />
            )}{" "}
            {showPrickRemark && (
              <SampleRemark
                show={showPrickRemark}
                handleShow={handleShowPrickRemarks}
                state={handleShowPrickRemarks}
                PageName={ResultTestData[0]?.PricksRemarks}
                handleSave={handleShowRemark}
                title={"PricksRemarks"}
              />
            )}
            {showAuditTrail.show && (
              <AuditTrailMoadal
                show={showAuditTrail.show}
                data={showAuditTrail.data}
                testname={showAuditTrail?.testname}
                handleClose={handleAuditTrailModal}
              />
            )}
            {showReject?.show && (
              <RejectModal
                show={showReject?.show}
                handleShow={handleShowReject}
                data={showReject?.data}
                TableData={handleCloseReject}
              />
            )}
            <div
              className="p-dialog-header custom-box-body"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  padding: "0px",
                  borderRadius: "8px",
                }}
              >
                <div
                  style={{
                    flex: "1",
                    minWidth: "135px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i
                    className="fa fa-folder mr-1"
                    style={{ color: "white" }}
                  ></i>
                  <span>{ResultData[0]?.LedgerTransactionNo}</span>
                </div>
                <div
                  style={{
                    flex: "1",
                    minWidth: "165px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i className="fa fa-user mr-1" style={{ color: "white" }}></i>
                  <span>{ResultData[0]?.PName}</span>
                </div>
                <div
                  style={{
                    flex: "1",
                    minWidth: "135px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i className="fa fa-book mr-1" style={{ color: "white" }}></i>
                  <span>{ResultData[0]?.PatientCode}</span>
                </div>
                <div
                  style={{
                    flex: "1",
                    minWidth: "100px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i
                    className="fa fa-calendar mr-1"
                    style={{ color: "white" }}
                  ></i>
                  <span>{ResultData[0]?.Age}</span>
                </div>{" "}
                <div
                  style={{
                    flex: "1",
                    minWidth: "80px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i
                    className="fa fa-street-view mr-1"
                    style={{ color: "white" }}
                  ></i>
                  <span>{ResultData[0]?.Gender}</span>
                </div>
                <div
                  style={{
                    flex: "1",
                    minWidth: "175px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i
                    className="fa fa-h-square mr-1"
                    style={{ color: "white" }}
                  ></i>
                  <span>{ResultData[0]?.Centre}</span>
                </div>
                <div
                  style={{
                    flex: "1",
                    minWidth: "125px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i
                    className="fa fa-user-md mr-1"
                    style={{ color: "white" }}
                  ></i>
                  <span>{ResultData[0]?.ReferDoctor}</span>
                </div>
                <div
                  style={{
                    flex: "1",
                    minWidth: "175px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i
                    className="fa fa-plus-square mr-1"
                    style={{ color: "white" }}
                  ></i>
                  <span>{ResultData[0]?.RateType}</span>
                </div>
                <div
                  style={{
                    flex: "1",
                    minWidth: "135px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <i
                    className="fa fa-calendar mr-1"
                    style={{ color: "white" }}
                  ></i>
                  <span>{dateConfig(ResultData[0]?.RegDate)}</span>
                </div>
              </div>

              <div className="custom-row">
                {getUniqueTest()?.map((data, index) => (
                  <div
                    key={index}
                    style={{
                      cursor: "pointer",
                      padding: "2px 5px",
                      background: "#f5f5f5",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                    className={` round font-weight-bold mx-2 mt-1 w-auto Status-${data.Status}`}
                    onMouseEnter={() => {
                      setTestHeaderHover({
                        index: index,
                        data: [],
                      });
                      TestHeaderResponce(data);
                    }}
                    onMouseLeave={() => {
                      setTestHeaderHover({
                        index: -1,
                        data: [],
                      });
                      setHeaderTestResult([]);
                    }}
                  >
                    {data?.TestName}
                    {testHeaderHover?.index === index &&
                      headerTestResult.length > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            width: "auto",
                            left: "60px",
                            zIndex: 9999999,
                            height: "auto",
                            overflow: "visible",
                          }}
                          className="resultEntryCssTable"
                        >
                          <table>
                            <thead className="cf">
                              <tr>
                                <th>{t("Test")}</th>
                                <th>{t("Value")}</th>
                                <th>{t("Unit")}</th>
                                <th>{t("Min")}</th>
                                <th>{t("Max")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {headerTestResult.map((ele, index) => (
                                <tr
                                  key={index}
                                  style={{
                                    background:
                                      ele?.Flag === "High"
                                        ? "red"
                                        : ele?.Flag === "Low"
                                          ? "yellow"
                                          : "skyblue",
                                  }}
                                >
                                  <td data-title="LabObservationName">
                                    {ele?.LabObservationName
                                      ? ele?.LabObservationName
                                      : "-"}
                                  </td>
                                  <td data-title="Value">
                                    {ele?.Value ? ele?.Value : "-"}
                                  </td>
                                  <td data-title="ReadingFormat">
                                    {ele?.ReadingFormat
                                      ? ele?.ReadingFormat
                                      : "-"}
                                  </td>
                                  <td data-title="MinValue">
                                    {ele?.MinValue ? ele?.MinValue : "-"}
                                  </td>
                                  <td data-title="MaxValue">
                                    {ele?.MaxValue ? ele?.MaxValue : "-"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                  </div>
                ))}
                <></>
              </div>
            </div>{" "}
          </>
          <div className="card">
            <div className="p-1">
              <ResultEntryTableCustom>
                <thead class="cf">
                  <tr>
                    <th style={{ width: "20px" }}>{t("#")}</th>
                    <th style={{ width: "200px" }}>{t("Test Name")}</th>
                    {isPreviousResultAvailable && (
                      <th style={{ width: "60px" }}>{t("Pre. Value")}</th>
                    )}
                    <th style={{ width: "160px" }}>{t("Value")}</th>
                    <th style={{ width: "60px" }}>{t("Comment")}</th>
                    <th style={{ width: "70px" }}>
                      <Tooltip label={"Flag"}>
                        <div className="m-0 p-0">
                          <i className="ml-1 fa fa-flag p-0 m-0"></i>
                        </div>
                      </Tooltip>
                    </th>
                    <th style={{ width: "25px" }}>
                      <Tooltip label={"Omit"}>
                        <div className="m-0 p-0">
                          <i className="ml-1 fa fa-eraser p-0 m-0"></i>
                        </div>
                      </Tooltip>
                    </th>
                    <th style={{ width: "20px" }}>
                      {" "}
                      <Tooltip label={"Critical"}>
                        <div className="m-0 p-0">
                          <i className=" fa fa-exclamation-triangle p-0 m-0"></i>
                        </div>
                      </Tooltip>
                    </th>
                    <th>{t("Mac Reading")}</th>
                    <th>{t("Machine Name")}</th>
                    <th>{t("Reading 1")}</th>
                    <th>{t("Reading 2")}</th>
                    <th>{t("Method Name")}</th>
                    <th style={{ width: "150px" }}>{t("Reference Range")}</th>
                    <th style={{ width: "52px" }}>{t("Unit")}</th>
                    {/* <th>{t("Action")}</th> */}
                    {/* <th>{t("Rerun")}</th> */}
                    {/* <th>{t("AuditTrail")}</th> */}
                  </tr>
                </thead>
                <tbody>
                  {ResultTestData?.map((Hdata, Hindex) => (
                    <>
                      <tr key={Hindex} style={{ backgroundColor: "lightgrey" }}>
                        <td data-title={t("#")} style={{ width: "15px" }}>
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              handleCheckbox(e, -1, Hdata.TestID)
                            }
                            checked={
                              ResultData?.length > 0
                                ? isChecked(
                                    "isChecked",
                                    ResultData,
                                    true,
                                    Hdata.TestID
                                  ).includes(false)
                                  ? false
                                  : true
                                : false
                            }
                            disabled={Hdata?.Status === 5 ? true : false}
                            name="isChecked"
                          />
                        </td>
                        <td
                          colSpan={`${isPreviousResultAvailable ? 1 : 4}`}
                          data-title={t("TestName")}
                          style={{
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          }}
                        >
                          <span
                            className="invName"
                            style={{ fontWeight: "bold" }}
                          >
                            {Hdata?.PackageName}
                          </span>
                        </td>
                        {isPreviousResultAvailable && (
                          <td colSpan={4} data-title={t("Previous Test Date")}>
                            <b>{Hdata.OldValueDate}</b>
                          </td>
                        )}
                        <td data-title={t("")} colSpan={2}></td>
                        <td data-title={t("SINNO")} colSpan={1}>
                          <span className="fa fa-barcode">&nbsp;</span>
                          <b>{Hdata?.SINNO}</b>
                        </td>
                        <td colSpan="6" data-title={t("Comment")}>
                          <div className="d-flex flex-wrap align-items-center">
                            {(Hdata?.Status === 3 ||
                              Hdata.Status === 10 ||
                              Hdata?.Status === 14) && (
                              <>
                                <div
                                  className="m-0 p-0"
                                  onClick={() => {
                                    setShow5({
                                      modal: true,
                                      data: Hdata?.TestIDHash,
                                      pageName: "Add Report",
                                      Printwithhead: Hdata?.Printwithhead,
                                      blockUpload:
                                        Hdata?.Status == 5 || Hdata?.Status == 6
                                          ? true
                                          : false,
                                    });
                                  }}
                                >
                                  <Tooltip label={"Add Report"}>
                                    {" "}
                                    <i
                                      className="bi bi-file-earmark-pdf m-0 text-icon-size ml-1 mr-1"
                                      style={{ color: "red" }}
                                      disabled={!Hdata?.isChecked}
                                    ></i>{" "}
                                  </Tooltip>
                                </div>
                                &nbsp;
                                <div
                                  className="m-0 p-0"
                                  onClick={() => {
                                    setShow5({
                                      modal: true,
                                      data: Hdata?.TestIDHash,
                                      pageName: "Add Attachment",
                                      blockUpload:
                                        Hdata?.Status == 5 || Hdata?.Status == 6
                                          ? true
                                          : false,
                                    });
                                  }}
                                >
                                  <Tooltip label={"Add Attachment"}>
                                    {" "}
                                    <i
                                      className="bi bi-file-earmark-image m-0 text-icon-size ml-1 mr-1"
                                      style={{ color: "#07b023" }}
                                      disabled={!Hdata?.isChecked}
                                    ></i>
                                  </Tooltip>
                                </div>
                                &nbsp;
                                {Hdata?.datatype === "Profile" && (
                                  <div
                                    className="m-0 p-0"
                                    onClick={() =>
                                      setShow2({
                                        moadal: true,
                                        data: { ...Hdata, pageName: "All" },
                                      })
                                    }
                                  >
                                    <Tooltip label={"Add Comment"}>
                                      <i
                                        className="bi bi-chat-dots m-0 text-icon-size ml-2"
                                        style={{ color: "blue" }}
                                        disabled={!Hdata?.isChecked}
                                      ></i>{" "}
                                    </Tooltip>
                                  </div>
                                )}
                                &nbsp;
                              </>
                            )}
                            {[5, 6].includes(Hdata?.Status) &&
                              buttonsData?.map(
                                (ele, index) =>
                                  ele?.AccessBy === "Not Approved" && (
                                    <>
                                      <div
                                        className="m-0 p-0"
                                        onClick={() => {
                                          setShow5({
                                            modal: true,
                                            data: Hdata?.TestIDHash,
                                            pageName: "Add Report",
                                            Printwithhead: Hdata?.Printwithhead,
                                            blockUpload:
                                              Hdata?.Status == 5 ||
                                              Hdata?.Status == 6
                                                ? true
                                                : false,
                                          });
                                        }}
                                      >
                                        <Tooltip
                                          label={
                                            Hdata?.Status == 5 ||
                                            Hdata?.Status == 6
                                              ? t("Show Report")
                                              : t("Add Report")
                                          }
                                        >
                                          <i
                                            className="bi bi-file-earmark-pdf m-0 text-icon-size"
                                            style={{ color: "red" }}
                                            disabled={!Hdata?.isChecked}
                                          ></i>{" "}
                                        </Tooltip>
                                      </div>
                                      &nbsp;
                                      <div
                                        className=" m-0 p-0"
                                        onClick={() => {
                                          setShow5({
                                            modal: true,
                                            data: Hdata?.TestIDHash,
                                            pageName: "Add Attachment",
                                            blockUpload:
                                              Hdata?.Status == 5 ||
                                              Hdata?.Status == 6
                                                ? true
                                                : false,
                                          });
                                        }}
                                      >
                                        {" "}
                                        <Tooltip
                                          label={
                                            Hdata?.Status == 5 ||
                                            Hdata?.Status == 6
                                              ? t("Show Attachment")
                                              : t("Add Attachment")
                                          }
                                        >
                                          <i
                                            className="bi bi-file-earmark-image m-0 text-icon-size"
                                            style={{ color: "#07b023" }}
                                            disabled={!Hdata?.isChecked}
                                          ></i>{" "}
                                        </Tooltip>
                                      </div>
                                      &nbsp; &nbsp;
                                      {loading ? (
                                        <Loading />
                                      ) : (
                                        <div
                                          className=" m-0 p-0"
                                          onClick={() => {
                                            setReason({
                                              ...reason,
                                              HoldShow: true,
                                              Hdata: Hdata,
                                              type: "Not Approved",
                                            });
                                          }}
                                        >
                                          <Tooltip label={ele?.AccessBy}>
                                            {" "}
                                            <i
                                              className="bi bi-x-octagon text-icon-size m-0"
                                              style={{ color: "#b06605" }}
                                              type="button"
                                              disabled={!Hdata?.isChecked}
                                              id="btnMainList"
                                              key={index}
                                            ></i>
                                          </Tooltip>
                                        </div>
                                      )}
                                    </>
                                  )
                              )}
                            &nbsp;
                            {Hdata?.Status === 11 &&
                              buttonsData?.map(
                                (ele, index) =>
                                  ele?.AccessBy === "Unhold" && (
                                    <>
                                      {loading ? (
                                        <Loading />
                                      ) : (
                                        <div
                                          className="m-0 p-0"
                                          onClick={() =>
                                            handleResultSubmit(
                                              ele?.AccessBy,
                                              Hdata
                                            )
                                          }
                                        >
                                          <Tooltip
                                            label={`${ele?.AccessBy} ( Hold Reason : ${Hdata?.Hold_Reason} )`}
                                          >
                                            <i
                                              className="bi bi-play-circle m-0 text-icon-size ml-2"
                                              style={{
                                                color: "green",
                                              }}
                                              type="button"
                                              id="btnMainList"
                                              disabled={!Hdata?.isChecked}
                                              key={index}
                                            ></i>
                                          </Tooltip>
                                        </div>
                                      )}
                                    </>
                                  )
                              )}
                            {![11, 5, 6].includes(Hdata?.Status) &&
                              buttonsData?.map(
                                (ele, index) =>
                                  ele?.AccessBy === "Hold" && (
                                    <>
                                      {loading ? (
                                        <Loading />
                                      ) : (
                                        <div
                                          onClick={() => {
                                            setReason({
                                              ...reason,
                                              HoldShow: true,
                                              Hdata: Hdata,
                                              type: "Hold",
                                            });
                                          }}
                                        >
                                          <Tooltip label={ele?.AccessBy}>
                                            <i
                                              className="bi bi-stop-circle m-0 text-icon-size ml-2"
                                              style={{
                                                color: "#d9070e",
                                              }}
                                              type="button"
                                              id="btnMainList"
                                              key={index}
                                              disabled={!Hdata?.isChecked}
                                            ></i>
                                          </Tooltip>
                                        </div>
                                      )}
                                    </>
                                  )
                              )}
                            &nbsp;
                            {[3, 13, 14, 10, 20].includes(Hdata.Status) && (
                              <div
                                onClick={() =>
                                  setShow7({ modal: true, data: Hdata })
                                }
                              >
                                <Tooltip label={"Rerun"}>
                                  <i
                                    className="bi bi-arrow-repeat m-0 text-icon-size ml-1 mr-1"
                                    style={{ color: "#327570 " }}
                                    disabled={!Hdata?.isChecked}
                                  ></i>
                                </Tooltip>
                              </div>
                            )}
                            &nbsp;&nbsp;
                            <div
                              onClick={() => {
                                AuditTrailResponce(Hdata);
                              }}
                            >
                              <Tooltip label={"Audit Trail"}>
                                <i
                                  className="bi bi-table m-0 text-icon-size mr-2"
                                  style={{ color: "blue" }}
                                ></i>
                              </Tooltip>
                            </div>
                            &nbsp;&nbsp;
                            {[3, 13, 14, 10, 20].includes(Hdata.Status) && (
                              <div
                                onClick={() => {
                                  setShowReject({
                                    show: true,
                                    data: {
                                      TestID: Hdata?.TestID,
                                      LedgerTransactionID:
                                        Hdata?.LedgerTransactionID,
                                      VisitNo: Hdata?.LedgerTransactionNo,
                                      Test: Hdata?.PackageName,
                                      CentreID: ResultData[0]?.CentreID,
                                      SINNo: Hdata?.SINNO,
                                      PatientID: ResultData[0]?.PatientID,
                                    },
                                  });
                                }}
                              >
                                <Tooltip label={"Reject"}>
                                  <i
                                    className="bi bi-ban m-0 text-icon-size mr-2"
                                    style={{ color: "red" }}
                                  ></i>
                                </Tooltip>
                              </div>
                            )}
                            {Hdata?.ShowDLC == 1 && (
                              <>
                                <input
                                  type="checkbox"
                                  checked={Hdata?.IsDLCCheck}
                                  onChange={(e) => onChangeDLC(e, Hindex)}
                                />
                                <label style={{ alignSelf: "flex-end" }}>
                                  {t("DLC Check")}
                                </label>
                              </>
                            )}
                          </div>
                        </td>
                        {/* <td data-title={t("Flag")}>
                      {[3, 13, 14, 10].includes(Hdata.Status) && (
                        <button
                          className="btn btn-sm btn-warning"
                          disabled={!Hdata?.isChecked}
                          onClick={() => setShow7({ modal: true, data: Hdata })}
                        >
                          Rerun
                        </button>
                      )}
                    </td>
                    <td
                      data-title={t("Audit Trail")}
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      className="text-center text-primary"
                    >
                      <span
                        onClick={() => {
                          AuditTrailResponce(Hdata);
                        }}
                      >
                        View
                      </span>
                    </td> */}
                      </tr>
                      {ResultData?.map((datanew, index) => (
                        <>
                          {Hdata.TestID === datanew.TestID && (
                            <tr
                              key={index}
                              style={{
                                backgroundColor:
                                  datanew?.IsLabOutSource == "True"
                                    ? "pink"
                                    : "",
                              }}
                            >
                              <td data-title={t("#")} style={{ width: "15px" }}>
                                <input
                                  type="checkbox"
                                  checked={datanew?.isChecked}
                                  onChange={(e) => handleCheckbox(e, index)}
                                  name="isChecked"
                                  disabled={true}
                                />
                              </td>
                              <td
                                data-title={t("TestName")}
                                style={{
                                  whiteSpace: "normal",
                                  wordBreak: "break-word",
                                }}
                              >
                                <span
                                  style={{ cursor: "pointer" }}
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title={
                                    datanew?.isMandatory === 1
                                      ? "Required Field"
                                      : datanew?.dlcCheck === 1
                                        ? "DLC Parameter"
                                        : datanew?.Formula != ""
                                          ? "Calculated Field"
                                          : ""
                                  }
                                  className={`${
                                    datanew?.isMandatory === 1 &&
                                    "required-fields "
                                  } ${datanew?.dlcCheck === 1 && "bg-yellow-new "}`}
                                >
                                  <span
                                    className={`${
                                      datanew?.Formula != "" && "Formula"
                                    } `}
                                  >
                                    {datanew?.TestName}
                                  </span>
                                </span>
                              </td>
                              {isPreviousResultAvailable && (
                                <td
                                  data-title={t("Previous Value")}
                                  style={{
                                    wordWrap: "break-word",
                                    whiteSpace: "normal",
                                  }}
                                >
                                  {datanew.OldValue}
                                </td>
                              )}
                              {datanew?.Header === 0 ? (
                                <>
                                  {["2", "3"].includes(datanew?.ReportType) ? (
                                    <td
                                      style={{
                                        fontSize: "15px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        setShow3({
                                          modal: true,
                                          data: datanew,
                                        })
                                      }
                                      data-title={t("Action")}
                                    >
                                      <i
                                        className="fa fa-plus plusSign"
                                        aria-hidden="true"
                                      ></i>
                                    </td>
                                  ) : datanew?.dlcCheck === 1 ? (
                                    datanew?.IsHelpMenu === 0 ? (
                                      <td data-title={t("Value")}>
                                        <input
                                          type="number"
                                          className={`form-control input-sm resultInput ${
                                            (datanew?.MaxValue != "0" ||
                                              datanew?.MinValue != "0") &&
                                            parseFloat(datanew?.Value) >
                                              parseFloat(datanew?.MaxValue)
                                              ? "high"
                                              : parseFloat(datanew?.Value) <
                                                  parseFloat(datanew?.MinValue)
                                                ? "low"
                                                : ""
                                          } `}
                                          name="Value"
                                          autoComplete="off"
                                          disabled={
                                            datanew?.CanSaveAmendment
                                              ? false
                                              : datanew?.MacReading
                                                ? true
                                                : false
                                          }
                                          value={datanew?.Value}
                                          onChange={(e) =>
                                            handleCheckbox(
                                              e,
                                              index,
                                              datanew?.TestID
                                            )
                                          }
                                          onKeyUp={(e) =>
                                            handleKeyUp(
                                              e,

                                              myRefs.current[
                                                index === ResultData.length - 1
                                                  ? 0
                                                  : index + 1
                                              ],
                                              index
                                            )
                                          }
                                          ref={(el) =>
                                            (myRefs.current[index] = el)
                                          }
                                        />
                                      </td>
                                    ) : (
                                      <td data-title={t("Value")}>
                                        <input
                                          type="text"
                                          className={`form-control input-sm resultInput ${
                                            (datanew?.MaxValue != "0" ||
                                              datanew?.MinValue != "0") &&
                                            parseFloat(datanew?.Value) >
                                              parseFloat(datanew?.MaxValue)
                                              ? "high"
                                              : parseFloat(datanew?.Value) <
                                                  parseFloat(datanew?.MinValue)
                                                ? "low"
                                                : ""
                                          }`}
                                          name="Value"
                                          value={datanew?.Value}
                                          disabled={
                                            datanew?.CanSaveAmendment
                                              ? false
                                              : datanew?.MacReading
                                                ? true
                                                : false
                                          }
                                          onChange={(e) =>
                                            handleCheckbox(
                                              e,
                                              index,
                                              datanew?.TestID
                                            )
                                          }
                                          onKeyUp={(e) =>
                                            handleKeyUp(
                                              e,
                                              myRefs.current[
                                                index === ResultData.length - 1
                                                  ? 0
                                                  : index + 1
                                              ],
                                              index
                                            )
                                          }
                                          autoComplete="off"
                                          ref={(el) =>
                                            (myRefs.current[index] = el)
                                          }
                                        />
                                      </td>
                                    )
                                  ) : datanew?.IsHelpMenu === 0 ? (
                                    <td data-title={t("Value")}>
                                      <input
                                        type="text"
                                        className={`form-control input-sm resultInput ${
                                          (datanew?.MaxValue != "0" ||
                                            datanew?.MinValue != "0") &&
                                          parseFloat(datanew?.Value) >
                                            parseFloat(datanew?.MaxValue)
                                            ? "high"
                                            : parseFloat(datanew?.Value) <
                                                parseFloat(datanew?.MinValue)
                                              ? "low"
                                              : ""
                                        }`}
                                        name="Value"
                                        disabled={
                                          datanew?.CanSaveAmendment
                                            ? false
                                            : datanew?.MacReading
                                              ? true
                                              : false
                                        }
                                        value={datanew?.Value}
                                        onChange={(e) =>
                                          handleCheckbox(
                                            e,
                                            index,
                                            datanew?.TestID
                                          )
                                        }
                                        onKeyUp={(e) =>
                                          handleKeyUp(
                                            e,
                                            myRefs.current[
                                              index === ResultData.length - 1
                                                ? 0
                                                : index + 1
                                            ],
                                            index
                                          )
                                        }
                                        autoComplete="off"
                                        ref={(el) =>
                                          (myRefs.current[index] = el)
                                        }
                                      />
                                    </td>
                                  ) : (
                                    <td data-title={t("Value")}>
                                      <div style={{ position: "relative" }}>
                                        <input
                                          type="text"
                                          className={`form-control input-sm resultInput ${
                                            (datanew?.MaxValue != "0" ||
                                              datanew?.MinValue != "0") &&
                                            parseFloat(datanew?.Value) >
                                              parseFloat(datanew?.MaxValue)
                                              ? "high"
                                              : parseFloat(datanew?.Value) <
                                                  parseFloat(datanew?.MinValue)
                                                ? "low"
                                                : ""
                                          }`}
                                          name="Value"
                                          autoComplete="off"
                                          disabled={
                                            datanew?.CanSaveAmendment
                                              ? false
                                              : datanew?.MacReading
                                                ? true
                                                : false
                                          }
                                          value={datanew?.Value}
                                          onChange={(e) =>
                                            handleCheckbox(
                                              e,
                                              index,
                                              datanew?.TestID
                                            )
                                          }
                                          onKeyDown={(e) => {
                                            getHelpMenuData(
                                              e,
                                              datanew?.labObservationID
                                            );
                                            handleIndex(e, index);
                                          }}
                                          onKeyUp={(e) =>
                                            handleKeyUp(
                                              e,
                                              myRefs.current[
                                                index === ResultData.length - 1
                                                  ? 0
                                                  : index + 1
                                              ],
                                              index
                                            )
                                          }
                                          ref={(el) =>
                                            (myRefs.current[index] = el)
                                          }
                                          onBlur={() =>
                                            setTimeout(() => {
                                              setHiddenDropDownHelpMenu(false);
                                            }, [1000])
                                          }
                                          style={{
                                            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%23000" height="16" width="16" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke-width="2" stroke="black" fill="black"/></svg>')`,
                                            backgroundPosition:
                                              "calc(100% - 10px) center", // Adjust arrow position
                                            backgroundRepeat: "no-repeat",
                                            paddingRight: "30px", // Space for the arrow
                                          }}
                                          onClick={(e) => {
                                            setHiddenDropDownHelpMenu(
                                              !HiddenDropDownHelpMenu
                                            );
                                            getHelpMenuData(
                                              e,
                                              datanew?.labObservationID
                                            );
                                          }}
                                        />

                                        {helpmenu.length > 0 &&
                                          helpmenu[0]?.Value ==
                                            datanew?.labObservationID &&
                                          HiddenDropDownHelpMenu && (
                                            <ul
                                              className={"suggestion-data-help"}
                                              style={{
                                                width: "100%",
                                                position: "absolute",
                                                right: "0px",
                                                border: "1px solid #dddfeb",
                                              }}
                                            >
                                              {helpmenu.map(
                                                (data, helpmenuindex) => (
                                                  <li
                                                    onClick={() =>
                                                      handleListSearch(
                                                        data,
                                                        "Value",
                                                        index
                                                      )
                                                    }
                                                    key={helpmenuindex}
                                                    className={`${
                                                      helpmenuindex ===
                                                        indexMatch &&
                                                      "matchIndex"
                                                    }`}
                                                  >
                                                    {data?.label}
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          )}
                                      </div>
                                    </td>
                                  )}
                                  {["2", "3"].includes(datanew?.ReportType) ? (
                                    <td></td>
                                  ) : (
                                    <td
                                      style={{ position: "relative" }}
                                      data-title={t("Action")}
                                    >
                                      <div className="d-flex align-items-center">
                                        <div
                                          className="mx-2"
                                          style={{
                                            cursor: "pointer",
                                            fontSize: "15px",
                                          }}
                                          onClick={() =>
                                            setShow2({
                                              moadal: true,
                                              data: {
                                                ...datanew,
                                                pageName: "Single",
                                              },
                                            })
                                          }
                                        >
                                          <Tooltip label={"Add Comment"}>
                                            {" "}
                                            <i
                                              className="fa fa-plus plusSign"
                                              aria-hidden="true"
                                            ></i>
                                          </Tooltip>{" "}
                                        </div>
                                        <span
                                          className="fa fa-exclamation-triangle mx-2"
                                          aria-hidden="true"
                                          style={{
                                            cursor: "pointer",
                                            fontSize: "15px",
                                            width: "35px",
                                            padding: "5px 10px",
                                          }}
                                          onMouseEnter={() => {
                                            setMouseHover({
                                              index: index,
                                              data: [],
                                            });
                                            DeltaResponse(datanew);
                                          }}
                                          onMouseLeave={() => {
                                            setMouseHover({
                                              index: -1,
                                              data: [],
                                            });
                                            setPreviousTestResult([]);
                                          }}
                                        >
                                          {mouseHover?.index === index &&
                                            PreviousTestResult.length > 0 && (
                                              <div
                                                style={{
                                                  position: "absolute",
                                                  top: "-100%",
                                                  left: "0",
                                                  width: "600px",
                                                  zIndex: 999999,
                                                  height: "auto",
                                                  overflow: "visible",
                                                  background: "white",
                                                  border: "1px solid #ddd",
                                                }}
                                                // className="resultEntryCssTable"
                                              >
                                                <table>
                                                  <thead>
                                                    <tr>
                                                      <th>Booking Date</th>
                                                      <th>Approved Date</th>
                                                      <th>Test</th>
                                                      <th>Value</th>
                                                      <th>Unit</th>
                                                      <th>Min</th>
                                                      <th>Max</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {PreviousTestResult.map(
                                                      (ele, index) => (
                                                        <tr
                                                          key={index}
                                                          style={{
                                                            background:
                                                              "skyBlue",
                                                          }}
                                                        >
                                                          <td
                                                            data-title="BookingDate"
                                                            style={{
                                                              width: "120px",
                                                            }}
                                                          >
                                                            {dateConfig(
                                                              ele?.BookingDate
                                                            )}
                                                          </td>
                                                          <td
                                                            data-title="BookingDate"
                                                            style={{
                                                              width: "120px",
                                                            }}
                                                          >
                                                            {dateConfig(
                                                              ele?.ApprovedDate
                                                            )}
                                                          </td>
                                                          <td data-title="LabObservationName">
                                                            {ele?.LabObservationName
                                                              ? ele?.LabObservationName
                                                              : "-"}
                                                          </td>
                                                          <td data-title="Value">
                                                            {ele?.Value
                                                              ? ele?.Value
                                                              : "-"}
                                                          </td>
                                                          <td data-title="ReadingFormat">
                                                            {ele?.ReadingFormat
                                                              ? ele?.ReadingFormat
                                                              : "-"}
                                                          </td>
                                                          <td data-title="MinValue">
                                                            {ele?.MinValue
                                                              ? ele?.MinValue
                                                              : "-"}
                                                          </td>
                                                          <td data-title="MaxValue">
                                                            {ele?.MaxValue
                                                              ? ele?.MaxValue
                                                              : "-"}
                                                          </td>
                                                        </tr>
                                                      )
                                                    )}
                                                  </tbody>
                                                </table>
                                              </div>
                                            )}
                                        </span>
                                      </div>
                                    </td>
                                  )}
                                  {["2", "3"].includes(datanew?.ReportType) ? (
                                    <td> &nbsp;</td>
                                  ) : (
                                    <td
                                      className="w-50p"
                                      data-title={t("Flag")}
                                    >
                                      <select value={datanew?.Flag} disabled>
                                        <option hidden></option>
                                        <option value="Normal">Normal</option>
                                        <option value="High">High</option>
                                        <option value="Low">Low</option>
                                      </select>
                                    </td>
                                  )}
                                  <td data-title={t("Omit")}>
                                    <input
                                      type="checkbox"
                                      checked={datanew?.isOmit}
                                      onChange={(e) => handleCheckbox(e, index)}
                                      name="isOmit"
                                      // disabled={true}
                                    />
                                  </td>
                                  <td data-title={t("Critical")}>
                                    <input
                                      type="checkbox"
                                      checked={datanew?.IsCriticalCheck}
                                      onChange={(e) => handleCheckbox(e, index)}
                                      name="IsCriticalCheck"
                                      // disabled={true}
                                    />
                                  </td>
                                  <td
                                    data-title={t("Mac Reading")}
                                    className={`Status-${datanew?.Status}`}
                                    style={{
                                      wordWrap: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {" "}
                                    {datanew?.MacReading}&nbsp;
                                  </td>
                                  <td
                                    data-title={t("MachineName")}
                                    style={{
                                      wordWrap: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {" "}
                                    {datanew?.machinename}&nbsp;
                                  </td>
                                  <td
                                    data-title={t("Reading 1")}
                                    style={{
                                      wordWrap: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {datanew?.Reading1} &nbsp;
                                  </td>
                                  <td
                                    data-title={t("Reading 2")}
                                    style={{
                                      wordWrap: "break-word",
                                      whiteSpace: "normal",
                                    }}
                                  >
                                    {datanew?.Reading2} &nbsp;
                                  </td>

                                  {["2", "3"].includes(datanew?.ReportType) ? (
                                    <td data-title=""> &nbsp;</td>
                                  ) : (
                                    <td
                                      data-title={t("Method Name")}
                                      style={{
                                        wordWrap: "break-word",
                                        whiteSpace: "normal",
                                      }}
                                    >
                                      {datanew?.MethodName} &nbsp;
                                    </td>
                                  )}
                                  {["2", "3"].includes(datanew?.ReportType) ? (
                                    <td data-title=""> &nbsp;</td>
                                  ) : (
                                    <td data-title="DisplayReading">
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div
                                          style={{
                                            wordWrap: "break-word",
                                            whiteSpace: "normal",
                                          }}
                                        >
                                          {datanew?.DisplayReading}
                                        </div>{" "}
                                        <div>
                                          {" "}
                                          {["2", "3"].includes(
                                            datanew?.ReportType
                                          ) ? (
                                            <div data-title=""> &nbsp;</div>
                                          ) : (
                                            <div
                                              onClick={() =>
                                                setShow({
                                                  moadal: true,
                                                  data: datanew,
                                                })
                                              }
                                            >
                                              <Tooltip label={"Edit"}>
                                                <i
                                                  className="bi bi-pencil-square m-0 mr-3 text-icon-size-edit"
                                                  style={{ color: "#274C77" }}
                                                ></i>{" "}
                                              </Tooltip>
                                            </div>
                                          )}
                                        </div>
                                      </div>{" "}
                                      &nbsp;
                                    </td>
                                  )}
                                  {["2", "3"].includes(datanew?.ReportType) ? (
                                    <td data-title=""> &nbsp;</td>
                                  ) : (
                                    <td data-title={t("ReadingFormat")}>
                                      <div
                                        style={{
                                          wordWrap: "break-word",
                                          whiteSpace: "normal",
                                        }}
                                      >
                                        {" "}
                                        {datanew?.ReadingFormat}
                                      </div>{" "}
                                      &nbsp;
                                    </td>
                                  )}
                                </>
                              ) : (
                                <td colSpan="10" data-title="">
                                  {" "}
                                  &nbsp;
                                </td>
                              )}
                              {/* <td colSpan="10" data-title="">
                            {" "}
                            &nbsp;
                          </td> */}
                            </tr>
                          )}
                        </>
                      ))}
                    </>
                  ))}
                </tbody>
              </ResultEntryTableCustom>
            </div>
            <div className=" m-0 p-0 pb-2" style={{ zIndex: 0 }}>
              <div
                className="row mt-3 mr-1  d-flex flex-wrap"
                style={{ textWrap: "avoid" }}
              >
                {loading ? (
                  <div className="mx-3">
                    <Loading />
                  </div>
                ) : (
                  <>
                    <div className="col-sm-1">
                      <button
                        className="previous roundarrow btn-success mx-2"
                        onClick={() => {
                          ResultData.length > 0 &&
                            GetResultEntry(
                              {
                                TestID:
                                  redata[ResultData[0]?.currentIndex - 1]
                                    ?.TestID,
                                LedgerTransactionID: "",
                                DepartmentID: "",
                                symbol: "",
                                Mobile:
                                  redata[ResultData[0]?.currentIndex - 1]
                                    ?.Mobile,
                                VisitNo:
                                  redata[ResultData[0]?.currentIndex - 1]
                                    ?.VisitNo,
                                PEmail:
                                  redata[ResultData[0]?.currentIndex - 1]
                                    ?.PEmail,
                                MacID: machine[0]?.value ?? "",
                                LedgertransactionIDHash:
                                  redata[ResultData[0]?.currentIndex - 1]
                                    ?.LedgertransactionIDHash,
                                isOutSource:
                                  redata[ResultData[0]?.currentIndex - 1]
                                    ?.isOutSource,
                                index:
                                  redata[ResultData[0]?.currentIndex - 1]
                                    ?.index,
                                ApprovedBy:
                                  doctorAdmin?.length == 1
                                    ? doctorAdmin[0]?.value?.toString()
                                    : "0",
                              },
                              ResultData[0]?.currentIndex - 1
                            );
                        }}
                        disabled={
                          ResultData[0]?.currentIndex === 0 ? true : false || id
                        }
                      >
                        ‹
                      </button>
                      <button
                        className="next roundarrow btn-success"
                        onClick={() => {
                          ResultData.length > 0 &&
                            GetResultEntry(
                              {
                                TestID:
                                  redata[ResultData[0]?.currentIndex + 1]
                                    ?.TestID,
                                LedgerTransactionID: "",
                                DepartmentID: "",
                                symbol: "",

                                Mobile:
                                  redata[ResultData[0]?.currentIndex + 1]
                                    ?.Mobile,
                                VisitNo:
                                  redata[ResultData[0]?.currentIndex + 1]
                                    ?.VisitNo,
                                PEmail:
                                  redata[ResultData[0]?.currentIndex + 1]
                                    ?.PEmail,
                                MacID: machine[0]?.value ?? "",
                                LedgertransactionIDHash:
                                  redata[ResultData[0]?.currentIndex + 1]
                                    ?.LedgertransactionIDHash,
                                isOutSource:
                                  redata[ResultData[0]?.currentIndex + 1]
                                    ?.isOutSource,
                                index:
                                  redata[ResultData[0]?.currentIndex + 1]
                                    ?.index,
                                ApprovedBy:
                                  doctorAdmin?.length == 1
                                    ? doctorAdmin[0]?.value?.toString()
                                    : "0",
                              },
                              ResultData[0]?.currentIndex + 1
                            );
                        }}
                        disabled={
                          ResultData[0]?.currentIndex === redata.length - 1 ||
                          id
                            ? true
                            : false
                        }
                      >
                        ›
                      </button>
                    </div>

                    {["", 3, 10, 11, 13, 14, 15, 20, 5, 6, 18].includes(
                      statusValue
                    ) && (
                      <div
                        className={
                          buttonsData?.some(
                            (ele) => ele?.AccessBy === "Dual Authentication"
                          ) && checkDualAuthentication
                            ? "col-sm-2"
                            : "col-sm-1"
                        }
                      >
                        <div className="p-inputgroup d-flex">
                          <button
                            style={{
                              backgroundColor: "Pink",
                              width:
                                buttonsData?.some(
                                  (ele) =>
                                    ele?.AccessBy === "Dual Authentication"
                                ) && checkDualAuthentication
                                  ? "30%"
                                  : "100%",
                            }}
                            className="btn btn-block btn-sm"
                            onClick={() => handleResultSubmit("Save")}
                          >
                            {t("Save")}
                          </button>
                          {buttonsData?.some(
                            (ele) => ele?.AccessBy === "Dual Authentication"
                          ) &&
                            checkDualAuthentication && (
                              <div style={{ width: "70%", marginLeft: "10px" }}>
                                {buttonsData
                                  ?.filter(
                                    (ele) =>
                                      ele?.AccessBy === "Dual Authentication"
                                  )
                                  .map((ele, index) => (
                                    <button
                                      key={index}
                                      style={{
                                        backgroundColor: "#fc3a3d",
                                        color: "white",
                                      }}
                                      className="btn btn-block btn-sm"
                                      onClick={() =>
                                        handleResultSubmit(ele?.AccessBy)
                                      }
                                    >
                                      {t("Dual Authentication")}
                                    </button>
                                  ))}
                              </div>
                            )}
                        </div>
                      </div>
                    )}

                    {!id && (
                      <div className="col-sm-1">
                        <button
                          className="btn btn-dark btn-block btn-sm"
                          type="button"
                          id="btnMainList"
                          onClick={() => {
                            setResultData([]);
                            setResultTestData([]);
                          }}
                        >
                          {t("Main List")}
                        </button>
                      </div>
                    )}

                    <div className="col-sm-2">
                      <SelectBox
                        options={[
                          { label: "Select Doctor", value: "0" },
                          ...doctorAdmin,
                        ]}
                        selectedValue={ResultTestData[0]?.ApprovedBy}
                        id="ApprovedBy"
                        lable="Doctor"
                        name="ApprovedBy"
                        onChange={handleDoctorName}
                      />
                    </div>
                    <div className="col-sm-1">
                      <SelectBox
                        options={machine}
                        id="Machine"
                        name="Machine"
                        selectedValue={ResultData[0]?.MacID}
                        onChange={(e) =>
                          GetResultEntry(
                            {
                              TestID:
                                redata[ResultData[0]?.currentIndex]?.TestID,
                              LedgerTransactionID: "",
                              DepartmentID: "",
                              symbol: "",
                              Mobile:
                                redata[ResultData[0]?.currentIndex]?.Mobile,
                              VisitNo:
                                redata[ResultData[0]?.currentIndex]?.VisitNo,
                              PEmail:
                                redata[ResultData[0]?.currentIndex]?.PEmail,
                              MacID: e?.target?.value,
                              LedgertransactionIDHash:
                                redata[ResultData[0]?.currentIndex]
                                  ?.LedgertransactionIDHash,
                              index: redata[ResultData[0]?.currentIndex]?.index,
                              ApprovedBy:
                                doctorAdmin?.length == 1
                                  ? doctorAdmin[0]?.value?.toString()
                                  : "0",
                            },
                            ResultData[0]?.currentIndex
                          )
                        }
                        lable={t("Machine")}
                      />
                    </div>
                    <div className="col-sm-1">
                      {PrintReportLoading ? (
                        <Loading />
                      ) : (
                        <button
                          className="btn btn-secondary btn-block btn-sm my"
                          type="button"
                          id="btnMainList"
                          onClick={() => handleReport("no", "")}
                        >
                          {t("Preview")}
                        </button>
                      )}
                    </div>
                    <div className="col-sm-1">
                      {buttonsData?.map(
                        (ele, index) =>
                          ele?.AccessBy !== "Not Approved" &&
                          ele?.AccessBy !== "Unhold" &&
                          ele?.AccessBy !== "Discount Approval" &&
                          ele?.AccessBy !== "Hold" &&
                          ele?.AccessBy !== "Dual Authentication" && (
                            <button
                              className="btn btn-block btn-sm my"
                              style={{
                                backgroundColor: "#008000",
                                color: "white",
                              }}
                              type="button"
                              id="btnMainList"
                              key={index}
                              onClick={() => handleResultSubmit(ele?.AccessBy)}
                            >
                              {ele?.AccessBy === "Approved"
                                ? t("Approve")
                                : t(ele?.AccessBy)}
                            </button>
                          )
                      )}
                    </div>
                    <div className="col-sm-1">
                      <button
                        className="btn  btn-block btn-success btn-sm"
                        type="button"
                        //   id="btnMainList"
                        onClick={() => handleDeltaCheckReport(ResultTestData)}
                      >
                        {" "}
                        {t("Delta Check")}
                      </button>
                    </div>
                    <div className="col-sm-1">
                      <button
                        className="btn btn-success btn-block btn-sm"
                        onClick={() => {
                          setShowPH(true);
                        }}
                      >
                        {t("Patient Details")}
                      </button>
                    </div>
                    <div className="col-sm-1">
                      <button
                        className="btn btn-danger btn-block btn-sm"
                        type="button"
                        onClick={() =>
                          setShowOldReportModal({
                            show: true,
                            data: ResultData[0]?.PatientCode,
                          })
                        }
                      >
                        {t("Old Report")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ResultEntry;
