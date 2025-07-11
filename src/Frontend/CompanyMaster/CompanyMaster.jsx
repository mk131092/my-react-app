import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { axiosInstance } from "../../utils/axiosInstance";
import { guidNumber } from "../util/Commonservices";
import {
  getTrimmedData,
  number,
  PreventSpecialCharacter,
} from "../../utils/helpers";
import { CompanyMasterValidation } from "../../utils/Schema";
import UploadFile from "../utils/UploadFileModal/UploadFile";
import Input from "../../components/formComponent/Input";
import Loading from "../../components/loader/Loading";
import Accordion from "@app/components/UI/Accordion";
import { SelectBox } from "../../components/formComponent/SelectBox";
import { CompanyBillingCycle } from "../../utils/Constants";

const CompanyMaster = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [BillingType, setBillingType] = useState([]);
  const [GraceType, setGraceType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    CompanyId: "",
    CompanyCode: "",
    CompanyName: "",
    Country: "",
    State: "",
    City: "",
    Email: "",
    PhoneNo: "",
    Phone2: "",
    Address1: "",
    Address2: "",
    Address3: "",
    isPrefixRequired: 0,
    companyGUID: guidNumber(),
    SelectType: "1",
    GraceDays: 0,
    Mobile1: "",
    Mobile2: "",
    BillingType: "Monthly",
    IsShareRequired: 0,
    IsSmsRequired: 0,
    IsEmailRequired: 0,
    IsWhatsappRequired: 0,
    SkipMicLabEntry: 0,
    ModifiedRegDate: 0,
    SampleCollectionAndDepartmentRecieve: 0,
    DirectB2B: 0,
    CompanyLogo: guidNumber(),
    pincode: "",
    isRolewise: 0,
  });

  const [showMobile2, setShowMobile2] = useState(false);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const handleMobileFun = (type) => {
    if (type === "ADD") {
      setShowMobile2(true);
    } else {
      setShowMobile2(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (["CompanyCode"].includes(name)) {
      setPayload({
        ...payload,
        [name]: value.trim().toUpperCase(),
      });
    } else if (name === "Country" || name === "City") {
      setPayload({
        ...payload,
        [name]: PreventSpecialCharacter(value)
          ? value.trimStart()
          : payload[name],
      });
    } else if (["CompanyName"].includes(name)) {
      setPayload({
        ...payload,
        [name]: PreventSpecialCharacter(value)
          ? value.trimStart().toUpperCase()
          : payload[name],
      });
    } else if (["Email"].includes(name)) {
      setPayload({
        ...payload,
        [name]: value.trim(),
      });
    } else {
      setPayload({
        ...payload,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
      });
    }
  };

  const BindBillingDropDown = (value) => {
    if (value === "PostPaid") {
      getGlobalData("BillingType");
    } else if (value === "PrePaid") {
      setBillingType([]);
    }
  };
  const getBilling = (value) => {
    const values = CompanyBillingCycle?.filter((ele) => ele?.value == value);
    return values[0]?.label;
  };
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (name == "SelectType") {
      setPayload({ ...payload, [name]: value, BillingType: getBilling(value) });
    } else {
      setPayload({ ...payload, [name]: value });
    }
  };
  console.log(payload);

  const getGlobalData = (name) => {
    axiosInstance
      .post("Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res?.data?.message;
        console.log(data);
        let value = data?.map((ele) => {
          return {
            value: ele?.FieldDisplay,
            label: ele?.FieldDisplay,
          };
        });
        switch (name) {
          case "BillingType":
            setBillingType(value);
            break;
          case "GraceType":
            setGraceType(value);
            break;
          default:
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  const fetch = (id) => {
    setLoading(true);
    axiosInstance
      .post(state?.url, {
        CompanyId: id,
      })
      .then((res) => {
        setLoading(false);
        const data = res?.data?.message[0];
        const guid = res?.data?.guId[0]?.GuId || "";
        setPayload({
          ...data,
          companyGUID: guid,
          FirstLastPage: data?.FirstLastPage ?? 0,
          CompanyLogo:
            data?.CompanyLogo && data?.CompanyLogo !== ""
              ? data?.CompanyLogo
              : guidNumber(),
          pincode: "",
        });
      })
      .catch((err) => {
        setLoading(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  useEffect(() => {
    if (state?.data) {
      fetch(state?.data);
    }
  }, []);

  const { values, errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: { ...payload },
    enableReinitialize: true,
    validationSchema: CompanyMasterValidation,
    onSubmit: (values) => {
      setLoading(true);
      axiosInstance
        .post(
          state?.url
            ? "CompanyMaster/UpdateCompanyMaster"
            : "CompanyMaster/SaveCompanyMaster",
          getTrimmedData(payload)
        )
        .then((res) => {
          if (res?.data?.success) {
            navigate(`/CompanyMasterList`);
            toast.success(res?.data?.message);
          } else {
            toast.error(res?.data?.message);
          }
          setLoading(false);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Wents Wrong."
          );
          setLoading(false);
        });
    },
  });

  useEffect(() => {
    getGlobalData("GraceType");
  }, []);

  const handleRadioChange = (event) => {
    const { name, value } = event?.target;
    setPayload({ ...payload, [name]: Number(value) });
  };
  return (
    <>
      <>
        {show && (
          <UploadFile
            show={show}
            handleClose={() => setShow(false)}
            documentId={payload?.companyGUID}
            pageName="CompanyMaster"
          />
        )}
      </>
      <>
        {show2 && (
          <UploadFile
            show={show2}
            handleClose={() => setShow2(false)}
            documentId={payload?.CompanyLogo}
            pageName="CompanyLogo"
            ChangeApi={true}
            CompanyId={payload?.CompanyId}
          />
        )}
      </>
      <Accordion
        name={t("Company Master")}
        isBreadcrumb={true}
        defaultValue={true}
      >
        <div className="row px-2 mt-2 mb-1">
          <div className="col-sm-2 col-md-2">
            <Input
              disabled={state?.other?.button ? true : false}
              lable="CompanyCode"
              placeholder=" "
              id="CompanyCode"
              className="required-fields"
              type="text"
              name="CompanyCode"
              value={payload?.CompanyCode}
              onChange={handleChange}
              onBlur={handleBlur}
              max={10}
              onInput={(e) => number(e, 10)}
            />
            {errors?.CompanyCode && touched?.CompanyCode && (
              <span className="error-message">{errors?.CompanyCode}</span>
            )}
          </div>

          <div className="col-sm-2 col-md-2">
            <Input
              lable="Company Name"
              placeholder=" "
              id="Company Name"
              type="text"
              className="required-fields"
              name="CompanyName"
              value={payload?.CompanyName}
              onBlur={handleBlur}
              onChange={handleChange}
              max={60}
            />
            {errors?.CompanyName && touched?.CompanyName && (
              <span className="error-message">{errors?.CompanyName}</span>
            )}
          </div>
          <div className="col-sm-2 col-md-2">
            <Input
              lable="Country"
              placeholder=" "
              id="Country"
              onChange={handleChange}
              value={payload?.Country}
              name="Country"
              type="text"
              max={25}
            />
          </div>

          <div className="col-sm-2 col-md-2">
            <Input
              lable="State"
              placeholder=" "
              id="State"
              onChange={handleChange}
              value={payload?.State}
              name="State"
              type="text"
              max={25}
            />
          </div>
          <div className="col-sm-2 col-md-2">
            <Input
              lable="City"
              placeholder=" "
              id="City"
              onChange={handleChange}
              value={payload?.City}
              name="City"
              type="text"
              max={25}
            />
          </div>

          <div className="col-sm-2 col-md-2">
            <Input
              lable="Email"
              placeholder=" "
              id="Email"
              onChange={handleChange}
              value={payload?.Email}
              name="Email"
              type="email"
              max={50}
              onBlur={handleBlur}
              required
            />
            {errors?.Email && touched?.Email && (
              <span className="error-message">{errors?.Email}</span>
            )}
          </div>
        </div>
        <div className="row px-2  mb-1">
          <div className="col-sm-2 col-md-2">
            <Input
              lable="Phone No"
              placeholder=" "
              id="Phone No"
              onInput={(e) => number(e, 10)}
              type="number"
              name="PhoneNo"
              value={payload?.PhoneNo}
              onChange={handleChange}
            />
          </div>

          <div className="col-sm-2 col-md-2">
            <Input
              lable="Land Line No."
              placeholder=" "
              id="Landline"
              name="Phone2"
              value={payload?.Phone2}
              onChange={handleChange}
            />
          </div>

          <div className="col-sm-2 col-md-2">
            <div className="d-flex">
              <div style={{ width: "88%" }}>
                <Input
                  onInput={(e) => number(e, 10)}
                  lable="Mobile No"
                  placeholder=" "
                  className="required-fields"
                  id="Mobile No"
                  type="number"
                  name="Mobile1"
                  value={payload?.Mobile1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>{" "}
              <div style={{ width: "10%" }}>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => handleMobileFun("ADD")}
                >
                  {" "}
                  <i className="fa fa-plus-circle fa-sm new_record_pluse"></i>
                </button>{" "}
              </div>
            </div>
            {errors?.Mobile1 && touched?.Mobile1 && (
              <span className="error-message">{errors?.Mobile1}</span>
            )}
            {showMobile2 && (
              <div className="d-flex">
                <div style={{ width: "88%" }}>
                  <Input
                    onInput={(e) => number(e, 10)}
                    className="select-input-box form-control input-sm"
                    id="Mobile2"
                    lable="Mobile2"
                    placeholder=" "
                    type="number"
                    name="Mobile2"
                    value={payload?.Mobile2}
                    onChange={handleChange}
                  />
                </div>{" "}
                <div style={{ width: "10%" }}>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => handleMobileFun("DELETE")}
                  >
                    {" "}
                    <i className="fa fa-minus fa-sm new_record_pluse"></i>
                  </button>{" "}
                </div>
              </div>
            )}
            <div>
              {errors?.Mobile2 && touched?.Mobile2 && (
                <span className="error-message">{errors?.Mobile2}</span>
              )}
            </div>
          </div>

          <div className="col-sm-2 col-md-2">
            <Input
              lable="Address1"
              placeholder=" "
              id="Address1"
              onChange={handleChange}
              value={payload?.Address1}
              name="Address1"
              type="text"
              max={50}
            />
          </div>

          <div className="col-sm-2 col-md-2">
            <Input
              lable="Address2"
              placeholder=" "
              id="Address2"
              onChange={handleChange}
              value={payload?.Address2}
              name="Address2"
              type="text"
              max={50}
            />
          </div>

          <div className="col-sm-2 col-md-2">
            <Input
              lable="Address3"
              placeholder=" "
              id="Address3"
              onChange={handleChange}
              value={payload?.Address3}
              name="Address3"
              type="text"
              max={50}
            />
          </div>
        </div>

        <div className="row px-2 mb-1">
          <div className="col-sm-2 col-md-2 ">
            <SelectBox
              options={CompanyBillingCycle}
              name="SelectType"
              id="SelectType"
              lable="BillingType"
              selectedValue={payload?.SelectType}
              onChange={handleSelectChange}
            />
          </div>
          <div className="col-sm-1 d-flex">
            <div className="mt-1">
              <input
                type="checkbox"
                name="isPrefixRequired"
                onChange={handleChange}
                checked={payload?.isPrefixRequired ? true : false}
              />
            </div>
            &nbsp;
            <label>{t("isPrefixReq.")}</label>
          </div>
          <div className="col-sm-1 d-flex ">
            <div className="mt-1">
              <input
                type="checkbox"
                name="IsShareRequired"
                onChange={handleChange}
                checked={payload?.IsShareRequired ? true : false}
              />
            </div>
            &nbsp;
            <label>{t("IsShareReq.")}</label>
          </div>
          <div className="col-sm-1 d-flex">
            <div className="mt-1">
              <input
                type="checkbox"
                name="IsSmsRequired"
                onChange={handleChange}
                checked={payload?.IsSmsRequired ? true : false}
              />
            </div>

            <label>{t("IsSmsReq.")}</label>
          </div>
          <div className="col-sm-1 d-flex">
            <div className="mt-1">
              <input
                type="checkbox"
                name="IsEmailRequired"
                onChange={handleChange}
                checked={payload?.IsEmailRequired ? true : false}
              />
            </div>
            &nbsp;
            <label>{t("IsEmailReq.")}</label>
          </div>{" "}
          <div className="col-sm-1 d-flex">
            <div className="mt-1">
              <input
                type="checkbox"
                name="SkipMicLabEntry"
                onChange={handleChange}
                checked={payload?.SkipMicLabEntry ? true : false}
              />
            </div>
            &nbsp;
            <label>{t("SkipMicrolab.")}</label>
          </div>
          <div className="col-sm-1 d-flex">
            <div className="mt-1">
              <input
                type="checkbox"
                name="IsWhatsappRequired"
                onChange={handleChange}
                checked={payload?.IsWhatsappRequired ? true : false}
              />
            </div>
            &nbsp;
            <label>{t("WhatsappReq.")}</label>
          </div>
          <div className=" col-sm-2 d-flex">
            <div className="mt-1">
              <input
                type="checkbox"
                name="ModifiedRegDate"
                onChange={handleChange}
                checked={payload?.ModifiedRegDate ? true : false}
              />
            </div>
            &nbsp;
            <label>{t("IsModifyPatientRegisterationDate")}</label>
          </div>
          <div className="col-sm-2 d-flex">
            <div className="mt-1">
              <input
                type="checkbox"
                name="AllowMultipleBooking"
                onChange={handleChange}
                checked={payload?.AllowMultipleBooking ? true : false}
              />
            </div>
            &nbsp;
            <label>{t("AllowMultipleBooking")}</label>
          </div>
        </div>
        <div className="row px-2 mb-1">
          <div className="col-sm-4 d-flex">
            <div className="mt-1">
              <input
                type="checkbox"
                name="SampleCollectionAndDepartmentRecieve"
                onChange={handleChange}
                checked={
                  payload?.SampleCollectionAndDepartmentRecieve ? true : false
                }
              />
            </div>
            &nbsp;
            <label>
              {t("SkipSampleCollection&DepartmentRecieve for CultureTest")}
            </label>
          </div>
          <div className="col-sm-1 d-flex">
            <div className="mt-1">
              <input
                type="checkbox"
                name="DirectB2B"
                onChange={handleChange}
                checked={payload?.DirectB2B ? true : false}
              />
            </div>
            &nbsp;
            <label>{t("DirectB2B")}</label>
          </div>
          {/* <div className="col-sm-4 d-flex">
            <label className="mr-4">{t("IsMenuRole")}</label>
            <div className="mr-3">
              <input
                type="radio"
                name="isRolewise"
                value={"0"}
                checked={payload?.isRolewise === 0}
                onChange={handleRadioChange}
              ></input>
              <label className="ml-2">{t("DesignationWise")}</label>
            </div>
            <div className="">
              <input
                type="radio"
                name="isRolewise"
                value={"1"}
                checked={payload?.isRolewise === 1}
                onChange={handleRadioChange}
              ></input>
              <label className="ml-2">{t("RoleWise")}</label>
            </div>
          </div> */}
        </div>
        <div className="row px-2 mb-2">
          <div className="col-sm-2">
            <button
              className="btn btn-sm btn-block btn-primary"
              onClick={() => setShow2(true)}
            >
              {t("Upload Company Logo")}
            </button>
          </div>
          <div className="col-sm-1">
            {loading ? (
              <Loading />
            ) : (
              <>
                <button
                  className="btn btn-block btn-sm btn-success"
                  onClick={handleSubmit}
                  type="submit"
                >
                  {state?.other?.button ? t(state?.other?.button) : t("Save")}
                </button>
              </>
            )}
          </div>
          <div className="col-sm-2">
            <Link to={`/CompanyMasterList`} style={{ fontSize: "13px" }}>
              {t("Back to List")}
            </Link>
          </div>
        </div>
      </Accordion>
    </>
  );
};

export default CompanyMaster;
