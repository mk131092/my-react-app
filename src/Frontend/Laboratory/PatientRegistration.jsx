import React, { useEffect, useRef, useState } from "react";
import Heading from "../../components/UI/Heading";
import Accordion from "@app/components/UI/Accordion";
import { useTranslation } from "react-i18next";
import { SelectBox } from "../../components/formComponent/SelectBox";
import { useMemo } from "react";
import Tooltip from "../../components/formComponent/Tooltip";
import DatePicker from "../../components/formComponent/DatePicker";
import Tables from "../../components/UI/customTable";
import Input from "../../components/formComponent/Input";
import { toast } from "react-toastify";
import { DISCOUNT_TYPE, LTDataIniti, stateIniti } from "../../utils/Constants";
import PlaceholderImage from "./PlaceholderImage.jpg";
import {
  checkDuplicateBarcode,
  checkEmploypeeWiseDiscount,
  getAccessCentres,
  getAccessDataRate,
  getBindDiscApproval,
  getBindDiscReason,
  getCollectionBoy,
  getDoctorSuggestion,
  getPaymentModes,
  getsecondDoctorSuggestion,
} from "../../utils/NetworkApi/commonApi";
import { axiosInstance, axiosReport } from "../../utils/axiosInstance";
import {
  PreventNumber,
  PreventSpecialCharacter,
  PreventSpecialCharacterFirstName,
  Tabfunctionality,
  autocompleteOnBlur,
  getTrimmedData,
  number,
  removeSpecialCharacters,
} from "../../utils/helpers";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment/moment";
import { useFormik } from "formik";
import {
  CouponValidateSchema,
  PatientRegisterSchema,
} from "../../utils/Schema";
import Loading from "../../components/loader/Loading";
import CloseButton from "../../components/formComponent/CloseButton";
import RegisterationTable from "../Table/RegisterationTable";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import MedicialModal from "../utils/MedicialModal";
import UploadFile from "../utils/UploadFileModal/UploadFile";
import MobileDataModal from "../utils/MobileDataModal";
import CameraModal from "../utils/CameraModal";
import SampleRemark from "../utils/SampleRemark";
import PatientRegisterModal from "../utils/PatientRegisterModal";
import SaveSmsEmail from "../utils/SaveSmsEmail";
import SlotBookModal from "../utils/SlotBookModal";
import ReactSelect from "../../components/formComponent/ReactSelect";
import BarcodeLogicModal from "../utils/BarcodeLogicModal";
import OldPatientSearchModal from "../utils/OldPatientSearchModal";
import MembershipModal from "../utils/MembershipModal";
import PackageSuggestion from "../utils/PackageSuggestion";
import SuggestionModal from "../utils/SuggestionModal";
import axios from "axios";
const PatientRegistration = () => {
  const [states, setStates] = useState([]);
  const [cities, setCity] = useState([]);
  const [countries, setCountry] = useState([{ label: "India", value: "1" }]);

  const [patientImg, setPatientImg] = useState({
    img: PlaceholderImage,
    show: false,
  });
  const [AgeWiseDiscountDropdown, setAgeWiseDiscountDropdown] = useState([]);
  const [Gender, setGender] = useState([]);
  const [isMobileSelected, setIsMobileSelected] = useState(false);

  const [Title, setTitle] = useState([]);
  const [Identity, setIdentity] = useState([]);
  const [PaymentMode, setPaymentMode] = useState([]);
  const [BankName, setBankName] = useState([]);
  const [CollectionBoy, setCollectionBoy] = useState([]);
  const [visibleFields, setVisibleFields] = useState([]);
  const [RateType, setRateType] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [seconddoctorSuggestion, setseconddoctorSuggestion] = useState([]);
  const [VisitType, setVisitType] = useState([]);
  const [throughMobileData, setThroughMobileData] = useState(false);
  const [throughMemberData, setThroughmemberdata] = useState(false);
  const [DateData, setDateData] = useState({
    AgeYear: "",
    AgeDays: "",
    AgeMonth: "",
  });
  const Navigate = useNavigate();
  const [paid, setPaid] = useState(0);
  const [BindDiscApproval, setBindDiscApproval] = useState([]);
  const [BindDiscReason, setBindDiscReason] = useState([]);
  const [load, setLoad] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [disAmt, setdisAmt] = useState("");
  const [documentId, setDocumentID] = useState("");
  const [PatientGuid, SetPatientGuid] = useState("");
  const [PatientSource, setPatientSource] = useState([]);
  const [PatientType, setPatientType] = useState([]);
  const [HLMPatientType, setHLMPatientType] = useState([]);
  const [SourceType, setSourceType] = useState([]);
  const [mobleData, setMobileData] = useState([]);
  const [Memberdata, setMemberdata] = useState([]);
  const [Memberdetails, setMemberdetails] = useState({});
  const [isSubmit, setIsSubmit] = useState({
    type: "Success",
    isLoading: false,
  });
  const [BarcodeLogic, setBarcodeLogic] = useState(0);
  const [UploadDoumentType, setUploadDoumentType] = useState([""]);
  const [autoEmail, setAutoEmail] = useState({
    order_id: "",
    flag: false,
  });
  const [dropFalse, setDropFalse] = useState(false);
  const [secondDropFalse, setSecondDropFalse] = useState(false);

  const [show, setShow] = useState({
    show: false,
    Type: "",
  });
  const [showOP, setShowOP] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [indexMatch, setIndexMatch] = useState(0);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [proEmplyee, setProEmployee] = useState([]);
  const [show5, setShow5] = useState({
    modal: false,
    index: -1,
  });
  const [show6, setShow6] = useState(false);
  const [show7, setShow7] = useState(false);
  const [RequiredShow, setRequiredShow] = useState({
    show: false,
    FieldIDs: "",
  });
  const [formData, setFormData] = useState({
    DoctorName: "Self",
    SecondReferDoctor: "",
  });
  const [state, setState] = useState(stateIniti);

  const [LTData, setLTData] = useState(LTDataIniti);
  const [saveSmsEmail, setSaveSmsEmail] = useState({
    SmsToPatient: "",
    SmsToDoctor: "",
    IsActiveSmsToPatient: "",
    IsActiveSmsToDoctor: "",
    EmailToPatient: "",
    EmailToDoctor: "",
    IsActiveEmailToPatient: "",
    IsActiveEmailToDoctor: "",
    SmsToClient: "",
    IsActiveSmsToClient: "",
    EmailToClient: "",
    IsActiveEmailToClient: "",
    IsCourier: "",
    IsWhatsappRequired: "",
  });
  const [membershipnum, setmembershipnum] = useState("");
  const [couponDetails, setCouponDetails] = useState([]);
  const [showCoupon, setShowCoupon] = useState({
    BindTestCouponShow: false,
    ShowCouponDetail: false,
  });
  const [coupon, setCoupon] = useState({
    code: "",
    field: false,
    load: false,
  });

  const [Category, setCategory] = useState([]);
  const [time, setTime] = useState({
    Hour: new Date().getHours().toString().padStart(2, "0"),
    Minute: new Date().getMinutes().toString().padStart(2, "0"),
    Second: new Date().getSeconds().toString().padStart(2, "0"),
  });
  // console.log(LTData);
  const [suggestionData, setSuggestionData] = useState({
    show: false,
    viewTestModal: false,
    viewTestModalId: "",
    testSuggestions: {
      data: [],
      show: false,
      Total: [],
    },
    packageSuggestions: {
      data: [],
      show: false,
    },
    daySuggestions: {
      data: [],
      show: false,
    },
  });

  const StaticOnlineBankOptions = [
    { label: "QRCode", value: "QRCode" },
    { label: "Payment Gateway", value: "Payment Gateway" },
  ];

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

  useEffect(() => {
    if (coupon?.field) setErr({});
  }, [coupon?.field]);

  const [couponData, setCouponData] = useState([]);
  const [err, setErr] = useState({});
  const [showRemark, setShowRemark] = useState(false);

  useEffect(() => {
    setLTData({ ...LTData, Adjustment: paid });
  }, [paid]);
  const VisitTypeCategory = (value) => {
    axiosInstance
      .post("CommonController/GetVisitCategoryData", { VisitTypeID: value })
      .then((res) => {
        if (res?.data?.success) {
          const data = res?.data?.message;
          const activeData = data?.filter((ele) => ele?.IsActive == 1);
          const finalData = activeData?.map((ele) => {
            return {
              value: ele.CategoryID,
              label: ele.Category,
            };
          });
          setCategory(finalData);
        } else {
          setCategory([]);
        }
      })
      .catch((err) => console.log(err));
  };
  const [PLO, setPLO] = useState([]);
  const [RcData, setRcData] = useState([
    {
      PayBy: "Patient",
      ReceiptNo: "",
      ledgerNoCr: "",
      RateTypeId: state?.RateID,
      PaymentMode: "Cash",
      PaymentModeID: 134,
      Amount: "",
      BankName: "",
      CardDate: "",
      CardNo: "",
      CentreID: LTData?.CentreID,
    },
  ]);
  const [isRazorPayOpen, setIsRazorPayOpen] = useState(false);

  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const getWhtsapp = () => {
    if (
      Object.values({
        IsPatientSMS: saveSmsEmail?.IsActiveSmsToPatient,

        IsPatientEmail: saveSmsEmail?.IsActiveEmailToPatient,

        IsDoctorSMS: saveSmsEmail?.IsActiveSmsToDoctor,

        IsDoctorEmail: saveSmsEmail?.IsActiveEmailToDoctor,
        IsClientSMS: saveSmsEmail?.IsActiveSmsToClient,

        IsClientEmail: saveSmsEmail?.IsActiveEmailToClient,
        IsCourier: saveSmsEmail?.IsCourier,
      }).every((value) => value == 0 || value == "")
    ) {
      if (LTData?.BTB == 1) {
        return 0;
      } else return 1;
    } else {
      if (saveSmsEmail?.IsWhatsappRequired == 0) {
        return 1;
      } else return 0;
    }
  };
  // console.log(state)
  // console.log(useLocalStorage("userData", "get"));
  const saveData = (data) => {
    setIsSubmit({
      type: "Success",
      isLoading: true,
    });
    handleSubmitFinalBooking(data);
  };

  const handleReset = () => {
    setIsMobileSelected(false);
    setSearchTest("TestName");
    const newDocumentId = guidNumber();
    setDocumentID(newDocumentId);
    const patientId = guidNumber();
    SetPatientGuid(patientId);
    setIsRazorPayOpen(false);
    setCity([]);
    setState(stateIniti);
    //    setLTData(LTDataIniti);
    setTime({
      Hour: new Date().getHours().toString().padStart(2, "0"),
      Minute: new Date().getMinutes().toString().padStart(2, "0"),
      Second: new Date().getSeconds().toString().padStart(2, "0"),
    });

    setPLO([]);
    setRcData([
      {
        PayBy: "Patient",
        ReceiptNo: "",
        ledgerNoCr: "",
        RateTypeId: state?.RateID,
        PaymentMode: "Cash",
        PaymentModeID: 134,
        BankName: "",
        CardDate: "",
        CardNo: "",
        Amount: "",
        CentreID: LTData?.CentreID,
      },
    ]);
    setSaveSmsEmail({
      SmsToPatient: "",
      SmsToDoctor: "",
      IsActiveSmsToPatient: "",
      IsActiveSmsToDoctor: "",
      EmailToPatient: "",
      EmailToDoctor: "",
      IsActiveEmailToPatient: "",
      IsActiveEmailToDoctor: "",
      SmsToClient: "",
      IsActiveSmsToClient: "",
      EmailToClient: "",
      IsActiveEmailToClient: "",
      IsCourier: "",
      IsWhatsappRequired: "",
    });

    setPndt({
      ...Pndt,
      PNDT: false,
      NoOfChildren: "",
      NoOfSon: "",
      NoOfDaughter: "",
      Pregnancy: "",
      AgeOfSon: "",
      AgeOfDaughter: "",
      PNDTDoctor: "",
      Husband: "",
    });
    setFormData({
      DoctorName: "Self",
      SecondReferDoctor: "",
    });
    setmembershipnum("");
    setThroughmemberdata(false);
    setMemberdetails({});
    setTableData([]);
    setIsSubmit({
      type: "Success",
      isLoading: false,
    });
    setCoupon({
      code: "",
      field: false,
    });
    setThroughMobileData(false);
    setThroughmemberdata(false);
    getAccessCentres(
      setCentreData,
      LTData,
      setLTData,
      LTDataIniti,
      handleRateType,
      VisitTypeCategory,
      fetchFields
    );
    guidNumber();
    setPatientImg({ img: PlaceholderImage, show: false });
    setAutoEmail({
      order_id: "",
      flag: false,
    });
    setSuggestionData({
      show: false,
      viewTestModal: false,
      viewTestModalId: "",
      testSuggestions: {
        data: [],
        show: false,
        Total: [],
      },
      packageSuggestions: {
        data: [],
        show: false,
      },
      daySuggestions: {
        data: [],
        show: false,
      },
    });
  };

  const handleSaveSmsEmailSave = async (data, saveSmsEmailArgument) => {
    setIsSubmit({
      type: "Success",
      isLoading: true,
    });
    const selectedState = states?.find(
      (ele) => ele?.value == state?.State
    )?.label;
    const selectedCity = cities?.find(
      (ele) => ele?.value == state?.City
    )?.label;
    const selectedCountry = countries?.find(
      (ele) => ele?.value === state?.Country
    )?.label;

    axiosInstance
      .post("PatientRegistration/SaveData", {
        PatientData: getTrimmedData({
          ...state,
          State: selectedState,
          City: selectedCity,
          Country: selectedCountry,
          AgeDays: state?.AgeDays == "" ? "0" : state?.AgeDays,
          isVIP: state?.isVIP === "" ? 0 : Number(state?.isVIP),

          IsMask: state?.IsMask === "" ? 0 : Number(state?.IsMask),
          AgeMonth: state?.AgeMonth == "" ? "0" : state?.AgeMonth,
          CentreID: LTData?.CentreID,
          MobileVip: state?.Mobile,
          FirstNameVip: state?.FirstName,
          MiddleNameVip: state?.MiddleName,
          LastNameVip: state?.LastName,
          MembershipCardID: Memberdetails?.MembershipCardID
            ? Memberdetails?.MembershipCardID
            : 0,
          FamilyMemberIsPrimary: Memberdetails?.FamilyMemberIsPrimary
            ? Memberdetails?.FamilyMemberIsPrimary
            : 0,
          Age: `${state?.AgeYear == "" ? 0 : state?.AgeYear} Y ${state?.AgeMonth == "" ? 0 : state?.AgeMonth} M ${state?.AgeDays == "" ? 0 : state?.AgeDays} D`,
        }),

        LTData: getTrimmedData({
          ...LTData,
          PreBookingNo: state?.PreBookingNo,
          throughHC: state?.throughHC,
          Category: LTData?.Category?.toString(),
          Gender: state?.Gender,
          Age: `${state?.AgeYear == "" ? 0 : state?.AgeYear} Y ${state?.AgeMonth == "" ? 0 : state?.AgeMonth} M ${state?.AgeDays == "" ? 0 : state?.AgeDays} D`,
          ReferLabId: LTData?.ReferLabId?.toString(),
          GrossAmount: Number(LTData?.GrossAmount),
          NetAmount: Number(LTData?.NetAmount),
          ProEmployee: state?.ProEmployee?.toString(),
          RateTypeId: state?.RateID,
          PName:
            state?.Title +
            " " +
            state?.FirstName?.trim() +
            (state?.MiddleName?.trim() ? " " + state?.MiddleName?.trim() : "") +
            (state?.LastName?.trim() ? " " + state?.LastName?.trim() : ""),
          OrderId: data ? data : "",
          LedgerTransactionIDHash: documentId,
          CoupanCode: coupon?.field ? coupon?.code : "",
          CoupanId: coupon?.field ? couponData[0]?.CoupanId : "",
          IsCoupon: coupon?.field ? 1 : 0,
          VisitType: LTData?.VisitType?.toString(),
          DATE:
            useLocalStorage("userData", "get").ModifyRegDate == "1"
              ? LTData?.RegistrationDate
              : new Date(),
          PNameVip: LTData?.PName,
          IsCourier: saveSmsEmail?.IsCourier,
          IsWhatsappRequired: getWhtsapp(),
          IsCredit: handleRateTypePaymode == "Credit" ? 1 : 0,
          ...Pndt,
          Pregnancy:
            Pndt?.Pregnancy == ""
              ? "0001-01-01"
              : moment(Pndt?.Pregnancy).format("YYYY-MM-DD"),
          IsPndt: Pndt?.PNDT ? 1 : 0,
          IsPndtForm: checkPndt(),
          IsConcern: checkConcent(),
          HLMOPDIPDNo: LTData?.OPDIPD,
          hmis_request_type: state?.hmis_request_type ?? "",
          hmis_patCrNo: state?.hmis_patCrNo ?? "",
          hmis_hospital_code: state?.hmis_hospital_code ?? "",
          poct_facility_id: state?.poct_facility_id ?? "",
          hmis_episode_code: state?.hmis_episode_code ?? "",
          hmis_episode_visitno: state?.hmis_episode_visitno ?? "",
        }),
        PLO: PLO.map((ploItem) => ({
          ...getTrimmedData(ploItem),
          DATE:
            localStorage.getItem("ModifyRegDate") == "1"
              ? LTData?.RegistrationDate
              : new Date(),
          Amount: ploItem?.Amount?.toString(),
          DiscountAmt: ploItem?.DiscountAmt?.toString(),
          Rate: ploItem?.Rate?.toString(),
          sampleTypeID: ploItem?.sampleTypeID
            ? Number(ploItem?.sampleTypeID)
            : 0,
          ModalityId: ploItem?.ModalityId?.toString(),
        })),
        DocumentDetail: {
          DocumentID: PatientGuid,
        },
        patientMedical: {
          PatientGuid: PatientGuid,
        },

        PRDeliveryMethod: {
          IsPatientSMS: saveSmsEmailArgument?.IsActiveSmsToPatient ?? 0,
          PatientMobileNo: saveSmsEmailArgument?.SmsToPatient ?? "",
          IsPatientEmail: saveSmsEmailArgument?.IsActiveEmailToPatient ?? 0,
          PatientEmailId: saveSmsEmailArgument?.EmailToPatient ?? "",
          IsDoctorSMS: saveSmsEmailArgument?.IsActiveSmsToDoctor ?? 0,
          DoctorMobileNo: saveSmsEmailArgument?.SmsToDoctor ?? "",
          IsDoctorEmail: saveSmsEmailArgument?.IsActiveEmailToDoctor ?? 0,
          DoctorEmailId: saveSmsEmailArgument?.EmailToDoctor ?? "",
          IsClientSMS: saveSmsEmailArgument?.IsActiveSmsToClient ?? 0,
          ClientMobileNo: saveSmsEmailArgument?.SmsToClient ?? "",
          IsClientEmail: saveSmsEmailArgument?.IsActiveEmailToClient ?? 0,
          ClientEmail: saveSmsEmailArgument?.EmailToClient ?? "",
          IsCourier: saveSmsEmailArgument?.IsCourier ?? "",
        },
        RcData: RcData,
        FieldIds: "",
        mandatoryFields: [],
      })
      .then(async (res) => {
        
        if (res.data.success) {
          toast.success(res.data.message);
          // console.log(res?.data);
          if (res?.data?.data?.hideReceipt != 1) {
            // setIsSubmit({
            //   type: "Error",
            //   isLoading: false,
            // });
            // handleReset();
            // await getReceipt(
            //   res?.data?.data?.ledgertransactionID,
            //   res?.data?.data?.fullyPaid
            // );
          }

          // if (res?.data?.data?.isConcern == 1) {
          //   getConcern(res?.data?.data?.ledgertransactionID);
          // }
          // if (res?.data?.data?.isPndt == 1) {
          //   getPndtForm(res?.data?.data?.ledgertransactionID);
          // }

          // getReceiptTRF(
          //   res?.data?.data?.ledgertransactionID,
          //   res?.data?.data?.isTrfRequired,
          //   res?.data?.data?.isDepartmentSlip
          // );
          handleReset();
        } else {
          setIsSubmit({
            type: "Error",
            isLoading: false,
          });
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        setIsRazorPayOpen(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong.11"
        );
        setIsSubmit({
          type: "Error",
          isLoading: false,
        });
      });
  };

  const handleSubmitFinalBooking = (data) => {
    if (state?.AutoEmail == 1) {
      setAutoEmail({
        order_id: data,
        flag: true,
      });
      setSaveSmsEmail({
        ...saveSmsEmail,
        IsActiveEmailToClient:
          saveSmsEmail?.IsActiveEmailToClient !== ""
            ? saveSmsEmail?.IsActiveEmailToClient
            : saveSmsEmail?.EmailToClient != ""
              ? 1
              : state?.RateTypeEmail != ""
                ? 1
                : 0,
        IsActiveSmsToDoctor:
          saveSmsEmail?.IsActiveSmsToDoctor !== ""
            ? saveSmsEmail?.IsActiveSmsToDoctor
            : saveSmsEmail?.SmsToDoctor != ""
              ? 1
              : LTData?.DoctorMobile != ""
                ? 1
                : 0,
        IsActiveEmailToDoctor:
          saveSmsEmail?.IsActiveEmailToDoctor !== ""
            ? saveSmsEmail?.IsActiveEmailToDoctor
            : saveSmsEmail?.EmailToDoctor != ""
              ? 1
              : LTData?.DoctorEmail != ""
                ? 1
                : 0,
        IsActiveEmailToPatient:
          saveSmsEmail?.IsActiveEmailToPatient !== ""
            ? saveSmsEmail?.IsActiveEmailToPatient
            : saveSmsEmail?.EmailToPatient != ""
              ? 1
              : state?.Email != ""
                ? 1
                : 0,
        IsActiveSmsToPatient:
          saveSmsEmail?.IsActiveSmsToPatient !== ""
            ? saveSmsEmail?.IsActiveSmsToPatient
            : saveSmsEmail?.SmsToPatient != ""
              ? 1
              : state?.Mobile != ""
                ? 1
                : 0,
        IsActiveSmsToClient:
          saveSmsEmail?.IsActiveSmsToClient !== ""
            ? saveSmsEmail?.IsActiveSmsToClient
            : saveSmsEmail?.SmsToClient != ""
              ? 1
              : state?.RateTypePhone != ""
                ? 1
                : 0,
        IsWhatsappRequired: saveSmsEmail?.IsWhatsappRequired
          ? saveSmsEmail?.IsWhatsappRequired
          : 0,
      });
      setShow6(true);
    } else {
      handleSaveSmsEmailSave(data, saveSmsEmail);
    }
  };
  const getPaymentModeAmount = RcData?.filter(
    (ele) => ele?.PaymentMode == "Online Payment"
  );
  // console.log(LTData, RcData, state);
  const [searchTest, setSearchTest] = useState("TestName");
  const [slotOpen, setSlotOpen] = useState({
    show: false,
    data: "",
  });

  const [Pndt, setPndt] = useState({
    PNDT: false,
    NoOfChildren: "",
    NoOfSon: "",
    NoOfDaughter: "",
    Pregnancy: "",
    AgeOfSon: "",
    AgeOfDaughter: "",
    PNDTDoctor: "",
    Husband: "",
  });
  const [DoctorData, setDoctorData] = useState([]);
  const handlePNDT = () => {
    setPndt({
      ...Pndt,
      PNDT: Pndt?.PNDT ? false : true,
      NoOfChildren: "",
      NoOfSon: "",
      NoOfDaughter: "",
      Pregnancy: "",
      AgeOfSon: "",
      AgeOfDaughter: "",
      PNDTDoctor: "",
      Husband: "",
    });
  };
  const handleDatePNDT = (value, name) => {
    setPndt({
      ...Pndt,
      [name]: value,
    });
  };
  const handlePNDTChange = (e) => {
    const { name, value } = e.target;
    setPndt({
      ...Pndt,
      [name]: value,
    });
  };
  const handleCityState = (
    id,
    name,
    email,
    phone,
    ClientAddress,
    HideAmount,
    ProEmployee,
    AutoEmail,
    states
  ) => {
    setLoad(true);
    axiosInstance
      .post("Centre/getRateTypeDetailWithCentre", {
        CentreID: id,
      })
      .then((res) => {
        setLoad(false);
        setState({
          ...states,
          RateTypeEmail: email,
          RateTypePhone: phone,
          ClientAddress: ClientAddress,
          HideAmount: HideAmount,
          ProEmployee: ProEmployee,
          AutoEmail: AutoEmail,
          [name]: id,
          PinCode: res?.data?.message[0]?.Pincode
            ? res?.data?.message[0]?.Pincode
            : "",
          City: res?.data?.message[0]?.City ? res?.data?.message[0]?.City : "",
          State: res?.data?.message[0]?.State
            ? res?.data?.message[0]?.State
            : "",
          Country: res?.data?.message[0]?.Country
            ? res?.data?.message[0]?.Country
            : "1",
        });
      })
      .catch((err) => {
        setLoad(false);
        setState({
          ...states,
          RateTypeEmail: email,
          RateTypePhone: phone,
          ClientAddress: ClientAddress,
          HideAmount: HideAmount,
          [name]: id,
        });
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong.22"
        );
      });
  };

  const PaymentData = () => {
    let match = false;
    if (handleRateTypePaymode !== "Credit") {
      const data = ["Cash", "Online Payment", "Paytm"];
      for (let i = 0; i < RcData.length; i++) {
        if (!data.includes(RcData[i].PaymentMode)) {
          if (
            RcData[i].CardDate === "" ||
            RcData[i]?.CardNo === "" ||
            RcData[i]?.BankName === ""
          ) {
            match = true;
          }
        }
      }
    }
    return match;
  };

  useEffect(() => {
    if (handleRateTypePaymode === "Cash") {
      // console.log(LTData?.NetAmount);
      if (RcData.length === 1) {
        let data = RcData.map((ele) => {
          return {
            ...ele,
            Amount: "",
          };
        });
        setRcData(data);
      }
    }
  }, [LTData?.NetAmount]);

  useEffect(() => {
    if (handleRateTypePaymode === "Cash") {
      setRcData([
        {
          PayBy: "Patient",
          ReceiptNo: "",
          ledgerNoCr: "",
          RateTypeId: state?.RateID,
          PaymentMode: "Cash",
          PaymentModeID: 134,
          Amount: "",
          BankName: "",
          CardDate: "",
          CardNo: "",
          CentreID: LTData?.CentreID,
        },
      ]);
    }
  }, [LTData?.DiscountOnTotal]);

  useEffect(() => {
    // setLTData({
    //   ...LTData,
    //   PName:
    //     state?.Title +
    //     " " +
    //     state?.FirstName?.trim() +
    //     (state?.MiddleName?.trim() ? " " + state?.MiddleName?.trim() : "") +
    //     (state?.LastName?.trim() ? " " + state?.LastName?.trim() : ""),
    //   Age: state?.Age,
    //   Gender: state?.Gender,
    //   RateTypeId: state?.RateID,
    //   VIP: state?.isVIP,
    // });
    if (LTData?.CentreID === "" || !LTData?.CentreID || LTData?.CentreID == "")
      getAccessCentres(
        setCentreData,
        LTData,
        setLTData,
        LTDataIniti,
        handleRateType,
        VisitTypeCategory,
        fetchFields
      );
    const data = RcData.map((ele) => {
      return {
        ...ele,
        CentreID: LTData?.CentreID,
        RateTypeId: state?.RateID,
        // PaymentMode: handleRateTypePaymode === "Credit" ? "Credit" :ele?.PaymentModeID,
        // PaymentModeID: handleRateTypePaymode === "Credit" ? 215 : ele?.PaymentModeID,
      };
    });
    setRcData(data);
  }, [state]);
  // console.log(RcData);
  const handleMainChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "Mobile" && value.length === 10) {
      axiosInstance
        .post("CommonController/CheckInvalidMobileNo", {
          MobileNo: value,
        })
        .then((res) => {})

        .catch((err) => {
          if (err?.response?.data?.message >= 1) {
            toast.error("Invalid number");
            setState({ ...state, [name]: "" });
          } else {
            setState({ ...state, [name]: value });
          }
        });
      return;
    }
    if (name === "Gender") {
      setState({
        ...state,
        [name]: value,
      });
      setPndt({
        ...Pndt,
        PNDT: false,
        NoOfChildren: "",
        NoOfSon: "",
        NoOfDaughter: "",
        Pregnancy: "",
        AgeOfSon: "",
        AgeOfDaughter: "",
        PNDTDoctor: "",
        Husband: "",
      });
    }

    if (name === "ProEmployee") {
      setState({
        ...state,
        [name]: value,
      });
    }
    if (name === "Title") {
      setState({
        ...state,
        [name]: value,
      });
      setPndt({
        ...Pndt,
        PNDT: false,
        NoOfChildren: "",
        NoOfSon: "",
        NoOfDaughter: "",
        Pregnancy: "",
        AgeOfSon: "",
        AgeOfDaughter: "",
        PNDTDoctor: "",
        Husband: "",
      });
    }

    if (name === "FirstName") {
      setState({
        ...state,
        [name]: PreventSpecialCharacterFirstName(value)
          ? value?.toUpperCase()
          : state[name],
      });
    } else {
      setState({
        ...state,
        [name]:
          type === "checkbox"
            ? checked
              ? 1
              : 0
            : [
                  "MiddleName",
                  "LastName",
                  "City",
                  "State",
                  "Country",
                  "Locality",
                ].includes(name)
              ? PreventSpecialCharacter(value.toUpperCase())
                ? value.toUpperCase()
                : state[name]
              : [""].includes(name)
                ? PreventSpecialCharacter(value)
                  ? value
                  : state[name]
                : value,
      });
    }
  };

  const getSubtractType = (name) => {
    return name === "AgeYear"
      ? "years"
      : name === "AgeMonth"
        ? "months"
        : "days";
  };

  const handleDateFunction = (value) => {
    const { year, month, days } = value;
    const yearDiff = moment().subtract(year, "years")?._d;
    const monthDiff = moment(yearDiff).subtract(month, "months")?._d;
    const daysDiff = moment(monthDiff).subtract(days, days)?._d;

    return {
      AgeYear: yearDiff,
      AgeMonth: monthDiff,
      AgeDays: daysDiff,
    };
  };
  // console.log(DateData);
  const handleDOBCalculation = (e) => {
    const { name, value } = e.target;

    let diff = {};
    let subtractType = getSubtractType(name);
    if (name === "AgeYear") {
      diff = moment().subtract(value, subtractType);
      setDateData({
        ...DateData,
        AgeYear: diff?._d,
      });
    }

    if (name === "AgeMonth") {
      diff = moment(DateData?.AgeYear || new Date().now).subtract(
        value,
        subtractType
      );
      setDateData({
        ...DateData,
        AgeMonth: diff?._d,
      });
    }

    if (name === "AgeDays") {
      diff = moment(DateData?.AgeMonth || new Date().now).subtract(
        value,
        subtractType
      );
      setDateData({
        ...DateData,
        AgeDays: diff?._d,
      });
    }

    var startDate = moment(diff._d);
    var endDate = moment();

    var yearsDiff = endDate.diff(startDate, "years");
    startDate.add(yearsDiff, "years");

    var monthsDiff = endDate.diff(startDate, "months");
    startDate.add(monthsDiff, "months");

    var daysDiff = endDate.diff(startDate, "days");
    setState({
      ...state,
      [name]: value,
      DOB: diff?._d,
      TotalAgeInDays: moment(moment().format("YYYY-MM-DD")).diff(
        diff?._d,
        "days"
      ),
    });

    setLTData({
      ...LTData,
    });

    setTableData([]);

    // setSuggestionData((ele) => ({
    //   ...ele,
    //   testSuggestions: {
    //     ...suggestionData?.testSuggestions,
    //     data: [],
    //     show: false,
    //   },
    //   packageSuggestions: {
    //     ...suggestionData?.packageSuggestions,
    //     data: [],
    //     show: false,
    //   },
    // }));
    setRcData([
      {
        PayBy: "Patient",
        ReceiptNo: "",
        ledgerNoCr: "",
        RateTypeId: state?.RateID,
        PaymentMode: handleRateTypePaymode === "Credit" ? "Credit" : "Cash",
        PaymentModeID: handleRateTypePaymode === "Credit" ? 215 : 134,
        CardDate: "",
        CardNo: "",
        BankName: "",
        Amount: "",
        CentreID: LTData?.CentreID,
      },
    ]);
  };
  // console.log(state);
  useEffect(() => {
    if (state?.isVIP === 0) {
      setState({ ...state, IsMask: 0 });
    }
  }, [state?.isVIP]);

  const handleDeboucing = (fuc) => {
    let timeout;
    return function (value) {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        fuc(value);
      }, 400);
    };
  };
  function getTestNamesWithBlankSampleTypeID() {
    const testsWithBlankSampleTypeID = PLO.filter(
      (test) =>
        test?.IsSampleRequired == "Sample Required" &&
        (test?.sampleTypeID === "" || test?.sampleTypeID === 0)
    );
    if (testsWithBlankSampleTypeID?.length === 0) {
      return false;
    } else {
      const testNames = testsWithBlankSampleTypeID?.map(
        (test) => test.ItemName
      );

      const concatenatedTestNames = testNames?.join(", ");

      return "In " + concatenatedTestNames + " test SampleType Not Found";
    }
  }
  const getSuggestion = (value) => {
    if (disAmt || discountPercentage) {
      toast.error("Remove Discount Amount or Discount Percentage to Add");
      return;
    }
    if (!state?.DOB) {
      toast.error("Please choose DOB || Age");
    } else {
      if (LTData?.CentreID) {
        if (value.length >= 2) {
          axiosInstance
            .post("TestData/BindBillingTestData", {
              TestName: value,
              CentreID: state?.RateID,
              SearchBy: searchTest,
            })
            .then((res) => {
              if (res?.data?.success) setSuggestion(res?.data?.message);
              else {
                toast.error("Please check rate/Share and sample type");
              }
            })
            .catch((err) => {
              toast.error(err?.response?.data?.message);
            });
        } else {
          setSuggestion([]);
        }
      } else {
        toast.error("please Select Centre");
      }
    }
  };

  const debouce = handleDeboucing(getSuggestion);

  const handleChange = (event) => {
    const { value } = event.target;
    debouce(value);
  };

  const getStates = (value) => {
    axiosInstance
      .post("LocationMaster/getAllState", {
        BusinessZoneID: "",
      })
      .then((res) => {
        // if(res?.data?.success) {
        const data = res.data.message;
        const States = data.map((ele) => {
          return {
            value: ele.StateId,
            label: ele.State,
          };
        });
        setStates(States);
        // } else {
        //     toast.error(res?.data?.message);
        // }
      })
      .catch((err) => {
        setStates([]);
        toast.error(
          err.response.data.message
            ? err.response.data.message
            : "Something went wrong.33"
        );
        console.log(err);
      });
  };

  const getCity = (value) => {
    setLoad(true);
    return axiosInstance
      .post("LocationMaster/bindAllCity", {
        // StateID: [value],
        StateID: String(value),
      })
      .then((res) => {
        if (res?.data?.success) {
          const data = res.data.message;
          const cities = data.map((ele) => {
            return {
              // value: handleSplitData(ele.ID),
              value: ele.ID,
              label: ele.City,
            };
          });
          setLoad(false);
          setCity(cities);
          return cities;
        } else {
          toast.error("Something went wrong.44");
          setLoad(false);
        }
      })
      .catch((err) => {
        toast.error("No City Available");
        setLoad(false);
      });
  };

  useEffect(() => {
    getStates("");
  }, [state?.Country]);

  const handleSearchSelectChange = (label, value) => {
    if (label === "Country") {
      setState({
        ...state,
        [label]: (value?.value).toString() || "1",
      });
    }
    if (label === "State") {
      if (value?.value || value?.value !== "")
        getCity((value?.value).toString());
      setState({
        ...state,
        [label]: (value?.value).toString(),
        City: "",
      });
      setCity([]);
    }
    if (label === "City") {
      setState({
        ...state,
        [label]: (value?.value).toString(),
      });
    }
    if (label === "CentreID") {
      setLTData({
        ...LTData,
        ["CentreID"]: value?.value,
        CentreName: value?.label,
        VisitType: value?.VisitType,
        SetMRP: value?.SetMRP,
        BTB: value?.BTB,
      });
      setSaveSmsEmail({
        SmsToPatient: "",
        SmsToDoctor: "",
        IsActiveSmsToPatient: "",
        IsActiveSmsToDoctor: "",
        EmailToPatient: "",
        EmailToDoctor: "",
        IsActiveEmailToPatient: "",
        IsActiveEmailToDoctor: "",
        SmsToClient: "",
        IsActiveSmsToClient: "",
        EmailToClient: "",
        IsActiveEmailToClient: "",
        IsCourier: "",
        IsWhatsappRequired: "",
      });
      handleRateType(value?.value);
      VisitTypeCategory(value?.VisitType);
      fetchFields(value?.VisitType);
      // getSpecialDayTest(value?.value, state?.RateID);
    }
    if (label === "RateID") {
      setBarcodeLogic(Number(value?.BarcodeLogic));
      handleCityState(
        value?.value,
        label,
        value?.RateTypeEmail,
        value?.RateTypePhone,
        value?.ClientAddress,
        value?.HideAmount,
        value?.ProEmployee,
        value?.AutoEmail,
        state
      );
      setSaveSmsEmail({
        SmsToPatient: "",
        SmsToDoctor: "",
        IsActiveSmsToPatient: "",
        IsActiveSmsToDoctor: "",
        EmailToPatient: "",
        EmailToDoctor: "",
        IsActiveEmailToPatient: "",
        IsActiveEmailToDoctor: "",
        SmsToClient: "",
        IsActiveSmsToClient: "",
        EmailToClient: "",
        IsActiveEmailToClient: "",
        IsCourier: "",
        IsWhatsappRequired: "",
      });
    }
    if (label === "VisitType") {
      setLTData({
        ...LTData,
        ["VisitType"]: value?.value,
        Category: "",
      });
      VisitTypeCategory(Number(value?.value));
      fetchFields(value?.value);
    }
    if (label === "CollectionBoyId") {
      setLTData({
        ...LTData,
        ["CollectionBoyId"]: value?.value,
      });
    }
    if (label === "Category") {
      setLTData({
        ...LTData,
        ["Category"]: value?.value ? value?.value : "",
      });
    }
  };
  const handleSelectChange = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex]?.text;

    if (name === "PatientIDProof") {
      setLTData({ ...LTData, [name]: value });
    }

    if (name === "VisitType") {
      setLTData({ ...LTData, [name]: value });
      fetchFields(value);
    }

    if (name === "ReportDeliveryMethodId") {
      setLTData({ ...LTData, [name]: value });
    }

    if (name === "DiscountApprovedBy") {
      if (value) {
        checkEmploypeeWiseDiscount(LTData, value)
          .then((res) => {
            setLTData({
              ...LTData,
              [name]: value,
              DiscountId: "",
              DiscountReason: "",
            });
          })
          .catch((err) => {
            toast.error(err);
            setLTData({
              ...LTData,
              [name]: "",
              DiscountId: "",
              DiscountReason: "",
            });
          });
      } else {
        setLTData({
          ...LTData,
          [name]: "",
          DiscountId: "",
          DiscountReason: "",
        });
      }
    }

    if (name === "DiscountReason") {
      setLTData({ ...LTData, [name]: value });
    }

    if (name === "CollectionBoyId") {
      setLTData({ ...LTData, [name]: value });
    } else {
      // getSpecialDayTest(LTData?.CentreID,value)
    }

    if (name === "SrfId") {
      setLTData({ ...LTData, [name]: value });
    }
    if (name === "IcmrId") {
      setLTData({ ...LTData, [name]: value });
    }
    if (name === "CashRendering") {
      setLTData({ ...LTData, [name]: value });
    }
    if (name === "DiscountType") {
      if (value == "2") {
        handleDiscountAgeWiseItem();
        setLTData({
          ...LTData,
          [name]: Number(value),
          DiscountApprovedBy: "",
          DiscountReason: "",
        });
        setdisAmt("");
        setDiscountPercentage("");
      }

      if (value == "1") {
        setdisAmt("");
        setDiscountPercentage("");
        setLTData({
          ...LTData,
          [name]: Number(value),
          DiscountId: "",
          DiscountReason: "",
        });
      }
    }
  };

  const handleSelectNew = (event) => {
    const { name, value } = event?.target;
    setLTData({ ...LTData, [name]: value });
  };

  // useEffect(() => {
  //   fetchFields(LTData?.VisitType);
  // }, []);

  // const findGender = () => {
  //   const male = ["Mr.", "Baba", "Dr.(Mr)", "Master"];
  //   const female = [
  //     "Miss.",
  //     "Mrs.",
  //     "Baby",
  //     "Dr.(Miss)",
  //     "Dr.(Mrs)",
  //     "Ms.",
  //     "SMT.",
  //   ];
  //   const other = [""];
  //   if (male.includes(state?.Title)) {
  //     setState({ ...state, Gender: "Male" });
  //   }

  //   if (female.includes(state?.Title)) {
  //     setState({ ...state, Gender: "Female" });
  //   }
  //   if (other.includes(state?.Title)) {
  //     setState({ ...state, Gender: "Other" });
  //   }
  // };

  const findGender = () => {
    const title = state?.Title;

    if (!title) return;

    if (title === "TGENDER") {
      setState({ ...state, Gender: "TGENDER" });
      return;
    }

    if (title === "Transgender") {
      setState({ ...state, Gender: "Transgender" });
      return;
    }

    const femaleTitles = [
      "MISS.",
      "Miss.",
      "MRS",
      "Mrs.",
      "MS",
      "Ms.",
      "Ms",
      "Dr.(Miss)",
      "Dr.(Mrs)",
      "SMT.",
    ];
    if (femaleTitles.includes(title)) {
      setState({ ...state, Gender: "Female" });
      return;
    }

    const maleTitles = ["MR", "Mr.", "MR.", "BABA", "Dr.(Mr)", "MASTER"];
    if (maleTitles.includes(title)) {
      setState({ ...state, Gender: "Male" });
      return;
    }

    const defaultToMaleTitles = [
      "PROF.",
      "prof",
      "PROF",
      "BABY",
      "BABY OF",
      "BABYOF",
      "B/O",
      "BABA OF",
      "BABY1",
      "BABOF",
      "BABA",
      "B/o",
      "BRIG.",
      "MASTER",
    ];
    if (defaultToMaleTitles.includes(title)) {
      setState({ ...state, Gender: "Male" });
    }
  };

  useEffect(() => {
    findGender();
    setPndt({
      ...Pndt,
      PNDT: false,
      NoOfChildren: "",
      NoOfSon: "",
      NoOfDaughter: "",
      Pregnancy: "",
      AgeOfSon: "",
      AgeOfDaughter: "",
      PNDTDoctor: "",
      Husband: "",
    });
  }, [state?.Title]);

  const getFilteredBankList = (paymentMode) => {
    if (!paymentMode) return [];

    const isOnlinePayment = paymentMode === "Online Payment";

    return isOnlinePayment
      ? BankName.filter((b) => ["QR Code", "Payment Gateway"].includes(b.label))
      : BankName.filter(
          (b) => !["QR Code", "Payment Gateway"].includes(b.label)
        );
  };

  const calculateDOB = (value) => {
    var TodayDate = moment(new Date().now).format("YYYY,MM,DD");
    var DOBDate = moment(value).format("YYYY,MM,DD");
    var a = moment(TodayDate);
    var b = moment(DOBDate);
    var years = a.diff(b, "year");
    b.add(years, "years");
    var months = a.diff(b, "months");
    b.add(months, "months");
    var days = a.diff(b, "days");
    days = years == 0 && months == 0 && days == 0 ? 1 : days;

    return { years, months, days };
  };

  const calculateTotalNumberOfDays = (value) => {
    return moment(moment().format("YYYY-MM-DD")).diff(value, "days");
  };
  // console.log(state);
  const dateSelect = (value, name) => {
    const { years, months, days } = calculateDOB(value);
    setState({
      ...state,
      [name]: value,
      AgeYear: years,
      AgeMonth: months,
      AgeDays: days,
      TotalAgeInDays: calculateTotalNumberOfDays(value),
    });
    const dateForFields = handleDateFunction({
      year: years,
      month: months,
      days: days,
    });
    setDateData({
      AgeYear: dateForFields?.AgeYear,
      AgeMonth: dateForFields?.AgeMonth,
      AgeDays: dateForFields?.AgeDays,
    });

    setTableData([]);
    // setSuggestionData((ele) => ({
    //   ...ele,
    //   testSuggestions: {
    //     ...suggestionData?.testSuggestions,
    //     data: [],
    //     show: false,
    //   },
    //   packageSuggestions: {
    //     ...suggestionData?.packageSuggestions,
    //     data: [],
    //     show: false,
    //   },
    // }));
    setRcData([
      {
        PayBy: "Patient",
        ReceiptNo: "",
        ledgerNoCr: "",
        RateTypeId: state?.RateID,
        PaymentMode: handleRateTypePaymode === "Credit" ? "Credit" : "Cash",
        PaymentModeID: handleRateTypePaymode === "Credit" ? 215 : 134,
        CardDate: "",
        CardNo: "",
        BankName: "",
        Amount: "",
        CentreID: LTData?.CentreID,
      },
    ]);
  };
  const dateregselecect = (value, name) => {
    setLTData({ ...LTData, [name]: value });
  };

  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };

  const guidNumber = () => {
    const guidNumber =
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4();
    return guidNumber;
  };

  useEffect(() => {
    BindDoctorData();
    const DocumentId = guidNumber();
    setDocumentID(DocumentId);
    const patientId = guidNumber();
    SetPatientGuid(patientId);
    getProEmployee();
  }, []);

  const handleIndex = (e) => {
    const { name } = e.target;
    switch (name) {
      case "TestName":
        switch (e.which) {
          case 38:
            if (indexMatch !== 0) {
              setIndexMatch(indexMatch - 1);
            } else {
              setIndexMatch(suggestion.length - 1);
            }
            break;
          case 40:
            if (suggestion.length - 1 === indexMatch) {
              setIndexMatch(0);
            } else {
              setIndexMatch(indexMatch + 1);
            }
            break;
          case 13:
            if (suggestion.length > 0) {
              handleListSearch(suggestion[indexMatch], name);
            }
            setIndexMatch(0);
            break;
          default:
            break;
        }
        break;
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
      default:
        break;
    }
  };

  const validtabledata = (data, test, Promo) => {
    if (coupon?.field) {
      toast.error(
        "You can't add test because you have applied coupon,first remove coupon code."
      );
    } else {
      getTableData(data, "test", Promo);
    }
  };
  // console.log(PLO)
  const handleListSearch = (data, name, Promo) => {
    switch (name) {
      case "TestName":
        document.getElementById("testSearch").value = "";
        setIndexMatch(0);
        setSuggestion([]);
        validtabledata(data, "test", Promo);

        break;
      case "DoctorName":
        setFormData({ ...formData, [name]: data.Name });
        setLTData({
          ...LTData,
          [name]: data.Name,
          DoctorID: data.DoctorReferalID,
          ReferLabId: data.DoctorReferalID,
          ReferLabName: data.Name,
          DoctorMobile: data?.Mobile,
          DoctorEmail: data?.Email,
          ProEmployee: data?.ProEmployee,
        });
        setState({
          ...state,
          ProEmployee:
            state?.ProEmployee != "" ? state?.ProEmployee : data?.ProEmployee,
        });
        setIndexMatch(0);
        setDoctorSuggestion([]);
        setDropFalse(false);
        break;
      case "SecondReferDoctor":
        setFormData({ ...formData, [name]: data.Name });
        setLTData({
          ...LTData,

          SecondReferDoctor: data.DoctorReferalID,
          // ReferLabId: data.DoctorReferalID,
          // ReferLabName: data.Name,
          // DoctorMobile: data?.Mobile,
          // DoctorEmail: data?.Email,
        });
        setIndexMatch(0);
        setDoctorSuggestion([]);
        setSecondDropFalse(false);
        break;
      default:
        break;
    }
  };

  const handleLTData = (e) => {
    const { name, value } = e.target;
    setLTData({
      ...LTData,
      [name]: value,
    });
  };

  useEffect(() => {
    getDoctorSuggestion(formData, setDoctorSuggestion, setFormData);
  }, [formData?.DoctorName]);
  useEffect(() => {
    getsecondDoctorSuggestion(formData, setseconddoctorSuggestion, setFormData);
  }, [formData?.SecondReferDoctor]);

  const getBarcode = (id) => {
    let barcode = "";
    if (BarcodeLogic === 3) {
      barcode = tableData[0]?.BarcodeNo;
    } else if (BarcodeLogic === 4) {
      tableData?.map((ele) => {
        if (ele?.SampleTypeID === id) {
          barcode = "";
        }
      });
    }
    return barcode;
  };
  // console.log(tableData);
  const handleSelectSlot = (data, slotData, testData) => {
    toast.success("Slot Added Successfully");
    const index = tableData?.findIndex(
      (item) => item.InvestigationID === testData.InvestigationID
    );

    if (index !== -1) {
      const updatedTableData = [...tableData];
      updatedTableData[index] = {
        ...updatedTableData[index],
        StartTime: slotData?.StartTime,
        EndTime: slotData?.EndTime,
        StartEndTimeSlot: slotData?.StartEndTimeSlot,
        status: slotData?.status,
        color: slotData?.color,
        isSelected: slotData?.isSelected,
        InvestigationDate: data?.InvestigationDate,
        ModalityId: data?.ModalityId,
        SelectedTimeSlot: data?.SelectedTimeSlot,
        ModalityName: data?.ModalityName,
        ShiftName: data?.ShiftName,
        UpdateModalityId: 1,
      };

      setTableData(updatedTableData);
    } else {
      setTableData([
        ...tableData,
        {
          ...data,
          ...slotData,
          ...testData,
          Discount: data?.Discount
            ? ((Number(testData.Rate) * data?.Discount) / 100).toFixed(2)
            : "",
          Rate: Number(testData.Rate).toFixed(2),
          NetAmount: data?.Discount
            ? (
                testData.Rate -
                (Number(testData.Rate) * data?.Discount) / 100
              ).toFixed(2)
            : Number(testData.Rate).toFixed(2),
          IsSampleCollected: "N",
          Status: 1,
          IsUrgent: 0,
          UrgentDateTime: "",
          BarcodeNo: getBarcode(testData?.SampleTypeID),
          isLabOutSource: testData?.isLabOutSource,
          IsCulture: testData?.IsCulture,
          UpdateModalityId: 1,
        },
      ]);
    }
  };

  const getTableData = (data, key, Promo) => {
    setLoad(true);
    const ItemIndex = tableData.findIndex(
      (e) => e.InvestigationID == data.InvestigationID
    );

    if (ItemIndex === -1) {
      axiosInstance
        .post("TestData/BindSingleTestData", {
          InvestigationID: data.InvestigationID,
          CentreID: data?.CentreID,
          CentreIdNew: LTData?.CentreID,
          FamilyMemberIsPrimary: throughMemberData
            ? Memberdetails?.FamilyMemberIsPrimary
            : 0,
          PatientCode: throughMemberData ? Memberdetails?.PatientCode : 0,
          MembershipCardID: throughMemberData
            ? Memberdetails?.MembershipCardID
            : 0,
          SetMRP: LTData?.SetMRP,
          IsPromotional: Promo ? 1 : 0,
          PromotionalID: data?.PromotionalID ? data?.PromotionalID : 0,
          Cdac: data?.throughHmis ? data?.throughHmis : state?.throughHmis,
        })
        .then((res) => {
          if (res?.data?.message?.length > 0 && res?.data?.success) {
            const { genderCheck, ageCheck, message } = CheckageTest(
              res?.data?.message[0]?.Gender,
              res?.data?.message[0]?.ToAge,
              res?.data?.message[0]?.FromAge
            );

            if (genderCheck && ageCheck) {
              if (
                res?.data?.message[0]?.IsSampleRequired == "Sample Required" &&
                (res?.data?.message[0]?.SampleTypeID == "" ||
                  res?.data?.message[0]?.SampleTypeID == 0)
              ) {
                toast?.error(
                  "In " +
                    res?.data?.message[0]?.TestName +
                    " test SampleType Not Found"
                );
              } else if (res?.data?.message[0]?.Radiology == 1) {
                setSlotOpen({
                  data: res?.data?.message[0],
                  show: true,
                });
              } else
                setTableData((prevData) => [
                  ...prevData,
                  {
                    ...res?.data?.message[0],
                    hmis_req_no: data?.hmis_req_no ? data.hmis_req_no : "",
                    hmis_req_dno: data?.hmis_req_dno ? data.hmis_req_dno : "",
                    hmis_lab_code: data?.hmis_lab_code
                      ? data.hmis_lab_code
                      : "",
                    hmis_test_code: data?.hmis_test_code
                      ? data.hmis_test_code
                      : "",
                    hmis_test_name: data?.hmis_test_name
                      ? data.hmis_test_name
                      : "",
                    hmis_sample_code: data?.hmis_sample_code
                      ? data.hmis_sample_code
                      : "",
                    hmis_sample_name: data?.hmis_sample_name
                      ? data.hmis_sample_name
                      : "",
                    cdac_inv_status: data?.cdac_inv_status
                      ? Number(data.cdac_inv_status)
                      : 0,
                    req_type: data?.req_type ? data.req_type : "0",
                    Discount: data?.Discount
                      ? (
                          (Number(res?.data?.message[0].Rate) *
                            data?.Discount) /
                          100
                        ).toFixed(2)
                      : Number(res?.data?.message[0].DiscAmt) == 0
                        ? ""
                        : Number(res?.data?.message[0].DiscAmt),
                    Rate: Number(res?.data?.message[0].Rate).toFixed(2),
                    NetAmount: data?.Discount
                      ? (
                          res?.data?.message[0].Rate -
                          (Number(res?.data?.message[0].Rate) *
                            data?.Discount) /
                            100
                        ).toFixed(2)
                      : Number(res?.data?.message[0].Amount).toFixed(2),
                    IsSampleCollected: "N",
                    Status: 1,
                    IsUrgent: 0,
                    UrgentDateTime: "",
                    BarcodeNo:
                      getBarcode(res?.data?.message[0]?.SampleTypeID) ?? "",
                    isLabOutSource: res?.data?.message[0]?.isLabOutSource,
                    IsCulture: res?.data?.message[0]?.IsCulture,
                    IsConcern: res?.data?.message[0]?.IsConcern,
                    IsPndtForm: res?.data?.message[0]?.IsPndtForm,
                    UrgentdeleiveryDate:
                      res?.data?.message[0]?.UrgentDeliveryDate,
                    DeliveryDate: res?.data?.message[0]?.deliveryDate,
                    DepartmentName: res?.data?.message[0]?.DepartmentName,
                  },
                ]);
              if (key == "Coupon") {
                setCoupon({
                  ...coupon,
                  field: true,
                });
              }
            } else {
              !genderCheck &&
                toast.error("This Test is Not for " + state?.Gender);
              !ageCheck && toast.error(message);
            }
          } else if (res?.data?.message?.length == 0) {
            toast.error("Please check rate/Share and sample type");
          } else {
            toast.error(res?.data?.message);
          }

          setLoad(false);
        })
        .catch((err) => {
          setLoad(false);
          console.log(err);
        });
    } else {
      setLoad(false);
      toast.error("Duplicate Test Found");
    }
  };

  const handlePLOChange = (e, index, main) => {
    const { name, checked } = !main && e.target;
    if (index >= 0) {
      const data = [...tableData];
      if (main) {
        data[index]["IsUrgent"] = 0;
        data[index]["UrgentDateTime"] = "";
      } else if (name === "Status") {
        data[index][name] = checked ? 2 : 1;
        data[index]["IsSampleCollected"] = checked ? "S" : "N";
        if ([3, 4].includes(BarcodeLogic)) {
          if (checked) {
            setShow5({ modal: true, index: index });
          } else {
            setShow5({ modal: false, index: index });
          }
        }
      } else {
        data[index][name] = checked ? 1 : 0;
        if (!checked) {
          data[index]["UrgentDateTime"] = "";
        }
      }
      setTableData(data);
    } else {
      const val = tableData.map((ele) => {
        return {
          ...ele,
          Status: checked ? 2 : 1,
          IsSampleCollected: checked ? "S" : "N",
        };
      });
      setTableData(val);
    }
  };

  const handleCloseBarcodeModal = (value) => {
    if (value?.length >= 3) {
      checkDuplicateBarcode(value, "").then((res) => {
        if (res === "") {
          setShow5({ modal: false, index: -1 });
        } else {
          toast.error(res);
        }
      });
    } else if (value === "") {
      toast.error("This Field Required");
    } else {
      toast.error("Minimum 3 Char is Required");
    }
  };

  const handleDiscountAgeWiseItem = () => {
    axiosInstance
      .post("PatientRegistration/DiscountTypeByAge", {
        Age: state?.AgeYear,
        Gender: state?.Gender,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            label: ele?.DiscountType,
            value: ele?.DiscountId,
            perCentage: ele?.DiscountPer,
          };
        });

        val?.unshift({
          label: "Select Discount",
          value: "",
          perCentage: "",
        });

        setAgeWiseDiscountDropdown(val);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUrgent = (value, index, mainClose) => {
    const data = [...tableData];
    if (mainClose) {
      data[index]["UrgentDateTime"] = "";
      setTableData(data);
    } else {
      data[index]["UrgentDateTime"] = value;
      setTableData(data);
    }
  };

  const handleDiscount = (value, index) => {
    if (disAmt === "" && discountPercentage === "") {
      const data = [...tableData];
      data[index]["Discount"] = value;
      data[index]["NetAmount"] = data[index]["Rate"] - value;
      setTableData(data);
    } else {
      toast.error("Discount already given");
    }
  };

  useEffect(() => {
    if (
      (disAmt == 0 || disAmt === "") &&
      (discountPercentage == 0 || discountPercentage === "")
    ) {
      let total = tableData.reduce((acc, item) => acc + Number(item.Rate), 0);
      let NetTotal = tableData.reduce(
        (acc, item) => acc + Number(item.NetAmount),
        0
      );

      setLTData({
        ...LTData,
        GrossAmount: total,
        NetAmount: NetTotal,
        DiscountOnTotal: total > 0 && NetTotal > 0 ? total - NetTotal : "",
        SrfId: checkCovid() ? LTData?.SrfId : "",
        IcmrId: checkCovid() ? LTData?.IcmrId : "",
      });
      if (throughMemberData) {
        let total = tableData.reduce((acc, item) => acc + Number(item.Rate), 0);
        let NetTotal = tableData.reduce(
          (acc, item) => acc + Number(item.NetAmount),
          0
        );

        setLTData({
          ...LTData,
          GrossAmount: total,
          NetAmount: NetTotal,
          DiscountOnTotal: total > 0 && NetTotal >= 0 ? total - NetTotal : "",
          SrfId: checkCovid() ? LTData?.SrfId : "",
          IcmrId: checkCovid() ? LTData?.IcmrId : "",
        });
      }
    }
    // tableData.length > 2 && getPackageSuggestions(tableData);
  }, [tableData]);

  const getPackageSuggestions = (data) => {
    const payload = [];

    data.forEach((obj) => {
      payload.push(obj.InvestigationID);
    });
    axiosInstance
      .post("TestData/BindPackage", {
        InvestigationID: payload,
        CentreID: state?.RateID,
      })
      .then((res) => {
        let data = res?.data?.message;
        if (res?.data?.success) {
          setSuggestionData((ele) => ({
            ...ele,
            show: true,
            packageSuggestions: {
              ...ele.packageSuggestions,
              data: data,
              show: true,
            },
          }));
        } else {
          setSuggestionData((ele) => ({
            ...ele,
            show: suggestionData?.testSuggestions?.show || false,
            packageSuggestions: {
              ...ele.packageSuggestions,
              data: [],
              show: false,
            },
          }));
        }
      })
      .catch((err) => {
        setSuggestionData((ele) => ({
          ...ele,
          packageSuggestions: {
            ...suggestionData.packageSuggestions,
            data: [],
            show: false,
          },
        }));
        // toast.error(
        //   err?.response?.data?.message
        //     ? err?.response?.data?.message
        //     : "Error Occured"
        // );
      });
  };
  // const getSpecialDayTest = (CentreID, RateTypeID) => {
  //   axiosInstance
  //     .post("TestData/BindPromotional", {
  //       CentreID: CentreID?.toString(),
  //       RateTypeID: RateTypeID?.toString(),
  //     })
  //     .then((res) => {
  //       if (res?.data?.success) {
  //         let data = res?.data?.message;
  //         setSuggestionData((ele) => ({
  //           ...ele,
  //           show: true,
  //           daySuggestions: {
  //             ...suggestionData.daySuggestions,
  //             data: data,
  //             show: true,
  //           },
  //         }));
  //       } else {
  //         setSuggestionData((ele) => ({
  //           ...ele,
  //           daySuggestions: {
  //             ...suggestionData.daySuggestions,
  //             data: [],
  //             show: false,
  //           },
  //         }));
  //       }
  //     })
  //     .catch((err) => {
  //       setSuggestionData((ele) => ({
  //         ...ele,
  //         daySuggestions: {
  //           ...suggestionData.daySuggestions,
  //           data: [],
  //           show: false,
  //         },
  //       }));
  //     });
  // };
  // console.log(tableData);
  const globalVisibleFieldByVisitType = (fields) => {
    fields.forEach((ele) => {
      if (ele?.IsVisible) {
        if (["HLMPatientType", "Source"].includes(ele?.FieldType)) {
          getDropDownData(ele?.FieldType);
        }
      }
    });
  };

  const fetchFields = (visitType) => {
    axiosInstance
      .post("ManageFieldMaster/getAllManageFieldMasterData", {
        VisitTypeID: visitType,
      })
      .then((res) => {
        let data = res?.data?.message;
        data.map((ele) => {
          return {
            ...ele,
            isError: false,
            message: "",
          };
        });

        globalVisibleFieldByVisitType(res?.data?.message);
        setVisibleFields(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };
  const BindDoctorData = () => {
    axiosInstance
      .post("DoctorReferal/getDoctorDataBind")
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            label: ele?.DoctorName,
            value: ele?.DoctorID,
          };
        });
        val.unshift({ label: "Select Doctor", value: "" });
        setDoctorData(val);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "SomeThing Went Wrong.55"
        );
      });
  };

  const checkCovid = () => {
    const isCovid = PLO?.find((ele) => ele?.IsCovid == 1);
    if (isCovid) return true;
    else return false;
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
        return setIdentity(RequiredAttachment);
      })
      .catch((err) => console.log(err));
  };

  const getDropDownData = (name) => {
    const match = ["Title", "Gender", "BankName", "HLMPatientType", "Source"];
    axiosInstance
      .post("Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: match.includes(name) ? ele.FieldDisplay : ele.FieldID,
            label: ele.FieldDisplay,
          };
        });
        !["Title", "PaymentMode", "Gender"].includes(name) &&
          value.unshift({ label: `Select ${name} `, value: "" });

        switch (name) {
          case "Gender":
            const extractedGenders = value
              ?.filter((option) => option?.value != "Both")
              .map((option) => {
                return {
                  value: option?.value,
                  label: option?.label,
                };
              });

            setGender(extractedGenders);
            break;
          case "Title":
            setTitle(value);

            break;
          case "PaymentMode":
            setPaymentMode(value);
            break;
          case "BankName":
            setBankName(value);
            break;
          case "HLMPatientType":
            setHLMPatientType(value);
            break;
          case "Source":
            setSourceType(value);
            break;
          default:
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  //Modal show

  const handleClose = () =>
    setShow({
      Type: "",
      show: false,
    });
  const handleShow = (Type) =>
    setShow({
      Type: Type,
      show: true,
    });
  const handleShowMobile = () => {
    getDataByMobileNo("Mobile");

    // setShow4(true)
  };

  const handleFilter = (data) => {
    // InvestigationID

    if (coupon?.field) {
      toast.error(
        "You can't remove test because you have applied coupon, first remove coupon code."
      );
    } else {
      if (disAmt || discountPercentage) {
        toast.error("First Remove Disc per Or Discount Percentage");
      } else {
        const value = tableData.filter(
          (ele) => ele.InvestigationID !== data.InvestigationID
        );
        setTableData(value);
        // tableData.length > 2 && getPackageSuggestions(value);
        toast.success("Successfully Removed");
        setRcData([
          {
            PayBy: "Patient",
            ReceiptNo: "",
            ledgerNoCr: "",
            RateTypeId: state?.RateID,
            PaymentMode: handleRateTypePaymode === "Credit" ? "Credit" : "Cash",
            PaymentModeID: handleRateTypePaymode === "Credit" ? 215 : 134,
            Amount: "",
            BankName: "",
            CardDate: "",
            CardNo: "",
            CentreID: LTData?.CentreID,
          },
        ]);
      }
    }
  };
  // console.log(PLO);
  useEffect(() => {
    let data = tableData.map((ele) => {
      return {
        InvestigationDate: ele?.InvestigationDate
          ? moment(ele?.InvestigationDate).format("YYYY-MM-DD")
          : "",
        ModalityId: ele?.ModalityId ? ele?.ModalityId : 0,
        ShiftName: ele?.ShiftName ? ele?.ShiftName : "",
        EndTime: ele?.EndTime ? ele?.EndTime : "",
        StartTime: ele?.StartTime ? ele?.StartTime : "",
        StartEndTimeSlot: ele?.StartEndTimeSlot ? ele?.StartEndTimeSlot : "",
        IsRadiology: ele?.Radiology,
        IsSampleCollected: ele?.IsSampleCollected,
        IsSampleRequired: ele?.IsSampleRequired,
        Status: ele?.Status,
        IsUrgent: ele?.IsUrgent,
        sampleTypeID: ele?.SampleTypeID,
        SampleTypeName: ele?.SampleName,
        ItemId: ele?.InvestigationID,
        ItemName: ele?.TestName,
        InvestigationID: ele?.InvestigationID,
        InvestigationName: ele?.TestName,
        ReportType: ele?.ReportType,
        IsPackage: ele?.DataType === "Package" ? 1 : 0,
        Rate: Number(ele?.Rate).toFixed(2),
        Amount: Number(ele?.NetAmount).toFixed(2),
        Quantity: 1,
        PCCDiscAmt: 0,
        PCCDiscPer: 0,
        RateTypeId: state?.RateID,
        DiscountAmt: ele?.Discount,
        DiscountApprovedBy: LTData?.DiscountApprovedBy,
        DiscountReason: LTData?.DiscountReason,
        IsReporting: ele?.IsReporting?.toString(),
        ageInDays: state?.TotalAgeInDays,
        Gender: state?.Gender,
        CentreID: LTData?.CentreID,
        SessionCentreID: useLocalStorage("userData", "get").DefaultCentre,
        TestCentreID: 0,
        SampleBySelf: "1",
        sampleCollectionBy: 0,
        DeliveryDate: ele?.DeliveryDate,
        UrgentDateTime: ele?.UrgentDateTime,
        DepartmentID: ele?.DepartmentID,
        isHistoryReq: 0,
        PackageCode: "",
        PackageName: "",
        TestCode: ele?.TestCode,
        isLabOutSource: ele?.isOutSource,
        IsCulture: ele?.IsCulture,
        MemberType: ele?.MemberType,
        IsConcern: ele?.IsConcern,
        IsPndtForm: ele?.IsPndtForm,
        SetMRP: ele?.SetMRP,
        IsCovid: ele?.IsCovid,
        UrgentdeleiveryDate: ele?.UrgentdeleiveryDate,
        BarcodeNo: ele?.BarcodeNo,
        hmis_req_no: ele?.hmis_req_no,
        hmis_req_dno: ele?.hmis_req_dno,
        hmis_lab_code: ele?.hmis_lab_code,
        hmis_test_code: ele?.hmis_test_code,
        hmis_test_name: ele?.hmis_test_name,
        hmis_sample_code: ele?.hmis_sample_code,
        hmis_sample_name: ele?.hmis_sample_name,
        cdac_inv_status: ele?.cdac_inv_status,
        req_type: ele?.req_type,
        DepartmentName: ele?.DepartmentName ?? "",
      };
    });
    setPLO(data);
  }, [tableData]);

  const checkConcent = () => {
    const check = PLO?.filter((ele) => ele?.IsConcern == "1");

    return check?.length > 0 ? 1 : 0;
  };

  const checkPndt = () => {
    const check = PLO?.filter((ele) => ele?.IsPndtForm == "1");

    return check?.length > 0 ? 1 : 0;
  };
  const handleChangePloBarCode = (e, sampletypeId) => {
    const { value } = e.target;
    if (BarcodeLogic === 3) {
      const data = tableData.map((ele) => {
        return {
          ...ele,
          BarcodeNo: value,
        };
      });
      setTableData(data);
    }
    if (BarcodeLogic === 4) {
      let flag = true;
      for (let i = 0; i < tableData.length; i++) {
        if (
          tableData[i]?.SampleTypeID !== sampletypeId &&
          value !== "" &&
          value === tableData[i]?.BarcodeNo
        ) {
          flag = false;
          break;
        }
      }
      if (flag) {
        const data = tableData.map((ele) => {
          if (ele?.SampleTypeID === sampletypeId) {
            return {
              ...ele,
              BarcodeNo: value,
            };
          } else {
            return ele;
          }
        });
        setTableData(data);
      } else {
        toast.error("This BarCode is Already Given");
      }
    }
  };
  // useEffect(() => {
  //   if (LTData?.CentreID === "" || !LTData?.CentreID || LTData?.CentreID == "")
  //     getAccessCentres(
  //       setCentreData,
  //       LTData,
  //       setLTData,
  //       LTDataIniti,
  //       handleRateType
  //     );
  // }, [LTData?.CentreID]);
  const getVisitType = (state) => {
    axiosInstance
      .get("Centre/visitTypeList")
      .then((res) => {
        let data = res.data.message;
        let Visit = data.map((ele) => {
          return {
            value: ele.FieldID,
            label: ele.FieldDisplay,
          };
        });
        VisitTypeCategory(Number(Visit[0]?.value));
        state(Visit);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getAccessCentres(
      setCentreData,
      LTData,
      setLTData,
      LTDataIniti,
      handleRateType,
      VisitTypeCategory,
      fetchFields
    );
    getCollectionBoy(setCollectionBoy, true);
    getDropDownData("Gender");
    getDropDownData("Title");
    getDropDownData("Identity");
    getDropDownData("PaymentMode");
    getDropDownData("BankName");
    getVisitType(setVisitType);
    getBindDiscApproval(setBindDiscApproval);
    getBindDiscReason(setBindDiscReason);

    getPaymentModes("Source", setPatientSource);
    getPaymentModes("PatientType", setPatientType);
    getRequiredAttachment();
  }, []);
  const handleRateType = (value) => {
    if (value) {
      getAccessDataRate(setRateType, value).then((res) => {
        handleCityState(
          res[0]?.value,
          "RateID",
          res[0]?.RateTypeEmail,
          res[0]?.RateTypePhone,
          res[0]?.ClientAddress,
          res[0]?.HideAmount,
          res[0]?.ProEmployee,
          res[0]?.AutoEmail,
          stateIniti
        );
        setBarcodeLogic(Number(res[0]?.BarcodeLogic));
      });
    }
  };

  // useEffect(() => {
  //   if (!isSubmit?.isLoading && isSubmit?.type === "Success") {
  //     if (LTData?.CentreID || !throughMemberData) {
  //       getAccessDataRate(setRateType, LTData?.CentreID).then((res) => {
  //         handleCityState(
  //           res[0]?.value,
  //           "RateID",
  //           res[0]?.RateTypeEmail,
  //           res[0]?.RateTypePhone,
  //           res[0]?.ClientAddress,
  //           res[0]?.HideAmount,
  //           res[0]?.ProEmployee
  //         );
  //         setBarcodeLogic(Number(res[0]?.BarcodeLogic));
  //       });
  //     } else {
  //       getAccessCentres(setCentreData, LTData, setLTData, LTDataIniti);
  //     }
  //   }
  // }, [LTData?.CentreID, isSubmit, throughMemberData]);

  useEffect(() => {
    let totaldiscount = (LTData.GrossAmount * discountPercentage) / 100;
    let disamount = LTData.GrossAmount - totaldiscount;

    setLTData({
      ...LTData,
      NetAmount: disamount,
      DiscountOnTotal: totaldiscount,
    });
    const data = PLO.map((ele) => {
      return {
        ...ele,
        Amount: Number(
          ele.Rate - (ele.Rate * discountPercentage) / 100
        ).toFixed(2),
        DiscountAmt: ((ele.Rate * discountPercentage) / 100).toFixed(2),
      };
    });
    setPLO(data);
  }, [discountPercentage]);

  useEffect(() => {
    setLTData({ ...LTData, NetAmount: LTData.GrossAmount - disAmt });
  }, [disAmt]);

  const Match = () => {
    let match = false;
    for (var i = 0; i < tableData.length; i++) {
      if (tableData[i].Discount !== "") {
        match = true;
        break;
      }
    }
    return match;
  };

  const handlePaymentChange = (event) => {
    const { value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    let match = false;
    for (var i = 0; i < RcData.length; i++) {
      if (RcData[i].PaymentMode === label) {
        match = true;
        break;
      }
    }
    if (!match) {
      setRcData([
        ...RcData,
        {
          PayBy: "Patient",
          ReceiptNo: "",
          ledgerNoCr: "",
          RateTypeId: state?.RateID,
          PaymentMode: label,
          PaymentModeID: value,
          CardNo: "",
          CardDate: "",
          BankName: "",
          Amount: "",
          CentreID: LTData?.CentreID,
        },
      ]);
    } else {
      toast.error("Payment Mode is Already Added");
    }
  };

  const handleFilterPayment = (index) => {
    if (RcData.length > 1) {
      const data = RcData.filter((ele, i) => index !== i);
      setRcData(data);
      toast?.success("Removed Successfully");
    }
  };
  const calculate = (value, index) => {
    let data = [...RcData];
    data[index]["Amount"] = value;
    const sum = data.reduce((a, item) => Number(item.Amount) + a, 0);
    setPaid(Number(sum).toFixed(2));
    return sum;
  };

  useEffect(() => {
    if (RcData.length === 1) {
      const sum = RcData.reduce((a, item) => Number(item.Amount) + a, 0);
      setPaid(sum);
    }
  }, [RcData]);

  const handleClose2 = () => {
    setShow2(false);
  };

  const handleClose3 = () => {
    setShow3(!show3);
  };

  const getDataByMobileNo = (type) => {
    if (type === "Mobile") {
      if (state?.Mobile.length === 10) {
        axiosInstance
          .post("Booking/getDataByMobileNo", {
            Mobile: state?.Mobile,
            PatientCode: "",
          })
          .then((res) => {
            if (res?.data?.success) {
              const users = res.data.message?.user || [];
              const updatedUsers = users.map((user) => ({
                ...user,
                throughHmis: 0,
                throughHC: 0,
              }));
              setMobileData(updatedUsers);
              // setSuggestionData((ele) => ({
              //   ...ele,
              //   testSuggestions: {
              //     ...suggestionData.testSuggestions,
              //     Total: res?.data?.message?.data,
              //   },
              // }));
            } else {
              setMobileData([]);
              toast.error("No Patient Record Found");
            }

            setShow4(true);
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Error Occured"
            );
          });
      } else {
        toast.error("Mobile Number Length Must Be 10");
      }
    } else {
      if (state?.PatientCode.length >= 3) {
        axiosInstance
          .post("Booking/getDataByMobileNo", {
            Mobile: "",
            PatientCode: state?.PatientCode,
          })
          .then((res) => {
            if (res?.data?.success) {
              const users = res.data.message?.user || [];
              const updatedUsers = users.map((user) => ({
                ...user,
                throughHmis: 0,
              }));
              setMobileData(updatedUsers);
              // setSuggestionData((ele) => ({
              //   ...ele,
              //   testSuggestions: {
              //     ...suggestionData.testSuggestions,
              //     Total: res?.data?.message?.data,
              //   },
              // }));
            } else {
              setMobileData([]);
              toast.error("No Patient Record Found");
            }
            setShow4(true);
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Error Occured"
            );
          });
      }
    }
  };

  const someMethodWithoutAccessToEvent = (e, id) => {
    if (e.key === " ") {
      document.getElementById(id).focus();
    }
  };

  const handlePatientData = (e, type) => {
    const keypress = [9, 13];
    if (keypress.includes(e.which)) {
      getDataByMobileNo(type);
    }
  };
  const handleHMIS_PatCrNo = (e, type) => {
    const keypress = [9, 13];

    if (keypress.includes(e.which)) {
      if (type == "HMIS_PatCrNo") {
        getDataByHMIS_PatCrNo();
      } else getPreBookingNo();
    }
  };
  const getPreBookingNo = () => {
    setLoad(true);
    axiosInstance
      .post("HomeCollectionSearch/hcdemographicdetails", {
        PreBookingId: Number(state?.PreBookingNo?.trim()),
      })
      .then((res) => {
        if (res?.data?.success) {
          const data = res?.data?.message;
          // console.log(data)
          if (data?.[0]?.PaidAmt > 0) {
            setLoad(false);
            toast.error("Patient already registered");

            return;
          }

          const finalData = data?.map((ele) => {
            return {
              Title: ele?.Title,
              FirstName: ele?.FirstName,
              LastName: ele?.LastName,
              MiddleName: ele?.MiddleName,
              Mobile: ele?.Mobile,
              Gender: ele?.Gender,
              DOB: calculateDateOfBirth(ele?.Age, ele?.AgeMonth, ele?.AgeDays),
              Age:
                ele?.Age + " Y " + ele?.AgeMonth + " M " + ele?.AgeDays + " D ",

              Email: ele?.Email,
              Pincode: ele?.pincode,
              HouseNo: ele?.HouseNo,
              City: ele?.City,
              State: ele?.State,
              Country: "",
              StreetName: "",
              IsMask: 0,
              isVIP: 0,
              Locality: ele?.Locality,
              TestData: [],
              PatientGuid: "",
              PatientCode: ele?.PatientCode || "",
              DocumentUplodedCount: 0,
              MedicalHistoryCount: 0,
              hmis_request_type: "",
              hmis_patCrNo: "",
              hmis_hospital_code: "",
              poct_facility_id: "",
              hmis_episode_code: "",
              hmis_episode_visitno: "",
              throughHmis: 0,
              throughHC: 1,
            };
          });
          setShow4(true);
          setMobileData(finalData);
        } else {
          setMobileData([]);
          toast.error("No Patient Record Found");
        }

        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const hcinvestigationdetails = () => {
    setLoad(true);
    axiosInstance
      .post("HomeCollectionSearch/hcinvestigationdetails", {
        PreBookingId: Number(state?.PreBookingNo),
      })
      .then((res) => {
        if (res?.data?.success) {
          const data = res?.data?.message;
          const finalData = data?.map((ele) => {
            return {
              ...ele,
              Amount: ele?.Rate,
              BarcodeNo: "",
              cdac_inv_status: 0,
              DataType: ele?.datatype,
              deliveryDate: ele?.DATE,
              DeliveryDate: ele?.DATE,
              DepartmentID: ele?.DepartmentId,
              DepartmentName: ele?.Department,
              DiscAmt: ele?.DiscAmt,
              Discount: ele?.DiscAmt,
              FromAge: 0,
              Gender: "Both",
              hmis_lab_code: "",
              hmis_req_dno: "",
              hmis_req_no: "",
              hmis_sample_code: "",
              hmis_sample_name: "",
              hmis_test_code: "",
              hmis_test_name: "",
              InvestigationID: ele?.Investigation_ID,
              IsConcern: "0",
              IsCovid: 0,
              IsCulture: 0,
              isOutSource: 0,
              IsReporting: ele?.IsReporting,
              IsSampleCollected: "N",
              IsSampleRequired: ele?.IsSampleRequired,
              IsSampleTypeRequired: ele?.IsSampleTypeRequired,
              IsUrgent: 0,
              MemberType: 0,
              NetAmount: Number(ele?.Rate) - Number(ele?.DiscAmt),
              Radiology: 0,
              Rate: ele?.Rate,
              refRateValue: ele?.Rate,
              ReportType: ele?.ReportType,
              req_type: "0",
              RequiredAttachment: "",
              SampleCode: ele?.SampleCode,
              SampleName: ele?.SampleName,
              SampleRemarks: ele?.SampleRemarks,
              SampleTypeID: ele?.SampleTypeID,
              SetMRP: "0",
              Status: 1,
              TestCode: ele?.TestCode,
              TestName: ele?.TestName,
              ToAge: 70000,
              UrgentDateTime: "",
              UrgentdeleiveryDate: ele?.DATE,
              UrgentDeliveryDate: ele?.DATE,
            };
          });
          setTableData(finalData);
        } else {
          setTableData([]);
        }
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };
  function calculateDateOfBirth(ageYears, ageMonths, ageDays) {
    const now = new Date();
    const dob = new Date(
      now.getFullYear() - ageYears,
      now.getMonth() - ageMonths,
      now.getDate() - ageDays
    );
    dob.setHours(0, 0, 0, 0);
    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return dob.toLocaleString("en-GB", options).replace(",", "");
  }

  const getDataByHMIS_PatCrNo = () => {
    setLoad(true);
    axiosInstance
      .post("CRMIntegration/HimsToLimsIntregration", {
        hmis_patCrNo: state?.HMIS_PatCrNo,
        hmis_request_type: "1",
      })
      .then((res) => {
        if (res?.data?.success) {
          const data = res?.data?.message;
          const { years, months, days } = calculateDOB(
            new Date(data?.hmis_patdob)
          );
          const HMIS = {
            Title: data?.hmis_initial,
            FirstName: data?.hmis_patfirstname,
            LastName: data?.hmis_patlastname,
            MiddleName: data?.hmis_patmiddlename,
            Mobile: data?.hmis_patAddMobileNo,
            Gender: data?.hmis_patgender,
            DOB: data?.hmis_patdob,
            Age: years + " Y " + months + " M " + days + " D ",
            PatientCode: "",
            Email: "",
            Pincode: "",
            HouseNo: data?.hmis_patAddHNo,
            City: data?.hmis_patadddistrict,
            State: data?.hmis_pataddstate,
            Country: data?.pataddcountry,
            StreetName: data?.hmis_patAddStreet,
            IsMask: 0,
            isVIP: 0,
            Locality: data?.hmis_patAddLandMarks,
            TestData: data?.hmis_investigation_data,
            PatientGuid: "",
            DocumentUplodedCount: 0,
            MedicalHistoryCount: 0,
            hmis_request_type: data?.hmis_request_type,
            hmis_patCrNo: data?.hmis_patCrNo,
            hmis_hospital_code: data?.hmis_hospital_code,
            poct_facility_id: data?.poct_facility_id,
            hmis_episode_code: data?.hmis_episode_code,
            hmis_episode_visitno: data?.hmis_episode_visitno,
            throughHmis: 1,
            throughHC: 0,
          };

          setShow4(true);
          setMobileData([HMIS]);
        } else {
          setMobileData([]);
          toast.error("No Patient Record Found");
        }

        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };
  const getMemberhipdata = (e) => {
    const keypress = [9, 13];
    if (keypress.includes(e.which)) {
      axiosInstance
        .post("Booking/GetMemberShipPatientData", {
          MemberShipNo: membershipnum,
          CenterID: LTData?.CentreID,
        })
        .then((res) => {
          if (res?.data?.message?.length > 0) {
            setMemberdata(res?.data.message);
            setShow7(true);
          } else {
            toast.error("No Record Found");
            setShow7(false);
          }
        })
        .catch((err) => {
          toast.error(err?.response.data.message);
        });
    }
  };

  const handleClose4 = () => {
    setShow4(false);
    setMobileData([]);
  };

  const Fetch = async (guidNumber, pageName) => {
    const response = await axiosInstance.post("CommonController/GetDocument", {
      Page: pageName,
      Guid: guidNumber,
    });
    return response?.data?.message;
  };

  const getS3url = async (id) => {
    const response = await axiosInstance.post("CommonController/GetFileUrl", {
      Key: id,
    });
    return response?.data?.message;
  };

  const handlePreviewImage = async (guidNumber) => {
    const response = await Fetch(guidNumber, "patientImage");
    if (response.length > 0) {
      const imgURL = await getS3url(response[0]?.awsKey);
      setPatientImg({
        img: imgURL,
        show: false,
      });
    }
  };

  const handleSelctData = async (data) => {
    console.log("throughMobileData:", throughMobileData);

    setThroughMobileData(true);
    console.log(data, "this is data of patient");
    const matchedState = states.find((s) => s.label === data?.State)?.value;
    if (matchedState) {
      getCity(matchedState).then((cities) => {
        const matchedCity = cities?.find((s) => s.label === data?.City)?.value;
        setState((prev) => ({
          ...prev,
          City: matchedCity?.toString(),
        }));
      });
    }

    const { years, months, days } = calculateDOB(new Date(data?.DOB));
    handlePreviewImage(data?.PatientGuid);
    setState({
      ...state,
      Title: data.Title,
      FirstName: data.FirstName,
      LastName: data?.LastName,
      MiddleName: data?.MiddleName,
      Mobile: data?.Mobile,
      Gender: data?.Gender,
      DOB: data?.DOB === "" ? data?.DOB : new Date(data?.DOB),
      Age: data?.Age,
      PatientCode: data?.PatientCode,
      Email: data?.Email,
      PinCode: data?.Pincode,
      AgeDays: data?.AgeDays === "" ? data?.AgeDays : days,
      AgeMonth: data?.AgeMonth === "" ? data?.AgeMonth : months,
      AgeYear: data?.AgeYear === "" ? data?.AgeYear : years,
      HouseNo: data?.HouseNo,
      State: matchedState?.toString(),
      Country: data?.Country ? data?.Country : "1",
      StreetName: data?.StreetName,
      IsMask:
        (data?.IsMask !== null) &
        (data?.IsMask !== undefined) &
        (data?.IsMask !== "")
          ? data?.IsMask
          : 0,
      isVIP:
        data?.IsVIP !== null && data?.IsVIP !== undefined && data?.IsVIP !== ""
          ? data?.IsVIP
          : 0,
      Locality: data?.Locality,
      TotalAgeInDays: calculateTotalNumberOfDays(new Date(data?.DOB)),
      hmis_request_type: data?.hmis_request_type ?? "",
      hmis_patCrNo: data?.hmis_patCrNo ?? "",
      hmis_hospital_code: data?.hmis_hospital_code ?? "",
      poct_facility_id: data?.poct_facility_id ?? "",
      hmis_episode_code: data?.hmis_episode_code ?? "",
      hmis_episode_visitno: data?.hmis_episode_visitno ?? "",
      throughHmis: data?.throughHmis,
      throughHC: data?.throughHC,
    });
    hcinvestigationdetails();
    if (
      data?.TestData &&
      Array.isArray(data?.TestData) &&
      data?.TestData?.length > 0
    ) {
      const slicedData = data?.TestData;
      slicedData.forEach((entry) => {
        getTableData({
          CentreID: state.RateID,
          InvestigationID: entry?.investigationId,
          hmis_req_no: entry?.hmis_req_no,
          hmis_req_dno: entry?.hmis_req_dno,
          hmis_lab_code: entry?.hmis_lab_code,
          hmis_test_code: entry?.hmis_test_code,
          hmis_test_name: entry?.hmis_test_name,
          hmis_sample_code: entry?.hmis_sample_code,
          hmis_sample_name: entry?.hmis_sample_name,
          cdac_inv_status: entry?.cdac_inv_status,
          req_type: entry?.req_type,
          throughHmis: 1,
        });
      });
    }
    // const testDetails =
    //   suggestionData?.testSuggestions?.Total?.length > 0
    //     ? suggestionData?.testSuggestions?.Total?.filter(
    //         (ele) => ele?.patientcode == data?.PatientCode
    //       )
    //     : [];

    // if (testDetails?.length > 0) {
    //   setSuggestionData((ele) => ({
    //     ...ele,
    //     show: true,
    //     testSuggestions: {
    //       ...suggestionData?.testSuggestions,
    //       data: testDetails,
    //       show: true,
    //     },
    //   }));
    // } else {
    //   setSuggestionData((ele) => ({
    //     ...ele,
    //     show: false,
    //     testSuggestions: {
    //       ...suggestionData?.testSuggestions,
    //       data: [],
    //       show: false,
    //     },
    //   }));
    // }
    SetPatientGuid(
      data?.PatientGuid && data?.PatientGuid !== ""
        ? data?.PatientGuid
        : PatientGuid
    );
    handleUploadCount(
      "UploadDocumentCount",
      data?.DocumentUplodedCount,
      "IsDocumentUploaded",
      "MedicalHistoryCount",
      data?.MedicalHistoryCount,
      "IsMedicalHistory"
    );

    setShowOP(false);
    // handleUploadCount(
    //   "UploadDocumentCount",
    //   data?.MedicalHistoryCount,
    //   "IsDocumentUploaded"
    // );

    // setLTData({
    //   ...LTData,
    // //  CentreName: centreName.label,
    //   CentreID: centreName.value,
    // });
    handleClose4();
    setThroughMobileData(true);
    setIsMobileSelected(true);

    setMobileData([]);
  };
  const handleSelectedData = (data) => {
    const { years, months, days } = calculateDOB(new Date(data?.DOB));

    setState({
      ...state,
      Title: data.Title,
      FirstName: data.FirstName,
      LastName: data?.LastName,
      MiddleName: data?.MiddleName,
      Gender: data?.Gender,
      DOB: new Date(data?.DOB),
      Age: data?.Age,
      PatientCode: data?.PatientCode,
      Email: data?.Email == null ? "" : data?.Email,
      PinCode: data?.Pincode,
      AgeDays: days,
      AgeMonth: months,
      AgeYear: years,
      HouseNo: data?.HouseNo,
      City: data?.City,
      State: data?.State,
      Country: data?.Country,
      StreetName: data?.StreetName,
      IsMask: data?.IsMask,
      isVIP: data?.IsVIP,
      Locality: data?.Locality,
      Mobile: data?.Mobile,
      TotalAgeInDays: calculateTotalNumberOfDays(new Date(data?.DOB)),
    });
    setMemberdetails(data);
    setMemberdata([]);
    setThroughmemberdata(true);
    handleclosemembershipmodal();
  };

  const DynamicFieldValidations = () => {
    const data = visibleFields.map((ele) => {
      if (
        ele["IsMandatory"] == 1 &&
        ele["IsVisible"] == 1 &&
        LTData[ele["FieldType"]] === ""
      ) {
        return {
          ...ele,
          isError: true,
          message: `${ele["FieldType"]} is Required Field`,
        };
      } else {
        return {
          ...ele,
          isError: false,
          message: "",
        };
      }
    });
    return data;
  };

  const getReceipt = async (id, fullyPaid) => {
    await axiosReport
      .post("getReceipt", {
        LedgerTransactionIDHash: id,
      })
      .then((res) => {
        // window.open(res?.data?.url, "_blank");
        if (fullyPaid == 1) getReceiptFullyPaid(id);
      })
      .catch((err) => {
        // toast.error(
        //   err?.data?.response?.message
        //     ? err?.data?.response?.message
        //     : "Error Occured"
        // );
      });
  };
  // console.log(state);
  const getReceiptFullyPaid = (id) => {
    axiosInstance
      .post("reports/v1/getReceiptFullyPaid", {
        LedgerTransactionIDHash: id,
      })
      .then((res) => {
        window.open(res?.data?.url, "_blank");
      })
      .catch((err) => {
        // toast.error(
        //   err?.data?.response?.message
        //     ? err?.data?.response?.message
        //     : "Error Occured"
        // );
      });
  };
  const getConcern = async(id) => {
   await axiosInstance
      .post("ConcentFormMaster/generateConcentForm", {
        LedgerTransactionIDHash: id,
      })
      .then((res) => {
        window.open(res?.data?.url, "_blank");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
      });
  };
  const getPndtForm =async (id) => {
    await axiosInstance
      .post("PndtFormMaster/generatPndtForm", {
        LedgerTransactionIDHash: id,
      })
      .then((res) => {
        window.open(res?.data?.url, "_blank");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
      });
  };
  const getReceiptTRF = async (id, TRF, DepartmentSlip) => {
    if (TRF == 1) {
     await axiosReport
        .post("getTRF", {
          LedgerTransactionIDHash: id,
        })
        .then((res) => {
          window.open(res?.data?.url, "_blank");
        })
        .catch((err) => {
          toast.error(
            err?.data?.response?.message
              ? err?.data?.response?.message
              : "Error Occured"
          );
        });
    }
    if (DepartmentSlip == 1) {
     await axiosReport
        .post("getDepartment", {
          LedgerTransactionIDHash: id,
        })
        .then((res) => {
          window.open(res?.data?.url, "_blank");
        })
        .catch((err) => {
          toast.error(
            err?.data?.response?.message
              ? err?.data?.response?.message
              : "Error Occured"
          );
        });
    }
  };

  const checkPaymentStatus = async (order_id, pLink) => {
    try {
      const { data } = await axiosInstance.post("RazorPay/paymentstatus", {
        order_id: order_id,
        pLink: pLink,
      });
      if (data.success) {
        toast.success("Payment successful!");
        return true;
      } else {
        toast.error("Payment failed. Please try again.");
        return false;
      }
    } catch (error) {
      toast.error("Error checking payment status.");
      return false;
    }
  };
  const getPaymentLink = () => {
    axiosInstance
      .post("RazorPay/createPaymentLink", {
        amount: getPaymentModeAmount[0]?.Amount,
        receipt: guidNumber(),
        mobile: state?.Mobile,
        email: state?.Email,
      })
      .then((res) => {
        if (res.data.success) {
          // console.log(res.data.messageInfo.paymentLink.short_url);
          const order_id = res.data.messageInfo.paymentLink.notes.order_id;
          let timeoutId;
          let intervalId;
          let countdownIntervalId;
          let remainingTime = 180;
          const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            return `${minutes} : ${seconds < 10 ? "0" : ""}${seconds}`;
          };
          const toastId = toast.info(
            `Please go to the payment link sent to your number ${
              state?.Mobile
            } and complete the payment. Time remaining : ${formatTime(
              remainingTime
            )} .`,
            {
              autoClose: false,
              closeOnClick: false,
            }
          );

          countdownIntervalId = setInterval(() => {
            remainingTime -= 1;
            toast.update(toastId, {
              render: `Please go to the payment link sent to your number ${
                state?.Mobile
              } and complete the payment. Time remaining : ${formatTime(
                remainingTime
              )} .`,
            });

            if (remainingTime <= 0) {
              clearInterval(countdownIntervalId);
            }
          }, 1000);

          intervalId = setInterval(async () => {
            const success = await checkPaymentStatus(
              order_id,
              res.data.messageInfo.paymentLink.id
            );
            if (success) {
              setIsRazorPayOpen(false);
              handleSubmitFinalBooking(order_id);
              clearInterval(intervalId);
              clearTimeout(timeoutId);
              clearInterval(countdownIntervalId);
              toast.dismiss();
            }
          }, 2000);

          timeoutId = setTimeout(() => {
            setIsRazorPayOpen(false);
            clearInterval(intervalId);
            clearInterval(countdownIntervalId);
            toast.dismiss();
            toast.error("Payment status check timeout.");
          }, 180000);
        } else {
          setIsRazorPayOpen(false);
          toast.error("Failed to create payment link");
        }
      })
      .catch((err) => {
        setIsRazorPayOpen(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occurred"
        );
      });
  };
  const IsOnlinePayment = () => {
    axiosInstance
      .get("RazorPay/Otherpayment")
      .then((res) => {
        // console.log(res);
        if (res?.data?.message?.payment_capture == 1) {
          setIsRazorPayOpen(true);
          getPaymentLink();
        } else {
          setIsSubmit({
            type: "Success",
            isLoading: true,
          });
          handleSubmitFinalBooking();
        }
      })
      .catch((err) =>
        toast.error(
          err?.data?.response?.message
            ? err?.data?.response?.message
            : "Error Occur"
        )
      );
  };

  const handleSubmitApi = () => {
    let isBankSelect = true;
    RcData?.map((data) => {
      if (!data.BankName && !["Cash", "Paytm"].includes(data?.PaymentMode)) {
        toast.error("Bank name is required.");
        isBankSelect = false;
        return;
      }
    });

    if (!isBankSelect) {
      return;
    }

    // debugger;
    const { DocumentFlag, message } = handleFileValidationUpload();
    // console.log(DocumentFlag,message)
    if (!filterUnPaidRcData()) {
      if (getTestNamesWithBlankSampleTypeID()) {
        toast.error(getTestNamesWithBlankSampleTypeID());
      } else {
        if (DocumentFlag) {
          if (getPaymentModeAmount?.length > 0) {
            IsOnlinePayment();
          } else {
            setIsSubmit({
              type: "Success",
              isLoading: true,
            });

            handleSubmitFinalBooking();
          }
        } else {
          toast.error(`${message} is Required Document`);
        }
      }
    } else {
      toast.error("Please Enter Paid Amount to continue");
    }
  };

  console.log("LTData?.NetAmount", LTData?.NetAmount);
  console.log("LTData?.paid", paid);
  console.log("LTData?.paid", RateType);
  const CompanyCode = useLocalStorage("userData", "get")?.CompanyCode;
  const IsCDAC = useLocalStorage("userData", "get")?.IsCDAC;
  // console.log(CompanyCode);
  const { errors, handleSubmit } = useFormik({
    initialValues: {
      ...state,
      ...LTData,
      CategoryCheck: Category?.length,
      CompanyCodeCheck: CompanyCode == "DMC" ? 1 : 0,
      ...formData,
      ...Pndt,
    },
    enableReinitialize: true,
    validationSchema: PatientRegisterSchema,
    onSubmit: (values) => {
      if (RateType?.[0]?.IsPatientFullPaid === 1 && LTData?.NetAmount != paid) {
        toast.error("Full paymant is required for this client.");
        return;
      }
      const data = DynamicFieldValidations();
      setVisibleFields(data);
      const flag = data.filter((ele) => ele?.isError === true);
      const match = Match();
      const paymentCheck = PaymentData();
      if (flag.length === 0) {
        if (PLO.length > 0) {
          if (valiateProofID()) {
            if (!paymentCheck) {
              if (!coupon?.field && (disAmt || discountPercentage || match)) {
                if (throughMemberData) {
                  handleSubmitApi();
                } else {
                  if (LTData?.DiscountOnTotal == 0) {
                    handleSubmitApi();
                  } else {
                    if (
                      (LTData?.DiscountApprovedBy != "" &&
                        LTData?.DiscountReason != "") ||
                      (LTData?.DiscountId != "" && LTData?.DiscountReason != "")
                    ) {
                      handleSubmitApi();
                    } else {
                      toast.error(
                        "Please Choose Discount Approval And Discount Reason"
                      );
                    }
                  }
                }
              } else {
                handleSubmitApi();
              }
            } else {
              toast.error("Please Fill All The Required Fields");
            }
          } else {
            toast.error("Please Enter Identity No");
          }
        } else {
          toast.error("Please Select Test");
        }
      }
    },
  });
  // console.log(errors);
  useEffect(() => {
    if (tableData.length === 0) {
      setPaid(0);
    }
  }, [tableData]);

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    if (value === "") {
      setTime({ ...time, [name]: 0 });
      return;
    }

    if (name === "Hour") {
      let hour = parseInt(value.replace(/\D/g, ""));
      if (isNaN(hour) || hour < 0 || hour > 23) return;
      const registrationDate = new Date(LTData?.RegistrationDate);
      registrationDate.setHours(value);
      registrationDate.setMinutes(time?.Minute);
      registrationDate.setSeconds(time?.Second);
      setLTData({ ...LTData, RegistrationDate: registrationDate });
      setTime({ ...time, [name]: hour });
    } else if (name === "Minute" || name === "Second") {
      let minuteOrSecond = parseInt(value.replace(/\D/g, ""));
      if (isNaN(minuteOrSecond) || minuteOrSecond < 0 || minuteOrSecond > 59)
        return;
      if (name == "Minute") {
        const registrationDate = new Date(LTData?.RegistrationDate);
        registrationDate.setHours(time?.Hour);
        registrationDate.setMinutes(value);
        registrationDate.setSeconds(time?.Second);
        setLTData({ ...LTData, RegistrationDate: registrationDate });
      }
      if (name == "Second") {
        const registrationDate = new Date(LTData?.RegistrationDate);
        registrationDate.setHours(time?.Hour);
        registrationDate.setMinutes(time?.Minute);
        registrationDate.setSeconds(value);
        setLTData({ ...LTData, RegistrationDate: registrationDate });
      }

      setTime({ ...time, [name]: minuteOrSecond });
    } else {
      setTime({ ...time, [name]: value });
    }
  };

  useEffect(() => {
    const data = PLO.map((ele) => {
      return {
        ...ele,
        DiscountReason: LTData?.DiscountReason,
        DiscountApprovedBy: LTData?.DiscountApprovedBy,
      };
    });
    setPLO(data);
  }, [LTData?.DiscountReason, LTData?.DiscountApprovedBy]);

  useEffect(() => {
    if (tableData?.length === 0) {
      setdisAmt("");
      setDiscountPercentage("");
    }
  }, [tableData]);

  useEffect(() => {
    setTableData([]);

    // setSuggestionData({
    //   show: false,
    //   viewTestModal: false,
    //   viewTestModalId: "",
    //   testSuggestions: {
    //     data: [],
    //     show: false,
    //     Total: [],
    //   },
    //   packageSuggestions: {
    //     data: [],
    //     show: false,
    //   },
    //   daySuggestions: {
    //     data: [],
    //     show: false,
    //   },
    // });
    setThroughMobileData(false);
    setRcData([
      {
        PayBy: "Patient",
        ReceiptNo: "",
        ledgerNoCr: "",
        RateTypeId: state?.RateID,
        PaymentMode: handleRateTypePaymode === "Credit" ? "Credit" : "Cash",
        PaymentModeID: handleRateTypePaymode === "Credit" ? 215 : 134,
        BankName: "",
        CardNo: "",
        CardDate: "",
        Amount: "",
        CentreID: LTData?.CentreID,
      },
    ]);
  }, [LTData?.CentreID, state?.RateID, state?.Gender]);

  const handleChangeRTCData = (e, index) => {
    const { name, value } = e.target;
    console.log("name, value::", name, "--", value);
    const data = [...RcData];
    data[index][name] = value;
    setRcData(data);
  };

  const handleUploadCount = (
    name,
    value,
    secondName,
    medicalName,
    medicalValue,
    MedicalSName
  ) => {
    setLTData({
      ...LTData,
      [name]: value,
      [secondName]: value === 0 ? 0 : 1,
      [medicalName]: medicalValue,
      [MedicalSName]: medicalValue === 0 ? 0 : 1,
    });
  };

  const handleMedicalCount = (name, value, secondName) => {
    setLTData({
      ...LTData,
      [name]: value,
      [secondName]: value === 0 ? 0 : 1,
    });
  };

  const getDocumentType = (data) => {
    setUploadDoumentType(data);
  };

  const handleBarcodeUpperClose = (index, sampletypeId) => {
    if (BarcodeLogic === 3) {
      const data = tableData.map((ele) => {
        return {
          ...ele,
          BarcodeNo: "",
          Status: 1,
          IsSampleCollected: "N",
        };
      });
      setTableData(data);
      setShow5({ modal: false, index: index });
    }
    if (BarcodeLogic === 4) {
      const data = tableData.map((ele) => {
        if (ele?.SampleTypeID === sampletypeId) {
          return {
            ...ele,
            BarcodeNo: "",
            Status: 1,
            IsSampleCollected: "N",
          };
        } else {
          return ele;
        }
      });
      setShow5({ modal: false, index: index });
      setTableData(data);
    }
  };
  // console.log(LTData);
  const handleFileValidationUpload = () => {
    let requiredDocument = [];
    let DocumentFlag = true;
    let message = "";
    // console.log(tableData)
    tableData.map((ele) => {
      if (ele.RequiredAttachment !== "") {
        requiredDocument.push(ele.RequiredAttachment);
      }
    });

    for (let i = 0; i < requiredDocument.length; i++) {
      if (!UploadDoumentType.includes(requiredDocument[i])) {
        DocumentFlag = false;
        message = requiredDocument[i];
        break;
      }
    }

    return {
      DocumentFlag,
      message,
    };
  };

  const valiateProofID = () => {
    let validate = true;
    if (LTData?.PatientIDProof && LTData?.PatientIDProofNo.length < 5) {
      validate = false;
    }
    return validate;
  };

  const findMRPAndRateEstimate = () => {
    let MRP = 0;
    let Rate = 0;
    for (let i = 0; i < tableData?.length; i++) {
      MRP = MRP + Number(tableData[i]["Rate"]);
      Rate = Rate + Number(tableData[i]["NetAmount"]);
    }
    return { MRP, Rate };
  };

  const filterUnPaidRcData = () => {
    let paymentFlag = false;
    if (throughMemberData) {
      return false;
    }
    if (handleRateTypePaymode !== "Credit") {
      for (let i = 0; i < RcData.length; i++) {
        if (RcData[i]["Amount"] === "") {
          paymentFlag = true;
          break;
        }
      }
    }
    return paymentFlag;
  };

  const CheckageTest = (gender, ToAge, FromAge) => {
    let genderCheck = false;
    let ageCheck = true;
    let message = "";
    genderCheck = [state?.Gender, "Both"].includes(gender) ? true : false;

    if (state?.TotalAgeInDays > ToAge) {
      ageCheck = false;
      message = "Your age is greater than this test maximum age";
    }

    if (state?.TotalAgeInDays < FromAge) {
      ageCheck = false;
      message = "Your age is Less than this test Minimum age";
    }

    return {
      genderCheck: genderCheck,
      ageCheck: ageCheck,
      message: message,
    };
  };

  const handleLockRegistation = useMemo(() => {
    const data = RateType.find((ele) => ele?.value == state?.RateID);
    return [0, null].includes(data?.LockRegistration) ? false : true;
  }, [state?.RateID, RateType]);

  const handleRateTypePaymode = useMemo(() => {
    const data = RateType.find((ele) => ele?.value == state?.RateID);
    return data?.PayMode;
  }, [state?.RateID, RateType]);

  const handleCloseCoupon = () => {
    setShowCoupon({
      ...showCoupon,
      ShowCouponDetail: false,
    });
  };
  const handleclosemembershipmodal = () => {
    setShow7(false);
  };

  const handleCloseBindTestCouponShowModal = () => {
    setShowCoupon({
      ...showCoupon,
      BindTestCouponShow: false,
    });
  };
  const handleSelectTestData = (ele) => {
    const data = {
      InvestigationID: ele?.TestId,
      CentreID: state?.RateID,
      Discount: Number(ele?.DiscountPercentage),
    };

    getTableData(data, "Coupon");
  };

  const handleCouponValidate = () => {
    const generatedError = CouponValidateSchema(state, formData, LTData);
    setCoupon({
      ...coupon,
      load: true,
    });

    if (generatedError == "") {
      const match = Match();
      if (disAmt || discountPercentage || match) {
        toast.error("First Remove Discount For Adding Coupon");
        setCoupon({
          ...coupon,
          load: false,
        });
      } else {
        axiosInstance
          .post("CouponMaster/BindTestForAppliedCoupon", {
            CoupanCode: coupon?.code.trim(),
            CentreId: LTData?.CentreID,
            CentreID: state?.RateID,
          })
          .then((res) => {
            setCoupon({
              ...coupon,
              load: false,
            });
            const coupondatas = res?.data?.message;

            setCouponData(res?.data?.message);

            if (coupondatas[0].Type == 2) {
              setTableData([]);
              setShowCoupon({
                ...showCoupon,
                BindTestCouponShow: true,
              });
            } else {
              if (tableData.length > 0) {
                {
                  if (LTData?.GrossAmount < coupondatas[0]?.MinBookingAmount) {
                    toast.error(
                      "Total Billing amount should be greater than minimum booking amount " +
                        couponData[0]?.MinBookingAmount +
                        " so coupon discount can not be applied"
                    );
                  } else if (
                    LTData?.GrossAmount < coupondatas[0]?.DiscountAmount
                  ) {
                    toast.error(
                      "Gross amount Must be greator than " +
                        coupondatas[0]?.DiscountAmount +
                        " to apply this coupon"
                    );
                  } else {
                    toast.success("Coupon Applied Successfully");
                    if (coupondatas[0]?.DiscountAmount == 0)
                      setDiscountPercentage(coupondatas[0]?.DiscountPercentage);

                    if (coupondatas[0]?.DiscountPercentage == 0) {
                      setdisAmt(coupondatas[0]?.DiscountAmount);

                      setLTData({
                        ...LTData,
                        DiscountOnTotal: coupondatas[0]?.DiscountAmount,
                      });

                      const findPercentageDiscount =
                        (coupondatas[0]?.DiscountAmount / LTData?.GrossAmount) *
                        100;

                      const data = PLO.map((ele) => {
                        return {
                          ...ele,
                          Amount:
                            ele.Rate -
                            ((ele.Rate * findPercentageDiscount) / 100).toFixed(
                              2
                            ),
                          DiscountAmt: (
                            (ele.Rate * findPercentageDiscount) /
                            100
                          ).toFixed(2),
                        };
                      });
                      setPLO(data);
                    }

                    setCoupon({
                      ...coupon,
                      field: true,
                    });
                  }
                }
              } else {
                toast.error("Please Select any test first then apply coupon");
              }
            }
          })
          .catch((err) => {
            setCoupon({
              ...coupon,
              load: false,
            });
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Error Occured"
            );
          });
      }
    } else {
      setCoupon({
        ...coupon,
        load: false,
      });
      setErr(generatedError);
    }
  };

  const handleCouponCancel = () => {
    setCoupon({
      code: "",
      field: false,
    });
    setTableData([]);
    setErr({});

    if (coupon?.field) toast.error("Coupon Removed Successfully");
  };
  const handleMembershipcancel = () => {
    setmembershipnum("");
    setTableData([]);
    // setSuggestionData({
    //   show: false,
    //   viewTestModal: false,
    //   viewTestModalId: "",
    //   testSuggestions: {
    //     data: [],
    //     show: false,
    //     Total: [],
    //   },
    //   packageSuggestions: {
    //     data: [],
    //     show: false,
    //   },
    //   daySuggestions: {
    //     data: [],
    //     show: false,
    //   },
    // });
    setErr({});
    setState(stateIniti);
    setThroughmemberdata(false);
    setThroughMobileData(false);
    getAccessCentres(
      setCentreData,
      LTData,
      setLTData,
      LTDataIniti,
      handleRateType,
      VisitTypeCategory,
      fetchFields
    );
  };

  const handleCouponDetailsModal = () => {
    axiosInstance
      .post("CouponMaster/GetCouponValidationData", {
        CoupanCode: coupon?.code.trim(),
      })
      .then((res) => {
        setCouponDetails(res?.data?.message);
        if (res?.data?.message.length > 0) {
          setShowCoupon({
            ...showCoupon,
            ShowCouponDetail: true,
          });
        } else {
          toast.error("No Coupon Details Found");
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message ? "Details Not Found" : "Error Occured"
        );
      });
  };

  let sumOfPLO = [];

  const handleDiscountLastIndex = (
    ele,
    index,
    findPercentageDiscount,
    value
  ) => {
    if (index + 1 != PLO.length) {
      const result = ((ele.Rate * findPercentageDiscount) / 100).toFixed(2);
      const roundedResult = parseFloat(result).toFixed(2);
      sumOfPLO.push(roundedResult);
      return roundedResult;
    } else {
      const finalData = sumOfPLO.reduce(
        (acc, current) => acc + parseFloat(current),
        0
      );

      const finalResult = parseFloat((value - finalData).toFixed(2));

      return finalResult;
    }
  };

  const testDataArray = [];
  tableData.forEach((obj) => {
    testDataArray.push(obj.InvestigationID);
  });
  const handleShowRemark = () => {
    setShowRemark(false);
  };

  const handleSaveremark = (payload) => {
    setLTData({ ...LTData, Remarks: payload });
    handleShowRemark();
  };
  const [t] = useTranslation();
  return (
    <>
      {show3 && (
        <MedicialModal
          show={show3}
          setShow3={setShow3}
          handleClose={handleClose3}
          MedicalId={PatientGuid}
          handleUploadCount={handleUploadCount}
        />
      )}
      {showOP && (
        <OldPatientSearchModal
          show={showOP}
          setShow={setShowOP}
          handleSelctData={handleSelctData}
        />
      )}
      {show2 && (
        <UploadFile
          options={Identity}
          show={show2}
          handleClose={handleClose2}
          documentId={PatientGuid}
          pageName="Patient Registration"
          handleUploadCount={handleUploadCount}
          getDocumentType={getDocumentType}
        />
      )}
      {mobleData.length > 0 && show4 && (
        <MobileDataModal
          show={show4}
          setShow={setShow4}
          mobleData={mobleData}
          handleClose4={handleClose4}
          handleSelctData={handleSelctData}
        />
      )}

      {show7 && (
        <MembershipModal
          show7={show7}
          data={Memberdata}
          handleclosemembership={handleclosemembershipmodal}
          handleSelectedData={handleSelectedData}
        />
      )}
      {patientImg.show && (
        <CameraModal
          visible={patientImg.show}
          guid={PatientGuid}
          pageName={"patientImage"}
          defaultImage={patientImg.img}
          handleClose={(guidNo, newUrl) => {
            // console.log(newUrl);
            setPatientImg({
              show: false,
              img: newUrl ? newUrl : MyImage,
            });
          }}
        />
      )}
      {show?.show && (
        <PatientRegisterModal
          show={show?.show}
          handleClose={handleClose}
          Type={show?.Type}
        />
      )}
      {showRemark && (
        <SampleRemark
          show={showRemark}
          handleShow={handleShowRemark}
          state={LTData}
          PageName={LTData?.Remarks}
          handleSave={handleSaveremark}
          title={"Billing Remarks"}
        />
      )}
      {show6 && (
        <SaveSmsEmail
          show6={show6}
          state={state}
          autoEmail={autoEmail}
          handleSaveSmsEmailSave={handleSaveSmsEmailSave}
          LTData={LTData}
          saveSmsEmail={saveSmsEmail}
          setSaveSmsEmail={setSaveSmsEmail}
          setShow6={setShow6}
        />
      )}
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
      <Heading isBreadcrumb={true} name={t("PatientRegistration")} />
      <Accordion title={t("Registration Details")} defaultValue={true}>
        <div className="row pt-2 pl-2 pr-2">
          <div className="col-md-11 ">
            <div className="row">
              <div className="col-sm-2 col-6">
                <ReactSelect
                  dynamicOptions={CentreData}
                  name="CentreID"
                  lable={t("Centre")}
                  id="Centre"
                  removeIsClearable={true}
                  placeholderName={t("Centre")}
                  value={LTData?.CentreID}
                  onChange={handleSearchSelectChange}
                />
              </div>

              <div className="col-sm-2 col-6">
                <ReactSelect
                  dynamicOptions={RateType}
                  name="RateID"
                  lable={t("RateType")}
                  id="RateType"
                  removeIsClearable={true}
                  placeholderName={t("RateType")}
                  value={state?.RateID}
                  onChange={handleSearchSelectChange}
                />
              </div>

              <div className="col-sm-2 col-6">
                <ReactSelect
                  name="VisitType"
                  id="VisitType"
                  removeIsClearable={true}
                  dynamicOptions={VisitType}
                  placeholderName={t("VisitType")}
                  lable={t("VisitType")}
                  value={LTData?.VisitType}
                  onChange={handleSearchSelectChange}
                />
              </div>

              {Category?.length > 0 ? (
                <div className="col-sm-2 col-6">
                  <ReactSelect
                    name="Category"
                    className="required-fields"
                    id="Category"
                    dynamicOptions={Category}
                    lable={t("Department Category")}
                    placeholderName={t("Department Category")}
                    value={LTData?.Category}
                    onChange={handleSearchSelectChange}
                  />
                  {LTData?.Category === "" && (
                    <div className="error-message">{t(errors?.Category)}</div>
                  )}
                </div>
              ) : (
                <div className="col-sm-2 col-6 d-flex">
                  <div style={{ width: "87%" }}>
                    <Input
                      type="text"
                      value={state?.PreBookingNo}
                      // disabled={throughMobileData || throughMemberData}
                      lable={t("Pre Booking No")}
                      name="PreBookingNo"
                      onChange={handleMainChange}
                      placeholder=" "
                      id="PreBookingNo"
                      onKeyDown={(e) => handleHMIS_PatCrNo(e, "PreBookingNo")}
                    />
                  </div>
                  <div style={{ width: "10%" }}>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={getPreBookingNo}
                    >
                      <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
                    </button>
                  </div>
                </div>
              )}

              <div className="col-sm-2 col-6">
                <Input
                  type="text"
                  lable={t("UHID")}
                  max={15}
                  // disabled={state?.Mobile && CompanyCode !== "DMC"}
                  value={state?.PatientCode}
                  name="PatientCode"
                  className={CompanyCode === "DMC" ? "required-fields" : ""}
                  onInput={(e) => number(e, 15)}
                  onKeyDown={(e) => handlePatientData(e, "PatientCode")}
                  placeholder=" "
                  id="PatientCode"
                  onChange={handleMainChange}
                />
                {state?.PatientCode === "" && (
                  <div className="error-message">{t(errors?.PatientCode)}</div>
                )}
              </div>
              <div className="col-sm-2 col-6">
                <div className="p-inputgroup d-flex">
                  <div style={{ width: "87%" }}>
                    <Input
                      type="text"
                      lable={t("Membership Number")}
                      name="MembershipNo"
                      placeholder=" "
                      onKeyDown={(e) => getMemberhipdata(e)}
                      id="MembershipNo"
                      value={membershipnum}
                      // disabled={throughMemberData}
                      onChange={(e) => {
                        setmembershipnum(e?.target?.value);
                      }}
                    />
                  </div>
                  <div style={{ width: "10%" }}>
                    {throughMemberData ? (
                      <Tooltip label={t("Remove Membership")}>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={handleMembershipcancel}
                        >
                          <i className="fa fa-times fa-sm new_record_pluse"></i>
                        </button>
                      </Tooltip>
                    ) : (
                      <Tooltip label={t("Create New Membership Card")}>
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            Navigate("/MembershipCardMaster");
                          }}
                        >
                          <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
                        </button>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-1">
              <div className="col-sm-2 col-6">
                <div className="d-flex">
                  <div style={{ width: "86%" }}>
                    <Input
                      name="Mobile"
                      inputRef={inputRef}
                      className={`${LTData?.BTB != 1 ? "required-fields" : ""}`}
                      id="Mobile"
                      onInput={(e) => number(e, 10)}
                      onKeyDown={(e) => handlePatientData(e, "Mobile")}
                      value={state.Mobile}
                      onChange={handleMainChange}
                      type="number"
                      disabled={isMobileSelected}
                      lable={t("Mobile Number")}
                      placeholder={t(" ")}
                      required
                    />
                    {!err?.Mobile && !err?.Mobiles && errors?.Mobile && (
                      <div className="error-message">{t(errors?.Mobile)}</div>
                    )}
                    {state.Mobile === "" && (
                      <div className="error-message">{t(err?.Mobile)}</div>
                    )}
                    {state.Mobile !== "" && state?.Mobile.length < 10 && (
                      <div className="error-message">{t(err?.Mobiles)}</div>
                    )}
                  </div>
                  <div style={{ width: "10%" }}>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={handleShowMobile}
                    >
                      <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-sm-2 col-6">
                <div className="d-flex">
                  <div style={{ width: "30%" }}>
                    <SelectBox
                      options={Title}
                      name="Title"
                      id="Title"
                      lable={t("Title")}
                      // isDisabled={throughMobileData || throughMemberData}
                      selectedValue={state?.Title}
                      onChange={handleMainChange}
                    />
                  </div>
                  <div style={{ width: "70%" }}>
                    <Input
                      max={35}
                      name="FirstName"
                      className="required-fields"
                      type="text"
                      id="FirstName"
                      lable={t("First Name")}
                      placeholder={t(" ")}
                      // disabled={throughMobileData || throughMemberData}
                      value={state?.FirstName}
                      onChange={handleMainChange}
                      required
                    />
                    {!err?.FirstName &&
                      !err?.FirstNames &&
                      errors?.FirstName && (
                        <div className="error-message">
                          {t(errors?.FirstName)}
                        </div>
                      )}
                    {state.FirstName === "" && (
                      <div className="error-message">{t(err?.FirstName)}</div>
                    )}
                    {state?.FirstName !== "" &&
                      state?.FirstName.trim().length < 3 && (
                        <div className="error-message">
                          {t(err?.FirstNames)}
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className="col-sm-2 col-6">
                <Input
                  type="text"
                  lable={t("Middle Name")}
                  name="MiddleName"
                  placeholder={t(" ")}
                  id="MiddleName"
                  value={state?.MiddleName}
                  onKeyDown={(e) =>
                    someMethodWithoutAccessToEvent(e, "LastName")
                  }
                  // disabled={throughMobileData || throughMemberData}
                  max={35}
                  onChange={handleMainChange}
                />
              </div>

              <div className="col-sm-2 col-6">
                <Input
                  type="text"
                  lable={t("Last Name")}
                  name="LastName"
                  placeholder={t(" ")}
                  id="LastName"
                  value={state?.LastName}
                  // disabled={throughMobileData || throughMemberData}
                  onChange={handleMainChange}
                />
              </div>

              <div className="col-sm-2 col-6">
                <SelectBox
                  options={Gender}
                  name="Gender"
                  id="Gender"
                  lable={t("Gender")}
                  // isDisabled={
                  //   [
                  //     "Baby",
                  //     "Baby of",
                  //     "Baby Of",
                  //     "BabyOf",
                  //     "Babyof",
                  //     "Master",
                  //     "B/O",
                  //     "C/O",
                  //     "S/O",
                  //     "Dr.",
                  //     "Baby of.",
                  //     "prof",
                  //   ].includes(state?.Title)
                  //     ? false
                  //     : state?.Title || state?.Title === ""
                  //       ? true
                  //       : false
                  // }
                  isDisabled={(() => {
                    const title = (state?.Title || "").toLowerCase();

                    const genderEditableTitles = [
                      "baby",
                      "baby of",
                      "babyof",
                      "b/o",
                      "babof",
                      "baba",
                      "baba of",
                      "baby1",
                      "brig.",
                      "prof",
                      "prof.",
                      "dr.",
                      "c/o",
                      "s/o",
                      "master",
                    ];

                    return title
                      ? !genderEditableTitles.includes(title)
                      : false;
                  })()}
                  selectedValue={state?.Gender}
                  onChange={handleMainChange}
                />
              </div>

              <div className="col-sm-2 col-6">
                <div className="p-inputgroup d-flex">
                  <div style={{ width: "87%" }}>
                    <Input
                      className="required-fields"
                      id="DoctorName"
                      name="DoctorName"
                      lable={t("Referred Doctor")}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          DoctorName: e.target.value,
                        });
                        setDropFalse(true);
                      }}
                      value={formData?.DoctorName}
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
                      placeholder={t(" ")}
                      type="text"
                      required
                    />
                    {dropFalse && doctorSuggestion.length > 0 && (
                      <ul className="suggestion-data">
                        {doctorSuggestion.map((data, index) => (
                          <li
                            onClick={() => handleListSearch(data, "DoctorName")}
                            className={`${index === indexMatch && "matchIndex"}`}
                            key={index}
                          >
                            {t(data?.Name)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {/* <div style={{ width: "10%" }}>
                    <Tooltip label={t("Add Referred Doctor")}>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => handleShow("Refer")}
                      >
                        <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
                      </button>
                    </Tooltip>
                  </div> */}
                </div>

                {!err?.DoctorName &&
                  !err?.DoctorID &&
                  (errors?.DoctorID || errors?.DoctorName) && (
                    <div className="error-message">
                      {t(errors?.DoctorID || errors?.DoctorName)}
                    </div>
                  )}
                {formData.DoctorName === "" && (
                  <div className="error-message">{t(err?.DoctorName)}</div>
                )}
                {formData.DoctorName !== "" && formData?.DoctorID === "" && (
                  <div className="error-message">{t(err?.DoctorID)}</div>
                )}
              </div>
            </div>

            <div className="row mt-1">
              <div className="col-sm-2 col-6">
                <DatePicker
                  showOnFocus={false}
                  value={state?.DOB}
                  className="custom-calendar"
                  name="DOB"
                  // disabled={throughMobileData || throughMemberData}
                  placeholder={t("DOB")}
                  id="DOB"
                  lable={t("DOB")}
                  maxDate={new Date()}
                  onChange={dateSelect}
                  required
                />
                {!err?.DOB && errors?.DOB && (
                  <div className="error-message">{t(errors?.DOB)}</div>
                )}
                {state.DOB == "" && (
                  <div className="error-message">{t(err?.DOB)}</div>
                )}
              </div>

              <div className="col-sm-2 col-6">
                <div className="p-inputgroup flex-1">
                  <Input
                    type="text"
                    className="required-fields"
                    placeholder={t("Years")}
                    name="AgeYear"
                    value={state?.AgeYear}
                    onInput={(e) => number(e, 3, 120)}
                    // disabled={throughMemberData || throughMobileData}
                    onChange={handleDOBCalculation}
                  />
                  <Input
                    type="text"
                    placeholder={t("Months")}
                    name="AgeMonth"
                    className="required-fields"
                    value={state?.AgeMonth}
                    onInput={(e) => number(e, 2, 12)}
                    // disabled={throughMemberData || throughMobileData}
                    onChange={handleDOBCalculation}
                  />
                  <Input
                    placeholder={t("Days")}
                    type="text"
                    className="required-fields"
                    name="AgeDays"
                    value={state?.AgeDays}
                    onInput={(e) => number(e, 2, 31)}
                    // disabled={throughMemberData || throughMobileData}
                    onChange={handleDOBCalculation}
                  />
                </div>
              </div>

              <div className="col-sm-2 col-6">
                <ReactSelect
                  name="CollectionBoyId"
                  dynamicOptions={[
                    { label: t("Select Collection Boy"), value: "" },
                    ...CollectionBoy,
                  ]}
                  placeholderName={t("Collection Boy")}
                  isDisabled={true}
                  value={LTData?.CollectionBoyId}
                  onChange={handleSearchSelectChange}
                />
              </div>

              <div className="col-sm-2 col-6">
                <div className="d-flex">
                  <div style={{ width: "40%" }}>
                    <SelectBox
                      name="PatientIDProof"
                      options={[
                        { label: t("Choose ID"), value: "" },
                        ...Identity,
                      ]}
                      selectedValue={LTData?.PatientIDProof}
                      id="IdType"
                      lable={t("Id Type")}
                      onChange={handleSelectChange}
                    />
                  </div>
                  <div style={{ width: "60%" }}>
                    <Input
                      name="PatientIDProofNo"
                      type="text"
                      max={20}
                      onChange={handleLTData}
                      disabled={LTData?.PatientIDProof === "" ? true : false}
                      value={LTData?.PatientIDProofNo}
                      id="PatientIDProofNo"
                      lable={t("Patient ID Proof Number")}
                      placeholder={t("")}
                    />
                  </div>
                </div>
              </div>

              <div className="col-sm-2 col-6">
                <div className="p-inputgroup d-flex">
                  <div style={{ width: "87%" }}>
                    <Input
                      id="SecondReferDoctor"
                      name="SecondReferDoctor"
                      lable={t("Second Ref. Doctor")}
                      placeholder={t("")}
                      type="text"
                      value={formData?.SecondReferDoctor}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          SecondReferDoctor: e.target.value,
                        });
                        setSecondDropFalse(true);
                      }}
                      onBlur={(e) => {
                        autocompleteOnBlur(setseconddoctorSuggestion);
                        setTimeout(() => {
                          const data = seconddoctorSuggestion.filter(
                            (ele) => ele?.Name === e.target.value
                          );
                          if (data.length === 0) {
                            setFormData({ ...formData, SecondReferDoctor: "" });
                          }
                        }, 500);
                      }}
                      onKeyDown={handleIndex}
                    />
                    {secondDropFalse && seconddoctorSuggestion.length > 0 && (
                      <ul className="suggestion-data">
                        {seconddoctorSuggestion.map((data, index) => (
                          <li
                            onClick={() =>
                              handleListSearch(data, "SecondReferDoctor")
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
                  <div style={{ width: "10%" }}>
                    <Tooltip label={t("Add SecondReferDoctor")}>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => handleShow("Secondary")}
                      >
                        <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>

              <div className="col-sm-2 col-6">
                <Input
                  type="text"
                  lable={t("Email")}
                  name="Email"
                  placeholder={t("")}
                  id="Email"
                  value={state?.Email}
                  onChange={handleMainChange}
                />
                {errors?.Email && (
                  <div className="error-message">{t(errors?.Email)}</div>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-sm-2 col-6">
                <Input
                  lable={t("Address")}
                  type="text"
                  name="HouseNo"
                  max={100}
                  placeholder={t("")}
                  id="Address"
                  value={state?.HouseNo}
                  className="required-fields"
                  onChange={handleMainChange}
                />
                {!err?.HouseNo && errors?.HouseNo && (
                  <div className="error-message">{t(errors?.HouseNo)}</div>
                )}
                {state.HouseNo === "" && (
                  <div className="error-message">{t(err?.HouseNo)}</div>
                )}
              </div>
              <div className="col-sm-2 col-6">
                <Input
                  lable={t("Pincode")}
                  type="number"
                  name="PinCode"
                  placeholder={t("")}
                  onInput={(e) => number(e, 6)}
                  id="PinCode"
                  value={state?.PinCode}
                  onChange={handleMainChange}
                />
              </div>
              <div className="col-sm-2 col-6">
                <Input
                  lable={t("Locality")}
                  max={30}
                  type="text"
                  value={state?.Locality}
                  onChange={handleMainChange}
                  name="Locality"
                  placeholder={t("")}
                  id="Locality"
                />
              </div>

              <div className="col-sm-2">
                <ReactSelect
                  dynamicOptions={countries}
                  name="Country"
                  lable={t("Country")}
                  id="Country"
                  removeIsClearable={true}
                  placeholderName={t("Country")}
                  value={state?.Country}
                  className="required-fields"
                  onChange={handleSearchSelectChange}
                />
                {!err?.Country && errors?.Country && (
                  <div className="error-message">{t(errors?.Country)}</div>
                )}
                {state?.Country === "" && (
                  <div className="error-message">{t(err?.Country)}</div>
                )}
              </div>
              <div className="col-sm-2">
                <ReactSelect
                  dynamicOptions={[
                    { label: "Select State", value: "" },
                    ...states,
                  ]}
                  name="State"
                  lable={t("State")}
                  id="State"
                  removeIsClearable={true}
                  placeholderName={t("State")}
                  value={state?.State}
                  className="required-fields"
                  onChange={handleSearchSelectChange}
                />
                {!err?.State && errors?.State && (
                  <div className="error-message">{t(errors?.State)}</div>
                )}
                {state?.State === "" && (
                  <div className="error-message">{t(err?.State)}</div>
                )}
              </div>
              <div className="col-sm-2">
                <ReactSelect
                  dynamicOptions={[
                    { label: "Select City", value: "" },
                    ...cities,
                  ]}
                  name="City"
                  lable={t("City")}
                  id="City"
                  removeIsClearable={true}
                  placeholderName={t("City")}
                  className="required-fields"
                  isDisabled={!state?.State}
                  value={state?.City}
                  onChange={handleSearchSelectChange}
                />
                {!err?.City && errors?.City && (
                  <div className="error-message">{t(errors?.City)}</div>
                )}
                {state?.City === "" && (
                  <div className="error-message">{t(err?.City)}</div>
                )}
              </div>
            </div>

            {/* Display none as Sachin Sir Demand */}
            <div className="row mb-1 pt-1">
              <div className="col-sm-2 col-6 d-none">
                <SelectBox
                  options={[{ label: "Select", value: "" }, ...proEmplyee]}
                  name="ProEmployee"
                  lable={t("Pro Employee")}
                  selectedValue={state?.ProEmployee}
                  onChange={handleMainChange}
                  // isDisabled={state?.ProEmployee != "" ? true : false}
                />
              </div>
              {useLocalStorage("userData", "get").ModifyRegDate == 1 && (
                <>
                  <div className="col-sm-2 col-6">
                    <DatePicker
                      className="custom-calendar"
                      name="RegistrationDate"
                      value={LTData?.RegistrationDate}
                      placeholder={t("")}
                      id="RegistrationDate"
                      lable={t("Registration Date")}
                      onChange={dateregselecect}
                    />
                  </div>
                  <div className="col-sm-2 col-6">
                    <div className="d-flex">
                      <Input
                        type="text"
                        placeholder=" "
                        lable={t("H")}
                        id="H"
                        value={time?.Hour}
                        name="Hour"
                        onChange={handleTimeChange}
                      />
                      <Input
                        type="text"
                        value={time?.Minute}
                        name="Minute"
                        onChange={handleTimeChange}
                        lable={t("M")}
                        id="M"
                        placeholder=" "
                      />
                      <Input
                        type="text"
                        value={time?.Second}
                        name="Second"
                        onChange={handleTimeChange}
                        lable={t("S")}
                        id="S"
                        placeholder=" "
                      />
                    </div>
                  </div>
                </>
              )}

              {visibleFields?.map((data, index) =>
                data?.IsVisible == 1 ? (
                  <div
                    className="col-sm-2 col-6"
                    style={{ marginBottom: "5px" }}
                    key={index}
                  >
                    {[
                      "PatientSource",
                      "PatientType",
                      "HLMPatientType",
                      "Source",
                    ].includes(data?.FieldType) ? (
                      <SelectBox
                        options={
                          data?.FieldType === "PatientSource"
                            ? [
                                { label: t("Select"), value: "" },
                                ...PatientSource,
                              ]
                            : data?.FieldType === "PatientType"
                              ? [
                                  { label: t("Select"), value: "" },
                                  ...PatientType,
                                ]
                              : data?.FieldType === "HLMPatientType"
                                ? HLMPatientType
                                : data?.FieldType === "Source"
                                  ? SourceType
                                  : []
                        }
                        id="FieldType"
                        placeholder={t(data?.FieldType)}
                        lable={t(data?.FieldType)}
                        selectedValue={LTData[data?.FieldType]}
                        name={data?.FieldType}
                        onChange={handleSelectNew}
                      />
                    ) : (
                      <Input
                        max={30}
                        name={data?.FieldType}
                        id={removeSpecialCharacters(data?.FieldType)}
                        placeholder={t("")}
                        lable={t(
                          data?.FieldType == "BedNo"
                            ? "WardNo/BedNo"
                            : data?.FieldType
                        )}
                        value={LTData[data?.FieldType]}
                        onChange={handleLTData}
                        type="text"
                      />
                    )}
                    {data?.isError && (
                      <div className="error-message">{t(data?.message)}</div>
                    )}
                  </div>
                ) : null
              )}
              {checkCovid() ? (
                <>
                  <div className="col-md-2 col-6">
                    <Input
                      id="SrfId"
                      placeholder=" "
                      name="SrfId"
                      lable={t("Srf Id")}
                      type="text"
                      value={LTData?.SrfId}
                      onChange={handleSelectChange}
                    />
                  </div>

                  <div className="col-md-2 col-6">
                    <Input
                      id="IcmrId"
                      placeholder=" "
                      name="IcmrId"
                      lable={t("Icmr Id")}
                      type="text"
                      value={LTData?.IcmrId}
                      onChange={handleSelectChange}
                    />
                  </div>
                </>
              ) : (
                ""
              )}

              {IsCDAC ? (
                <>
                  <div className="col-md-2 ">
                    <Input
                      max={30}
                      value={state?.HMIS_PatCrNo}
                      type="text"
                      onChange={handleMainChange}
                      lable={t("HMIS_PatCrNo")}
                      name="HMIS_PatCrNo"
                      placeholder={t("")}
                      id="HMIS_PatCrNo"
                      onKeyDown={(e) => handleHMIS_PatCrNo(e, "HMIS_PatCrNo")}
                    />{" "}
                  </div>
                </>
              ) : (
                ""
              )}

              {state?.Gender == "Female" && (
                <div className="col-sm-1 col-6">
                  <button
                    className="text-white btn-block rounded p-1"
                    type="button"
                    id="documents"
                    onClick={handlePNDT}
                    disabled={state?.Gender == "Female" ? false : true}
                  >
                    <i aria-hidden="true">{t("PNDT")}</i>
                  </button>
                </div>
              )}

              {/* Display none as Sachin Sir Demand */}
              <div
                className={`d-none ${state?.Gender === "Female" ? "col-sm-1 col-6" : "col-sm-1"}`}
              >
                <button
                  className="text-white btn-block rounded p-1"
                  type="button"
                  onClick={() => {
                    setSaveSmsEmail({
                      ...saveSmsEmail,
                      IsActiveEmailToClient:
                        saveSmsEmail?.IsActiveEmailToClient !== ""
                          ? saveSmsEmail?.IsActiveEmailToClient
                          : saveSmsEmail?.EmailToClient != ""
                            ? 1
                            : state?.RateTypeEmail != ""
                              ? 1
                              : 0,
                      IsActiveSmsToDoctor:
                        saveSmsEmail?.IsActiveSmsToDoctor !== ""
                          ? saveSmsEmail?.IsActiveSmsToDoctor
                          : saveSmsEmail?.SmsToDoctor != ""
                            ? 1
                            : LTData?.DoctorMobile != ""
                              ? 1
                              : 0,
                      IsActiveEmailToDoctor:
                        saveSmsEmail?.IsActiveEmailToDoctor !== ""
                          ? saveSmsEmail?.IsActiveEmailToDoctor
                          : saveSmsEmail?.EmailToDoctor != ""
                            ? 1
                            : LTData?.DoctorEmail != ""
                              ? 1
                              : 0,
                      IsActiveEmailToPatient:
                        saveSmsEmail?.IsActiveEmailToPatient !== ""
                          ? saveSmsEmail?.IsActiveEmailToPatient
                          : saveSmsEmail?.EmailToPatient != ""
                            ? 1
                            : state?.Email != ""
                              ? 1
                              : 0,
                      IsActiveSmsToPatient:
                        saveSmsEmail?.IsActiveSmsToPatient !== ""
                          ? saveSmsEmail?.IsActiveSmsToPatient
                          : saveSmsEmail?.SmsToPatient != ""
                            ? 1
                            : state?.Mobile != ""
                              ? 1
                              : 0,
                      IsActiveSmsToClient:
                        saveSmsEmail?.IsActiveSmsToClient !== ""
                          ? saveSmsEmail?.IsActiveSmsToClient
                          : saveSmsEmail?.SmsToClient != ""
                            ? 1
                            : state?.RateTypePhone != ""
                              ? 1
                              : 0,
                      IsWhatsappRequired: saveSmsEmail?.IsWhatsappRequired
                        ? saveSmsEmail?.IsWhatsappRequired
                        : 0,
                    });

                    setShow6(true);
                  }}
                >
                  <i aria-hidden="true">{t("PRDM")}</i>
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-1 col-8">
            <div
              style={{
                border: "1px solid grey",
                borderRadius: "5px",
                textAlign: "center",
                width: "67%",
                height: "48%",

                marginLeft: "10px",
              }}
              className="p-1"
            >
              <img
                height={78}
                src={patientImg.img}
                style={{ width: "100%" }}
                // alt="Not found"
                onDoubleClick={() => {
                  setPatientImg({ ...patientImg, show: true });
                }}
              />
            </div>
            <div>
              <div className="p-1">
                <button
                  className="text-white rounded p-1"
                  type="button"
                  style={{
                    width: "74%",
                    fontSize: "11px",
                    marginLeft: "5px",
                    bottom: "5px",
                  }}
                  onClick={() => {
                    setShow2(true);
                  }}
                >
                  <i class="fa fa-file" aria-hidden="true"></i>
                </button>
              </div>
              <div className="p-1">
                <button
                  className="text-white rounded p-1"
                  type="button"
                  style={{
                    width: "74%",
                    fontSize: "11px",
                    marginLeft: "5px",
                    bottom: "5px",
                  }}
                  onClick={() => {
                    handleClose3();
                  }}
                >
                  <i class="fa fa-h-square" aria-hidden="true"></i>
                </button>
              </div>
              <div className="p-1">
                <button
                  className="text-white rounded p-1"
                  type="button"
                  style={{
                    width: "74%",
                    fontSize: "11px",
                    marginLeft: "5px",
                    bottom: "5px",
                  }}
                  onClick={() => {
                    setShowOP(true);
                  }}
                >
                  {t("Old Patient")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Accordion>
      {Pndt?.PNDT && (
        <Accordion
          title={t("Pre-Natal Diagnostic Techniques")}
          defaultValue={true}
        >
          <div className="row mt-2 pt-2 pl-2 pr-2">
            <div className="col-sm-3 col-md-2 col-6">
              <Input
                id="NoOfChildren"
                name="NoOfChildren"
                lable={t("Number Of Children")}
                placeholder=" "
                type="number"
                onInput={(e) => number(e, 3)}
                value={Pndt?.NoOfChildren}
                onChange={handlePNDTChange}
              />
              {Pndt.NoOfChildren === "" && (
                <div className="error-message">{errors?.NoOfChildren}</div>
              )}
            </div>
            <div className="col-md-2 col-sm-3 col-6">
              <Input
                name="NoOfSon"
                id="NoOfSon"
                lable={t("Number Of Son")}
                placeholder=" "
                type="number"
                value={Pndt?.NoOfSon}
                onInput={(e) => number(e, 3)}
                onChange={handlePNDTChange}
              />
              {Pndt.NoOfSon === "" && (
                <div className="error-message">{errors?.NoOfSon}</div>
              )}
            </div>
            <div className="col-md-2 col-sm-3 col-6">
              <Input
                id="NoOfDaughter"
                lable={t("Number Of Daughter")}
                placeholder=" "
                name="NoOfDaughter"
                type="number"
                value={Pndt?.NoOfDaughter}
                onInput={(e) => number(e, 3)}
                onChange={handlePNDTChange}
              />
              {Pndt.NoOfDaughter === "" && (
                <div className="error-message">{errors?.NoOfDaughter}</div>
              )}
            </div>
            <div className="col-md-2 col-sm-3 col-6">
              <DatePicker
                name="Pregnancy"
                className="custom-calendar"
                id="Pregnancy"
                lable={t("Pregnancy")}
                placeholder=" "
                value={Pndt?.Pregnancy}
                maxDate={new Date()}
                onChange={handleDatePNDT}
              />
              {Pndt.Pregnancy === "" && (
                <div className="error-message">{errors?.Pregnancy}</div>
              )}
            </div>
            <div className="col-md-1 col-sm-3 col-6">
              <Input
                name="AgeOfSon"
                lable={t("Son's Age")}
                id="AgeOfSon"
                placeholder=" "
                type="number"
                value={Pndt?.AgeOfSon}
                onInput={(e) => number(e, 3)}
                onChange={handlePNDTChange}
              />
              {Pndt.AgeOfSon === "" && (
                <div className="error-message">{errors?.AgeOfSon}</div>
              )}
            </div>
            <div className="col-md-1 col-sm-3 col-6">
              <Input
                className="form-control input-sm"
                name="AgeOfDaughter"
                type="number"
                id="AgeOfDaughter"
                lable={t("Daughter's Age")}
                placeholder=" "
                value={Pndt?.AgeOfDaughter}
                onInput={(e) => number(e, 3)}
                onChange={handlePNDTChange}
              />
              {Pndt.AgeOfDaughter === "" && (
                <div className="error-message">{errors?.AgeOfDaughter}</div>
              )}
            </div>
            <div className="col-md-1 col-sm-3 col-6">
              <SelectBox
                className="form-control input-sm"
                name="PNDTDoctor"
                id="PNDTDoctor"
                lable={t("PNDT Doctor")}
                placeholder="PNDT Doctor"
                options={DoctorData}
                selectedValue={Pndt?.PNDTDoctor}
                onChange={handlePNDTChange}
              />
              {Pndt.PNDTDoctor === "" && (
                <div className="error-message">{errors?.PNDTDoctor}</div>
              )}
            </div>
            <div className="col-md-1 col-sm-3 col-6">
              <Input
                className="form-control input-sm"
                name="Husband"
                lable={t("Husband")}
                placeholder=" "
                id="Husband"
                value={Pndt?.Husband}
                onChange={handlePNDTChange}
              />
              {Pndt.Husband === "" && (
                <div className="error-message">{errors?.Husband}</div>
              )}
            </div>
          </div>
        </Accordion>
      )}
      <Accordion title={t("Booking Details")} defaultValue={true}>
        <div className="row d-flex" style={{ paddingBottom: "37px" }}>
          <div style={{ width: "50%" }} className="col-md-6 col-sm-12 col-12">
            <div className="row pt-2 pl-2 pr-2">
              <div className="col-lg-5 col-md-12 col-12 col-sm-5">
                <Input
                  name="TestName"
                  className="required-fields"
                  lable={
                    searchTest == "TestName"
                      ? t("Type TestName For Add Test")
                      : t("Type TestCode For Add Test")
                  }
                  type="text"
                  placeholder=" "
                  max={30}
                  id="testSearch"
                  onChange={handleChange}
                  onBlur={() => {
                    autocompleteOnBlur(setSuggestion);
                  }}
                  onKeyDown={handleIndex}
                />
                {suggestion.length > 0 && (
                  <ul className="suggestion-data" style={{ zIndex: 99 }}>
                    {suggestion.map((data, index) => (
                      <li
                        onClick={() => handleListSearch(data, "TestName")}
                        key={index}
                        className={`${index === indexMatch && "matchIndex"}`}
                      >
                        {data.TestName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {/* <div className="ml-2">
                <span>
                  {" "}
                  <i
                    className="fa fa-microphone"
                  />
                </span>
              </div> */}
              <div className="col-lg-4 col-md-8 col-8 col-sm-4">
                <div className="d-flex align-items-center">
                  <div className="mx-2">
                    <input
                      type="radio"
                      id="TestName"
                      name="TestName"
                      value="TestName"
                      checked={searchTest == "TestName"}
                      onChange={(e) => {
                        setSearchTest(e.target.value);
                      }}
                    />
                    <label htmlFor="TestName" className="ml-2">
                      {t("By TestName")}
                    </label>
                  </div>
                  <div className="mx-2">
                    <input
                      type="radio"
                      id="TestCode"
                      name="TestCode"
                      value="TestCode"
                      checked={searchTest == "TestCode"}
                      onChange={(e) => {
                        setSearchTest(e.target.value);
                      }}
                    />
                    <label htmlFor="TestCode" className="ml-2">
                      {t("By TestCode")}
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-4 col-4 col-sm-3">
                <div className="d-flex align-items-center">
                  <div className="mx-2">
                    <input
                      type="checkbox"
                      name="isVIP"
                      id="isVIP"
                      checked={state?.isVIP}
                      onChange={handleMainChange}
                      value={state?.isVIP === 1 ? true : false}
                    />
                    <label htmlFor="isVIP" className="ml-2">
                      {t("VIP")}
                    </label>
                  </div>
                  {state?.isVIP === 1 && (
                    <div className="mx-2">
                      <input
                        type="checkbox"
                        name="IsMask"
                        id="IsMask"
                        checked={state?.IsMask}
                        onChange={handleMainChange}
                        value={state?.IsMask === 1 ? true : false}
                      />
                      <label htmlFor="IsMask" className="ml-1">
                        {t("MASK")}
                      </label>{" "}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="row px-2 ">
              <div className="col-12">
                <Tables>
                  <thead>
                    <tr>
                      <th className="text-center">{"#"}</th>
                      <th>{t("Slot")}</th>
                      <th>{t("Code")}</th>
                      <th
                        style={{
                          wordWrap: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        {t("Item")}
                      </th>
                      <th>{t("View")}</th>
                      <th>{t("DOS")}</th>
                      <th>{t("MRP")}</th>
                      <th>{t("Rate")}</th>
                      <th>{t("Disc.")}</th>
                      <th>{t("Amt")}</th>
                      <th>{t("D.Date")}</th>
                      <th>{t("SC")}</th>
                      <th className="text-center">
                        {/* <Tooltip label={t("Urgen Delivery")}> */}
                        <span className="blinking">
                          <i
                            className="fa fa-hourglass-start blinking"
                            style={{ color: "red" }}
                          ></i>
                        </span>
                        {/* </Tooltip> */}
                      </th>
                      <th className="text-center">
                        <i className="fa fa-trash"></i>
                      </th>
                    </tr>
                  </thead>
                  {tableData.length > 0 && (
                    <tbody>
                      {tableData.map((data, index) => (
                        <>
                          {show5?.modal &&
                            index === show5?.index &&
                            [3, 4].includes(BarcodeLogic) && (
                              <BarcodeLogicModal
                                show={show5?.modal}
                                handleClose={handleCloseBarcodeModal}
                                value={data?.BarcodeNo}
                                Id={data?.SampleTypeID}
                                onChange={handleChangePloBarCode}
                                Edit={false}
                                onClose={() =>
                                  setShow5({ modal: false, index: -1 })
                                }
                                handleMainClose={() =>
                                  handleBarcodeUpperClose(index, data?.Status)
                                }
                              />
                            )}
                          <tr
                            key={index}
                            style={{
                              background: data?.isOutSource == 1 ? "pink" : "",
                            }}
                          >
                            <RegisterationTable
                              data={data}
                              slotOpen={slotOpen}
                              setSlotOpen={setSlotOpen}
                              handleSelectSlot={handleSelectSlot}
                              tableData={tableData}
                              setTableData={setTableData}
                              LTData={LTData}
                              index={index}
                              coupon={coupon}
                              member={throughMemberData}
                              handleFilter={handleFilter}
                              handleDiscount={handleDiscount}
                              handlePLOChange={handlePLOChange}
                              handleUrgent={handleUrgent}
                              handleRateTypePaymode={handleRateTypePaymode}
                              state={state}
                            />
                          </tr>
                        </>
                      ))}
                    </tbody>
                  )}
                </Tables>
              </div>{" "}
            </div>
          </div>
          <div
            style={{ width: "50%" }}
            className=" pt-2 pl-2 pr-3 col-md-6 col-sm-12 col-12"
          >
            <div className="row">
              <div className="col-sm-3 col-6">
                <Input
                  data-val="false"
                  placeholder=" "
                  lable={t("Total Amount")}
                  id="Total_Amount"
                  name="Total_Amount"
                  disabled={true}
                  type="text"
                  value={Number(LTData?.NetAmount).toFixed(2)}
                  readOnly="readonly"
                />
              </div>
              <div className="col-sm-3 col-6">
                <Input
                  id="Paid_Amount"
                  lable={t("Paid Amount")}
                  placeholder=" "
                  name="Paid_Amount"
                  type="number"
                  value={Number(paid).toFixed(2)}
                  readOnly="readonly"
                />
              </div>
              <div className="col-sm-3 col-6">
                <Input
                  data-val="false"
                  placeholder=" "
                  id="DiscountAmt"
                  lable={t("Discount Amount")}
                  disabled={
                    tableData?.length > 0
                      ? LTData?.DiscountId != ""
                        ? true
                        : handleRateTypePaymode === "Credit"
                          ? true
                          : LTData?.DiscountApprovedBy != ""
                            ? true
                            : false
                      : true
                  }
                  value={disAmt}
                  name="disAmt"
                  onChange={(e) => {
                    let match = Match();

                    if (coupon?.field == true) {
                      toast.error(t("Remove Coupon First"));
                    } else {
                      if (discountPercentage === "" && !match) {
                        if (LTData?.GrossAmount < Number(e.target.value)) {
                          toast.error(t("Please Enter Valid Discount"));
                        } else {
                          const val = e.target.value;
                          const isValidInput =
                            /^\d+(\.\d{0,2})?$/.test(val) &&
                            parseFloat(val) >= 0 &&
                            parseFloat(val) <= 99999999999;
                          setdisAmt(isValidInput || val === "" ? val : disAmt);
                          setLTData({
                            ...LTData,
                            DiscountOnTotal:
                              isValidInput || val === ""
                                ? val
                                : LTData.DiscountOnTotal,
                          });

                          const findPercentageDiscount =
                            (val / LTData?.GrossAmount) * 100;

                          const data = PLO.map((ele, index) => {
                            const finalDiscountamont = handleDiscountLastIndex(
                              ele,
                              index,
                              findPercentageDiscount,
                              val
                            );

                            return {
                              ...ele,
                              Amount:
                                tableData?.length > 1
                                  ? ele.Rate - finalDiscountamont
                                  : ele?.Rate - val,
                              DiscountAmt:
                                tableData?.length > 1
                                  ? finalDiscountamont
                                  : val,
                            };
                          });
                          setPLO(data);
                        }
                      } else {
                        toast.error(t("Discount already Given"));
                      }
                    }
                  }}
                />
              </div>
              <div className="col-sm-3 col-6">
                <Input
                  id="DiscountPer"
                  lable={t("Discount Percentage")}
                  value={discountPercentage}
                  name="DiscountPer"
                  disabled={
                    tableData?.length > 0
                      ? LTData?.DiscountId != ""
                        ? true
                        : handleRateTypePaymode === "Credit"
                          ? true
                          : LTData?.DiscountApprovedBy != ""
                            ? true
                            : false
                      : true
                  }
                  placeholder=" "
                  onChange={(e) => {
                    const val = e.target.value;
                    const isValidInput =
                      /^\d+(\.\d{0,2})?$/.test(val) &&
                      parseFloat(val) >= 0 &&
                      parseFloat(val) <= 100;
                    let match = Match();

                    if (coupon?.field == true) {
                      toast.error(t("Remove Coupon First"));
                    } else {
                      if (disAmt === "" && !match) {
                        setDiscountPercentage(
                          isValidInput || val === "" ? val : discountPercentage
                        );
                      } else {
                        toast.error(t("Discount Already Given"));
                      }
                    }
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3 col-6">
                <SelectBox
                  options={PaymentMode}
                  selectedValue={RcData[RcData.length - 1].PaymentModeID}
                  onChange={handlePaymentChange}
                  isDisabled={
                    tableData?.length > 0
                      ? handleRateTypePaymode === "Credit"
                        ? true
                        : false
                      : true
                  }
                />
              </div>
              <div className="col-sm-3 col-6">
                <SelectBox
                  options={DISCOUNT_TYPE}
                  selectedValue={LTData?.DiscountType}
                  onChange={handleSelectChange}
                  name={"DiscountType"}
                  isDisabled={
                    tableData?.length > 0 && !coupon.field ? false : true
                  }
                />
              </div>
              <div className="col-sm-3 col-6">
                {LTData?.DiscountType === 1 ? (
                  <SelectBox
                    options={BindDiscApproval}
                    name="DiscountApprovedBy"
                    selectedValue={LTData?.DiscountApprovedBy}
                    onChange={handleSelectChange}
                    isDisabled={
                      coupon?.field
                        ? true
                        : LTData?.DiscountId != ""
                          ? true
                          : LTData?.DiscountOnTotal === "" ||
                              LTData?.DiscountOnTotal == 0
                            ? true
                            : false
                    }
                  />
                ) : (
                  AgeWiseDiscountDropdown.length > 0 && (
                    <SelectBox
                      options={AgeWiseDiscountDropdown}
                      selectedValue={LTData?.DiscountId}
                      name="DiscountId"
                      onChange={(e) => {
                        let match = Match();
                        if (disAmt === "" && !match) {
                          const data = AgeWiseDiscountDropdown.find(
                            (ele) => ele?.value == e.target.value
                          );

                          setDiscountPercentage(data?.perCentage);
                          setLTData({
                            ...LTData,
                            DiscountId: e.target.value,
                            DiscountApprovedBy: "",
                            DiscountReason: "",
                          });
                        } else {
                          toast.error(t("Discount Already Given"));
                        }
                      }}
                    />
                  )
                )}
              </div>
              <div className="col-sm-3 col-6">
                {LTData?.DiscountId === "" ? (
                  <SelectBox
                    options={BindDiscReason}
                    name="DiscountReason"
                    selectedValue={LTData?.DiscountReason}
                    onChange={handleSelectChange}
                    isDisabled={
                      coupon?.field
                        ? true
                        : LTData?.DiscountId != ""
                          ? true
                          : LTData?.DiscountOnTotal === "" ||
                              LTData?.DiscountOnTotal == 0
                            ? true
                            : false
                    }
                  />
                ) : (
                  <Input
                    name="DiscountReason"
                    lable="Discount Reason"
                    placeholder=" "
                    value={LTData?.DiscountReason}
                    onChange={handleSelectChange}
                  />
                )}
              </div>
            </div>
            <div className="row d-none">
              <div className="col-sm-4 col-6">
                <div className="d-flex">
                  <div style={{ width: "87%" }}>
                    <Input
                      id="CouponCode"
                      lable="Enter Your Coupon Code"
                      type="text"
                      value={coupon.code}
                      max={30}
                      placeholder={" "}
                      disabled={coupon.field}
                      onChange={(e) =>
                        setCoupon({
                          ...coupon,
                          code: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div style={{ width: "13%" }}>
                    <button
                      className="btn btn-primary btn-sm"
                      type="button"
                      style={{ borderRadius: "0px !important" }}
                      onClick={handleCouponDetailsModal}
                    >
                      <i
                        className="fa fa-search coloricon"
                        style={{ cursor: "pointer" }}
                      ></i>
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-sm-2 col-3">
                {coupon?.load ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-success btn-block btn-sm"
                    onClick={handleCouponValidate}
                    disabled={coupon.field}
                  >
                    {"Validate"}
                  </button>
                )}
              </div>
              <div className="col-sm-2 col-3">
                <button
                  id="btndeleterow"
                  className="btn btn-danger btn-block btn-sm"
                  onClick={handleCouponCancel}
                >
                  {"Cancel"}
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-3 col-6">
                <Input
                  name="CashRendering"
                  lable={t("Cash Rendering")}
                  id="CashRendering"
                  value={LTData?.CashRendering}
                  placeholder=" "
                  onChange={handleSelectChange}
                />
              </div>

              {Number(LTData?.CashRendering) - Number(LTData?.NetAmount) > 0 ? (
                <div className="col-sm-3 col-6">
                  <Input
                    name="Return"
                    value={
                      Number(LTData?.CashRendering) - Number(LTData?.NetAmount)
                    }
                    lable={t("Return")}
                    placeholder=" "
                    disabled={true}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              <Tables>
                <thead className="cf">
                  <tr>
                    <th className="text-center">
                      <i className="fa fa-trash"></i>
                    </th>
                    <th>{t("Mode")}</th>
                    <th>{t("Paid Amount")}</th>
                    <th>{t("Currency")}</th>
                    <th>{t("Base")}</th>
                    <th>{t("Bank Name")}</th>
                    <th>{t("Cheque/Card No.")}</th>
                    <th>{t("Cheque Date/Trans No")}</th>
                  </tr>
                </thead>
                <tbody>
                  {RcData?.map((data, index) => (
                    <tr key={index}>
                      <td data-title={t("Action")}>
                        <div>
                          <CloseButton
                            handleClick={() => handleFilterPayment(index)}
                          />
                        </div>
                      </td>
                      <td data-title={t("Mode")}>
                        <span id="SpanPaymentMode">
                          {t(data?.PaymentMode)} &nbsp;
                        </span>
                      </td>
                      <td data-title={t("Paid Amount")}>
                        {handleRateTypePaymode === "Credit" ? (
                          ""
                        ) : (
                          <Input
                            name="Amount"
                            value={data?.Amount}
                            placeholder={"0.00"}
                            type="number"
                            onChange={(e) => {
                              let sum = calculate(e.target.value, index);
                              if (
                                sum > LTData?.NetAmount ||
                                e.target.value > LTData?.NetAmount
                              ) {
                                toast.error("Please Enter Correct Amount");
                                const data = [...RcData];
                                data[index]["Amount"] = "";
                                calculate("", index);
                                setRcData(data);
                              } else {
                                const data = [...RcData];
                                data[index]["Amount"] = e.target.value;
                                setRcData(data);
                              }
                            }}
                          />
                        )}
                      </td>
                      <td data-title={t("Currency")}>
                        <span id="SpanCurrency">{"INR"}</span>
                      </td>
                      <td data-title={t("Base")}>
                        <span id="spnbaseAmount">{data?.Amount} &nbsp;</span>
                      </td>
                      {/* <td data-title={t("Bank Name")}>
                        {["Cash", "Paytm"].includes(data?.PaymentMode) ? (
                          ""
                        ) : (
                          <select
                            className="required"
                            name="BankName"
                            value={data?.BankName}
                            disabled={
                              handleRateTypePaymode === "Credit" ? true : false
                            }
                            onChange={(e) => handleChangeRTCData(e, index)}
                          >
                            <option hidden>-- Select Bank --</option>
                            {BankName.map((ele, index) => (
                              <option value={ele.value} key={index}>
                                {ele.label}
                              </option>
                            ))}
                          </select>
                        )}
                        &nbsp;
                      </td> */}

                      <td data-title={t("Bank Name")}>
                        {["Cash", "Paytm"].includes(data?.PaymentMode) ? (
                          ""
                        ) : (
                          <select
                            className="required"
                            name="BankName"
                            value={data?.BankName}
                            disabled={handleRateTypePaymode === "Credit"}
                            onChange={(e) => handleChangeRTCData(e, index)}
                          >
                            <option hidden>-- Select Bank --</option>
                            {getFilteredBankList(data?.PaymentMode).map(
                              (ele, index) => (
                                <option value={ele.value} key={index}>
                                  {ele.label}
                                </option>
                              )
                            )}
                          </select>
                        )}
                        &nbsp;
                      </td>
                      <td data-title={t("Cheque/Card No.")}>
                        <Input
                          disabled={
                            ["Cash", "Paytm"].includes(data?.PaymentMode)
                              ? true
                              : handleRateTypePaymode === "Credit"
                                ? true
                                : false
                          }
                          type="number"
                          id="CardNo"
                          onInput={(e) => number(e, 16)}
                          name="CardNo"
                          value={data?.CardNo}
                          onChange={(e) => handleChangeRTCData(e, index)}
                          className={`select-input-box form-control input-sm ${
                            ["Cash", "Online Payment", "Paytm"].includes(
                              data?.PaymentMode
                            )
                              ? ""
                              : "required"
                          }`}
                        />
                      </td>
                      <td data-title={t("Cheque Date/Trans No")}>
                        <Input
                          disabled={
                            data?.PaymentMode !== "Cash"
                              ? handleRateTypePaymode === "Credit"
                                ? true
                                : false
                              : true
                          }
                          type={
                            ["Cash", "Paytm"].includes(data?.PaymentMode)
                              ? "text"
                              : "date"
                          }
                          id="CardDate"
                          className={`select-input-box form-control input-sm ${
                            ["Cash", "Online Payment", "Paytm"].includes(
                              data?.PaymentMode
                            )
                              ? ""
                              : "required"
                          }`}
                          name="CardDate"
                          value={data?.CardDate}
                          onChange={(e) => handleChangeRTCData(e, index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Tables>
            </div>
            <div className="row mt-2 mb-1">
              <div className="col-sm-2 order-4 order-sm-1 ">
                {(isSubmit?.isLoading && isSubmit?.type === "Success") ||
                load ||
                isRazorPayOpen ? (
                  <Loading />
                ) : (
                  <button
                    type="submit"
                    id="btnSave"
                    // disabled={handleLockRegistation}
                    className="btn btn-success w-100 btn-sm"
                    onClick={() => {
                      handleSubmit();
                      window.scrollTo(0, 0);
                    }}
                  >
                    {t("Submit")}
                  </button>
                )}
              </div>
              <div className="col-sm-2 col-6">
                <button
                  type="button"
                  id="btnReset"
                  className="btn btn-success w-100 btn-sm"
                  onClick={() => {
                    handleReset();
                    window.scrollTo(0, 0);
                  }}
                >
                  {t("Reset")}
                </button>
              </div>
              {state?.HideAmount != 1 && (
                <label className="col-sm-3 col-4 order-1 order-sm-2">
                  {t("Due Amount")}:{" "}
                  {Number(LTData?.NetAmount - paid).toFixed(2)}
                </label>
              )}
              {state?.HideAmount != 1 && (
                <label className="col-sm-4 col-4 order-2 order-sm-3">
                  {t("Total Discount Amount")}:{" "}
                  {LTData?.DiscountOnTotal
                    ? parseFloat(LTData?.DiscountOnTotal).toFixed(2)
                    : " 0"}
                </label>
              )}

              <div className="col-sm-3 col-4 order-3 mt-2">
                <button
                  className="btn btn-success btn-block btn-sm"
                  onClick={() => {
                    setShowRemark(true);
                  }}
                >
                  {t("Billing Remarks")}
                </button>
              </div>
            </div>
            {/* {suggestionData?.show && (
              <SuggestionModal view={suggestionData?.show}>
                {suggestionData?.testSuggestions?.show && (
                  <PackageSuggestion
                    view={suggestionData?.testSuggestions?.show}
                    title={"Abnormal Test"}
                    data={suggestionData?.testSuggestions?.data}
                    testData={testDataArray}
                    handleSuggestion={(data) =>
                      handleListSearch(
                        { ...data, CentreID: state?.RateID },
                        "TestName"
                      )
                    }
                    handleViewTestDetails={(data) => {
                      setSuggestionData((ele) => ({
                        ...ele,
                        viewTestModal: true,
                        viewTestModalId: data,
                      }));
                    }}
                    suggestionData={suggestionData}
                    setSuggestionData={setSuggestionData}
                    onClose={() =>
                      setSuggestionData((prev) => ({
                        ...prev,
                        testSuggestions: {
                          ...prev.testSuggestions,
                          show: false,
                        },
                      }))
                    }
                  />
                )}
                {suggestionData?.packageSuggestions?.show && (
                  <PackageSuggestion
                    view={suggestionData?.packageSuggestions?.show}
                    title={"Suggestive Investigation"}
                    data={suggestionData?.packageSuggestions?.data}
                    testData={testDataArray}
                    handleSuggestion={(data) =>
                      handleListSearch(
                        { ...data, CentreID: state?.RateID },
                        "TestName"
                      )
                    }
                    handleViewTestDetails={(data) => {
                      setSuggestionData((ele) => ({
                        ...ele,
                        viewTestModal: true,
                        viewTestModalId: data,
                      }));
                    }}
                  />
                )}
              </SuggestionModal>
            )} */}
          </div>
        </div>
      </Accordion>
    </>
  );
};

export default PatientRegistration;
