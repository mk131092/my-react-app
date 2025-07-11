import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  GetAccessRightApproval,
  GetAccessRightMaster,
  getDepartment,
  getDesignationData,
  getEmployeeCenter,
} from "../../utils/NetworkApi/commonApi";
import { guidNumber } from "../util/Commonservices";
import { EmployeeMasterSchema, EmployeeValidation } from "../../utils/Schema";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { getTrimmedData, number } from "../../utils/helpers";
import UploadFile from "../utils/UploadFileModal/UploadFile";
import CameraModal from "../utils/CameraModal";
import Accordion from "@app/components/UI/Accordion";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Input from "../../components/formComponent/Input";
import { SelectBoxWithCheckbox } from "../../components/formComponent/MultiSelectBox";
import { languages, Theme } from "../../utils/Constants";
import Heading from "../../components/UI/Heading";
import Loading from "../../components/loader/Loading";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import DatePicker from "../../components/formComponent/DatePicker";
import moment from "moment/moment";

const CreateEmployeeMaster = () => {
  const location = useLocation();
  const { state } = location;
  const navigation = useNavigate();
  const [Title, setTitle] = useState([]);
  const [show, setShow] = useState(false);
  const [uploadImage, setUploadImage] = useState({ show: false, data: "" });
  const [centreId, setCentreId] = useState([]);
  const [error, setError] = useState({});
  const [EmployeeCenter, setEmployeeCenter] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [Designation, setDesigation] = useState([]);
  const [AccessRight, setAccessRight] = useState([]);
  const [ApprovalRight, setApprovalRight] = useState([]);
  const [EditData, setEditData] = useState(false);
  const [load, setLoad] = useState(false);
  const [EmployeeMaster, setEmployeeMaster] = useState({
    AccessRight: "",
    ShowDashboard: 0,
    ApprovalRight: "",
    ApprovalRightID: "",
    Centre: "",
    CentreID: "",
    City: "",
    Department: "",
    Designation: "",
    DesignationID: "",
    DOB: "01-01-2000",
    Email: "",
    HouseNo: "",
    Locality: "",
    Mobile: "",
    Name: "",
    PCity: "",
    PHouseNo: "",
    PLocality: "",
    PPincode: "",
    PStreetName: "",
    Pincode: "",
    StreetName: "",
    Title: "",
    isActive: 1,
    isLoginApprovel: 0,
    isPasswordChanged: 0,
    DefaultCentre: "",
    EmployeeIDHash: guidNumber(),
    canRefund: 0,
    canSettlement: 0,
    canDiscountAfterBill: 0,
    HideRate: 0,
    FirstName: "",
    Password: "",
    Username: "",
    EmpCode: "",
    AMRAccess: "",
    SaveAmendment: "",
    isPassword: true,
    AllowDiscount: 0,
    UnMasking: "",
    IsDoctorPro: "",
    ProEmployee: "",
    Theme: "Default",
    EmpLanguageCode: "en",
    EmpLanguage: "English",
    DownTimePointsReviewRight: 0,
    DownTimePointsApprovalRight: 0,
    SuperAdmin: 0,
    OnAppGoToMainList: 0,
  });

  const dateSelect = (value, name) => {
    setEmployeeMaster({
      ...EmployeeMaster,
      [name]: value,
    });
  };
  const CompanyCode = useLocalStorage("userData", "get")?.CompanyCode;
  const { t } = useTranslation();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeMaster({ ...EmployeeMaster, [name]: value });
  };
  console.log(EmployeeMaster);
  const handleSubmit = () => {
    const err = EmployeeValidation(EmployeeMaster);
    if (Object?.keys(err)?.length == 0) {
      setLoad(true);
      axiosInstance
        .post(
          "Employee/checkDublicateUserName",
          state
            ? {
                UserName: EmployeeMaster?.Username,
                EmployeeID: state?.id,
              }
            : {
                UserName: EmployeeMaster?.Username,
                EmployeeID: "",
              }
        )
        .then((res) => {
          if (res?.data?.success) {
            setLoad(true);
            axiosInstance
              .post(state?.url2 ? state?.url2 : "Employee/SaveNewEmployee", {
                EmployeeMaster: [
                  {
                    EmployeeID: state?.id,
                    AccessRight: Array?.isArray(EmployeeMaster?.AccessRight)
                      ? EmployeeMaster?.AccessRight?.join(",")
                      : EmployeeMaster?.AccessRight,
                    ApprovalRight: Array?.isArray(EmployeeMaster?.ApprovalRight)
                      ? EmployeeMaster?.ApprovalRight?.join(",")
                      : EmployeeMaster?.ApprovalRight,
                    Centre: Array?.isArray(EmployeeMaster?.Centre)
                      ? EmployeeMaster?.Centre?.join(",")
                      : EmployeeMaster?.Centre,
                    CentreID: EmployeeMaster?.CentreID,
                    City: EmployeeMaster?.City,
                    Department: Array?.isArray(EmployeeMaster?.Department)
                      ? EmployeeMaster?.Department?.join(",")
                      : EmployeeMaster?.Department,
                    Designation: EmployeeMaster?.Designation,
                    DesignationID: EmployeeMaster?.DesignationID,
                    Email: EmployeeMaster?.Email,
                    HouseNo: EmployeeMaster?.HouseNo,
                    Locality: EmployeeMaster?.Locality,
                    Mobile: (EmployeeMaster?.Mobile).toString(),
                    Name: EmployeeMaster?.Name,
                    PCity: EmployeeMaster?.PCity,
                    PHouseNo: EmployeeMaster?.PHouseNo,
                    DOB: moment(EmployeeMaster?.DOB).format("YYYY-MM-DD"),
                    PLocality: EmployeeMaster?.PLocality,
                    PPincode: EmployeeMaster?.PPincode,
                    PStreetName: EmployeeMaster?.PStreetName,
                    Pincode: EmployeeMaster?.Pincode,
                    StreetName: EmployeeMaster?.StreetName,
                    Title: EmployeeMaster?.Title,
                    isActive: EmployeeMaster?.isActive,
                    isLoginApprovel: EmployeeMaster?.isLoginApprovel,
                    isPasswordChanged: EmployeeMaster?.isPasswordChanged,
                    EmployeeIDHash: EmployeeMaster?.EmployeeIDHash,
                    DefaultCentre: EmployeeMaster?.DefaultCentre,
                    canRefund: EmployeeMaster?.canRefund,
                    canSettlement: EmployeeMaster?.canSettlement,
                    canDiscountAfterBill: EmployeeMaster?.canDiscountAfterBill,
                    HideRate: EmployeeMaster?.HideRate,
                    AMRAccess: EmployeeMaster?.AMRAccess,
                    SaveAmendment: EmployeeMaster?.SaveAmendment,
                    AllowDiscount: EmployeeMaster?.AllowDiscount,
                    UnMasking: EmployeeMaster?.UnMasking,
                    ShowDashboard: EmployeeMaster?.ShowDashboard,
                    ImageGuid: uploadImage.data,
                    IsDoctorPro: EmployeeMaster?.IsDoctorPro,
                    ProEmployee: EmployeeMaster?.ProEmployee,
                    Theme: EmployeeMaster?.Theme,
                    EmpLanguageCode: EmployeeMaster?.EmpLanguageCode,
                    EmpLanguage: EmployeeMaster?.EmpLanguage,
                    DownTimePointsReviewRight:
                      EmployeeMaster?.DownTimePointsReviewRight,
                    DownTimePointsApprovalRight:
                      EmployeeMaster?.DownTimePointsApprovalRight,

                    SuperAdmin: EmployeeMaster?.SuperAdmin,
                    OnAppGoToMainList: EmployeeMaster?.OnAppGoToMainList,
                  },
                ],
                userData: [
                  getTrimmedData({
                    DesignationId: Number(EmployeeMaster?.DesignationID),
                    FirstName: EmployeeMaster?.Name,
                    Username: EmployeeMaster?.Username,
                    // Password: EmployeeMaster?.Password,
                    ...(state?.id
                      ? EmployeeMaster?.Password?.trim()
                        ? { Password: EmployeeMaster?.Password }
                        : {}
                      : { Password: EmployeeMaster?.Password }),
                  }),
                ],
              })
              .then((res) => {
                toast.success(res?.data?.message);

                setLoad(false);
                navigation("/EmployeeMaster");
              })
              .catch((err) => {
                toast.error(
                  err.response?.data?.message
                    ? err.response?.data?.message
                    : err.response?.data
                );
                setLoad(false);
              });
          } else {
            setLoad(false);
            toast.error("Duplicate Username");
          }
        })
        .catch((err) => {
          setLoad(false);
          toast.error(err?.response?.data?.message);
          setEmployeeMaster({
            ...EmployeeMaster,
            Username: "",
          });
        });
    } else {
      setLoad(false);
      console.log(err);
      setError(err);
    }
  };

  // console.log(EmployeeMaster);
  const handleChanges = (select, name) => {
    const val = select?.map((ele) => ele?.value);
    setEmployeeMaster({ ...EmployeeMaster, [name]: val });
  };

  const handleMultiSelect = (select, name) => {
    setCentreId(select);
    const val = select?.map((ele) => ele?.value);
    setEmployeeMaster({
      ...EmployeeMaster,
      [name]: val,
      CentreID: select[0]?.value,
    });
  };

  const handleSelectChange = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    if (name === "Designation") {
      setEmployeeMaster({
        ...EmployeeMaster,
        [name]: label,
        DesignationID: value,
      });
    } else if (name === "EmpLanguageCode") {
      setEmployeeMaster({
        ...EmployeeMaster,
        [name]: value,
        EmpLanguage: label,
      });
    } else {
      setEmployeeMaster({ ...EmployeeMaster, [name]: value });
    }
  };

  const getGenderDropdown = (name) => {
    axiosInstance.post("Global/getGlobalData", { Type: name }).then((res) => {
      let data = res.data.message;
      let value = data.map((ele) => {
        return {
          value: ele.FieldDisplay,
          label: ele.FieldDisplay,
        };
      });
      setTitle(value);
    });
  };

  const getDesignID = (checked) => {
    const design = Designation?.filter((ele) => {
      return ele?.label == "Sales Person";
    });
    if (checked && design?.length > 0) {
      return design[0]?.value;
    } else {
      return Designation[0]?.value;
    }
  };
  const getLabel = (value) => {
    const design = Designation?.filter((ele) => {
      return ele?.value == value;
    });
    return design[0]?.label;
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "ProEmployee") {
      setEmployeeMaster({
        ...EmployeeMaster,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
        DesignationID: getDesignID(checked),
        ShowDashboard: 0,
        Designation: getLabel(getDesignID(checked)),
      });
    } else {
      setEmployeeMaster({
        ...EmployeeMaster,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
      });
    }
  };

  const getEditDefaultDropDown = (data) => {
    const val = data.split(",");
    const newData = EmployeeCenter.map((ele) => {
      return val.includes(String(ele?.value)) && ele;
    });
    return newData;
  };
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  const fetch = () => {
    setEditData(true);
    axiosInstance
      .post(state?.url1, {
        EmployeeID: state?.id,
      })
      .then((res) => {
        const responseData = res.data.message[0];
        const Username = responseData?.Username.split("-")[1];
        const data = {
          ...responseData,

          DOB:
            responseData?.DOB == "00-00-0000"
              ? "01-01-2000"
              : responseData?.DOB,
          DesignationID: responseData?.DesignationID,
          Username: Username,
          User: responseData?.Username,
          isPassword: false,
          SuperAdmin: responseData?.SuperAdmin,
        };
        setUploadImage({
          show: false,
          data: data?.ImageGuid ? data?.ImageGuid : "",
        });
        setEmployeeMaster({ ...EmployeeMaster, data });
        fetchDepartments(data);
        const dropdown = getEditDefaultDropDown(data?.CentreList);
        setCentreId(dropdown);
      })
      .catch((err) => {
        setEditData(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };
  const fetchDepartments = (data) => {
    axiosInstance
      .post("Employee/getAccessDepartment", {
        EmployeeID: state?.id,
      })
      .then((res) => {
        if (res?.data?.success) {
          let val = "";
          for (let i = 0; i < res.data.message.length; i++) {
            val =
              val === ""
                ? `${res.data.message[i].DepartmentID}`
                : `${val},${res.data.message[i].DepartmentID}`;
          }
          const data1 = { ...data, Department: val };
          fetchAccessCenter(data1);
        } else {
          const data1 = { ...data, Department: [] };
          fetchAccessCenter(data1);
        }
      })
      .catch((err) => {
        setEditData(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const fetchAccessCenter = (data) => {
    axiosInstance
      .post("Employee/SearchAccessCentre", {
        EmployeeID: state?.id,
      })
      .then((res) => {
        let val = "";
        for (let i = 0; i < res.data.message.length; i++) {
          val =
            val === ""
              ? `${res.data.message[i].CentreID}`
              : `${val},${res.data.message[i].CentreID}`;
        }
        const data1 = { ...data, Centre: val };
        fetchAccessRight(data1);
      })
      .catch((err) => {
        const data1 = { ...data, Centre: [] };
        fetchAccessRight(data1);
        setEditData(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const fetchAccessRight = (data) => {
    axiosInstance
      .post("Employee/SearchAccessRight", {
        EmployeeID: state?.id,
      })
      .then((res) => {
        let val = "";
        for (let i = 0; i < res.data.message.length; i++) {
          val =
            val === ""
              ? `${res.data.message[i].AccessRightID}`
              : `${val},${res.data.message[i].AccessRightID}`;
        }
        const data1 = { ...data, AccessRight: val };
        fetchAccessApproval(data1);
      })
      .catch((err) => {
        const data1 = { ...data, AccessRight: [] };
        fetchAccessApproval(data1);
        setEditData(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const fetchAccessApproval = (data) => {
    axiosInstance
      .post("Employee/SearchApprovalRight", {
        EmployeeID: state?.id,
      })
      .then((res) => {
        // console.log(res);
        if (res?.data?.success) {
          let val = "";
          for (let i = 0; i < res.data.message.length; i++) {
            val =
              val === ""
                ? `${res.data.message[i].ApprovalRightID}`
                : `${val},${res.data.message[i].ApprovalRightID}`;
          }
          setEmployeeMaster({ ...data, ApprovalRight: val });
        } else {
          setEmployeeMaster({ ...data, ApprovalRight: [] });
        }

        setEditData(false);
      })
      .catch((err) => {
        setEmployeeMaster({ ...data, ApprovalRight: [] });
        setEditData(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  useEffect(() => {
    getGenderDropdown("Title");
    getDepartment(setDepartment, "getDepartmentEmployeeMaster");
    getDesignationData(setDesigation, true);
    GetAccessRightMaster(setAccessRight);
    GetAccessRightApproval(setApprovalRight);
  }, []);

  useEffect(() => {
    if (!state) {
      setEmployeeMaster({
        ...EmployeeMaster,
        Title: EmployeeMaster?.Title ? EmployeeMaster?.Title : Title[0]?.value,
        Designation: EmployeeMaster?.Designation
          ? EmployeeMaster?.Designation
          : Designation[0]?.label,
        DesignationID: EmployeeMaster?.DesignationID
          ? EmployeeMaster?.DesignationID
          : Designation[0]?.value,
      });
    }
  }, [Title, Designation]);

  useEffect(() => {
    if (state) {
      fetch();
    }
  }, []);

  const DuplicateUsername = (url) => {
    return new Promise((resolve, reject) => {
      console.log(url);
      axiosInstance
        .post(
          url,
          state
            ? {
                UserName: EmployeeMaster?.Username,
                EmployeeID: state?.id,
              }
            : {
                UserName: EmployeeMaster?.Username,
                EmployeeID: "",
              }
        )
        .then((res) => console.log(res))
        .catch((err) => {
          toast.error(err?.response?.data?.message);
          setEmployeeMaster({
            ...EmployeeMaster,
            Username: "",
          });
        });
    });
  };

  useEffect(() => {
    // console.log(centreId);
    if (!state) {
      setEmployeeMaster({
        ...EmployeeMaster,
        CentreID: centreId[0]?.value ?? "",
      });
    }
  }, [centreId]);

  useEffect(() => {
    getEmployeeCenter(setEmployeeCenter);
    guidNumber();
  }, []);
  return (
    <>
      <>
        {show && (
          <UploadFile
            show={show}
            handleClose={() => setShow(false)}
            documentId={EmployeeMaster?.EmployeeIDHash}
            pageName="EmployeMaster"
          />
        )}
        {uploadImage.show && (
          <CameraModal
            visible={uploadImage.show}
            guid={uploadImage.data}
            pageName={"Employee Image"}
            handleClose={(guidNo) =>
              setUploadImage({
                show: false,
                data: guidNo && guidNo !== "" ? guidNo : uploadImage.data,
              })
            }
          />
        )}
        <Heading name={t("Create Employee")} isBreadcrumb={true} />
        <Accordion title={t("Employee Details")} defaultValue={true}>
          <div className="row pt-2 pl-2 pr-2">
            <div className="col-sm-2">
              <SelectBox
                lable="Title"
                id="Title"
                options={Title}
                selectedValue={EmployeeMaster?.Title}
                onChange={(e) => handleSelectChange(e, EmployeeMaster)}
                name="Title"
              />
            </div>
            <div className="col-sm-2">
              <Input
                lable="Name"
                id="Name"
                placeholder=" "
                name="Name"
                className="required-fields"
                type="text"
                max={50}
                value={EmployeeMaster?.Name}
                onChange={handleChange}
              />
              {!EmployeeMaster?.Name && (
                <span className="error-message">{error?.Name}</span>
              )}
            </div>
            <div className="col-sm-2">
              <div>
                <DatePicker
                  value={
                    EmployeeMaster?.DOB
                      ? moment(EmployeeMaster?.DOB, "DD-MM-YYYY").toDate()
                      : null
                  }
                  className="custom-calendar"
                  name="DOB"
                  placeholder=" "
                  id="DOB"
                  lable="DOB"
                  maxDate={new Date()}
                  onChange={dateSelect}
                />
              </div>
            </div>
            <div className="col-sm-2">
              <div>
                <Input
                  lable="House No"
                  id="House No"
                  placeholder=" "
                  name="HouseNo"
                  type="text"
                  max={50}
                  value={EmployeeMaster?.HouseNo}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-sm-2">
              <Input
                lable="Street Name"
                id="Street Name"
                placeholder=" "
                name="StreetName"
                max={50}
                type="text"
                value={EmployeeMaster?.StreetName}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-2">
              <Input
                name="Locality"
                type="text"
                max={50}
                value={EmployeeMaster?.Locality}
                onChange={handleChange}
                lable="Locality"
                id="Locality"
                placeholder=" "
              />
            </div>
          </div>
          <div className="row pt-2 pl-2 pr-2">
            <div className="col-sm-2">
              <Input
                name="Pincode"
                type="number"
                value={EmployeeMaster?.Pincode}
                onChange={handleChange}
                onInput={(e) => number(e, 6)}
                lable="Pincode"
                id="Pincode"
                placeholder=" "
              />
            </div>
            <div className="col-sm-2">
              <Input
                name="City"
                type="text"
                max={50}
                value={EmployeeMaster?.City}
                onChange={handleChange}
                lable="City"
                id="City"
                placeholder=" "
              />
            </div>
            <div className="col-sm-2 ">
              <Input
                name="Mobile"
                type="text"
                className="required-fields"
                onInput={(e) => number(e, 10)}
                value={EmployeeMaster?.Mobile}
                onChange={handleChange}
                lable="Mobile"
                id="Mobile"
                placeholder=" "
              />
              {!EmployeeMaster?.Mobile && (
                <span className="error-message">{error?.Mobile}</span>
              )}
              {EmployeeMaster?.Mobile?.length > 0 &&
                EmployeeMaster?.Mobile?.length < 10 && (
                  <span className="error-message">{error?.Mobile2}</span>
                )}
            </div>
            <div className="col-sm-2">
              <Input
                name="Email"
                value={EmployeeMaster?.Email}
                onChange={handleChange}
                max={50}
                lable="Email"
                id="Email"
                placeholder=" "
                type="email"
              />
            </div>
            <div className="col-sm-2">
              <Input
                value={useLocalStorage("userData", "get").CompanyCode}
                readOnly={true}
                lable="Company Code"
                id="Company Code"
                placeholder=" "
              />
            </div>
            <div className="col-sm-2">
              <Input
                name="Username"
                value={EmployeeMaster?.Username}
                onChange={handleChange}
                max={50}
                className="required-fields"
                // onBlur={(e) => {
                //   DuplicateUsername("Employee/checkDublicateUserName");
                //   handleBlur(e);
                // }}
                type="text"
                autoComplete={"off"}
                lable="User Name"
                id="User Name"
                placeholder=" "
              />
              {!EmployeeMaster?.Username && (
                <span className="error-message">{error?.Username}</span>
              )}
            </div>
          </div>
          <div className="row pt-2 pl-2 pr-2">
            {/* {!state?.id && (
              <>
                <div className="col-sm-2">
                  <Input
                    name="Password"
                    className="required-fields"
                    type="password"
                    max={50}
                    value={EmployeeMaster?.Password}
                    onChange={handleChange}
                    lable="Password"
                    id="Password"
                    placeholder=" "
                  />
                  {!passwordRegex.test(EmployeeMaster?.Password) && (
                    <span className="error-message">{error?.Password}</span>
                  )}
                </div>
              </>
            )} */}

            {!state?.id ? (
              <div className="col-sm-2">
                <Input
                  name="Password"
                  className="required-fields"
                  type="password"
                  max={50}
                  value={EmployeeMaster?.Password}
                  onChange={handleChange}
                  lable="Password"
                  id="Password"
                  placeholder=" "
                />
                {!passwordRegex.test(EmployeeMaster?.Password) && (
                  <span className="error-message">{error?.Password}</span>
                )}
              </div>
            ) : (
              <div className="col-sm-2">
                <Input
                  name="Password"
                  type="password"
                  max={50}
                  value={EmployeeMaster?.Password}
                  onChange={handleChange}
                  lable="Password"
                  id="Password"
                  placeholder=" "
                />
                {!passwordRegex.test(EmployeeMaster?.Password) && (
                  <span className="error-message">{error?.Password}</span>
                )}
              </div>
            )}

            {state?.id && (
              <>
                <div className="col-sm-2">
                  <Input
                    lable="Employee Code"
                    id="Employee Code"
                    placeholder=" "
                    name="EmpCode"
                    type="text"
                    max={50}
                    value={EmployeeMaster?.EmpCode}
                    onChange={handleChange}
                    disabled={true}
                  />
                </div>
              </>
            )}
            <div className="col-sm-1 mt-1 d-flex">
              <div className="mt-1">
                <input
                  id="isLoginApprovel"
                  name="isLoginApprovel"
                  type="checkbox"
                  checked={EmployeeMaster?.isLoginApprovel}
                  onChange={handleInputChange}
                />
              </div>
              <label className="ml-2" htmlFor="isLoginApprovel">
                {t("LoginApproval")}
              </label>
            </div>
            <div className="col-sm-2 mt-1 d-flex">
              <div className="mt-1">
                <input
                  id="isPasswordChanged"
                  name="isPasswordChanged"
                  type="checkbox"
                  checked={EmployeeMaster?.isPasswordChanged}
                  onChange={handleInputChange}
                />
              </div>
              <label className="ml-2" htmlFor="isPasswordChanged">
                {t("Can Change Password")}
              </label>
            </div>
            <div className="col-sm-1 mt-1 d-flex">
              <div className="mt-1">
                <input
                  id="canRefund"
                  name="canRefund"
                  type="checkbox"
                  checked={EmployeeMaster?.canRefund}
                  onChange={handleInputChange}
                />
              </div>
              <label className="ml-2" htmlFor="canRefund">
                {t("CanRefund")}
              </label>
            </div>
            <div className="col-sm-2 mt-1 d-flex">
              <div className="mt-1">
                <input
                  id="canDiscountAfterBill"
                  name="canDiscountAfterBill"
                  type="checkbox"
                  checked={EmployeeMaster?.canDiscountAfterBill}
                  onChange={handleInputChange}
                />
              </div>
              <label className="ml-2" htmlFor="canDiscountAfterBill">
                {t("Can Discount After Bill")}
              </label>
            </div>
            <div className="col-sm-1 mt-1 d-flex">
              <div className="mt-1">
                <input
                  id="canSettlement"
                  name="canSettlement"
                  type="checkbox"
                  checked={EmployeeMaster?.canSettlement}
                  onChange={handleInputChange}
                />
              </div>
              <label className="ml-2" htmlFor="canSettlement">
                {t("CanSettlement")}
              </label>
            </div>
            <div className="col-sm-1 mt-1 d-flex">
              <div className="mt-1">
                <input
                  id="HideRate"
                  name="HideRate"
                  type="checkbox"
                  checked={EmployeeMaster?.HideRate}
                  onChange={handleInputChange}
                />
              </div>
              <label className="ml-2" htmlFor="HideRate">
                {t("HideRate")}
              </label>
            </div>
            <div className="col-sm-1 mt-1 d-flex">
              <div className="mt-1">
                <input
                  id="ProEmployee"
                  name="ProEmployee"
                  type="checkbox"
                  checked={EmployeeMaster?.ProEmployee}
                  onChange={handleInputChange}
                />
              </div>
              <label className="ml-2" htmlFor="ProEmployee">
                {t("ProEmployee")}
              </label>
            </div>
          </div>
          <div className="row pt-2 pl-2 pr-2">
            <div className="col-sm-1 mt-1 d-flex">
              <div className="mt-1">
                <input
                  id="AllowDiscount"
                  name="AllowDiscount"
                  type="checkbox"
                  checked={EmployeeMaster?.AllowDiscount}
                  onChange={handleInputChange}
                />
              </div>
              <label className="ml-2" htmlFor="AllowDiscount">
                {t("AllowDiscount")}
              </label>
            </div>
            <div className="col-sm-1 mt-1 d-flex">
              <div className="mt-1">
                <input
                  id="AMRAccess"
                  name="AMRAccess"
                  type="checkbox"
                  checked={EmployeeMaster?.AMRAccess}
                  onChange={handleInputChange}
                />{" "}
              </div>
              <label className="ml-2" htmlFor="AMRAccess">
                {t("AMRAccess")}
              </label>
            </div>
            <div className="col-sm-1 mt-1 d-flex">
              <div className="mt-1">
                <input
                  id="UnMasking"
                  name="UnMasking"
                  type="checkbox"
                  checked={EmployeeMaster?.UnMasking}
                  onChange={handleInputChange}
                />
              </div>
              <label className="ml-2" htmlFor="UnMasking">
                {t("UnMasking")}
              </label>
            </div>
            <div className="col-sm-2 mt-1 d-flex">
              <div className="mt-1">
                <input
                  id="SaveAmendmentAprove"
                  name="SaveAmendment"
                  type="checkbox"
                  checked={EmployeeMaster?.SaveAmendment}
                  onChange={handleInputChange}
                />
              </div>
              <label className="ml-2" htmlFor="SaveAmendmentAprove">
                {t("Save/Approve amendment")}
              </label>
            </div>

            <div className="col-sm-2 mt-1  d-flex">
              <div className="mt-1">
                <input
                  name="ShowDashboard"
                  type="checkbox"
                  disabled={EmployeeMaster?.ProEmployee == 1 ? true : false}
                  checked={EmployeeMaster?.ShowDashboard}
                  onChange={handleInputChange}
                />
              </div>
              <label className="ml-2" htmlFor="ShowDashboard">
                {t("AccessDashboard")}
              </label>
            </div>

            {CompanyCode?.toLowerCase() == "itd" && (
              <>
                {" "}
                <div className="col-sm-2 mt-1 ml-2 d-flex">
                  <div className="mt-1">
                    <input
                      name="DownTimePointsReviewRight"
                      type="checkbox"
                      checked={EmployeeMaster?.DownTimePointsReviewRight}
                      onChange={handleInputChange}
                    />
                  </div>
                  <label className="ml-2" htmlFor="DownTimePointsReviewRight">
                    {t("DownTimePointsReviewRight")}
                  </label>
                </div>
                <div className="col-sm-2 mt-1 d-flex">
                  <div className="mt-1">
                    <input
                      name="DownTimePointsApprovalRight"
                      type="checkbox"
                      checked={EmployeeMaster?.DownTimePointsApprovalRight}
                      onChange={handleInputChange}
                    />
                  </div>
                  <label className="ml-2" htmlFor="DownTimePointsApprovalRight">
                    {t("DownTimePointsApprovalRight")}
                  </label>
                </div>
              </>
            )}
            <div className="col-sm-2 mt-1 d-flex">
              <div className="mt-1">
                <input
                  name="OnAppGoToMainList"
                  type="checkbox"
                  checked={EmployeeMaster?.OnAppGoToMainList}
                  onChange={handleInputChange}
                />
              </div>
              <label className="ml-2" htmlFor="OnAppGoToMainList">
                {t("OnApproveGoToMainList")}
              </label>
            </div>
          </div>
        </Accordion>
        <Accordion title={t("Access Details")} defaultValue={true}>
          <div className="row pt-2 pl-2 pr-2">
            <div className="col-sm-2">
              <SelectBoxWithCheckbox
                lable="Department"
                className="required-fields"
                id="Department"
                placeholder=" "
                name="Department"
                options={Department}
                value={EmployeeMaster?.Department}
                onChange={handleChanges}
              />
              {(!EmployeeMaster?.Department ||
                EmployeeMaster?.Department?.length == 0) && (
                <span className="error-message">{error?.Department}</span>
              )}
            </div>
            <div className="col-sm-2">
              <SelectBoxWithCheckbox
                lable="Centre"
                id="Centre"
                className="required-fields"
                placeholder=" "
                name="Centre"
                options={EmployeeCenter}
                value={EmployeeMaster?.Centre}
                onChange={handleMultiSelect}
                depends={setCentreId}
              />
              {(!EmployeeMaster?.Centre ||
                EmployeeMaster?.Centre?.length == 0) && (
                <span className="error-message">{error?.Centre}</span>
              )}
            </div>
            <div className="col-sm-2">
              <SelectBoxWithCheckbox
                lable="AccessRight"
                id="AccessRight"
                // className="required-fields"
                placeholder=" "
                name="AccessRight"
                options={AccessRight}
                value={EmployeeMaster?.AccessRight}
                onChange={handleChanges}
              />
              {/* {(!EmployeeMaster?.AccessRight ||
                EmployeeMaster?.AccessRight?.length == 0) && (
                <span className="error-message">{error?.AccessRight}</span>
              )} */}
            </div>
            <div className="col-sm-2">
              <SelectBoxWithCheckbox
                // className="required-fields"
                lable="ApprovalRight"
                id="ApprovalRight"
                placeholder=" "
                name="ApprovalRight"
                options={ApprovalRight}
                value={EmployeeMaster?.ApprovalRight}
                onChange={handleChanges}
              />
              {/* {(!EmployeeMaster?.ApprovalRight ||
                  EmployeeMaster?.ApprovalRight?.length == 0) && (
                  <span className="error-message">{error?.ApprovalRight}</span>
                )} */}
            </div>
            <div className="col-sm-2">
              <SelectBox
                lable="Theme"
                id="Theme"
                name="Theme"
                className="required"
                options={Theme}
                selectedValue={EmployeeMaster?.Theme}
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-sm-2">
              <SelectBox
                lable="Language"
                id="EmpLanguageCode"
                name="EmpLanguageCode"
                className="required"
                options={languages}
                selectedValue={EmployeeMaster?.EmpLanguageCode}
                onChange={handleSelectChange}
              />
            </div>
          </div>
          <div className="row pt-2 pl-2 pr-2 pb-2">
            <div className="col-sm-2">
              <button
                className="btn btn-block btn-info btn-sm"
                type="button"
                id="btnUpload"
                onClick={() => {
                  setShow(true);
                }}
              >
                {t("Attach Signature")}
              </button>
            </div>
            <div className="col-sm-2">
              <button
                className="btn btn-block btn-info btn-sm"
                type="button"
                onClick={() => {
                  setUploadImage({ ...uploadImage, show: true });
                }}
              >
                {t("Upload Employee Image")}
              </button>
            </div>
          </div>
        </Accordion>
        <Accordion title={t("Professional Details")} defaultValue={true}>
          <div className="row pt-2 pl-2 pr-2">
            <div className="col-sm-2">
              <SelectBox
                lable="Centre"
                id="CentreID"
                name="CentreID"
                className="required-fields"
                options={centreId}
                selectedValue={EmployeeMaster?.CentreID}
                onChange={handleSelectChange}
              />
              {!EmployeeMaster?.CentreID && (
                <span className="error-message">{error?.CentreID}</span>
              )}
            </div>
            <div className="col-sm-2">
              <SelectBox
                lable="Designation"
                id="Designation"
                name="Designation"
                className="required"
                options={Designation}
                selectedValue={EmployeeMaster?.DesignationID}
                onChange={handleSelectChange}
                isDisabled={EmployeeMaster?.ProEmployee == 1 ? true : false}
              />
            </div>
          </div>
        </Accordion>

        <Accordion title={t("Permanent Details")} defaultValue={true}>
          <div className="row pt-2 pl-2 pr-2">
            <div className="col-sm-2">
              <div>
                <Input
                  name="PHouseNo"
                  type="text"
                  max={50}
                  lable="Permanent HouseNo"
                  id="PHouseNo"
                  placeholder=" "
                  value={EmployeeMaster?.PHouseNo}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-sm-2">
              <Input
                name="PStreetName"
                value={EmployeeMaster?.PStreetName}
                type="text"
                max={50}
                lable="Permanent StreetName"
                id="PStreetName"
                placeholder=" "
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-2">
              <Input
                name="PLocality"
                value={EmployeeMaster?.PLocality}
                type="text"
                max={50}
                lable="Permanent Locality"
                id="PLocality"
                placeholder=" "
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-2">
              <div>
                <Input
                  name="PPincode"
                  value={EmployeeMaster?.PPincode}
                  type="number"
                  lable="Permanent Pincode"
                  id="Pincode"
                  placeholder=" "
                  onChange={handleChange}
                  onInput={(e) => number(e, 6)}
                />
              </div>
            </div>
            <div className="col-sm-2">
              <div>
                <Input
                  name="PCity"
                  value={EmployeeMaster?.PCity}
                  type="text"
                  max={50}
                  lable="Permanent City"
                  id="PCity"
                  placeholder=" "
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-sm-1  mt-1 d-flex">
              <div className="mt-1">
                <input
                  name="isActive"
                  type="checkbox"
                  checked={EmployeeMaster?.isActive}
                  onChange={handleInputChange}
                />
              </div>
              <label className="control-label ml-2" htmlFor="IsLogin">
                {t("Active")}
              </label>
            </div>
          </div>
          <div className="row pt-2 pl-2 pr-2 pb-2">
            <div className="col-sm-2">
              {EditData || load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={handleSubmit}
                  type="submit"
                >
                  {state?.button ? t(state?.button) : t("Submit")}
                </button>
              )}
            </div>
            <div className="col-sm-1">
              <Link to="/EmployeeMaster">{t("Back to List")}</Link>
            </div>
          </div>
        </Accordion>
      </>
    </>
  );
};

export default CreateEmployeeMaster;
