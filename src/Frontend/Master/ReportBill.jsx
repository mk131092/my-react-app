import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance, axiosReport } from "../../utils/axiosInstance";

import { useTranslation } from "react-i18next";
import {
  Active,
  ActiveTemplateID,
  Color,
  DDLData,
  DDLDataDepartment,
  Dynamic,
  DynamicReportType,
  FontFamily,
  LabelDetailOptions,
  LabelFontFamily,
  LableID,
  NumericLabel,
  PageOrientation,
  PageSize,
  Position,
  ReportType,
  SearchBy,
  TextAlignValue,
  TypePlaceHolder,
} from "../../utils/Constants";
import Accordion from "@app/components/UI/Accordion";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Input from "../../components/formComponent/Input";
import Tables from "../../components/UI/customTable";
import { isChecked } from "../util/Commonservices";
import Loading from "../../components/loader/Loading";
import SeeText from "../utils/SeeText";
import SeeImage from "../utils/SeeImage";
import { Link } from "react-router-dom";
import { number } from "../../utils/helpers";
import ReportBillTable from "./ReportBillTable";
import ReportPreview from "./ReportPreview";
import AnimatedPage from "../../routes/AnimatedPage ";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";

const ReportBill = () => {
  const [headerSetupData, setHeaderSetupData] = useState(LableID);
  const [NumericSetupData, setNumericSetupData] = useState(NumericLabel);
  const [index, setIndex] = useState("");
  const [load, setLoad] = useState(false);
  const [ModalValue, SetModalValue] = useState({
    text: "",
    image: "",
  });
  const [template, setTemplate] = useState([]);
  const [key, setKey] = useState({
    headerSetupDataFlag: false,
    DynamicReport: false,
    PageSetup: true,
    NumericSetup: false,
  });
  const CompanyID = useLocalStorage("userData", "get")?.CompanyID;
  const changeSetup = (flag1, flag2, flag3, flag4) => {
    setKey({
      headerSetupDataFlag: flag1,
      DynamicReport: flag2,
      PageSetup: flag3,
      NumericSetup: flag4,
    });
  };
  const [zoom, setZoom] = useState(false);
  const [preview, setPreview] = useState(false);
  const [DynamicField, setDynamicField] = useState(Dynamic);
  const [DynamicReport, setDynamicReport] = useState([]);
  const [show, setShow] = useState(false);
  const [showImage, setShowImage] = useState(false);
  // const [activeTemplate, setActiveTemplate] = useState("");
  const [PageSetup, setPageSetup] = useState({
    ActiveTemplateID: "",
    FooterHeight: "",
    HeaderHeight: "",
    MarginBottom: "",
    MarginLeft: "",
    MarginRight: "",
    MarginTop: "",
    PageOrientation: "",
    PageSize: "",
    ReportName: ReportType[0]?.value,
    ReportType: ReportType[0]?.value,
    ReportTypeId: "2",
    TemplateID: "",
    TemplateName: "",
  });
  // console.log(DynamicReport, DynamicField);
  const handleShow = () => {
    setShow(false);
  };

  const handleShowImage = () => {
    setShowImage(false);
  };
  const { t } = useTranslation();

  const handleChange = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex]?.text;
    const commonProperties = {
      ...PageSetup,
      [name]: label,
    };

    switch (name) {
      case "ReportType":
        switch (label) {
          case "Lab Report":
            getTemplateType("2", label);
            break;
          case "Bill":
            getTemplateType("1", label);
            break;
          case "TRF":
            getTemplateType("3", label);
            break;
          case "Department Slip":
            getTemplateType("4", label);
            break;
          default:
            setPageSetup(commonProperties);
            break;
        }
        break;
      case "TemplateName":
        setPageSetup({
          ...commonProperties,
          TemplateID: value,
        });
        fetch(PageSetup?.ReportTypeId, value, label, PageSetup?.ReportType);
        break;
      default:
        setPageSetup({ ...PageSetup, [name]: value });
        break;
    }
  };

  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };

  const handleSelectDynamic = (event) => {
    const { name, value } = event.target;
    if (name == "DynamicReportType") {
      setDynamicField({
        ...DynamicField,
        [name]: value,
        Data: "",
      });
    } else if (name == "Data") {
      setDynamicField({
        ...DynamicField,
        [name]: value,
        PositionLeft:
          value == "Department Of" ? 300 : DynamicField?.PositionLeft,
      });
    } else {
      setDynamicField({
        ...DynamicField,
        [name]: value,
      });
    }
  };

  const handleSubmit = () => {
    setLoad(true);
    const finalData = DynamicReport?.map((ele) => {
      return {
        ...ele,
        Id: Number(ele?.ID),
        Data: ele?.Data,
        DynamicReportType: ele?.DynamicReportType,
        Height: Number(ele?.Height),
        ImageData: "",
        IsActive: Number(ele?.IsActive),
        PositionLeft: Number(ele?.PositionLeft),
        PositionTop: Number(ele?.PositionTop),
        Text: ele?.Text,
        TypePlaceHolder: ele?.TypePlaceHolder,
        Width: Number(ele?.Width),
        ReportName: PageSetup?.ReportName,
        ReportType: PageSetup?.ReportType,
        ReportTypeId: Number(PageSetup?.ReportTypeId),
        TemplateID: Number(PageSetup?.TemplateID),
        TemplateName: PageSetup?.TemplateName,
        FontSize: Number(ele?.FontSize),
      };
    });
    axiosInstance
      .post("ReportMaster/UpdateDynamicReport", finalData)
      .then((res) => {
        if (res?.data?.success) {
          fetch(
            PageSetup?.ReportTypeId,
            PageSetup?.TemplateID,
            PageSetup?.TemplateName,
            PageSetup?.ReportName
          );
          toast.success(res.data.message);
        } else {
          toast.error(res?.data?.message);
        }
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
        toast.error(err.response.data.message);
      });
  };

  const handleHeader = (e, index) => {
    const { name, value, checked } = e.target;
    if (index >= 0) {
      const data = [...headerSetupData];
      data[index][name] = value;
      setHeaderSetupData(data);
    } else {
      const val = headerSetupData.map((ele) => {
        return {
          ...ele,
          [name]: value ? value : checked ? 1 : 0,
        };
      });
      setHeaderSetupData(val);
    }
  };

  // const handleNumeric = (e, index) => {
  //   const { name, value, checked } = e.target;
  //   console.log({name,value})
  //   if (index >= 0) {
  //     const data = [...NumericSetupData];
  //     data[index][name] = value;
  //     setNumericSetupData(data);
  //   } else {
  //     const val = NumericSetupData.map((ele) => {
  //       return {
  //         ...ele,
  //         [name]: value ? value : checked ? 1 : 0,
  //       };
  //     });
  //     setNumericSetupData(val);
  //   }
  // };

  const handleNumeric = (e, index) => {
    const { name, value, checked } = e.target;
    console.log(name, value, index);
    if (index >= 0) {
      const data = [...NumericSetupData];
      const currentItem = data[index];
      if (name === "Width") {
        if (
          (currentItem?.LabelID === "MethodName" ||
            currentItem?.LabelID === "SampleTypeName") &&
          currentItem?.Position !== "S"
        ) {
          data[index]["Width"] = 0;
        } else {
          data[index][name] = Number(value);
        }
        setNumericSetupData(data);
      } else {
        data[index][name] = value;
        setNumericSetupData(data);
      }
    } else {
      const val = NumericSetupData.map((ele) => {
        return {
          ...ele,
          [name]: value ? value : checked ? 1 : 0,
        };
      });
      setNumericSetupData(val);
    }
  };

  const handleNumericSequence = (e, index) => {
    const { name, value } = e?.target;
    const data = [...NumericSetupData];
    const currentItem = data[index];
    if (
      (currentItem?.LabelID === "MethodName" ||
        currentItem?.LabelID === "SampleTypeName") &&
      currentItem?.Position !== "S"
    ) {
      data[index][name] = 0;
    }
    data[index][name] = Number(value);
    setNumericSetupData(data);
  };

  const handleSelectChange = (e, LabelID) => {
    const { name, value } = e.target;
    setNumericSetupData((prev) =>
      prev.map((item) => {
        if (item?.LabelID === LabelID) {
          if (name === "Position") {
            return {
              ...item,
              Position: value,
              PrintSequence: 0,
              Width: 0,
              TextAlign: value === "S" ? "Left" : "",
            };
          } else {
            return {
              ...item,
              TextAlign: value,
            };
          }
        }
        return item;
      })
    );
  };

  const handleHeaderCheckSingle = (e, index) => {
    const { name, checked } = e.target;
    const datas = [...headerSetupData];
    datas[index][name] = checked ? 1 : 0;
    setHeaderSetupData(datas);
  };

  const handleNumericCheckSingle = (e, index) => {
    const { name, checked } = e.target;
    const datas = [...NumericSetupData];

    if (name === "IsBox") {
      if (
        [
          "TestHeading",
          "PackageHeading",
          "Interpretation",
          "Comment",
          "THeadBorder",
          "Department",
        ].includes(datas[index]?.LabelID)
      ) {
        datas[index][name] = checked ? 1 : 0;
        setNumericSetupData(datas);
        return;
      }
      const updatedData = datas?.map((ele) => {
        if (
          [
            "TestHeading",
            "PackageHeading",
            "Interpretation",
            "Comment",
            "THeadBorder",
            "Department",
          ].includes(ele?.LabelID)
        ) {
          return ele;
        }
        return {
          ...ele,
          [name]: checked ? 1 : 0,
        };
      });
      setNumericSetupData(updatedData);
    } else {
      datas[index][name] = checked ? 1 : 0;
      setNumericSetupData(datas);
    }
  };

  const handleCheckHeader = (e) => {
    const { name, checked } = e.target;
    const data = headerSetupData?.map((ele) => {
      return {
        ...ele,
        [name]: checked ? "1" : "0",
      };
    });

    setHeaderSetupData(data);
  };

  const handleCheckNumeric = (e) => {
    const { name, checked } = e.target;
    const data = NumericSetupData?.map((ele) => {
      return {
        ...ele,
        [name]: checked ? 1 : 0,
      };
    });
    setNumericSetupData(data);
  };
  const handleChangeDynamic = (e) => {
    const { name, value } = e.target;
    if (name == "PositionLeft") {
      if (value >= 781 && DynamicField?.DynamicReportType == "PoweredBy")
        return;
      else setDynamicField({ ...DynamicField, [name]: value });
    } else setDynamicField({ ...DynamicField, [name]: value });
  };

  const validationData = (fields) => {
    let valid = true;
    for (let i = 0; i < fields.length; i++) {
      if (["Text"].includes(fields[i])) {
      } else if (DynamicField[fields[i]] === "") {
        valid = false;
        break;
      }
    }
    return valid;
  };

  const handleAdd = (index) => {
    const data = Object.keys(DynamicField);

    if (index < 0 || index === "") {
      setDynamicReport([...DynamicReport, { ...DynamicField, ID: 0 }]);
      setDynamicField(Dynamic);
    } else {
      const data = [...DynamicReport];
      data[index] = DynamicField;
      setDynamicReport(data);
      setDynamicField(Dynamic);
      setIndex("");
    }
  };

  const handleEdit = (data, index) => {
    setDynamicField({ ...data, IsActive: "1" });
    setIndex(index);
    window.scrollTo(0, 0);
  };

  const handleDelete = (index) => {
    const data = DynamicReport.filter((ele, ind) => ind !== index);
    setDynamicReport(data);
    toast.success("Successfully Deleted");
  };
  const fetch = (val1, val2, labelTemp, labelReport) => {
    setLoad(true);
    axiosInstance
      .post("ReportMaster/GetReportSetup", {
        ReportTypeId: Number(val1),
        TemplateID: Number(val2),
      })
      .then((res) => {
        if (res?.data?.success) {
          const pageSetup = res?.data?.message?.pageSetup[0];
          const headerSetup = res?.data?.message?.headerSetup;
          const NumericSetup = res?.data?.message?.numericSetup;
          const dynamicReport = res?.data?.message?.dynamicReport;
          setDynamicReport(dynamicReport);
          // setActiveTemplate(pageSetup?.ActiveTemplateID);
          setHeaderSetupData(headerSetup);
          const updatedData = NumericSetup.map((item) => {
            if (item?.LabelID === "TestName")
              return { ...item, PrintSequence: 1, Print: 1 };
            if (item?.LabelID === "Result")
              return { ...item, PrintSequence: 2, Print: 1 };
            return item;
          });
          // const hideUpdatedData = updatedData?.filter(
          //   (ele) => ele?.LabelID != "SampleTypeName"
          // );
          setNumericSetupData(updatedData);
          setPageSetup({
            ...PageSetup,
            ...pageSetup,
            ReportTypeId: val1,
            TemplateID: val2,
            TemplateName: labelTemp,
            ReportType: labelReport,
            ReportName: labelReport,
            ActiveTemplateID: pageSetup?.ActiveTemplateID,
            FooterHeight: pageSetup?.FooterHeight,
            HeaderHeight: pageSetup?.HeaderHeight,
            MarginBottom: pageSetup?.MarginBottom,
            MarginLeft: pageSetup?.MarginLeft,
            MarginRight: pageSetup?.MarginRight,
            MarginTop: pageSetup?.MarginTop,
            PageOrientation: pageSetup?.PageOrientation,
            PageSize: pageSetup?.PageSize,
          });
        } else {
          toast.error(res?.data?.message);
        }
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
        console.log(err);
      });
  };
  const handleSubmitPageSetup = () => {
    setLoad(true);
    axiosInstance
      .post("ReportMaster/UpdatePageSetup", {
        ActiveTemplateID: Number(PageSetup?.TemplateID),
        FooterHeight: Number(PageSetup?.FooterHeight),
        HeaderHeight: Number(PageSetup?.HeaderHeight),
        MarginBottom: Number(PageSetup?.MarginBottom),
        MarginLeft: Number(PageSetup?.MarginLeft),
        MarginRight: Number(PageSetup?.MarginRight),
        MarginTop: Number(PageSetup?.MarginTop),
        PageOrientation: PageSetup?.PageOrientation,
        PageSize: PageSetup?.PageSize,
        ReportName: PageSetup?.ReportName,
        ReportType: PageSetup?.ReportType,
        ReportTypeId: Number(PageSetup?.ReportTypeId),
        TemplateID: Number(PageSetup?.TemplateID),
        TemplateName: PageSetup?.TemplateName,
        Id: Number(PageSetup?.ID),
      })
      .then((res) => {
        if (res?.data?.success) {
          fetch(
            PageSetup?.ReportTypeId,
            PageSetup?.TemplateID,
            PageSetup?.TemplateName,
            PageSetup?.ReportName
          );
          toast.success(res.data.message);
        } else {
          toast.error(res?.data?.message);
        }
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
        toast.error(err.response.data.message);
      });
  };
  const handleSubmitHeaderSetup = () => {
    setLoad(true);
    const finalData = headerSetupData?.map((ele) => {
      return {
        ...ele,
        Id: ele?.ID,
        LabelID: ele?.LabelID,
        LabelDetail: ele?.LabelDetail,
        DetailXPosition: Number(ele?.DetailXPosition),
        Top: Number(ele?.Top),
        LeftPosition: Number(ele?.LeftPosition),
        Bold: Number(ele?.Bold),
        Italic: Number(ele?.Italic),
        Underline: Number(ele?.Underline),
        Print: Number(ele?.Print),
        FontFamily: ele?.FontFamily,
        FontSize: Number(ele?.FontSize),
        ReportName: PageSetup?.ReportName,
        ReportType: PageSetup?.ReportType,
        ReportTypeId: Number(PageSetup?.ReportTypeId),
        TemplateID: Number(PageSetup?.TemplateID),
        TemplateName: PageSetup?.TemplateName,
        ActiveTemplateID: Number(PageSetup?.TemplateID),
      };
    });
    axiosInstance
      .post("ReportMaster/UpdateHeaderSetup", finalData)
      .then((res) => {
        if (res?.data?.success) {
          fetch(
            PageSetup?.ReportTypeId,
            PageSetup?.TemplateID,
            PageSetup?.TemplateName,
            PageSetup?.ReportName
          );
          toast.success(res.data.message);
        } else {
          toast.error(res?.data?.message);
        }
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
        toast.error(err.response.data.message);
      });
  };

  const handleSubmitNumericSetup = () => {
    for (const data of NumericSetupData) {
      if (data?.PrintSequence === "" || data?.PrintSequence === 0) {
        switch (data?.LabelID) {
          case "TestName":
            toast.error(`Sequence for ${data?.LabelID} can't be blank or 0`);
            return;
          case "Result":
            toast.error(`Sequence for ${data?.LabelID} can't be blank or 0`);
            return;
          case "Flag":
            toast.error(`Sequence for ${data?.LabelID} can't be blank or 0`);
            return;
          case "ReferenceRange":
            toast.error(`Sequence for ${data?.LabelID} can't be blank or 0`);
            return;
          case "Unit":
            toast.error(`Sequence for ${data?.LabelID} can't be blank or 0`);
            return;
          case "MethodName":
            if (data?.Position === "S") {
              toast.error(`Sequence for ${data?.LabelID} can't be blank or 0`);
              return;
            }
            break;
          case "SampleTypeName":
            if (data?.Position === "S") {
              toast.error(`Sequence for ${data?.LabelID} can't be blank or 0`);
              return;
            }
            break;
        }
      } else if (data?.Width === "" || data?.Width === 0) {
        switch (data?.LabelID) {
          case "TestName":
            toast.error(`Width for ${data?.LabelID} can't be blank or 0`);
            return;
          case "Result":
            toast.error(`Width for ${data?.LabelID} can't be blank or 0`);
            return;
          case "Flag":
            toast.error(`Width for ${data?.LabelID} can't be blank or 0`);
            return;
          case "ReferenceRange":
            toast.error(`Width for ${data?.LabelID} can't be blank or 0`);
            return;
          case "Unit":
            toast.error(`Width for ${data?.LabelID} can't be blank or 0`);
            return;
          case "MethodName":
            if (data?.Position === "S") {
              toast.error(`Width for ${data?.LabelID} can't be blank or 0`);
              return;
            }
            break;
          case "SampleTypeName":
            if (data?.Position === "S") {
              toast.error(`Width for ${data?.LabelID} can't be blank or 0`);
              return;
            }
            break;
        }
      }
    }

    const Sequence = NumericSetupData.map((item) => item?.PrintSequence).filter(
      (val) => val !== 0
    );
    const hasDuplicates = Sequence.some((val, i) => Sequence.indexOf(val) != i);
    if (hasDuplicates) {
      toast.error("Sequence values can't be Duplicate.");
      setLoad(false);
      return;
    }

    setLoad(true);

    const finalData = NumericSetupData?.map((ele) => {
      return {
        ...ele,
        LabelID: ele?.LabelID,
        LabelDetail: ele?.LabelDetail,
        Bold: Number(ele?.Bold),
        Italic: Number(ele?.Italic),
        Underline: Number(ele?.Underline),
        Print: Number(ele?.Print),
        FontFamily: ele?.FontFamily,
        FontSize: Number(ele?.FontSize),
        ReportName: PageSetup?.ReportName,
        ReportType: PageSetup?.ReportType,
        ReportTypeId: Number(PageSetup?.ReportTypeId),
        TemplateID: Number(PageSetup?.TemplateID),
        TemplateName: PageSetup?.TemplateName,
        PrintSequence: ele?.PrintSequence,
        TextAlign: ele?.TextAlign,
      };
    });
    axiosInstance
      .post("ReportMaster/UpdateNumericSetup", finalData)
      .then((res) => {
        if (res?.data?.success) {
          fetch(
            PageSetup?.ReportTypeId,
            PageSetup?.TemplateID,
            PageSetup?.TemplateName,
            PageSetup?.ReportName
          );
          toast.success(res.data.message);
        } else {
          toast.error(res?.data?.message);
        }
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
        toast.error(err.response.data.message);
      });
  };
  const handlePreviewReport = () => {
    const dynamicSetup = DynamicReport?.map((ele) => {
      return {
        ...ele,
        Id: Number(ele?.ID),
        Data: ele?.Data,
        DynamicReportType: ele?.DynamicReportType,
        Height: Number(ele?.Height),
        ImageData: "",
        IsActive: ele?.IsActive?.toString(),
        PositionLeft: Number(ele?.PositionLeft),
        PositionTop: Number(ele?.PositionTop),
        Text: ele?.Text,
        TypePlaceHolder: ele?.TypePlaceHolder,
        Width: Number(ele?.Width),
        ReportName: PageSetup?.ReportName,
        ReportType: PageSetup?.ReportType,
        ReportTypeId: Number(PageSetup?.ReportTypeId),
        TemplateID: Number(PageSetup?.TemplateID),
        TemplateName: PageSetup?.TemplateName,
        FontSize: Number(ele?.FontSize),
      };
    });
    const pageSetup = {
      ActiveTemplateID: PageSetup?.TemplateID?.toString(),
      FooterHeight: Number(PageSetup?.FooterHeight),
      HeaderHeight: Number(PageSetup?.HeaderHeight),
      MarginBottom: Number(PageSetup?.MarginBottom),
      MarginLeft: Number(PageSetup?.MarginLeft),
      MarginRight: Number(PageSetup?.MarginRight),
      MarginTop: Number(PageSetup?.MarginTop),
      PageOrientation: PageSetup?.PageOrientation,
      PageSize: PageSetup?.PageSize,
      ReportName: PageSetup?.ReportName,
      ReportType: PageSetup?.ReportType,
      ReportTypeId: PageSetup?.ReportTypeId?.toString(),
      TemplateID: PageSetup?.TemplateID?.toString(),
      TemplateName: PageSetup?.TemplateName,
      Id: Number(PageSetup?.ID),
    };
    const headerSetup = headerSetupData?.map((ele) => {
      return {
        ...ele,
        Id: ele?.ID,
        LabelID: ele?.LabelID,
        LabelDetail: ele?.LabelDetail,
        DetailXPosition: Number(ele?.DetailXPosition),
        Top: Number(ele?.Top),
        LeftPosition: Number(ele?.LeftPosition),
        Bold: Number(ele?.Bold),
        Italic: Number(ele?.Italic),
        Underline: Number(ele?.Underline),
        Print: Number(ele?.Print),
        FontFamily: ele?.FontFamily,
        FontSize: Number(ele?.FontSize),
        ReportName: PageSetup?.ReportName,
        ReportType: PageSetup?.ReportType,
        ReportTypeId: Number(PageSetup?.ReportTypeId),
        TemplateID: Number(PageSetup?.TemplateID),
        TemplateName: PageSetup?.TemplateName,
        ActiveTemplateID: Number(PageSetup?.TemplateID),
      };
    });
    const numericSetup = NumericSetupData?.map((ele) => {
      return {
        ...ele,
        LabelID: ele?.LabelID,
        LabelDetail: ele?.LabelDetail,
        Bold: Number(ele?.Bold),
        Italic: Number(ele?.Italic),
        Underline: Number(ele?.Underline),
        Print: Number(ele?.Print),
        FontFamily: ele?.FontFamily,
        FontSize: Number(ele?.FontSize),
        ReportName: PageSetup?.ReportName,
        ReportType: PageSetup?.ReportType,
        ReportTypeId: Number(PageSetup?.ReportTypeId),
        TemplateID: Number(PageSetup?.TemplateID),
        TemplateName: PageSetup?.TemplateName,
        PrintSequence: ele?.PrintSequence,
        TextAlign: ele?.TextAlign,
      };
    });
    setLoad(true);
    axiosReport
      .post("commonReports/PreviewDynamicReport", {
        dynamicSetup: dynamicSetup,
        pageSetup: pageSetup,
        headerSetup: headerSetup,
        numericSetup: numericSetup,
      })
      .then((res) => {
        if (res?.data?.success) {
          window.open(res?.data?.url, "_blank");
        } else {
          toast.error(res?.data?.message);
        }
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
        toast.error(err.response.data.message);
      });
  };
  const handleText = (data) => {
    setShow(true);
    SetModalValue({ ...ModalValue, text: data });
  };

  const handlePreview = () => {
    setPreview(true);
  };

  const getTemplateType = (reportTypeId, reportName) => {
    let data = [
      {
        TemplateID: 1,
        TemplateName: "Template 1",
      },
    ];

    let templates = data?.map((ele) => {
      return {
        value: ele?.TemplateID,
        label: ele?.TemplateName,
      };
    });
    setPageSetup({
      ...PageSetup,
      TemplateID: templates[0]?.value,
      TemplateName: templates[0]?.label,
      ReportTypeId: reportTypeId,
      ReportName: reportName,
    });
    fetch(reportTypeId, templates[0]?.value, templates[0]?.label, reportName);
    setTemplate(templates);
  };
  useEffect(() => {
    getTemplateType("2", "Lab Report");
  }, []);
  const handleClose = () => {
    setPreview(false);
  };
  return (
    <>
      {ModalValue?.text && show && (
        <SeeText show={show} handleShow={handleShow} data={ModalValue?.text} />
      )}
      {ModalValue?.image && showImage && (
        <SeeImage
          show={showImage}
          handleShow={handleShowImage}
          data={ModalValue?.image}
        />
      )}
      {preview && <ReportPreview show={preview} handleClose={handleClose} />}
      <Accordion
        // name={`Report Type Template Master ( ${
        //   activeTemplate
        //     ? "Template " + activeTemplate + " Is Active )"
        //     : "No Template Is Active )"
        // }`}
        name={t("Report Type Template Master")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row pt-2 pl-2 pr-2">
          <div className="col-sm-2">
            <SelectBox
              options={ReportType}
              name="ReportType"
              isDisabled={true}
              lable={t("ReportType")}
              onChange={handleChange}
              selectedValue={PageSetup?.ReportType}
            />
          </div>
          <div className="col-sm-2 d-none">
            <SelectBox
              name="TemplateName"
              lable={t("Template")}
              options={template}
              onChange={handleChange}
              selectedValue={PageSetup?.TemplateID}
            />
          </div>
          <button
            className="col-sm-2 btn btn-info h-100 ml-2 mr-2"
            disabled={key?.PageSetup}
            onClick={() => changeSetup(false, false, true, false)}
          >
            Page Setup
          </button>
          <button
            className="col-sm-2 btn btn-info h-100 ml-2 mr-2"
            disabled={key?.headerSetupDataFlag}
            onClick={() => changeSetup(true, false, false, false)}
          >
            {t("Header Setup")}
          </button>
          <button
            className="col-sm-2 btn btn-info h-100 ml-2 mr-2"
            disabled={key?.DynamicReport}
            onClick={() => changeSetup(false, true, false, false)}
          >
            {t("Dynamic Field")}
          </button>
          <button
            className="col-sm-2 btn btn-info h-100 ml-2 mr-2"
            disabled={key?.NumericSetup}
            onClick={() => changeSetup(false, false, false, true)}
          >
            {t("Numeric Setup")}
          </button>
          <div className="col-sm-1 d-none">
            <button
              className="btn btn-block btn-success btn-sm"
              onClick={handlePreviewReport}
            >
              {t("Preview")}
            </button>
          </div>
          {/* <button
            className="col-sm-1 btn btn-block btn-success btn-sm"
            onClick={handlePreview}
          >
            {t("Preview")}
          </button> */}
          {/* {key?.headerSetupDataFlag && headerSetupData?.length > 0 && (
            <span
              className=" ml-4 mt-2 pi pi-expand expand"
              onClick={() => setZoom(true)}
            ></span>
          )} */}
        </div>
      </Accordion>
      {key?.PageSetup && (
        <Accordion title={t("Page Setup Data")} defaultValue={true}>
          {" "}
          <AnimatedPage>
            <div className="row pt-2 pl-2 pr-2">
              <div className="col-sm-2">
                <SelectBox
                  name="PageSize"
                  lable={t("PageSize")}
                  options={PageSize}
                  selectedValue={PageSetup?.PageSize}
                  onChange={handleChange}
                />
              </div>
              <div className="col-sm-2">
                <SelectBox
                  name="PageOrientation"
                  lable={t("PageOrientation")}
                  isDisabled={true}
                  options={PageOrientation}
                  selectedValue={PageSetup?.PageOrientation}
                  onChange={handleChange}
                />
              </div>
              <div className="col-sm-2">
                <Input
                  name="MarginLeft"
                  id="MarginLeft"
                  lable={t("Margin Left")}
                  placeholder=""
                  value={PageSetup?.MarginLeft}
                  onChange={handleChange}
                />
              </div>
              <div className="col-sm-2">
                <Input
                  name="MarginRight"
                  id="MarginRight"
                  lable={t("Margin Right")}
                  placeholder=""
                  value={PageSetup?.MarginRight}
                  onChange={handleChange}
                />
              </div>
              <div className="col-sm-2">
                <Input
                  name="MarginTop"
                  id="MarginTop"
                  lable={t("Margin Top")}
                  placeholder=""
                  value={PageSetup?.MarginTop}
                  onChange={handleChange}
                />
              </div>
              <div className="col-sm-2">
                <Input
                  name="MarginBottom"
                  id="MarginBottom"
                  lable={t("Margin Bottom")}
                  placeholder=""
                  value={PageSetup?.MarginBottom}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row pl-2 pr-2 mt-1">
              <div className="col-sm-2">
                <Input
                  name="HeaderHeight"
                  id="HeaderHeight"
                  lable={t("Header Height")}
                  placeholder=""
                  value={PageSetup?.HeaderHeight}
                  onChange={handleChange}
                />
              </div>
              {/* <div className="col-sm-2">
              <Input
                name="FooterHeight"
                id="FooterHeight"
                lable={t("Footer Height")}
                placeholder=""
                value={PageSetup?.FooterHeight}
                onChange={handleChange}
              />
            </div> */}
              <div className="col-sm-1">
                {load ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-block btn-success btn-sm"
                    onClick={handleSubmitPageSetup}
                  >
                    {t("Update")}
                  </button>
                )}
              </div>
            </div>
          </AnimatedPage>
        </Accordion>
      )}
      {key?.headerSetupDataFlag && (
        <Accordion title={t("Header Setup Data")} defaultValue={true}>
          <AnimatedPage>
            <div className="p-1">
              <ReportBillTable
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
                zoom={zoom}
                setZoom={setZoom}
                handleSubmitHeaderSetup={handleSubmitHeaderSetup}
                load={load}
              >
                <thead className="cf">
                  <tr>
                    <th>
                      <span style={{ fontWeight: "bold" }}>
                        {t("Label ID")}
                      </span>
                    </th>
                    <th>
                      <label>{t("LabelB")}</label>{" "}
                      <label
                        className="switch mt-1 ml-1"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="checkbox"
                          name="LabelBold"
                          checked={
                            isChecked("LabelBold", headerSetupData, 1).includes(
                              false
                            )
                              ? false
                              : true
                          }
                          onChange={handleCheckHeader}
                        />{" "}
                        <span className="slider round2"></span>
                      </label>
                    </th>
                    <th>
                      <label>{t("LabelI")}</label>{" "}
                      <label
                        className="switch mt-1 ml-1"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="checkbox"
                          name="LabelItalic"
                          checked={
                            isChecked(
                              "LabelItalic",
                              headerSetupData,
                              1
                            ).includes(false)
                              ? false
                              : true
                          }
                          onChange={handleCheckHeader}
                        />{" "}
                        <span className="slider round2"></span>
                      </label>
                    </th>
                    <th>
                      <label>{t("LabelU")}</label>{" "}
                      <label
                        className="switch mt-1 ml-1"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="checkbox"
                          name="LabelUnderline"
                          checked={
                            isChecked(
                              "LabelUnderline",
                              headerSetupData,
                              1
                            ).includes(false)
                              ? false
                              : true
                          }
                          onChange={handleCheckHeader}
                        />{" "}
                        <span className="slider round2"></span>
                      </label>
                    </th>

                    <th>
                      <span style={{ fontWeight: "bold" }}>
                        {t("LabelDetail")}
                      </span>
                    </th>
                    <th>
                      <span style={{ fontWeight: "bold" }}>
                        {t("DetailXPosition")}
                      </span>
                    </th>
                    <th>
                      <span style={{ fontWeight: "bold" }}>{t("Top")}</span>
                    </th>
                    <th>
                      <span style={{ fontWeight: "bold" }}>
                        {t("LeftPosition")}
                      </span>
                    </th>
                    <th>
                      <input
                        className="inputFont input-form-control"
                        placeholder={t("FontSize")}
                        type="number"
                        name="FontSize"
                        onInput={(e) => number(e, 10)}
                        onChange={handleHeader}
                      />
                    </th>
                    <th>
                      <select
                        className="inputFont input-form-control"
                        name="FontFamily"
                        onChange={handleHeader}
                      >
                        {FontFamily.map((item, ind) => (
                          <option value={item.value} key={ind}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </th>
                    <th>
                      <label>{t("Bold")}</label>
                      <label
                        className="switch mt-1 ml-1"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="checkbox"
                          name="Bold"
                          checked={
                            isChecked("Bold", headerSetupData, 1).includes(
                              false
                            )
                              ? false
                              : true
                          }
                          onChange={handleCheckHeader}
                        />{" "}
                        <span className="slider round2"></span>
                      </label>
                    </th>
                    <th>
                      <label>{t("Italic")}</label>{" "}
                      <label
                        className="switch mt-1 ml-1"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="checkbox"
                          name="Italic"
                          checked={
                            isChecked("Italic", headerSetupData, 1).includes(
                              false
                            )
                              ? false
                              : true
                          }
                          onChange={handleCheckHeader}
                        />{" "}
                        <span className="slider round2"></span>
                      </label>
                    </th>
                    <th>
                      <label>{t("UnderLine")}</label>{" "}
                      <label
                        className="switch mt-1 ml-1"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="checkbox"
                          name="Underline"
                          checked={
                            isChecked("Underline", headerSetupData, 1).includes(
                              false
                            )
                              ? false
                              : true
                          }
                          onChange={handleCheckHeader}
                        />{" "}
                        <span className="slider round2"></span>
                      </label>
                    </th>
                    <th>
                      <label>{t("Print")}</label>{" "}
                      <label
                        className="switch mt-1 ml-1"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="checkbox"
                          name="Print"
                          checked={
                            isChecked("Print", headerSetupData, 1).includes(
                              false
                            )
                              ? false
                              : true
                          }
                          onChange={handleCheckHeader}
                        />{" "}
                        <span className="slider round2"></span>
                      </label>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {headerSetupData.map((data, index) => (
                    <tr key={index}>
                      <td data-title={t("LabelID")}>
                        <span className="labelReport">{data?.LabelID}</span>
                      </td>

                      <td data-title={t("Bold")}>
                        {data?.LabelID !== "Department" && (
                          <label
                            className="switch mt-1 ml-1"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {" "}
                            <input
                              type="checkbox"
                              checked={data?.LabelBold == 1 ? true : false}
                              name="LabelBold"
                              onChange={(e) =>
                                handleHeaderCheckSingle(e, index)
                              }
                            />{" "}
                            <span className="slider round2"></span>
                          </label>
                        )}
                      </td>

                      <td data-title={t("Italic")}>
                        {data?.LabelID !== "Department" && (
                          <label
                            className="switch mt-1 ml-1"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <input
                              type="checkbox"
                              checked={data?.LabelItalic == 1 ? true : false}
                              name="LabelItalic"
                              onChange={(e) =>
                                handleHeaderCheckSingle(e, index)
                              }
                            />{" "}
                            <span className="slider round2"></span>{" "}
                          </label>
                        )}
                      </td>
                      <td data-title={t("Underline")}>
                        {data?.LabelID !== "Department" && (
                          <label
                            className="switch mt-1 ml-1"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <input
                              type="checkbox"
                              checked={data?.LabelUnderline == 1 ? true : false}
                              name="LabelUnderline"
                              onChange={(e) =>
                                handleHeaderCheckSingle(e, index)
                              }
                            />{" "}
                            <span className="slider round2"></span>
                          </label>
                        )}
                      </td>
                      <td data-title={t("LabelDetail")}>
                        {data?.LabelID !== "Department" && (
                          <input
                            className="inputFont input-form-control"
                            value={data?.LabelDetail}
                            type="text"
                            name="LabelDetail"
                            onChange={(e) => handleHeader(e, index)}
                          />
                        )}
                      </td>
                      <td data-title={t("DetailXPosition")}>
                        {data?.LabelID !== "Department" && (
                          <input
                            className="inputFont input-form-control"
                            value={data?.DetailXPosition}
                            name="DetailXPosition"
                            text="number"
                            onChange={(e) => handleHeader(e, index)}
                          />
                        )}
                      </td>
                      <td data-title={t("Top")}>
                        {data?.LabelID !== "Department" && (
                          <input
                            className="inputFont input-form-control"
                            value={data?.Top}
                            name="Top"
                            type="number"
                            onChange={(e) => handleHeader(e, index)}
                          />
                        )}
                      </td>
                      <td data-title={t("Number")}>
                        {data?.LabelID !== "Department" && (
                          <input
                            className="inputFont input-form-control"
                            value={data?.LeftPosition}
                            name="LeftPosition"
                            type="number"
                            onChange={(e) => handleHeader(e, index)}
                          />
                        )}
                      </td>
                      <td data-title={t("FontSize")}>
                        {data?.LabelID !== "Department" && (
                          <input
                            className="inputFont input-form-control"
                            value={data?.FontSize}
                            name="FontSize"
                            type="number"
                            onChange={(e) => handleHeader(e, index)}
                          />
                        )}
                      </td>
                      <td data-title={t("FontFamily")}>
                        {data?.LabelID !== "Department" && (
                          <select
                            className="inputFont input-form-control"
                            name="FontFamily"
                            onChange={(e) => handleHeader(e, index)}
                            value={data?.FontFamily}
                          >
                            {FontFamily.map((item, ind) => (
                              <option value={item.value} key={ind}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td data-title={t("Bold")}>
                        {data?.LabelID !== "Department" && (
                          <label
                            className="switch  mt-1 ml-1"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {" "}
                            <input
                              type="checkbox"
                              checked={data?.Bold == 1 ? true : false}
                              name="Bold"
                              onChange={(e) =>
                                handleHeaderCheckSingle(e, index)
                              }
                            />{" "}
                            <span className="slider round2"></span>
                          </label>
                        )}
                      </td>
                      <td data-title={t("Italic")}>
                        {data?.LabelID !== "Department" && (
                          <label
                            className="switch mt-1 ml-1"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <input
                              type="checkbox"
                              checked={data?.Italic == 1 ? true : false}
                              name="Italic"
                              onChange={(e) =>
                                handleHeaderCheckSingle(e, index)
                              }
                            />{" "}
                            <span className="slider round2"></span>{" "}
                          </label>
                        )}
                      </td>
                      <td data-title={t("Underline")}>
                        {data?.LabelID !== "Department" && (
                          <label
                            className="switch mt-1 ml-1"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <input
                              type="checkbox"
                              checked={data?.Underline == 1 ? true : false}
                              name="Underline"
                              onChange={(e) =>
                                handleHeaderCheckSingle(e, index)
                              }
                            />{" "}
                            <span className="slider round2"></span>
                          </label>
                        )}
                      </td>
                      <td data-title={t("Print")}>
                        <label
                          className="switch mt-1 ml-1"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <input
                            type="checkbox"
                            checked={data?.Print == 1 ? true : false}
                            name="Print"
                            onChange={(e) => handleHeaderCheckSingle(e, index)}
                          />{" "}
                          <span className="slider round2"></span>
                        </label>{" "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ReportBillTable>
            </div>
            <div className="">
              <div className="col-sm-1 p-2">
                {load ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-block btn-success btn-sm"
                    onClick={handleSubmitHeaderSetup}
                  >
                    {t("Update")}
                  </button>
                )}
              </div>
            </div>
          </AnimatedPage>
        </Accordion>
      )}{" "}
      {key?.DynamicReport && (
        <Accordion title={t("Dynamic Field Data")} defaultValue={true}>
          <AnimatedPage>
            <div className="row pt-2 pl-2 pr-2">
              <div className="col-sm-2">
                <SelectBox
                  name="DynamicReportType"
                  id="DynamicReportType"
                  lable="Dynamic Report Type"
                  options={DynamicReportType}
                  onChange={handleSelectDynamic}
                  selectedValue={DynamicField?.DynamicReportType}
                />
              </div>
              <div className="col-sm-2">
                <SelectBox
                  lable="TypePlaceHolder"
                  id="TypePlaceHolder"
                  name="TypePlaceHolder"
                  options={TypePlaceHolder}
                  onChange={handleSelectDynamic}
                  selectedValue={DynamicField?.TypePlaceHolder}
                />
              </div>
              <div className="col-sm-2">
                <SelectBox
                  lable="Data"
                  id="Data"
                  name="Data"
                  options={
                    DynamicField?.DynamicReportType == "Department"
                      ? DDLDataDepartment
                      : DDLData
                  }
                  onChange={handleSelectDynamic}
                  selectedValue={DynamicField?.Data}
                />
              </div>
              <div className="col-sm-2">
                <Input
                  name="PositionLeft"
                  id="PositionLeft"
                  lable="PositionLeft"
                  placeholder=" "
                  value={DynamicField?.PositionLeft}
                  type="number"
                  onChange={handleChangeDynamic}
                />
              </div>
              <div className="col-sm-2">
                <Input
                  name="PositionTop"
                  id="PositionTop"
                  lable="PositionTop"
                  placeholder=" "
                  value={DynamicField?.PositionTop}
                  type="number"
                  onChange={handleChangeDynamic}
                />
              </div>
              <div className="col-sm-2">
                <Input
                  name="Width"
                  id="Width"
                  lable="Width"
                  placeholder=" "
                  value={DynamicField?.Width}
                  type="number"
                  onChange={handleChangeDynamic}
                />
              </div>
            </div>
            <div className="row pl-2 pt-1 pr-2">
              <div className="col-sm-2">
                <Input
                  name="Height"
                  id="Height"
                  lable="Height"
                  placeholder=" "
                  value={DynamicField?.Height}
                  type="number"
                  onChange={handleChangeDynamic}
                />
              </div>
              <div className="col-sm-2">
                <SelectBox
                  lable="IsActive"
                  id="IsActive"
                  name="IsActive"
                  options={Active}
                  isDisabled={
                    DynamicField?.DynamicReportType == "PoweredBy" &&
                    CompanyID != 368
                  }
                  onChange={handleSelectDynamic}
                  selectedValue={DynamicField?.IsActive}
                />
              </div>
              {/* <div className="col-sm-2">
              <Input
                name="fontSize"
                
                id="fontSize"
                lable="FontSize"
                placeholder=" "
                value={DynamicField?.fontSize}
                type="number"
                onChange={handleChangeDynamic}
              />
            </div> */}
              {/* <div className="col-sm-2">
              <input
                type="file"
                name="ImageData"
                id="ImageData"
                onChange={handleUploadImage}
                accept={"image/png"}
              />
            </div> */}
              {/* <div className="col-sm-2">
              <button
                className="btn btn-block btn-success btn-sm"
                type="button"
                onClick={() => handleImage(DynamicField?.ImageData)}
                disabled={
                  DynamicField?.ImageData?.trim() !== "undefined" ? false : true
                }
              >
                {t("View Image")}
              </button>
            </div> */}
              <div className="col-sm-1">
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={() => {
                    handleAdd(index);
                  }}
                >
                  {index === "" || DynamicReport.length === 0
                    ? t("Add Fields")
                    : t("Update")}
                </button>
              </div>
            </div>
            <div className="row pl-2 pr-2 mb-1">
              <div className="col-sm-12">
                <textarea
                  name="Text"
                  placeholder={t("Enter your text")}
                  className="w-100"
                  value={DynamicField?.Text}
                  onChange={handleChangeDynamic}
                  rows="10"
                  cols="50"
                  style={{
                    height: "100% !important",
                  }}
                ></textarea>
              </div>
            </div>
            {DynamicReport.length > 0 && (
              <Tables>
                <thead className="cf">
                  <tr>
                    <th>{t("Edit")}</th>
                    <th>{t("Remove")}</th>
                    <th>{t("DynamicReportType")}</th>
                    <th>{t("TypePlaceHolder")}</th>
                    <th>{t("Data")}</th>
                    <th>{t("PositionLeft")}</th>
                    <th>{t("PositionTop")}</th>
                    <th>{t("Width")}</th>
                    <th>{t("Height")}</th>

                    <th>{t("Action")}</th>
                    <th>{t("Text")}</th>
                    {/* <th>{t("Image")}</th> */}
                  </tr>
                </thead>
                <tbody>
                  {DynamicReport.map((ele, index) => (
                    <tr key={index}>
                      <td data-title={t("Edit")}>
                        <Link
                          onClick={() => {
                            handleEdit(ele, index);
                          }}
                        >
                          {t("Edit")}
                        </Link>
                      </td>
                      <td data-title={t("Remove")}>
                        <Link
                          onClick={() => {
                            handleDelete(index);
                          }}
                        >
                          {t("Remove")}
                        </Link>
                      </td>
                      <td data-title={t("DynamicReportType")}>
                        {ele?.DynamicReportType}&nbsp;
                      </td>
                      <td data-title={t("TypePlaceHolder")}>
                        {ele?.TypePlaceHolder}&nbsp;
                      </td>
                      <td data-title={t("Data")}>{ele?.Data}&nbsp;</td>
                      <td data-title={t("PositionLeft")}>
                        {ele?.PositionLeft}&nbsp;
                      </td>
                      <td data-title={t("PositionTop")}>
                        {ele?.PositionTop}&nbsp;
                      </td>
                      <td data-title={t("Width")}>{ele?.Width}&nbsp;</td>
                      <td data-title={t("Height")}>{ele?.Height}&nbsp;</td>{" "}
                      <td data-title={t("IsActive")}>{ele?.IsActive}&nbsp;</td>
                      <td data-title={t("See Text")}>
                        <button
                          className="btn btn-block btn-info btn-sm"
                          onClick={() => handleText(ele?.Text)}
                          disabled={ele?.Text ? false : true}
                        >
                          {t("See Text")}
                        </button>
                      </td>
                      {/* <td data-title={t("See Image")}>
                      <button
                        className="btn btn-block btn-info btn-sm"
                        onClick={() => handleImage(ele?.ImageData)}
                        disabled={ele?.ImageData?.trim() == "" ? true : false}
                      >
                        {t("See Image")}
                      </button>
                    </td> */}
                    </tr>
                  ))}
                </tbody>
              </Tables>
            )}
            <div className="row mt-2 mb-2 ml-1">
              <div className="col-sm-1">
                {load ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-block btn-success btn-sm"
                    onClick={handleSubmit}
                  >
                    {t("Update")}
                  </button>
                )}
              </div>
            </div>{" "}
          </AnimatedPage>
        </Accordion>
      )}
      {key?.NumericSetup && (
        <Accordion title={t("Numeric Setup Data")} defaultValue={true}>
          <AnimatedPage>
            <div className="p-1">
              <ReportBillTable
              style={{
                  maxHeight: "600px",
                  overflowY: "auto",
                }}
                zoom={zoom}
                setZoom={setZoom}
                handleSubmitHeaderSetup={handleSubmitNumericSetup}
                load={load}
              >
                <thead className="cf">
                  <tr>
                    <th>
                      <span style={{ fontWeight: "bold" }}>
                        {t("Label ID")}
                      </span>
                    </th>
                    <th>
                      <label>{t("Border")}</label>{" "}
                      <label
                        className="switch mt-1 ml-1"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="checkbox"
                          name="IsBox"
                          checked={
                            isChecked("IsBox", NumericSetupData, 1).includes(
                              false
                            )
                              ? false
                              : true
                          }
                          onChange={handleCheckNumeric}
                        />{" "}
                        <span className="slider round2"></span>
                      </label>
                    </th>
                    <th>
                      <span style={{ fontWeight: "bold" }}>
                        {t("LabelDetail")}
                      </span>
                    </th>
                    <th>
                      <span style={{ fontWeight: "bold" }}>
                        {t("Position")}
                      </span>
                    </th>
                    <th>
                      <span style={{ fontWeight: "bold" }}>
                        {t("PrintSequence")}
                      </span>
                    </th>
                    <th>
                      <span style={{ fontWeight: "bold" }}>{t("Width")}</span>
                    </th>

                    <th>
                      <label style={{ display: "block" }}>
                        {t("LFontSize")}
                      </label>{" "}
                      <input
                        className="inputFont input-form-control"
                        style={{ width: "100%" }}
                        type="number"
                        name="LFontSize"
                        onInput={(e) => number(e, 10)}
                        onChange={handleNumeric}
                      />
                    </th>
                    <th>
                      <label>{t("LFontFamily")}</label>{" "}
                      <label
                        className="switch mt-1"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <select
                          className="inputFont input-form-control"
                          name="LFontFamily"
                          onChange={handleNumeric}
                        >
                          {LabelFontFamily.map((item, ind) => (
                            <option value={item.value} key={ind}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </th>
                    <th>
                      <label>{t("LabelB")}</label>{" "}
                      <label
                        className="switch mt-1 ml-1"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="checkbox"
                          name="LBold"
                          checked={
                            isChecked("LBold", NumericSetupData, 1).includes(
                              false
                            )
                              ? false
                              : true
                          }
                          onChange={handleCheckNumeric}
                        />{" "}
                        <span className="slider round2"></span>
                      </label>
                    </th>
                    <th>
                      <label>{t("LabelI")}</label>{" "}
                      <label
                        className="switch mt-1 ml-1"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="checkbox"
                          name="LItalic"
                          checked={
                            isChecked("LItalic", NumericSetupData, 1).includes(
                              false
                            )
                              ? false
                              : true
                          }
                          onChange={handleCheckNumeric}
                        />{" "}
                        <span className="slider round2"></span>
                      </label>
                    </th>
                    <th>
                      <label>{t("LabelU")}</label>{" "}
                      <label
                        className="switch mt-1 ml-1"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="checkbox"
                          name="LUnderline"
                          checked={
                            isChecked(
                              "LUnderline",
                              NumericSetupData,
                              1
                            ).includes(false)
                              ? false
                              : true
                          }
                          onChange={handleCheckNumeric}
                        />{" "}
                        <span className="slider round2"></span>
                      </label>
                    </th>
                    <th>
                      <input
                        className="inputFont input-form-control"
                        placeholder="FontSize"
                        type="number"
                        name="FontSize"
                        onInput={(e) => number(e, 10)}
                        onChange={handleNumeric}
                      />
                    </th>
                    <th>
                      <select
                        className="inputFont input-form-control"
                        name="FontFamily"
                        onChange={handleNumeric}
                      >
                        {FontFamily.map((item, ind) => (
                          <option value={item.value} key={ind}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </th>
                    <th>
                      <span style={{ fontWeight: "bold" }}>
                        {t("TextAlign")}
                      </span>
                    </th>
                    <th>
                      <label>{t("Bold")}</label>{" "}
                      <label
                        className="switch mt-1 ml-1"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="checkbox"
                          name="Bold"
                          checked={
                            isChecked("Bold", NumericSetupData, 1).includes(
                              false
                            )
                              ? false
                              : true
                          }
                          onChange={handleCheckNumeric}
                        />{" "}
                        <span className="slider round2"></span>
                      </label>
                    </th>
                    <th>
                      <label>{t("Italic")}</label>{" "}
                      <label
                        className="switch mt-1 ml-1"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="checkbox"
                          name="Italic"
                          checked={
                            isChecked("Italic", NumericSetupData, 1).includes(
                              false
                            )
                              ? false
                              : true
                          }
                          onChange={handleCheckNumeric}
                        />{" "}
                        <span className="slider round2"></span>
                      </label>
                    </th>
                    <th>
                      <label>{t("UnderLine")}</label>{" "}
                      <label
                        className="switch mt-1 ml-1"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="checkbox"
                          name="Underline"
                          checked={
                            isChecked(
                              "Underline",
                              NumericSetupData,
                              1
                            ).includes(false)
                              ? false
                              : true
                          }
                          onChange={handleCheckNumeric}
                        />{" "}
                        <span className="slider round2"></span>
                      </label>
                    </th>
                    <th>
                      <label>{t("Print")}</label>{" "}
                      <label
                        className="switch mt-1 ml-1"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <input
                          type="checkbox"
                          name="Print"
                          checked={
                            isChecked("Print", NumericSetupData, 1).includes(
                              false
                            )
                              ? false
                              : true
                          }
                          onChange={handleCheckNumeric}
                        />{" "}
                        <span className="slider round2"></span>
                      </label>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {NumericSetupData.map((data, index) => (
                    <tr key={index}>
                      <td data-title={t("LabelID")}>
                        <span className="labelReport">{data?.LabelID}</span>
                      </td>
                      <td data-title={t("Border")}>
                        {
                          <label
                            className="switch mt-1 ml-1"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <input
                              type="checkbox"
                              checked={data?.IsBox == 1 ? true : false}
                              name="IsBox"
                              onChange={(e) =>
                                handleNumericCheckSingle(e, index)
                              }
                            />
                            <span className="slider round2"></span>
                          </label>
                        }
                      </td>
                      <td data-title={t("LabelDetail")}>
                        {![
                          "TestHeading",
                          "PackageHeading",
                          "Interpretation",
                          "Comment",
                          "Department",
                          "THeadBorder",
                        ]?.includes(data?.LabelID) && (
                          <input
                            className="inputFont input-form-control"
                            value={data?.LabelDetail}
                            type="text"
                            name="LabelDetail"
                            onChange={(e) => handleNumeric(e, index)}
                          />
                        )}
                      </td>
                      <td data-title={t("Position")} style={{ width: "30%" }}>
                        {["MethodName", "SampleTypeName"]?.includes(
                          data?.LabelID
                        ) && (
                          <SelectBox
                            options={LabelDetailOptions}
                            id="Position"
                            selectedValue={data?.Position}
                            name="Position"
                            onChange={(e) =>
                              handleSelectChange(e, data?.LabelID)
                            }
                          />
                        )}
                      </td>
                      <td
                        data-title={t("PrintSequence")}
                        style={{ width: "7%" }}
                      >
                        {![
                          "TestHeading",
                          "PackageHeading",
                          "Interpretation",
                          "Comment",
                          "Department",
                          "THeadBorder",
                        ]?.includes(data?.LabelID) && (
                          <input
                            className="inputFont input-form-control"
                            style={{ width: "100%" }}
                            value={
                              (data?.LabelID === "MethodName" ||
                                data?.LabelID === "SampleTypeName") &&
                              data?.Position !== "S"
                                ? 0
                                : (data?.PrintSequence ?? 0)
                            }
                            name="PrintSequence"
                            type="number"
                            max={1}
                            disabled={
                              data?.LabelID === "TestName" ||
                              data?.LabelID === "Result" ||
                              ((data?.LabelID === "MethodName" ||
                                data?.LabelID === "SampleTypeName") &&
                                data?.Position !== "S")
                            }
                            onChange={(e) => handleNumericSequence(e, index)}
                          />
                        )}
                      </td>
                      <td data-title={t("Width")} style={{ width: "7%" }}>
                        {![
                          "TestHeading",
                          "PackageHeading",
                          "Interpretation",
                          "Comment",
                          "Department",
                          "THeadBorder",
                        ]?.includes(data?.LabelID) && (
                          <input
                            className="inputFont input-form-control"
                            style={{ width: "100%" }}
                            value={
                              (data?.LabelID === "MethodName" ||
                                data?.LabelID === "SampleTypeName") &&
                              data?.Position !== "S"
                                ? 0
                                : (data?.Width ?? 0)
                            }
                            name="Width"
                            type="number"
                            disabled={
                              data?.LabelID === "TestName" ||
                              ((data?.LabelID === "MethodName" ||
                                data?.LabelID === "SampleTypeName") &&
                                data?.Position !== "S")
                            }
                            onChange={(e) => handleNumeric(e, index)}
                          />
                        )}
                      </td>
                      <td data-title={t("LFontSize")}>
                        {![
                          "TestHeading",
                          "PackageHeading",
                          "Interpretation",
                          "Comment",
                          "Department",
                          "THeadBorder",
                        ]?.includes(data?.LabelID) && (
                          <input
                            className="inputFont input-form-control"
                            style={{ width: "100%" }}
                            value={data?.LFontSize}
                            name="LFontSize"
                            type="number"
                            onChange={(e) => handleNumeric(e, index)}
                          />
                        )}
                      </td>
                      <td data-title={t("LFontFamily")}>
                        {![
                          "TestHeading",
                          "PackageHeading",
                          "Interpretation",
                          "Comment",
                          "Department",
                          "THeadBorder",
                        ]?.includes(data?.LabelID) && (
                          <select
                            className="inputFont input-form-control"
                            name="LFontFamily"
                            onChange={(e) => handleNumeric(e, index)}
                            value={data?.LFontFamily}
                          >
                            {LabelFontFamily.map((item, ind) => (
                              <option value={item.value} key={ind}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td data-title={t("LBold")}>
                        {![
                          "TestHeading",
                          "PackageHeading",
                          "Interpretation",
                          "Comment",
                          "Department",
                          "THeadBorder",
                        ]?.includes(data?.LabelID) && (
                          <label
                            className="switch mt-1 ml-1"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {" "}
                            <input
                              type="checkbox"
                              checked={data?.LBold == 1 ? true : false}
                              name="LBold"
                              onChange={(e) =>
                                handleNumericCheckSingle(e, index)
                              }
                            />{" "}
                            <span className="slider round2"></span>
                          </label>
                        )}
                      </td>
                      <td data-title={t("LItalic")}>
                        {![
                          "TestHeading",
                          "PackageHeading",
                          "Interpretation",
                          "Comment",
                          "Department",
                          "THeadBorder",
                        ]?.includes(data?.LabelID) && (
                          <label
                            className="switch mt-1 ml-1"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <input
                              type="checkbox"
                              checked={data?.LItalic == 1 ? true : false}
                              name="LItalic"
                              onChange={(e) =>
                                handleNumericCheckSingle(e, index)
                              }
                            />{" "}
                            <span className="slider round2"></span>{" "}
                          </label>
                        )}
                      </td>
                      <td data-title={t("LUnderline")}>
                        {![
                          "TestHeading",
                          "PackageHeading",
                          "Interpretation",
                          "Comment",
                          "Department",
                          "THeadBorder",
                        ]?.includes(data?.LabelID) && (
                          <label
                            className="switch mt-1 ml-1"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <input
                              type="checkbox"
                              checked={data?.LUnderline == 1 ? true : false}
                              name="LUnderline"
                              onChange={(e) =>
                                handleNumericCheckSingle(e, index)
                              }
                            />{" "}
                            <span className="slider round2"></span>
                          </label>
                        )}
                      </td>
                      <td data-title={t("FontSize")}>
                        {![
                          "Interpretation",
                          "Comment",
                          "THeadBorder",
                        ]?.includes(data?.LabelID) && (
                          <input
                            className="inputFont input-form-control"
                            value={data?.FontSize}
                            name="FontSize"
                            type="number"
                            onChange={(e) => handleNumeric(e, index)}
                          />
                        )}
                      </td>
                      <td data-title={t("FontFamily")}>
                        {![
                          "Interpretation",
                          "Comment",
                          "THeadBorder",
                        ]?.includes(data?.LabelID) && (
                          <select
                            className="inputFont input-form-control"
                            name="FontFamily"
                            onChange={(e) => handleNumeric(e, index)}
                            value={data?.FontFamily}
                          >
                            {FontFamily.map((item, ind) => (
                              <option value={item.value} key={ind}>
                                {item.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td data-title={t("TextAlign")} style={{ width: "11%" }}>
                        {![
                          "Interpretation",
                          "Comment",
                          "THeadBorder",
                        ]?.includes(data?.LabelID) &&
                          !(
                            (data?.LabelID === "MethodName" ||
                              data?.LabelID === "SampleTypeName") &&
                            data?.Position !== "S"
                          ) && (
                            <SelectBox
                              options={TextAlignValue}
                              id="TextAlign"
                              selectedValue={data?.TextAlign}
                              isDisabled={
                                data?.LabelID === "TestName" ||
                                ((data?.LabelID === "MethodName" ||
                                  data?.LabelID === "SampleTypeName") &&
                                  data?.Position !== "S")
                              }
                              name="TextAlign"
                              onChange={(e) =>
                                handleSelectChange(e, data?.LabelID)
                              }
                            />
                          )}
                      </td>
                      <td data-title={t("Bold")}>
                        {![
                          "Interpretation",
                          "Comment",
                          "Result",
                          "THeadBorder",
                        ]?.includes(data?.LabelID) && (
                          <label
                            className="switch  mt-1 ml-1"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {" "}
                            <input
                              type="checkbox"
                              checked={data?.Bold == 1 ? true : false}
                              name="Bold"
                              onChange={(e) =>
                                handleNumericCheckSingle(e, index)
                              }
                            />{" "}
                            <span className="slider round2"></span>
                          </label>
                        )}
                      </td>
                      <td data-title={t("Italic")}>
                        {![
                          "Interpretation",
                          "Comment",
                          "THeadBorder",
                        ]?.includes(data?.LabelID) && (
                          <label
                            className="switch mt-1 ml-1"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <input
                              type="checkbox"
                              checked={data?.Italic == 1 ? true : false}
                              name="Italic"
                              onChange={(e) =>
                                handleNumericCheckSingle(e, index)
                              }
                            />{" "}
                            <span className="slider round2"></span>{" "}
                          </label>
                        )}
                      </td>
                      <td data-title={t("Underline")}>
                        {![
                          "Interpretation",
                          "Comment",
                          "THeadBorder",
                        ]?.includes(data?.LabelID) && (
                          <label
                            className="switch mt-1 ml-1"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <input
                              type="checkbox"
                              checked={data?.Underline == 1 ? true : false}
                              name="Underline"
                              onChange={(e) =>
                                handleNumericCheckSingle(e, index)
                              }
                            />{" "}
                            <span className="slider round2"></span>
                          </label>
                        )}
                      </td>
                      <td data-title={t("Print")}>
                        {![
                          "TestHeading",
                          "PackageHeading",
                          "Interpretation",
                          "Comment",
                          "THeadBorder",
                        ]?.includes(data?.LabelID) && (
                          <label
                            className="switch mt-1 ml-1"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <input
                              type="checkbox"
                              checked={data?.Print == 1 ? true : false}
                              name="Print"
                              disabled={
                                data?.LabelID === "TestName" ||
                                data?.LabelID === "Result"
                              }
                              onChange={(e) =>
                                handleNumericCheckSingle(e, index)
                              }
                            />
                            <span className="slider round2"></span>
                          </label>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </ReportBillTable>
            </div>
            <div className="row ml-2">
              <div className="col-sm-1 p-2">
                {load ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-block btn-success btn-sm"
                    onClick={handleSubmitNumericSetup}
                  >
                    {t("Update")}
                  </button>
                )}
              </div>
            </div>
          </AnimatedPage>
        </Accordion>
      )}
    </>
  );
};

export default ReportBill;
