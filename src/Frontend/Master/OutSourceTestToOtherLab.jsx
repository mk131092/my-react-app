import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import moment from "moment";
import Accordion from "@app/components/UI/Accordion";
import DatePicker from "../../components/formComponent/DatePicker";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Input from "../../components/formComponent/Input";
import Tables from "../../components/UI/customTable";
import Loading from "../../components/loader/Loading";
import UploadFile from "../utils/UploadFileModal/UploadFile";

const OutSourceTestToOtherLab = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [CentreData, setCentreData] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [OutSourceLabData, setOutSourceLabData] = useState([]);
  const [RejectLoading, setRejectLoading] = useState(-1);
  const [tableData, setTableData] = useState([]);
  const [show5, setShow5] = useState({
    modal: false,
    data: "",
  });
  const [payload, setPayload] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    FromTime: "00:00:00",
    ToTime: "23:59:59",
    DepartmentID: "",
    CentreID: "",
    OutSourceLabID: "",
    BarcodeNo: "",
    status: "",
  });
  const { t } = useTranslation();

  const dateSelect = (date, name) => {
    setPayload({
      ...payload,
      [name]: date,
    });
  };

  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;
    setPayload({ ...payload, [secondName]: TimeStamp });
  };

  const handleSelectChange = (event) => {
    const { name, value, selectedIndex } = event?.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handlechangeOutsource = (e, index) => {
    const { value } = e?.target;
    console.log(value, e.target);
    const data = [...tableData];
    const datas = handleDropdown(data[index]["OutsourceName"]);
    const values = datas.filter((ele) => ele?.value == value);
    console.log(values);
    data[index]["OutSourceLabID"] = values[0]?.value;
    data[index]["OutSourceLabName"] = values[0]?.label;
    data[index]["OutSourceRate"] = values[0]?.rate;
    data[index]["OutSourceTestCode"] = values[0]?.code;
    setTableData(data);
  };
  console.log(tableData);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const getOutSourceLabData = () => {
    axiosInstance
      .get("OutSourceLabMaster/getOutSourceLabData")
      .then((res) => {
        let data = res.data.message;
        let OutSourceLabData = data.map((ele) => {
          return {
            value: ele.OutSourceLabID,
            label: ele.LabName,
          };
        });
        OutSourceLabData.unshift({ label: "Select", value: "" });
        setOutSourceLabData(OutSourceLabData);
      })
      .catch((err) => console.log(err));
  };

  const getDepartment = () => {
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
        Department.unshift({ label: "Select", value: "" });
        setDepartment(Department);
      })
      .catch((err) => console.log(err));
  };

  const handleCheckbox = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const val = [...tableData];
      val[index][name] = checked ? "1" : "0";
      setTableData(val);
    } else {
      const data = tableData.map((ele) => {
        return {
          ...ele,
          [name]: checked ? "1" : "0",
        };
      });
      setTableData(data);
    }
  };
  const removeDuplicates = (data) => {
    if (data?.length > 0) {
      const seen = new Set();
      return data?.filter((item) => {
        const key = `${item?.label}-${item?.value}`;
        if (seen?.has(key)) {
          return false;
        } else {
          seen?.add(key);
          return true;
        }
      });
    } else {
      return [];
    }
  };
  const handleDropdown = (outSourceName) => {
    const data = outSourceName.split("#");
    const val = data.map((ele) => {
      const newVal = ele.split("|");
      return {
        label: newVal[0],
        value: newVal[1],
        code: newVal[2],
        rate: Number(newVal[3])?.toFixed(2),
      };
    });
    return removeDuplicates(val);
  };

  const handleSearch = () => {
    setLoading(true);
    axiosInstance
      .post("OutSourceTestToOtherLab/binddata", {
        ...payload,
        FromDate: moment(payload?.FromDate).format("DD/MMM/YYYY"),
        ToDate: moment(payload?.ToDate).format("DD/MMM/YYYY"),
      })
      .then((res) => {
        
        let data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            ...ele,
            OutSourceLabID: ele?.OutsourceName==null?'':handleDropdown(ele?.OutsourceName)[0]?.value,
            OutSourceLabName: ele?.OutsourceName==null?'':handleDropdown(ele?.OutsourceName)[0]?.label,
            OutSourceTestCode: ele?.OutsourceName==null?'':handleDropdown(ele?.OutsourceName)[0]?.code,
            OutSourceRate: ele?.OutsourceName==null?'':handleDropdown(ele?.OutsourceName)[0]?.rate,
          };
        });
        setTableData(val);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
        setTableData([]);
        setLoading(false);
      });
  };

  const handleSave = () => {
    setLoading(true);
    const data = tableData.filter((ele) => ele?.isChecked == "1");
    const newPayload = data.map((ele) => {
      return {
        ...ele,
        OutSourceLabRate: ele?.LabOutSrcRate,
      };
    });
    axiosInstance
      .post("OutSourceTestToOtherLab/savedata", {
        OutSourceData: newPayload,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setLoading(false);
        handleSearch();
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
        setLoading(false);
      });
  };

  const rejectData = (data, index) => {
    setRejectLoading(index);
    axiosInstance
      .post("OutSourceTestToOtherLab/Rejectdata", {
        OutSourceData: [data],
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setRejectLoading(-1);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something went Wrong"
        );
        setRejectLoading(-1);
      });
  };

  const getAccessCentres = () => {
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
        CentreDataValue.unshift({ label: "Select", value: "" });
        setCentreData(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };

  const showBtn = () => {
    const val = tableData.filter((ele) => ele?.isChecked == "1");
    return val.length > 0 ? true : false;
  };

  useEffect(() => {
    getAccessCentres();
    getDepartment();
    getOutSourceLabData();
  }, []);
  return (
    <>
      {show5?.modal && (
        <UploadFile
          show={show5?.modal}
          handleClose={(data) => {
            setShow5({ modal: false, data: "", pageName: "" });
          }}
          documentId={show5.data}
          pageName={show5?.pageName}
          formData={payload}
          showHeader={false}
        />
      )}
      <Accordion
        name={t("Out Source Test To Other Lab")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row pt-2 pl-2 pr-2">
          <div className="col-sm-2">
            <DatePicker
              name="FromDate"
              id="FromDate"
              lable="From Date"
              className="custom-calendar"
              placeholder=" "
              value={payload?.FromDate}
              onChange={dateSelect}
              onChangeTime={handleTime}
              secondName="FromTime"
              maxDate={new Date()}
            />
            {errors?.FromDate && (
              <div className="error-message">{errors?.FromDate}</div>
            )}
          </div>
          <div className="col-sm-2">
            <DatePicker
              name="ToDate"
              id="ToDate"
              className="custom-calendar"
              lable="To Date"
              placeholder=" "
              value={payload?.ToDate}
              onChange={dateSelect}
              onChangeTime={handleTime}
              secondName="ToTime"
              maxDate={new Date()}
              minDate={new Date(payload.FromDate)}
            />
            {errors?.ToDate && (
              <div className="error-message">{errors?.ToDate}</div>
            )}
          </div>
          <div className="col-sm-2">
            <SelectBox
              name="CentreID"
              options={CentreData}
              onChange={handleSelectChange}
              selectedValue={payload?.CentreID}
              lable="Centre"
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              name="DepartmentID"
              options={Department}
              onChange={handleSelectChange}
              selectedValue={payload?.DepartmentID}
              lable="Department"
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              name="OutSourceLabID"
              options={OutSourceLabData}
              onChange={handleSelectChange}
              selectedValue={payload?.OutSourceLabID}
            />
          </div>
          <div className="col-sm-2">
            <Input
              type="text"
              lable="Barcode No"
              name="BarcodeNo"
              id="BarcodeNo"
              placeholder=""
              max={15}
              value={payload?.BarcodeNo}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row pt-2 pl-2 pr-2">
          <div className="col-sm-2">
            <SelectBox
              name="status"
              options={[
                {
                  label: "All",
                  value: "",
                },
                {
                  label: "Pending",
                  value: "0",
                },
                {
                  label: "Outsource",
                  value: "1",
                },
              ]}
              onChange={handleSelectChange}
              selectedValue={payload?.status}
            />
          </div>
          <div className="col-sm-1">
            <button
              className="btn btn-block btn-info btn-sm"
              onClick={handleSearch}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </Accordion>
      {tableData?.length > 0 && (
        <Accordion title={t("Search Data")} defaultValue={true}>
          <>
            <h6 className="box-title pl-2 pt-2">
              {t("OutSource Test List")}
              <span style={{ color: "red", marginLeft: "15px" }}>
                {t("Total Test")} : {tableData?.length}
              </span>
            </h6>
            <div className="row p-2 ">
              <div className="col-12">
                <Tables>
                  <thead className="cf">
                    <tr>
                      {[
                        t("S.No"),
                        t("From Centre"),
                        t("Visit No."),
                        t("Barcode No."),
                        t("Patient Name"),
                        t("Department"),
                        t("Test Name"),
                        t("OutSource Lab"),
                        t("OutSourceTestCode"),
                        t("OutSourceRate"),

                        t("Status"),
                        t("Add Report"),
                        t("Select"),
                      ].map((ele, index) => (
                        <th key={index}>{ele}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.map((ele, index) => (
                      <tr
                        key={index}
                        style={{
                          backgroundColor:
                            ele?.STATUS === "OutSourced" && "#9795c6",
                        }}
                      >
                        <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                        {/* <td data-title="RegDate">{ele?.FromDate}&nbsp;</td> */}
                        <td data-title={t("From Centre")}>
                          {ele?.centre}&nbsp;
                        </td>
                        <td data-title={t("Visit No.")}>
                          {ele?.LedgerTransactionNo}&nbsp;
                        </td>
                        <td data-title={t("Barcode No.")}>
                          {ele?.BarcodeNo}&nbsp;
                        </td>
                        <td data-title={t("Patient Name")}>
                          {ele?.PName}
                          &nbsp;
                        </td>
                        <td data-title={t("Department")}>
                          {ele?.DepartmentName}&nbsp;
                        </td>
                        <td data-title={t("Test Name")}>
                          {ele?.itemname}&nbsp;
                        </td>
                        <td data-title={t("OutSource Lab")}>
                          {/* {ele?.OutsourceName}&nbsp; */}
                          <div>
                            <SelectBox
                              name="OutSourceLabID"
                              options={ele?.OutsourceName==null?[]:handleDropdown(ele?.OutsourceName)}
                              selectedValue={ele?.OutSourceLabID}
                              isDisabled={ele?.STATUS == "OutSourced"}
                              onChange={(e) => handlechangeOutsource(e, index)}
                            />
                          </div>
                        </td>
                        <td data-title={t("OutSourceTestCode")}>
                          {ele?.OutSourceTestCode}
                        </td>
                        <td data-title={t("OutSourceRate")}>
                          {ele?.OutSourceRate}&nbsp;
                        </td>
                        <td data-title={t("Status")}>{ele?.STATUS}&nbsp;</td>
                        <td data-title={t("Add Report")}>
                          {ele?.STATUS == "OutSourced" &&
                            ele?.Approved == 0 && (
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                  setShow5({
                                    modal: true,
                                    data: ele?.TestIDHash,
                                    pageName: "Add Report",
                                  });
                                }}
                              >
                                {t("Add Report")}
                              </button>
                            )}
                          &nbsp;
                        </td>
                        <td data-title={t("Select")}>
                          {ele?.STATUS !== "OutSourced" ? (
                            <input
                              type="checkbox"
                              name="isChecked"
                              checked={ele?.isChecked === "1" ? true : false}
                              onChange={(e) => handleCheckbox(e, index)}
                            ></input>
                          ) : RejectLoading === index ? (
                            <Loading />
                          ) : (
                            <>
                              {ele?.Approved == 1 ? (
                                ""
                              ) : (
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={(e) => rejectData(ele, index)}
                                >
                                  Reject
                                </button>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Tables>
                {loading ? (
                  <Loading />
                ) : (
                  showBtn() && (
                    <>
                      <div className="box-footer pt-2">
                        <div className="row">
                          <div className="col-sm-1">
                            <button
                              className="btn btn-block btn-success btn-sm"
                              onClick={handleSave}
                            >
                              {t("Save")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                )}
              </div>
            </div>
          </>
        </Accordion>
      )}
    </>
  );
};

export default OutSourceTestToOtherLab;
