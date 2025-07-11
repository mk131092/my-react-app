import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import { useTranslation } from "react-i18next";
import {
  AllowedSpecialChar,
  PreventSpecialCharacterandNumber,
} from "../util/Commonservices";
import moment from "moment";
import { validateIssue } from "../../utils/Schema";
import Accordion from "@app/components/UI/Accordion";
import UploadFile from "../utils/UploadFileModal/UploadFile";
import MobileDataModal from "../utils/MobileDataModal";
import CardDetailViewModal from "../utils/CardDetailViewModal";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Input from "../../components/formComponent/Input";
import { number } from "../../utils/helpers";
import DatePicker from "../../components/formComponent/DatePicker";
import Tables from "../../components/UI/customTable";
import Loading from "../../components/loader/Loading";

const relationshipOptions = [
  { value: "", label: "Select" },
  { value: "mother", label: "Mother" },
  { value: "father", label: "Father" },
  { value: "son", label: "Son" },
  { value: "daughter", label: "Daughter" },
  { value: "grandmother", label: "Grandmother" },
  { value: "grandfather", label: "Grandfather" },
  { value: "grandson", label: "Grandson" },
  { value: "granddaughter", label: "Granddaughter" },
  { value: "spouse", label: "Spouse" },
  { value: "sibling", label: "Sibling" },
];

const currencyOptions = [{ value: "INR", label: "INR" }];

const optionData = {
  cardNameOpt: [{ label: "Select Card", value: "" }],
  titleOpt: [{ label: "Select title", value: "" }],
  genderOpt: [{ label: "Select Gender", value: "" }],
  relationOpt: [{ label: "Select relation", value: "" }],
  currencyOpt: [
    // { label: "Select Currency", value: "" },
    ...(currencyOptions ?? []),
  ],
  bankopt: [],
};

const patDataConst = {
  PatientCode: "",
  Title: "Mr.",
  PName: "",
  Mobile: "",
  Age: "",
  AgeYear: "",
  AgeMonth: "",
  AgeDays: "",
  TotalAgeInDays: "",
  DOB: "",
  Gender: "Male",
  IsDOBActual: 0,
  FamilyMemberIsPrimary: 1,
  FamilyMemberRelation: "Self",
  base64PatientProfilePic: "",
  CentreID: "0",
  StateID: "0",
  CityID: "0",
  localityid: "0",
  IsOnlineFilterData: 0,
  IsDuplicate: 0,
  PinCode: "0",
  RadioDefaultSelect: "Age",
};

const rcdataConst = {
  PayBy: "",
  PaymentMode: "Cash",
  PaymentModeID: "",
  Amount: "",
  BankName: "",
  CardNo: "",
  CardDate: "",
  S_Amount: "",
  S_CountryID: "",
  S_Currency: "INR",
  S_Notation: "INR",
  C_Factor: "1",
  Currency_RoundOff: "0",
  Naration: "",
  PayTmMobile: "",
  PayTmOtp: "",
  CentreID: "",
  TIDNumber: "",
  Panel_ID: "",
  CurrencyRoundDigit: "2",
  Converson_ID: "1",
};

const defaultCurrOpt = {
  MobileWallet: false,
  Cheque: false,
  NEFT: false,
  DebitCard: false,
  CreditCard: false,
  Cash: false,
};

const MembershipCardIssue = () => {
  const { t } = useTranslation();

  const [data, setData] = useState({
    PatientData: patDataConst,
    DependentData: [],
    optData: optionData,
    LTData: {
      GrossAmount: 0,
      NetAmount: 0,
      Adjustment: 0,
    },
    plodata: {
      ItemId: "",
      ItemName: "",
      SubCategoryID: "7",
      Amount: 0,
      Rate: 0,
    },
    rcdata: [],
    cardid: "",
    cardvalidity: "",
    cardno: "",
    cardAmt: 0,
    CardDependent: 0,
    currency: "INR",
    currOption: defaultCurrOpt,
  });
  const [mobiledata, setmobiledata] = useState(false);
  const [modal, setModal] = useState({
    viewFileModal: {
      show: false,
      data: "",
    },
    viewLogomodal: {
      show: false,
      data: "",
    },
    testView: {
      show: false,
      data: "",
    },
    mobiledata: {
      show: false,
      show2: false,
      data: [],
      tempIndex: "",
    },
    carddetail: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState();
  const [depMobiledata, setdepMobiledata] = useState([]);

  const handleReset = () => {
    setData((data) => ({
      ...data,
      PatientData: patDataConst,
      DependentData: [],
      LTData: {
        GrossAmount: 0,
        NetAmount: 0,
        Adjustment: 0,
      },
      plodata: {
        ItemId: "",
        ItemName: "",
        SubCategoryID: "7",
        Amount: 0,
        Rate: 0,
      },
      rcdata: [],
      cardid: "",
      cardvalidity: "",
      cardno: "",
      cardAmt: 0,
      CardDependent: 0,
      currency: "INR",
      currOption: defaultCurrOpt,
    }));
    setmobiledata(false);
    setdepMobiledata([]);
    setError({});
    getPrimarymemberguid();
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

  const getCardList = () => {
    axiosInstance.get(`MembershipCardIssue/GetCard`).then((res) => {
      let data = res.data.message;
      let updatedData = data.map((ele) => {
        return {
          ...ele,
          value: ele.id,
          label: ele.cardname,
        };
      });
      setData((data) => ({
        ...data,
        optData: {
          ...data?.optData,
          cardNameOpt: [
            { label: "Select Card", value: "" },
            ...(updatedData ?? []),
          ],
        },
      }));
    });
  };

  const getPrimarymemberguid = () => {
    const guidNum = guidNumber();
    setData((data) => ({
      ...data,
      base64logo: guidNum,
      PatientData: {
        ...data?.PatientData,
        base64PatientProfilePic: guidNum,
      },
    }));
  };
  useEffect(() => {
    getPrimarymemberguid();
  }, []);
  const MaleData = (datas) => {
    if (datas === "Male") {
      return [
        { label: "Self", value: "" },
        { label: "GrandFather", value: "GrandFather" },
        { label: "Father", value: "Father" },
        { label: "Son", value: "Son" },
        { label: "Spouse", value: "Spouse" },
        { label: "Sibling", value: "Sibling" },
        { label: "GrandSon", value: "GrandSon" },
      ];
    } else {
      return [
        { label: "Self", value: "" },
        { label: "GrandMother", value: "GrandMother" },
        { label: "Mother", value: "Mother" },
        { label: "Daughter", value: "Daughter" },
        { label: "Spouse", value: "Spouse" },
        { label: "Sibling", value: "Sibling" },
        { label: "GrandDaughter", value: "GrandDaughter" },
      ];
    }
  };

  const handleCashTable = (e, ele, ind) => {
    const { name, value, checked } = e.target;
    const updatedItems = [...data?.rcdata].map((item, index) =>
      index === ind ? { ...item, [name]: value || 0 } : item
    );
    if (name === "Amount") {
      const total = [...updatedItems].reduce(
        (acc, item) => acc + Number(item[name]),
        0
      );
      if (total <= data?.cardAmt) {
        setData((data) => ({
          ...data,
          rcdata: updatedItems,
        }));
      }
    } else {
      setData((data) => ({
        ...data,
        rcdata: updatedItems,
      }));
    }
  };
  const handleCurrencyOption = (e) => {
    const { name, value, checked } = e.target;
    let updatedData = { ...rcdataConst };
    updatedData.S_Currency = data?.currency;
    updatedData.S_Notation = data?.currency;
    updatedData.PaymentMode = name;

    const isAvail = data?.rcdata.find((ele) => ele?.PaymentMode === name);
    if (isAvail) {
      setData((data) => ({
        ...data,
        rcdata:
          data?.rcdata.length > 1
            ? data?.rcdata.filter((ele) => ele?.PaymentMode !== name)
            : data?.rcdata,
        currOption: {
          ...data?.currOption,
          [name]: data?.rcdata.length > 1 ? false : data?.currOption[name],
        },
      }));
    } else {
      let currencyData = [...data?.rcdata];
      currencyData.push(updatedData);
      setData((data) => ({
        ...data,
        rcdata: currencyData,
        currOption: {
          ...data?.currOption,
          [name]: true,
        },
      }));
    }
  };

  const getDropDownData = (name) => {
    const match = ["Title", "Gender", "BankName"];
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

        // value.unshift({ label: `Select ${name} `, value: "" });

        setData((data) => ({
          ...data,
          optData: {
            ...data?.optData,
            titleOpt: name === "Title" ? value : data?.optData?.titleOpt,
            genderOpt: name === "Gender" ? value : data?.optData?.genderOpt,
            bankopt: name === "BankName" ? value : data?.optData.bankopt,
          },
        }));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getDropDownData("Gender");
    getDropDownData("Title");
    getDropDownData("BankName");
    getCardList();
  }, []);
  console.log(data);

  // finding gender according to title
  const findGender = (value) => {
    const male = ["Mr.", "Baba", "Dr.(Mr)", "Baby"];
    const female = ["Miss.", "Mrs.", "Dr.(Miss)", "Dr.(Mrs)", "Ms.","SMT."];
    if (male.includes(value)) {
      return "Male";
    }
    if (female.includes(value)) {
      return "Female";
    }
  };

  const handleDOBCalculation = (e, year, month, day) => {
    const { name, value } = e.target;
    // let diff = new Date();

    let AgeYear = name === "AgeYear" && year === "" ? value : year;
    let AgeMonth = name === "AgeMonth" && month === "" ? value : month;
    let AgeDays = name === "AgeDays" ? value : "";

    if (name === "AgeYear") {
      AgeYear = value;
    }

    if (name === "AgeMonth") {
      AgeMonth = value;
    }

    if (name === "AgeDays") {
      AgeDays = value;
    }
    var diff = moment()
      .subtract(AgeYear, "years")
      .subtract(AgeMonth, "months")
      .subtract(AgeDays, "days");

    let Newdiff = moment().diff(diff, "milliseconds");

    var duration = moment.duration(Newdiff);

    const y = `${duration.years()}`;
    const m = `${duration.months()}`;
    const d = `${duration.days()}`;
    const days = ageCount(y, m, d);

    const output = {
      [name]: value,
      DOB: diff,
      AgeYear,
      AgeMonth,
      AgeDays,
      TotalAgeInDays: moment(moment().format("YYYY-MM-DD")).diff(diff, "days"),
      Age: `${duration.years()} Y ${duration.months()} M ${days} D`,
    };
    return output;
  };

  const ageCount = (y = "0", m = "0", d = "0") => {
    if (y == 0 && m == 0 && d == 0) {
      return 1;
    } else {
      return d == "" ? 0 : d;
    }
  };

  const calculateTotalNumberOfDays = (value) => {
    const dateToday = moment(new Date()).format("DD-MMM-YYYY");
    const dateValue = moment(value).format("DD-MMM-YYYY");
    if (dateToday === dateValue) {
      return 1;
    } else {
      return moment(moment().format("YYYY-MM-DD")).diff(value, "days");
    }
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
    const dateToday = moment(new Date()).format("DD-MMM-YYYY");
    const dateValue = moment(value).format("DD-MMM-YYYY");
    if (dateToday == dateValue) {
      days = 1;
      return { years, months, days };
    } else {
      return { years, months, days };
    }
  };

  const addDependentRow = (n) => {
    const arr = [];
    const currencyTable = [];
    const noOfTimes = n;

    for (let i = 0; i < noOfTimes; i++) {
      const guidNum = guidNumber();
      const newObj = { ...patDataConst };
      newObj[`RadioDefaultSelect${i}`] = "Age";
      newObj.base64PatientProfilePic = guidNum;
      newObj.FamilyMemberIsPrimary = 0;
      newObj.UploadModal = false;
      newObj.FamilyMemberRelation = "";
      arr.push(newObj);
    }

    currencyTable.push(rcdataConst);

    setData((data) => ({
      ...data,
      DependentData: arr,
      rcdata: currencyTable,
      currOption: {
        ...data?.currOption,
        Cash: true,
      },
    }));
  };

  const dateSelect = (value, name) => {
    const { years, months, days } = calculateDOB(value);
    setData((data) => ({
      ...data,
      PatientData: {
        ...data?.PatientData,
        [name]: value,
        AgeYear: years,
        AgeMonth: months,
        AgeDays: days,
        TotalAgeInDays: calculateTotalNumberOfDays(value),
        Age: `${years} Y ${months} M ${days} D`,
      },
    }));
  };

  const depDateSelect = (value, name, ele, ind) => {
    const { years, months, days } = calculateDOB(value);
    const updatedData = { ...ele };
    updatedData.DOB = value;
    updatedData.AgeYear = years;
    updatedData.AgeMonth = months;
    updatedData.AgeDays = days;
    updatedData.TotalAgeInDays = calculateTotalNumberOfDays(value);
    updatedData.Age = `${years} Y ${months} M ${days} D`;
    setData((data) => ({
      ...data,
      DependentData: data.DependentData.map((item, index) =>
        index === ind ? updatedData : item
      ),
    }));
  };

  const handleChange = async (event) => {
    const { name, value, checked, type } = event?.target;
    const val = AllowedSpecialChar(value, [" "]);
    const trimmedValue = value.endsWith("  ") ? value.trimEnd() + " " : value;
    if (name === "Title") {
      const genderVal = findGender(value);
      setData((data) => ({
        ...data,
        PatientData: {
          ...data?.PatientData,
          [name]: value,
          Gender: genderVal,
        },
      }));
    } else if (name === "PName") {
      const Value = PreventSpecialCharacterandNumber(trimmedValue)
        ? trimmedValue.trimStart()
        : data.PatientData[name];
      setData((data) => ({
        ...data,
        PatientData: {
          ...data?.PatientData,
          [name]: Value.trimStart(),
        },
      }));
    } else if (["AgeYear", "AgeMonth", "AgeDays"].includes(name)) {
      const output = handleDOBCalculation(
        event,
        data?.PatientData?.AgeYear,
        data?.PatientData?.AgeMonth
      );
      setData((data) => ({
        ...data,
        PatientData: {
          ...data?.PatientData,
          Age: output?.Age,
          AgeYear: output?.AgeYear,
          AgeMonth: output?.AgeMonth,
          AgeDays: output?.AgeDays,
          TotalAgeInDays: output?.TotalAgeInDays,
          DOB: output?.DOB,
        },
      }));
    } else if (name === "Mobile") {
      setData((data) => ({
        ...data,
        PatientData: {
          ...data?.PatientData,
          [name]: value,
        },
      }));
    } else {
      setData((data) => ({
        ...data,
        PatientData: {
          ...data?.PatientData,
          [name]: value,
        },
      }));
    }
  };

  const handlePatientData = (e, type, index) => {
    const keypress = [9, 13];
    const forData =
      type === "depPatient"
        ? data?.DependentData[index]?.Mobile.length
        : data?.PatientData?.Mobile.length;
    if (keypress.includes(e.which)) {
      console.log(forData);
      if (forData === 10) {
        axiosInstance
          .post("Booking/getDataByMobileNo", {
            Mobile:
              type === "depPatient"
                ? data?.DependentData[index]?.Mobile
                : data?.PatientData?.Mobile,
            PatientCode: "",
          })
          .then((res) => {
            if (res.data.message.user.length > 0) {
              setModal((modal) => ({
                ...modal,
                mobiledata: {
                  show: type === "mainPatient" ? true : false,
                  data: res.data.message.user,
                  show2: type === "depPatient" ? true : false,
                  tempIndex: index,
                },
              }));
              if (type === "mainPatient") {
                setmobiledata(true);
              }
              if (type === "depPatient") {
                const dep = [...depMobiledata];
                dep.push({ index: index, data: true });
                setdepMobiledata(dep);
              }
            }
          })
          .catch((err) => console.log(err));
      }
    }
  };

  const handleDataChange = (event, ele, ind) => {
    const { name, value, checked, type } = event?.target;
    const val = AllowedSpecialChar(value, [" "]);
    const trimmedValue = value.endsWith("  ") ? value.trimEnd() + " " : value;
    let updatedData = { ...ele };
    if (name === "Title") {
      const genderVal = findGender(value);
      updatedData[name] = value;
      updatedData.Gender = genderVal;
    } else if (name === "PName") {
      const Value = PreventSpecialCharacterandNumber(trimmedValue)
        ? trimmedValue.trimStart()
        : updatedData[name];
      updatedData[name] = Value.trimStart();
    } else if (["AgeYear", "AgeMonth", "AgeDays"].includes(name)) {
      const output = handleDOBCalculation(
        event,
        updatedData?.AgeYear,
        updatedData?.AgeMonth
      );

      updatedData.Age = output?.Age;
      updatedData.AgeYear = output?.AgeYear;
      updatedData.AgeMonth = output?.AgeMonth;
      updatedData.AgeDays = output?.AgeDays;
      updatedData.TotalAgeInDays = output?.TotalAgeInDays;
      updatedData.DOB = output?.DOB;
    } else {
      updatedData[name] = value;
    }
    setData((data) => ({
      ...data,
      DependentData: data.DependentData.map((item, index) =>
        index === ind ? updatedData : item
      ),
    }));
  };

  const handleCard = (event) => {
    const { name, value, checked, type } = event?.target;
    const searchData = [...data?.optData?.cardNameOpt];
    const ele = searchData.filter((ele) => ele?.id == value);
    if (name === "cardid") {
      setData((data) => ({
        ...data,
        [name]: value,
        cardvalidity: ele[0]?.ValidUpTo,
        CardDependent: ele[0]?.No_of_dependant,
        cardAmt: ele[0]?.Amount ?? 0,
        plodata: {
          ...data?.plodata,
          ItemId: ele[0]?.ItemID,
          ItemName: ele[0]?.cardname,
          SubCategoryID: ele[0]?.SubCategoryID,
          Amount: ele[0]?.Amount,
          Rate: ele[0]?.Amount,
        },
        LTData: {
          GrossAmount: ele[0]?.Amount,
          NetAmount: ele[0]?.Amount,
          Adjustment: 0,
        },
        rcdata: [],
        currOption: defaultCurrOpt,
      }));
    } else {
      setData((data) => ({
        ...data,
        [name]: value,
      }));
    }

    name === "cardid" && addDependentRow(ele[0]?.No_of_dependant);
  };

  const checkDepData = () => {
    console.log(data, data.DependentData);
    const arr = [];
    data.DependentData.forEach((ele, ind) => {
      const errors = [];
      if (ele.PName.trim() === "") {
        errors.push("Enter Name");
      }
      if (ele.FamilyMemberRelation.trim() === "") {
        errors.push("Select Relation");
      }
      if (ele.TotalAgeInDays < 1) {
        errors.push("Enter valid age");
      }

      if (errors.length > 0) {
        arr.push({
          index: ind + 1,
          errorMessages: errors.join(", "),
        });
      }
    });
    return arr;
  };

  const checkPayment = () => {
    const arr = [];
    data.rcdata.map((ele, ind) => {
      if (
        ele.Amount === "" ||
        (ele?.CardNo === "" && ele?.PaymentMode !== "Cash")
      ) {
        arr.push(ele?.PaymentMode);
      }
    });
    return arr;
  };

  const handleSave = () => {
    const error = validateIssue(data, "All");
    let depErr = checkDepData();

    let reDataErr = checkPayment();
    let updatedLTdata = { ...data?.LTData };
    updatedLTdata.Adjustment = getAmount("paid");

    setLoading(true);
    if (error !== "") {
      toast.error(`Please fill required Feild`);
      setLoading(false);
    } else if (depErr.length > 0) {
      toast.error(`${depErr[0].errorMessages}`);
      setLoading(false);
    } else if (data.rcdata.length === 0) {
      toast.error(`No any payment details added`);
      setLoading(false);
    } else if (reDataErr.length > 0) {
      toast.error(
        `Missing Details for Payment mode - ${reDataErr.join(" , ")}`
      );
      setLoading(false);
    } else {
      const patientData = [data?.PatientData].concat(data?.DependentData);
      const pdata  = patientData?.map((ele)=>{
        return {
          ...ele,
          TotalAgeInDays:ele?.TotalAgeInDays?.toString()
        }
      })
      axiosInstance
        .post(`MembershipCardIssue/SaveMembershipCard`, {
          PatientData: pdata,
          LTData: updatedLTdata,
          plodata: data?.plodata,
          rcdata: data?.rcdata,
          cardid: data?.cardid,
          cardvalidity: data?.cardvalidity,
          cardno: "",
          CardDependent: data?.CardDependent,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          handleReset();
          setLoading(false);
          getReceipt(res?.data?.LedgerTransactionID);
          getMemberCard(res?.data?.MemberShipCardNo);
          setmobiledata(false);
          setdepMobiledata([]);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
          setLoading(false);
        });
    }
    setError(error);
  };

  const getMemberCard = (id) => {
    axiosInstance
      .post("/reports/v1/generateMemberShipCard", {
        CardNo: id,
      })
      .then((res) => {
        window.open(res?.data?.url, "_blank");
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
      });
  };

  const getReceipt = (id) => {
    axiosInstance
      .post("/reports/v1/MembershipReceipt", {
        LedgerTransactionId: id,
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
  };

  const handleBlur = (type) => {
    const err = validateIssue(data, type, errors);
    setError(err);
  };

  const handleSelctData = (data) => {
    const { years, months, days } = calculateDOB(new Date(data?.DOB));

    setData((ele) => ({
      ...ele,
      PatientData: {
        ...ele?.PatientData,
        PatientCode: data?.PatientCode,
        Title: data.Title,
        PName: data.FirstName + " " + data?.MiddleName + " " + data?.LastName,
        Gender: data?.Gender,
        DOB: new Date(data?.DOB),
        Age: data?.Age,
        Email: data?.Email,
        PinCode: data?.Pincode,
        AgeDays: days,
        AgeMonth: months,
        AgeYear: years,
        HouseNo: data?.HouseNo,
        CityID: data?.City,
        StateID: data?.State,
        Country: data?.Country,
        localityid: data?.StreetName,
        StreetName: data?.Locality,
        TotalAgeInDays: calculateTotalNumberOfDays(new Date(data?.DOB)),
      },
    }));
    closeMobileData();
  };

  const handleDependentData = (datas) => {
    const depArray = [...data?.DependentData];
    const { years, months, days } = calculateDOB(new Date(datas?.DOB));

    depArray[modal?.mobiledata?.tempIndex].PatientCode = datas?.PatientCode;
    depArray[modal?.mobiledata?.tempIndex].Title = datas.Title;
    depArray[modal?.mobiledata?.tempIndex].PName =
      datas?.FirstName + " " + datas?.MiddleName + " " + datas?.LastName;
    depArray[modal?.mobiledata?.tempIndex].Gender = datas?.Gender;
    depArray[modal?.mobiledata?.tempIndex].DOB = new Date(datas?.DOB);
    depArray[modal?.mobiledata?.tempIndex].Age = datas?.Age;
    depArray[modal?.mobiledata?.tempIndex].Email = datas?.Email;
    depArray[modal?.mobiledata?.tempIndex].PinCode = datas?.Pincode;
    depArray[modal?.mobiledata?.tempIndex].AgeDays = days;
    depArray[modal?.mobiledata?.tempIndex].AgeMonth = months;
    depArray[modal?.mobiledata?.tempIndex].AgeYear = years;
    depArray[modal?.mobiledata?.tempIndex].HouseNo = datas?.HouseNo;
    depArray[modal?.mobiledata?.tempIndex].CityID = datas?.City;
    depArray[modal?.mobiledata?.tempIndex].StateID = datas?.State;
    depArray[modal?.mobiledata?.tempIndex].Country = datas?.Country;
    depArray[modal?.mobiledata?.tempIndex].localityid = datas?.StreetName;
    depArray[modal?.mobiledata?.tempIndex].StreetName = datas?.Locality;
    depArray[modal?.mobiledata?.tempIndex].TotalAgeInDays =
      calculateTotalNumberOfDays(new Date(datas?.DOB));

    setData((ele) => ({
      ...ele,
      DependentData: depArray,
    }));
    closeMobileData();
  };

  const closeMobileData = (type) => {
    setModal((modal) => ({
      ...modal,
      mobiledata: {
        show: false,
        data: [],
        show2: false,
      },
    }));
  };

  const isObjectPresentWithIndexAndData = (array, index) => {
    console.log(depMobiledata);
    const get = array.find((item) => item.index === index);
    return get?.data;
  };

  const getAmount = (type) => {
    const datas = [...data?.rcdata];
    const amount = datas.reduce(
      (acc, cur) => Number(acc) + Number(cur?.Amount),
      0
    );
    const balanceAmount = Number(data?.cardAmt) - Number(amount);
    if (type === "paid") {
      return amount ?? 0;
    } else if (type === "balance" && !isNaN(balanceAmount)) {
      return balanceAmount ?? 0;
    } else {
      return 0.0;
    }
  };

  const getcarditemdetail = () => {
    if (data?.cardid == "") {
      toast.error("Select card to view details");
    } else {
      setModal((modal) => ({
        ...modal,
        carddetail: true,
      }));
    }
  };
  return (
    <>
      {modal.carddetail && (
        <CardDetailViewModal
          show={modal.carddetail}
          data={data?.cardid}
          onHide={() => {
            setModal((modal) => ({
              ...modal,
              carddetail: false,
            }));
          }}
        />
      )}
      {modal?.mobiledata?.show2 && (
        <MobileDataModal
          show={modal?.mobiledata?.show2}
          mobleData={modal?.mobiledata?.data ?? []}
          handleClose4={closeMobileData}
          handleSelctData={handleDependentData}
        />
      )}
      {modal?.mobiledata?.show && (
        <MobileDataModal
          show={modal?.mobiledata?.show}
          mobleData={modal?.mobiledata?.data ?? []}
          handleClose4={closeMobileData}
          handleSelctData={handleSelctData}
        />
      )}
      {modal.viewFileModal.show && (
        <UploadFile
          show={modal.viewFileModal.show}
          pageName={"MembershipCardIssue"}
          documentId={data?.PatientData?.base64PatientProfilePic}
          handleClose={() =>
            setModal((modal) => ({
              ...modal,
              viewFileModal: {
                ...modal.viewFileModal,
                show: false,
              },
            }))
          }
        />
      )}
      {modal.viewLogomodal.show && (
        <UploadFile
          show={modal.viewLogomodal.show}
          pageName={"MembershipCardIssue"}
          documentId={data?.base64logo}
          handleClose={() =>
            setModal((modal) => ({
              ...modal,
              viewLogomodal: {
                ...modal.viewLogomodal,
                show: false,
              },
            }))
          }
        />
      )}
      <Accordion
        name={t("Membership Card Issue")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row pt-2 pl-2 pr-2 mt-1">
          <div className="col-sm-2">
            <SelectBox
              name="cardid"
              id="cardid"
              placeholder=""
              selectedValue={data?.cardid}
              options={data?.optData?.cardNameOpt}
              onChange={handleCard}
              lable={t("Select Card")}
            />
            {data?.cardid === "" && (
              <div className="error-message">{errors?.cardid}</div>
            )}
          </div>
          <div className="col-sm-6">
            <label htmlFor="Card Amount" className="col-sm-4">
              {t("Card Amount")}:{"  "}
              <span>{data?.cardAmt}</span>
            </label>

            <label htmlFor="No. of Dependant" className="col-sm-4">
              {t("No. of Dependant")}:{"  "}
              <span>{data?.CardDependent}</span>
            </label>

            <label htmlFor="Expiry Date" className="col-sm-4">
              {t("Expiry Date")}:{"  "}
              <span>{data?.cardvalidity}</span>
            </label>
          </div>
          <div className="col-sm-1">
            <button
              type="Submit"
              className="btn btn-block btn-success btn-sm"
              onClick={() => getcarditemdetail()}
            >
              {t("View Test")}
            </button>
          </div>
        </div>
      </Accordion>
      <Accordion title={t("Primary Member")} defaultValue={true}>
        <div className="row pt-2 pl-2 pr-2 mt-1">
          <div className="col-sm-1">
            <Input
              name="Mobile"
              type="number"
              disabled={mobiledata}
              onInput={(e) => number(e, 10)}
              onKeyDown={(e) => handlePatientData(e, "mainPatient")}
              onChange={handleChange}
              value={data?.PatientData?.Mobile}
              onBlur={() => {
                handleBlur("Mobile");
              }}
              lable={t("Mobile No.")}
            />
            {data?.PatientData?.Mobile === "" && (
              <div className="error-message">{errors?.Mobile}</div>
            )}
            {data?.PatientData?.Mobile.length !== "" &&
              data?.PatientData?.Mobile.length !== 10 && (
                <div className="error-message">{errors?.Mobilelen}</div>
              )}
          </div>
          <div className="col-sm-2">
            <Input
              name="PatientCode"
              id="PatientCode"
              type="text"
              onChange={handleChange}
              disabled={true}
              value={data?.PatientData?.PatientCode}
              lable="UHID"
            />
          </div>
          <div className="col-sm-1">
            <button
              type="Submit"
              className="btn btn-block btn-success btn-sm"
              onClick={() =>
                setModal((modal) => ({
                  ...modal,
                  viewFileModal: {
                    ...modal.viewFileModal,
                    show: true,
                  },
                }))
              }
            >
              {t("Upload Image")}
            </button>
          </div>
          <div className="col-sm-2 d-flex">
            <div className="col-sm-4" style={{ paddingRight: "0" }}>
              <SelectBox
                name="Title"
                id="Title"
                selectedValue={data?.PatientData?.Title}
                options={[...(data?.optData?.titleOpt ?? [])]}
                onChange={handleChange}
                isDisabled={mobiledata}
                lable="Title"
              />
            </div>
            <div className="col-sm-8" style={{ paddingLeft: "0" }}>
              <Input
                name="PName"
                type="text"
                max="35"
                value={data?.PatientData?.PName}
                onChange={handleChange}
                onBlur={() => {
                  handleBlur("PName");
                }}
                disabled={mobiledata}
                lable="Patient Name"
              />
            </div>
            {data?.PatientData?.PName === "" && (
              <div className="error-message">{errors?.PName}</div>
            )}
            {data?.PatientData?.PName !== "" &&
              data?.PatientData?.PName.length <= 4 && (
                <div className="error-message">{errors?.PNamelength}</div>
              )}
          </div>
          <div className="col-sm-2 d-flex align-items-center">
            <div className="row">
              <div className="col-sm-4">
                <Input
                  name="AgeYear"
                  id="AgeYear"
                  placeholder=""
                  type="number"
                  onInput={(e) => number(e, 3, 120)}
                  onChange={handleChange}
                  value={data?.PatientData?.AgeYear}
                  disabled={
                    data?.PatientData?.RadioDefaultSelect === "DOB"
                      ? true
                      : data?.PatientData?.AgeMonth === ""
                        ? false
                        : true
                  }
                  lable="Years"
                />
              </div>
              <div className="col-sm-4">
                <Input
                  name="AgeMonth"
                  id="AgeMonth"
                  placeholder=""
                  type="number"
                  onInput={(e) => number(e, 2, 12)}
                  onChange={handleChange}
                  value={data?.PatientData?.AgeMonth}
                  disabled={
                    data?.PatientData?.RadioDefaultSelect === "DOB"
                      ? true
                      : data?.PatientData?.AgeYear === ""
                        ? true
                        : data?.PatientData?.AgeDays === ""
                          ? false
                          : true
                  }
                  lable="Months"
                />
              </div>
              <div className="col-sm-4">
                <Input
                  name="AgeDays"
                  id="AgeDays"
                  placeholder=""
                  type="number"
                  onInput={(e) => number(e, 2, 31)}
                  onChange={handleChange}
                  value={data?.PatientData?.AgeDays}
                  disabled={
                    data?.PatientData?.RadioDefaultSelect === "DOB"
                      ? true
                      : data?.PatientData?.AgeMonth
                        ? false
                        : true
                  }
                  lable="Days"
                />
              </div>
            </div>
          </div>
          <div className="col-sm-2 d-flex align-items-center">
            <DatePicker
              className="custom-calendar"
              name="DOB"
              id="DOB"
              disabled={
                data?.PatientData?.RadioDefaultSelect === "Age" ? true : false
              }
              value={
                data?.PatientData?.DOB ? new Date(data?.PatientData?.DOB) : ""
              }
              maxDate={new Date()}
              onChange={dateSelect}
              lable={t("DOB")}
            />
            {data?.PatientData?.DOB === "" && (
              <div className="error-message">{errors?.DOB}</div>
            )}
          </div>
          <div className="col-sm-1">
            <SelectBox
              name="Gender"
              id="Gender"
              placeholder=""
              isDisabled={
                data?.PatientData?.Title === "" ||
                data?.PatientData?.Title === "Baby"
                  ? false
                  : true
              }
              selectedValue={data?.PatientData?.Gender}
              options={[...(data?.optData?.genderOpt ?? [])]}
              onChange={handleChange}
              lable="Gender"
            />
          </div>
        </div>
      </Accordion>
      {data?.DependentData && data?.DependentData.length > 0 && (
        <Accordion title={t("Dependent Member")} defaultValue={true}>
          <div className="row px-2">
            <div className="col-12">
              <Tables>
                <thead>
                  <tr>
                    <th>{t("S.No.")}</th>
                    <th>{t("Mobile No.")}</th>
                    <th>{t("UHID")}</th>
                    <th>{t("Patient Name")}</th>
                    <th></th>
                    <th>{t("Age")}</th>
                    <th></th>
                    <th>{t("DOB")}</th>
                    <th>{t("Gender")}</th>
                    <th>{t("Relation")}</th>
                    <th>{t("Photo")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.DependentData &&
                    data?.DependentData.map((ele, ind) => {
                      return (
                        <>
                          {ele?.UploadModal && (
                            <UploadFile
                              docType="image"
                              show={ele.UploadModal}
                              pageName={"MembershipCardIssue"}
                              documentId={ele?.base64PatientProfilePic}
                              handleClose={() => {
                                let updatedData = { ...ele };
                                updatedData.UploadModal = false;
                                setData((data) => ({
                                  ...data,
                                  DependentData: data.DependentData.map(
                                    (item, index) =>
                                      index === ind ? updatedData : item
                                  ),
                                }));
                              }}
                            />
                          )}
                          <tr>
                            <td style={{ width: "10px" }}>{ind + 1}.</td>
                            <td>
                              <Input
                                name="Mobile"
                                type="number"
                                disabled={isObjectPresentWithIndexAndData(
                                  depMobiledata,
                                  ind
                                )}
                                onInput={(e) => number(e, 10)}
                                onChange={(e) => handleDataChange(e, ele, ind)}
                                onKeyDown={(e) =>
                                  handlePatientData(e, "depPatient", ind)
                                }
                                value={ele?.Mobile}
                              />
                            </td>
                            <td>
                              <Input
                                name="PatientCode"
                                onChange={(e) => handleDataChange(e, ele, ind)}
                                value={ele?.PatientCode}
                                disabled={true}
                              />
                            </td>
                            <td>
                              <div
                                className="row d-flex"
                                style={{
                                  margin: "0",
                                  padding: "0",
                                  alignItems: "center",
                                }}
                              >
                                <div
                                  className="col-sm-4"
                                  style={{ paddingRight: "0" }}
                                >
                                  <SelectBox
                                    name="Title"
                                    selectedValue={ele?.Title}
                                    options={[
                                      ...(data?.optData?.titleOpt ?? []),
                                    ]}
                                    onChange={(e) =>
                                      handleDataChange(e, ele, ind)
                                    }
                                    isDisabled={isObjectPresentWithIndexAndData(
                                      depMobiledata,
                                      ind
                                    )}
                                  />
                                </div>
                                <div className="col-sm-8">
                                  <Input
                                    name="PName"
                                    type="text"
                                    max="35"
                                    disabled={isObjectPresentWithIndexAndData(
                                      depMobiledata,
                                      ind
                                    )}
                                    onChange={(e) =>
                                      handleDataChange(e, ele, ind)
                                    }
                                    value={ele?.PName}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pl-2" style={{ width: "25px" }}>
                              <input
                                type="radio"
                                name={`RadioDefaultSelect${ind}`}
                                value={`Age`}
                                checked={
                                  ele[`RadioDefaultSelect${ind}`] === "Age"
                                    ? true
                                    : false
                                }
                                onChange={(e) => handleDataChange(e, ele, ind)}
                              />
                            </td>
                            <td>
                              <div
                                className="row"
                                style={{ margin: "0", padding: "0" }}
                              >
                                <div className="col-sm-4">
                                  <Input
                                    name="AgeYear"
                                    type="number"
                                    onInput={(e) => number(e, 3, 120)}
                                    onChange={(e) =>
                                      handleDataChange(e, ele, ind)
                                    }
                                    value={ele?.AgeYear}
                                    disabled={
                                      ele[`RadioDefaultSelect${ind}`] === "DOB"
                                        ? true
                                        : ele?.AgeMonth === ""
                                          ? false
                                          : true
                                    }
                                    placeholder=""
                                    lable="Years"
                                  />
                                </div>
                                <div className="col-sm-4">
                                  <Input
                                    name="AgeMonth"
                                    type="number"
                                    onInput={(e) => number(e, 2, 12)}
                                    onChange={(e) =>
                                      handleDataChange(e, ele, ind)
                                    }
                                    value={ele?.AgeMonth}
                                    disabled={
                                      ele[`RadioDefaultSelect${ind}`] === "DOB"
                                        ? true
                                        : ele?.AgeYear === ""
                                          ? true
                                          : ele?.AgeDays === ""
                                            ? false
                                            : true
                                    }
                                    placeholder=""
                                    lable="Months"
                                  />
                                </div>
                                <div className="col-sm-4">
                                  <Input
                                    name="AgeDays"
                                    type="number"
                                    onInput={(e) => number(e, 2, 31)}
                                    onChange={(e) =>
                                      handleDataChange(e, ele, ind)
                                    }
                                    value={ele?.AgeDays}
                                    disabled={
                                      ele[`RadioDefaultSelect${ind}`] === "DOB"
                                        ? true
                                        : ele?.AgeMonth
                                          ? false
                                          : true
                                    }
                                    placeholder=""
                                    lable="Days"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="pl-2" style={{ width: "25px" }}>
                              <input
                                type="radio"
                                name={`RadioDefaultSelect${ind}`}
                                value={`DOB`}
                                checked={
                                  ele[`RadioDefaultSelect${ind}`] === "DOB"
                                    ? true
                                    : false
                                }
                                onChange={(e) => handleDataChange(e, ele, ind)}
                              />
                            </td>
                            <td>
                              <DatePicker
                                name="DOB"
                                maxDate={new Date()}
                                isDisabled={isObjectPresentWithIndexAndData(
                                  depMobiledata,
                                  ind
                                )}
                                date={ele?.DOB !== "" ? new Date(ele?.DOB) : ""}
                                onChange={(value, name) =>
                                  depDateSelect(value, name, ele, ind)
                                }
                                disabled={
                                  ele[`RadioDefaultSelect${ind}`] === "Age"
                                    ? true
                                    : false
                                }
                              />
                            </td>
                            <td>
                              <SelectBox
                                name="Gender"
                                options={[...(data?.optData?.genderOpt ?? [])]}
                                onChange={(e) => handleDataChange(e, ele, ind)}
                                selectedValue={ele?.Gender}
                                isDisabled={
                                  ele?.Title === "" || ele?.Title === "Baby"
                                    ? false
                                    : true
                                }
                              />
                            </td>
                            <td>
                              <SelectBox
                                name="FamilyMemberRelation"
                                selectedValue={ele?.FamilyMemberRelation}
                                options={MaleData(ele?.Gender)}
                                onChange={(e) => handleDataChange(e, ele, ind)}
                              />
                            </td>
                            <td>
                              <button
                                type="Submit"
                                className="btn btn-block btn-success btn-sm"
                                onClick={() => {
                                  let updatedData = { ...ele };
                                  updatedData.UploadModal = true;
                                  setData((data) => ({
                                    ...data,
                                    DependentData: data.DependentData.map(
                                      (item, index) =>
                                        index === ind ? updatedData : item
                                    ),
                                  }));
                                }}
                              >
                                {t("Select Photo")}
                              </button>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                </tbody>
              </Tables>
            </div>
          </div>
        </Accordion>
      )}
      <Accordion title={t("Payment")} defaultValue={true}>
        <div className="row pt-2 pl-2 pr-2 mt-1">
          <div className="col-sm-7">
            <div className="row">
              <label htmlFor="Currency" className="col-sm-2">
                {t("Currency")}:
              </label>
              <div className="col-sm-3">
                <SelectBox
                  name="currency"
                  options={data?.optData?.currencyOpt}
                  selectedValue={data?.currency}
                  onChange={handleCard}
                />
              </div>
              <span className="col-sm-3">
                {Number(getAmount("balance")).toFixed(2)}
              </span>
            </div>
            <div className="row">
              <label htmlFor="Payment Mode" className="col-sm-2">
                {t("Payment Mode")}:
              </label>
            </div>
            <div className="row d-flex" style={{ flexWrap: "wrap" }}>
              <span className="col-sm-2">
                <input
                  type="checkbox"
                  name="Cash"
                  checked={data?.currOption?.Cash}
                  onChange={handleCurrencyOption}
                />
                &nbsp;{t("Cash")}
              </span>
              <span className="col-sm-2 " style={{ justifyContent: "right" }}>
                <input
                  type="checkbox"
                  name="CreditCard"
                  checked={data?.currOption?.CreditCard}
                  onChange={handleCurrencyOption}
                />
                &nbsp;{t("CreditCard")}
              </span>
              <span className="col-sm-2 " style={{ justifyContent: "right" }}>
                <input
                  type="checkbox"
                  name="DebitCard"
                  checked={data?.currOption?.DebitCard}
                  onChange={handleCurrencyOption}
                />
                &nbsp;{t("DebitCard")}
              </span>
              <span className="col-sm-2 " style={{ justifyContent: "right" }}>
                <input
                  type="checkbox"
                  name="NEFT"
                  checked={data?.currOption?.NEFT}
                  onChange={handleCurrencyOption}
                />
                &nbsp;{t("NEFT")}
              </span>
              <span className="col-sm-2 " style={{ justifyContent: "right" }}>
                <input
                  type="checkbox"
                  name="Cheque"
                  checked={data?.currOption?.Cheque}
                  onChange={handleCurrencyOption}
                />
                &nbsp;{t("Cheque")}
              </span>
              <span className="col-sm-2 " style={{ justifyContent: "right" }}>
                <input
                  type="checkbox"
                  name="MobileWallet"
                  checked={data?.currOption?.MobileWallet}
                  onChange={handleCurrencyOption}
                />
                &nbsp;{t("Wallet")}
              </span>
            </div>
            <Tables>
              <thead className="cf text-center" style={{ zIndex: 99 }}>
                <tr className="text-center">
                  <th>{t("Payment Mode")}</th>
                  <th>{t("Payment Amt.")}</th>
                  <th>{t("Currency")}</th>
                  <th>{t("Base")}</th>
                  <th>{t("Cheque/Card No.")}</th>
                  <th>{t("Cheque/Card Date")}</th>
                  <th>{t("Bank Name")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.rcdata &&
                  data?.rcdata.map((ele, ind) => {
                    return (
                      <tr>
                        <td>{ele?.PaymentMode}</td>
                        <td>
                          <Input
                            className="form-control input-sm"
                            name="Amount"
                            type="number"
                            onInput={(e) => number(e, 10)}
                            onChange={(e) => handleCashTable(e, ele, ind)}
                            value={ele?.Amount}
                          />
                        </td>
                        <td>{ele?.S_Currency}</td>
                        <td>{ele?.Currency_RoundOff}</td>
                        {ele?.PaymentMode !== "Cash" && (
                          <>
                            <td>
                              <Input
                                className="form-control input-sm"
                                name="CardNo"
                                type="number"
                                onInput={(e) => number(e, 10)}
                                onChange={(e) => handleCashTable(e, ele, ind)}
                                value={ele?.CardNo}
                              />
                            </td>
                            <td>
                              <DatePicker
                                name="CardDate"
                                value={ele?.CardDate}
                                maxDate={new Date()}
                                date={
                                  ele?.CardDate ? new Date(ele?.CardDate) : ""
                                }
                                onChange={(date, name) => {
                                  const updatedData = { ...ele };
                                  updatedData.CardDate = date;
                                  setData((data) => ({
                                    ...data,
                                    rcdata: data.rcdata.map((item, index) =>
                                      index === ind ? updatedData : item
                                    ),
                                  }));
                                }}
                              />
                            </td>
                            <td>
                              <SelectBox
                                name=""
                                options={data.optData.bankopt}
                                onChange={(e) => handleCashTable(e, ele, ind)}
                              />
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
              </tbody>
            </Tables>
          </div>
          <div className="col-sm-5">
            <div className="row">
              <label className="col-sm-3">{t("Gross Amount")}:</label>
              <div className="col-sm-3">{Number(data?.cardAmt).toFixed(2)}</div>
              <label className="col-sm-3">{t("Net Amount")}: </label>
              <div className="col-sm-3">{Number(data?.cardAmt).toFixed(2)}</div>
            </div>
            <div className="row">
              <label className="col-sm-3">{t("Paid Amount")}: </label>
              <div className="col-sm-3">
                {Number(getAmount("paid")).toFixed(2)}
              </div>
              <label className="col-sm-3">{t("Balance Amount")}: </label>
              <div className="col-sm-3">
                {Number(getAmount("balance")).toFixed(2)}
              </div>
            </div>
          </div>
          <div
            className="row d-flex mt-1 mb-1 ml-1"
            style={{ justifyContent: "center" }}
          >
            <div className="col-sm-6">
              {loading ? (
                <Loading />
              ) : (
                <button
                  type="Submit"
                  className="btn btn-block btn-success btn-sm"
                  onClick={() => handleSave()}
                >
                  {t("Save")}
                </button>
              )}
            </div>
            <div className="col-sm-6">
              <button
                type="Submit"
                className="btn btn-block btn-danger btn-sm"
                onClick={() => handleReset()}
              >
                {t("Reset")}
              </button>
            </div>
          </div>
        </div>
      </Accordion>
    </>
  );
};

export default MembershipCardIssue;
