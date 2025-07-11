import React, { useEffect, useMemo, useState } from "react";
import Accordion from "@app/components/UI/Accordion";
import Input from "../../components/formComponent/Input";
import { autocompleteOnBlur, number } from "../../utils/helpers";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../components/formComponent/ReactSelect";
import { axiosInstance } from "../../utils/axiosInstance";
import { SelectBox } from "../../components/formComponent/SelectBox";
import { LTDataIniti, stateIniti } from "../../utils/Constants";
import DatePicker from "../../components/formComponent/DatePicker";
import moment from "moment";
import Tables from "../../components/UI/customTable";
import RegisterationTable from "../Table/RegisterationTable";
import { getBindDiscApproval } from "../../utils/NetworkApi/commonApi";
import { toast } from "react-toastify";
import { EstimateBillValidationSchema } from "../../utils/Schema";

const EstimateRatenew = () => {
  const { t } = useTranslation();
  const [centreData, setCentreData] = useState([]);
  const [rateTypes, setRateTypes] = useState([]);
  const [Title, setTitle] = useState([]);
  const [Gender, setGender] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [disAmt, setdisAmt] = useState("");
  const [PaymentMode, setPaymentMode] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [BindDiscApproval, setBindDiscApproval] = useState([]);
  const [RateType, setRateType] = useState([]);
  const [errors, setErrors] = useState({});
  const [throughMemberData, setThroughmemberdata] = useState(false);
  const [indexMatch, setIndexMatch] = useState(0);
  const [BarcodeLogic, setBarcodeLogic] = useState(0);
  const [LTData, setLTData] = useState(LTDataIniti);
  const [searchTest, setSearchTest] = useState("TestName");
  const [state, setState] = useState(stateIniti);
  const [formData, setFormData] = useState({
    DoctorName: "Self",
    SecondReferDoctor: "",
  });
  const [slotOpen, setSlotOpen] = useState({
    show: false,
    data: "",
  });
  const [DateData, setDateData] = useState({
    AgeYear: "",
    AgeDays: "",
    AgeMonth: "",
  });
  const [coupon, setCoupon] = useState({
    code: "",
    field: false,
    load: false,
  });
  const [RcData, setRcData] = useState([
    {
      PayBy: "Patient",
      ReceiptNo: "",
      ledgerNoCr: "",
      RateTypeId: LTData?.RateTypeID,
      PaymentMode: "Cash",
      PaymentModeID: 134,
      Amount: "",
      BankName: "",
      CardDate: "",
      CardNo: "",
      CentreID: LTData?.CentreID,
    },
  ]);
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
  // const [LTData, setLTData] = useState({
  //   Title: "",
  //   PName: "",
  //   Mobile: "",
  //   Gender: "",
  //   Address: "",
  //   IsDOBActual: "",
  //   Age: "",
  //   AgeYear: "",
  //   AgeMonth: "",
  //   AgeDays: "",
  //   TotalAgeInDays: "",
  //   DOB: "",
  //   Email: "",
  //   RateTypeID: "",
  //   CentreID: "",
  //   ItemId: "",
  //   ItemName: "",
  //   Rate: "",
  //   DiscAmt: "",
  //   Amount: "",
  //   IsPackage: "",
  //   DeliveryDate: "",
  //   DepartmentID: "",
  // });

  const getSuggestion = (value) => {
    if (!state?.DOB) {
      toast.error("Please choose DOB || Age");
    } else {
      if (LTData?.CentreID) {
        if (value.length >= 2) {
          axiosInstance
            .post("TestData/BindBillingTestData", {
              TestName: value,
              CentreID: LTData?.RateTypeID,
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

  const findGender = () => {
    const male = ["Mr.", "Baba", "Dr.(Mr)", "Master"];
    const female = ["Miss.", "Mrs.", "Baby", "Dr.(Miss)", "Dr.(Mrs)", "Ms.","SMT."];
    const other = [""];
    if (male.includes(state?.Title)) {
      setState({ ...state, Gender: "Male" });
    }

    if (female.includes(state?.Title)) {
      setState({ ...state, Gender: "Female" });
    }
    if (other.includes(state?.Title)) {
      setState({ ...state, Gender: "Other" });
    }
  };

  useEffect(() => {
    findGender();
  }, [state?.Title]);

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

  const debouce = handleDeboucing(getSuggestion);

  const handleSearchSuggest = (event) => {
    const { value } = event.target;
    debouce(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "Title") {
      setState((prevState) => ({
        ...prevState,
        Title: value,
        Gender: value === "Baby" ? "" : prevState.Gender,
      }));
    }
    if (name === "Gender") {
      setState({
        ...state,
        [name]: value,
      });
    } else {
      setLTData((prevLTData) => ({
        ...prevLTData,
        [name]: value,
      }));
    }
  };

  const handleSearchSelectChange = (label, value) => {
    const selectedValue = value?.value;
    setLTData({
      ...LTData,
      [label]: selectedValue,
    });

    if (label === "CentreID") {
      fetchRateTypes(selectedValue);
    }
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
  };

  const getSubtractType = (name) => {
    return name === "AgeYear"
      ? "years"
      : name === "AgeMonth"
        ? "months"
        : "days";
  };

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
    }
  };

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

  const fetchRateTypes = async (id, flag) => {
    try {
      const res = await axiosInstance.post("Centre/GetRateType", {
        CentreId: [id],
      });
      const list = res?.data?.message.map((item) => ({
        label: item?.RateTypeName,
        value: item?.RateTypeID,
      }));

      flag
        ? setLTData({
            ...LTDataIniti,
            CentreID: id,
            RateTypeID: list[0]?.value ?? "",
          })
        : setLTData({
            ...LTData,
            CentreID: id,
            RateTypeID: list[0]?.value ?? "",
          });
      setRateTypes(list);
    } catch (err) {
      flag
        ? setLTData({
            ...LTDataIniti,
            CentreID: id,
            RateTypeID: "",
          })
        : setLTData({
            ...LTData,
            CentreID: id,
            RateTypeID: "",
          });
      console.log(err);
    }
  };

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

  const getAccessCentres = (flag) => {
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
        fetchRateTypes(allValues[0], flag);
      })
      .catch((err) => console.log(err));
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
  const handleRateTypePaymode = useMemo(() => {
    const data = RateType.find((ele) => ele?.value == LTData?.RateTypeID);
    return data?.PayMode;
  }, [LTData?.RateTypeID, RateType]);
  const getTableData = (data, key, Promo) => {
    const ItemIndex = tableData.findIndex(
      (e) => e.InvestigationID == data.InvestigationID
    );

    if (ItemIndex === -1) {
      axiosInstance
        .post("TestData/BindSingleTestData", {
          InvestigationID: data.InvestigationID,
          CentreID: data?.CentreID,
          CentreIdNew: LTData?.CentreID,
          FamilyMemberIsPrimary: 0,
          PatientCode: 0,
          MembershipCardID: 0,
          SetMRP: LTData?.SetMRP,
          IsPromotional: Promo ? 1 : 0,
          PromotionalID: data?.PromotionalID ? data?.PromotionalID : 0,
        })
        .then((res) => {
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
            }
            setTableData([
              ...tableData,
              {
                ...res?.data?.message[0],
                Discount: data?.Discount
                  ? (
                      (Number(res?.data?.message[0].Rate) * data?.Discount) /
                      100
                    ).toFixed(2)
                  : Number(res?.data?.message[0].DiscAmt) == 0
                    ? ""
                    : Number(res?.data?.message[0].DiscAmt),
                Rate: Number(res?.data?.message[0].Rate).toFixed(2),
                NetAmount: data?.Discount
                  ? (
                      res?.data?.message[0].Rate -
                      (Number(res?.data?.message[0].Rate) * data?.Discount) /
                        100
                    ).toFixed(2)
                  : Number(res?.data?.message[0].Amount).toFixed(2),
                IsSampleCollected: "N",
                Status: 1,
                IsUrgent: 0,
                UrgentDateTime: "",
                BarcodeNo: "",
                isLabOutSource: res?.data?.message[0]?.isLabOutSource,
                IsCulture: res?.data?.message[0]?.IsCulture,
                IsConcern: res?.data?.message[0]?.IsConcern,
                IsPndtForm: res?.data?.message[0]?.IsPndtForm,
                UrgentdeleiveryDate: res?.data?.message[0]?.UrgentdeleiveryDate,
                DeliveryDate: res?.data?.message[0]?.deliveryDate,
              },
            ]);
          } else {
            !genderCheck &&
              toast.error("This Test is Not for " + state?.Gender);
            !ageCheck && toast.error(message);
          }
        })
        .catch((err) => console.log(err));
    } else {
      toast.error("Duplicate Test Found");
    }
  };

  const getPackageSuggestions = (data) => {
    const LTData = [];

    data.forEach((obj) => {
      LTData.push(obj.InvestigationID);
    });
    axiosInstance
      .post("TestData/BindPackage", {
        InvestigationID: LTData,
        CentreID: LTData?.RateTypeId,
      })
      .then((res) => {
        let data = res?.data?.message;
        setSuggestionData((ele) => ({
          ...ele,
          show: true,
          packageSuggestions: {
            ...suggestionData.packageSuggestions,
            data: data,
            show: true,
          },
        }));
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
      });
  };

  const handleFilter = (data) => {
    const value = tableData.filter(
      (ele) => ele.InvestigationID !== data.InvestigationID
    );
    setTableData(value);
    getPackageSuggestions(value);
    toast.success("successfully Removed");
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

  const handleListSearch = (data, name, Promo) => {
    switch (name) {
      case "TestName":
        document.getElementById("testSearch").value = "";
        setIndexMatch(0);
        setSuggestion([]);

        getTableData(data, "test", Promo);
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

  const findMRPAndRateEstimate = () => {
    let MRP = 0;
    let Rate = 0;
    for (let i = 0; i < tableData?.length; i++) {
      MRP = MRP + Number(tableData[i]["Rate"]);
      Rate = Rate + Number(tableData[i]["NetAmount"]);
    }
    return { MRP, Rate };
  };

  console.log(handleRateTypePaymode, LTData?.DiscountApprovedBy);

  const handleSubmit = () => {
    const generatedError = EstimateBillValidationSchema(
      LTData,
      state,
      tableData
    );
    console.log(generatedError);
    if (Object.keys(generatedError).length === 0) {
      const Items = tableData.map((row) => {
        const amount = row?.Rate - row?.Discount;
        return {
          ItemId: row?.TestCode.toString(),
          ItemName: row?.TestName,
          Rate: row?.Rate,
          DiscAmt: row?.Discount == "" ? 0 : Number(row?.Discount),
          Amount: amount,
          IsPackage: "0",
          DeliveryDate: row?.DeliveryDate,
          DepartmentID: row?.DepartmentID.toString(),
        };
      });

      axiosInstance
        .post("Estimatebilldetail/SaveEstimateBillDetail", {
          Title: state?.Title,
          PName: LTData?.PName,
          Mobile: LTData?.Mobile,
          Gender: state?.Gender,
          Address: LTData?.HouseNo,
          IsDOBActual: 1,
          Age: state?.AgeYear === "" ? 0 : Number(state?.AgeYear),
          AgeYear: state?.AgeYear === "" ? 0 : Number(state?.AgeYear),
          AgeMonth: state?.AgeMonth === "" ? 0 : Number(state?.AgeMonth),
          AgeDays: state?.AgeDays === "" ? 0 : Number(state?.AgeDays),
          TotalAgeInDays:
            state?.TotalAgeInDays === "" ? 0 : Number(state?.TotalAgeInDays),
          DOB: moment(state?.DOB).format("YYYY-MM-DD"),
          Email: LTData?.Email,
          RateTypeID: LTData?.RateTypeID,
          CentreID: LTData?.CentreID,
          Items: Items,
        })
        .then((res) => {
          setErrors({});
          toast.success(res?.data?.message);
          resetFormFields();
          getAccessCentres(true);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
        });
    } else {
      setErrors(generatedError);
    }
  };

  const resetFormFields = () => {
    setState(stateIniti);
    setTableData([]);
  };

  useEffect(() => {
    getAccessCentres();
    getDropDownData("Gender");
    getDropDownData("Title");
    getDropDownData("Identity");
    getBindDiscApproval(setBindDiscApproval);
  }, []);

  console.log(LTData);
  console.log(state);
  console.log(tableData);

  return (
    <>
      <Accordion
        name={t("Mail Status")}
        isBreadcrumb={true}
        defaultValue={true}
      >
        <div className="row pt-2 pl-2 pr-2 mt-1">
          <div className="col-sm-2">
            <ReactSelect
              name="CentreID"
              id="CentreID"
              lable="Center"
              placeholderName={t("Center")}
              value={LTData?.CentreID}
              dynamicOptions={centreData}
              removeIsClearable={true}
              onChange={handleSearchSelectChange}
            />
          </div>
          <div className="col-sm-2">
            <ReactSelect
              name="RateTypeID"
              id="RateTypeID"
              lable="Rate Type"
              placeholderName={t("Rate Type")}
              value={LTData?.RateTypeID}
              dynamicOptions={rateTypes}
              removeIsClearable={true}
              onChange={handleSearchSelectChange}
            />
          </div>
          <div className="col-sm-2">
            <Input
              className="required-fields"
              lable={t("Mobile No")}
              name="Mobile"
              id="MobileNo"
              type="number"
              placeholder=""
              value={LTData?.Mobile}
              onChange={handleChange}
              onInput={(e) => number(e, 10)}
            />
            {LTData?.Mobile == "" && (
              <span className="error-message">{errors?.Mobile}</span>
            )}
          </div>
          <div className="col-sm-2">
            <div className="d-flex">
              <div style={{ width: "35%" }}>
                <SelectBox
                  options={Title}
                  name="Title"
                  id="Title"
                  lable="Title"
                  selectedValue={state?.Title}
                  onChange={handleChange}
                />
              </div>
              <div style={{ width: "65%" }}>
                <Input
                  className="required-fields"
                  lable={t("Patient Name")}
                  name="PName"
                  id="PatientName"
                  type="text"
                  placeholder=""
                  max={50}
                  value={LTData?.PName}
                  onChange={handleChange}
                />
                {LTData?.PName === "" && (
                  <span className="error-message">{errors?.PName}</span>
                )}
              </div>
            </div>
          </div>
          <div className="col-sm-1">
            <SelectBox
              options={Gender}
              name="Gender"
              id="Gender"
              lable="Gender"
              isDisabled={
                ["Baby","Baby of","Baby Of","BabyOf","Babyof","Master","B/O","C/O","S/O","Dr.","Baby of."].includes(state?.Title)
                  ? false
                  : state?.Title || state?.Title == ""
                    ? true
                    : false
              }
              selectedValue={state?.Gender}
              onChange={handleChange}
            />
          </div>
          <div className="col-sm-2">
            <DatePicker
              value={state?.DOB}
              className="custom-calendar"
              name="DOB"
              placeholder=" "
              id="DOB"
              lable="DOB"
              maxDate={new Date()}
              onChange={dateSelect}
            />
          </div>
          <div className="col-sm-1">
            <div className="p-inputgroup flex-1">
              <Input
                type="text"
                className="required-fields"
                placeholder="Y"
                name="AgeYear"
                value={state?.AgeYear}
                onInput={(e) => number(e, 3, 120)}
                onChange={handleDOBCalculation}
              />
              <Input
                type="text"
                placeholder="M"
                name="AgeMonth"
                className="required-fields"
                value={state?.AgeMonth}
                onInput={(e) => number(e, 2, 12)}
                onChange={handleDOBCalculation}
              />

              <Input
                placeholder="D"
                type="text"
                className="required-fields"
                name="AgeDays"
                value={state?.AgeDays}
                onInput={(e) => number(e, 2, 31)}
                onChange={handleDOBCalculation}
              />
            </div>
          </div>
        </div>
        <div className="row pl-2 pr-2">
          <div className="col-sm-2">
            <Input
              type="text"
              lable="Email"
              name="Email"
              placeholder=" "
              id="Email"
              value={LTData?.Email}
              onChange={handleChange}
            />
          </div>
          <div className="col-sm-2">
            <Input
              lable="Address"
              type="text"
              name="HouseNo"
              max={100}
              placeholder=" "
              id="Address"
              value={LTData?.HouseNo}
              onChange={handleChange}
            />
          </div>
        </div>
      </Accordion>
      <Accordion title={t("Booking Details")} defaultValue={true}>
        <div className="row d-flex pb-2">
          <div style={{ width: "50%" }} className="col-md-9 col-sm-12 col-12">
            <div className="row pt-2 pl-2 pr-2 pb-2">
              <div className="col-sm-5">
                <Input
                  name="TestName"
                  className="required-fields"
                  lable={
                    searchTest == "TestName"
                      ? "Type TestName For Add Test"
                      : "Type TestCode For Add Test"
                  }
                  type="text"
                  placeholder=" "
                  max={30}
                  id="testSearch"
                  onChange={handleSearchSuggest}
                  onBlur={() => {
                    autocompleteOnBlur(setSuggestion);
                    setTimeout(() => {
                      document.getElementById("testSearch").value = "";
                    }, 500);
                  }}
                  onKeyDown={handleIndex}
                />
                {tableData.length === 0 && (
                  <span className="error-message">{errors?.tableData}</span>
                )}
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
              <div className="col-sm-4">
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
                      By TestName
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
                      By TestCode
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="row px-2">
              <div className="col-sm-10">
                <Tables>
                  <thead>
                    <tr>
                      <th className="text-center">{"#"}</th>
                      <th>{"Slot"}</th>
                      <th>{"Code"}</th>
                      <th
                        style={{
                          wordWrap: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        {"Item"}
                      </th>
                      <th>{"View"}</th>
                      <th>{"DOS"}</th>
                      <th>{"MRP"}</th>
                      <th>{"Rate"}</th>
                      <th>{"Disc."}</th>
                      <th>{"Amt"}</th>
                      <th>{"D.Date"}</th>
                      <th>{"SC"}</th>
                      <th className="text-center">
                        {/* <Tooltip label={"Urgen Delivery"}> */}
                        <span class="blinking">
                          <i
                            className="fa fa-hourglass-start blinking"
                            style={{ color: "red" }}
                          ></i>
                        </span>
                        {/* </Tooltip> */}
                      </th>
                      <th className="text-center">
                        <i class="fa fa-trash"></i>
                      </th>
                    </tr>
                  </thead>
                  {tableData.length > 0 && (
                    <tbody>
                      {tableData.map((data, index) => (
                        <>
                          <tr
                            key={index}
                            style={{
                              backgroundColor:
                                data?.isOutSource === 1 ? "pink" : "",
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
                              coupon={false}
                              member={false}
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
              <div className="col-sm-2">
                <div className="row d-flex align-items-center justify-content-between">
                  <div className="col-md-6">
                    <Input
                      lable={t("Total MRP")}
                      name="TotlaMRP"
                      id="TotlaMRP"
                      type="number"
                      placeholder=""
                      value={findMRPAndRateEstimate().MRP}
                      disabled={true}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      lable={t("Total Rate")}
                      name="TotalRate"
                      id="TotalRate"
                      type="number"
                      placeholder=""
                      value={findMRPAndRateEstimate().Rate}
                      disabled={true}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <button
                      type="submit"
                      id="btnSave"
                      className="btn btn-block btn-success btn-sm"
                      onClick={() => {
                        handleSubmit();
                        window.scrollTo(0, 0);
                      }}
                    >
                      {"Submit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Accordion>
    </>
  );
};

export default EstimateRatenew;
