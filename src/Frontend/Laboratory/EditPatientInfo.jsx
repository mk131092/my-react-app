import React from "react";

import { useEffect } from "react";
import { useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Heading from "../../components/UI/Heading";
import Accordion from "@app/components/UI/Accordion";
import { axiosInstance } from "../../utils/axiosInstance";
import {
  getAccessCentres,
  getAccessDataRate,
  getDoctorSuggestion,
} from "../../utils/NetworkApi/commonApi";
import PatientRegisterModal from "../utils/PatientRegisterModal";
import { PatientRegisterSchema } from "../../utils/Schema";
import Input from "../../components/formComponent/Input";
import {
  autocompleteOnBlur,
  getTrimmedData,
  number,
  selectedValueCheck,
} from "../../utils/helpers";
import DatePicker from "../../components/formComponent/DatePicker";
import { SelectBox } from "../../components/formComponent/SelectBox";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";
import Loading from "../../components/loader/Loading";
import Tooltip from "../../components/formComponent/Tooltip";
const EditPatientInfo = () => {
  const location = useLocation();
  const [show, setShow] = useState({
    show: false,
    Type: "",
  });
  const [t] = useTranslation();
  const [CentreData, setCentreData] = useState([]);
  const [load, setLoad] = useState(false);
  const [RateType, setRateType] = useState([]);
  const [state, setState] = useState({});
  const [visibleFields, setVisibleFields] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [LabNo, setLabNo] = useState("");
  const [Gender, setGender] = useState([]);
  const [indexMatch, setIndexMatch] = useState(0);
  const [Title, setTitle] = useState([]);
  const [formData, setFormData] = useState({
    DoctorName: "",
  });
  const [DefaultDoc, setDefaultDoc] = useState("");
  const [DateData, setDateData] = useState({
    AgeYear: "",
    AgeMonth: "",
    AgeDays: "",
  });
  const [searchForm, setSearchForm] = useState({
    TestName: "",
    CentreID: "",
    InvestigationID: "",
  });
  const [dropFalse, setDropFalse] = useState(true);
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

  const handleSelectNew = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  const navigate = useNavigate();
  const handleListSearch = (data, name) => {
    switch (name) {
      case "TestName":
        setSearchForm({
          ...searchForm,
          TestName: "",
          InvestigationID: data.InvestigationID,
        });
        setIndexMatch(0);
        setSuggestion([]);
        break;
      case "DoctorName":
        setFormData({ ...formData, [name]: data.Name });
        setState({
          ...state,
          [name]: data.Name,
          DoctorID: data.DoctorReferalID,
          ReferLabId: data.DoctorReferalID,
          ReferLabName: data.Name,
        });
        setIndexMatch(0);
        setDoctorSuggestion([]);
        setDropFalse(false);
        break;
      default:
        break;
    }
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;

    if (name === "PatientIDProof") {
      setState({ ...state, [name]: value });
    }

    if (name === "VisitType") {
      setState({ ...state, [name]: value });
      fetchFields(event.value);
    }

    if (name === "ReportDeliveryMethodId") {
      setState({ ...state, [name]: value });
    }

    if (name === "DiscountApprovedBy") {
      setState({ ...state, [name]: value });
    }

    if (name === "DiscountReason") {
      setState({ ...state, [name]: value });
    }

    if (name === "CollectionBoyId") {
      setState({ ...state, [name]: value });
    }
    if (name === "Gender") {
      setState({ ...state, [name]: value });
    }
  };

  const findGender = () => {
    const male = ["Mr.", "Baba", "Dr.(Mr)", "Master"];
    const female = [
      "Miss.",
      "Mrs.",
      "Baby",
      "Dr.(Miss)",
      "Dr.(Mrs)",
      "Ms.",
      "SMT.",
    ];
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

  const handlePName = (data) => {
    const { FirstName, MiddleName, LastName } = data;
    return `${FirstName} ${MiddleName} ${LastName}`;
  };
  const DynamicFieldValidations = () => {
    const data = visibleFields.map((ele) => {
      if (
        ele["IsMandatory"] == 1 &&
        ele["IsVisible"] == 1 &&
        state[ele["FieldType"]] === ""
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

  const { errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: state,
    enableReinitialize: true,
    validationSchema: PatientRegisterSchema,
    onSubmit: (values) => {
      const data = DynamicFieldValidations();
      setVisibleFields(data);
      const flag = data.filter((ele) => ele?.isError === true);
      console.log(values);
      if (flag.length === 0) {
        setLoad(true);
        axiosInstance
          .post("Demographic/RegistrationEditData", {
            PatientData: getTrimmedData({
              ...values,
              PName: handlePName(values),
              PinCode: values?.PinCode ?? "",
              Age: `${values?.AgeYear == "" ? 0 : values?.AgeYear} Y ${values?.AgeMonth == "" ? 0 : values?.AgeMonth} M ${values?.AgeDays == "" ? 0 : values?.AgeDays} D`,
              AgeDays: values?.AgeDays == "" ? "0" : values?.AgeDays,
              AgeMonth: values?.AgeMonth == "" ? "0" : values?.AgeMonth,
              AgeYear: values?.AgeYear == "" ? "0" : values?.AgeYear,
            }),
          })

          .then((res) => {
            setLoad(false);
            toast.success(res?.data?.message);
            navigate("/receiptreprint");
          })
          .catch((err) => {
            setLoad(false);
            toast.error("Something Went Wrong");
          });
      }
    },
  });
  const getSubtractType = (name) => {
    return name === "AgeYear"
      ? "years"
      : name === "AgeMonth"
        ? "months"
        : "days";
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
    console.log(diff);
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

  const handleMainChange = (e) => {
    const { name, value, type, checked } = e.target;

    setState({
      ...state,
      [name]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : ["FirstName", "MiddleName", "LastName"].includes(name)
            ? value.toUpperCase()
            : value,
    });
  };

  const handleLTData = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
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
  console.log(DateData);
  const EditPatientDetail = (LabNo) => {
    setLoad(true);
    axiosInstance
      .post("Demographic/getDataEditByLabNo", {
        LabNo: LabNo,
      })
      .then((res) => {
        if (res?.data?.message?.patientDetail.length > 0) {
          setState({
            ...res?.data?.message?.patientDetail[0],
            DOB: new Date(res?.data?.message?.patientDetail[0]?.DOB),
            BTB: res?.data?.message?.patientDetail[0]?.BTB,
            AgeYear: res?.data?.message?.patientDetail[0]?.AgeYear?.toString(),
            AgeDays: res?.data?.message?.patientDetail[0]?.AgeDays?.toString(),
            AgeMonth:
              res?.data?.message?.patientDetail[0]?.AgeMonth?.toString(),
            DOB: new Date(res?.data?.message?.patientDetail[0]?.DOB),
          });
          setDefaultDoc(res?.data?.message?.patientDetail[0].DoctorName);
        }
        setDateData({
          AgeYear: moment().subtract(
            res?.data?.message?.patientDetail[0]?.AgeYear?.toString(),
            "years"
          )?._d,
          AgeDays: moment(
            moment().subtract(
              res?.data?.message?.patientDetail[0]?.AgeMonth?.toString(),
              "years"
            )?._d
          ).subtract(
            res?.data?.message?.patientDetail[0]?.AgeDays?.toString(),
            "days"
          )?._d,
          AgeMonth: moment(
            moment().subtract(
              res?.data?.message?.patientDetail[0]?.AgeYear?.toString(),
              "years"
            )?._d
          ).subtract(
            res?.data?.message?.patientDetail[0]?.AgeMonth?.toString(),
            "months"
          )?._d,
        });
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
        console.log(err);
      });
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

            break;
          default:
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getDoctorSuggestion(formData, setDoctorSuggestion, setFormData);
  }, [formData?.DoctorName]);
  useEffect(() => {
    state?.CentreID && getAccessDataRate(setRateType, state?.CentreID);
  }, [state?.CentreID]);
  console.log(state, DateData);
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
            handleListSearch(suggestion[indexMatch], name);
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

  useEffect(() => {
    if (location?.state?.data) {
      setLabNo(location?.state?.data);
      EditPatientDetail(location?.state?.data);
    }
  }, []);
  useEffect(() => {
    getAccessCentres(setCentreData);
    getDropDownData("Gender");
    getDropDownData("Title");
    getDropDownData("Identity");
    getDropDownData("PaymentMode");
    getDropDownData("BankName");
  }, []);

  return (
    <>
      {show?.show && (
        <PatientRegisterModal
          show={show?.show}
          handleClose={handleClose}
          Type={show?.Type}
        />
      )}
      <Heading name={t("Edit Patient Info")} isBreadcrumb={true}></Heading>
      <Accordion title={t("Visit Number")} defaultValue={true}>
        <div className="row pt-2 pl-1 pr-1">
          <div className="col-sm-2 col-6">
            <Input
              disabled={true}
              name="LabNo"
              lable="Lab Number"
              id="LabNo"
              placeholder=" "
              type="text"
              value={LabNo}
              onChange={(e) => setLabNo(e.target.value)}
            />
          </div>
          <div className="col-sm-1 col-6">
            <button
              className="btn btn-success btn-block btn-sm"
              onClick={() => EditPatientDetail(LabNo)}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </Accordion>
      <Accordion title={t("Demographic Details")} defaultValue={true}>
        {load ? (
          <Loading />
        ) : (
          <>
            <div className="row pt-2 pl-1 pr-1">
              <div className="col-sm-2 col-6">
                <SelectBox
                  options={CentreData}
                  name="CentreID"
                  lable="Centre"
                  selectedValue={state?.CentreID}
                  onChange={handleSelectChange}
                  isDisabled
                />
              </div>

              <div className="col-sm-2 col-6">
                <SelectBox
                  options={RateType}
                  selectedValue={selectedValueCheck(RateType, state?.RateID)}
                  name="RateID"
                  lable="RateType"
                  onChange={handleSelectChange}
                  isDisabled
                />
              </div>

              <div className="col-sm-2 col-6">
                <Input
                  name="Mobile"
                  type="number"
                  required
                  onInput={(e) => number(e, 10)}
                  value={state.Mobile}
                  lable="Mobile Number"
                  placeholder=" "
                  onBlur={handleBlur}
                  onChange={handleMainChange}
                  min={10}
                />
              </div>

              <div className="col-sm-2 col-6">
                <div className="p-inputgroup d-flex">
                  <div style={{ width: "87%" }}>
                    {" "}
                    <Input
                      autoComplete="off"
                      lable="Referred Doctor"
                      name="DoctorName"
                      type="text"
                      value={DefaultDoc ? DefaultDoc : formData?.DoctorName}
                      onChange={(e) => {
                        if (e.target.value == "") {
                          console.log(e.target.value);
                          setFormData({
                            ...formData,
                            DoctorName: "",
                            DoctorID: "",
                          });
                        } else {
                          setFormData({
                            ...formData,
                            DoctorName: e?.target?.value,
                          });
                        }
                        setState({ ...state, DoctorID: "", DoctorName: "" });
                        setDefaultDoc("");
                        setDropFalse(true);
                      }}
                      onBlur={(e) => {
                        autocompleteOnBlur(setDoctorSuggestion);
                        setTimeout(() => {
                          const data = doctorSuggestion.filter(
                            (ele) => ele?.Name === e?.target?.value
                          );
                          if (data.length === 0) {
                            setFormData({ ...formData, DoctorName: "" });
                          }
                        }, 500);
                      }}
                      onKeyDown={handleIndex}
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
                  </div>{" "}
                  <div style={{ width: "10%" }}>
                    <Tooltip label={t("Add Referred Doctor")}>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => handleShow("Refer")}
                      >
                        {" "}
                        <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
                      </button>
                    </Tooltip>
                  </div>{" "}
                </div>
                <div>
                  {(errors?.DoctorID || errors?.DoctorName) &&
                    (touched?.DoctorID || touched?.DoctorName) && (
                      <div className="error-message">
                        {errors?.DoctorID || errors?.DoctorName}
                      </div>
                    )}
                </div>
              </div>
              <div className="col-sm-2 col-6">
                <div className="d-flex">
                  <div style={{ width: "50%" }}>
                    <SelectBox
                      options={Title}
                      name="Title"
                      lable="Title"
                      selectedValue={state?.Title}
                      onChange={handleSelectNew}
                    />
                  </div>
                  <div style={{ width: "50%" }}>
                    <Input
                      lable="First Name"
                      name="FirstName"
                      type="text"
                      placeholder=" "
                      max={35}
                      value={state?.FirstName}
                      onChange={handleMainChange}
                      onBlur={handleBlur}
                    />

                    {errors?.FirstName && touched?.FirstName && (
                      <div className="error-message">{errors?.FirstName}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-sm-2  col-6">
                <Input
                  className="select-input-box form-control input-sm"
                  id="MidName"
                  name="MiddleName"
                  lable="Middle Name"
                  placeholder=" "
                  type="text"
                  value={state?.MiddleName}
                  max={35}
                  onChange={handleMainChange}
                />
              </div>
            </div>
            <div className="row pt-1 pl-1 pr-1">
              <div className="col-sm-2  col-6">
                <Input
                  id="LastName"
                  max={50}
                  lable="Last Name"
                  name="LastName"
                  placeholder=" "
                  type="text"
                  value={state?.LastName}
                  onChange={handleMainChange}
                />
              </div>

              <div className="col-sm-2 col-6">
                <SelectBox
                  options={Gender}
                  id="Gender"
                  lable="Gender"
                  isDisabled={
                    [
                      "Baby",
                      "Baby of",
                      "Baby Of",
                      "BabyOf",
                      "Babyof",
                      "Master",
                      "B/O",
                      "C/O",
                      "S/O",
                      "Dr.",
                      "Baby of.",
                    ].includes(state?.Title)
                      ? false
                      : state?.Title || state?.Title == ""
                        ? true
                        : false
                  }
                  name="Gender"
                  selectedValue={state?.Gender}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-sm-2 col-6">
                <div>
                  <DatePicker
                    name="DOB"
                    className="custom-calendar"
                    value={state?.DOB}
                    onBlur={handleBlur}
                    onChange={dateSelect}
                    id="DOB"
                    lable="DOB"
                    maxDate={new Date()}
                  />
                  {errors?.DOB && touched?.DOB && (
                    <div className="error-message">{errors?.DOB}</div>
                  )}
                </div>
              </div>

              <div className="col-sm-2 col-6">
                <div className="p-inputgroup flex-1">
                  <Input
                    placeholder=" "
                    type="text"
                    id="Y"
                    name="AgeYear"
                    value={state?.AgeYear}
                    onInput={(e) => number(e, 3, 120)}
                    onChange={handleDOBCalculation}
                  />

                  <Input
                    placeholder=" "
                    type="text"
                    id="M"
                    name="AgeMonth"
                    value={state?.AgeMonth}
                    onInput={(e) => number(e, 2, 12)}
                    onChange={handleDOBCalculation}
                  />

                  <Input
                    placeholder=" "
                    type="text"
                    id="D"
                    name="AgeDays"
                    value={state?.AgeDays}
                    onInput={(e) => number(e, 2, 31)}
                    onChange={handleDOBCalculation}
                  />
                </div>
              </div>

              <div className="col-sm-2 col-6">
                <Input
                  className="form-control input-sm"
                  id="Email"
                  lable="Email"
                  name="Email"
                  placeholder=" "
                  type="email"
                  required
                  value={state?.Email}
                  onChange={handleMainChange}
                />

                {errors?.Email && touched?.Email && (
                  <div className="error-message">{errors?.Email}</div>
                )}
              </div>
              <div className="col-sm-2  col-6 ">
                <Input
                  className="form-control input-sm"
                  id="UHID"
                  lable="UHID"
                  placeholder=" "
                  max={15}
                  disabled
                  value={state?.PatientCode}
                  name="UHID"
                  type="text"
                />
              </div>
            </div>
            <div className="row pt-1 pl-1 pr-1">
              <div className="col-sm-2 col-6">
                <Input
                  lable="Address"
                  type="text"
                  name="HouseNo"
                  max={100}
                  placeholder=" "
                  id="Address"
                  value={state?.HouseNo}
                  onChange={handleMainChange}
                />
              </div>

              <div className="col-sm-2 col-6">
                <Input
                  lable="Pincode"
                  type="number"
                  name="PinCode"
                  placeholder=" "
                  onInput={(e) => number(e, 6)}
                  id="PinCode"
                  value={state?.PinCode}
                  onChange={handleMainChange}
                />
              </div>

              <div className="col-sm-2 col-6">
                <Input
                  max={30}
                  type="text"
                  value={state?.City}
                  onChange={handleMainChange}
                  lable="City"
                  name="City"
                  placeholder=" "
                  id="City"
                />
              </div>

              <div className="col-sm-2 col-6">
                <Input
                  type="text"
                  lable="State"
                  name="State"
                  placeholder=" "
                  id="State"
                  max={30}
                  value={state?.State}
                  onChange={handleMainChange}
                />
              </div>
              <div className="col-sm-2 col-6">
                <Input
                  max={30}
                  value={state?.Country}
                  type="text"
                  onChange={handleMainChange}
                  lable="Country"
                  name="Country"
                  placeholder=" "
                  id="Country"
                />
              </div>
              <div className="col-sm-1 col-3">
                <button
                  type="submit"
                  id="btnSave"
                  className="btn btn-success btn-sm btn-block"
                  onClick={handleSubmit}
                >
                  {""} {t("Update")}
                </button>
              </div>
              <div className="col-md-1 col-3">
                {/* <Link
                  to={`/receiptreprint`}
                  state={{ mainList: true}}
                >
                  {t("Main List")}
                </Link> */}
                <button
                  type="submit"
                  id="btnSave"
                  className="btn btn-success w-100 btn-sm"
                  onClick={() => {
                  navigate("/receiptreprint");
                    // navigate("/receiptreprint", { state: { mainList: true } });
                  }}
                >
                  {"MainList"}
                </button>
              </div>
            </div>
          </>
        )}
      </Accordion>
    </>
  );
};

export default EditPatientInfo;
