import moment from "moment";
import React, { useState, useEffect } from "react";
import { axiosInstance, axiosReport } from "../../utils/axiosInstance";
import {
  getAccessCentres,
  getDepartment,
} from "../../utils/NetworkApi/commonApi";
import { getAccessRateType, getBillingCategory } from "../util/Commonservices";
import Accordion from "@app/components/UI/Accordion";
import { toast } from "react-toastify";
import DatePicker from "../../components/formComponent/DatePicker";
import { SelectBoxWithCheckbox } from "../../components/formComponent/MultiSelectBox";
import Input from "../../components/formComponent/Input";
import { SelectBox } from "../../components/formComponent/SelectBox";
import { useTranslation } from "react-i18next";
import { ExportToExcel, isChecked, number } from "../../utils/helpers";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";

const DoctorMisReportPage = () => {
  const { t } = useTranslation();
  const [tabledata, setTableData] = useState([]);
  const [tabledata1, setTableData1] = useState([]);
  const [tabledata2, setTableData2] = useState([]);
  const [Category, setCategory] = useState([]);
  const [DoctorData, setDoctorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(-1);
  const [loading2, setLoading2] = useState(-1);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [RateType, setRateType] = useState([]);
  const [Speclization, setSpeclization] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [payload, setPayload] = useState({
    CentreID: [],
    PanelID: [],
    DtFrom: moment(new Date()).format("YYYY-MM-DD"),
    DtTo: moment(new Date()).format("YYYY-MM-DD"),
    FromTime:"00:00:00",
    ToTime:"23:59:59",
    ProID: [],
    DoctorID: [],
    CategoryID: [],
    HeadDepartmentID: "",
    DepartmentID: [],
    Parm1: "",
    Val1: "",
    Parm2: "",
    Val2: "",
    ShareAmount1: "",
    ShareAmount2: "",
    Speclization: [],
    IsReff: "BOTH",
    DoctorMobile: "",
    LabNo: "",
    downLoadData: "1",
  });

  const patientCountOptions = [
    { value: "", label: "Select" },
    { value: "=", label: "=" },
    { value: ">=", label: ">=" },
    { value: "<=", label: "<=" },
    { value: ">", label: ">" },
    { value: "<", label: "<" },
    { value: "between", label: "between" },
  ];

  const dateSelect = (date, name) => {
    const dates = moment(date).format("YYYY-MM-DD");
    setPayload({
      ...payload,
      [name]: dates,
    });
  };

  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;

    setPayload({ ...payload, [secondName]: TimeStamp });
  };

  const handleChanges = (select, name) => {
    let val = select.map((ele) => ele?.value);

    console.log(val);
    setPayload({ ...payload, [name]: val });
  };


  const handleSelectChange = (select,name) => {
    const data =select.map((ele)=>ele?.value);
    setPayload({...payload,[name]: data})
  }

  // const handleSelectChange = (select, name) => {
  //   let val = "";
  //   for (let i = 0; i < select.length; i++) {
  //     val = val === "" ? `${select[i].value}` : `${val},${select[i].value}`;
  //   }
  //   setPayload({ ...payload, [name]: val });
  // };

  const handleShow = (e) => {
    const { name, checked } = e.target;
    setPayload({ ...payload, [name]: checked });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const hideSelectBox = () => {
    const val = tabledata?.filter((item) => item?.isSelect === true);
    return val.length === tabledata.length ? false : true;
  };

  const handlePatientCount = () => {
    let count = 0;
    for (let i = 0; i < tabledata?.length; i++) {
      count = count + tabledata[i]["Total"];
    }

    return count;
  };

  const handlePatientShareAmount = () => {
    let count = 0;
    for (let i = 0; i < tabledata?.length; i++) {
      count = count + tabledata[i]["SharedAmount"];
    }

    return count.toFixed(2);
  };

  const handleChangeNew = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const updateData = [...tabledata];
      updateData[index][name] = checked;
      setTableData(updateData);
    } else {
      const updateData = tabledata.map((item) => {
        return {
          ...item,
          isSelect: checked,
        };
      });
      setTableData(updateData);
    }
  };

  const handleRef = (e, id, name) => {
    console.log(id);
    const { checked } = e.target;
    setLoading(true);
    axiosInstance
      .post(`/DoctorMis/${name}`, {
        IsCheck: checked ? "1" : "0",
        DoctorID: id,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        handleSave();
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.data?.message ? err?.data?.message : "Error Occured");
      });
  };

  const DoctorSelectedHandle = (e, index) => {
    const { name, checked } = e.target;
    const data = [...tabledata];
    data[index][name] = checked;
    setTableData(data);
  };

  const table1data = (index, id) => {
    setLoading1(index);

    const payLoadData = { ...payload };
    payLoadData.DoctorID = id;
    axiosInstance
      .post("DoctorMis/showPatientData", payLoadData)
      .then((res) => {
        if (res?.data?.message.length > 0) {
          setTableData1(res?.data?.message);
        } else {
          toast.error("No Data Found");
          setTableData1([]);
        }

        setLoading1(-1);
      })
      .catch(() => {
        toast.error("error occured");
        setLoading1(-1);
      });
  };

  const handleSearchTest = (e, data) => {
    const { checked } = e.target;

    axiosInstance
      .post("DoctorMis/updateDocshare", {
        IsCheck: checked ? "1" : "0",
        LedgerTransactionNo: data?.LedgerTransactionNo,
        ItemId: data?.ItemId,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        table2data(data?.LedgerTransactionNo);
      })
      .catch((err) => {
        toast.error(err?.data?.message ? err?.data?.message : "Error occured");
      });
  };

  const getDropDownData = (name) => {
    axiosInstance
      .post("Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        console.log(data);
        let value = data.map((ele) => {
          return {
            value: ele.FieldID,
            label: ele.FieldDisplay,
          };
        });

        switch (name) {
          case "Specialization":
            setSpeclization(value);
            break;
          case "IsReff":
            // setIsRef(value);
            break;
          default:
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSave = () => {
    setLoading(true);
    axiosInstance
      .post("DoctorMis/SearchDoctorSummary", {
        ...payload,
        DtFrom: moment(payload?.DtFrom).format("DD-MMM-YYYY"),
        DtTo: moment(payload?.DtTo).format("DD-MMM-YYYY"),
      })
      .then((res) => {
        const data = res?.data?.message;
        if (data.length > 0) {
          const val = data.map((ele) => {
            return {
              ...ele,
              isSelect: false,
            };
          });
          setTableData(val);
        } else {
          toast.error("No Data Found");
          setTableData([]);
        }
        setTableData1([]);
        setTableData2([]);

        setLoading(false);
      })
      .catch(() => {
        toast.error("error occured");
        setLoading(false);
      });
  };

  const table2data = (id) => {
    setLoading2(id);
    axiosInstance
      .post("DoctorMis/showTestData", {
        LabNo: id,
      })
      .then((res) => {
        const data = res?.data?.message?.map((ele) => {
          return {
            ...ele,
          };
        });
        setTableData2(data);
        setLoading2(-1);
      })
      .catch(() => {
        toast.error("Error Occured");
        setLoading2(-1);
      });
  };

  const getDoctorSuggestion = () => {
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
        setDoctorData(val);
      })
      .catch((err) => console.log(err));
  };
  const handleDownLoadExcel = (id) => {
    const payLoadData = { ...payload };
    payLoadData.DoctorID = id;
    axiosReport
      .post("commonReports/ReportDoctorSummary", payload)
      .then((res) => {
        toast.success(res?.data?.message);
        window.open(res?.data?.url, "_blank");
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  useEffect(() => {
    getAccessCentres(setCentreData);
    getBillingCategory(setCategory);
    getDepartment(setDepartmentData);
    getAccessRateType(setRateType);
    getDoctorSuggestion();
    getDropDownData("Specialization");
    getDropDownData("Doctor");
    getDropDownData("IsRef");
  }, []);
  return (
    <>
      <Accordion
        name={t("Doctor MIS Report")}
        isBreadcrumb={true}
        defaultValue={true}
      >
        <div className="row pt-2 pl-2 pr-2 mt-1">
          <div className="col-sm-2">
            <DatePicker
              className="custom-calendar"
              name="DtFrom"
              value={new Date(payload?.DtFrom)}
              onChange={dateSelect}
              maxDate={new Date()}
              lable="From Date"
            />
          </div>
          <div className="col-sm-2">
            <DatePicker
              className="custom-calendar"
              name="DtTo"
              value={new Date(payload?.DtTo)}
              onChange={dateSelect}
              maxDate={new Date()}
              minDate={new Date(payload.DtFrom)}
              lable="To Date"
            />
          </div>
          <div className="col-sm-2">
            <SelectBoxWithCheckbox
              options={CentreData}
              value={payload?.CentreID}
              name="CentreID"
              id="CentreID"
              placeholder=""
              onChange={handleSelectChange}
              lable="Centre"
            />
          </div>
          <div className="col-sm-2">
            <SelectBoxWithCheckbox
              options={RateType}
              value={payload.PanelID}
              name="PanelID"
              id="PanelID"
              placeholder=""
              onChange={handleSelectChange}
              lable="RateType"
            />
          </div>
          <div className="col-sm-2">
            <SelectBoxWithCheckbox
              options={Category}
              name={"CategoryID"}
              id="CategoryID"
              placeholder=""
              value={payload?.CategoryID}
              onChange={handleSelectChange}
              lable="Category"
            />
          </div>
          <div className="col-sm-2">
            <SelectBoxWithCheckbox
              onChange={handleSelectChange}
              name={"DepartmentID"}
              id="DepartmentID"
              placeholder=""
              value={payload?.DepartmentID}
              options={DepartmentData}
              lable="Department"
            />
          </div>
        </div>
        <div className="row pt-1 pl-2 pr-2">
          <div className="col-sm-2">
            <SelectBoxWithCheckbox
              onChange={handleSelectChange}
              name={"DoctorID"}
              id="DoctorID"
              placeholder=""
              value={payload?.DoctorID}
              options={[{label:"Self", value:1},...DoctorData]}
              lable="Doctor"
            />
          </div>
          <div className="col-sm-1 mt-1 d-flex">
            <div className="mt-1">
              <input
                type="checkbox"
                name="isChecked"
                id="isChecked"
                placeholder=""
                checked={payload?.isChecked}
                onChange={handleShow}
              />
            </div>
            <label className="col-sm-10">Show More</label>
          </div>
        </div>
        <div className="row pt-1 pl-2 pr-2">
          {payload.isChecked ? (
            <>
              <div className="col-sm-2">
                <div className="d-flex align-items-center">
                  <div style={{ width: "40%" }}>
                    <SelectBox
                      className="form-control "
                      options={patientCountOptions}
                      style={{ width: "50%" }}
                      name="Parm1"
                      value={payload?.Parm1}
                      onChange={handleChange}
                      lable="PatientCount"
                      placeholder=""
                    />
                  </div>{" "}
                  <div style={{ width: "60%" }}>
                    <Input
                      className="form-control ml-2"
                      style={{ width: "50%" }}
                      type="number"
                      name="Val1"
                      value={payload?.Val1}
                      onChange={handleChange}
                      placeholder=""
                      lable="Value"
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm-2">
                <div className="d-flex align-items-center">
                  <div style={{ width: "40%" }}>
                    <SelectBox
                      className="select_control"
                      options={patientCountOptions}
                      style={{ width: "50%" }}
                      name="Parm1"
                      value={payload?.Parm1}
                      onChange={handleChange}
                      lable="Ref Amount"
                      placeholder=""
                    />
                  </div>
                  <div style={{ width: "60%" }}>
                    <Input
                      className="select-input-box form-control input-sm"
                      style={{ width: "50%" }}
                      type="number"
                      name="ShareAmount2"
                      id="ShareAmount2"
                      value={payload?.ShareAmount2}
                      onChange={handleChange}
                      placeholder=""
                      lable="Value"
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm-1">
                <Input
                  type="number"
                  name="DoctorMobile"
                  id="DoctorMobile"
                  placeholder=""
                  onInput={(e) => number(e, 10)}
                  value={payload?.DoctorMobile}
                  onChange={handleChange}
                  lable="Mobile No"
                />
              </div>
              <div className="col-sm-2">
                <SelectBoxWithCheckbox
                  onChange={handleSelectChange}
                  options={Speclization}
                  name="Speclization"
                  id="Speclization"
                  placeholder=""
                  value={payload?.Speclization}
                  lable="Doctor Spl"
                />
              </div>
              <div className="col-sm-2">
                <SelectBox
                  options={[
                    { value: "IsRef", label: "IsRef" },
                    { value: "both", label: "BOTH" },
                    { value: "Y", label: "Y" },
                    { value: "N", label: "N" },
                  ]}
                  className="select_control"
                  name="IsReff"
                  id="IsReff"
                  placeholder=""
                  value={payload?.IsReff}
                  onChange={handleChange}
                  lable="IsReff"
                />
              </div>
            </>
          ) : (
            " "
          )}
        </div>
        <div className="row pt-1 pl-2 pr-2 pb-2">
          {loading ? (
            <Loading />
          ) : (
            <div className="col-sm-1">
              <button
                type="button"
                className="btn btn-block btn-primary btn-sm"
                onClick={handleSave}
              >
                {t("Search")}
              </button>
            </div>
          )}
        </div>
      </Accordion>
      <Accordion defaultValue={true}>
        <div className="row pt-2 pl-2 pr-2 pb-2 mt-1">
          <div className="col-sm-1 mt-1 d-flex">
            <div className="mt-1">
              <input
                type="radio"
                value="Patient Wise"
                checked="true"
                placeholder=""
                className="control-label"
              />
            </div>
            <label className="col-sm-10">{t("Patient Wise")}</label>
          </div>
          <div className="col-sm-1 mt-1 d-flex">
            <div className="mt-1">
              <input
                type="radio"
                value="0"
                onChange={handleChange}
                className="control-label"
                name="downLoadData"
                id="downLoadChoice1"
              />
            </div>
            <label className="col-sm-10">{t("PDF")}</label>
          </div>
          <div className="col-sm-1 mt-1 d-flex">
            <div className="mt-1">
              <input
                type="radio"
                value="1"
                checked={payload?.downLoadData === "1"}
                onChange={handleChange}
                className="control-label"
                name="downLoadData"
                id="downLoadChoice2"
              />
            </div>
            <label className="col-sm-10">{t("EXCEL")}</label>
          </div>
          <div className="col-sm-2">
            {payload?.downLoadData === "1" ? (
              <button
                className="btn btn-block btn-success btn-sm"
                type="submit"
                onClick={() => ExportToExcel(tabledata)}
              >
                {t("Download Excel")}
              </button>
            ) : (
              <button
                className="btn btn-block btn-success btn-sm"
                type="submit"
                onClick={handleDownLoadExcel}
              >
                {t("Download PDF")}
              </button>
            )}
          </div>
        </div>
      </Accordion>{" "}
      <Accordion title={t("Search Data")} defaultValue={true}>
        {tabledata.length > 0 && (
          <>
          <div className="d-flex my-2">
            {/* {hideSelectBox() && (
              <div className="col-md-2">
                <select className="select_control" name="">
                  <option hidden> Select </option>
                  {tabledata?.map(
                    (ele, index) =>
                      ele?.isSelect && (
                        <option key={index} value={ele?.Doctor}>
                          {ele?.Doctor}
                        </option>
                      )
                  )}
                </select>
              </div>
            )} */}
            {/* <div className={hideSelectBox() ? "col-md-10" : "col-md-12"}> */}
            <div className={"col-md-12"}>
              <h6 style={{ textAlign: "end" }} className="text-primary">
                Total Doctor Count : {tabledata?.length} , Total Patient Count :{" "}
                {handlePatientCount()} , Total Shared Amount :{" "}
                {handlePatientShareAmount()}
              </h6>
            </div>
            </div>
            <div className="row px-2 ">
              <div className="col-12">
                <Tables>
                  <thead className="cf">
                    <tr>
                      <th>S.No</th>
                      <th>Ref</th>
                      <th>Count</th>
                      <th>Doc Name</th>
                      <th>Master Share</th>
                      <th>Phone</th>
                      <th>Mobile</th>
                      <th>Share Amount</th>
                      <th>Added On</th>
                      {/* <th>Show</th> */}
                      <th>
                        {/* Select */}
                        <div>
                          <input
                            type="checkbox"
                            name="isSelect"
                            checked={
                              tabledata.length > 0
                                ? isChecked(
                                    "isSelect",
                                    tabledata,
                                    true
                                  ).includes(false)
                                  ? false
                                  : true
                                : false
                            }
                            onChange={(e, index) => {
                              handleChangeNew(e, index);
                            }}
                          />
                        </div>
                      </th> 
                    </tr>
                  </thead>
                  {tabledata?.map((item, index) => (
                    <tbody>
                      <tr key={index}>
                        <td data-title={"S.No"}>{index + 1}</td>
                        <td data-title={"Ref"}>
                          <input
                            type="checkbox"
                            checked={
                              item?.Referal.toLowerCase() === "y" ? true : false
                            }
                            onChange={(e) =>
                              handleRef(e, item?.DoctorID, "DoctorRefferal")
                            }
                          />
                        </td>
                        <td data-title={"Count"}>{item.Total}</td>
                        <td data-title={"Count"}>{item?.Doctor}</td>
                        <td data-title={"Master Share"}>
                          <input
                            type="checkbox"
                            checked={
                              item?.MasterShare.toLowerCase() === "y"
                                ? true
                                : false
                            }
                            onChange={(e) =>
                              handleRef(e, item?.DoctorID, "ShareMasterUpdate")
                            }
                          />
                        </td>
                        <td data-title={"Phone"}>{item?.Phone}</td>
                        <td data-title={"Mobile"}>{item?.Mobile}</td>
                        <td data-title={"Share Amount"}>
                          {item?.SharedAmount}
                        </td>
                        <td data-title={"Added On"}>{item.AddedDate}</td>
                        {/* <td
                          data-title={"Show"}
                          onClick={() => table1data(index, item?.DoctorID)}
                        >
                          {loading1 === index ? (
                            <Loading />
                          ) : (
                            <i className="fa fa-search" />
                          )}
                        </td> */}
                        <td data-title={"#"}>
                          <input
                            type="checkbox"
                            checked={item?.isSelect}
                            name="isSelect"
                            onChange={(e) => DoctorSelectedHandle(e, index)}
                            disabled={item?.isChecked ? true : false}
                          />
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </Tables>
              </div>
            </div>
          </>
        )}
      </Accordion>
    </>
  );
};

export default DoctorMisReportPage;
