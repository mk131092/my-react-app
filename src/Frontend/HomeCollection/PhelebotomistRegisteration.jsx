import React, { useCallback, useEffect } from "react";
import Tables from "../../components/UI/customTable";
import Input from "../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Loading from "../../components/loader/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import PhelboImage from "./../HomeCollection/PlaceholderImage.jpg";
import Reload from "./../HomeCollection//Reload.jpg";
import { Image } from "react-bootstrap";
import DatePicker from "../../components/formComponent/DatePicker";
import { SelectBox } from "../../components/formComponent/SelectBox";
import moment from "moment";
import { SelectBoxWithCheckbox } from "../../components/formComponent/MultiSelectBox";

import Accordion from "@app/components/UI/Accordion";
import { PhelbotomistValidationSchema } from "../../utils/Schema";

import {
  PhelboSearchTypes,
  Phelboweekoff,
  Phelborecordoptions,
  PhelboSources,
  PhelbosearchDefault,
} from "../../utils/Constants";

import {
  number,
  AllowCharactersNumbersAndSpecialChars,
  PreventSpecialCharacterandNumber,
  PreventSpecialCharacter,
  PreventNumber,
  PreventCharacter,
} from "../../utils/helpers";
import { Link } from "react-router-dom";
import { BindEmployeeReports } from "../../utils/NetworkApi/commonApi";

const PhelebotomistRegisteration = () => {
  const [errors, setErros] = useState({});
  const [employeeList, setEmployeeList] = useState([]);
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    Name: "",
    IsActive: false,
    Age: new Date(2000, 0, 1),
    Gender: "",
    Mobile: "",
    Other_Contact: "",
    Email: "",
    FatherName: "",
    MotherName: "",
    P_Address: "",
    BloodGroup: "",
    Qualification: "",
    Vehicle_Num: "",
    DrivingLicence: "",
    PanNo: "",
    DocumentType: "",
    DocumentNo: "",
    JoiningDate: new Date(),
    DeviceID: "",
    UserName: "",
    Password: "",
    PhelboSource: "",
    WeakOff: "",
    LoginTime: "08:00",
    LogoutTime: "18:00",
    StateId: "",
    CityId: "",
    P_Pincode: "",
    P_City: "",
    EmployeeID: "",
  });
  const [PhelboCharges, setPhelboCHarges] = useState([]);
  const [DocumentType, setDocumentType] = useState([]);
  const [searchData, setSearchData] = useState(PhelbosearchDefault);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gender, setGender] = useState([]);
  const [BloodType, setBloodType] = useState([]);
  const [phlebochargedata, setphlebochargedata] = useState([]);
  const [selectCharge, setSelectcharge] = useState({
    ChargeName: "",
    ChargeId: "",
    ChargeAmount: "",
    Fromdate: new Date(),
    Todate: new Date(new Date().getTime() + 86400000),
  });
  const [PhleboTable, setPhleboTable] = useState([]);

  // const DocumentTypes=[{
  //     label:'Pan Card',value:'Pan Card'
  //     },{label:'Aadhaar Card',value:'Aadhaar Card'},{label:'Voter Id',value:'Voter Id'}]

  console.log(DocumentType);

  useEffect(() => {
    BindEmployeeReports(setEmployeeList);
  }, []);

  console.log("employeeList", employeeList);
  const fetchCities = (id) => {
    const postdata = {
      StateId: Array.isArray(id) ? id : [Number(id)],
    };

    axios
      .post("api/v1/CommonHC/GetCityData", postdata)
      .then((res) => {
        let data = res.data.message;

        let value = data.map((ele) => {
          return {
            value: ele.ID,
            label: ele.City,
          };
        });

        setCities(value);
      })
      .catch((err) => {
        toast.error("Something Went wrong");
      });
  };
  const fetchStates = () => {
    axios
      .post("api/v1/CommonHC/GetStateData", {
        BusinessZoneID: 0,
      })
      .then((res) => {
        let data = res.data.message;

        let value = data.map((ele) => {
          return {
            value: ele.ID,
            label: ele.State,
          };
        });
        setStates(value);
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  };
  const dateSelect = (date, name, value) => {
    if (name === "Fromdate" || name === "Todate") {
      if (name === "Fromdate") {
        setSelectcharge({
          ...selectCharge,
          [name]: date,
          Todate: new Date(date.getTime() + 86400000),
        });
      } else {
        setSelectcharge({ ...selectCharge, [name]: date });
      }
    } else {
      setFormData({
        ...formData,
        [name]: date,
      });
    }
  };
  const handleSelectChange = (event) => {
    const { name, value, checked, type } = event?.target;

    if (
      name === "Name" ||
      name === "FatherName" ||
      name === "MotherName" ||
      name === "P_City"
    ) {
      setFormData({
        ...formData,
        [name]: PreventSpecialCharacterandNumber(value)
          ? value
          : formData[name],
      });
    } else if (name == "Mobile" || name == "Other_Contact") {
      setFormData({ ...formData, [name]: `${value}` });
    } else if (name == "P_Pincode") {
      if (value.length <= 6) {
        setFormData({ ...formData, [name]: `${value}` });
      }
    } else if (name === "PanNo" || name === "DocumentNo") {
      if (name === "DocumentNo") {
        if (formData?.DocumentType == "56") {
          if (value.length <= 10) {
            setFormData({
              ...formData,
              [name]: PreventSpecialCharacter(value) ? value : formData[name],
            });
          }
        } else if (formData?.DocumentType == "90") {
          if (value.length <= 12) {
            setFormData({
              ...formData,
              [name]: PreventCharacter(value) ? value : formData[name],
            });
          }
        } else {
          setFormData({
            ...formData,
            [name]: PreventSpecialCharacter(value) ? value : formData[name],
          });
        }
      } else {
        setFormData({
          ...formData,
          [name]: PreventSpecialCharacter(value) ? value : formData[name],
        });
      }
    } else if (name === "LogoutTime") {
      if (value > formData?.LoginTime) {
        setFormData({ ...formData, [name]: value });
      }
    } else if (name === "UserName") {
      setFormData({
        ...formData,
        [name]: AllowCharactersNumbersAndSpecialChars(value)
          ? value
          : formData[name],
      });
    } else if (name === "LoginTime") {
      if (value < formData?.LogoutTime) {
        setFormData({ ...formData, [name]: value });
      }
    } else if (name === "Vehicle_Num") {
      setFormData({
        ...formData,
        [name]: PreventSpecialCharacter(value) ? value : formData[name],
      });
    } else if (name === "DocumentType") {
      if (value != "") {
        setFormData({
          ...formData,
          [name]: value,
          DocumentNo: "",
        });
      } else {
        setFormData({
          ...formData,
          [name]: value,
          DocumentNo: "",
        });
      }
    } else if (name === "Qualification") {
      setFormData({
        ...formData,
        [name]: PreventSpecialCharacter(value) ? value : formData[name],
      });
    } else if (name === "DrivingLicence") {
      setFormData({
        ...formData,
        [name]: PreventSpecialCharacter(value) ? value : formData[name],
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSearchChange = (event) => {
    const { name, value, checked, type } = event?.target;
    if (name === "SearchState") {
      fetchCities(value);
      setSearchData({ ...searchData, [name]: value, SearchCity: "" });
    } else {
      console.log(value);
      if (name === "NoOfRecord") {
        searchDataHandler(value);
        setSearchData({ ...searchData, [name]: Number(value) });
      } else if (name === "SearchValue") {
        if (searchData?.SearchType == "Mobile") {
          if (value.length <= 10) {
            setSearchData({
              ...searchData,
              [name]: PreventCharacter(value) ? value : searchData[name],
            });
          }
        } else if (searchData?.SearchType == "Name") {
          setSearchData({
            ...searchData,
            [name]: PreventSpecialCharacterandNumber(value)
              ? value
              : searchData[name],
          });
        } else if (searchData?.SearchType == "PanNo.") {
          if (value.length <= 10) {
            setSearchData({
              ...searchData,
              [name]: PreventSpecialCharacter(value) ? value : searchData[name],
            });
          }
        } else {
          setSearchData({ ...searchData, [name]: value });
        }
      } else if (name === "SearchType") {
        setSearchData({ ...searchData, [name]: value, SearchValue: "" });
        setPhleboTable([]);
      } else {
        setSearchData({ ...searchData, [name]: value });
      }
    }
  };

  const formdataSaveHandler = () => {
    console.log(formData);
    const generatedError = PhelbotomistValidationSchema(formData);
    console.log(generatedError);
    if (generatedError === "") {
      setLoading(true);

      const updatedFormData = {
        ...formData,
        IsActive: formData?.IsActive ? 1 : 0,
        JoiningDate: moment(formData?.JoiningDate).format("DD-MMM-YYYY"),
        Age: moment(formData?.Age).format("DD-MMM-YYYY"),
        NAME: formData?.Name.trim(),
        P_Address: formData?.P_Address ? formData?.P_Address.trim() : "",
        P_City: formData?.P_City ? formData?.P_City.trim() : "",
        Email: formData?.Email.trim(),
        FatherName: formData?.FatherName ? formData?.FatherName.trim() : "",
        MotherName: formData?.MotherName ? formData?.MotherName.trim() : "",
        Qualification: formData?.Qualification.trim(),
        Vehicle_Num: formData?.Vehicle_Num ? formData?.Vehicle_Num.trim() : "",
        DrivingLicence: formData?.DrivingLicence.trim(),
        PanNo: formData?.PanNo ? formData?.PanNo.trim() : "",
        DucumentNo: formData?.DocumentNo ? formData?.DocumentNo.trim() : "",
        DucumentType: formData?.DocumentType ? formData?.DocumentType : "",
        UserName: formData?.UserName.trim(),
        Password: formData?.Password.trim(),
        EmployeeID: formData?.EmployeeID?.trim() || ""
      };
      delete updatedFormData["DocumentNo"];
      delete updatedFormData["DocumentType"];

      // phlebochargedata.forEach(object => {
      //     delete object['ChargeName'];
      // })

      const fullData = {
        obj: updatedFormData,
        phlebochargedata: [],
      };

      axios
        .post("/api/v1/PhelebotomistMaster/SavePhelebotomist", fullData)
        .then((res) => {
          if (res.data.success) {
            setLoading(false);

            setFormData({
              Name: "",
              IsActive: false,
              Age: new Date(2000, 0, 1),
              Gender: "",
              Mobile: "",
              Other_Contact: "",
              Email: "",
              FatherName: "",
              MotherName: "",
              P_Address: "",
              BloodGroup: "",
              Qualification: "",
              Vehicle_Num: "",
              DrivingLicence: "",
              PanNo: "",
              DocumentType: "",
              DocumentNo: "",
              JoiningDate: new Date(),
              DeviceID: "",
              UserName: "",
              Password: "",
              PhelboSource: "",
              WeakOff: "",
              LoginTime: "08:00",
              LogoutTime: "18:00",
              StateId: "",
              CityId: "",
              P_City: "",
              P_Pincode: "",
            });
            setphlebochargedata([]);
            setPhleboTable([]);
            toast.success("Saved successfully");
            searchDataHandler(searchData?.NoOfRecord);
          } else {
            toast.error(res?.data?.message);
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          toast.error(
            err?.response?.data.message
              ? err?.response?.data.message
              : "Something Went wrong"
          );
        });

      setLoading(false);
    }
    setLoading(false);
    setErros(generatedError);
  };
  const searchDataHandler = (value) => {
    if (searchData?.SearchType && searchData?.SearchValue) {
      axios
        .post("api/v1/PhelebotomistMaster/SearchPhlebotomist", {
          ...searchData,
          NoOfRecord: Number(value),
        })
        .then((res) => {
          if (res.data.message.length > 0) {
            setPhleboTable(res.data.message);
          } else {
            setPhleboTable([]);
            toast.error("No record found");
          }
        })
        .catch((err) => {
          toast.error(
            err?.data?.message ? err?.data?.message : "Something Went wrong"
          );
        });
    } else if (searchData?.SearchType != "" && searchData?.SearchValue == "") {
      toast.error("Enter Search Value");
    } else if (searchData?.SearchValue != "" && searchData?.SearchType == "") {
      toast.error("Select Search Type");
    } else {
      axios
        .post("api/v1/PhelebotomistMaster/SearchPhlebotomist", {
          ...searchData,
          NoOfRecord: Number(value),
        })
        .then((res) => {
          if (res.data.message.length > 0) {
            setPhleboTable(res.data.message);
          } else {
            toast.error("No record found");
            setPhleboTable([]);
          }
        })
        .catch((err) => {
          toast.error(
            err?.data?.message ? err?.data?.message : "Something Went wrong"
          );
          setPhleboTable([]);
        });
    }
  };

  const getDropDownData = (name) => {
    axios
      .post("/api/v1/Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ele.FieldName,
            label: ele.FieldDisplay,
          };
        });
        const extractedGenders = value
          ?.filter((option) => option?.label != "Both")
          .map((option) => {
            return {
              value: option?.value,
              label: option?.label,
            };
          });

        extractedGenders.unshift({ label: "Gender", value: "" });

        setGender(extractedGenders);
      })
      .catch((err) => {
        toast.error(err?.res?.data ? err?.res?.data : "Something Went wrong");
      });
  };

  const getRequiredAttachment = () => {
    axios
      .post("/api/v1/Global/GetGlobalData", {
        Type: "RequiredAttachment",
      })
      .then((res) => {
        let data = res.data.message;

        let RequiredAttachment = data.map((ele) => {
          return {
            value: ele.FieldID,
            label: ele.FieldDisplay,
          };
        });
        setDocumentType(RequiredAttachment);
      })
      .catch((err) => console.log(err));
  };
  const getBloodType = () => {
    axios
      .get("api/v1/CommonHC/GetBloodGroupData")
      .then((res) => {
        let data = res.data.message;

        let value = data.map((ele) => {
          return {
            value: ele.BloodGroupName,
            label: ele.BloodGroupName,
          };
        });

        setBloodType(value);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };
  const getAmount = (str) => {
    const newStr = str.replaceAll(" ", "");
    let parts = newStr.split("@");
    return parts[1];
  };
  const getPhleboChargeData = () => {
    axios
      .get("/api/v1/PhelebotomistMaster/GetChargeData")
      .then((res) => {
        let data = res.data.message;

        let value = data.map((ele) => {
          return {
            value: ele.ID,
            label: ele.Charge,
            amount: getAmount(ele.Charge),
          };
        });
        setPhelboCHarges(value);
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  };
  // const chargeChangeHandler = (event) => {

  //     const { name, value } = event?.target

  //     if (name === 'ChargeName') {
  //         if (value) {

  //             const { Name, Amount } = getNameAmountofCharge(value);
  //             setSelectcharge({
  //                 ...selectCharge,
  //                 ChargeId: `${value}`,
  //                 ChargeName: Name,
  //                 ChargeAmount: Amount
  //             })
  //         }

  //     }
  // }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const getNameAmountofCharge = (id) => {
    if (id) {
      const ele = PhelboCharges.filter((item) => {
        return item.value == id;
      });

      let parts = ele[0].label.split("@");

      return { Name: parts[0], Amount: ele[0].amount };
    }
  };
  const handleSelectMultiChange = (select, name) => {
    if (name === "StateId") {
      console.log(select);
      const val = select.map((ele) => {
        return ele?.value;
      });
      console.log(val);
      setFormData({ ...formData, [name]: val, CityId: "" });
      if (val.length > 0) {
        fetchCities(val);
      } else {
        setFormData({ ...formData, StateId: "", CityId: "" });
        setCities([]);
      }
    } else if (name === "CityId") {
      const val = select?.map((ele) => ele?.value);
      if (val.length > 0) {
        setFormData({ ...formData, [name]: val });
      } else {
        setFormData({ ...formData, CityId: "" });
      }
    }
  };
  const addPhelboChargeHandler = () => {
    if (
      selectCharge?.ChargeId &&
      selectCharge?.ChargeAmount &&
      selectCharge?.ChargeName &&
      selectCharge?.Fromdate &&
      selectCharge?.Todate
    ) {
      const chargeData = {
        ChargeID: `${selectCharge?.ChargeId.toString()}`,
        ChargeAmount: selectCharge?.ChargeAmount,
        ChargeName: selectCharge?.ChargeName,
        FromDate: selectCharge?.Fromdate
          ? moment(selectCharge?.Fromdate).format("DD-MMM-YYYY")
          : new Date(),
        ToDate: selectCharge?.Todate
          ? moment(selectCharge?.Todate).format("DD-MMM-YYYY")
          : new Date(),
      };
      const id = chargeData?.ChargeID;
      if (phlebochargedata.length > 0) {
        let isobjectExist = phlebochargedata.some((obj) => {
          if (obj?.ChargeID == id) {
            return true;
          }
          return false;
        });
        if (isobjectExist) {
          toast.warn("Charge Already Added");
        } else {
          setphlebochargedata([...phlebochargedata, chargeData]);
        }
      } else {
        setphlebochargedata([...phlebochargedata, chargeData]);
      }
      setSelectcharge({
        ChargeName: "",
        ChargeId: "",
        ChargeAmount: "",
        Fromdate: new Date(),
        Todate: new Date(new Date().getTime() + 86400000),
      });
    }
  };
  const removeCharge = (id) => {
    const updateList = phlebochargedata.filter((item) => {
      return item.ChargeID !== id;
    });

    setphlebochargedata(updateList);
  };

  const getStatecity = (name, details) => {
    if (name == "state") {
      let states = [];
      for (let i of details) {
        if (!states.includes(i.StateId)) {
          states.push(`${i.StateId}`);
        }
      }
      return states;
    } else {
      let cities = [];
      for (let i of details) {
        if (!cities.includes(i.CityId)) {
          cities.push(i.CityId);
        }
      }
      return cities;
    }
  };

  const editDetailsHandler = (rowData) => {
    axios
      .post("/api/v1/PhelebotomistMaster/EditPhlebotomist", {
        Phlebotomist: rowData?.PhlebotomistID,
      })
      .then((res) => {
        const details = res?.data?.message;
        console.log('details',details);
        const details2 = {
          PhelebotomistId: details[0]?.PhlebotomistID || "",
          Name: details[0]?.NAME || "",
          IsActive: details[0]?.IsActive === 1 ? true : false,
          Age: details[0]?.Age
            ? new Date(details[0]?.Age)
            : new Date(2000, 0, 1),

          Gender: details[0]?.Gender || "",
          Mobile: details[0]?.Mobile || "",

          Other_Contact: details[0]?.Other_Contact || "",
          Email: details[0]?.Email || "",
          FatherName: details[0]?.FatherName || "",
          MotherName: details[0]?.MotherName || "",
          P_Pincode: details[0]?.P_Pincode ? details[0]?.P_Pincode : "",
          P_City: details[0]?.P_City ? details[0]?.P_City : "",
          P_Address: details[0]?.P_Address || "",
          BloodGroup: details[0]?.BloodGroup || "",
          Qualification: details[0]?.Qualification || "",
          Vehicle_Num: details[0]?.Vehicle_Num || "",
          DrivingLicence: details[0]?.DrivingLicence || "",
          PanNo: details[0]?.PanNo || "",
          DocumentType: details[0]?.DocumentType || "",
          DocumentNo: details[0]?.DocumentNo || "",
          JoiningDate: details[0]?.JoiningDate
            ? new Date(details[0]?.JoiningDate)
            : new Date(),

          DeviceID: details[0].DeviceID || "",
          UserName: details[0].UserName || "",
          Password: details[0].PASSWORD || "",
          PhelboSource: details[0]?.PhelboSource || "",
          WeakOff: details[0]?.WeakOff || "",
          LoginTime: details[0]?.LoginTime,
          LogoutTime: details[0]?.LogoutTime,
          StateId: getStatecity("state", details),
          CityId: getStatecity("city", details),
          EmployeeID: rowData?.EmployeeID,
        };
        setFormData(details2);
        fetchCities(details2?.StateId);
      })
      .catch((err) => {
        toast.error(err?.res?.data ? err?.res?.data : "Something Went wrong");
      });
    axios
      .post("api/v1/PhelebotomistMaster/BindChData", { PhlebotomistID: id })
      .then((res) => {
        const details = res.data.message;

        const PhleboChargedetails = details.map((ele) => {
          return {
            ChargeName: ele.ChargeName,
            ChargeID: ele.ChargeID.toString(),
            ChargeAmount: ele.ChargeAmount,
            FromDate: ele.fromdate,
            ToDate: ele.todate,
          };
        });

        setphlebochargedata(PhleboChargedetails);
      })
      .catch((err) => {
        toast.error(err?.res?.data ? err?.res?.data : "Something Went wrong");
      });

    window.scroll(0, 0);
  };

  const formdataUpdateHandler = () => {
    const generatedError = PhelbotomistValidationSchema(formData);
    console.log(generatedError);
    if (generatedError === "") {
      setLoading(true);

      const updatedFormData = {
        ...formData,
        IsActive: formData?.IsActive ? 1 : 0,
        JoiningDate: moment(formData?.JoiningDate).format("DD-MMM-YYYY"),
        Age: moment(formData?.Age).format("DD-MMM-YYYY"),
        NAME: formData?.Name.trim(),
        DucumentType: formData?.DocumentType,
        DucumentNo: formData?.DocumentNo ? formData?.DocumentNo : "",
        P_Address: formData?.P_Address ? formData?.P_Address.trim() : "",
        P_City: formData?.P_City ? formData?.P_City.trim() : "",
        Email: formData?.Email.trim(),
        FatherName: formData?.FatherName ? formData?.FatherName.trim() : "",
        MotherName: formData?.MotherName ? formData?.MotherName.trim() : "",
        Qualification: formData?.Qualification.trim(),
        Vehicle_Num: formData?.Vehicle_Num ? formData?.Vehicle_Num.trim() : "",
        DrivingLicence: formData?.DrivingLicence.trim(),
        PanNo: formData?.PanNo ? formData?.PanNo.trim() : "",
        UserName: formData?.UserName.trim(),
        Password: formData?.Password.trim(),
      };
      delete updatedFormData["DocumentNo"];
      delete updatedFormData["DocumentType"];
      const fullData = {
        obj: updatedFormData,
        phlebochargedata: [],
      };

      axios
        .post("/api/v1/PhelebotomistMaster/UpdatePhlebotomist", fullData)
        .then((res) => {
          if (res.data.message) {
            setLoading(false);

            setFormData({
              Name: "",
              IsActive: false,
              Age: new Date(2000, 0, 1),
              Gender: "",
              Mobile: "",
              Other_Contact: "",
              Email: "",
              FatherName: "",
              MotherName: "",
              P_Address: "",
              BloodGroup: "",
              Qualification: "",
              Vehicle_Num: "",
              DrivingLicence: "",
              PanNo: "",
              DocumentType: "",
              DocumentNo: "",
              JoiningDate: new Date(),
              DeviceID: "",
              UserName: "",
              Password: "",
              PhelboSource: "",
              WeakOff: "",
              LoginTime: "08:00",
              LogoutTime: "18:00",
              StateId: "",
              CityId: "",
              P_City: "",
              P_Pincode: "",
            });
            setphlebochargedata([]);
            setPhleboTable([]);

            toast.success("Updated successfully");
            searchDataHandler(searchData?.NoOfRecord);
          }
        })
        .catch((err) => {
          setLoading(false);
          toast.error(
            err?.response?.data.message
              ? err?.response?.data.message
              : "Something Went wrong"
          );
        });
    }

    setLoading(false);
    setErros(generatedError);
  };
  const getLastDayOfMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  useEffect(() => {
    getDropDownData("Gender");
    getRequiredAttachment();
    getBloodType();
    fetchStates();
    getPhleboChargeData();
  }, []);

  return (
    <>
      <Accordion
        name={t("Phlebotomist Registeration")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row px-2 mt-2 mb-1">
          <div className="col-md-11">
            <div className="row">
              <div className="col-sm-2">
                <Input
                  lable="Name"
                  id="Name"
                  placeholder=" "
                  className="required-fields"
                  name="Name"
                  onChange={handleSelectChange}
                  value={formData?.Name}
                  max={30}
                />
                {formData?.Name.trim() === "" && (
                  <span className="error-message">{errors?.Name}</span>
                )}
                {formData?.Name.trim().length > 0 &&
                  formData?.Name.trim().length < 3 && (
                    <span className="error-message">{errors?.NameLength}</span>
                  )}
              </div>

              <div className="col-sm-2">
                <DatePicker
                  className="custom-calendar required-fields"
                  name="Age"
                  placeholder=" "
                  id="Age"
                  lable="Date Of Birth"
                  onChange={dateSelect}
                  value={formData?.Age}
                  maxDate={new Date()}
                />
                {formData?.Age === "" && (
                  <span className="error-message">{errors?.Age}</span>
                )}
              </div>

              <div className="col-sm-1">
                <SelectBox
                  name="Gender"
                  className="required-fields"
                  id="Gender"
                  lable="Gender"
                  options={gender}
                  onChange={handleSelectChange}
                  selectedValue={formData?.Gender}
                />
                {formData?.Gender === "" && (
                  <span className="error-message">{errors?.Gender}</span>
                )}
              </div>
              <div className="col-sm-1 mt-2">
                <input
                  type="checkbox"
                  name="IsActive"
                  checked={formData.IsActive}
                  onChange={handleSelectChange}
                />
                &nbsp;&nbsp;
                <label className="control-label">IsActive</label>
              </div>

              <div className="col-sm-2">
                <Input
                  id="Address"
                  lable="Address"
                  name="P_Address"
                  placeholder=" "
                  onChange={handleSelectChange}
                  value={formData?.P_Address}
                  max={30}
                />
                {formData?.P_Address.trim().length > 0 &&
                  formData?.P_Address?.trim().length < 3 && (
                    <span className="error-message">
                      {errors?.P_Addresslength}
                    </span>
                  )}
              </div>
              <div className="col-sm-2">
                <Input
                  placeholder=" "
                  id="City"
                  lable="City"
                  name="P_City"
                  onChange={handleSelectChange}
                  value={formData?.P_City}
                  max={15}
                />
                {formData?.P_City.trim().length > 0 &&
                  formData?.P_City?.length < 3 && (
                    <span className="error-message">
                      {errors?.P_Citylength}
                    </span>
                  )}
              </div>

              <div className="col-sm-2">
                <Input
                  type="number"
                  name="P_Pincode"
                  onInput={(e) => number(e, 6)}
                  placeholder=" "
                  id="Pincode"
                  lable="Pincode"
                  onChange={handleSelectChange}
                  value={formData?.P_Pincode}
                />
                {formData?.P_Pincode.length > 0 &&
                  formData?.P_Pincode?.length != 6 && (
                    <span className="error-message">
                      {errors?.PincodeLength}
                    </span>
                  )}
              </div>
            </div>

            <div className="row">
              <div className="col-sm-2">
                <Input
                  placeholder=" "
                  id="Mobile"
                  lable="Mobile"
                  className="required-fields
                  "
                  name="Mobile"
                  type="number"
                  onInput={(e) => number(e, 10)}
                  onChange={handleSelectChange}
                  value={formData?.Mobile}
                />
                {formData?.Mobile === "" && (
                  <span className="error-message">{errors?.Mobileempty}</span>
                )}
                {formData?.Mobile.length > 0 &&
                  formData?.Mobile.length !== 10 && (
                    <span className="error-message">
                      {errors?.Mobileinvalid}
                    </span>
                  )}
              </div>

              <div className="col-sm-2">
                <Input
                  name="Other_Contact"
                  placeholder=" "
                  id="Phone No"
                  lable="Phone No"
                  type="number"
                  onInput={(e) => number(e, 10)}
                  onChange={handleSelectChange}
                  value={formData?.Other_Contact}
                />
                {formData?.Other_Contact.length > 0 &&
                  formData?.Other_Contact.length !== 10 && (
                    <span className="error-message">
                      {errors?.OtherContact}
                    </span>
                  )}
              </div>
              <div className="col-sm-2">
                <Input
                  name="Email"
                  placeholder=" "
                  id="Email"
                  lable="Email"
                  type="email"
                  max={30}
                  className="required-fields"
                  onChange={handleSelectChange}
                  value={formData?.Email}
                />
                {formData?.Email.trim() === "" && (
                  <span className="error-message">{errors?.Emailempty}</span>
                )}
                {!emailRegex.test(formData?.Email) &&
                  formData?.Email.trim().length > 0 && (
                    <span className="error-message">{errors?.Emailvalid}</span>
                  )}
              </div>
              <div className="col-sm-2">
                <SelectBox
                  name="BloodGroup"
                  placeholder=" "
                  id="BloodGroup"
                  lable="BloodGroup"
                  onChange={handleSelectChange}
                  selectedValue={formData?.BloodGroup}
                  options={[
                    { label: "Choose Blood Group", value: "" },
                    ...BloodType,
                  ]}
                />
              </div>
              <div className="col-sm-2">
                <Input
                  placeholder=" "
                  id="FatherName"
                  lable="FatherName"
                  name="FatherName"
                  onChange={handleSelectChange}
                  value={formData?.FatherName}
                  max={30}
                />
                {formData?.FatherName.trim().length > 0 &&
                  formData?.FatherName?.trim().length < 3 && (
                    <span className="error-message">
                      {errors?.FatherNameLength}
                    </span>
                  )}
              </div>
              <div className="col-sm-2">
                <Input
                  name="MotherName"
                  placeholder=" "
                  id="MotherName"
                  lable="MotherName"
                  onChange={handleSelectChange}
                  value={formData?.MotherName}
                  max={30}
                />
                {formData?.MotherName.trim().length > 0 &&
                  formData?.MotherName?.trim().length < 3 && (
                    <span className="error-message">
                      {errors?.MotherNameLength}
                    </span>
                  )}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-2">
                <Input
                  placeholder=" "
                  id="Qualification"
                  lable="Qualification"
                  name="Qualification"
                  onChange={handleSelectChange}
                  value={formData?.Qualification}
                  type="text"
                  max={30}
                />

                {formData?.Qualification.trim().length > 0 &&
                  formData?.Qualification?.trim().length < 2 && (
                    <span className="error-message">
                      {errors?.QualificationLength}
                    </span>
                  )}
              </div>
              <div className="col-sm-2">
                <Input
                  placeholder=" "
                  id="VehicleNum"
                  lable="Vehicle Number"
                  name="Vehicle_Num"
                  onChange={handleSelectChange}
                  value={formData?.Vehicle_Num}
                  type="text"
                  max={12}
                />
                {formData?.Vehicle_Num.trim().length > 0 &&
                  formData?.Vehicle_Num.trim().length < 5 && (
                    <span className="error-message">
                      {errors?.Vehicle_NumLength}
                    </span>
                  )}
              </div>
              <div className="col-sm-2">
                <Input
                  name="DrivingLicence"
                  placeholder=" "
                  id="DrivingLicence"
                  lable="DrivingLicence"
                  onChange={handleSelectChange}
                  value={formData?.DrivingLicence}
                  type="text"
                  max={16}
                />
                {formData?.DrivingLicence.trim().length > 0 &&
                  formData?.DrivingLicence.trim().length < 11 && (
                    <span className="error-message">
                      {errors?.DrivingLicence_NumLength}
                    </span>
                  )}
              </div>
              <div className="col-sm-2">
                <Input
                  placeholder=" "
                  id="PanNo"
                  lable="PanNo"
                  name="PanNo"
                  onInput={(e) => number(e, 10)}
                  onChange={handleSelectChange}
                  value={formData?.PanNo}
                  max={10}
                />
                {formData?.PanNo.trim() != "" &&
                  formData?.PanNo?.trim().length != 10 && (
                    <span className="error-message">{errors?.PanLength}</span>
                  )}
              </div>
              <div className="col-sm-2">
                <SelectBox
                  placeholder=" "
                  id="DocumentType"
                  className="required-fields"
                  lable="DocumentType"
                  name="DocumentType"
                  onChange={handleSelectChange}
                  options={[{ label: "Choose ID", value: "" }, ...DocumentType]}
                  selectedValue={formData?.DocumentType}
                />
                {formData?.DocumentType === "" && (
                  <span className="error-message">{errors?.DocumentType}</span>
                )}
              </div>
              <div className="col-sm-2">
                <Input
                  type="text"
                  name="DocumentNo"
                  placeholder=" "
                  id="DocumentNo"
                  lable="DocumentNo"
                  className="required-fields"
                  onChange={handleSelectChange}
                  value={formData?.DocumentNo}
                  max={20}
                />
                {formData?.DocumentNo.trim() === "" && (
                  <span className="error-message">{errors?.DocumentNo}</span>
                )}
                {formData?.DocumentNo.trim().length > 0 &&
                  formData?.DocumentNo.trim().length <= 6 && (
                    <span className="error-message">
                      {errors?.DocumentNolength}
                    </span>
                  )}
                {formData?.DocumentType == "90" &&
                  formData?.DocumentNo.trim().length > 6 &&
                  formData?.DocumentNo.trim().length != 12 && (
                    <span className="error-message">
                      {errors?.Aadharlength}
                    </span>
                  )}
                {formData?.DocumentType == "56" &&
                  formData?.DocumentNo.trim().length > 6 &&
                  formData?.DocumentNo.trim().length != 10 && (
                    <span className="error-message">{errors?.PanLength}</span>
                  )}
              </div>
            </div>
          </div>
          <div className="col-md-1">
            <div
              style={{
                border: "1px solid grey",
                borderRadius: "5px",
                textAlign: "center",
                width: "74%",
                height: "94%",

                marginLeft: "10px",
              }}
              className="p-1"
            >
              <img height={75} src={PhelboImage} style={{ width: "100%" }} />
            </div>
          </div>
        </div>
      </Accordion>
      <Accordion title="Work Area Detail" defaultValue={true}>
        <div className="row px-2 mt-2 mb-1">
          <div className="col-sm-2">
            <DatePicker
              className="custom-calendar required-fields"
              name="JoiningDate"
              id="JoiningDate"
              lable="JoiningDate"
              placeholder=" "
              value={formData?.JoiningDate}
              // minDate={new Date()}
              maxDate={new Date()}
              onChange={dateSelect}
              // maxDate={
              //   new Date(
              //     formData?.JoiningDate.getFullYear(),
              //     formData?.JoiningDate.getMonth(),
              //     getLastDayOfMonth(
              //       formData?.JoiningDate.getFullYear(),
              //       formData?.JoiningDate.getMonth()
              //     )
              //   )
              // }
            />
          </div>
          <div className="col-sm-2">
            <SelectBoxWithCheckbox
              name="StateId"
              onChange={handleSelectMultiChange}
              options={states}
              placeholder=" "
              lable="Select State"
              className="required-fields"
              id="StateId"
              value={formData?.StateId}
            />
            {formData?.StateId === "" && (
              <span className="error-message">{errors?.State}</span>
            )}
          </div>
          <div className="col-sm-2">
            <SelectBoxWithCheckbox
              name="CityId"
              placeholder=" "
              lable="Select City"
              id="City"
              className="required-fields"
              onChange={handleSelectMultiChange}
              value={formData?.CityId}
              options={cities}
            />
            {formData?.CityId === "" && (
              <span className="error-message">{errors?.City}</span>
            )}
          </div>

          <div className="col-sm-2">
            <Input
              placeholder=" "
              lable="UserName"
              id="UserName"
              className="required-fields"
              name="UserName"
              autoComplete="false"
              onChange={handleSelectChange}
              value={formData?.UserName}
              max={20}
            />
            {formData?.UserName.trim() === "" && (
              <span className="error-message">{errors?.UserName}</span>
            )}
            {formData?.UserName.trim().length > 0 &&
              formData?.UserName.trim().length <= 3 && (
                <span className="error-message">{errors?.UserNameL}</span>
              )}
          </div>
          <div className="col-sm-2">
            <Input
              type="password"
              autoComplete="new-password"
              className="required-fields"
              name="Password"
              max={20}
              onChange={handleSelectChange}
              value={formData?.Password}
              placeholder=" "
              lable="Password"
              id="Password"
            />
            {formData?.Password.trim() === "" && (
              <span className="error-message">{errors?.Password}</span>
            )}
            {formData?.Password.trim().length > 0 &&
              !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
                formData?.Password
              ) && <span className="error-message">{errors?.Passwordl}</span>}
          </div>
          <div className="col-sm-2">
            <SelectBox
              placeholder=" "
              lable="PhelboSource"
              id="PhelboSource"
              className="required-fields"
              name="PhelboSource"
              onChange={handleSelectChange}
              options={[
                { label: "Select Phelbo", value: "" },
                ...PhelboSources,
              ]}
              selectedValue={formData?.PhelboSource}
            />
            {formData?.PhelboSource === "" && (
              <span className="error-message">{errors?.PhelboSource}</span>
            )}
          </div>
        </div>
        <div className="row px-2 mt-1 mb-1">
          <div className="col-sm-2">
            <SelectBox
              placeholder=" "
              lable="WeakOff"
              id="WeakOff"
              options={[
                { label: "Select Week off", value: "" },

                ...Phelboweekoff,
              ]}
              selectedValue={formData?.WeakOff}
              name="WeakOff"
              onChange={handleSelectChange}
            />
          </div>

          <div className="col-sm-2">
            <SelectBox
              lable="Employee Master"
              id="EmployeeID"
              name="EmployeeID"
              selectedValue={formData?.EmployeeID}
              options={[{ label: "Select", value: "" }, ...employeeList]}
              onChange={handleSelectChange}
            />
          </div>

          <div className="col-sm-2">
            <Input
              type="time"
              name="LoginTime"
              placeholder=" "
              lable="LoginTime"
              id="LoginTime"
              className="required-fields"
              onChange={handleSelectChange}
              value={formData?.LoginTime}
            />
            {formData?.LoginTime === "" && (
              <span className="error-message">{errors?.LoginTime}</span>
            )}
          </div>
          <div className="col-sm-2">
            <Input
              className="required-fields"
              type="time"
              name="LogoutTime"
              placeholder=" "
              lable="LogoutTime"
              id="LogoutTime"
              onChange={handleSelectChange}
              value={formData?.LogoutTime}
              min="08:00"
            />
            {formData?.LogoutTime === "" && (
              <span className="error-message">{errors?.LogoutTime}</span>
            )}
          </div>

          <div className="col-sm-1">
            <Input
              placeholder=" "
              lable="DeviceID"
              id="DeviceID"
              name="DeviceID"
              onChange={handleSelectChange}
              value={formData?.DeviceID}
              disabled={true}
            />
          </div>
          <div className="col-sm-1">
            <Image src={Reload} />
          </div>
          {loading ? (
            <div className="col-sm-1">
              <Loading />
            </div>
          ) : (
            <div className="col-sm-1 col-xs-12">
              {formData?.PhelebotomistId ? (
                <button
                  type="button"
                  className="btn btn-block btn-warning btn-sm"
                  onClick={formdataUpdateHandler}
                >
                  {t("Update")}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-block btn-success btn-sm"
                  onClick={formdataSaveHandler}
                >
                  {t("Save")}
                </button>
              )}
            </div>
          )}
          <div className="col-sm-1">
            <button
              type="button"
              className="btn btn-block btn-success btn-sm"
              onClick={() => {
                setFormData({
                  Name: "",
                  IsActive: false,
                  Age: new Date(2000, 0, 1),
                  Gender: "",
                  Mobile: "",
                  Other_Contact: "",
                  Email: "",
                  FatherName: "",
                  MotherName: "",
                  P_Address: "",
                  BloodGroup: "",
                  Qualification: "",
                  Vehicle_Num: "",
                  DrivingLicence: "",
                  PanNo: "",
                  DocumentType: "",
                  DocumentNo: "",
                  JoiningDate: new Date(),
                  DeviceID: "",
                  UserName: "",
                  Password: "",
                  PhelboSource: "",
                  WeakOff: "",
                  LoginTime: "08:00",
                  LogoutTime: "18:00",
                  StateId: "",
                  CityId: "",
                  P_Pincode: "",
                  P_City: "",
                  EmployeeID:''
                });
                setErros({});
              }}
            >
              {t("Reset")}
            </button>
          </div>
        </div>
      </Accordion>
      <Accordion title="Search Detail" defaultValue={true}>
        <div className="row pt-2 pl-2 pr-2 ">
          <div className="col-sm-1">
            <SelectBox
              lable="No.Of Records"
              id="Records"
              options={Phelborecordoptions}
              name="NoOfRecord"
              selectedValue={searchData?.NoOfRecord}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              lable="Select State"
              id="Select State"
              name="SearchState"
              value={searchData?.SearchState}
              onChange={handleSearchChange}
              options={[{ label: "State", value: "" }, ...states]}
            />
          </div>

          <div className="col-sm-2">
            <SelectBox
              lable="Select City"
              id="Select City"
              name="SearchCity"
              selectedValue={searchData?.SearchCity}
              options={[{ label: "City", value: "" }, ...cities]}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              lable="Select Gender"
              id="Select Gender"
              name="SearchGender"
              selectedValue={searchData?.SearchGender}
              onChange={handleSearchChange}
              options={[...gender]}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              name="SearchType"
              lable="SearchType"
              id="SearchType"
              onChange={handleSearchChange}
              options={[
                { label: "Select type", value: "" },
                ...PhelboSearchTypes,
              ]}
              selectedValue={searchData?.SearchType}
            />
          </div>
          <div className="col-sm-2">
            <Input
              // options={}
              name="SearchValue"
              placeholder=" "
              id="SearchValue"
              lable="SearchValue"
              onChange={handleSearchChange}
              value={searchData.SearchValue}
              max={15}
            />
          </div>
          <div className="col-sm-1">
            <button
              type="Search"
              className="btn btn-block btn-info btn-sm"
              onClick={() => {
                searchDataHandler(searchData?.NoOfRecord);
              }}
            >
              {t("Search")}
            </button>
          </div>
        </div>
        {PhleboTable.length > 0 && (
          <Tables>
            <thead className="cf text-center" style={{ zIndex: 99 }}>
              <tr>
                <th className="text-center">{t("#")}</th>
                <th className="text-center">{t("Select")}</th>
                <th className="text-center">{t("Phelebo Code")}</th>
                <th className="text-center">{t("Phelebo Name")}</th>
                <th className="text-center">{t("Username")}</th>
                <th className="text-center">{t("DOB")}</th>
                <th className="text-center">{t("Gender")}</th>
                <th className="text-center">{t("Mobile")}</th>
                <th className="text-center">{t("Email")}</th>
                <th className="text-center">{t("Qualification")}</th>
                <th className="text-center">{t("Device Id")}</th>
                <th className="text-center">{t("Phelebo Source")}</th>
                <th className="text-center">{t("Active")}</th>
              </tr>
            </thead>

            <tbody>
              {PhleboTable.map((ele, index) => (
                <>
                  <tr key={index}>
                    <td data-title="#" className="text-center">
                      {index + 1} &nbsp;
                    </td>
                    <td data-title="Select" className="text-center">
                      <Link
                        // className="bg-primary"
                        onClick={async () => {
                          editDetailsHandler(ele);
                        }}
                      >
                        Edit
                      </Link>
                      &nbsp;
                    </td>
                    <td data-title="Phlebo Code" className="text-center">
                      {ele.PhlebotomistID} &nbsp;
                    </td>
                    <td data-title="Phelebo Name" className="text-center">
                      {ele.NAME} &nbsp;
                    </td>
                    <td data-title="Username" className="text-center">
                      {ele.UserName} &nbsp;
                    </td>
                    <td data-title="DOB" className="text-center">
                      {ele.Age} &nbsp;
                    </td>
                    <td data-title="Gender" className="text-center">
                      {ele.Gender}&nbsp;
                    </td>
                    <td data-title="Mobile" className="text-center">
                      {ele.Mobile}&nbsp;
                    </td>
                    <td data-title="Email" className="text-center">
                      {ele.Email}&nbsp;
                    </td>
                    <td data-title="Qualification" className="text-center">
                      {ele.Qualification}&nbsp;
                    </td>
                    <td data-title="Device Id" className="text-center">
                      {ele.DeviceID}&nbsp;
                    </td>
                    <td data-title="Phelbo Source" className="text-center">
                      {ele.PhelboSource}&nbsp;
                    </td>
                    <td data-title="Active" className="text-center">
                      {ele.IsActive == "1" ? "Active" : "Inactive"}&nbsp;
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          </Tables>
        )}
      </Accordion>
    </>
  );
};

export default PhelebotomistRegisteration;
