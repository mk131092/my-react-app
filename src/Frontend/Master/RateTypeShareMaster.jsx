import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import { useTranslation } from "react-i18next";
import { isChecked } from "../util/Commonservices";
import { number } from "../../utils/helpers";
import Accordion from "@app/components/UI/Accordion";
import { SelectBox } from "../../components/formComponent/SelectBox";
import { Link } from "react-router-dom";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";
import Input from "../../components/formComponent/Input";
import RateTypeDefaultShareModal from "../utils/RateTypeDefaultShareModal";

const RateTypeShareMaster = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [Disable, setDisable] = useState(true);
  const [Department, setDepartment] = useState([]);
  const [RateTypeData, setRateTypeData] = useState([]);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [TableData, setTableData] = useState([]);
  const [payload, setPayload] = useState({
    RateTypeID: "",
    DepartmentID: "",
  });
  const { t } = useTranslation();

  console.log(TableData);
  const handleSelect = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  const getDepartment = (rate) => {
    axiosInstance
      .get("Department/getDepartment")
      .then((res) => {
        let data = res.data.message;
        let Department = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        setPayload({
          ...payload,
          RateTypeID: rate,
          DepartmentID: Department[0]?.value,
        });
        setDepartment(Department);
      })
      .catch((err) => console.log(err));
  };

  const getRateList = () => {
    axiosInstance
      .get("Centre/getRateList")
      .then((res) => {
        let data = res.data.message;
        let RateType = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        setRateTypeData(RateType);
        getDepartment(RateType[0]?.value);
      })
      .catch((err) => console.log(err));
  };

  const getRateTypeShare = () => {
    setLoading(true);
    axiosInstance
      .post("RateTypeShare/GetRateTypeShare", payload)
      .then((res) => {
        if (res.status === 200) {
          const data = res?.data?.message;
          const val = data.map((ele) => {
            return {
              ...ele,
              ShareAmount: Number(ele?.ShareAmount)?.toFixed(2),
              SharePer: Number(ele?.SharePer)?.toFixed(2),
              isChecked: false,
              RateTypeID: payload?.RateTypeID,
              DepartmentID: payload?.DepartmentID,
            };
          });
          setTableData(val);
          setLoading(false);
        }
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

  const post = () => {
    const data = TableData?.filter((ele) => ele.isChecked === true);
    const valid = Match(data);
    if (valid) {
      toast.error("Share Amount Cannot be Greater then Rate");
    } else {
      setLoad(true);
      axiosInstance
        .post("RateTypeShare/RateTypeShareCreate", {
          RateTypeID: payload?.RateTypeID,
          DepartmentID: payload?.DepartmentID,
          Data: data,
        })
        .then((res) => {
          if (res.data.message) {
            setLoad(false);
            toast.success(res.data.message);
            getRateTypeShare();
          } else {
            toast.error("Something went wrong");
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setLoad(false);
        });
    }
  };

  const DeleteData = () => {
    const data = TableData?.filter((ele) => ele.isChecked === true);
    axiosInstance
      .post("RateTypeShare/RateTypeShareDelete", {
        RateTypeID: payload?.RateTypeID,
        DepartmentID: payload?.DepartmentID,
        Data: data,
      })
      .then((res) => {
        if (res.data.message) {
          toast.success(res.data.message);
          getRateTypeShare();
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const handleChange = (e, index) => {
    const { name, value, type, checked } = e.target;

    if (index >= 0) {
      let data = [...TableData];
      if (name === "ShareAmount") {
        data[index]["SharePer"] = "";
      }
      if (name === "SharePer") {
        data[index]["ShareAmount"] = "";
      }
      data[index][name] =
        type === "checkbox"
          ? checked
          : name === "SharePer"
            ? parseInt(value) > 100
              ? ""
              : value
            : value;
      setTableData(data);
    } else {
      if (type === "checkbox") {
        if (checked) {
          const data = TableData.map((ele) => {
            return {
              ...ele,
              [name]: checked,
            };
          });
          setTableData(data);
        } else {
          const data = TableData.map((ele) => {
            return {
              ...ele,
              ShareAmount: name === "SharePer" ? "" : value,
              SharePer: name === "ShareAmount" ? "" : value,
              SharePer: name === "SharePer" ? "" : value,
              [name]: checked,
            };
          });
          setTableData(data);
          document.getElementById("ShareAmount").value = "";
          document.getElementById("SharePer").value = "";
        }
      } else {
        const data = TableData.map((ele) => {
          return {
            ...ele,
            ShareAmount: name === "SharePer" ? "" : value,
            SharePer:
              name === "ShareAmount" ? "" : parseInt(value) > 100 ? "" : value,
          };
        });
        setTableData(data);
        if (name === "SharePer") {
          document.getElementById("ShareAmount").value = "";
          let data = document.getElementById("SharePer").value;
          if (parseInt(data) > 100) {
            document.getElementById("SharePer").value = "";
          }
        }

        if (name === "ShareAmount") {
          document.getElementById("SharePer").value = "";
        }
      }
    }
  };

  const Match = (TableData) => {
    let match = false;
    let FieldError = {
      index: "",
      minValue: "",
    };
    for (var i = 0; i < TableData.length; i++) {
      if (
        parseFloat(TableData[i].ShareAmount) > parseFloat(TableData[i].Rate) ||
        (TableData[i].ShareAmount === "" && TableData[i].SharePer === "")
      ) {
        match = true;
        FieldError = { index: i, minValue: "ShareAmount", maxValue: "" };
        break;
      }
      if (
        parseFloat(TableData[i].SharePer) > parseFloat(TableData[i].Rate) ||
        (TableData[i].ShareAmount === "" && TableData[i].SharePer === "")
      ) {
        match = true;
        FieldError = { index: i, minValue: "ShareAmount", maxValue: "" };
        break;
      }
    }
    return match;
  };

  useEffect(() => {
    if (TableData.length > 0) {
      let flag = true;
      for (var i = 0; i < TableData.length; i++) {
        if (TableData[i].isChecked === true) {
          flag = false;
          break;
        }
      }
      setDisable(flag);
    }
  }, [TableData]);

  useEffect(() => {
    getRateList();
  }, []);
  return (
    <>
    {show && (
        <RateTypeDefaultShareModal
          show={show}
          handleClose={handleClose}
          RateTypeID={payload?.RateTypeID}
        />
      )}
      <Accordion
        name={t("Rate Type Share Master")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row pt-2 pl-2 pr-2">
          <div className="col-sm-2">
            <SelectBox
              id="RateType"
              lable="RateType"
              name="RateTypeID"
              options={RateTypeData}
              onChange={handleSelect}
              value={payload?.RateTypeID}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              id="Department"
              lable="Department"
              onChange={handleSelect}
              name="DepartmentID"
              options={Department}
              value={payload?.DepartmentID}
            />
          </div>
          <div className="col-sm-1">
            <button
              type="submit"
              className="btn btn-block btn-success btn-sm"
              onClick={getRateTypeShare}
            >
              {t("Search")}
            </button>
          </div>
          <div className="col-sm-2">
            <button
              type="submit"
              className="btn btn-block btn-danger btn-sm"
              onClick={handleShow}
            >
              {t("Default Share")}
            </button>
          </div>
          <div className="col-sm-3">
            <Link
              style={{ boxShadow: "0 3px #999" }}
              className="btn btn-block btn-success btn-sm "
              to="/Rate/RateTypeCopyShare"
            >
              {t("Copy Share from one RateType to Other")}
            </Link>
          </div>
        </div>
      </Accordion>
      <Accordion title={t("Search Data")} defaultValue={true}>
        {loading ? (
          <Loading />
        ) : (
          <>
            {TableData.length > 0 && (
              <div className="row p-2">
                <div className="col-12">
                  <Tables>
                    <thead className="cf">
                      <tr>
                        <th>{t("S.No")}</th>
                        <th>{t("Investigation")}</th>
                        <th>{t("Rate")}</th>
                        <th>
                          <Input
                            type="number"
                            placeholder={t("Share Amount")}
                            name="ShareAmount"
                            onChange={handleChange}
                            onInput={(e) => number(e, 4)}
                            numberMin={0}
                            id="ShareAmount"
                            disabled={
                              TableData?.length > 0
                                ? isChecked(
                                    "isChecked",
                                    TableData,
                                    true
                                  ).includes(false)
                                  ? true
                                  : false
                                : false
                            }
                          />
                        </th>
                        <th>
                          <Input
                            type="number"
                            placeholder={t("Share Percentage")}
                            name="SharePer"
                            onChange={handleChange}
                            onInput={(e) => number(e, 3)}
                            id="SharePer"
                            disabled={
                              TableData?.length > 0
                                ? isChecked(
                                    "isChecked",
                                    TableData,
                                    true
                                  ).includes(false)
                                  ? true
                                  : false
                                : false
                            }
                          />
                        </th>
                        <th>
                          <input
                            type="checkbox"
                            name="isChecked"
                            onChange={handleChange}
                            checked={
                              TableData?.length > 0
                                ? isChecked(
                                    "isChecked",
                                    TableData,
                                    true
                                  ).includes(false)
                                  ? false
                                  : true
                                : false
                            }
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {TableData.map((data, i) => (
                        <tr key={i}>
                          <td data-title={t("S.No")}>{i + 1}&nbsp;</td>
                          <td data-title={t("Investigation")}>
                            {data?.TestName}&nbsp;
                          </td>
                          <td data-title={t("Rate")}>{data?.Rate}&nbsp;</td>
                          <td data-title={t("ShareAmount")}>
                            <Input
                              value={data?.ShareAmount}
                              type="number"
                              onChange={(e) => handleChange(e, i)}
                              onInput={(e) => number(e, 4)}
                              name="ShareAmount"
                              disabled={data?.isChecked ? false : true}
                            />
                          </td>
                          <td data-title={t("SharePer")}>
                            <Input
                              value={data?.SharePer}
                              onChange={(e) => handleChange(e, i)}
                              onInput={(e) => number(e, 3)}
                              name="SharePer"
                              type="number"
                              disabled={data?.isChecked ? false : true}
                            />
                          </td>
                          <td data-title={t("Status")}>
                            <input
                              type="checkbox"
                              name="isChecked"
                              checked={data?.isChecked}
                              onChange={(e) => handleChange(e, i)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Tables>
                </div>
              </div>
            )}
            {TableData.length > 0 && (
              <div className="row">
                <div className="col-sm-2 mb-1">
                  {load ? (
                    <Loading />
                  ) : (
                    <button
                      className="btn btn-block btn-success btn-sm"
                      onClick={post}
                      disabled={Disable}
                    >
                      {t("Save")}
                    </button>
                  )}
                </div>
                <div className="col-sm-2 mb-1">
                  <button
                    className="btn btn-block btn-danger btn-sm"
                    onClick={DeleteData}
                    disabled={Disable}
                  >
                    {t("Delete")}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Accordion>
    </>
  );
};

export default RateTypeShareMaster;
