import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  CenterMasterValidationSchema,
  RateMasterValidationSchema,
  RateMasterValidationSchemacash,
} from "../../utils/Schema";
import { guidNumber } from "../util/Commonservices";
import { axiosInstance } from "../../utils/axiosInstance";
import UploadFile from "../utils/UploadFileModal/UploadFile";
import Heading from "../../components/UI/Heading";
import Accordion from "@app/components/UI/Accordion";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Input from "../../components/formComponent/Input";
import {
  getTrimmedData,
  number,
  PreventNumber,
  PreventSpecialCharacter,
} from "../../utils/helpers";
import moment from "moment";
import {
  AgainstInvoice,
  BillingCycle,
  SkipTimeType,
  GraceTime,
  PaymentMode,
} from "../../utils/Constants";
import { toast } from "react-toastify";
import Loading from "../../components/loader/Loading";
import ReactSelect from "../../components/formComponent/ReactSelect";

const CentreMaster = () => {
  const { name } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const [Invoice, setInvoice] = useState([]);
  const [load, setLoad] = useState(false);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [show5, setShow5] = useState(false);
  const [show6, setShow6] = useState(false);

  const [ProcessingLab, setProcessingLab] = useState([]);
  const [ReferenceRate, setReferenceRate] = useState([]);
  const [BarCodeLogic, setBarCodeLogic] = useState([]);
  const [VisitType, setVisitType] = useState([]);
  const [BusinessUnit, setBusinessUnit] = useState([]);
  const [CentreType, setCentreType] = useState([]);
  const [type, setType] = useState([]);
  const [doc, setDoc] = useState(null);
  const [showAccount, setShowAccount] = useState(true);
  const [salesManager, setSalesManager] = useState([]);
  const [proEmplyee, setProEmployee] = useState([]);

  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    DataType: state?.data?.DataType ? state?.data?.DataType : "",
    CentreCode: state?.data?.CentreCode ? state?.data?.CentreCode : "",
    Centre: state?.data?.Centre ? state?.data?.Centre : "",
    CentreType: state?.data?.CentreType ? state?.data?.CentreType : "",
    InvoiceTo: state?.data?.InvoiceTo ? state?.data?.InvoiceTo : "Self",
    BusinessUnit: state?.data?.BusinessUnit
      ? state?.data?.BusinessUnit
      : "Self",
    ProcessingLab: state?.data?.ProcessingLab
      ? state?.data?.ProcessingLab
      : "Self",
    ReferenceRate: state?.data?.ReferenceRate
      ? state?.data?.ReferenceRate
      : "Self",
    Type: state?.data?.Type ? state?.data?.Type : "",
    Address1: state?.data?.Address1 ? state?.data?.Address1 : "",
    Address2: state?.data?.Address2 ? state?.data?.Address2 : "",
    City: state?.data?.City ? state?.data?.City : "",
    BusinessZone: state?.data?.BusinessZone ? state?.data?.BusinessZone : "",
    State: state?.data?.State ? state?.data?.State : "",
    Country: state?.data?.Country ? state?.data?.Country : "",
    Pincode: state?.data?.Pincode ? state?.data?.Pincode : "",
    Email: state?.data?.Email ? state?.data?.Email : "",
    LandLineNo: state?.data?.LandLineNo ? state?.data?.LandLineNo : "",
    Phone: state?.data?.Phone ? state?.data?.Phone : "",
    StateCode: state?.data?.StateCode ? state?.data?.StateCode : "",
    Fax: state?.data?.Fax ? state?.data?.Fax : "",
    Url: state?.data?.Url ? state?.data?.Url : "",
    PaymentMode: state?.data?.PaymentMode ? state?.data?.PaymentMode : "",
    VisitType: state?.data?.VisitType ? state?.data?.VisitType : 1,
    BarcodeLogic: state?.data?.BarcodeLogic ? state?.data?.BarcodeLogic : 1,
    SampleCollectandReceive: state?.data?.SampleCollectandReceive
      ? state?.data?.SampleCollectandReceive
      : 0,
    CityZone: state?.data?.CityZone ? state?.data?.CityZone : "",
    ReferenceRate1: state?.data?.ReferenceRate1
      ? state?.data?.ReferenceRate1
      : 0,
    ReferenceRate2: state?.data?.ReferenceRate2
      ? state?.data?.ReferenceRate2
      : 0,
    IsTrfRequired: state?.data?.IsTrfRequired ? state?.data?.IsTrfRequired : 0,
    IsDepartmentSlip: state?.data?.IsDepartmentSlip
      ? state?.data?.IsDepartmentSlip
      : 0,
    IsSampleRecollection: state?.data?.IsSampleRecollection
      ? state?.data?.IsSampleRecollection
      : 0,
    HideAmount: state?.data?.HideAmount ? state?.data?.HideAmount : 0,
    HideReceipt: state?.data?.HideReceipt ? state?.data?.HideReceipt : 0,
    IsDoctorShareRequired: state?.data?.IsDoctorShareRequired
      ? state?.data?.IsDoctorShareRequired
      : 0,
    isActive: state?.data?.isActive ? state?.data?.isActive : 1,
    CentreID: state?.data?.CentreID ? state?.data?.CentreID : 0,
    UserName: state?.data?.Username ? state?.data?.Username : "",
    Password: state?.data?.Password ? state?.data?.Password : "",
    isAllowedLogin: state?.data?.IsAllowedLogin
      ? state?.data?.IsAllowedLogin
      : 0,
    userLoginID: state?.data?.userLoginID ? state?.data?.userLoginID : 0,
    centreIDHash: "",
    AgainstInvoice: "",
    SecurityAmount: state?.data?.SecurityAmount
      ? state?.data?.SecurityAmount
      : "",
    SecurityRemark: state?.data?.SecurityRemark
      ? state?.data?.SecurityRemark
      : "",
    Gstin: state?.data?.Gstin ? state?.data?.Gstin : "",
    dtEntry: state?.data?.dtEntry ? state?.data?.dtEntry : new Date(),
    FullyPaid: state?.data?.FullyPaid ? state?.data?.FullyPaid : 0,
    SetMRP: state?.data?.SetMRP ? state?.data?.SetMRP : 0,
    ProEmployee: state?.data?.ProEmployee ? state?.data?.ProEmployee : "",
    skipTimeType: state?.data?.skipTimeType ? state?.data?.skipTimeType : "NA",
    CreditLimitInRs: state?.data?.CreditLimitInRs
      ? state?.data?.CreditLimitInRs
      : "",
    CreditLimitInTime: state?.data?.CreditLimitInTime
      ? state?.data?.CreditLimitInTime
      : "",
    skipValue: state?.data?.skipValue ? state?.data?.skipValue : "",
    IsAutoEmail: state?.data?.IsAutoEmail ? state?.data?.IsAutoEmail : 0,
    IsAutoPRDM: state?.data?.IsAutoPRDM ? state?.data?.IsAutoPRDM : 0,
    BillCode: state?.data?.BillCode ? state?.data?.BillCode : "",
    IsPatientFullPaid: state?.data?.IsPatientFullPaid ? state?.data?.IsPatientFullPaid : 0,
  });

  console.log('formData?.IsPatientFullPaid',formData?.IsPatientFullPaid );

  useEffect(() => {
    if (name === "center") {
      setFormData({
        dtEntry: state?.data?.dtEntry ? state?.data?.dtEntry : new Date(),
        DataType: state?.data?.DataType ? state?.data?.DataType : "Centre",
        CentreCode: state?.data?.CentreCode ? state?.data?.CentreCode : "",
        Centre: state?.data?.Centre ? state?.data?.Centre : "",
        CentreType: state?.data?.CentreType
          ? state?.data?.CentreType
          : "Booking",
        InvoiceTo: state?.data?.InvoiceTo ? state?.data?.InvoiceTo : "Self",
        BusinessUnit: state?.data?.BusinessUnit
          ? state?.data?.BusinessUnit
          : "Self",
        ProcessingLab: state?.data?.ProcessingLab
          ? state?.data?.ProcessingLab
          : "Self",
        ReferenceRate: state?.data?.ReferenceRate
          ? state?.data?.ReferenceRate
          : "Self",
        Type: state?.data?.Type ? state?.data?.Type : "",
        Address1: state?.data?.Address1 ? state?.data?.Address1 : "",
        Address2: state?.data?.Address2 ? state?.data?.Address2 : "",
        City: state?.data?.City ? state?.data?.City : "",
        BusinessZone: state?.data?.BusinessZone
          ? state?.data?.BusinessZone
          : "",
        State: state?.data?.State ? state?.data?.State : "",
        Country: state?.data?.Country ? state?.data?.Country : "",
        Pincode: state?.data?.Pincode ? state?.data?.Pincode : "",
        Email: state?.data?.Email ? state?.data?.Email : "",
        LandLineNo: state?.data?.LandLineNo ? state?.data?.LandLineNo : "",
        Phone: state?.data?.Phone ? state?.data?.Phone : "",
        StateCode: state?.data?.StateCode ? state?.data?.StateCode : "",
        Fax: state?.data?.Fax ? state?.data?.Fax : "",
        Url: state?.data?.Url ? state?.data?.Url : "",
        PaymentMode: state?.data?.PaymentMode
          ? state?.data?.PaymentMode
          : "Cash",
        VisitType: state?.data?.VisitType ? state?.data?.VisitType : 1,
        BarcodeLogic: state?.data?.BarcodeLogic ? state?.data?.BarcodeLogic : 1,
        SampleCollectandReceive: state?.data?.SampleCollectandReceive
          ? state?.data?.SampleCollectandReceive
          : 0,
        CityZone: state?.data?.CityZone ? state?.data?.CityZone : "",
        ReferenceRate1: state?.data?.ReferenceRate1
          ? state?.data?.ReferenceRate1
          : 0,
        ReferenceRate2: state?.data?.ReferenceRate2
          ? state?.data?.ReferenceRate2
          : 0,
        IsTrfRequired: state?.data?.IsTrfRequired
          ? state?.data?.IsTrfRequired
          : 0,
        IsDepartmentSlip: state?.data?.IsDepartmentSlip
          ? state?.data?.IsDepartmentSlip
          : 0,
        IsSampleRecollection: state?.data?.IsSampleRecollection
          ? state?.data?.IsSampleRecollection
          : 0,
        HideAmount: state?.data?.HideAmount ? state?.data?.HideAmount : 0,
        HideReceipt: state?.data?.HideReceipt ? state?.data?.HideReceipt : 0,
        IsDoctorShareRequired: state?.data?.IsDoctorShareRequired
          ? state?.data?.IsDoctorShareRequired
          : 0,
        isActive: state?.data ? state?.data?.isActive : 1,
        CentreID: state?.data?.CentreID ? state?.data?.CentreID : 0,
        UserName: state?.data?.Username ? state?.data?.Username : "",
        Password: state?.data?.Password ? state?.data?.Password : "",
        isAllowedLogin: state?.data?.IsAllowedLogin
          ? state?.data?.IsAllowedLogin
          : 0,
        userLoginID: state?.data?.userLoginID ? state?.data?.userLoginID : 0,
        centreIDHash: state?.data?.centreIDHash
          ? state?.data?.centreIDHash
          : guidNumber(),
        AgainstInvoice: state?.data?.AgainstInvoice
          ? state?.data?.AgainstInvoice
          : "",
        isNabl: state?.data?.isNabl ? state?.data?.isNabl : 0,
        SecurityRemark: state?.data?.SecurityRemark
          ? state?.data?.SecurityRemark
          : "",
        SecurityAmount: state?.data?.SecurityAmount
          ? state?.data?.SecurityAmount
          : "",
        DemandDraft: state?.data?.DemandDraft ? state?.data?.DemandDraft : "",
        BenificialName: state?.data?.BenificialName
          ? state?.data?.BenificialName
          : "",
        BankAccountNo: state?.data?.BankAccountNo
          ? state?.data?.BankAccountNo
          : "",
        bankName: state?.data?.bankName ? state?.data?.bankName : "",
        IFSCCode: state?.data?.IFSCCode ? state?.data?.IFSCCode : "",
        BranchAddress: state?.data?.BranchAddress
          ? state?.data?.BranchAddress
          : "",
        PANNo: state?.data?.PANNo ? state?.data?.PANNo : "",
        Description: state?.data?.Description ? state?.data?.Description : "",
        RegisteredOffice: state?.data?.RegisteredOffice
          ? state?.data?.RegisteredOffice
          : "",
        Gstin: state?.data?.Gstin ? state?.data?.Gstin : "",
        FullyPaid: state?.data?.FullyPaid ? state?.data?.FullyPaid : 0,
        SetMRP: state?.data?.SetMRP ? state?.data?.SetMRP : 0,
        skipTimeType: state?.data?.skipTimeType
          ? state?.data?.skipTimeType
          : "NA",
        CreditLimitInRs: state?.data?.CreditLimitInRs
          ? state?.data?.CreditLimitInRs
          : "",
        CreditLimitInTime: state?.data?.CreditLimitInTime
          ? state?.data?.CreditLimitInTime
          : "",
        skipValue: state?.data?.skipValue ? state?.data?.skipValue : "",
        isAutoEmail: state?.data?.isAutoEmail ? state?.data?.isAutoEmail : 0,
        BillCode: state?.data?.BillCode ? state?.data?.BillCode : "",
      });
    } else if (name === "Rate") {
      setFormData({
        dtEntry: state?.data?.dtEntry ? state?.data?.dtEntry : new Date(),

        Type: state?.data?.Type ? state?.data?.Type : "",
        DataType: state?.data?.DataType ? state?.data?.DataType : "RateType",
        CentreCode: state?.data?.CentreCode ? state?.data?.CentreCode : "",
        Centre: state?.data?.Centre ? state?.data?.Centre : "",
        CentreType: state?.data?.CentreType ? state?.data?.CentreType : "",
        AgainstInvoice: state?.data?.AgainstInvoice
          ? state?.data?.AgainstInvoice
          : "",
        InvoiceTo: state?.data?.InvoiceTo ? state?.data?.InvoiceTo : "Self",
        BusinessUnit: state?.data?.BusinessUnit
          ? state?.data?.BusinessUnit
          : "Self",
        ProcessingLab: state?.data?.ProcessingLab
          ? state?.data?.ProcessingLab
          : "Self",
        ReferenceRate: state?.data?.ReferenceRate
          ? state?.data?.ReferenceRate
          : "Self",
        Address1: state?.data?.Address1 ? state?.data?.Address1 : "",
        Address2: state?.data?.Address2 ? state?.data?.Address2 : "",
        City: state?.data?.City ? state?.data?.City : "",
        BusinessZone: state?.data?.BusinessZone
          ? state?.data?.BusinessZone
          : "",
        State: state?.data?.State ? state?.data?.State : "",
        Country: state?.data?.Country ? state?.data?.Country : "",
        Pincode: state?.data?.Pincode ? state?.data?.Pincode : "",
        Email: state?.data?.Email ? state?.data?.Email : "",
        LandLineNo: state?.data?.LandLineNo ? state?.data?.LandLineNo : "",
        Phone: state?.data?.Phone ? state?.data?.Phone : "",
        StateCode: state?.data?.StateCode ? state?.data?.StateCode : "",
        Fax: state?.data?.Fax ? state?.data?.Fax : "",
        Url: state?.data?.Url ? state?.data?.Url : "",
        PaymentMode: state?.data?.PaymentMode
          ? state?.data?.PaymentMode
          : "Cash",
        VisitType: state?.data?.VisitType ? state?.data?.VisitType : 1,
        BarcodeLogic: state?.data?.BarcodeLogic ? state?.data?.BarcodeLogic : 1,
        SampleCollectandReceive: state?.data?.SampleCollectandReceive
          ? state?.data?.SampleCollectandReceive
          : 0,
        CityZone: state?.data?.CityZone ? state?.data?.CityZone : "",
        ReferenceRate1: state?.data?.ReferenceRate1
          ? state?.data?.ReferenceRate1
          : 0,
        ReferenceRate2: state?.data?.ReferenceRate2
          ? state?.data?.ReferenceRate2
          : 0,
        IsTrfRequired: state?.data?.IsTrfRequired
          ? state?.data?.IsTrfRequired
          : 0,
        IsDepartmentSlip: state?.data?.IsDepartmentSlip
          ? state?.data?.IsDepartmentSlip
          : 0,
        IsSampleRecollection: state?.data?.IsSampleRecollection
          ? state?.data?.IsSampleRecollection
          : 0,
        HideAmount: state?.data?.HideAmount ? state?.data?.HideAmount : 0,
        HideReceipt: state?.data?.HideReceipt ? state?.data?.HideReceipt : 0,
        IsDoctorShareRequired: state?.data?.IsDoctorShareRequired
          ? state?.data?.IsDoctorShareRequired
          : 0,
        isActive: state?.data ? state?.data?.isActive : 1,
        CentreID: state?.data?.CentreID ? state?.data?.CentreID : 0,
        UserName: state?.data?.Username ? state?.data?.Username : "",
        Password: state?.data?.Password ? state?.data?.Password : "",
        isAllowedLogin: state?.data?.IsAllowedLogin
          ? state?.data?.IsAllowedLogin
          : 0,
        userLoginID: state?.data?.userLoginID ? state?.data?.userLoginID : 0,
        centreIDHash: state?.data?.centreIDHash
          ? state?.data?.centreIDHash
          : guidNumber(),

        CreditLimit:
          state?.data?.CreditLimit !== undefined &&
          state?.data?.CreditLimit !== null
            ? state?.data?.CreditLimit
            : state?.data?.CreditLimit === 0
              ? 0
              : "",
        SecurityAmount: state?.data?.SecurityAmount
          ? state?.data?.SecurityAmount
          : "",
        LockRegistration: state?.data?.LockRegistration
          ? state?.data?.LockRegistration
          : 0,
        LockReport: state?.data?.LockReport ? state?.data?.LockReport : 0,
        isAutoEmail: state?.data?.isAutoEmail ? state?.data?.isAutoEmail : 0,
        IsRollingAdvance: state?.data?.IsRollingAdvance
          ? state?.data?.IsRollingAdvance
          : 0,
        GraceTime: state?.data?.GraceTime ? state?.data?.GraceTime : "",
        SecurityRemark: state?.data?.SecurityRemark
          ? state?.data?.SecurityRemark
          : "",
        IntimationLimit:
          state?.data?.IntimationLimit !== undefined &&
          state?.data?.IntimationLimit !== null
            ? state?.data?.IntimationLimit
            : state?.data?.IntimationLimit === 0
              ? 0
              : "",
        InvoiceDisplayName: state?.data?.InvoiceDisplayName
          ? state?.data?.InvoiceDisplayName
          : "",
        InvoiceEmail: state?.data?.InvoiceEmail
          ? state?.data?.InvoiceEmail
          : "",
        SalesManager: state?.data?.SalesManager
          ? state?.data?.SalesManager
          : "",
        BillingCycle: state?.data?.BillingCycle
          ? state?.data?.BillingCycle
          : "Monthly",
        Gstin: state?.data?.Gstin ? state?.data?.Gstin : "",
        ProEmployee: state?.data?.ProEmployee ? state?.data?.ProEmployee : "",
        BankAccountNo: state?.data?.BankAccountNo
          ? state?.data?.BankAccountNo
          : "",
        FullyPaid: state?.data?.FullyPaid ? state?.data?.FullyPaid : 0,
        SetMRP: state?.data?.SetMRP ? state?.data?.SetMRP : 0,
        skipTimeType: state?.data?.skipTimeType
          ? state?.data?.skipTimeType
          : "NA",
        CreditLimitInRs: state?.data?.CreditLimitInRs
          ? state?.data?.CreditLimitInRs
          : "",
        CreditLimitInTime: state?.data?.CreditLimitInTime
          ? state?.data?.CreditLimitInTime
          : "",
        skipValue: state?.data?.skipValue ? state?.data?.skipValue : "",
        IsAutoPRDM: state?.data?.IsAutoPRDM ? state?.data?.IsAutoPRDM : 0,
      });
    }
  }, [name]);

  //fetching document required
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
        setDoc(RequiredAttachment);
      })
      .catch((err) => console.log(err));
  };

  const getInvoiceTo = () => {
    axiosInstance
      .get("Centre/CentreInvoiceToList")
      .then((res) => {
        let data = res.data.message;
        let InvoiceData = data.map((ele) => {
          return {
            value: ele.InvoiceID,
            label: ele.Invoice,
          };
        });
        InvoiceData.unshift({ label: "Self", value: "Self" });
        setInvoice(InvoiceData);
      })
      .catch((err) => console.log(err));
  };

  const getProEmployee = () => {
    axiosInstance
      .get("Employee/ProEmployee")
      .then((res) => {
        let data = res?.data?.message;
        let proData = data?.map((ele) => {
          return {
            value: ele?.EmployeeID,
            label: ele?.EmployeeName,
          };
        });
        setProEmployee(proData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getCentreBusinessUnit = () => {
    axiosInstance
      .get("Centre/CentreBusinessUnit")
      .then((res) => {
        let data = res.data.message;
        let CentreBusinessUnit = data.map((ele) => {
          return {
            value: ele.BusinessUnitID,
            label: ele.BusinessUnit,
          };
        });
        CentreBusinessUnit.unshift({ label: "Self", value: "Self" });
        setBusinessUnit(CentreBusinessUnit);
      })
      .catch((err) => console.log(err));
  };
  const getCentreProcessingLab = () => {
    axiosInstance
      .get("Centre/CentreProcessingLab")
      .then((res) => {
        let data = res.data.message;
        let CentreLab = data.map((ele) => {
          return {
            value: ele.ProcessingLabID,
            label: ele.ProcessingLab,
          };
        });
        CentreLab.unshift({ label: "Self", value: "Self" });
        setProcessingLab(CentreLab);
      })
      .catch((err) => console.log(err));
  };

  const handleCheckDuplicate = () => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post("Centre/checkDuplicateCentreCode", {
          CentreCode: formData?.CentreCode,
          CentreID: formData?.CentreID != 0 ? formData?.CentreID : "",
        })
        .then((res) => {
          if (res?.data?.message === "Duplicate CentreCode.") {
            toast.error(res?.data?.message);
            setFormData({ ...formData, CentreCode: "" });
          }
          resolve(res?.data?.message);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          reject(err);
        });
    });
  };
  const getReferenceRate = () => {
    axiosInstance
      .get("Centre/CentreReferRateList")
      .then((res) => {
        let data = res.data.message;
        let CentreReferRate = data.map((ele) => {
          return {
            value: ele.ReferenceRateID,
            label: ele.ReferenceRate,
          };
        });
        CentreReferRate.unshift({ label: "Self", value: "Self" });
        setReferenceRate(CentreReferRate);
      })
      .catch((err) => console.log(err));
  };

  const getVisitTypeList = () => {
    axiosInstance
      .get("Centre/visitTypeList")
      .then((res) => {
        let data = res.data.message;
        let VisitTypeList = data.map((ele) => {
          return {
            value: ele.FieldID,
            label: ele.FieldDisplay,
          };
        });
        setVisitType(VisitTypeList);
      })
      .catch((err) => console.log(err));
  };
  const getBarCodeLogic = () => {
    axiosInstance
      .get("Centre/BarcodeLogicList")
      .then((res) => {
        let data = res.data.message;
        let Barcode = data.map((ele) => {
          return {
            value: ele.BarcodeID,
            label: ele.BarcodeDisplay,
          };
        });
        setBarCodeLogic(Barcode);
      })
      .catch((err) => console.log(err));
  };

  const getDropDownData = (name) => {
    axiosInstance
      .post("Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res?.data?.message;
        let value = data?.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        switch (name) {
          case "CentreType":
            setCentreType(value);
            break;
        }
      })
      .catch((err) => console.log(err));
  };
  // console.log(formData);
  // const { errors, handleBlur, touched, handleSubmit } = useFormik({
  //   initialValues: formData,
  //   enableReinitialize: state?.url ? true : true,
  //   validationSchema:
  //     name === "center"
  //       ? CenterMasterValidationSchema
  //       : formData?.PaymentMode === "Credit"
  //         ? RateMasterValidationSchema
  //         : RateMasterValidationSchemacash,
  //   onSubmit: (values) => {
  //     if ([1, 2, 3, 4, 5].includes(formData?.Pincode.length)) {
  //       toast.error("Please Enter Correct Pin Code");
  //     }
  //     // const billCode = String(formData?.BillCode).trim();
  //     // if (!/^[a-zA-Z0-9]{6}$/.test(billCode)) {
  //     //   toast.error("BillCode must be exactly 6 digits ");
  //     //   return;
  //     // }
  //     if (formData?.CentreType === "Processing Lab") {
  //       const billCode = String(formData?.BillCode).trim();
  //       if (!/^[a-zA-Z0-9]{6}$/.test(billCode)) {
  //         toast.error("BillCode must be exactly 6 Digits");
  //         return;
  //       }
  //     }
  //     setLoad(true);

  //       handleCheckDuplicate().then((res) => {
  //         if (res === "Duplicate CentreCode.") {
  //           setLoad(false);
  //         } else {
  //           axiosInstance
  //             .post(
  //               state?.url ? state?.url : "Centre/InsertCentre",
  //               getTrimmedData({
  //                 ...values,
  //                 InvoiceTo:
  //                   values?.InvoiceTo === "Self" ? 0 : values?.InvoiceTo,
  //                 BusinessUnit:
  //                   values?.BusinessUnit === "Self" ? 0 : values?.BusinessUnit,
  //                 ProcessingLab:
  //                   values?.ProcessingLab === "Self"
  //                     ? 0
  //                     : values?.ProcessingLab,
  //                 ReferenceRate:
  //                   values?.ReferenceRate === "Self"
  //                     ? 0
  //                     : values?.ReferenceRate,
  //                 skipTimeType: values?.skipTimeType?.toString(),
  //                 skipValue: values?.skipValue?.toString(),
  //                 isActive: values?.isActive ? 1 : 0,
  //                 isNabl: values?.isNabl ? 1 : 0,
  //                 BillCode: formData?.BillCode,
  //               })
  //             )
  //             .then((res) => {
  //               if (res.data.message) {
  //                 navigate(`/CentreMasterList/${name}`);
  //                 toast.success(res.data.message);
  //                 setLoad(false);
  //               } else {
  //                 toast.error("Something went wrong");
  //                 toast.success(res.data.message);
  //                 setLoad(false);
  //               }
  //             })
  //             .catch((err) => {
  //               toast.error(
  //                 err?.response?.data?.message
  //                   ? err?.response?.data?.message
  //                   : "Error Occured"
  //               );
  //               setLoad(false);
  //             });
  //         }
  //       });
  //     }
  //   },
  // });

  const { errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: formData,
    enableReinitialize: true,
    validationSchema:
      name === "center"
        ? CenterMasterValidationSchema
        : formData?.PaymentMode === "Credit"
          ? RateMasterValidationSchema
          : RateMasterValidationSchemacash,

    onSubmit: (values) => {
      if ([1, 2, 3, 4, 5].includes(formData?.Pincode.length)) {
        toast.error("Please Enter Correct Pin Code");
        return;
      }

      if (formData?.CentreType === "Processing Lab") {
        const billCode = String(formData?.BillCode).trim();
        if (!/^[a-zA-Z0-9]{6}$/.test(billCode)) {
          toast.error("BillCode must be exactly 6 Digits");
          return;
        }
      }

      setLoad(true);

      handleCheckDuplicate().then((res) => {
        if (res === "Duplicate CentreCode.") {
          setLoad(false);
        } else {
          axiosInstance
            .post(
              state?.url ? state?.url : "Centre/InsertCentre",
              getTrimmedData({
                ...values,
                InvoiceTo: values?.InvoiceTo === "Self" ? 0 : values?.InvoiceTo,
                BusinessUnit:
                  values?.BusinessUnit === "Self" ? 0 : values?.BusinessUnit,
                ProcessingLab:
                  values?.ProcessingLab === "Self" ? 0 : values?.ProcessingLab,
                ReferenceRate:
                  values?.ReferenceRate === "Self" ? 0 : values?.ReferenceRate,
                skipTimeType: values?.skipTimeType?.toString(),
                skipValue: values?.skipValue?.toString(),
                isActive: values?.isActive ? 1 : 0,
                isNabl: values?.isNabl ? 1 : 0,
                // BillCode: formData?.BillCode,
                BillCode: formData?.CentreType === "Processing Lab" ? formData?.BillCode : "",
                IsPatientFullPaid: formData?.IsPatientFullPaid || 0,
              })
            )
            .then((res) => {
              if (res.data.message) {
                navigate(`/CentreMasterList/${name}`);
                toast.success(res.data.message);
              } else {
                toast.error("Something went wrong");
              }
              setLoad(false);
            })
            .catch((err) => {
              toast.error(err?.response?.data?.message || "Error Occurred");
              setLoad(false);
            });
        }
      });
    },
  });

  const handleChange = (e) => {
    console.log(e);
    const { name, value, type, checked } = e.target;
    const reg = /^([^0-9$%]*)$/;

    if (name === "CentreCode") {
      setFormData({
        ...formData,
        [name]: ["CentreCode"].includes(name)
          ? PreventSpecialCharacter(value)
            ? value.toUpperCase()
            : formData[name]
          : value.toUpperCase(),
      });
    } else if (name === "BillCode") {
      const BillCode = value.trim().toUpperCase();

      // if (!/^\d{0,6}$/.test(BillCode)) {
      //   toast.warning("Bill No should not be more than 6 digits");
      //   return;
      // }

      // if (billNo.length > 0 && billNo.length < 6) {
      //   toast.warning("Bill No should not be less than 6 digits");
      //   return;
      // }

      setFormData((prev) => ({
        ...prev,
        [name]: BillCode,
      }));
    } else if (name == "skipTimeType") {
      setFormData({
        ...formData,
        [name]: value,
        skipValue: "",
      });
    } else if (
      name === "BankAccountNo" ||
      name === "IFSCCode" ||
      name === "PANNo"
    ) {
      setFormData({
        ...formData,
        [name]: PreventSpecialCharacter(value) ? value : formData[name],
      });
    } else if (name === "Centre") {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]:
          type === "checkbox"
            ? checked
              ? 1
              : 0
            : [
                  "City",
                  "State",
                  "Country",
                  "CityZone",
                  "BusinessZone",
                  "BenificialName",
                  "bankName",
                  "InvoiceDisplayName",
                ].includes(name)
              ? PreventNumber(value)
                ? value
                : formData[name]
              : [""].includes(name)
                ? PreventSpecialCharacter(value)
                  ? value
                  : formData[name]
                : value,
      });
    }
  };
  const getTypeName = () => {
    const btb = type?.filter((ele) => ele?.value == formData?.Type);
    if (btb[0]?.label == "B2B") return true;
    else return false;
  };
  const handleSelectChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updated = { ...prev, [name]: value };

      if (name === "CentreType" && value !== "Processing Lab") {
        updated.BillCode = "";
      }

      return updated;
    });
    if (name == "PaymentMode") {
      setFormData({
        ...formData,
        [name]: value,
        IntimationLimit: "",
        CreditLimit: "",
        AgainstInvoice: "",
        IsRollingAdvance: 0,
        skipValue: "",
        skipTimeType: "",
        CreditLimitInRs: "",
        CreditLimitInTime: "",
        LockRegistration: 0,
        LockReport: 0,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSearchSelectChange = (label, value) => {
    setFormData({ ...formData, [label]: value?.value });
  };

  const getType = () => {
    axiosInstance
      .get("centre/getCentreType")
      .then((res) => {
        const data = res?.data?.message;
        const Type = data?.map((ele) => {
          return {
            value: ele?.id,
            label: ele?.Centretype,
          };
        });
        setType(Type);
      })
      .catch((err) => {
        toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong");
      });
  };

  const getSalesManager = () => {
    axiosInstance
      .get("Accounts/getAllsalesManager")
      .then((res) => {
        const data = res?.data?.message;

        const Type = data?.map((ele) => {
          return {
            value: ele?.PROID,
            label: ele?.ProName,
          };
        });
        setSalesManager(Type);
      })
      .catch((err) => {
        toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong");
      });
  };

  useEffect(() => {
    getSalesManager();
    getInvoiceTo();
    getCentreProcessingLab();
    getReferenceRate();
    getBarCodeLogic();
    getVisitTypeList();
    getCentreBusinessUnit();
    getDropDownData("CentreType");
    getRequiredAttachment();
    getType();
    getProEmployee();
  }, []);

  const handleInput = (e) => {
    const value = Number(e.target.value.trim());
    const skipTimeType = formData?.skipTimeType;
    if (!/^\d+$/.test(value)) {
      return;
    }
    if (skipTimeType == "1" && (value < 0 || value > 23)) {
      return;
    }
    if (skipTimeType == "2" && (value < 0 || value > 6)) {
      return;
    }
    if (skipTimeType == "3" && (value < 0 || value > 4)) {
      return;
    }

    handleChange(e);
  };
  return (
    <>
      {show && (
        <UploadFile
          show={show}
          handleClose={() => setShow(false)}
          documentId={formData?.centreIDHash}
          pageName={
            name === t("center") ? t("CentreMaster") : t("RateTypeMaster")
          }
        />
      )}

      {show1 && (
        <UploadFile
          show={show1}
          handleClose={() => setShow1(false)}
          documentId={formData?.centreIDHash}
          pageName={"centreMasterNabl"}
        />
      )}

      {show2 && (
        <UploadFile
          show={show2}
          handleClose={() => setShow2(false)}
          documentId={formData?.centreIDHash}
          pageName={"centreMasterReceipt"}
        />
      )}

      {show3 && (
        <UploadFile
          show={show3}
          handleClose={() => setShow3(false)}
          documentId={formData?.centreIDHash}
          pageName={"attachmentHeader"}
        />
      )}

      {show4 && (
        <UploadFile
          show={show4}
          handleClose={() => setShow4(false)}
          documentId={formData?.centreIDHash}
          pageName={"attachmentfooter"}
        />
      )}
      {show5 && (
        <UploadFile
          show={show5}
          handleClose={() => setShow5(false)}
          documentId={formData?.centreIDHash}
          pageName={"b2bqrcode"}
        />
      )}
      {show6 && (
        <UploadFile
          show={show6}
          handleClose={() => setShow6(false)}
          documentId={formData?.centreIDHash}
          pageName={"Stamp"}
        />
      )}

      {/* <Heading
        name={name === t("center") ? t("CentreMaster") : t("RateTypeMaster")}
        isBreadcrumb={true}
      /> */}
      <Accordion
        name={name === t("center") ? t("CentreMaster") : t("RateTypeMaster")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row pt-2 pl-2 pr-2">
          {name === "center" && (
            <div className="col-sm-2 col-md-2">
              <SelectBox
                options={CentreType}
                id="Type"
                lable="Type"
                onChange={handleSelectChange}
                name="CentreType"
                selectedValue={formData?.CentreType}
                isDisabled={state?.data ? true : false}
              />
            </div>
          )}
          <div className="col-sm-2 col-md-2">
            <SelectBox
              onChange={handleChange}
              selectedValue={formData?.Type}
              className="required-fields"
              id="Centre Type"
              lable="Centre Type"
              name="Type"
              type="text"
              options={[{ label: "Select Centre Type", value: "" }, ...type]}
            />
            {errors?.Type && touched?.Type && (
              <div className="error-message">{errors?.Type}</div>
            )}
          </div>
          <div className="col-sm-2 col-md-2">
            <Input
              max={10}
              lable="Centre Code"
              id="CentreCode"
              className="required-fields"
              placeholder=" "
              onChange={handleChange}
              value={formData?.CentreCode}
              name="CentreCode"
              onBlur={() => {
                handleCheckDuplicate();
              }}
              onInput={(e) => number(e, 10)}
            />
            {errors?.CentreCode && touched?.CentreCode && (
              <div className="error-message">{errors?.CentreCode}</div>
            )}
          </div>
          <div className="col-sm-2 col-md-2">
            <Input
              lable="Centre"
              className="required-fields"
              id="Centre Name"
              placeholder=" "
              onChange={handleChange}
              max={60}
              value={formData?.Centre}
              name="Centre"
              onBlur={handleBlur}
              type="text"
            />
            {errors?.Centre && touched?.Centre && (
              <div className="error-message">{errors?.Centre}</div>
            )}
          </div>
          {/* {name === "Rate" && (
            <>
              <div className="col-sm-2 col-md-2 ">
                <SelectBox
                  name="GraceTime"
                  id="GraceTime"
                  lable="GraceTime"
                  selectedValue={formData?.GraceTime}
                  options={GraceTime}
                  onChange={handleSelectChange}
                />
                {errors?.GraceTime && touched?.GraceTime && (
                  <div className="error-message">{errors?.GraceTime}</div>
                )}
              </div>
            </>
          )} */}
          {name === "Rate" && (
            <>
              <div className="col-sm-2 col-md-2 ">
                <SelectBox
                  options={[{ label: "Select", value: "" }, ...proEmplyee]}
                  name="ProEmployee"
                  id="ProEmployee"
                  lable="ProEmployee"
                  selectedValue={formData?.ProEmployee}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          <div className="col-sm-2 col-md-2">
            <Input
              lable="Address1"
              id="Address1"
              onChange={handleChange}
              value={formData?.Address1}
              name="Address1"
              type="text"
              placeholder=" "
              max={50}
            />
          </div>
          <div className="col-sm-2 col-md-2">
            <Input
              lable="Address2"
              id="Address2"
              placeholder=" "
              onChange={handleChange}
              value={formData?.Address2}
              name="Address2"
              max={50}
              min={4}
            />
          </div>
        </div>
        <div className="row pt-1 pl-2 pr-2">
          <div className="col-sm-2 col-md-2">
            <Input
              lable="PinCode"
              id="PinCode"
              placeholder=" "
              onInput={(e) => number(e, 6)}
              type="number"
              onChange={handleChange}
              value={formData?.Pincode}
              name="Pincode"
            />
          </div>
          <div className="col-sm-2 col-md-2">
            <Input
              lable="City"
              id="City"
              placeholder=" "
              onChange={handleChange}
              value={formData?.City}
              name="City"
              type="text"
              max={25}
            />
          </div>
          <div className="col-sm-2 col-md-2">
            <Input
              lable="State"
              id="State"
              placeholder=" "
              onChange={handleChange}
              value={formData?.State}
              name="State"
              type="text"
              max={25}
            />
          </div>
          <div className="col-sm-2 col-md-2">
            <Input
              lable="Country"
              id="Country"
              placeholder=" "
              onChange={handleChange}
              value={formData?.Country}
              name="Country"
              type="text"
              max={25}
            />
          </div>
          <div className="col-sm-2 col-md-2">
            <Input
              lable="CityZone"
              id="CityZone"
              placeholder=" "
              onChange={handleChange}
              value={formData?.CityZone}
              name="CityZone"
              type="text"
              max={25}
            />
          </div>
          <div className="col-sm-2 col-md-2">
            <Input
              lable="Email(Report)"
              id="Email"
              placeholder=" "
              onChange={handleChange}
              value={formData?.Email}
              name="Email"
              type="email"
              max={50}
            />
            {errors?.Email && touched?.Email && (
              <div className="error-message">{errors?.Email}</div>
            )}
          </div>
        </div>
        <div className="row pt-1 pl-2 pr-2">
          <div className="col-sm-2 col-md-2 ">
            <Input
              lable="Phone"
              id="Phone"
              placeholder=" "
              onInput={(e) => number(e, 12)}
              type="number"
              onChange={handleChange}
              value={formData?.Phone}
              name="Phone"
            />
            {errors?.Phone && touched?.Phone && (
              <div className="error-message">{errors?.Phone}</div>
            )}
          </div>
          <div className="col-sm-2 col-md-2">
            <Input
              lable="LandLineNo"
              id="LandLineNo"
              placeholder=" "
              onInput={(e) => number(e, 12)}
              type="number"
              onChange={handleChange}
              value={formData?.LandLineNo}
              name="LandLineNo"
            />
          </div>
          <div className="col-sm-2 col-md-2">
            <Input
              lable="Website"
              id="Website"
              placeholder=" "
              onChange={handleChange}
              name="Url"
              value={formData?.Url}
              type="text"
              max={50}
            />
            {errors?.Url && touched?.Url && (
              <div className="error-message">{errors?.Url}</div>
            )}
          </div>
          <div className="col-sm-2 col-md-2">
            <Input
              lable="BusinessZone"
              id="BusinessZone"
              placeholder=" "
              onChange={handleChange}
              value={formData?.BusinessZone}
              name="BusinessZone"
              type="text"
              max={25}
            />
          </div>
          <div className="col-sm-2 col-md-2 ">
            <Input
              lable="StateCode"
              id="StateCode"
              placeholder=" "
              onChange={handleChange}
              value={formData?.StateCode}
              name="StateCode"
              type="number"
              onInput={(e) => number(e, 2)}
            />
          </div>
          <div className="col-sm-2 col-md-2 ">
            <Input
              lable="Fax"
              id="Fax"
              placeholder=" "
              onChange={handleChange}
              value={formData?.Fax}
              name="Fax"
              type="text"
              onInput={(e) => number(e, 20)}
            />
          </div>
        </div>
        <div className="row pt-1 pl-2 pr-2">
          <div className="col-sm-2 col-md-2 ">
            <SelectBox
              options={VisitType}
              name="VisitType"
              id="VisitType"
              lable="VisitType"
              selectedValue={formData?.VisitType}
              onChange={handleSelectChange}
            />
          </div>
          {name === "center" && (
            <>
              <div className="col-sm-2 col-md-2 ">
                <Input
                  lable="GSTIN No."
                  id="GSTINNo"
                  placeholder=" "
                  onChange={handleChange}
                  value={formData?.Gstin}
                  name="Gstin"
                  type="text"
                  max={20}
                />
              </div>
              <div className="col-sm-2 col-md-2 ">
                {formData?.CentreType === "Processing Lab" && (
                  <Input
                    lable="BillCode"
                    id="BillCode"
                    placeholder=" "
                    onChange={handleChange}
                    value={formData?.BillCode}
                    name="BillCode"
                    type="text"
                    maxLength={6}
                    disabled={!!state?.data?.BillCode}
                    className="required-fields"
                  />
                )}

                {/* <Input
                  lable="BillCode"
                  id="BillCode"
                  placeholder=" "
                  onChange={handleChange}
                  value={formData?.BillCode}
                  name="BillCode"
                  type="text"
                  maxLength={6}
                  disabled={state?.data?.BillCode ? true : false}
                  className="required-fields"
                /> */}
                {errors?.Centre && touched?.BillCode && (
                  <div className="error-message">{errors?.BillCode}</div>
                )}
              </div>
            </>
          )}

          {name == "Rate" && (
            <>
              <div className="col-sm-2 col-md-2 ">
                <SelectBox
                  options={PaymentMode}
                  name="PaymentMode"
                  id="PaymentMode"
                  lable="PaymentMode"
                  selectedValue={formData?.PaymentMode}
                  onChange={handleSelectChange}
                  isDisabled={state?.data ? true : false}
                />
              </div>
            </>
          )}
          {name === "Rate" && (
            <>
              {formData?.PaymentMode === "Cash" ? (
                <div className="col-sm-2 col-md-2 ">
                  <Input
                    placeholder=" "
                    lable="CreditLimit"
                    id="CreditLimit"
                    type="number"
                    value={formData?.CreditLimit}
                    name="CreditLimit"
                    onChange={handleChange}
                    onInput={(e) => number(e, 30)}
                    disabled
                  />
                  {formData?.PaymentMode == "Credit" && (
                    <>
                      {errors?.CreditLimit && touched?.CreditLimit && (
                        <div className="error-message">
                          {errors?.CreditLimit}
                        </div>
                      )}{" "}
                    </>
                  )}
                </div>
              ) : (
                <div className="col-sm-2 col-md-2 ">
                  <Input
                    placeholder=" "
                    lable="CreditLimit"
                    id="CreditLimit"
                    type="number"
                    value={formData?.CreditLimit}
                    name="CreditLimit"
                    onChange={handleChange}
                    onInput={(e) => number(e, 30)}
                  />
                </div>
              )}
            </>
          )}
          {name === "Rate" && (
            <>
              {formData?.PaymentMode === "Cash" ? (
                <div className="col-sm-2 col-md-2 ">
                  <Input
                    placeholder=" "
                    lable="IntimationLimit"
                    id="IntimationLimit"
                    type="number"
                    value={formData?.IntimationLimit}
                    name="IntimationLimit"
                    onChange={handleChange}
                    max={30}
                    onInput={(e) => number(e, 30)}
                    disabled
                  />
                  {formData?.PaymentMode == "Credit" && (
                    <>
                      {errors?.IntimationLimit && touched?.IntimationLimit && (
                        <div className="error-message">
                          {errors?.IntimationLimit}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="col-sm-2 col-md-2 ">
                  <Input
                    placeholder=" "
                    lable="IntimationLimit"
                    id="IntimationLimit"
                    type="number"
                    value={formData?.IntimationLimit}
                    name="IntimationLimit"
                    onChange={handleChange}
                    max={30}
                    onInput={(e) => number(e, 30)}
                  />
                  {formData?.PaymentMode == "Credit" && (
                    <>
                      {errors?.IntimationLimit && touched?.IntimationLimit && (
                        <div className="error-message">
                          {errors?.IntimationLimit}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              <div className="col-sm-1">
                <input
                  name="HideAmount"
                  type="checkbox"
                  id="HideAmount"
                  onChange={handleChange}
                  checked={formData?.HideAmount}
                />
                <label htmlFor="HideAmount" className="control-label ml-2">
                  {t("HideAmount")}
                </label>
              </div>

              <div className="col-sm-1 col-md-1">
                <input
                  type="checkbox"
                  name="LockRegistration"
                  checked={formData?.LockRegistration === 0 ? false : true}
                  onChange={handleChange}
                  disabled={formData.PaymentMode == "Cash"}
                />
                <label className="control-label ml-2" htmlFor="inputEmail3">
                  {t("LockRegist.")}
                </label>
              </div>

              <div className="col-sm-1 col-md-1">
                <input
                  type="checkbox"
                  name="LockReport"
                  checked={formData?.LockReport === 0 ? false : true}
                  onChange={handleChange}
                  onInput={(e) => number(e, 30)}
                  disabled={formData?.PaymentMode == "Cash"}
                />
                <label className="control-label ml-2" htmlFor="inputEmail3">
                  {t("Lock Report")}
                </label>
              </div>
              <div className="col-sm-1 col-md-1">
                <input
                  type="checkbox"
                  name="isAutoEmail"
                  id="isAutoEmail"
                  onChange={handleChange}
                  checked={formData?.isAutoEmail === 0 ? false : true}
                />
                <label className="control-label ml-2" htmlFor="isAutoEmail">
                  {t("IsAutoEmail")}
                </label>
              </div>
            </>
          )}
          {/* {name === "Rate" && (
            <>
              <div className="col-sm-2 col-md-2 ">
                <Input
                  placeholder=" "
                  lable="SecurityAmount"
                  id="SecurityAmount"
                  type="number"
                  value={formData?.SecurityAmount}
                  name="SecurityAmount"
                  onChange={handleChange}
                  onInput={(e) => number(e, 30)}
                />
              </div>
            </>
          )}
          {name === "Rate" && (
            <>
              <div className="col-sm-2 col-md-2 ">
                <Input
                  placeholder=" "
                  lable="SecurityRemark"
                  id="SecurityRemark"
                  value={formData?.SecurityRemark}
                  name="SecurityRemark"
                  onChange={handleChange}
                  max={30}
                  // onInput={(e) => number(e, 30)}
                />
              </div>
            </>
          )} */}
        </div>
        <div className="row pt-1 pl-2 pr-2">
          {name === "Rate" && (
            <>
              <div className="col-sm-2 col-md-2">
                <SelectBox
                  options={AgainstInvoice}
                  name="AgainstInvoice"
                  id="AgainstInvoice"
                  lable="AgainstInvoice"
                  selectedValue={formData?.AgainstInvoice}
                  onChange={handleSelectChange}
                />
                {errors?.AgainstInvoice && touched?.AgainstInvoice && (
                  <div className="error-message">{errors?.AgainstInvoice}</div>
                )}
              </div>
            </>
          )}
          {name === "Rate" && (
            <>
              <div className="col-sm-2 col-md-2 ">
                <Input
                  placeholder=" "
                  lable="InvoiceDisplayName"
                  id="InvoiceDisplayName"
                  type="text"
                  value={formData?.InvoiceDisplayName}
                  name="InvoiceDisplayName"
                  onChange={handleChange}
                  max={30}
                />
              </div>
            </>
          )}
          {name === "Rate" && (
            <>
              <div className="col-sm-2 col-md-2 ">
                <Input
                  placeholder=" "
                  lable="Email(Invoice)"
                  id="Email"
                  value={formData?.InvoiceEmail}
                  name="InvoiceEmail"
                  onChange={handleChange}
                  type="email"
                  max={50}
                />
                {errors?.InvoiceEmail && touched?.InvoiceEmail && (
                  <div className="error-message">{errors?.InvoiceEmail}</div>
                )}
              </div>
            </>
          )}
          {name === "Rate" && (
            <>
              <div className="col-sm-2 col-md-2 ">
                <SelectBox
                  options={[
                    { label: t("Select Sales Manager"), value: "" },
                    ...salesManager,
                  ]}
                  id="SalesManager"
                  lable="SalesManager"
                  selectedValue={formData?.SalesManager}
                  name="SalesManager"
                  onChange={handleChange}
                />
              </div>
              <div className="col-sm-1 col-md-2 col-xl-1">
                <input
                  type="checkbox"
                  name="IsAutoPRDM"
                  id="IsAutoPRDM"
                  onChange={handleChange}
                  checked={formData?.IsAutoPRDM}
                />
                <label className="control-label ml-2" htmlFor="IsAutoPRDM">
                  {t("IsAutoPRDM")}
                </label>
              </div>
              <div className="col-sm-1 col-md-2 col-xl-2">
                <input
                  type="checkbox"
                  name="IsPatientFullPaid"
                  id="IsPatientFullPaid"
                  onChange={handleChange}
                  checked={formData?.IsPatientFullPaid}
                />
                <label className="control-label ml-2" htmlFor="IsPatientFullPaid">
                  {t("IsPatientFullPaid")}
                </label>
              </div>
            </>
          )}
          {/* {name === "Rate" && (
            <>
              <div className="col-sm-2 col-md-2 ">
                <SelectBox
                  options={BillingCycle}
                  selectedValue={formData?.BillingCycle}
                  name="BillingCycle"
                  id="BillingCycle"
                  lable="BillingCycle"
                  onChange={handleChange}
                />
              </div>
            </>
          )} */}
        </div>
        <div className="row pt-2 pl-2 pr-2">
          {name === "Rate" && (
            <>
              <div className="col-sm-2 col-md-2 ">
                <Input
                  lable="GSTIN No."
                  id="GSTIN"
                  placeholder=" "
                  onChange={handleChange}
                  value={formData?.Gstin}
                  name="Gstin"
                  type="text"
                  max={20}
                />
              </div>

              {/* <div className="col-sm-2 col-md-2 ">
                <SelectBox
                  options={[{ label: "Select", value: "" }, ...proEmplyee]}
                  name="ProEmployee"
                  id="ProEmployee"
                  lable="ProEmployee"
                  selectedValue={formData?.ProEmployee}
                  onChange={handleChange}
                />
              </div>
              <div className="col-sm-1">
                <input
                  name="HideAmount"
                  type="checkbox"
                  id="HideAmount"
                  onChange={handleChange}
                  checked={formData?.HideAmount}
                />
                <label htmlFor="HideAmount" className="control-label ml-2">
                  {t("HideAmount")}
                </label>
              </div> */}
            </>
          )}
          {/* {name === "Rate" && (
            <>
              <div className="col-sm-1 col-md-1">
                <input
                  type="checkbox"
                  name="LockRegistration"
                  checked={formData?.LockRegistration === 0 ? false : true}
                  onChange={handleChange}
                  disabled={formData.PaymentMode == "Cash"}
                />
                <label className="control-label ml-2" htmlFor="inputEmail3">
                  {t("LockRegist.")}
                </label>
              </div>
            </>
          )}

          {name === "Rate" && (
            <>
              <div className="col-sm-1 col-md-1">
                <input
                  type="checkbox"
                  name="LockReport"
                  checked={formData?.LockReport === 0 ? false : true}
                  onChange={handleChange}
                  onInput={(e) => number(e, 30)}
                  disabled={formData?.PaymentMode == "Cash"}
                />
                <label className="control-label ml-2" htmlFor="inputEmail3">
                  {t("Lock Report")}
                </label>
              </div>
            </>
          )} */}
          {/* {name === "Rate" && formData?.PaymentMode == "Cash" && (
            <div className="col-sm-1"></div>
          )} */}
          {/* {name === "Rate" && formData?.PaymentMode == "Credit" && (
            <>
              <div className="col-sm-1 col-md-1">
                <input
                  type="checkbox"
                  name="IsRollingAdvance"
                  checked={formData?.IsRollingAdvance == 0 ? false : true}
                  onChange={handleChange}
                  onInput={(e) => number(e, 30)}
                />
                <label className="control-label ml-2" htmlFor="inputEmail3">
                  {t("IsRollingAdv.")}
                </label>
              </div>
            </>
          )} */}
          {/* {name === "Rate" && (
            <div className="col-sm-1 col-md-1">
              <input
                type="checkbox"
                name="isAutoEmail"
                id="isAutoEmail"
                onChange={handleChange}
                checked={formData?.isAutoEmail === 0 ? false : true}
              />
              <label className="control-label ml-2" htmlFor="isAutoEmail">
                {t("IsAutoEmail")}
              </label>
            </div>
          )} */}
          {name === "Rate" && formData?.PaymentMode == "Cash" && (
            <>
              <div className="col-sm-2 col-md-2">
                <SelectBox
                  onChange={handleChange}
                  selectedValue={formData?.skipTimeType}
                  id="Skip Time Type"
                  lable="Skip Time Type"
                  name="skipTimeType"
                  type="text"
                  options={SkipTimeType}
                />
              </div>
            </>
          )}
          {name === "Rate" &&
            ["1", "2", "3", "4", 1, 2, 3, 4].includes(
              formData?.skipTimeType
            ) && (
              <div className="col-sm-2 col-md-2">
                <Input
                  // onChange={handleChange}
                  value={formData?.skipValue}
                  id="skipValue"
                  lable="Skip Value"
                  name="skipValue"
                  type="number"
                  onInput={handleInput}
                  placeholder=" "
                  className="custom-skip-value-input"
                />
              </div>
            )}

          {/* {name === "Rate" && formData?.PaymentMode == "Credit" && (
            <>
              <div className="col-sm-2 col-md-2">
                <Input
                  onChange={handleChange}
                  value={formData?.CreditLimitInRs}
                  id="CreditLimitInRs"
                  lable="Credit Limit In Rs"
                  name="CreditLimitInRs"
                  type="text"
                  placeholder=""
                />
              </div>
            </>
          )}
          {name === "Rate" && formData?.PaymentMode == "Credit" && (
            <>
              <div className="col-sm-2 col-md-2">
                <Input
                  onChange={handleChange}
                  value={formData?.CreditLimitInTime}
                  id="CreditLimitInTime"
                  lable="Credit Limit In Time"
                  name="CreditLimitInTime"
                  type="text"
                  placeholder=""
                />
              </div>
            </>
          )} */}
        </div>
        {/* <div className="row pt-2 pl-2 pr-2">
          {name === "Rate" && (
            <div className="col-sm-1 col-md-1">
              <input
                type="checkbox"
                name="isAutoEmail"
                id="isAutoEmail"
                onChange={handleChange}
                checked={formData?.isAutoEmail === 0 ? false : true}
              />
              <label className="control-label ml-2" htmlFor="isAutoEmail">
                {t("IsAutoEmail")}
              </label>
            </div>
          )}
        </div> */}
      </Accordion>
      {name == "center" && (
        <>
          <Accordion title={t("Accounts Details")} defaultValue={true}>
            {showAccount ? (
              <>
                <div className="row pt-2 pl-2 pr-2">
                  <div className="col-sm-2 col-md-2">
                    <Input
                      lable="Demand Draft"
                      id="Demand Draft"
                      placeholder=" "
                      max={6}
                      type="number"
                      onInput={(e) => number(e, 6)}
                      onChange={handleChange}
                      value={formData?.DemandDraft}
                      name="DemandDraft"
                    />
                    {errors?.DemandDraft && touched?.DemandDraft && (
                      <div className="error-message">{errors?.DemandDraft}</div>
                    )}
                  </div>
                  <div className="col-sm-2 col-md-2">
                    <Input
                      lable="Beneficial Name"
                      id="Beneficial Name"
                      placeholder=" "
                      max={30}
                      onChange={handleChange}
                      value={formData?.BenificialName}
                      name="BenificialName"
                    />
                  </div>
                  <div className="col-sm-2 col-md-2">
                    <Input
                      lable="Bank Account No"
                      id="Bank Account No"
                      placeholder=" "
                      onInput={(e) => number(e, 20)}
                      type="number"
                      onChange={handleChange}
                      value={formData?.BankAccountNo}
                      name="BankAccountNo"
                    />
                    {errors?.BankAccountNo && touched?.BankAccountNo && (
                      <div className="error-message">
                        {errors?.BankAccountNo}
                      </div>
                    )}
                  </div>
                  <div className="col-sm-2 col-md-2">
                    <Input
                      lable="Bank Name"
                      id="Bank Name"
                      placeholder=" "
                      max={30}
                      onChange={handleChange}
                      value={formData?.bankName}
                      name="bankName"
                    />
                  </div>
                  <div className="col-sm-2 col-md-2">
                    <Input
                      lable="IFSC Code"
                      id="IFSC Code"
                      placeholder=" "
                      max={20}
                      onChange={handleChange}
                      value={formData?.IFSCCode}
                      name="IFSCCode"
                    />
                    {errors?.IFSCCode && touched?.IFSCCode && (
                      <div className="error-message">{errors?.IFSCCode}</div>
                    )}
                  </div>
                  <div className="col-sm-2 col-md-2">
                    <Input
                      lable="Branch Address"
                      id="Branch Address"
                      placeholder=" "
                      max={30}
                      onChange={handleChange}
                      value={formData?.BranchAddress}
                      name="BranchAddress"
                    />
                  </div>
                </div>
                <div className="row pt-2 pl-2 pr-2">
                  <div className="col-sm-2 col-md-2">
                    <Input
                      lable="PAN No"
                      id="PAN No"
                      placeholder=" "
                      onChange={handleChange}
                      value={formData?.PANNo}
                      name="PANNo"
                      max={13}
                    />

                    {errors?.PANNo && touched?.PANNo && (
                      <div className="error-message">{errors?.PANNo}</div>
                    )}
                  </div>
                  <div className="col-sm-5">
                    <Input
                      lable="Description"
                      id="Description"
                      placeholder=" "
                      max={40}
                      onChange={handleChange}
                      value={formData?.Description}
                      name="Description"
                    />
                  </div>
                  <div className="col-sm-5">
                    <Input
                      lable="Registered Office"
                      id="Registered Office"
                      placeholder=" "
                      max={40}
                      onChange={handleChange}
                      value={formData?.RegisteredOffice}
                      name="RegisteredOffice"
                    />
                  </div>
                </div>
              </>
            ) : (
              ""
            )}
          </Accordion>{" "}
        </>
      )}
      <Accordion title={t("Billing Details")} defaultValue={true}>
        <div className="row pt-2 pl-2 pr-2">
          {name === "center" ? (
            <div className="col-sm-2 col-md-2 ">
              <ReactSelect
                dynamicOptions={Invoice}
                name="InvoiceTo"
                lable={t("InvoiceTo")}
                id="InvoiceTo"
                removeIsClearable={true}
                placeholderName={t("InvoiceTo")}
                value={formData?.InvoiceTo}
                onChange={handleSearchSelectChange}
              />
            </div>
          ) : (
            <div className="col-sm-2 col-md-2 ">
              <ReactSelect
                dynamicOptions={Invoice}
                name="InvoiceTo"
                lable={t("InvoiceTo")}
                id="InvoiceTo"
                removeIsClearable={true}
                placeholderName={t("InvoiceTo")}
                value={formData?.InvoiceTo}
                onChange={handleSearchSelectChange}
              />
            </div>
          )}
          <div className="col-sm-2 col-md-2 ">
            <ReactSelect
              dynamicOptions={BusinessUnit}
              name="BusinessUnit"
              lable={t("BusinessUnit")}
              id="BusinessUnit"
              removeIsClearable={true}
              placeholderName={t("BusinessUnit")}
              value={formData?.BusinessUnit}
              onChange={handleSearchSelectChange}
            />
          </div>
          <div className="col-sm-2 col-md-2 ">
            <ReactSelect
              dynamicOptions={ProcessingLab}
              name="ProcessingLab"
              lable={t("TagProcessingLab")}
              id="TagProcessingLab"
              removeIsClearable={true}
              placeholderName={t("TagProcessingLab")}
              value={formData?.ProcessingLab}
              onChange={handleSearchSelectChange}
            />
          </div>
          <div className="col-sm-2 col-md-2 ">
            <ReactSelect
              dynamicOptions={ReferenceRate}
              name="ReferenceRate"
              lable={t("Rate Type")}
              id="Rate Type"
              removeIsClearable={true}
              placeholderName={t("Rate Type")}
              value={formData?.ReferenceRate}
              onChange={handleSearchSelectChange}
            />
          </div>
          <div className="col-sm-2 col-md-2 d-none">
            <ReactSelect
              dynamicOptions={ReferenceRate}
              name="ReferenceRate1"
              lable={t("Rate Type1")}
              id="Rate Type1"
              removeIsClearable={true}
              placeholderName={t("Rate Type1")}
              value={formData?.ReferenceRate1}
              onChange={handleSearchSelectChange}
            />
          </div>
          <div className="col-sm-2 col-md-2 d-none">
            <ReactSelect
              dynamicOptions={ReferenceRate}
              name="ReferenceRate2"
              lable={t("Rate Type2")}
              id="Rate Type2"
              removeIsClearable={true}
              placeholderName={t("Rate Type2")}
              value={formData?.ReferenceRate2}
              onChange={handleSearchSelectChange}
            />
          </div>{" "}
          {name === "center" && (
            <div className="col-sm-3 col-md-3">
              <SelectBox
                options={BarCodeLogic}
                name="BarcodeLogic"
                id="BarcodeLogic"
                lable="BarcodeLogic"
                selectedValue={formData?.BarcodeLogic}
                onChange={handleSelectChange}
              />
            </div>
          )}
          <div className="col-sm-2 col-md-2">
            <button
              className="btn btn-info btn-sm btn-block"
              id="btnUpload"
              onClick={() => {
                setShow(true);
              }}
            >
              {t("Upload LetterHead")}
            </button>
          </div>
          <div className="col-sm-2 col-md-2">
            <button
              className="btn btn-info btn-sm btn-block"
              id="btnUpload"
              onClick={() => {
                setShow3(true);
              }}
            >
              {t("Upload Att Header")}
            </button>
          </div>{" "}
          <div className="col-sm-2 col-md-2">
            <button
              className="btn btn-info btn-sm btn-block"
              id="btnUpload"
              onClick={() => {
                setShow4(true);
              }}
            >
              {t("Upload Att Footer")}
            </button>
          </div>
          {name === "center" && (
            <>
              <div className="col-sm-2">
                <button
                  className="btn btn-info btn-sm btn-block"
                  id="btnUpload"
                  onClick={() => {
                    setShow2(true);
                  }}
                >
                  {t("Upload Receipt logo")}
                </button>
              </div>
              <div className="col-sm-2">
                <button
                  className="btn btn-info btn-sm btn-block"
                  id="btnUpload"
                  onClick={() => {
                    setShow6(true);
                  }}
                >
                  {t("Upload Stamp")}
                </button>
              </div>
              <div className="col-sm-2">
                <button
                  className="btn btn-info btn-sm btn-block"
                  id="btnUpload"
                  disabled={getTypeName() ? false : true}
                  onClick={() => {
                    setShow5(true);
                  }}
                >
                  {t("Upload QR Code")}
                </button>
              </div>
            </>
          )}
          {name === "Rate" && (
            <>
              <label className="col-sm-1" htmlFor="inputEmail3">
                {t("Creation Date")} :
              </label>
              <div className="col-sm-1 col-md-1">
                <label style={{ color: "#605ca8" }}>
                  {moment(formData?.dtEntry, "DD-MMM-YY").format("DD-MMM-YYYY")}
                </label>
              </div>
            </>
          )}
          {name === "Rate" && (
            <>
              <div className="col-sm-1 mt-1 d-flex">
                <div className="mt-1">
                  <input
                    name="isActive"
                    type="checkbox"
                    onChange={handleChange}
                    checked={formData?.isActive}
                  />
                </div>
                <label htmlFor="isActive" className="col-sm-10">
                  {t("Active")}
                </label>
              </div>
              <div className="col-sm-1">
                {load ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-success btn-sm btn-block"
                    onClick={handleSubmit}
                  >
                    {state?.other?.button ? t(state?.other?.button) : t("Save")}
                  </button>
                )}
              </div>
              <div className="col-sm-2">
                <Link
                  to={`/CentreMasterList/${name}`}
                  style={{ fontSize: "13px" }}
                >
                  {t("Back to List")}
                </Link>
              </div>
            </>
          )}
        </div>

        {name === "center" ? (
          <>
            <div className="row pt-2 pl-2 pr-2 pb-2">
              <>
                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Creation Date ")} :
                </label>
                <label style={{ color: "#605ca8" }} className="col-sm-1">
                  {moment(formData?.dtEntry, "DD-MMM-YY").format("DD-MMM-YYYY")}
                </label>
                <div className="col-sm-1 mt-1 d-flex">
                  <div className="mt-1">
                    <input
                      name="isNabl"
                      type="checkbox"
                      checked={formData?.isNabl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isNabl: e.target.checked ? 1 : 0,
                        })
                      }
                    />
                  </div>
                  <label htmlFor="isNabl" className="ml-2">
                    {t("isNABL")}
                  </label>
                </div>
                <div className="col-sm-1">
                  <button
                    className="btn btn-info btn-sm btn-block"
                    id="btnUpload"
                    disabled={!formData?.isNabl}
                    onClick={() => {
                      setShow1(true);
                    }}
                  >
                    {t("Upload isNabl")}
                  </button>
                </div>
                <div className="col-sm-1 mt-1 d-flex">
                  <div className="mt-1">
                    <input
                      name="isActive"
                      type="checkbox"
                      onChange={handleChange}
                      checked={formData?.isActive}
                    />
                  </div>
                  <label htmlFor="isActive" className="control-label ml-2">
                    {t("Active")}
                  </label>
                </div>
                <div className="col-sm-2 mt-1 d-flex">
                  <div className="mt-1">
                    <input
                      name="SampleCollectandReceive"
                      type="checkbox"
                      onChange={handleChange}
                      checked={formData?.SampleCollectandReceive}
                    />
                  </div>
                  <label
                    htmlFor="SampleCollectandReceive"
                    className="control-label ml-2"
                  >
                    {t("Sample Collect & Receive")}
                  </label>
                </div>
                <div className="col-sm-1 mt-1 d-flex">
                  <div className="mt-1">
                    <input
                      name="IsTrfRequired"
                      type="checkbox"
                      onChange={handleChange}
                      checked={formData?.IsTrfRequired}
                    />
                  </div>
                  <label htmlFor="IsTrfRequired" className="control-label ml-2">
                    {t("IsTrfRequired")}
                  </label>
                </div>
                <div className="col-sm-2 mt-1 d-flex">
                  <div className="mt-1">
                    <input
                      name="IsDepartmentSlip"
                      type="checkbox"
                      id="IsDepartmentSlip"
                      onChange={handleChange}
                      checked={formData?.IsDepartmentSlip}
                    />
                  </div>
                  <label
                    htmlFor="IsDepartmentSlip"
                    className="control-label ml-2"
                  >
                    {t("IsDepartmentSlip")}
                  </label>
                </div>
                <div className="col-sm-2 mt-1 d-flex">
                  <div className="mt-1">
                    <input
                      name="IsSampleRecollection"
                      type="checkbox"
                      id="IsSampleRecollection"
                      onChange={handleChange}
                      checked={formData?.IsSampleRecollection}
                    />
                  </div>
                  <label
                    htmlFor="IsSampleRecollection"
                    className="control-label ml-2"
                  >
                    {t("IsSampleRecollection")}
                  </label>
                </div>
              </>
            </div>
            <div className="row pt-2 pl-2 pr-2 pb-2">
              <div className="col-sm-1 mt-1 d-flex">
                <div className="mt-1">
                  <input
                    name="HideReceipt"
                    type="checkbox"
                    id="HideReceipt"
                    onChange={handleChange}
                    checked={formData?.HideReceipt}
                  />
                </div>
                <label htmlFor="HideReceipt" className="control-label ml-2">
                  {t("HideReceipt")}
                </label>
              </div>
              <div className="col-sm-2 mt-1 d-flex">
                <div className="mt-1">
                  <input
                    name="IsDoctorShareRequired"
                    type="checkbox"
                    id="IsDoctorShareRequired"
                    onChange={handleChange}
                    checked={formData?.IsDoctorShareRequired}
                  />
                </div>
                <label
                  htmlFor="IsDoctorShareRequired"
                  className="control-label ml-2"
                >
                  {t("IsDoctorShareRequired")}
                </label>
              </div>
              <div className="col-sm-1 mt-1 d-flex">
                <div className="mt-1">
                  <input
                    name="FullyPaid"
                    type="checkbox"
                    id="FullyPaid"
                    onChange={handleChange}
                    checked={formData?.FullyPaid}
                  />
                </div>
                <label htmlFor="FullyPaid" className="control-label ml-2">
                  {t("FullyPaid")}
                </label>
              </div>
              <div className="col-sm-2 mt-1 d-flex">
                <div className="mt-1">
                  <input
                    name="SetMRP"
                    type="checkbox"
                    id="SetMRP"
                    onChange={handleChange}
                    checked={formData?.SetMRP}
                  />
                </div>
                <label htmlFor="SetMRP" className="control-label ml-2">
                  {t("Show MRP Booking")}
                </label>
              </div>
              <div className="col-sm-1">
                {load ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-success btn-sm btn-block"
                    onClick={handleSubmit}
                  >
                    {state?.other?.button ? t(state?.other?.button) : t("Save")}
                  </button>
                )}
              </div>
              <div className="col-sm-2">
                <Link
                  to={`/CentreMasterList/${name}`}
                  style={{ fontSize: "13px" }}
                >
                  {t("Back to List")}
                </Link>
              </div>
            </div>
          </>
        ) : null}
      </Accordion>
    </>
  );
};

export default CentreMaster;
