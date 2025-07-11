import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import moment from "moment";
import { PreventSpecialCharacterandNumber } from "../util/Commonservices";
import MobileDataModal from "../utils/MobileDataModal";
import Accordion from "@app/components/UI/Accordion";
import Input from "../../components/formComponent/Input";
import Tables from "../../components/UI/customTable";
import { SelectBox } from "../../components/formComponent/SelectBox";
import DatePicker from "../../components/formComponent/DatePicker";
import { number } from "../../utils/helpers";

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

const cardDetailsConst = {
  MembershipCardAmount: "",
  MembershipCardDependent: "",
  ValidTo: "",
  MembershipCardName: "",
};

const dependentConst = {
  Title: "Mr.",
  PName: "",
  DOB: "",
  Age: "",
  AgeYear: "",
  AgeMonth: "",
  AgeDays: "",
  TotalAgeInDays: "",
  Gender: "Male",
  Mobile: "",
  FamilyMemberIsPrimary: 0,
  FamilyMemberRelation: "",
  PatientCode: "",
  RadioDefaultSelect: "Age",
};

const MemberShipCardEdit = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [TitleOpt, setTitleOpt] = useState([]);
  const [GenderOpt, setGenderOpt] = useState([]);
  const [relationshipOpt, setRelationshipOpt] = useState(relationshipOptions);
  const [cardDetails, setCardDetails] = useState(cardDetailsConst);
  const [tableData, setTableData] = useState([]);
  const [dependentData, setDependentData] = useState([]);
  const [depMobiledata, setdepMobiledata] = useState([]);
  const [MembershipCardNo, setMembershipCardNo] = useState("");
  const [modal, setModal] = useState({ show: false, data: "", tempIndex: "" });
  const [taskType, setTaskType] = useState("");
  const [edit, setedit] = useState([]);
  const [editdep, seteditdep] = useState(false);
  const location = useLocation();
  const { data } = location.state || {};

  const handleReset = (val) => {
    setCardDetails(cardDetailsConst);
    setTableData([]);
    setDependentData([]);
    setdepMobiledata([]);
    setModal({ show: false, data: "", tempIndex: "" });
    val === "" && setMembershipCardNo("");
  };
  const getDropDownData = (name) => {
    const match = ["Title", "Gender"];
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

        name === "Gender" && setGenderOpt(value);
        name === "Title" && setTitleOpt(value);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getDropDownData("Gender");
    getDropDownData("Title");
  }, []);
  useEffect(() => {
    if (data?.MembershipCardID) {
      setMembershipCardNo(data?.cardno);
      console.log("hello");
      handleSubmit();
    }
  }, []);

  function ageToDOB(ageString) {
    const ageParts = ageString.split(" ");
    const years = parseInt(ageParts[0]);
    const months = parseInt(ageParts[2]);
    const days = parseInt(ageParts[4]);

    const today = new Date();
    const dob = new Date(
      today.getFullYear() - years,
      today.getMonth() - months,
      today.getDate() - days
    );

    return dob.toISOString().split("T")[0];
  }

  function updateAgeComponents(data) {
    return data.map((item) => {
      const ageParts = item.Age.split(" ");
      const ageYear = parseInt(ageParts[0]);
      const ageMonth = parseInt(ageParts[2]);
      const ageDays = parseInt(ageParts[4]);

      return {
        ...item,
        AgeYear: ageYear,
        AgeMonth: ageMonth,
        AgeDays: ageDays,
      };
    });
  }

  const handleSubmit = () => {
    setLoading(true);
    handleReset("no");
    axiosInstance
      .post("MembershipCardIssue/BindMemberShip", {
        CardNo: data?.cardno ? data?.cardno : MembershipCardNo,
      })
      .then((res) => {
        let newData = res?.data?.message;
        const falseArray = Array.from({ length: newData.length }, () => false);
        setedit(falseArray);

        const data = updateAgeComponents(newData);

        setTableData(data);
        setCardDetails({
          MembershipCardAmount: Number(
            newData[0]?.MembershipCardAmount
          ).toFixed(2),
          MembershipCardDependent: newData[0]?.MembershipCardDependent,
          ValidTo: newData[0]?.ValidTo,
          MembershipCardName: newData[0]?.MembershipCardName,
          FamilyMemberGroupID: newData[0]?.FamilyMemberGroupID,
        });
        addDependentData(newData[0]?.MembershipCardDependent, newData.length);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
        setLoading(false);
      });
  };
  const addDependentData = (dep, length) => {
    const len = dep - (length - 1);
    const arr = [];
    for (let i = 0; i < len; i++) {
      const newObj = { ...dependentConst };
      newObj[`RadioDefaultSelect${i}`] = "Age";
      newObj["AgeDays"] = 0;
      newObj["AgeYear"] = 0;
      newObj["AgeMonth"] = 0;
      arr.push(newObj);
    }
    setDependentData(arr);
  };
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
  const handleRemove = (isPrimary, patientCode, MCardNo, FMgroupID, index) => {
    if (taskType === "") {
      axiosInstance
        .post("MembershipCardIssue/RemoveMember", {
          FamilyMemberGroupID: FMgroupID,
          MembershipCardNo: MCardNo,
          PatientCode: patientCode,
          IsPrimaryMember: isPrimary,
        })
        .then((res) => {
          toast.success(res.data?.message);
          handleSubmit();
          handleAddDependent();
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
        });
    } else {
      toast.error("First Finish Edit Process");
    }

    // const updatedData = [...tableData].filter((ele, ind) => ind !== index);
    // console.log(index, updatedData);
    // setTableData(updatedData);
    // handleAddDependent();
  };

  const handleedit = (ele, index) => {
    const newEditArray = [...edit];
    newEditArray[index] = true;
    setedit(newEditArray);
    seteditdep(true);
    const updatedEle = { ...ele };
    updatedEle[`RadioDefaultSelect${dependentData?.length}`] = "Age";
    setDependentData([...dependentData, updatedEle]);
    const newtabledata = tableData.filter(
      (item) => item.PatientCode !== ele.PatientCode
    );
    setTableData(newtabledata);
  };

  const handleAddDependent = () => {
    let Data = [...dependentData].concat([dependentConst]);
    let updatedData = [];
    for (let i = 0; i < Data?.length; i++) {
      Data[i][`RadioDefaultSelect${i}`] = "Age";
    }
    setDependentData(Data);
  };

  const findGender = (value) => {
    const male = ["Mr.", "Baba", "Dr.", "Dr.(Mr)"];
    const female = ["Miss.", "Mrs.", "Dr.(Miss)", "Dr.(Mrs)", "Ms.","SMT."];
    if (male.includes(value)) {
      return "Male";
    }
    if (female.includes(value)) {
      return "Female";
    }
  };

  const ageCount = (y = "0", m = "0", d = "0") => {
    if (y == 0 && m == 0 && d == 0) {
      return 1;
    } else {
      return d == "" ? 0 : d;
    }
  };

  const handleDOBCalculation = (e, year, month, day) => {
    const { name, value } = e.target;

    const intValue = value.trim() === "" ? 0 : parseInt(value);
    console.log(intValue);
    let AgeYear = name === "AgeYear" && year === "" ? intValue : parseInt(year);
    let AgeMonth =
      name === "AgeMonth" && month === "" ? intValue : parseInt(month);
    let AgeDays = name === "AgeDays" && month === "" ? intValue : parseInt(day);

    if (name === "AgeYear") {
      AgeYear = intValue;
    }

    if (name === "AgeMonth") {
      AgeMonth = intValue;
    }

    if (name === "AgeDays") {
      AgeDays = intValue;
    }

    // Calculate total age in days
    const totalAgeInDays = AgeYear * 365 + AgeMonth * 30 + AgeDays;

    const output = {
      [name]: value,
      AgeYear,
      AgeMonth,
      AgeDays,
      TotalAgeInDays: totalAgeInDays,
      Age: `${AgeYear} Y ${AgeMonth} M ${AgeDays} D`,
      dob: moment()
        .subtract(AgeYear, "years")
        .subtract(AgeMonth, "months")
        .subtract(AgeDays, "days")
        .toISOString(),
      DOB: moment()
        .subtract(AgeYear, "years")
        .subtract(AgeMonth, "months")
        .subtract(AgeDays, "days")
        .toISOString(),
    };

    return output;
  };

  const handleChange = (e, index) => {
    const { name, value, checked } = e?.target;
    const trimmedValue = value.endsWith("  ") ? value.trimEnd() + " " : value;
    const updateData = [...dependentData];
    if (name === "Title") {
      const genderVal = findGender(value);
      updateData[index] = {
        ...updateData[index],
        [name]: value,
        Gender: genderVal,
      };
    } else if (name === "PName") {
      const Value = PreventSpecialCharacterandNumber(trimmedValue)
        ? trimmedValue.trimStart()
        : updateData[index][name];
      updateData[index] = {
        ...updateData[index],
        [name]: Value.trimStart(),
      };
    } else if (["AgeYear", "AgeMonth", "AgeDays"].includes(name)) {
      const output = handleDOBCalculation(
        e,
        updateData[index]?.AgeYear,
        updateData[index]?.AgeMonth,
        updateData[index]?.AgeDays
      );
      updateData[index] = {
        ...updateData[index],
        Age: output?.Age,
        AgeYear: output?.AgeYear,
        AgeMonth: output?.AgeMonth,
        AgeDays: output?.AgeDays,
        TotalAgeInDays: output?.TotalAgeInDays,
        dob: output?.DOB,
      };
    } else {
      updateData[index] = {
        ...updateData[index],
        [name]: value,
      };
    }

    setDependentData(updateData);
  };

  const depDateSelect = (value, name, ele, index) => {
    const { years, months, days } = calculateDOB(value);

    const updateData = [...dependentData];
    updateData[index] = {
      ...ele,
      dob: moment(value).format("DD-MMM-YYYY"),
      AgeYear: years,
      AgeMonth: months,
      AgeDays: days,
      TotalAgeInDays: calculateTotalNumberOfDays(value),
      Age: `${years} Y ${months} M ${days} D`,
      FamilyMemberIsPrimary: 0,
    };
    setDependentData(updateData);
  };
  console.log(dependentData);
  const handlePatientData = (e, index) => {
    const keypress = [9, 13];
    const forData = dependentData[index]?.Mobile.length;

    if (keypress.includes(e.which)) {
      if (forData === 10) {
        axiosInstance
          .post("Booking/getDataByMobileNo", {
            Mobile: dependentData[index]?.Mobile,
            PatientCode: "",
          })
          .then((res) => {
            if (res.data.message.length > 0) {
              setModal({
                show: true,
                data: res.data.message,
                tempIndex: index,
              });
              const dep = [...depMobiledata];
              dep.push({ index: index, data: true });
              setdepMobiledata(dep);
            }
          })
          .catch((err) => console.log(err));
      }
    }
  };
  const isObjectPresentWithIndexAndData = (array, index) => {
    console.log(depMobiledata);
    const get = array.find((item) => item.index === index);
    return get?.data;
  };

  const handleSelctData = (data) => {
    const { years, months, days } = calculateDOB(new Date(data?.DOB));

    const index = modal?.tempIndex;
    const updateData = [...dependentData];
    updateData[index] = {
      ...updateData[index],
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
    };
    setDependentData(updateData);
    handleCloseMobileData();
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

  const handleCloseMobileData = () => {
    setModal({
      show: false,
      data: "",
      tempIndex: "",
    });
  };

  const handleResetedit = () => {
    const newEditArray = tableData.map((item) => {
      return false;
    });
    seteditdep(false);
    setedit(newEditArray);

    setDependentData([]);
    setdepMobiledata([]);
    handleSubmit();
  };

  const checkDepData = () => {
    const arr = [];

    dependentData.forEach((ele, ind) => {
      const errors = [];
      if (ele.PName.trim() === "") {
        errors.push("Enter Name");
      }
      if (ele.Mobile.length != 10) {
        errors.push("Enter Valid Mobile");
      }
      if (ele.FamilyMemberRelation.trim() === "") {
        errors.push("Select Relation");
      }
      const isNotToday = (dateString) => {
        const today = new Date();
        const date = new Date(dateString);

        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const todayDay = today.getDate();

        const dateYear = date.getFullYear();
        const dateMonth = date.getMonth();
        const dateDay = date.getDate();

        return (
          todayYear !== dateYear ||
          todayMonth !== dateMonth ||
          todayDay !== dateDay
        );
      };

      if (ele?.dob == "") {
        errors.push("Enter valid DOB");
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

  const handleUpdate = () => {
    setLoading1(true);

    let depErr = checkDepData();
    console.log(dependentData);
    if (depErr.length === 0) {
      const payload = dependentData.map((item) => {
        return {
          ...item,
          DOB: item?.dob,
        };
      });

      axiosInstance
        .post("MembershipCardIssue/UpadateMemberShip", {
          PatientData: payload,
          CardNo: payload[0]?.MembershipCardNo,
          FamilyMemberGroupID: cardDetails?.FamilyMemberGroupID,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setLoading1(false);
          handleSubmit();
        })
        .catch((err) => {
          setLoading1(false);
          toast.error(err?.response?.data?.message);
        });
    } else {
      toast.error(`${depErr[0].errorMessages}`);
      setLoading1(false);
    }
  };
  const handleSave = () => {
    setLoading1(true);
    let depErr = checkDepData([...dependentData]);

    if (depErr.length === 0) {
      const payload = dependentData.map((item) => {
        return {
          ...item,
          DOB: item?.dob,
        };
      });
      axiosInstance
        .post("MembershipCardIssue/EditIssueData", {
          PatientData: payload,
          FamilyMemberGroupID: cardDetails?.FamilyMemberGroupID,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setLoading1(false);
          handleSubmit();
        })
        .catch((err) => {
          setLoading1(false);
          toast.error(err?.response?.data?.message);
        });
    } else {
      toast.error(`${depErr[0].errorMessages}`);
      setLoading1(false);
    }
  };
  function formatDate(dateString) {
    const dateObject = new Date(dateString);
    const formattedDate = dateObject.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return formattedDate;
  }

  return (
    <>
      {modal.show && (
        <MobileDataModal
          show={modal.show}
          mobleData={modal?.data ?? []}
          handleClose={handleCloseMobileData}
          handleSelctData={handleSelctData}
        />
      )}
      <Accordion
        name={t("Membership Card Edit")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row pt-2 pl-2 pr-2 mt-1">
          <div className="col-sm-2">
            <Input
              name={"MembershipCardNo"}
              id="MembershipCardNo"
              placeholder=""
              disabled={tableData.length > 1}
              value={MembershipCardNo}
              onChange={(e) => setMembershipCardNo(e.target.value.trim())}
              lable="Card No"
            />
          </div>
          <div className="col-sm-1">
            <button
              className="btn btn-block btn-sm btn-primary"
              onClick={handleSubmit}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </Accordion>
      <Accordion title={t("Card Details")} defaultValue={true}>
        {tableData.length > 0 && (
          <>
            <div className="row ml-1 mt-1">
              <label className="col-sm-2">
                {t("Card Name")}: {cardDetails?.MembershipCardName}
              </label>
              <label className="col-sm-2">
                {t("Card Amount")}:{" "}
                {Number(cardDetails?.MembershipCardAmount).toFixed(2)}
              </label>
              <label className="col-sm-2">
                {t("No. of Dependents")} :{cardDetails?.MembershipCardDependent}
              </label>
              <label className="col-sm-2">
                {t("Expiry Date")}: {cardDetails?.ValidTo}
              </label>
            </div>
            <Accordion title={t("Member Details")} defaultValue={true}>
              <div className="row px-2">
                <div className="col-12">
                  <Tables>
                    <thead>
                      <tr>
                        <th>{t("Mobile No.")}</th>
                        <th>{t("Family Relation")}</th>
                        <th>{t("Title")}</th>
                        <th>{t("Patient Name")}</th>
                        <th>{t("UHID")}</th>
                        <th>{t("Gender")}</th>
                        <th>{t("Age")}</th>
                        <th>{t("DOB")}</th>
                        <th>{t("Edit")}</th>
                        <th>{t("Remove")}</th>

                      </tr>
                    </thead>
                    <tbody>
                      {tableData &&
                        tableData.map((ele, index) => (
                          <tr key={index}>
                            <td data-title="Mobile No.">{ele?.Mobile}&nbsp;</td>
                            <td data-title="Family Relation">
                              {ele?.FamilyMemberRelation}&nbsp;
                            </td>
                            <td data-title="Title">{ele?.Title}&nbsp;</td>
                            <td data-title="Patient Name">
                              {ele?.PName}&nbsp;
                            </td>
                            <td data-title="UHID">{ele?.PatientCode}&nbsp;</td>
                            <td data-title="Gender">{ele?.Gender}&nbsp;</td>
                            <td data-title="Age">{ele?.Age}&nbsp;</td>
                            <td data-title="DOB">
                              {formatDate(ele?.dob)}&nbsp;
                            </td>

                            <td data-title="Edit">
                              <i
                                class="fa fa-edit"
                                style={{ color: "green", cursor: "pointer" }}
                                onClick={() => handleedit(ele, index)}
                              ></i>
                            </td>
                            <td data-title="Remove">
                              {!edit.some((value) => value === true) &&
                                ele?.FamilyMemberIsPrimary === 0 && (
                                  <i
                                    class="fa fa-close"
                                    style={{
                                      color: "red",
                                      cursor: "pointer",
                                    }}
                                    onClick={() =>
                                      handleRemove(
                                        ele?.FamilyMemberIsPrimary,
                                        ele?.PatientCode,
                                        ele?.MembershipCardNo,
                                        ele?.FamilyMemberGroupID,
                                        index
                                      )
                                    }
                                  ></i>
                                )}
                              &nbsp;
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Tables>
                </div>
              </div>
            </Accordion>
          </>
        )}
        {dependentData.length > 0 && (
          <Accordion title={t("Search Data")} defaultValue={true}>
            <div className="row px-2">
              <div className="col-12">
                <Tables>
                  <thead>
                    <tr>
                      <th>{t("S.N.")}</th>
                      <th>{t("Mobile No.")}</th>
                      <th>{t("UHID")}</th>
                      <th>{t("Patient Name")}</th>
                      <th></th>
                      <th>{t("Age")}</th>
                      <th></th>
                      <th>{t("DOB")}</th>
                      <th>{t("Gender")}</th>
                      <th>{t("Relation")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dependentData &&
                      dependentData.map((ele, ind) => (
                        <tr key={ind}>
                          <td>{ind + 1}</td>
                          <td>
                            <Input
                              name="Mobile"
                              id="Mobile"
                              type="number"
                              onInput={(e) => number(e, 10)}
                              onChange={(e) => handleChange(e, ind)}
                              onKeyDown={(e) => handlePatientData(e, ind)}
                              disabled={isObjectPresentWithIndexAndData(
                                depMobiledata,
                                ind
                              )}
                              value={ele?.Mobile}
                              placeholder=""
                            />
                          </td>
                          <td>
                            <Input
                              name="PatientCode"
                              id="PatientCode"
                              onChange={(e) => handleChange(e, ind)}
                              value={ele?.PatientCode}
                              disabled={true}
                              placeholder=""
                            />
                          </td>
                          <td>
                            <div
                              className="row d-flex"
                              style={{
                                margin: "0",
                                padding: "0",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <div className="col-sm-4">
                                <SelectBox
                                  name="Title"
                                  selectedValue={ele?.Title}
                                  options={[...(TitleOpt ?? [])]}
                                  onChange={(e) => handleChange(e, ind)}
                                  isDisabled={isObjectPresentWithIndexAndData(
                                    depMobiledata,
                                    ind
                                  )}
                                />
                              </div>
                              <div className="col-sm-8">
                                <Input
                                  name="PName"
                                  max="35"
                                  onChange={(e) => handleChange(e, ind)}
                                  disabled={isObjectPresentWithIndexAndData(
                                    depMobiledata,
                                    ind
                                  )}
                                  value={ele?.PName}
                                  placeholder=""
                                />
                              </div>
                            </div>
                          </td>

                          <td style={{ width: "30px", height: "30px" }}  >
                            <input
                              type="radio"
                              name={`RadioDefaultSelect${ind}`}
                              value={`Age`}
                              checked={
                                ele[`RadioDefaultSelect${ind}`] === "Age"
                                  ? true
                                  : false
                              }
                              onChange={(e) => handleChange(e, ind)}
                              
                            />
                          </td>
                          <td>
                            <div
                              className="row d-flex align-items-center"
                                style={{ margin: "0", padding: "0" }}
                            >
                              <div className="col-sm-4">
                                <Input
                                  name="AgeYear"
                                  type="number"
                                  lable="Years"
                                  onInput={(e) => number(e, 3, 120)}
                                  onChange={(e) => handleChange(e, ind)}
                                  value={ele?.AgeYear}
                                  disabled={
                                    ele[`RadioDefaultSelect${ind}`] === "DOB"
                                      ? true
                                      : false
                                  }
                                />
                              </div>
                              <div className="col-sm-4">
                                <Input
                                  className="form-control input-sm"
                                  name="AgeMonth"
                                  lable="Months"
                                  type="number"
                                  onInput={(e) => number(e, 3, 12)}
                                  onChange={(e) => handleChange(e, ind)}
                                  value={ele?.AgeMonth}
                                  disabled={
                                    ele[`RadioDefaultSelect${ind}`] === "DOB"
                                      ? true
                                      : false
                                  }
                                />
                              </div>
                              <div className="col-sm-4">
                                <Input
                                  className="form-control input-sm"
                                  name="AgeDays"
                                  lable="Days"
                                  type="number"
                                  onInput={(e) => number(e, 3, 31)}
                                  onChange={(e) => handleChange(e, ind)}
                                  value={ele?.AgeDays}
                                  disabled={
                                    ele[`RadioDefaultSelect${ind}`] === "DOB"
                                      ? true
                                      : false
                                  }
                                />
                              </div>
                            </div>
                          </td>

                          <td 
                              style={{ width: "30px", height: "30px" }} 
                          >
                            <input
                              type="radio"
                              name={`RadioDefaultSelect${ind}`}
                              value={`DOB`}
                              checked={
                                ele[`RadioDefaultSelect${ind}`] === "DOB"
                                  ? true
                                  : false
                              }
                              onChange={(e) => handleChange(e, ind)}
                            />
                          </td>
                          <td>
                            <DatePicker
                              name="dob"
                              maxDate={new Date()}
                              value={ele?.dob ? new Date(ele?.dob) : ""}
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
                              options={[...(GenderOpt ?? [])]}
                              onChange={(e) => handleChange(e, ind)}
                              selectedValue={ele?.Gender}
                              isDisabled={
                                ele?.Title === "" || ele?.Title === "Baby"
                                  ? false
                                  : true ||
                                    isObjectPresentWithIndexAndData(
                                      depMobiledata,
                                      ind
                                    )
                              }
                            />
                          </td>
                          <td>
                            <SelectBox
                              name="FamilyMemberRelation"
                              selectedValue={ele?.FamilyMemberRelation}
                              options={MaleData(ele?.Gender)}
                              onChange={(e) => handleChange(e, ind)}
                              isDisabled={ele?.FamilyMemberIsPrimary === 1}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Tables>
              </div>
            </div>
          </Accordion>
        )}
      </Accordion>
    </>
  );
};

export default MemberShipCardEdit;
