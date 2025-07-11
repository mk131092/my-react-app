import React, { useEffect, useRef, useState } from "react";
import Input from "../../components/formComponent/Input";
import { SelectBox } from "../../components/formComponent/SelectBox";
import DatePicker from "../../components/formComponent/DatePicker";
import CustomTimePicker from "../../components/formComponent/TimePicker";
import Loading from "../../components/loader/Loading";
import { toast } from "react-toastify";
import moment from "moment";
import { useTranslation } from "react-i18next";
import TemplateMasterModal from "../utils/TemplateMasterModal";
import MedicialModal from "../utils/MedicialModal";
import UploadFile from "../utils/UploadFileModal/UploadFile";
import RECultureTable from "../Table/RECultureTable";
import { axiosInstance, axiosReport } from "../../utils/axiosInstance";
import { getPaymentModes } from "../../utils/NetworkApi/commonApi";
import {
  CheckDevice,
  DyanmicStatusResponse,
  DyanmicStatusResponseCulture,
  Time,
  dateConfig,
  downloadPdf,
} from "../../utils/helpers";
import Heading from "../../components/UI/Heading";
import Accordion from "@app/components/UI/Accordion";
import {
  ReportTypePreliminary,
  SampleStatus,
  SearchByCulture,
} from "../../utils/Constants";
import ReactSelect from "../../components/formComponent/ReactSelect";
import { Link } from "react-router-dom";
import Tables from "../../components/UI/customTable";
import PatientDetailModal from "../utils/PatientDetailModal";
import CloseButton from "../../components/formComponent/CloseButton";
import ResultEntryTableCustom from "./ResultEntryTableCustom";
import Tooltip from "../../components/formComponent/Tooltip";
import SampleRemark from "../utils/SampleRemark";
import Pagination from "../../Pagination/Pagination";
const ResultEntryCulture = () => {
  const [ResultTestData, setResultTestData] = useState([]);
  const [ResultData, setResultData] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [department, setDepartment] = useState([]);
  const [RateTypes, setRateTypes] = useState([]);
  const [TestSuggestion, setTestSuggestion] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Identity, setIdentity] = useState([]);
  const [reData, SetReData] = useState([]);
  const [bindOrganism, setBindOrganism] = useState([]);
  const [entry, setEntry] = useState([]);
  const [entryShow, setEntryShow] = useState(false);
  const [indexMatch, setIndexMatch] = useState(0);
  const today = new Date();
  const [payload, setPayload] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    ItemValue: "",
    SelectTypes: "",
    DepartmentID: "",
    TestName: "",
    CentreID: "",
    SampleStatus: "3",
    FromTime: new Date(today.setHours(0, 0, 0, 0)),
    ToTime: new Date(today.setHours(23, 59, 59, 999)),
  });
  const [showdetails, setshowDetails] = useState(true);
  const [statusValue, setStatusValue] = useState("");
  const [Sensitivity, setSensitivity] = useState([]);
  const [entryPayload, setEntryPayload] = useState({
    ReportNumber: "Preliminary 1",
    organism: "",
    IncubationDate: new Date(),
    IncubationTime: "00:00:00",
    ApprovedBy: "",
    ApprovalName: "",
  });
  const [show5, setShow5] = useState({
    modal: false,
    data: "",
  });

  const [HiddenDropDownHelpMenu, setHiddenDropDownHelpMenu] = useState(false);
  const [showUD, setShowUD] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  const myRefs = useRef([]);
  const [showMH, setShowMH] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  const [PrintReportLoading, setPrintReportLoading] = useState(false);
  const [buttonsData, setButtonsData] = useState([]);
  const [helpmenu, setHelpMenu] = useState([]);

  const [show3, setShow3] = useState({
    modal: false,
    data: {},
  });
  const [showFilter, setshowFilter] = useState(true);
  const [show2, setShow2] = useState({
    moadal: false,
    data: {},
  });
  const [doctorAdmin, setDoctorAdmin] = useState([]);
  const [showPH, setShowPH] = useState(false);
  const { t } = useTranslation();
  const BindApprovalDoctor = () => {
    axiosInstance
      .get("CommonController/BindApprovalDoctor")
      .then((res) => {
        // console.log(res)
        let data = res.data.message;
        let doctorData = data.map((ele) => {
          return {
            value: ele?.employeeid,
            label: ele?.name,
          };
        });
        setDoctorAdmin(doctorData);
      })
      .catch((err) => console.log(err));
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
  // console.log(entryShow);
  const getOrganimseName = (data, val, ReportNumber) => {
    setEntryShow(true);
    let id = data.split(",").map(Number);
    console.log(val);
    let filteredId = bindOrganism.filter((item) => id.includes(item.value));
    console.log(filteredId);
    filteredId.forEach((entry) => {
      getEntryData(
        entry.value,
        entry.label,
        val?.TestID,
        val?.BarcodeNo,
        ReportNumber,
        false
      );
    });
  };
  const getEntryData = (id, name, Testid, BarcodeNo, ReportNumber, key) => {
    console.log(entry, id);
    if (id) {
      const isPresent = entry?.some((innerArray) =>
        innerArray?.some((obj) => obj?.obid == id)
      );
      console.log(isPresent, key);
      if (!isPresent || !key) {
        axiosInstance
          .post("RECulture/BindObsAntibiotic", {
            TestId: Testid ?? reData[ResultData[0]?.currentIndex]?.TestID,
            BarcodeNo:
              BarcodeNo ?? reData[ResultData[0]?.currentIndex]?.BarcodeNo,
            ObsId: id,
            ObsName: name,
            ReportNumber: ReportNumber ?? entryPayload?.ReportNumber,
          })
          .then((res) => {
            let data = res.data.message;
            data = data.map((item, index) => {
              return {
                ...item,
                index: index,
                AntiBioticInterpreatation: item?.VALUE,
                isInput: false,
              };
            });
            setEntry((prevData) => [...prevData, data]);
          })
          .catch((err) =>
            toast.error(err?.response?.data?.message ?? "Something Went Wrong")
          );
      } else {
        toast.error("Entry already added");
      }
    }
  };
  // console.log(entry);
  function addItemAtIndex(outerIndex) {
    const newEntry = [...entry];
    const newItem = {
      ...newEntry[outerIndex][0],
      name: "",
      index: newEntry[outerIndex]?.length + 1,
      id: "0",
      isInput: true,
      AntiBioticInterpreatation: "",
      mic: "",
    };
    newEntry[outerIndex] = [...newEntry[outerIndex], newItem];
    setEntry(newEntry);
  }
  const handleFilterOrg = (outerIndex, innerIndex) => {
    const updatedEntry = [...entry];
    updatedEntry[outerIndex] = [...updatedEntry[outerIndex]];
    updatedEntry[outerIndex].splice(innerIndex, 1);
    setEntry(updatedEntry);
  };

  const removeArrayAtIndex = (index) => {
    const newData = [...entry];
    newData.splice(index, 1);
    setEntry(newData);
  };
  const handleSensitivity = (value, outerIndex, innerIndex, name) => {
    const newEntry = [...entry];
    newEntry[outerIndex][innerIndex][name] = value;
    setEntry(newEntry);
  };
  function setValuesForOuterIndex(outerIndex, name, value) {
    const newEntry = [...entry];
    newEntry[outerIndex] = newEntry[outerIndex].map((item) => {
      return {
        ...item,
        [name]: value,
      };
    });
    setEntry(newEntry);
  }
  const handleDoctorName = (e) => {
    const { name, value, selectedIndex } = e.target;
    const label = e?.target?.children[selectedIndex].text;
    setEntryPayload({
      ...entryPayload,
      [name]: value,
      ApprovalName: label,
    });
  };
  const getBindOrganism = () => {
    axiosInstance
      .get("RECulture/BindOrganism")
      .then((res) => {
        let data = res?.data?.message;

        let organism = data?.map((ele) => {
          return {
            value: ele?.Id,
            label: ele?.NAME,
          };
        });

        setBindOrganism(organism);
      })
      .catch((err) => {
        console.log(err?.response?.data?.message);
      });
  };

  const getSensitivity = () => {
    axiosInstance
      .post("Global/getGlobalData", { Type: "Sensitivity" })
      .then((res) => {
        let data = res.data.message;
        // console.log(data);
        let value = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        setSensitivity(value);
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

        setDepartment(DeptDataValue);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getDepartment();
    getAccessCentres();
    getPaymentModes("Identity", setIdentity);
    getBindOrganism();
    BindApprovalDoctor();
    getButtondata();
    getSensitivity();
  }, []);
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

  const totalPatient = () => {
    const visitNos = reData.map((item) => item?.LedgerTransactionNo);
    const uniqueVisitNos = new Set(visitNos);
    return uniqueVisitNos?.size;
  };

  const getHelpMenuData = (e, labObservationId) => {
    if (e?.which !== 13) {
      debugger;
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
  const DepartmentWiseItemList = (id) => {
    axiosInstance
      .post("CommonController/DepartmentWiseItemList", {
        DepartmentID: id,
        TestName: "",
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => {
          return {
            label: ele?.TestName,
            value: ele?.InvestigationID,
          };
        });
        setTestSuggestion(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const setArrangeMentOfData = (data, subData) => {
    let mainData = [];
    subData.map((ele, _) => {
      data.map((eleInner, _) => {
        if (ele?.TestID === eleInner?.TestID) {
          mainData = [...mainData, eleInner];
        }
      });
    });
    setResultData(mainData);
  };
  const GetResultEntryCulture = (payload, index, loading, ReportNumber) => {
    if (loading) {
      loading(true);
    }
    setEntry([]);
    axiosInstance
      .post("RECulture/LabObservationSearch", {
        ...payload,
        ReportNumber: ReportNumber,
      })
      .then((res) => {
        const data = res?.data?.message?.message;
        const val = data?.map((ele) => {
          return {
            ...ele,
            currentIndex: index,
            IsChecked: 1,
            SaveRangeStatus: 0,
          };
        });
        if (val && val.length > 1) {
          const lastElementCopy = { ...val[0] };
          lastElementCopy.LabObservationName = "Comments";
          lastElementCopy.TestName = "Comments";
          lastElementCopy.COMMENT = val[0]?.TestComment ?? "";
          lastElementCopy.InvestigationID = "";
          lastElementCopy.labObservationID = val[0]?.InvestigationID;
          lastElementCopy.Value = "";
          val.push(lastElementCopy);
        }
        const dataTestHeader = res?.data?.message?.testHeader;
        const valTestHeader = dataTestHeader?.map((ele) => {
          return {
            ...ele,
            IsChecked: 1,
            outSource: 1,
            isDocumentUpload: 0,
            TestCenterId: val[0]?.TestCentreID,
          };
        });
        val[0]?.OrgId != "" &&
          getOrganimseName(val[0]?.OrgId, payload, ReportNumber);
        setResultTestData(valTestHeader);
        setArrangeMentOfData(val, valTestHeader);
        if (loading) {
          loading(false);
        }
        val[0]?.OrgId == "" && setEntryShow(false);
        // console.log(val[0]);
        setEntryPayload({
          ...entryPayload,
          ApprovedBy:
            doctorAdmin?.length == 1 ? doctorAdmin[0]?.value?.toString() : "",
          ApprovalName:
            doctorAdmin?.length == 1 ? doctorAdmin[0]?.label?.toString() : "",
          ReportNumber: ReportNumber,
          organism: "",
          IncubationDate: new Date(val[0]?.IncubationDate),
          IncubationTime: val[0]?.IncubationTime,
        });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        if (loading) {
          loading(false);
        }
        setEntryShow(false);
        setEntry([]);
      });
  };

  const handleNotApproveRemark = (e, data) => {
    const { name, value } = e.target;
    const TestHeader = [...ResultTestData];
    const index = ResultTestData.indexOf(data);
    TestHeader[index][name] = value;
    setResultTestData(TestHeader);
  };

  const TableData = (SampleStatus) => {
    setLoading(true);
    const rateTypes = RateTypes.map((item) => {
      return item?.value;
    });

    const CenterDatas = CentreData.map((item) => {
      return item?.value;
    });
    axiosInstance
      .post("RECulture/PatientSearch", {
        FromDate: moment(payload.FromDate).format("MM/DD/YYYY"),
        ToDate: moment(payload.ToDate).format("MM/DD/YYYY"),
        DepartmentId: payload.DepartmentID,
        CentreId:
          payload?.CentreID == null || payload?.CentreID == ""
            ? CenterDatas
            : [payload?.CentreID],
        RateTypeID:
          payload?.RateTypeID == null || payload?.RateTypeID == ""
            ? rateTypes
            : [payload?.RateTypeID],
        InvestigationId: payload?.TestName.toString(),
        SearchType: payload?.SelectTypes,
        SearchValue: payload?.ItemValue?.trim(),
        SampleStatus: SampleStatus,
        FromTime: Time(payload?.FromTime),
        ToTime: Time(payload?.ToTime),
      })
      .then((res) => {
        SetReData(res?.data?.message);
        setLoading(false);
        setStatusValue(
          SampleStatus === "" ? SampleStatus : parseInt(SampleStatus)
        );
      })
      .catch((err) => {
        SetReData([]);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoading(false);
      });
  };

  const handleSearchSelectChange = (label, value) => {
    if (label === "CentreID") {
      setPayload({ ...payload, [label]: value?.value, RateTypeID: "" });
      setRateTypes([]);
      if (value?.value == "") {
        fetchRateTypes(CentreData.map((ele) => ele.value));
      } else {
        fetchRateTypes([value?.value]);
      }
    } else {
      setPayload({ ...payload, [label]: value?.value });
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "DepartmentID") {
      setPayload({ ...payload, [name]: value, TestName: "" });
      DepartmentWiseItemList(value);
    } else setPayload({ ...payload, [name]: value });
  };
  const dateSelect = (value, name) => {
    setPayload({
      ...payload,
      [name]: value,
    });
  };
  const handleTime = (time, name) => {
    setPayload({ ...payload, [name]: time });
  };

  const handleSearchChange = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
    value != -1 && TableData(value);
  };
  const handleUploadCount = (name, value, secondName) => {
    let data = [...reData];
    if (name === "UploadDocumentCount") {
      data[showUD?.index][name] = value;
      data[showUD?.index][secondName] = value === 0 ? 0 : 1;
      SetReData(data);
    } else {
      data[showMH?.index][name] = value;
      data[showMH?.index][secondName] = value === 0 ? 0 : 1;
      SetReData(data);
    }
  };
  const dateSelect2 = (value, name) => {
    setEntryPayload({
      ...entryPayload,
      [name]: value,
    });
  };
  const handleTime2 = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;
    setEntryPayload({ ...entryPayload, [secondName]: TimeStamp });
  };
  const handleCheckbox = (e, index, testid) => {
    const data = [...ResultData];

    const dataTestHeader = [...ResultTestData];
    const { value, checked, type, name } = e.target;
    if (index >= 0) {
      if (name === "Value") {
        data[index][name] = value;
      }

      if (type === "checkbox") {
        data[index][name] = checked;
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
            IsChecked: checked ? 1 : 0,
          };
        } else {
          return ele;
        }
      });
      setResultTestData(valTestHeader);
      setResultData(val);
    }
  };

  const handleResultSubmit = (field, headData) => {
    const errorToast = `This Test is ${DyanmicStatusResponseCulture(ResultTestData)}`;
    // console.log(field, errorToast);
    if (field === "Approved") {
      // console.log("first");
      const data = ResultData.filter(
        (ele) =>
          (ele?.Status === 3 ||
            ele?.Status === 10 ||
            ele?.Status == 5 ||
            ele?.Status == 6 ||
            ele?.Status == 20) &&
          ele?.IsChecked === 1
      );
      const val = ResultTestData.filter(
        (ele) =>
          (ele?.Status === 3 ||
            ele?.Status === 10 ||
            ele?.Status == 5 ||
            ele?.Status == 6 ||
            ele?.Status == 20) &&
          ele?.IsChecked === 1
      );
      validateData(field, data, errorToast, val);
    } else if (field === "Save") {
      const data = ResultData.filter(
        (ele) =>
          (ele?.Status === 3 ||
            ele?.Status === 10 ||
            ele?.Status == 20 ||
            ele?.Status == 5 ||
            ele?.Status == 6) &&
          ele?.IsChecked === 1
      );
      const val = ResultTestData.filter(
        (ele) =>
          (ele?.Status === 3 ||
            ele?.Status === 10 ||
            ele?.Status == 20 ||
            ele?.Status == 5 ||
            ele?.Status == 6) &&
          ele?.IsChecked === 1
      );
      validateData(field, data, errorToast, val);
    } else if (field === "Dual Authentication") {
      const data = ResultData.filter(
        (ele) =>
          (ele?.Status === 3 ||
            ele?.Status === 10 ||
            ele?.Status == 20 ||
            ele?.Status == 5 ||
            ele?.Status == 6) &&
          ele?.IsChecked === 1
      );
      const val = ResultTestData.filter(
        (ele) =>
          (ele?.Status === 3 ||
            ele?.Status === 10 ||
            ele?.Status == 20 ||
            ele?.Status == 5 ||
            ele?.Status == 6) &&
          ele?.IsChecked === 1
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
        (ele) => ele.Status !== 5 && ele.IsChecked === 1
      );
      const val = ResultTestData.filter(
        (ele) => ele.Status !== 5 && ele.IsChecked === 1
      );
      validateData(field, payload, errorToast, val);
    } else if (field === "Unhold") {
      const data = ResultData.filter((ele) => ele.TestID === headData.TestID);
      const val = ResultTestData.filter(
        (ele) => ele?.TestID === headData.TestID
      );
      validateData(field, data, t("This Test is not Hold"), val);
    } else {
      const payload = ResultData.filter((ele) => ele.IsChecked === 1);
      validateData(field, payload);
    }
  };
  const validateData = (field, payload, message, headerData) => {
    // console.log(payload, "3");
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
        if (checkDual(headerData)) {
          toast.error(checkDual(headerData));
        } else if (entryPayload?.ApprovedBy == "") {
          toast.error("Kindly Select Doctor");
        } else fetchApi(field, payload, headerData);
      }
    } else {
      toast.error(message);
    }
  };
  const checkDual = (headerData) => {
    console.log(headerData);
    for (let i = 0; i < headerData.length; i++) {
      if (
        headerData[i]["DualAuthentication"] == 1 &&
        headerData[i]["DualAuthenticatedcount"] != 2
      ) {
        return `Can't Be Approved. For ${headerData[i]?.PackageName} Dual Authentication Is Required`;
      }
    }
    return false;
  };

  console.log(ResultData);
  const prop = () => {
    const visitNos = reData.map((item) => item?.TestID);
    const uniqueVisitNos = new Set(visitNos);
    return uniqueVisitNos?.size;
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

  const printHeader = (isPrint, guid) => {
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

  const handleReport = (key, headerData) => {
    // console.log("key");
    const data = ResultTestData.filter((ele) => ele?.IsChecked === 1);
    let TestIDHash = data.map((ele) => {
      return ele?.TestIDHash;
    });
    const requestOptions = {
      ...(CheckDevice() == 1 && { responseType: "blob" }),
    };
    setPrintReportLoading(true);
    axiosReport
      .post(
        `commonReports/GetLabReport`,
        {
          ReportNumber: entryPayload?.ReportNumber,
          TestIDHash: TestIDHash,
          PrintColour: "0",
          PHead: 0,

          IsDownload: CheckDevice(),
        },
        requestOptions
      )
      .then((res) => {
        if (CheckDevice() == 1) {
          downloadPdf(res.data);
        } else {
          if (res?.data?.success) {
            if (key == "Yes") {
              handleApproveReport(res?.data?.url, headerData);
              setPrintReportLoading(false);
            } else {
              window.open(res?.data?.url, "_blank");
              setPrintReportLoading(false);
            }
          } else {
            setPrintReportLoading(false);
            key == "no" && toast.error(res?.data?.message);
          }
        }
      })
      .catch((err) => {
        // toast.error(
        //   err?.response?.data?.message
        //     ? err?.response?.data?.message
        //     : err?.data?.message
        // );
        setPrintReportLoading(false);
      });
  };
  const handleApproveReport = (Url, headerData) => {
    // console.log(Url, headerData);
    axiosInstance
      .post("RE/SendReport", {
        LedgerTransactionNo: headerData[0]?.LedgerTransactionNo,
        PatientName: headerData[0]?.PatientName,
        MobileNo: headerData[0]?.Mobile,
        PEmail: headerData[0]?.PEmail,
        URL: Url,
      })
      .then((res) => toast.success(res?.data?.message))
      .catch((err) => {
        console.log(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };
  console.log(entryPayload);
  const fetchApi = (field, payload, headerData) => {
    setLoading(true);
    const singleArrayOfObjects = entry?.reduce(
      (acc, arr) => acc.concat(arr),
      []
    );
    const organismData = singleArrayOfObjects?.map((ele) => {
      return {
        ...ele,
        OrganismId: ele?.obid,
        MIC: ele?.mic,
        OrganismName: ele?.obname,
        AntiBioticGroupId: ele?.AntibioticGroupID,
        AntiBioticId: ele?.id,
        AntiBioticName: ele?.name,
        EnzymeName: ele?.obname,
        TestId: payload[0]?.TestID,
        OrganismGroupId: ele?.colonycount,
        OrganismGroupName: ele?.colonycountcomment,
      };
    });
    const savePayload = payload?.map((ele) => {
      return {
        ...ele,
        InvestigationId: ele?.InvestigationID,
        LabInvestigationId: ele?.InvestigationID,
        TestId: ele?.TestID,
        Inv: "",
        LabNo: ele?.LedgerTransactionNo,
        BarcodeNo: ele?.SINNo,
        LabObservationId: ele?.labObservationID,
        Description: ele?.COMMENT,
      };
    });
    // console.log(headerData);
    if (field == "Approved") {
      const details = {
        Data: savePayload,
        ResultStatus: field,
        IsCritical: 0,
        HeaderInfo: headerData,
        AntiBioticData: organismData,
        ReportNumber: entryPayload?.ReportNumber,
        LedgertransactionId: savePayload[0]?.LedgerTransactionID,
        ApprovedBy: entryPayload?.ApprovedBy,
        ApprovalName: entryPayload?.ApprovalName,
      };

      axiosInstance
        .post("RECulture/SaveCultureData", details)
        .then((res) => {
          setLoading(false);
          // console.log(doctorAdmin);

          handleReport("Yes", headerData);
          setResultData([]);
          setEntry([]);
          toast.success(res?.data?.message);

          setEntryPayload({
            ReportNumber: "Preliminary 1",
            organism: "",
            IncubationDate: new Date(),
            IncubationTime: "00:00:00",
            ApprovedBy: "",
            ApprovalName: "",
          });
        })
        .catch((err) => {
          if (err.response.status === 504) {
            toast.error(t("Something Went Wrong"));
          }
          if (err.response.status === 401) {
            toast.error(err.response.data.message);
          }
          if (err.response.status === 400) {
            toast.error(err.response.data.message);
          }
          setLoading(false);
        });
    } else {
      axiosInstance
        .post("RECulture/SaveCultureData", {
          Data: savePayload,
          ResultStatus: field,
          HeaderInfo: headerData,
          AntiBioticData: organismData,
          ReportNumber: entryPayload?.ReportNumber,
          LedgertransactionId: savePayload[0]?.LedgerTransactionID,
          NotApprovalComment: headerData[0]?.NotApproveRemark ?? "",
        })
        .then((res) => {
          setLoading(false);
          toast.success(res.data.message);
          setResultData([]);
          if (field == "Not Approved") {
            setResultData([]);
            setEntry([]);
            setEntryPayload({
              ReportNumber: "Preliminary 1",
              organism: "",
              IncubationDate: new Date(),
              IncubationTime: "00:00:00",
              ApprovedBy: "",
              ApprovalName: "",
            });
          }
        })
        .catch((err) => {
          if (err.response.status === 504) {
            toast.error(t("Something Went Wrong"));
          }
          if (err.response.status === 401) {
            toast.error(err.response.data.message);
          }
          setLoading(false);
        });
    }
  };
  const handleKeyUp = (e, targetElem) => {
    if (e.key === "Enter" && targetElem) {
      targetElem.focus();
    }
  };
  const checkDualAuthentication =
    ResultTestData?.length > 0
      ? ResultTestData?.some((ele) => ele?.DualAuthentication == 1)
      : false;

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

  const handleListSearch = (data, name, index) => {
    const val = [...ResultData];
    val[index][name] = data?.label;
    setResultData(val);
    setHelpMenu([]);
    setHiddenDropDownHelpMenu(false);
  };
  const handleSave = (data, modal) => {
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
        setShow3({ modal: false, data: {} });
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
        setShow3({ modal: false, data: {} });
        setShow2({ moadal: false, data: {} });
      }
    }

    if (modal === "TemplateMaster") {
      console.log(data);
      let val = ResultData.map((ele) => {
        if (ele.labObservationID == data?.labObservationID) {
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
      setShow3({ modal: false, data: {} });
      setShow2({ moadal: false, data: {} });
    }
  };

  const handleKeyDown = (e) => {
    if (e?.key === "Enter") {
      TableData("");
    }
  };

  return (
    <>
      {ResultData.length === 0 ? (
        <>
          {" "}
          {showMH?.modal && (
            <MedicialModal
              show={showMH.modal}
              handleClose={() => {
                setShowMH({
                  modal: false,
                  data: "",
                  index: -1,
                });
              }}
              MedicalId={showMH?.data}
              handleUploadCount={handleUploadCount}
            />
          )}
          {showUD?.modal && (
            <UploadFile
              show={showUD?.modal}
              handleClose={() => {
                setShowUD({ modal: false, data: "", index: -1 });
              }}
              options={Identity}
              documentId={showUD?.data}
              pageName="Patient Registration"
              handleUploadCount={handleUploadCount}
              formData={payload}
            />
          )}
          <Accordion
            name={t("Result Entry Culture")}
            defaultValue={true}
            linkTo="/resultculture"
            isBreadcrumb={true}
            linkTitle={
              <div className="link-title-container" id="pr_id_11">
                <div className="link-title-item">
                  {t("Total Patient") + " : " + totalPatient()}
                </div>
                <div className="link-title-item">
                  {t("Total Test Count") + " : " + prop()}
                </div>
              </div>
            }
          >
            <div className="row px-2 mt-2 mb-1">
              <div className="col-sm-2">
                <div className="d-flex">
                  <div style={{ width: "60%" }}>
                    <SelectBox
                      options={SearchByCulture}
                      id="SelectTypes"
                      lable="SelectTypes"
                      name="SelectTypes"
                      selectedValue={payload?.SelectTypes}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <div style={{ width: "100%" }}>
                      <Input
                        type="text"
                        name="ItemValue"
                        onKeyDown={handleKeyDown}
                        value={payload?.ItemValue}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-sm-2 ">
                <div>
                  <ReactSelect
                    dynamicOptions={[
                      { label: "All Centre", value: "" },
                      ...CentreData,
                    ]}
                    name="CentreID"
                    lable={t("Centre")}
                    id="Centre"
                    removeIsClearable={true}
                    placeholderName={t("Centre")}
                    value={payload?.CentreID}
                    onChange={handleSearchSelectChange}
                  />
                  {/* <SelectBox
                    options={[
                      { label: "All Centre", value: "" },
                      ...CentreData,
                    ]}
                    selectedValue={payload?.CentreID}
                    name="CentreID"
                    lable="Centre"
                    id="Centre"
                    onChange={handleChange}
                  /> */}
                </div>
              </div>

              <div className="col-sm-2">
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
                  value={payload?.RateTypeID}
                  onChange={handleSearchSelectChange}
                />
                {/* <SelectBox
                  options={[{ label: "All RateType", value: "" }, ...RateTypes]}
                  name="RateTypeID"
                  lable="RateType"
                  id="RateType"
                  onChange={handleChange}
                  selectedValue={payload?.RateTypeID}
                /> */}
              </div>
              <div className="col-sm-2 ">
                <div>
                  <SelectBox
                    options={[
                      { label: "Select Department", value: "" },
                      ...department,
                    ]}
                    lable="Department"
                    id="Department"
                    selectedValue={payload?.DepartmentID}
                    name="DepartmentID"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="col-sm-2">
                <div>
                  <ReactSelect
                    dynamicOptions={TestSuggestion}
                    value={payload?.TestName}
                    name="TestName"
                    placeholderName="Select Test"
                    onChange={(name, e) => {
                      // console.log(e);
                      setPayload({
                        ...payload,
                        [name]: e?.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-sm-2">
                <SelectBox
                  options={SampleStatus}
                  onChange={handleSearchChange}
                  id="SampleStatus"
                  name="SampleStatus"
                  lable="SampleStatus"
                  selectedValue={payload?.SampleStatus}
                />
              </div>
            </div>
            <div className="row px-2 mt-1 mb-1">
              <div className="col-sm-2 ">
                <DatePicker
                  name="FromDate"
                  id="FromDate"
                  className="custom-calendar"
                  lable="FromDate"
                  value={payload?.FromDate}
                  onChange={dateSelect}
                  maxDate={new Date(payload?.ToDate)}
                />
              </div>
              <div className="col-sm-1">
                <CustomTimePicker
                  name="FromTime"
                  placeholder="FromTime"
                  value={payload?.FromTime}
                  id="FromTime"
                  lable="FromTime"
                  onChange={handleTime}
                />
              </div>
              <div className="col-sm-2 ">
                <div>
                  <DatePicker
                    className="custom-calendar"
                    name="ToDate"
                    value={payload?.ToDate}
                    onChange={dateSelect}
                    placeholder=" "
                    id="ToDate"
                    lable="ToDate"
                    // maxDate={new Date()}
                    minDate={new Date(payload?.FromDate)}
                  />
                </div>
              </div>
              <div className="col-sm-1">
                <CustomTimePicker
                  name="ToTime"
                  placeholder="ToTime"
                  value={payload?.ToTime}
                  id="ToTime"
                  lable="ToTime"
                  onChange={handleTime}
                />
              </div>
              <div className="col-sm-1">
                <button
                  href="javascript:void(0)"
                  onClick={() => TableData(payload?.SampleStatus)}
                  className="btn btn-primary btn-sm w-100"
                >
                  <div className="">{t("Search")}</div>
                </button>
              </div>
            </div>
          </Accordion>
          <Accordion title={t("Search Data")} defaultValue={true}>
            {loading ? (
              <Loading />
            ) : (
              <RECultureTable
                redata={reData}
                GetResultEntryCulture={GetResultEntryCulture}
                setShowMH={setShowMH}
                setShowUD={setShowUD}
              />
            )}
          </Accordion>
        </>
      ) : (
        <>
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
              formData={payload}
              isPrintHeader={show5?.Printwithhead}
              blockUpload={show5.blockUpload}
              LedgerTransactionIDHash={
                ResultTestData[0]?.LedgertransactionIDHash
              }
            />
          )}
          {show2.moadal && (
            <TemplateMasterModal
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
          {showPH && (
            <PatientDetailModal
              showPH={showPH}
              setShowPH={(data) => {
                setShowPH(false);
                // console.log("object");
              }}
              ResultData={ResultData}
            />
          )}
          <>
            <>
              <Accordion
                name={t("Patient Culture Entry")}
                defaultValue={true}
                isBreadcrumb={true}
              >
                <div
                  className={`p-dialog-header custom-box-body mb-3 mt-3`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignContent: "flex-start",
                    justifyContent: "flex-start",
                  }}
                >
                  <div className="custom-row">
                    <div className="custom-col custom-col-visit">
                      <span className="fa fa-folder custom-text">
                        &nbsp; <span>{ResultData[0]?.LedgerTransactionNo}</span>
                      </span>
                    </div>
                    <div className="custom-col custom-col-visit">
                      <span className="fa fa-user-md custom-text">
                        &nbsp; <span>{ResultData[0]?.PName}</span>
                      </span>
                    </div>
                    <div className="custom-col custom-col-visit">
                      <span className="fa fa-book custom-text">
                        &nbsp; <span>{ResultData[0]?.PatientCode}</span>
                      </span>
                    </div>
                    <div className="custom-col custom-col-visit">
                      <span className="fa fa-calendar custom-text">
                        &nbsp;<span> {ResultData[0]?.Age}</span>
                      </span>
                    </div>
                    <div className="custom-col custom-col-visit">
                      <span className="fa fa-book custom-text">
                        &nbsp;<span> {ResultData[0]?.Gender}</span>
                      </span>
                    </div>
                    <div className="custom-col custom-col-visit">
                      <span className="fa fa-h-square custom-text">
                        &nbsp; <span>{ResultData[0]?.Centre}</span>
                      </span>
                    </div>
                    <div className="custom-col custom-col-visit">
                      <span className="fa fa-user-md custom-text">
                        &nbsp; <span>{ResultData[0]?.ReferDoctor}</span>
                      </span>
                    </div>
                    <div
                      className="custom-col custom-col-visit"
                      style={{ width: "300px" }}
                    >
                      <span
                        className="fa fa-calendar custom-text"
                        style={{ width: "150px" }}
                      >
                        &nbsp; <span>{dateConfig(ResultData[0]?.RegDate)}</span>
                      </span>
                    </div>
                    <div className="custom-col custom-col-visit">
                      <span className="fa fa-plus-square custom-text">
                        &nbsp; <span>{ResultData[0]?.RateType}</span>
                      </span>
                    </div>
                  </div>
                  <div className="custom-row">
                    <div
                      className="d-flex my"
                      style={{ margin: 0, padding: 0 }}
                    >
                      {ResultTestData?.map((data, index) => (
                        <div
                          key={index}
                          className={`round font-weight-bold mx-2 my-2 px-3 py-2 Status-${data.Status}`}
                        >
                          <span> {data?.PackageName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col-md-5 col-12">
                    <div className="row  px-2 mt-1 mb-1s">
                      <label
                        className="box-title col-md-3"
                        htmlFor="Report Type"
                      >
                        {t("Report Type")} :
                      </label>
                      <div className="col-md-3">
                        <SelectBox
                          className="form-control input-sm"
                          options={ReportTypePreliminary}
                          selectedValue={entryPayload?.ReportNumber}
                          onChange={(e) => {
                            GetResultEntryCulture(
                              {
                                LedgerTransactionID:
                                  reData[ResultData[0]?.currentIndex]
                                    ?.LedgertransactionId,
                                TestID:
                                  reData[ResultData[0]?.currentIndex]?.TestID,

                                DepartmentID:
                                  reData[ResultData[0]?.currentIndex]
                                    ?.DepartmentId,
                                VisitNo:
                                  reData[ResultData[0]?.currentIndex]
                                    ?.LedgerTransactionNo,
                                BarcodeNo:
                                  reData[ResultData[0]?.currentIndex]
                                    ?.BarcodeNo,
                              },

                              ResultData[0]?.currentIndex,
                              false,
                              e?.target?.value
                            );

                            setEntryShow(false);
                            setEntry([]);
                          }}
                        />
                      </div>
                    </div>
                    <div className="p-2">
                      <ResultEntryTableCustom>
                        <thead className="cf">
                          <tr>
                            <th>{t("Test Name")}</th>
                            <th>{t("Value")}</th>
                            <th>{t("Comment")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ResultTestData?.map((Hdata, Hindex) => (
                            <>
                              <tr
                                key={Hindex}
                                style={{ backgroundColor: "lightgrey" }}
                              >
                                <td data-title={t("Test Name")}>
                                  <span
                                    className="invName"
                                    style={{ fontWeight: "bold" }}
                                  >
                                    {Hdata?.PackageName}
                                  </span>
                                </td>
                                {(Hdata?.Status === 3 ||
                                  Hdata?.Status === 10 ||
                                  Hdata?.Status === 14) && (
                                  <td>
                                    <div className="d-flex justify-content-end">
                                      {/* Add Report */}
                                      {/* <div
                                        className="m-0 p-0"
                                        onClick={() => {
                                          setShow5({
                                            modal: true,
                                            data: Hdata?.TestIDHash,
                                            pageName: "Add Report",
                                            Printwithhead: Hdata?.Printwithhead,
                                            blockUpload:
                                              Hdata?.Status === 5 ||
                                              Hdata?.Status === 6
                                                ? true
                                                : false,
                                          });
                                        }}
                                      >
                                        <Tooltip label="Add Report">
                                          <i
                                            className="bi bi-file-earmark-pdf m-0 text-icon-size ml-1 mr-1"
                                            style={{ color: "red" }}
                                            disabled={!Hdata?.isChecked}
                                          ></i>
                                        </Tooltip>
                                      </div> */}

                                      {/* Add Attachment */}
                                      {/* <div
                                        className="m-0 p-0"
                                        onClick={() => {
                                          setShow5({
                                            modal: true,
                                            data: Hdata?.TestIDHash,
                                            pageName: "Add Attachment",
                                            blockUpload:
                                              Hdata?.Status === 5 ||
                                              Hdata?.Status === 6
                                                ? true
                                                : false,
                                          });
                                        }}
                                      >
                                        <Tooltip label="Add Attachment">
                                          <i
                                            className="bi bi-file-earmark-image m-0 text-icon-size ml-1 mr-1"
                                            style={{ color: "#07b023" }}
                                            disabled={!Hdata?.isChecked}
                                          ></i>
                                        </Tooltip>
                                      </div> */}
                                    </div>
                                  </td>
                                )}
                                {(Hdata?.Status === 5 || Hdata?.Status === 6) &&
                                  buttonsData?.map(
                                    (ele, index) =>
                                      ele?.AccessBy === "Not Approved" && (
                                        <>
                                          <td colSpan={2}>
                                            <div className=" d-flex">
                                              {/* <div
                                                className="m-0 p-0"
                                                onClick={() => {
                                                  setShow5({
                                                    modal: true,
                                                    data: Hdata?.TestIDHash,
                                                    pageName: "Add Report",
                                                    Printwithhead:
                                                      Hdata?.Printwithhead,
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
                                              </div> */}
                                              {/* <div
                                                className=" m-0 p-0 d-none"
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
                                              </div> */}

                                              <div>
                                                <Input
                                                  className="required form-control input-sm mr-3"
                                                  placeholder={
                                                    "Not Approved Remark"
                                                  }
                                                  value={
                                                    Hdata?.NotApproveRemark ??
                                                    ""
                                                  }
                                                  name="NotApproveRemark"
                                                  id="NotApproveRemark"
                                                  onChange={(e) =>
                                                    handleNotApproveRemark(
                                                      e,
                                                      Hdata
                                                    )
                                                  }
                                                />{" "}
                                              </div>
                                              <div
                                              className="ml-3"
                                                onClick={() => {
                                                  if (Hdata?.NotApproveRemark) {
                                                    handleResultSubmit(
                                                      ele?.AccessBy,
                                                      Hdata
                                                    );
                                                  } else {
                                                    toast.error(
                                                      "Not Approve Remark is Required"
                                                    );
                                                  }
                                                }}
                                              >
                                                {" "}
                                                <Tooltip label={ele?.AccessBy}>
                                                  <i
                                                    className="bi bi-x-octagon text-icon-size m-0 ml-2"
                                                    style={{ color: "#b06605" }}
                                                    key={index}
                                                  ></i>
                                                </Tooltip>
                                              </div>
                                            </div>
                                          </td>
                                        </>
                                      )
                                  )}
                              </tr>
                              {ResultData?.map((datanew, index) => (
                                <>
                                  {Hdata.TestID === datanew.TestID && (
                                    <tr key={index}>
                                      <td
                                        data-title={t("Test Name")}
                                        //   className={`Status-${datanew?.Status}`}
                                      >
                                        <span
                                          style={{
                                            cursor: "pointer",
                                            // //   color:
                                            //     datanew?.Status != 5
                                            //       ? "black"
                                            //       : "white",
                                          }}
                                          data-toggle="tooltip"
                                          data-placement="top"
                                        >
                                          {datanew?.TestName}
                                        </span>
                                      </td>
                                      {datanew?.Header === 0 &&
                                      datanew?.TestName != "Organism" &&
                                      datanew?.TestName != "Comments" ? (
                                        <>
                                          {["2", "3"].includes(
                                            datanew?.ReportType
                                          ) ? (
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
                                                className="fa fa-plus-circle"
                                                aria-hidden="true"
                                                style={{ color: "#605ca8" }}
                                              ></i>
                                            </td>
                                          ) : datanew?.dlcCheck === 1 ? (
                                            datanew?.IsHelpMenu === 0 ? (
                                              <td data-title={t("Value")}>
                                                <input
                                                  type="text"
                                                  className="form-control input-sm "
                                                  name="Value"
                                                  autoComplete="off"
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
                                                        index ===
                                                        ResultData.length - 1
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
                                                  className="form-control input-sm "
                                                  name="Value"
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
                                                        index ===
                                                        ResultData.length - 1
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
                                                className="form-control input-sm "
                                                name="Value"
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
                                                      index ===
                                                      ResultData.length - 1
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
                                              <div
                                                style={{
                                                  position: "relative",
                                                }}
                                              >
                                                <input
                                                  type="text"
                                                  className="form-control input-sm "
                                                  name="Value"
                                                  autoComplete="off"
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
                                                        index ===
                                                        ResultData.length - 1
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
                                                      setHiddenDropDownHelpMenu(
                                                        false
                                                      );
                                                    }, [1000])
                                                  }
                                                />

                                                {helpmenu.length > 0 &&
                                                  helpmenu[0]?.Value ==
                                                    datanew?.labObservationID &&
                                                  HiddenDropDownHelpMenu && (
                                                    <ul
                                                      className="suggestion-data"
                                                      style={{
                                                        width: "100%",
                                                        right: "0px",
                                                        border:
                                                          "1px solid #dddfeb",
                                                      }}
                                                    >
                                                      {helpmenu.map(
                                                        (
                                                          data,
                                                          helpmenuindex
                                                        ) => (
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
                                          {["2", "3"].includes(
                                            datanew?.ReportType
                                          ) ? (
                                            <td></td>
                                          ) : (
                                            <td
                                              style={{
                                                position: "relative",
                                              }}
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
                                                  <i
                                                    className="fa fa-plus-circle"
                                                    aria-hidden="true"
                                                    style={{
                                                      color: "#605ca8",
                                                    }}
                                                  ></i>
                                                </div>
                                              </div>
                                            </td>
                                          )}
                                        </>
                                      ) : datanew?.TestName == "Organism" ? (
                                        <>
                                          <td data-title="Organism">
                                            <Link
                                              onClick={() => {
                                                window.scroll(0, 0);
                                              }}
                                            >
                                              <i
                                                className="mx-2 fa fa-edit"
                                                style={{
                                                  color: "#605ca8",
                                                  cursor: "pointer",
                                                  fontSize: "17px",
                                                }}
                                                title="Click to add organism"
                                                onClick={() =>
                                                  setEntryShow(true)
                                                }
                                              ></i>
                                            </Link>
                                          </td>
                                          <td>
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
                                                <i
                                                  className="fa fa-plus-circle"
                                                  aria-hidden="true"
                                                  style={{
                                                    color: "#605ca8",
                                                  }}
                                                ></i>
                                              </div>
                                            </div>
                                          </td>
                                        </>
                                      ) : datanew?.TestName == "Comments" ? (
                                        <tr>
                                          <td data-title={t("Comments")}></td>
                                          <td colSpan="1">
                                            <button
                                              className="btn btn-primary btn-sm"
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
                                              {t("Add Comment")}
                                            </button>
                                          </td>
                                        </tr>
                                      ) : (
                                        <tr></tr>
                                      )}
                                    </tr>
                                  )}
                                </>
                              ))}
                            </>
                          ))}
                        </tbody>
                      </ResultEntryTableCustom>
                    </div>
                  </div>
                  {}

                  {entryShow && (
                    <div className="col-md-7 col-12">
                      {
                        <div className="p-2">
                          <div className="box-header with-border d-flex">
                            <div className="col-sm-8">
                              <label className="box-title">
                                {t("Antibiotic Entry")}
                              </label>
                            </div>
                          </div>

                          <>
                            <div
                              style={{
                                maxHeight: "400px",
                                overflowY: "auto",
                              }}
                            >
                              <Tables>
                                <thead
                                  className="cf"
                                  style={{
                                    position: "sticky",
                                    zIndex: 99,
                                    top: 0,
                                  }}
                                >
                                  <tr>
                                    {[
                                      "#",
                                      "Antibiotic Entry",
                                      "Interpretation",
                                      "MIC",
                                    ].map((ele, index) => (
                                      <th key={index}>{t(ele)}</th>
                                    ))}
                                  </tr>
                                </thead>

                                <tbody>
                                  {
                                    <>
                                      {entry.map((subArray, outerIndex) => (
                                        <>
                                          <tr
                                            style={{
                                              background: "#fafa99",
                                            }}
                                          >
                                            <td colSpan={4}>
                                              <div className="row p-1">
                                                <label className="col-sm-6">
                                                  {
                                                    subArray[0]
                                                      ?.OrganismNameDisplayname
                                                  }
                                                </label>
                                                <div className="col-sm-2">
                                                  <button
                                                    className="mx-2  btn btn-danger btn-sm"
                                                    onClick={() =>
                                                      removeArrayAtIndex(
                                                        outerIndex
                                                      )
                                                    }
                                                  >
                                                    {t("Remove")}
                                                  </button>
                                                </div>
                                              </div>
                                              <div className="row">
                                                <label className="col-sm-3">
                                                  {t("Organism Display Name")} :
                                                </label>
                                                <div className="col-sm-9">
                                                  <Input
                                                    className="select-input-box form-control input-sm"
                                                    type="text"
                                                    value={
                                                      subArray[0]
                                                        ?.OrganismNameDisplayname
                                                    }
                                                  />
                                                </div>
                                              </div>
                                              <div className="row">
                                                <div className="col-sm-4">
                                                  <Input
                                                    className="select-input-box form-control input-sm"
                                                    value={
                                                      entry[outerIndex][0]
                                                        ?.colonycount
                                                    }
                                                    onChange={(e) =>
                                                      setValuesForOuterIndex(
                                                        outerIndex,
                                                        "colonycount",
                                                        e?.target?.value
                                                      )
                                                    }
                                                    type="text"
                                                    placeholder="Colony Count"
                                                  />
                                                </div>
                                                <div className="col-sm-8">
                                                  <Input
                                                    className="select-input-box form-control input-sm"
                                                    onChange={(e) =>
                                                      setValuesForOuterIndex(
                                                        outerIndex,
                                                        "colonycountcomment",
                                                        e?.target?.value
                                                      )
                                                    }
                                                    value={
                                                      entry[outerIndex][0]
                                                        ?.colonycountcomment
                                                    }
                                                    type="text"
                                                    placeholder="Comment"
                                                  />
                                                </div>
                                              </div>
                                            </td>
                                          </tr>
                                          {subArray.map((item, innerIndex) => (
                                            <>
                                              <tr>
                                                <td
                                                  className="text-center"
                                                  style={{ width: "30px" }}
                                                >
                                                  {innerIndex + 1}
                                                  &nbsp;&nbsp;&nbsp;
                                                  {item?.isInput && (
                                                    <button
                                                      type="button"
                                                      className="btn btn-sm btn-danger"
                                                      onClick={() =>
                                                        handleFilterOrg(
                                                          outerIndex,
                                                          innerIndex
                                                        )
                                                      }
                                                      style={{
                                                        backgroundColor: "red",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "2px 7px",
                                                        fontSize: "12px",
                                                        cursor: "pointer",
                                                        borderRadius: "4px",
                                                      }}
                                                    >
                                                      X
                                                    </button>
                                                  )}
                                                </td>
                                                <td>
                                                  {item?.isInput ? (
                                                    <Input
                                                      className="select-input-box form-control input-sm"
                                                      value={item?.name}
                                                      onChange={(e) =>
                                                        handleSensitivity(
                                                          e?.target?.value,
                                                          outerIndex,
                                                          innerIndex,
                                                          "name"
                                                        )
                                                      }
                                                    />
                                                  ) : (
                                                    item?.name
                                                  )}
                                                </td>

                                                <td colSpan={2}>
                                                  <div className="row">
                                                    <div className="col-sm-10">
                                                      <div
                                                        className="btn-group btn-group-toggle p-1"
                                                        data-toggle="buttons"
                                                      >
                                                        {Sensitivity.map(
                                                          (option, index) => (
                                                            <>
                                                              <input
                                                                type="checkbox"
                                                                name={`sensitivity-${outerIndex}-${innerIndex}`}
                                                                value={
                                                                  option.value
                                                                }
                                                                checked={
                                                                  entry[
                                                                    outerIndex
                                                                  ][innerIndex][
                                                                    "AntiBioticInterpreatation"
                                                                  ] ===
                                                                  option.value
                                                                }
                                                                onChange={(
                                                                  e
                                                                ) => {
                                                                  handleSensitivity(
                                                                    e?.target
                                                                      ?.checked
                                                                      ? e.target
                                                                          ?.value
                                                                      : "",
                                                                    outerIndex,
                                                                    innerIndex,
                                                                    "AntiBioticInterpreatation"
                                                                  );
                                                                }}
                                                                style={{
                                                                  appearance:
                                                                    "none",
                                                                  WebkitAppearance:
                                                                    "none",
                                                                  MozAppearance:
                                                                    "none",
                                                                  outline:
                                                                    "none",
                                                                  border:
                                                                    "1px solid #ccc",
                                                                  backgroundColor:
                                                                    entry[
                                                                      outerIndex
                                                                    ][
                                                                      innerIndex
                                                                    ][
                                                                      "AntiBioticInterpreatation"
                                                                    ] ===
                                                                    option.value
                                                                      ? "#007bff"
                                                                      : "#fff",
                                                                  color:
                                                                    entry[
                                                                      outerIndex
                                                                    ][
                                                                      innerIndex
                                                                    ][
                                                                      "AntiBioticInterpreatation"
                                                                    ] ===
                                                                    option.value
                                                                      ? "#fff"
                                                                      : "#000",
                                                                  padding:
                                                                    "6px 12px",
                                                                  cursor:
                                                                    "pointer",
                                                                  borderRadius:
                                                                    "5px",
                                                                  marginRight:
                                                                    "5px",
                                                                }}
                                                              />
                                                              <span
                                                                style={{
                                                                  textAlign:
                                                                    "center",
                                                                  marginRight:
                                                                    "3px",
                                                                }}
                                                              >
                                                                {" "}
                                                                {
                                                                  option.label
                                                                }{" "}
                                                              </span>
                                                            </>
                                                          )
                                                        )}
                                                      </div>
                                                    </div>
                                                    <div className="col-sm-2">
                                                      <input
                                                        onChange={(e) =>
                                                          handleSensitivity(
                                                            e?.target?.value,
                                                            outerIndex,
                                                            innerIndex,
                                                            "mic"
                                                          )
                                                        }
                                                        value={item?.mic}
                                                        className="select-input-box form-control input-sm"
                                                      />
                                                    </div>
                                                  </div>
                                                </td>
                                              </tr>
                                            </>
                                          ))}
                                          <tr>
                                            <button
                                              className="mt-1 mb-1 ml-1 btn btn-primary btn-sm"
                                              onClick={() =>
                                                addItemAtIndex(outerIndex)
                                              }
                                            >
                                              {t("Add Row")}
                                            </button>
                                          </tr>
                                        </>
                                      ))}
                                    </>
                                  }
                                </tbody>
                              </Tables>
                            </div>
                            <div
                              className="row mt-2"
                              style={{
                                background: "lightblue",
                                border: "1px solid lightblue",
                              }}
                            >
                              <h5
                                style={{ fontWeight: "bold" }}
                                className="col-sm-4"
                              >
                                {t("Select Organism")} :
                              </h5>
                              <div
                                className="col-sm-8"
                                style={{
                                  marginTop: "0px",
                                  backgroundColor: "white",
                                }}
                              >
                                <ReactSelect
                                  dynamicOptions={bindOrganism}
                                  value={null}
                                  placeholderName="Select Organism"
                                  menuPosition={"fixed"}
                                  maxMenuHeight={250}
                                  onChange={(_, e) =>
                                    getEntryData(
                                      e.value,
                                      e.label,
                                      "",
                                      "",
                                      "",
                                      true
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </>
                        </div>
                      }
                    </div>
                  )}
                </div>
                {loading ? (
                  <Loading />
                ) : (
                  <div className="row  px-2 mt-1 mb-1">
                    <div className="col-sm-2">
                      <DatePicker
                        className="custom-calendar"
                        name="IncubationDate"
                        id="IncubationDate"
                        lable="Incubation Date"
                        minDate={new Date()}
                        value={entryPayload?.IncubationDate}
                        onChange={dateSelect2}
                      />
                    </div>
                    <div className="col-sm-1">
                      <button
                        className={`next roundarrow  mx-2 my-1 ${
                          ResultData[0]?.currentIndex === 0
                            ? "btn-secondary"
                            : "btn-success"
                        }`}
                        onClick={() => {
                          ResultData?.length > 0 &&
                            GetResultEntryCulture(
                              {
                                LedgerTransactionID:
                                  reData[ResultData[0]?.currentIndex - 1]
                                    ?.LedgertransactionId,
                                TestID:
                                  reData[ResultData[0]?.currentIndex - 1]
                                    ?.TestID,

                                DepartmentID:
                                  reData[ResultData[0]?.currentIndex - 1]
                                    ?.DepartmentId,
                                VisitNo:
                                  reData[ResultData[0]?.currentIndex - 1]
                                    ?.LedgerTransactionNo,
                                BarcodeNo:
                                  reData[ResultData[0]?.currentIndex - 1]
                                    ?.BarcodeNo,
                              },

                              ResultData[0]?.currentIndex - 1,
                              false,
                              "Preliminary 1"
                            );
                        }}
                        disabled={
                          ResultData[0]?.currentIndex === 0 ? true : false
                        }
                      >
                        {t("<")}
                      </button>

                      <button
                        className={`next roundarrow  mx-2 my-1 ${
                          ResultData[0]?.currentIndex === reData?.length - 1
                            ? "btn-secondary"
                            : "btn-success"
                        }`}
                        onClick={() => {
                          ResultData?.length > 0 &&
                            GetResultEntryCulture(
                              {
                                LedgerTransactionID:
                                  reData[ResultData[0]?.currentIndex + 1]
                                    ?.LedgertransactionId,
                                TestID:
                                  reData[ResultData[0]?.currentIndex + 1]
                                    ?.TestID,

                                DepartmentID:
                                  reData[ResultData[0]?.currentIndex + 1]
                                    ?.DepartmentId,
                                VisitNo:
                                  reData[ResultData[0]?.currentIndex + 1]
                                    ?.LedgerTransactionNo,
                                BarcodeNo:
                                  reData[ResultData[0]?.currentIndex + 1]
                                    ?.BarcodeNo,
                              },

                              ResultData[0]?.currentIndex + 1,
                              false,
                              "Preliminary 1"
                            );
                        }}
                        disabled={
                          ResultData[0]?.currentIndex === reData?.length - 1
                            ? true
                            : false
                        }
                      >
                        {t(">")}
                      </button>
                    </div>
                    {["", 3, 10, 11, 13, 14, 15, 20, 5, 6, 18].includes(
                      statusValue
                    ) && (
                      <div className="col-sm-1 ">
                        <button
                          className="btn btn-primary  btn-block btn-sm"
                          onClick={() => handleResultSubmit("Save")}
                        >
                          {t("Save")}
                        </button>
                      </div>
                    )}
                    {buttonsData?.some(
                      (ele) => ele?.AccessBy === "Dual Authentication"
                    ) &&
                      checkDualAuthentication && (
                        <div className="col-sm-1 mr-3">
                          {buttonsData
                            ?.filter(
                              (ele) => ele?.AccessBy === "Dual Authentication"
                            )
                            .map((ele, index) => (
                              <button
                                key={index}
                                style={{
                                  color: "white",
                                }}
                                className="btn btn-sm"
                                onClick={() =>
                                  handleResultSubmit(ele?.AccessBy)
                                }
                              >
                                {t("Dual Authentication")}
                              </button>
                            ))}
                        </div>
                      )}
                    <div className="col-sm-1 ">
                      <button
                        className="btn btn-primary btn-sm  btn-block"
                        onClick={() => {
                          setResultData([]);
                          setResultTestData([]);
                          setEntryShow(false);
                          setEntry([]);
                          setEntryPayload({
                            ...entryPayload,
                            ReportNumber: "Preliminary 1",
                            organism: "",
                            ApprovedBy: "",
                            ApprovalName: "",
                          });
                        }}
                      >
                        {t("Main List")}
                      </button>{" "}
                    </div>{" "}
                    <div className="col-sm-2">
                      <SelectBox
                        options={[
                          { label: "Select Doctor", value: "" },
                          ...doctorAdmin,
                        ]}
                        id="ApprovedBy"
                        name="ApprovedBy"
                        selectedValue={entryPayload?.ApprovedBy}
                        onChange={handleDoctorName}
                      ></SelectBox>
                    </div>
                    {PrintReportLoading ? (
                      <Loading />
                    ) : (
                      <div className="col-sm-1 ">
                        <button
                          className="btn btn-success btn-sm  btn-block"
                          type="button"
                          id="btnMainList"
                          onClick={() => handleReport("no", "")}
                        >
                          {t("Preview")}
                        </button>{" "}
                      </div>
                    )}
                    {buttonsData?.map(
                      (ele, index) =>
                        ele?.AccessBy !== "Not Approved" &&
                        ele?.AccessBy !== "Unhold" &&
                        ele?.AccessBy !== "Discount Approval" &&
                        ele?.AccessBy !== "Hold" &&
                        ele?.AccessBy !== "Dual Authentication" && (
                          <div className="col-sm-1 ">
                            <button
                              className="btn btn-success btn-sm  btn-block"
                              type="button"
                              id="btnMainList"
                              key={index}
                              onClick={() => handleResultSubmit(ele?.AccessBy)}
                            >
                              {ele?.AccessBy === "Approved"
                                ? t("Approve")
                                : ele?.AccessBy}
                            </button>{" "}
                          </div>
                        )
                    )}
                    <button
                      className="col-sm-1 btn btn-success  btn-block btn-sm "
                      onClick={() => {
                        setShowPH(true);
                      }}
                    >
                      {t("Patient Details")}
                    </button>
                  </div>
                )}
              </Accordion>
            </>
          </>
        </>
      )}
    </>
  );
};

export default ResultEntryCulture;
