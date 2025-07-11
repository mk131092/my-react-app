import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import Accordion from "@app/components/UI/Accordion";
import Input from "../../components/formComponent/Input";
import { SelectBox } from "../../components/formComponent/SelectBox";
import { number } from "../../utils/helpers";
import moment from "moment";
import DatePicker from "../../components/formComponent/DatePicker";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";
import { Link } from "react-router-dom";
import UploadFile from "../utils/UploadFileModal/UploadFile";

const MembershipCardMaster = () => {
  const { t } = useTranslation();
  const [load, setLoad] = useState({ save: false, table: false });
  const [isUpdate, setIsUpdate] = useState(false);
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [DateData, setDateData] = useState({
    AgeYear: "",
    AgeDays: "",
    AgeMonth: "",
  });
  const [payload, setPayload] = useState({
    CardName: "",
    Description: "",
    NoOfDependant: "",
    Amount: "",
    ValidYear: "",
    ValidMonth: "",
    ValidDays: "",
    logobase64: "",
    ValidUpto: new Date().now,
    IsActive: "1",
  });

  const handleChange = (e) => {
    const { name, value } = e?.target;
    if (name === "CardName") {
      setPayload({
        ...payload,
        [name]: value.trimStart(),
      });
    } else if (name === "Description") {
      setPayload({
        ...payload,
        [name]: value.trimStart(),
      });
    } else {
      setPayload({ ...payload, [name]: value });
    }
  };

  const NoOfDependantPerson = [
    {
      label: "Select",
      value: "",
    },
    {
      label: 1,
      value: 1,
    },
    {
      label: 2,
      value: 2,
    },
    {
      label: 3,
      value: 3,
    },
    {
      label: 4,
      value: 4,
    },
    {
      label: 5,
      value: 5,
    },
    {
      label: 6,
      value: 6,
    },
    {
      label: 7,
      value: 7,
    },
    {
      label: 8,
      value: 8,
    },
  ];

  const handleCalculate = (e) => {
    const { name, value } = e.target;
    let diff = {};
    if (name === "ValidYear") {
      diff = moment().add(value, "years");
      setDateData({
        ...DateData,
        AgeYear: diff?._d,
      });
    }

    if (name === "ValidMonth") {
      diff = moment(DateData?.AgeYear || new Date().now).add(value, "months");
      setDateData({
        ...DateData,
        AgeMonth: diff?._d,
      });
    }

    if (name === "ValidDays") {
      diff = moment(DateData?.AgeMonth || new Date().now).add(value, "days");
      setDateData({
        ...DateData,
        AgeDays: diff?._d,
      });
    }

    setPayload({
      ...payload,
      [name]: value,
      ValidUpto: diff?._d,
    });
  };

  const validationMembership = () => {
    let errors = "";
    if (payload?.CardName === "") {
      errors = { ...errors, CardName: "Please enter CardName." };
    }
    if (payload?.Amount?.length === 0) {
      errors = { ...errors, Amount: "Please enter CardAmount." };
    }
    if (payload?.NoOfDependant === "") {
      errors = {
        ...errors,
        NoOfDependant: "Please enter Total Dependant Person.",
      };
    }
    if (payload?.Description === "") {
      errors = { ...errors, Description: "Please enter Description." };
    }
    if (payload?.ValidYear === "") {
      errors = { ...errors, ValidYear: "Please enter Validity." };
    }
    return errors;
  };
  function areDatesEqualWithoutTime(date1, date2) {
    const datePart1 = new Date(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    );
    const datePart2 = new Date(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate()
    );
    return datePart1.getTime() === datePart2.getTime();
  }

  const handleSave = async () => {
    setLoad({ ...load, save: true });
    const generatedError = validationMembership();
    if (generatedError === "") {
      setErrors({});

      if (areDatesEqualWithoutTime(new Date(payload?.ValidUpto), new Date())) {
        toast.error("Enter valid Validity");
        setLoad({ ...load, save: false });
      } else {
        await axiosInstance
          .post("MembershipCardMaster/SaveMembershiCardData", {
            CardName: payload?.CardName,
            Description: payload?.Description,
            NoOfDependant: payload?.NoOfDependant.toString(),
            Amount: payload?.Amount.toString(),
            IsActive: payload?.IsActive ? 1 : 0,
            ValidYear: payload?.ValidYear,
            ValidMonth: payload?.ValidMonth,
            ValidDays: payload?.ValidDays,
            ValidUpTo: payload?.ValidUpto,
            Membershiplogo: payload?.logobase64,
            ID: "",
            Image: "",
          })
          .then((res) => {
            toast.success(res?.data?.message);
            setPayload({
              CardName: "",
              Description: "",
              NoOfDependant: "",
              Amount: "",
              ValidYear: "",
              ValidMonth: "",
              ValidDays: "",
              ValidUpto: new Date().now,
              Membershiplogo: "",
              IsActive: "1",
            });
            handletableData();
            setLoad({ ...load, save: false });
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Something went wrong."
            );
            setLoad({ ...load, save: false });
          });
      }
    } else {
      setErrors(generatedError);
      setLoad({ ...load, save: false });
    }
  };

  const handleUpdate = () => {
    setLoad({ ...load, save: true });
    const generatedError = validationMembership();
    if (generatedError === "") {
      setErrors({});
      if (areDatesEqualWithoutTime(new Date(payload?.ValidUpto), new Date())) {
        toast.error("Enter valid Validity");
        setLoad({ ...load, save: false });
      } else {
        const data = {
          CardName: payload?.CardName,
          Description: payload?.Description,
          NoOfDependant: payload?.NoOfDependant.toString(),
          Amount: payload?.Amount.toString(),
          IsActive: payload?.IsActive ? 1 : 0,
          ValidYear: payload?.ValidYear,
          ValidMonth: payload?.ValidMonth,
          ValidDays: payload?.ValidDays,
          ValidUpTo: payload?.ValidUpto,
          ID: payload?.ID,
        };
        const MembershipData = [];
        MembershipData.push(data);
        axiosInstance
          .post("MembershipCardMaster/UpdateMembershiCardData", {
            CardName: payload?.CardName,
            Description: payload?.Description,
            NoOfDependant: payload?.NoOfDependant.toString(),
            Amount: payload?.Amount.toString(),
            IsActive: payload?.IsActive ? 1 : 0,
            ValidYear: payload?.ValidYear,
            ValidMonth: payload?.ValidMonth,
            ValidDays: payload?.ValidDays,
            ValidUpTo: payload?.ValidUpto,
            Id: payload?.ID,
            Membershiplogo: payload?.logobase64,
            Image: "",
          })
          .then((res) => {
            toast.success(res?.data?.message);
            setPayload({
              CardName: "",
              Description: "",
              NoOfDependant: "",
              Amount: "",
              ValidYear: "",
              ValidMonth: "",
              ValidDays: "",
              ValidUpto: new Date().now,
              IsActive: "1",
              Membershiplogo: "",
            });
            handletableData();
            setIsUpdate(false);
            setLoad({ ...load, save: false });
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Something went wrong."
            );
            setLoad({ ...load, save: false });
          });
      }
    } else {
      setErrors(generatedError);
      setLoad({ ...load, save: false });
    }
    // setLoad({ ...load, save: false });
  };

  const getItemTable = (ele) => {
    setIsUpdate(true);
    setPayload({
      CardName: ele?.CardName,
      Description: ele?.Description,
      NoOfDependant: ele?.No_of_dependant.toString(),
      Amount: ele?.Amount.toString(),
      IsActive: ele?.IsActive === 1 ? true : false,
      ValidYear: ele?.ValidYear,
      ValidMonth: ele?.ValidMonth,
      ValidDays: ele?.ValidDays,
      ValidUpto: new Date(ele?.ValidUpTo),
      logobase64: ele?.MembershipLogo,
      ID: ele?.ID,
    });
    setErrors({});
  };
  const UploadLogo = () => {};

  const handletableData = () => {
    setLoad({ ...load, table: true });
    axiosInstance
      .get("MembershipCardMaster/GetMembershiCardData")
      .then((res) => {
        setTableData(res?.data?.message);
        setLoad({ ...load, table: false });
      })
      .catch((err) => {
        console.log(err);
        setLoad({ ...load, table: false });
      });
  };
  console.log(load);
  const handleSelectChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setPayload({ ...payload, [name]: type === "checkbox" ? checked : value });
  };

  const handleBlur = (type) => {
    const err = validationMembership(payload, type, errors);
    setErrors(err);
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

  const handleCancel = () => {
    setIsUpdate(false);
    setPayload({
      CardName: "",
      Description: "",
      NoOfDependant: "",
      Amount: "",
      ValidYear: "",
      ValidMonth: "",
      ValidDays: "",
      ValidUpto: new Date().now,
      IsActive: "1",
    });
  };

  useEffect(() => {
    handletableData();
  }, []);
  return (
    <>
      {show && (
        <UploadFile
          show={show}
          pageName={"MembershipCardLogo"}
          documentId={payload?.logobase64}
          handleClose={() => setShow(false)}
        />
      )}
      <Accordion
        name={t("Membership Card Master")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row pt-2 pl-2 pr-2 mt-1">
          <div className="col-sm-2">
            <Input
              className="required-fields"
              type="text"
              name="CardName"
              id="CardName"
              placeholder=""
              max={30}
              value={payload?.CardName}
              onChange={handleChange}
              lable="Card Name"
            />
            {errors?.CardName && (
              <div className="error-message">{errors?.CardName}</div>
            )}
          </div>
          <div className="col-sm-2">
            <Input
              className="required-fields"
              type="text"
              name="Description"
              id="Description"
              placeholder=""
              max={50}
              value={payload?.Description}
              onChange={handleChange}
              lable="Description"
            />
            {errors?.Description && (
              <div className="error-message">{errors?.Description}</div>
            )}
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={NoOfDependantPerson}
              className="input-sm required-fields"
              name="NoOfDependant"
              id="NoOfDependant"
              placeholder=""
              onChange={handleChange}
              selectedValue={payload?.NoOfDependant}
              lable="No.of Dependant"
            />
            {errors?.NoOfDependant && (
              <div className="error-message">{errors?.NoOfDependant}</div>
            )}
          </div>
          <div className="col-sm-2">
            <Input
              className="required-fields"
              type="number"
              name="Amount"
              id="Amount"
              placeholder=""
              value={payload?.Amount}
              onInput={(e) => number(e, 16)}
              onChange={handleChange}
              lable="Card Amount"
            />
            {errors?.Amount && (
              <div className="error-message">{errors?.Amount}</div>
            )}
          </div>
          <div className="col-sm-2">
            <div className="d-flex">
              <div className="row">
                <div className="col-sm-3">
                  <label className="col-sm-14">{t("Validity")}</label>
                </div>
                <div className="col-sm-3">
                  <Input
                    //   className="required-fields"
                    style={{ width: "10px" }}
                    id="ValidYear"
                    name="ValidYear"
                    className="required-fields"
                    value={payload?.ValidYear}
                    onChange={handleCalculate}
                    type="number"
                    placeholder="Years"
                    onInput={(e) => number(e, 2, 20)}
                  />
                </div>
                <div className="col-sm-3">
                  <Input
                    id="ValidMonth"
                    name="ValidMonth"
                    className="required-fields"
                    value={payload?.ValidMonth}
                    disabled={!payload?.ValidYear}
                    onChange={handleCalculate}
                    type="number"
                    placeholder="Months"
                    onInput={(e) => number(e, 2, 12)}
                  />
                </div>
                <div className="col-sm-3">
                  <Input
                    id="ValidDays"
                    name="ValidDays"
                    className="required-fields"
                    type="number"
                    value={payload?.ValidDays}
                    onChange={handleCalculate}
                    disabled={!payload?.ValidMonth}
                    placeholder="Days"
                    onInput={(e) => number(e, 2, 31)}
                  />
                </div>
              </div>
            </div>
            {errors?.ValidYear && (
              <div className="error-message">{errors?.ValidYear}</div>
            )}
          </div>
          <div className="col-sm-2">
            <DatePicker
              className="custom-calendar"
              name="DOB"
              maxDate={new Date()}
              value={payload?.ValidUpto}
              disabled
              lable={t("Valid Upto")}
            />
          </div>
        </div>
        <div className="row pt-1 pl-2 pr-2 mb-1">
          <div className="col-sm-1">
            <button
              className="btn btn-primary btn-sm btn-block"
              onClick={() => {
                if (payload?.logobase64 == "" || payload?.logobase64 == null) {
                  setPayload({ ...payload, logobase64: guidNumber() });
                }
                console.log(payload);
                setShow(true);
              }}
            >
              {t("UploadLogo")}
            </button>
          </div>
          <label className="col-sm-1 d-flex align-items-cente">{t("Status")} :</label>
          <div className="col-sm-1 d-flex align-items-center">
            <input
              type="checkbox"
              name="IsActive"
              checked={payload?.IsActive}
              onChange={handleSelectChange}
            />
            <label className="col-sm-10">
              {payload?.IsActive ? t("Active"): t("De-Active")}
            </label>
          </div>
          {load.save ? (
            <Loading />
          ) : (
            <div className="col-sm-1">
              <button
                type="submit"
                id="btnSave"
                className="btn btn-success btn-sm btn-block"
                onClick={isUpdate ? handleUpdate : handleSave}
              >
                {isUpdate ? t("Update") : t("Save")}
              </button>
            </div>
          )}{" "}
          <div className="col-sm-1">
            {isUpdate ? (
              <button
                className="btn btn-sm btn-block btn-danger"
                onClick={handleCancel}
              >
                {t("Cancel")}
              </button>
            ) : (
              false
            )}
          </div>
        </div>
      </Accordion>
      <Accordion title={t("Search Data")} defaultValue={true}>
        {load.table ? (
          <Loading />
        ) : (
          <>
        
              <div>
                {tableData?.length > 0 && (
                  <Tables>
                    <thead>
                      <tr>
                        <th>{t("S.No")}</th>
                        <th>{t("Card Name")}</th>
                        <th>{t("Description")}</th>
                        <th>{t("No.of Dependant")}</th>
                        <th>{t("Card Amount")}</th>
                        <th>{t("Validity")}</th>
                        <th>{t("Valid UpTo")}</th>
                        <th>{t("Status")}</th>
                        <th>{t("Select")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData?.map((ele, index) => (
                        <tr key={index}>
                          <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                          <td data-title={t("Card Name")}>
                            {ele?.CardName}&nbsp;
                          </td>
                          <td data-title={t("Description")}>
                            {ele?.Description}&nbsp;
                          </td>
                          <td data-title={t("No.of Dependant")}>
                            {ele?.No_of_dependant}&nbsp;
                          </td>
                          <td data-title={t("Card Amount")}>
                            {ele?.Amount}&nbsp;
                          </td>
                          <td data-title={t("Validity")}>
                            {ele?.Validity}&nbsp;
                          </td>
                          <td data-title={t("Valid UpTo")}>
                            {ele?.ValidUpTo}&nbsp;
                          </td>
                          <td data-title={t("Status")}>{ele?.Active}&nbsp;</td>
                          <td>
                            <Link
                              className="text-primary"
                              style={{
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                              onClick={() => {
                                getItemTable(ele);
                              }}
                            >
                              {t("Edit")}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Tables>
                )}
              </div>
          
          </>
        )}
      </Accordion>
    </>
  );
};

export default MembershipCardMaster;
