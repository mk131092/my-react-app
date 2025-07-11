import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { useTranslation } from "react-i18next";
import {
  autocompleteOnBlur,
  getTrimmedData,
  number,
  PreventSpecialCharacter,
} from "../../utils/helpers";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import {
  InvestigationsMasterSchema,
  PackageInvestigationsMasterSchema,
  ProfileInvestigationsMasterSchema,
} from "../../utils/Schema";
import Accordion from "@app/components/UI/Accordion";
import SampleRemark from "../utils/SampleRemark";
import Loading from "../../components/loader/Loading";
import Input from "../../components/formComponent/Input";
import { SelectBox } from "../../components/formComponent/SelectBox";
import {
  DataType,
  HistoSeries,
  ReportTypeNew,
  SampleOption,
} from "../../utils/Constants";
import { getDepartment } from "../../utils/NetworkApi/commonApi";
import { SelectBoxWithCheckbox } from "../../components/formComponent/MultiSelectBox";
import ReactSelect from "../../components/formComponent/ReactSelect";
import Tables from "../../components/UI/customTable";

const Investigations = () => {
  const location = useLocation();
  const { state } = location;
  const [dataForUpdate, setDataForUpdate] = useState({
    url1: null,
    url: null,
  });
  const [MapTest, setMapTest] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [SampleType, setSampleType] = useState([]);
  const [LogisticTemp, setLogisticTemp] = useState([]);
  const [SampleTypeID, setSampleTypeID] = useState([]);
  const [RequiredAttachment, setRequiredAttachment] = useState([]);
  const [ConcentForm, setConcentForm] = useState([]);
  const [PNDT, setPNDT] = useState([]);
  const [SampleContainer, setSampleContainer] = useState([]);
  const [BillingCategory, setBillingCategory] = useState([]);
  const [MapTestTableData, setMapTestTableData] = useState([]);
  const [navData, setNavData] = useState({
    InvName: null,
    InvId: null,
    DataType: null,
  });
  const [saved, setSaved] = useState(true);
  const [Gender, setGender] = useState([]);
  const [formData, setFormData] = useState({
    InvestigationID: "",
    ConcentForm: "",
    HistoSeries: "",
    PrintName: "",
    DataType: "Test",
    TestName: "",
    DepartmentID: "",
    TestCode: "",
    ReportType: "",
    isActive: "1",
    FromAge: "0",
    ToAge: "99999",
    SampleOption: "Sample Not Required",
    SampleQty: "",
    SampleRemarks: "",
    BaseRate: "",
    MaxRate: "",
    MicroReportType: "",
    DefaultSampleType: "",
    DefaultSampleTypeId: "",
    Gender: "",
    BillingCategory: "1",
    AutoConsume: "",
    SampleContainer: "",
    LogisticTemp: "",
    IsMultipleDoctor: "",
    PrintCumulative: "",
    Reporting: "",
    PrintSampleName: "",
    Booking: "",
    showPatientReport: "",
    ShowAnalysisReport: "",
    OnlineReport: "",
    AutoSave: "",
    PrintSeparate: "",
    Urgent: "",
    IsOrganism: "",
    IsCultureReport: "",
    IsMic: "",
    IsOutSource: "",
    IsCulture: "",
    IsDLCcheck: "",
    SampleDefined: "",
    SampleTypeId: "",
    RequiredAttachment: "",
    isMandatory: "",
    MethodName: "",
    ShortName: "",
    IsCovid: "",
    PNDT: "",
    StatSample: "",
    IsHisto: 0,
    PricksNotRequired: "",
    DualAuthentication: 0,
    Suffix: "",
    FullCultureReport: 0,
  });
  const [showRemark, setShowRemark] = useState(false);
  const [dropFalse, setDropFalse] = useState(false);
  const [filterInv, setFilterInv] = useState([]);
  const [profileDetail, setProfileDetail] = useState([]);
  const [mouseHover, setMouseHover] = useState({
    index: -1,
    data: [],
  });
  const [indexMatch, setIndexMatch] = useState(0);
  const [checkField, setCheckField] = useState({
    department: false,
    billingCategory: false,
  });

  const fetch = (id) => {
    axiosInstance
      .post("PatientRegistration/GetTestInfo", {
        InvestigationId: id,
      })
      .then((res) => {
        setProfileDetail(res?.data?.message);
      })
      .catch((err) => {
        // console.log(err);
        setProfileDetail([]);
      });
  };
  const { t } = useTranslation();
  const handleSubmitAPI = (values) => {
    setLoad(true);
    handleCheckDuplicate().then((res) => {
      if (res === "TestCode Already Exists.") {
        console.log(res);
        setLoad(false);
      } else {
        axiosInstance
          .post(
            dataForUpdate?.url
              ? dataForUpdate.url
              : state?.url && saved
                ? state.url
                : "Investigations/CreateInvestigation",
            getTrimmedData({
              Observation: MapTestTableData,
              Investigation: [values],
            })
          )
          .then((res) => {
            if (res.data.success) {
              setLoad(false);
              setDataForUpdate({
                url1: null,
                url: null,
              });
              setFormData({
                InvestigationID: "",
                ConcentForm: "",
                HistoSeries: "",
                PrintName: "",
                DataType: "Test",
                TestName: "",
                DepartmentID: "",
                TestCode: "",
                ReportType: "",
                isActive: "1",
                FromAge: "0",
                ToAge: "99999",
                MethodName: "",
                SampleOption: "Sample Not Required",
                SampleQty: "",
                SampleRemarks: "",
                BaseRate: "",
                MaxRate: "",
                MicroReportType: "",
                DefaultSampleType: "",
                DefaultSampleTypeId: "",
                Gender: "",
                BillingCategory: "1",
                AutoConsume: "",
                SampleContainer: "",
                LogisticTemp: "",
                IsMultipleDoctor: "",
                PrintCumulative: "",
                Reporting: "",
                PrintSampleName: "",
                Booking: "",
                showPatientReport: "",
                ShowAnalysisReport: "",
                OnlineReport: "",
                AutoSave: "",
                PrintSeparate: "",
                Urgent: "",
                IsOrganism: "",
                IsCultureReport: "",
                IsMic: "",
                IsOutSource: "",
                IsCulture: "",
                IsDLCcheck: "",
                SampleDefined: "",
                SampleTypeId: "",
                RequiredAttachment: "",
                isMandatory: "",
                ShortName: "",
                IsCovid: "",
                PNDT: "",
                StatSample: "",
                IsHisto: 0,
                PricksNotRequired: "",
                DualAuthentication: 0,
                Suffix: "",
                FullCultureReport: 0,
              });
              setMapTestTableData([]);
              setNavData({
                InvName: null,
                InvId: null,
                DataType: null,
              });
              setSaved(false);
              getInvestigationList();
              toast.success(res.data.message);
            } else {
              toast.error(res?.data?.message);
              setLoad(false);
            }
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Error Occured"
            );
            setLoad(false);
          });
      }
    });
  };

  const { errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: formData,
    enableReinitialize: dataForUpdate?.url ? true : state?.url ? true : true,
    validationSchema:
      formData?.DataType === "Profile"
        ? ProfileInvestigationsMasterSchema
        : formData?.DataType === "Package"
          ? PackageInvestigationsMasterSchema
          : InvestigationsMasterSchema,
    onSubmit: (values) => {
      if (["Profile", "Package"].includes(formData?.DataType)) {
        if (MapTestTableData.length > 0) {
          handleSubmitAPI(values);
        } else {
          toast.error("Please Choose Test");
        }
      } else {
        handleSubmitAPI(values);
      }
    },
  });

  const checkEmpty = (id, state) => {
    const isAvailable = state?.find((ele, _) => {
      return ele?.value == id;
    });

    return isAvailable ? id : "";
  };

  useEffect(() => {
    if (checkField?.department && checkField?.billingCategory) Fetch();
  }, [checkField]);

  const Fetch = (url1) => {
    if (url1 || state?.url1) {
      setEditLoading(true);
      axiosInstance
        .get(url1 ? url1 : state?.url1)
        .then((res) => {
          const data = res.data;
          setFormData({
            ...data?.invDetails,
            DepartmentID: checkEmpty(
              data?.invDetails?.DepartmentID,
              DepartmentData
            ),
            BillingCategory: checkEmpty(
              data?.invDetails?.BillingCategory,
              BillingCategory
            ),
            IsHisto:
              data?.invDetails?.IsHisto == null ? 0 : data?.invDetails?.IsHisto,

            FullCultureReport: 0,
          });

          setMapTestTableData(
            data?.observationData === "" ? [] : data?.observationData
          );
          setEditLoading(false);
        })
        .catch((err) => {
          setEditLoading(false);
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          );
        });
    }
  };
  const handleSearchChangeInv = (e) => {
    const { value } = e?.target;
    setNavData({
      ...navData,
      InvName: value,
    });
    setFilterInv(
      MapTest.filter((item) =>
        item.label.toLowerCase().includes(value.toLowerCase())
      )
    );
    setDropFalse(true);
  };
  console.log(formData);
  const handleListSearch = (data) => {
    if ((navData?.InvName || data) && filterInv?.length > 0) {
      setNavData({
        ...navData,
        InvName: "",
        InvId: "",
        DataType: "",
      });
      setIndexMatch(0);
      setFilterInv([]);
      setDropFalse(false);
      setDataForUpdate({
        ...dataForUpdate,
        url1: `Investigations/EditInvestigation?id=${data?.value}&DataType=${data?.DataType}`,
        url: "Investigations/UpdateInvestigation",
      });
      Fetch(
        `Investigations/EditInvestigation?id=${data?.value}&DataType=${data?.DataType}`
      );
      setSaved(true);
    } else {
      toast.error("Select Any Investigation");
    }
  };
  const handleIndex = (e) => {
    switch (e.which) {
      case 38:
        if (indexMatch !== 0) {
          setIndexMatch(indexMatch - 1);
        } else {
          setIndexMatch(filterInv.length - 1);
        }
        break;
      case 40:
        if (filterInv.length - 1 === indexMatch) {
          setIndexMatch(0);
        } else {
          setIndexMatch(indexMatch + 1);
        }
        break;
      case 13:
        handleListSearch(filterInv[indexMatch]);
        setIndexMatch(0);
        break;
      default:
        break;
    }
  };

  const handleMultiSelect = (select, name) => {
    console.log(select);
    setSampleTypeID(select);
    let val = "";
    for (let i = 0; i < select.length; i++) {
      val = val === "" ? `${select[i].value}` : `${val},${select[i].value}`;
    }
    setFormData({
      ...formData,
      [name]: val,
      DefaultSampleTypeId: select[0]?.value,
      DefaultSampleType: select[0]?.label,
    });
  };
  const handleSelectChange = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    if (name == "DataType") {
      setFormData({
        ...formData,
        InvestigationID: "",
        ConcentForm: "",
        HistoSeries: "",
        PrintName: "",
        DataType: value,
        TestName: "",
        DepartmentID: "",
        TestCode: "",
        ReportType: "",
        isActive: "1",
        FromAge: "0",
        ToAge: "99999",
        MethodName: "",
        SampleType: "",
        SampleOption: "Sample Not Required",
        SampleQty: "",
        SampleRemarks: "",
        BaseRate: "",
        MaxRate: "",
        MicroReportType: "",
        DefaultSampleType: "",
        DefaultSampleTypeId: "",
        Gender: "",
        BillingCategory: "1",
        AutoConsume: "",
        SampleContainer: "",
        LogisticTemp: "",
        IsMultipleDoctor: "",
        PrintCumulative: "",
        Reporting: "",
        PrintSampleName: "",
        Booking: "",
        showPatientReport: "",
        ShowAnalysisReport: "",
        OnlineReport: "",
        AutoSave: "",
        PrintSeparate: "",
        Urgent: "",
        IsOrganism: "",
        IsCultureReport: "",
        IsMic: "",
        IsOutSource: "",
        IsCulture: "",
        IsDLCcheck: "",
        SampleDefined: "",
        SampleTypeId: "",
        RequiredAttachment: "",
        isMandatory: "",
        ShortName: "",
        IsCovid: "",
        Suffix: "",
        FullCultureReport:0
      });
      setMapTestTableData([]);
    } else {
      if (name == "Gender") {
        setFormData({ ...formData, [name]: value, PNDT: "" });
      }
      if (name === "DefaultSampleTypeId") {
        setFormData({ ...formData, [name]: value, DefaultSampleType: label });
      }
      if (name === "SampleOption") {
        setFormData({
          ...formData,
          [name]: value,
          DefaultSampleType: "",
          DefaultSampleTypeId: "",
          SampleTypeId: "",
        });
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }
  };
  const handleProfileChange = (value, label) => {
    const ItemIndex = MapTestTableData?.findIndex((e) => e?.TestId == value);
    if (value != undefined) {
      if (ItemIndex === -1) {
        setMapTestTableData([
          ...MapTestTableData,
          {
            TestId: value,
            TestName: label,
            TestPrefix: "",
            Header: 0,
            Critical: 0,
            AMR: "",
            Reflex: "",
            Comment: 0,
            Bold: 0,
            Underline: 0,
            PrintSeprate: 0,
            HelpValue: 0,
            dlcCheck: 0,
            ShortName: "",
            PrintSequence:
              MapTestTableData.length > 0
                ? Number(
                    MapTestTableData[MapTestTableData.length - 1].PrintSequence
                  ) + Number(1)
                : 1,
          },
        ]);
      } else {
        toast.error("Duplicate Test Found");
      }
    }
  };

  const handleChanges = (e) => {
    const { name, value, checked, type } = e.target;
    if (name === "TestCode") {
      setFormData({
        ...formData,
        [name]: ["TestCode"].includes(name)
          ? PreventSpecialCharacter(value)
            ? value.trim().toUpperCase()
            : formData[name]
          : value.trim().toUpperCase(),
      });
    } else if (name === "IsDLCcheck") {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
      });

      const datas = MapTestTableData?.map((ele) => {
        return {
          ...ele,
          dlcCheck: 0,
        };
      });

      setMapTestTableData(datas);
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
      });
    }
  };

  const getInvestigationList = () => {
    axiosInstance
      .get("Investigations/BindInvestigationList")
      .then((res) => {
        let data = res.data.message;
        setLoading(false);

        let MapTest = data.map((ele) => {
          return {
            value: ele.InvestigationID,
            label: ele.TestName,
            DataType: ele?.DataType,
          };
        });

        setMapTest(MapTest);
      })
      .catch((err) => console.log(err));
  };

  const getLogisticTemp = () => {
    axiosInstance
      .post("Global/GetGlobalData", {
        Type: "LogisticTemperature",
      })
      .then((res) => {
        let data = res.data.message;
        let LogisticTemp = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        return setLogisticTemp(LogisticTemp);
      })
      .catch((err) => console.log(err));
  };
  const getRequiredAttachment = () => {
    axiosInstance
      .post("Global/GetGlobalData", {
        Type: "RequiredAttachment",
      })
      .then((res) => {
        let data = res.data.message;
        let RequiredAttachment = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        return setRequiredAttachment(RequiredAttachment);
      })
      .catch((err) => console.log(err));
  };
  const getConcentForm = () => {
    axiosInstance
      .get("Investigations/BindConcentForm")
      .then((res) => {
        let data = res.data.message;
        let ConcentForm = data.map((ele) => {
          return {
            value: ele.ID,
            label: ele.ConcentFormName,
          };
        });
        return setConcentForm(ConcentForm);
      })
      .catch((err) => console.log(err));
  };
  const getPNDT = () => {
    axiosInstance
      .get("Investigations/BindPNDT")
      .then((res) => {
        let data = res.data.message;
        let ConcentForm = data.map((ele) => {
          return {
            value: ele.ID,
            label: ele?.Pndtname,
          };
        });
        return setPNDT(ConcentForm);
      })
      .catch((err) => console.log(err));
  };

  const getSampleContainer = () => {
    axiosInstance
      .post("Global/GetGlobalData", {
        Type: "SampleContainer",
      })
      .then((res) => {
        let data = res.data.message;
        let SampleContainer = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        return setSampleContainer(SampleContainer);
      })
      .catch((err) => console.log(err));
  };
  const getSampleType = () => {
    axiosInstance
      .get("SampleType/getSampleTypeByInvestigation")
      .then((res) => {
        let data = res.data.message;

        let SampleType = data.map((ele) => {
          return {
            value: ele.id,
            label: ele.SampleName,
          };
        });
        return setSampleType(SampleType);
      })
      .catch((err) => console.log(err));
  };

  const getBillingCategory = () => {
    if (state?.url1) setEditLoading(true);
    axiosInstance
      .get("Investigations/BindBillingCategory")
      .then((res) => {
        let data = res.data.message;
        let BillingCategory = data.map((ele) => {
          return {
            value: ele.BillingCategoryId,
            label: ele.BillingCategoryName,
          };
        });
        getDepartment(
          setDepartmentData,
          "getDepartmentEmployeeMaster",
          false,
          setCheckField
        );
        return setBillingCategory(BillingCategory);
      })
      .catch((err) => {
        getDepartment(
          setDepartmentData,
          "getDepartmentEmployeeMaster",
          false,
          setCheckField
        );
        console.log(err);
      });
  };

  const getDropDownData = (name) => {
    axiosInstance
      .post("Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });

        switch (name) {
          case "Gender":
            const extractedGenders = value
              ?.filter((option) => option?.value != "Other")
              .map((option) => {
                return {
                  value: option?.value,
                  label: option?.label,
                };
              });

            setGender(extractedGenders);
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  const handleCheckDuplicate = () => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post("Investigations/checkDuplicateTestCode", {
          TestCode: formData?.TestCode,
          InvestigationID: formData?.InvestigationID
            ? formData?.InvestigationID
            : "",
        })
        .then((res) => {
          if (res?.data?.message === "TestCode Already Exists.") {
            toast.error(res?.data?.message);
            setFormData({ ...formData, TestCode: "" });
          }
          resolve(res?.data?.message);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setFormData({ ...formData, TestCode: "" });
          resolve(err?.response?.data?.message);
        });
    });
  };

  const handleMapTestChange = (e, index) => {
    const { name, value, checked, type } = e.target;
    const data = [...MapTestTableData];
    data[index][name] = type === "checkbox" ? (checked ? 1 : 0) : value;
    setMapTestTableData(data);
  };

  const handleFilter = (index) => {
    const data = MapTestTableData.filter((ele, i) => index !== i);
    setMapTestTableData(data);
    toast?.success("Removed Successfully");
  };
  const dragItem = useRef();

  const dragStart = (e, position) => {
    dragItem.current = position;
  };
  const dragOverItem = useRef();
  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const drop = (e) => {
    const copyListItems = [...MapTestTableData];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setMapTestTableData(copyListItems);
  };

  const handlePrintSequenceValidtion = (e, index, TestId) => {
    const { value, name } = e.target;
    const data = MapTestTableData.filter((ele) => ele?.TestId !== TestId).map(
      (ele) => ele[name]
    );
    if (data.includes(parseInt(value))) {
      const val = [...MapTestTableData];
      val[index][name] = "";
      setMapTestTableData(val);
      toast.error("Value Already Exists");
    }
  };
  const fetchDid = () => {
    for (let i of DepartmentData) {
      if (
        i.label.toLowerCase() === "packeges" ||
        i.label.toLowerCase() === "packages"
      ) {
        return i.value;
      }
    }
  };

  useEffect(() => {
    getDropDownData("Gender");
    getSampleType();
    getLogisticTemp();
    getRequiredAttachment();
    getConcentForm();
    getPNDT();
    getSampleContainer();
    getBillingCategory();
    getInvestigationList();
  }, []);

  const handleNavSearch = () => {
    if (navData?.InvName == null) {
      toast.error("Firstly Select Any Investigation");
    } else {
      setDataForUpdate({
        ...dataForUpdate,
        url1: `Investigations/EditInvestigation?id=${navData?.InvId}&DataType=${navData?.DataType}`,
        url: "Investigations/UpdateInvestigation",
      });
      Fetch(
        `Investigations/EditInvestigation?id=${navData?.InvId}&DataType=${navData?.DataType}`
      );
    }
  };
  const handleShowRemark = () => {
    setShowRemark(false);
  };
  const handleSaveremark = (payload) => {
    setFormData({ ...formData, SampleRemarks: payload });
    handleShowRemark();
  };
  return (
    <>
      {showRemark && (
        <SampleRemark
          show={showRemark}
          handleShow={handleShowRemark}
          state={formData}
          PageName={formData?.SampleRemarks}
          handleSave={handleSaveremark}
          title={"Sample Remarks"}
        />
      )}

      <>
        <Accordion
          name={t("Investigations")}
          defaultValue={true}
          isBreadcrumb={true}
        >
          <div className="row pt-2 pl-2 pr-2">
            <div className="col-sm-6">
              <Input
                autoComplete="off"
                placeholder=" "
                lable="Search Any Test For Update"
                id="Search Any Test For Update"
                name="InvName"
                type="text"
                value={navData?.InvName}
                onChange={handleSearchChangeInv}
                onKeyDown={handleIndex}
                onBlur={(e) => {
                  autocompleteOnBlur(setFilterInv);
                  setTimeout(() => {
                    const data = filterInv.filter(
                      (ele) => ele?.label === e.target.value
                    );
                    if (data.length === 0) {
                      setNavData({
                        ...navData,
                        InvName: "",
                        InvId: "",
                        DataType: "",
                      });
                    }
                  }, 500);
                }}
              />
              {dropFalse && filterInv.length > 0 && (
                <ul className="suggestion-data" style={{ zIndex: 99 }}>
                  {filterInv.map((data, index) => (
                    <li
                      onClick={() => handleListSearch(data)}
                      className={`${index === indexMatch && "matchIndex"}`}
                      key={index}
                    >
                      {data?.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="row pt-1 pl-2 pr-2">
            <div className="col-sm-2 ">
              <SelectBox
                onChange={handleSelectChange}
                selectedValue={formData?.DataType}
                options={DataType.filter((ele) => ele.value !== "")}
                id="DataType"
                lable="DataType"
                name="DataType"
                isDisabled={
                  (state?.url1 && saved) || dataForUpdate?.url1 ? true : false
                }
              />
            </div>
            <div className="col-sm-2">
              <Input
                className="required-fields"
                placeholder=" "
                lable="Test Code"
                id="TestCode"
                value={formData?.TestCode}
                type="text"
                onChange={handleChanges}
                name="TestCode"
                onBlur={handleCheckDuplicate}
                max={10}
                required
              />
              {errors?.TestCode && touched?.TestCode && (
                <span className="error-message">{errors?.TestCode}</span>
              )}
            </div>
            <div className="col-sm-2">
              <Input
                className="required-fields"
                placeholder=" "
                lable="Test Name"
                id="Test Name"
                value={formData?.TestName}
                onChange={handleChanges}
                name="TestName"
                type="text"
                max={100}
                onBlur={handleBlur}
                required
              />
              {errors?.TestName && touched?.TestName && (
                <span className="error-message">{errors?.TestName}</span>
              )}
            </div>
            <div className="col-sm-2">
              <Input
                placeholder=" "
                lable="ShortName"
                id="ShortName"
                value={formData?.ShortName}
                onChange={handleChanges}
                name="ShortName"
                type="text"
                max={100}
                onBlur={handleBlur}
                required
              />
              {errors?.ShortName && touched?.ShortName && (
                <span className="error-message">{errors?.ShortName}</span>
              )}
            </div>
            <div className="col-sm-2">
              <Input
                lable="Lab Report"
                id="Lab Report"
                placeholder=" "
                value={formData?.PrintName}
                onChange={handleChanges}
                name="PrintName"
                type="text"
                max={100}
                onBlur={handleBlur}
                disabled={formData?.DataType == "Package" ? true : false}
                required
              />
              {errors?.PrintName && touched?.PrintName && (
                <span className="error-message">{errors?.PrintName}</span>
              )}
            </div>
            <div className="col-sm-2">
              <SelectBox
                className="required-fields"
                options={[
                  { label: "Select Department", value: "" },
                  ...DepartmentData,
                ]}
                id="Department"
                lable="Department"
                selectedValue={formData?.DepartmentID}
                onChange={handleSelectChange}
                name="DepartmentID"
              />
              {errors?.DepartmentID && touched?.DepartmentID && (
                <span className="error-message">{errors?.DepartmentID}</span>
              )}
            </div>
          </div>
          <div className="row pt-1 pl-2 pr-2">
            <div className="col-sm-2">
              <SelectBox
                className="required-fields"
                options={ReportTypeNew}
                selectedValue={formData?.ReportType}
                name="ReportType"
                id="ReportType"
                lable="Report Type"
                isDisabled={formData?.DataType === "Package" ? true : false}
                onChange={handleSelectChange}
              />
              {errors?.ReportType && touched?.ReportType && (
                <span className="error-message">{errors?.ReportType}</span>
              )}
            </div>
            <div className="col-sm-2">
              <SelectBox
                className="required-fields"
                options={[
                  { label: "Select...", value: "" },
                  ...SampleContainer,
                ]}
                selectedValue={formData?.SampleContainer}
                name="SampleContainer"
                id="SampleContainer"
                lable="Sample Container"
                isDisabled={formData?.DataType === "Package" ? true : false}
                onChange={handleSelectChange}
              />
              {errors?.SampleContainer && touched?.SampleContainer && (
                <span className="error-message">{errors?.SampleContainer}</span>
              )}
            </div>
            <div className="col-sm-2">
              <SelectBox
                className="required-fields"
                options={[{ label: "Gender...", value: "" }, ...Gender]}
                id="Gender"
                lable="Gender"
                selectedValue={formData?.Gender}
                onChange={handleSelectChange}
                name="Gender"
              />
              {errors?.Gender && touched?.Gender && (
                <span className="error-message">{errors?.Gender}</span>
              )}
            </div>
            <div className="col-sm-2">
              <Input
                lable="From Age(Days)"
                id="From Age"
                placeholder=" "
                onChange={handleChanges}
                value={formData?.FromAge}
                name="FromAge"
                onInput={(e) => number(e, 5)}
                type="number"
                onBlur={handleBlur}
                required
              />
              {errors?.FromAge && touched?.FromAge && (
                <span className="error-message">{errors?.FromAge}</span>
              )}
            </div>
            <div className="col-sm-2">
              <Input
                lable="ToAge(Days)"
                id="ToAge"
                placeholder=" "
                onChange={handleChanges}
                value={formData?.ToAge}
                name="ToAge"
                onInput={(e) => number(e, 5)}
                type="number"
                onBlur={handleBlur}
                required
              />
              {errors?.ToAge && touched?.ToAge && (
                <span className="error-message">{errors?.ToAge}</span>
              )}
            </div>
            <div className="col-sm-2">
              <SelectBox
                id="BillingCategory"
                lable="BillingCategory"
                options={BillingCategory}
                name="BillingCategory"
                selectedValue={formData?.BillingCategory}
                onChange={handleSelectChange}
              />
            </div>
          </div>
          <div className="row pt-1 pl-2 pr-2">
            <div className="col-sm-2">
              <SelectBox
                selectedValue={formData?.SampleOption}
                options={SampleOption}
                name="SampleOption"
                id="SampleOption"
                lable="SampleOption"
                isDisabled={formData?.DataType === "Package" ? true : false}
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-sm-2">
              <Input
                lable="SampleQty"
                id="SampleQty"
                placeholder=" "
                onChange={handleChanges}
                value={formData?.SampleQty}
                name="SampleQty"
                onBlur={handleBlur}
                disabled={formData?.DataType == "Package" ? true : false}
                type="number"
                onInput={(e) => number(e, 10)}
                required
              />
            </div>
            <div className="col-sm-2">
              <button
                className="btn btn-primary btn-block btn-sm"
                type="button"
                onClick={() => {
                  setShowRemark(true);
                }}
              >
                {t("Sample Remarks")}
                <i className="fa fa-paperclip fa-sm pl-2"></i>
              </button>
            </div>
            <div className="col-sm-2">
              <SelectBox
                options={[{ label: "Select", value: "" }, ...LogisticTemp]}
                selectedValue={formData?.LogisticTemp}
                onChange={handleSelectChange}
                name="LogisticTemp"
                id="LogisticTemp"
                lable="LogisticTemp"
                isDisabled={formData?.DataType === "Package" ? true : false}
              />
            </div>
            <div className="col-sm-2">
              <SelectBoxWithCheckbox
                options={SampleType}
                name="SampleTypeId"
                className="required-fields"
                selectedValue={formData?.SampleTypeId}
                value={formData?.SampleTypeId}
                onChange={handleMultiSelect}
                lable="SampleType"
                placeholder=" "
                id="SampleType"
                depends={setSampleTypeID}
                isDisabled={
                  formData?.DataType === "Package" ||
                  formData?.SampleOption === "Sample Not Required"
                    ? true
                    : false
                }
              />
              {errors?.SampleTypeId && touched?.SampleTypeId && (
                <span className="error-message">{errors?.SampleTypeId}</span>
              )}
            </div>
            <div className="col-sm-2">
              <SelectBox
                selectedValue={formData?.DefaultSampleTypeId}
                options={[{ label: "Select", value: "" }, ...SampleTypeID]}
                id="DefaultSampleType"
                lable="DefaultSampleType"
                onChange={handleSelectChange}
                name="DefaultSampleTypeId"
                isDisabled={
                  formData?.DataType === "Package" ||
                  formData?.SampleOption === "Sample Not Required"
                    ? true
                    : false
                }
              />
            </div>{" "}
            {/* <div className="col-sm-2">
                <SelectBox
                  options={[{ label: "Select", value: "" }, ...HistoSeries]}
                  selectedValue={formData?.HistoSeries}
                  onChange={handleSelectChange}
                  name="HistoSeries"
                  id="HistoSeries"
                  lable="HistoSeries"
                  isDisabled={
                    formData?.DataType === "Package" ||
                    formData?.DataType === "Profile"
                      ? true
                      : false
                  }
                />
              </div> */}
          </div>
          <div className="row pt-1 pl-2 pr-2">
            <div className="col-sm-2">
              <SelectBox
                options={[{ label: "Select", value: "" }, ...ConcentForm]}
                id="ConcentForm"
                lable="ConcentForm"
                selectedValue={formData?.ConcentForm}
                onChange={handleSelectChange}
                isDisabled={formData?.DataType === "Package" ? true : false}
                name="ConcentForm"
              />
            </div>
            <div className="col-sm-2">
              <Input
                className="required-fields"
                lable="Base Rate"
                id="BaseRate"
                placeholder=" "
                onChange={handleChanges}
                value={formData?.BaseRate}
                name="BaseRate"
                type="number"
                onBlur={handleBlur}
                onInput={(e) => number(e, 10)}
                required
              />
              {errors?.BaseRate && touched?.BaseRate && (
                <span className="error-message">{errors?.BaseRate}</span>
              )}
            </div>
            <div className="col-sm-2">
              <Input
                className="required-fields"
                lable="Max Rate"
                id="MaxRate"
                placeholder=" "
                onChange={handleChanges}
                value={formData?.MaxRate}
                name="MaxRate"
                type="number"
                onBlur={handleBlur}
                onInput={(e) => number(e, 10)}
                required
              />
              {errors?.MaxRate && touched?.MaxRate && (
                <span className="error-message">{errors?.MaxRate}</span>
              )}
            </div>
            <div className="col-sm-2">
              <SelectBox
                options={[
                  { label: "Select Document", value: "" },
                  ...RequiredAttachment,
                ]}
                lable="RequiredAttachment"
                id="RequiredAttachment"
                selectedValue={formData?.RequiredAttachment}
                name="RequiredAttachment"
                onChange={handleSelectChange}
              />
            </div>
            {/* <div className="col-sm-2">
              <SelectBox
                options={[
                  { label: "Select Document", value: "" },
                  ...RequiredAttachment,
                ]}
                lable="RequiredAttachment"
                id="RequiredAttachment"
                selectedValue={formData?.RequiredAttachment}
                name="RequiredAttachment"
                onChange={handleSelectChange}
              />
            </div> */}
            {formData?.DataType !== "Profile" && (
              <>
                <div className="col-sm-2">
                  <Input
                    className="required-fields"
                    lable="Method Name"
                    id="MethodName"
                    placeholder=" "
                    onChange={handleChanges}
                    value={formData?.MethodName}
                    name="MethodName"
                    onBlur={handleBlur}
                    disabled={formData?.DataType == "Package" ? true : false}
                    required
                  />
                  {errors?.MethodName && touched?.MethodName && (
                    <span className="error-message">{errors?.MethodName}</span>
                  )}
                </div>
              </>
            )}
            {formData?.DataType == "Test" && (
              <>
                <div className="col-sm-2">
                  <Input
                    type="text"
                    lable="Suffix"
                    id="Suffix"
                    placeholder=" "
                    onChange={handleChanges}
                    value={formData?.Suffix}
                    name="Suffix"
                    maxLength={2}
                    // onInput={(e) => number(e, 2)}
                    onBlur={handleBlur}
                  />
                </div>
              </>
            )}
            {(formData?.Gender == "Female" || formData?.Gender == "Both") && (
              <>
                <div className="col-sm-2">
                  <SelectBox
                    options={[{ label: "Select", value: "" }, ...PNDT]}
                    lable="PNDT"
                    id="PNDT"
                    selectedValue={formData?.PNDT}
                    onChange={handleSelectChange}
                    isDisabled={formData?.DataType === "Package" ? true : false}
                    name="PNDT"
                  />
                </div>
              </>
            )}
          </div>
          <div className="row pt-1 pl-2 pr-2">
            <div className="col-sm-1 d-flex">
              <div className="mt-1">
                <input
                  name="Reporting"
                  type="checkbox"
                  checked={formData?.Reporting}
                  onChange={(e) => handleChanges(e)}
                />
              </div>
              <label className="control-label ml-2" htmlFor="Reporting">
                {t("Reporting")}
              </label>
            </div>
            <div className="col-sm-1 d-flex">
              <div className="mt-1">
                <input
                  name="Booking"
                  type="checkbox"
                  checked={formData?.Booking}
                  onChange={(e) => handleChanges(e)}
                />
              </div>
              <label className="control-label ml-2" htmlFor="Booking">
                {" "}
                {t("Booking")}
              </label>
            </div>
            <div className="col-sm-2 d-flex">
              <div className="mt-1">
                <input
                  name="showPatientReport"
                  type="checkbox"
                  checked={formData?.showPatientReport}
                  onChange={(e) => handleChanges(e)}
                />
              </div>
              <label className="control-label ml-2" htmlFor="showPatientReport">
                {t("ShowPatientReport")}
              </label>
            </div>
            <div className="col-sm-1 d-flex">
              <div className="mt-1">
                <input
                  name="OnlineReport"
                  type="checkbox"
                  checked={formData?.OnlineReport}
                  onChange={(e) => handleChanges(e)}
                />
              </div>
              <label className="control-label ml-2" htmlFor="OnlineReport">
                {t("OnlineReport")}
              </label>
            </div>
            <div className="col-sm-1 d-flex">
              <div className="mt-1">
                <input
                  name="AutoSave"
                  type="checkbox"
                  checked={formData?.AutoSave}
                  onChange={(e) => handleChanges(e)}
                />
              </div>
              <label className="control-label ml-2" htmlFor="AutoSave">
                {t("AutoSave")}
              </label>
            </div>
            <div className="col-sm-1 d-flex">
              <div className="mt-1">
                <input
                  name="PrintSeparate"
                  type="checkbox"
                  checked={formData?.PrintSeparate}
                  onChange={(e) => handleChanges(e)}
                />
              </div>
              <label className="control-label ml-2" htmlFor="PrintSeparate">
                {t("PrintSeparate")}
              </label>
            </div>
            <div className="col-sm-1 d-flex">
              <div className="mt-1">
                <input
                  name="isMandatory"
                  type="checkbox"
                  checked={formData?.isMandatory}
                  onChange={(e) => handleChanges(e)}
                />
              </div>
              <label className="control-label ml-2" htmlFor="isMandatory">
                {t("IsMandatory")}
              </label>
            </div>
            <div className="col-sm-2 d-flex">
              <div className="mt-1">
                <input
                  name="PrintSampleName"
                  type="checkbox"
                  checked={formData?.PrintSampleName}
                  onChange={(e) => handleChanges(e)}
                />
              </div>
              <label className="control-label ml-2">
                {t("Print Sample Name")}
              </label>
            </div>
            <div className="col-sm-1 d-flex">
              <div className="mt-1">
                <input
                  name="IsOutSource"
                  type="checkbox"
                  checked={formData?.IsOutSource}
                  onChange={(e) => handleChanges(e)}
                />
              </div>
              <label className="control-label ml-2">{t("IsOutSource")}</label>
            </div>
            <div className="col-sm-1 d-flex">
              <div className="mt-1">
                <input
                  name="IsCulture"
                  id="IsCulture"
                  type="checkbox"
                  checked={formData?.IsCulture}
                  onChange={(e) => handleChanges(e)}
                />
              </div>
              <label className="control-label ml-2" htmlFor="IsCulture">
                {t("IsCulture")}
              </label>
            </div>
          </div>
          <div className="row pt-1 pl-2 pr-2">
            <div className="col-sm-1 d-flex">
              <div className="mt-1">
                <input
                  name="IsDLCcheck"
                  id="IsDLCcheck"
                  type="checkbox"
                  checked={formData?.IsDLCcheck}
                  onChange={(e) => handleChanges(e)}
                />
              </div>
              <label className="control-label ml-2" htmlFor="IsDLCcheck">
                {t("IsDLCcheck")}
              </label>
            </div>
            <div className="col-sm-1 d-flex">
              <div className="mt-1">
                <input
                  name="IsCovid"
                  type="checkbox"
                  checked={formData?.IsCovid}
                  onChange={(e) => handleChanges(e)}
                />
              </div>
              <label className="control-label ml-2" htmlFor="IsCovid">
                {t("IsCovid")}
              </label>
            </div>
            {/* <div className="col-sm-1 d-flex">
              <div className="mt-1">
                <input
                  name="StatSample"
                  type="checkbox"
                  checked={formData?.StatSample}
                  onChange={(e) => handleChanges(e)}
                />
              </div>
              <label className="control-label ml-2">{t("STATSample")}</label>
            </div> */}
            {/* <div className="col-sm-1 d-flex">
              <div className="mt-1">
                <input
                  name="IsHisto"
                  type="checkbox"
                  checked={formData?.IsHisto}
                  onChange={(e) => handleChanges(e)}
                />
              </div>
              <label className="control-label ml-2">{t("IsHisto")}</label>
            </div> */}
            <div className="col-sm-2 d-flex">
              <div className="mt-1">
                <input
                  name="PricksNotRequired"
                  type="checkbox"
                  checked={formData?.PricksNotRequired}
                  onChange={(e) => handleChanges(e)}
                />
              </div>
              <label className="control-label ml-2" htmlFor="PricksNotRequired">
                {t("PricksNotRequired")}
              </label>
            </div>
            <div className="col-sm-2 d-flex">
              <div className="mt-1">
                <input
                  id="DualAuthentication"
                  name="DualAuthentication"
                  type="checkbox"
                  checked={formData?.DualAuthentication}
                  onChange={(e) => handleChanges(e)}
                />
              </div>
              <label
                className="control-label ml-2"
                htmlFor="DualAuthentication"
              >
                {t("Dual Authentication")}
              </label>
            </div>
          </div>
          <div className="row pt-1 pl-2 pr-2 pb-2">
            {((state?.other?.showButton && saved) || dataForUpdate?.url) &&
              (formData?.DataType === "Profile" ||
                formData?.DataType === "Test") && (
                <div className="col-sm-2">
                  <Link
                    to="/InvestigationsInterpretion"
                    className="btn btn-info btn-block btn-sm"
                    state={{
                      InvestigationID: formData?.InvestigationID,
                      flag: dataForUpdate?.url1 ? true : false,
                      url1: dataForUpdate?.url1,
                      url: "Investigations/SearchRangeInterpreation",
                      data: formData?.TestName,
                    }}
                  >
                    {t("Test Interpretation")}
                  </Link>
                </div>
              )}
            {((state?.other?.showButton && saved) || dataForUpdate?.url) &&
              formData?.DataType === "Test" && (
                <>
                  <div className="col-sm-2 col-md-2">
                    <Link
                      to="/InvestigationRange"
                      className="btn btn-info btn-block btn-sm"
                      state={{
                        InvestigationID: formData?.InvestigationID,
                        flag: dataForUpdate?.url1 ? true : false,
                        url1: dataForUpdate?.url1,
                        data: formData?.TestName,
                      }}
                    >
                      {t("Reference Range")}
                    </Link>
                  </div>

                  <div className="col-sm-2 col-md-2">
                    <Link
                      to="/RequiredFields"
                      className="btn btn-info btn-block btn-sm"
                      state={{
                        url: "Investigations/RequiredFields",
                        url1: dataForUpdate?.url1,
                        flag: dataForUpdate?.url1 ? true : false,
                        data: formData?.InvestigationID,
                        TestName: formData?.TestName,
                      }}
                    >
                      {t("Required Field")}
                    </Link>
                  </div>

                  <div className="col-sm-2 col-md-2">
                    <Link
                      to="/HelpMenu"
                      className="btn btn-info btn-block btn-sm"
                      state={{
                        data: formData,
                        url1: dataForUpdate?.url1,
                        flag: dataForUpdate?.url1 ? true : false,
                      }}
                    >
                      {t("Help Menu")}
                    </Link>
                  </div>
                </>
              )}
          </div>
          {["Profile", "Package"].includes(formData?.DataType) && (
            <>
              <div className="row pt-1 pl-2 pr-2">
                <div className="col-sm-5">
                  <ReactSelect
                    dynamicOptions={MapTest}
                    value={null}
                    name="TestName"
                    placeholderName="Map Test"
                    onChange={(_, e) => handleProfileChange(e?.value, e?.label)}
                  />
                </div>
              </div>
              <div className="ml-2 mr-2 mt-1 mb-1">
                {loading ? (
                  <Loading />
                ) : (
                  <Tables>
                    <thead className="cf">
                      <tr>
                        <th>{t("Action")}</th>
                        <th>{t("S.No")}</th>
                        <th>{t("TestID")}</th>
                        <th>{t("Test Name")}</th>
                        <th>{t("Prefix")}</th>
                        <th>{t("P.S")}</th>
                        <th>{t("Header")}</th>
                        <th>{t("Critical")}</th>
                        <th>{t("Comment")}</th>
                        <th>{t("Bold")}</th>
                        <th>{t("UnderLine")}</th>
                        <th>{t("PrintSeprate")}</th>
                        <th>{t("HelpValueOnly")}</th>
                        {formData?.IsDLCcheck === 1 && (
                          <th>{t("DLC Check")}</th>
                        )}
                        {formData?.DataType === "Package" && (
                          <>
                            <th>{t("Set Range")}</th>
                            <th>{t("InterPretation")}</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    {MapTestTableData.length > 0 && (
                      <tbody>
                        {MapTestTableData.map((ele, index) => (
                          <tr key={index}>
                            <td data-title={t("Action")}>
                              <button
                                className="btn btn-danger"
                                name="disableData"
                                onClick={() => handleFilter(index)}
                              >
                                X
                              </button>
                            </td>
                            <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                            <td data-title={t("TestID")}>
                              {ele?.TestId}&nbsp;
                            </td>
                            <td
                              data-title={t("Test Name")}
                              onMouseEnter={() => {
                                setProfileDetail([]);
                                setMouseHover({
                                  index: index,
                                  data: [],
                                });
                                fetch(ele?.TestId);
                              }}
                              onMouseLeave={() => {
                                setMouseHover({
                                  index: -1,
                                  data: [],
                                });
                              }}
                            >
                              {mouseHover?.index === index &&
                                profileDetail.length > 0 && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      width: "500px",
                                      left: "400px",
                                    }}
                                    className="resultEntryCssTable"
                                  >
                                    <table
                                      className="table table-bordered table-hover table-striped
                                              "
                                      id="tbRecordTest"
                                      cellPadding="{0}"
                                      cellSpacing="{0}"
                                    >
                                      <thead className="cf">
                                        <tr>
                                          <th>Test Name</th>
                                          <th>Test/Profile</th>
                                          <th>Department</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {profileDetail.map((data, index) => (
                                          <tr key={index}>
                                            {/* <td>{data?.TestName}</td> */}
                                            <td>{data?.TestName}</td>
                                            <td>{data?.DataType}</td>
                                            <td>{data?.Department}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              {ele?.TestName}&nbsp;
                            </td>
                            <td className="TestPrefix" data-title={t("Prefix")}>
                              <Input
                                type="text"
                                value={ele?.TestPrefix}
                                name="TestPrefix"
                                onChange={(e) => handleMapTestChange(e, index)}
                              />
                            </td>

                            <td className="TestPrefix" data-title={t("P.S")}>
                              <Input
                                className="select-input-box input-sm form-control"
                                type="number"
                                value={ele?.PrintSequence}
                                name="PrintSequence"
                                onChange={(e) => handleMapTestChange(e, index)}
                                onBlur={(e) =>
                                  handlePrintSequenceValidtion(
                                    e,
                                    index,
                                    ele?.TestId
                                  )
                                }
                              />
                              {errors?.PrintSequence &&
                                touched?.PrintSequence && (
                                  <span className="error-message">
                                    {errors?.PrintSequence}
                                  </span>
                                )}
                            </td>
                            <td className="Header" data-title={t("Header")}>
                              <input
                                type="checkbox"
                                className="chk_header"
                                name="Header"
                                checked={ele?.Header}
                                onChange={(e) => handleMapTestChange(e, index)}
                              />
                            </td>
                            <td className="Critical" data-title={t("Critical")}>
                              <input
                                type="checkbox"
                                className="chk_Critical"
                                name="Critical"
                                checked={ele?.Critical}
                                onChange={(e) => handleMapTestChange(e, index)}
                              />
                            </td>
                            <td className="Comment" data-title={t("Comment")}>
                              <input
                                type="checkbox"
                                className="chk_Comment"
                                name="Comment"
                                checked={ele?.Comment}
                                onChange={(e) => handleMapTestChange(e, index)}
                              />
                            </td>
                            <td className="Bold" data-title={t("Bold")}>
                              <input
                                type="checkbox"
                                className="chk_Bold"
                                name="Bold"
                                checked={ele?.Bold}
                                onChange={(e) => handleMapTestChange(e, index)}
                              />
                            </td>
                            <td
                              className="UnderLine"
                              data-title={t("UnderLine")}
                            >
                              <input
                                type="checkbox"
                                className="chk_Underline"
                                name="Underline"
                                checked={ele?.Underline}
                                onChange={(e) => handleMapTestChange(e, index)}
                              />
                            </td>
                            <td
                              className="PrintSeprate"
                              data-title={t("PrintSeprate")}
                            >
                              <input
                                type="checkbox"
                                className="chk_printSeprate"
                                name="PrintSeprate"
                                checked={ele?.PrintSeprate}
                                onChange={(e) => handleMapTestChange(e, index)}
                              />
                            </td>
                            <td
                              className="HelpValue"
                              data-title={t("Help Value Only")}
                            >
                              <input
                                type="checkbox"
                                className="chk_HelpValue"
                                name="HelpValue"
                                checked={ele?.HelpValue}
                                onChange={(e) => handleMapTestChange(e, index)}
                              />
                            </td>
                            {formData?.IsDLCcheck == 1 && (
                              <td className="dlcCheck" data-title={"DLC Check"}>
                                <input
                                  type="checkbox"
                                  className="check_DLC"
                                  name="dlcCheck"
                                  checked={ele?.dlcCheck}
                                  onChange={(e) =>
                                    handleMapTestChange(e, index)
                                  }
                                />
                              </td>
                            )}
                            {formData?.DataType === "Package" && (
                              <>
                                <td
                                  className="setRange"
                                  data-title={t("Set Range")}
                                >
                                  {(state?.url ==
                                    "Investigations/UpdateInvestigation" &&
                                    saved) ||
                                  dataForUpdate?.url1 != null ? (
                                    <Link
                                      to="/InvestigationRange"
                                      state={{
                                        InvestigationID: ele?.TestId,
                                        data: ele?.TestName,
                                        flag: dataForUpdate?.url1
                                          ? true
                                          : false,
                                        url1: dataForUpdate?.url1,
                                      }}
                                      style={{
                                        cursor: "pointer",
                                      }}
                                    >
                                      {t("SetRange")}
                                    </Link>
                                  ) : (
                                    ""
                                  )}
                                  {/* {console.log(state?.url,saved,dataForUpdate?.url1)} */}
                                </td>
                                <td
                                  className="inter"
                                  data-title={t("InterPretation")}
                                >
                                  {(state?.url ==
                                    "Investigations/UpdateInvestigation" &&
                                    saved) ||
                                  dataForUpdate?.url1 != null ? (
                                    <Link
                                      to="/InvestigationsInterpretion"
                                      state={{
                                        InvestigationID: ele?.TestId,
                                        flag: dataForUpdate?.url1
                                          ? true
                                          : false,
                                        url1: dataForUpdate?.url1,
                                        url: "Investigations/SearchRangeInterpreation",
                                        data: ele?.TestName,
                                      }}
                                    >
                                      {t("Test Interpretation")}
                                    </Link>
                                  ) : (
                                    ""
                                  )}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </Tables>
                )}
              </div>
            </>
          )}
        </Accordion>
        <Accordion title={t("Actions")} defaultValue={true}>
          <div className="row pt-2 pl-2 pr-2 pb-2">
            <div className="col-sm-1 d-flex">
              <div className="mt-1">
                <input
                  name="isActive"
                  type="checkbox"
                  checked={formData?.isActive}
                  onChange={handleChanges}
                />
              </div>
              <label className="control-label ml-2" htmlFor="isActive">
                {t("Active")}
              </label>
            </div>
            <div className="col-sm-1">
              {load || editLoading ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-block btn-success btn-sm"
                  type="button"
                  onClick={handleSubmit}
                >
                  {state?.other?.button && saved
                    ? t(state?.other?.button)
                    : dataForUpdate?.url
                      ? t("Update")
                      : t("Save")}
                </button>
              )}
            </div>
            <div className="col-sm-2">
              <Link to="/InvestigationsList" style={{ fontSize: "13px" }}>
                {t("Back to List")}
              </Link>
            </div>
          </div>
        </Accordion>
      </>
    </>
  );
};

export default Investigations;
