import React, { useEffect, useRef, useState } from "react";
import Input from "../../components/formComponent/Input";
import { SelectBox } from "../../components/formComponent/SelectBox";
import DatePicker from "../../components/formComponent/DatePicker";
import CustomTimePicker from "../../components/formComponent/TimePicker";
import { SelectBoxWithCheckbox } from "../../components/formComponent/MultiSelectBox";
import Loading from "../../components/loader/Loading";
import { useTranslation } from "react-i18next";
import { SampleStatus, SearchBy } from "../../utils/Constants";
import { toast } from "react-toastify";
import moment from "moment";
import { axiosInstance, axiosReport } from "../../utils/axiosInstance";
import Accordion from "@app/components/UI/Accordion";
import {
  AddBlankData,
  AllDataDropDownPayload,
  Time,
  autocompleteOnBlur,
  isChecked,
  IndexHandle,
  number,
  shouldIncludeAIIMSID,
  CheckDevice,
  downloadPdf,
} from "../../utils/helpers";
import Tables from "../../components/UI/customTable";

import CustomModal from "../utils/CustomModal";
import CustomDateModal from "../utils/CustomDateModal";

import BulkDownloadType from "../utils/BulkDownloadType";
import Pagination from "../../Pagination/Pagination";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
import SpinnerLoad from "../../components/loader/SpinnerLoad";
import BulkEmailModal from "./BulkEmailModal";
const BulkActivity = () => {
  const { t } = useTranslation();
  const [CentreData, setCentreData] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [machineId, setMachineId] = useState([]);
  const [indexMatch, setIndexMatch] = useState(0);
  const [errors, setErrors] = useState({});
  const [tableData, setTableData] = useState([]);
  const [doctorAdmin, setDoctorAdmin] = useState([]);
  const [load, setLoad] = useState(false);
  const [TestSuggestion, setTestSuggestion] = useState([]);
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [observationData, setObservationData] = useState([]);
  const [ApprovedBy, setApprovedBy] = useState("");
  const [modal, setModal] = useState(false);
  const [visitID, setVisitID] = useState();
  const [dropFalse, setDropFalse] = useState(true);
  const [actionLoading, setActionLoading] = useState({
    type: "",
    load: false,
    index: -1,
  });
  const [bulkDownloadtypeState, setBulkDownloadtypeState] = useState(false);
  const [customizeDateModal, setCustomizeDateModal] = useState({
    show: false,
    TestId: "",
  });
  const rowRefs = useRef([]);
  const [downloadLoading, setDownloadLoading] = useState({});
  const [BulkEmailModalState, setBulkEmailModalState] = useState({
    modal: false,
    data: [],
    type: "",
  });
  console.log(downloadLoading);
  let PageSize = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTableTestData, setCurrentTableTestData] = useState([]);
  useEffect(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    const data = tableData?.map((ele) => {
      return {
        ...ele,
        isChecked: false,
      };
    });
    setCurrentTableTestData(data.slice(firstPageIndex, lastPageIndex));
  }, [currentPage, tableData]);
  const today = new Date();
  const [payload, setPayload] = useState({
    ItemValue: "",
    SelectTypes: "",
    CentreID: "",
    DepartmentID: "",
    TestId: "",
    FromDate: new Date(),
    ToDate: new Date(),
    TestName: [],
    VIP: "",
    Urgent: "",
    DoctorName: "",
    FromTime: new Date(today.setHours(0, 0, 0, 0)),
    ToTime: new Date(today.setHours(23, 59, 59, 999)),
    MachineID: "ALL",
    SampleStatus: "5",
    IsCulture: 0,
  });
  const [downloadLoad, setDownloadLoad] = useState(false);
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
        setCentreData(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };

  const getDepartment = () => {
    axiosInstance
      .get("Department/getDepartment")
      .then((res) => {
        let data = res.data.message;
        let DeptDataValue = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        setDepartmentData(DeptDataValue);
      })
      .catch((err) => console.log(err));
  };

  const BindMachineName = () => {
    axiosInstance
      .get("MachineGroup/BindMachineName")
      .then((res) => {
        let data = res?.data?.message;
        let val = data?.map((ele) => {
          return {
            value: ele?.MachineId,
            label: ele?.MachineName,
          };
        });
        setMachineId(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occur"
        );
      });
  };

  const BindApprovalDoctor = () => {
    axiosInstance
      .get("CommonController/BindApprovalDoctor")
      .then((res) => {
        let data = res.data.message;
        let doctorData = data.map((ele) => {
          return {
            value: ele?.employeeid,
            label: ele?.name,
          };
        });
        setDoctorAdmin(doctorData);
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (event) => {
    const { name, value, checked, type } = event?.target;
    if (name == "SampleStatus") {
      setPayload({
        ...payload,
        [name]: value,
      });
      TableData(value);
    } else {
      setPayload({
        ...payload,
        [name]: type == "checkbox" ? checked : value,
      });
    }
  };
  const dateSelect = (value, name) => {
    setPayload({
      ...payload,
      [name]: value,
    });
  };
  const handleTime = (time, name) => {
    setPayload({ ...payload, [name]: time });
  };
  const handleIndexNew = (e, name) => {
    switch (name) {
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
            handleListSearchNew(doctorSuggestion[indexMatch], name);
            setIndexMatch(0);
            break;
          default:
            break;
        }

      default:
        break;
    }
  };
  const handleSelectMultiChange = (select, name) => {
    const val = select?.map((ele) => ele?.value);
    setPayload({ ...payload, [name]: val });
  };

  const handleListSearchNew = (data, name) => {
    switch (name) {
      case "DoctorName":
        setPayload({
          ...payload,
          [name]: data.Name,
          DoctorReferal: data.Name ? data.DoctorReferalID : "",
        });
        setIndexMatch(0);
        setDoctorSuggestion([]);
        setDropFalse(false);
        break;
    }
  };

  const handleCheck = (e, index) => {
    const { checked, name } = e.target;
    if (index >= 0) {
      const data = [...currentTableTestData];
      data[index][name] = checked;
      setCurrentTableTestData(data);
    } else {
      const data = currentTableTestData?.map((ele) => {
        return {
          ...ele,
          [name]: checked,
        };
      });
      setCurrentTableTestData(data);
    }
  };
  const getInvestigationList = () => {
    axiosInstance
      .get("Investigations/BindInvestigationList")
      .then((res) => {
        let data = res.data.message;

        let MapTest = data.map((ele) => {
          return {
            value: ele.InvestigationID,
            label: ele.TestName,
          };
        });

        setTestSuggestion(MapTest);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getInvestigationList();
  }, []);

  const validation = () => {
    let error = "";
    if (payload?.SelectTypes !== "" && payload?.ItemValue === "") {
      error = { ...error, ItemValue: t("Please Choose Value") };
    }
    if (payload.SelectTypes === "Mobile") {
      if (payload?.SelectTypes !== "" && payload?.ItemValue === "") {
        error = { ...error, ItemValue: t("This Field is Required") };
      } else if (payload.ItemValue.length !== 10) {
        error = { ...error, ItemValue: t("Invalid Mobile Number") };
      }
    }
    if (payload.FromDate === moment(new Date()).format("DD/MMM/YYYY")) {
      if (payload.FromTime > moment(new Date()).format("hh:mm:ss ")) {
        error = { ...error, FromTime: t("Time is Invalid") };
      }
    }
    if (payload.ToDate === moment(new Date()).format("DD/MMM/YYYY")) {
      if (payload.ToTime < payload.FromTime) {
        error = { ...error, ToTime: t("Time Must be Less than From Time") };
      }
    }
    return error;
  };

  const TableData = (SampleStatus) => {
    setDownloadLoading({});
    const generatedError = validation();
    if (generatedError === "") {
      setLoad(true);
      axiosInstance
        .post("RE/PatientSearch", {
          SelectTypes: payload?.SelectTypes,
          ItemValue: payload?.ItemValue,
          FromDate: moment(payload.FromDate).format("DD/MMM/YYYY"),
          ToDate: moment(payload.ToDate).format("DD/MMM/YYYY"),
          CentreID: AllDataDropDownPayload(
            payload?.CentreID,
            CentreData,
            "value"
          ),
          SampleStatus: SampleStatus,
          DepartmentID: AllDataDropDownPayload(
            payload?.DepartmentID,
            DepartmentData,
            "value"
          ),
          MachineID: payload?.MachineID,
          FromTime: Time(payload.FromTime),
          ToTime: Time(payload.ToTime),
          isUrgent: payload?.Urgent ? 1 : 0,
          IsCulture: payload?.IsCulture ? 1 : 0,
          VIP: payload?.VIP ? 1 : 0,
          TestName: payload?.TestName,
        })
        .then((res) => {
          if (res?.data?.message.length > 0) {
            const data = res?.data?.message.map((ele) => {
              return {
                ...ele,
                isChecked: false,
              };
            });
            setTableData(data);
          } else {
            toast.error("No Data Found");
            setTableData([]);
          }

          setLoad(false);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something went wrong."
          );
          setLoad(false);
          setErrors(generatedError);
        });
    } else {
      setErrors(generatedError);
    }
  };
  console.log(currentTableTestData);
  const showResult = (InvestigationID, PatientCode, index) => {
    setActionLoading({
      type: "showResult",
      load: true,
      index: index,
    });
    axiosInstance
      .post("RE/PatientObservationDetails", {
        InvestigationID,
        PatientCode,
      })
      .then((res) => {
        const data = res?.data?.message;
        const finalData = data.reduce((acc, current) => {
          if (acc[current.LabObservationID]) {
            acc[current.LabObservationID] = {
              ...acc[current.LabObservationID],
              renderData: [
                ...acc[current.LabObservationID].renderData,
                { date: current?.AD, value: current?.Value },
              ],
            };
          } else {
            acc[current.LabObservationID] = {
              ...current,
              renderData: [{ date: current?.AD, value: current?.Value }],
            };
          }
          return acc;
        }, {});
        setObservationData(Object.values(finalData));
        setActionLoading({
          type: "",
          load: false,
          index: -1,
        });
      })
      .catch((err) => {
        setActionLoading({
          type: "",
          load: false,
          index: -1,
        });
        toast.error(err);
      });
  };

  const filterOutChecked = (data, type) => {
    const finalData = data.reduce((acc, current) => {
      if (current.isChecked) {
        acc.push(current[type]);
      }
      return acc;
    }, []);
    return finalData;
  };

  const ApproveAllTest = async () => {
    const payload = filterOutChecked(currentTableTestData, "TestID");

    if (payload.length > 0 && ApprovedBy) {
      setLoad(true);
      axiosInstance
        .post("RE/ApproveAllTest", {
          TestID: payload,
          IsCulture: 0,
          ApprovedBy: ApprovedBy,
        })
        .then((res) => {
          setLoad(false);
          toast.success(res?.data?.message);

          TableData();
        })
        .catch((err) => {
          setLoad(false);
          toast.error(err?.response?.data?.message);
        });
    } else {
      toast.error("Please choose Test ToApprove or Doctor");
    }
  };

  const sampleStatusOptions = () => {
    return SampleStatus.reduce((acc, current) => {
      if (["5", "6"].includes(current?.value)) {
        acc.push(current);
      }
      return acc;
    }, []);
  };

  const handleReport = (TestIDHash, PHead, type, index) => {
    if (actionLoading.index === -1) {
      setActionLoading({
        load: true,
        type: type,
        index: index,
      });
      const requestOptions = {
        ...(CheckDevice() == 1 && { responseType: "blob" }),
      };
      axiosReport
        .post(
          `commonReports/GetLabReport`,
          {
            TestIDHash: Array?.isArray(TestIDHash) ? TestIDHash : [TestIDHash],
            PHead: PHead,

            IsDownload: CheckDevice(),
            PrintColour: "1",
          },
          requestOptions
        )
        .then((res) => {
          if (CheckDevice() == 1) {
            downloadPdf(res.data);
          } else {
            if (res?.data?.success) {
              window.open(res?.data?.url, "_blank");
            } else {
              toast.error(res?.data?.message);
            }
          }
          setActionLoading({
            load: false,
            type: "",
            index: -1,
          });
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : err?.data?.message
          );
          setActionLoading({
            load: false,
            type: "",
            index: -1,
          });
        });
    } else {
      toast.warn("Please wait Generating Report");
    }
  };

  const getPatientInfoReport = () => {
    console.log(
      filterOutChecked(currentTableTestData, "ledgertransactionid").toString()
    );
    axiosReport
      .post(`commonReports/LabWorksheet`, {
        FromDate: moment(payload.FromDate).format("DD/MMM/YYYY"),
        ToDate: moment(payload.ToDate).format("DD/MMM/YYYY"),
        CentreID: AllDataDropDownPayload(
          payload?.CentreID,
          CentreData,
          "value"
        ),
        DepartmentID: AllDataDropDownPayload(
          payload?.DepartmentID,
          DepartmentData,
          "value"
        ),
        FromTime: new Date(today.setHours(0, 0, 0, 0)),
        ToTime: new Date(today.setHours(23, 59, 59, 999)),
        ReportType: Number(2),
        ledgertransactionid: filterOutChecked(
          currentTableTestData,
          "ledgertransactionid"
        ).toString(),
      })
      .then((res) => {
        window.open(res?.data?.url, "_blank");
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
      });
  };

  let statusOfDownload = {};

  const downloadFile = async (
    TestIDHash,
    PHead,
    signature,
    payload,
    BulkUrl
  ) => {
    for (let i = 0; i <= TestIDHash.length; i++) {
      statusOfDownload = {
        ...statusOfDownload,
        [TestIDHash[i]]: {
          TestIDHash: TestIDHash[i],
          display: "Downloading...",
          className: "text-warning",
          icons: <SpinnerLoad />,
          backgroundColor: "",
        },
      };
    }

    setDownloadLoading({
      ...statusOfDownload,
    });

    await axiosReport
      .post(`commonReports/GetLabReport`, {
        TestIDHash: TestIDHash,
        PHead: PHead,
        signature: signature,

        IsDownload: CheckDevice(),
        PrintColour: "1",
      })
      .then((res) => {
        if (res?.data?.success) {
          for (let i = 0; i <= TestIDHash.length; i++) {
            statusOfDownload = {
              ...statusOfDownload,
              [TestIDHash[i]]: {
                TestIDHash: TestIDHash[i],
                display: "",
                className: "text-success",
                icons: (
                  <i
                    class="fa fa-check"
                    aria-hidden="true"
                    style={{
                      padding: "2px",
                      backgroundColor: "green",
                      borderRadius: "25px",
                      color: "white",
                      fontSize: "10px",
                    }}
                  ></i>
                ),
              },
            };
          }

          setDownloadLoading({
            ...statusOfDownload,
          });

          payload.status = 1;
          BulkUrl.push(res?.data?.url?.split("?")[0]);
        } else {
          for (let i = 0; i <= TestIDHash.length; i++) {
            statusOfDownload = {
              ...statusOfDownload,
              [TestIDHash[i]]: {
                TestIDHash: TestIDHash[i],
                display: res?.data?.message,
                className: "text-danger",
                icons: <i class="fa fa-times" aria-hidden="true"></i>,
                backgroundColor: "#ffd6d6",
              },
            };
          }

          setDownloadLoading({
            ...statusOfDownload,
          });

          payload.status = 0;
        }
      })
      .catch((err) => {
        for (let i = 0; i <= TestIDHash.length; i++) {
          statusOfDownload = {
            ...statusOfDownload,
            [TestIDHash[i]]: {
              TestIDHash: TestIDHash[i],
              display: "Failed...",
              className: "text-danger",
              icons: <i class="fa fa-times" aria-hidden="true"></i>,
              backgroundColor: "#ffd6d6",
            },
          };
        }

        setDownloadLoading({
          ...statusOfDownload,
        });

        payload.status = 0;
      });
  };

  const handleBulkDownload = async (reportType) => {
    const { letterHead, Signature } = reportType;
    setBulkDownloadtypeState(false);
    setDownloadLoad(true);
    let payload = currentTableTestData?.reduce((acc, current) => {
      const index = acc.findIndex(
        (ele) => ele.ledgertransactionid === current?.ledgertransactionid
      );
      if (current.isChecked) {
        if (index >= 0) {
          acc[index].TestIDHash = [
            ...acc[index].TestIDHash,
            current?.TestIDHash,
          ];
        } else {
          acc.push({
            ledgertransactionid: current?.ledgertransactionid,
            LedgerTransactionNo: current?.LedgerTransactionNo,
            TestIDHash: [current?.TestIDHash],
            status: 1,
          });
        }
      }
      return acc;
    }, []);

    let BulkUrl = [];

    for (let i = 0; i < payload.length; i++) {
      await downloadFile(
        payload[i].TestIDHash,
        letterHead,
        Signature,
        payload[i],
        BulkUrl
      );
    }

    axiosReport
      .post("commonReports/BulkDownload", {
        pdfUrls: BulkUrl,
      })
      .then((res) => {
        setDownloadLoad(false);
        window.open(res?.data?.url, "_blank");
      })
      .catch((err) => {
        setDownloadLoad(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
      });
  };

  const handleDoctorName = (e) => {
    setApprovedBy(e.target.value);
  };

  useEffect(() => {
    getAccessCentres();
    getDepartment();
    BindMachineName();
    BindApprovalDoctor();
  }, []);

  return (
    <>
      <Accordion
        name={t("Bulk Activity")}
        isBreadcrumb={true}
        defaultValue={true}
      >
        <div className="row  px-2 mt-2">
          <div className="col-sm-2">
            <div className="d-flex" style={{ display: "flex" }}>
              <div style={{ width: "40%" }}>
                <SelectBox
                  options={[
                    ...SearchBy,
                    ...(shouldIncludeAIIMSID()
                      ? [{ label: "AIIMSID", value: "AIIMSID" }]
                      : []),
                  ]}
                  id="SelectTypes"
                  lable="SelectTypes"
                  selectedValue={payload?.SelectTypes}
                  name="SelectTypes"
                  onChange={handleChange}
                />
              </div>
              <div style={{ width: "60%" }}>
                {payload?.SelectTypes === "Mobile" ? (
                  <div style={{ width: "100%" }}>
                    <Input
                      type="number"
                      name="ItemValue"
                      max={10}
                      value={payload?.ItemValue}
                      onInput={(e) => number(e, 10)}
                      onChange={handleChange}
                    />
                  </div>
                ) : (
                  <div style={{ width: "100%" }}>
                    <Input
                      type="text"
                      name="ItemValue"
                      max={20}
                      value={payload?.ItemValue}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-sm-2">
            <SelectBox
              options={[{ label: "Select Centre", value: "" }, ...CentreData]}
              selectedValue={payload?.CentreID}
              name="CentreID"
              lable="Centre"
              id="Centre"
              onChange={handleChange}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={AddBlankData(DepartmentData, "All Department")}
              lable="Department"
              id="Department"
              selectedValue={payload.DepartmentID}
              name="DepartmentID"
              onChange={handleChange}
            />
          </div>
          <div className="col-sm-2">
            <Input
              type="text"
              placeholder=" "
              lable="Refer Doctor"
              id="DoctorName"
              name="DoctorName"
              value={payload?.DoctorName}
              onKeyDown={(e) => handleIndexNew(e, "DoctorName")}
              onBlur={(e) => {
                autocompleteOnBlur(setDoctorSuggestion);
                setTimeout(() => {
                  const data = doctorSuggestion?.filter(
                    (ele) => ele?.Name === e.target.value
                  );
                  if (data?.length === 0) {
                    setPayload({ ...payload, DoctorName: "" });
                  }
                }, 500);
              }}
              autoComplete="off"
              onChange={handleChange}
            />
            {dropFalse && doctorSuggestion?.length > 0 && (
              <ul
                className="suggestion-data"
                style={{ top: "26px", right: "0px" }}
              >
                {doctorSuggestion?.map((data, index) => (
                  <li
                    onClick={() => handleListSearchNew(data, "DoctorName")}
                    className={`${index === indexMatch && "matchIndex"}`}
                    key={index}
                  >
                    {data?.Name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="col-sm-2  ">
            <SelectBoxWithCheckbox
              options={TestSuggestion}
              value={payload?.TestName}
              name="TestName"
              placeholder=" "
              lable="TestName"
              id="TestName"
              onChange={handleSelectMultiChange}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={[{ label: "All Machine", value: "ALL" }, ...machineId]}
              onChange={handleChange}
              name="MachineID"
              lable="MachineID"
              id="MachineID"
              selectedValue={payload?.MachineID}
            />
          </div>
        </div>
        <div className="row  px-2 mb-1">
          <div className="col-sm-2 ">
            <DatePicker
              name="FromDate"
              className="custom-calendar"
              id="FromDate"
              lable="FromDate"
              value={payload?.FromDate}
              onChange={dateSelect}
              maxDate={new Date(payload?.ToDate)}
            />
          </div>
          <div className="col-sm-1">
            <CustomTimePicker
              name="FromTime"
              placeholder="FromTime"
              value={payload?.FromTime}
              id="FromTime"
              lable="FromTime"
              onChange={handleTime}
            />
          </div>
          <div className="col-sm-2 ">
            <div>
              <DatePicker
                className="custom-calendar"
                name="ToDate"
                value={payload?.ToDate}
                onChange={dateSelect}
                placeholder=" "
                id="ToDate"
                lable="ToDate"
                maxDate={new Date()}
                minDate={new Date(payload?.FromDate)}
              />
            </div>
          </div>
          <div className="col-sm-1">
            <CustomTimePicker
              name="ToTime"
              placeholder="ToTime"
              value={payload?.ToTime}
              id="ToTime"
              lable="ToTime"
              onChange={handleTime}
            />
          </div>

          <div className="col-sm-2">
            <SelectBox
              options={sampleStatusOptions()}
              onChange={handleChange}
              id="SampleStatus"
              lable="SampleStatus"
              name="SampleStatus"
              selectedValue={payload?.SampleStatus}
            />
          </div>

          <div className="col-sm-1">
            <input
              type="checkbox"
              name="Urgent"
              value={payload?.Urgent}
              checked={payload?.Urgent}
              onChange={handleChange}
            />
            <label className="ml-2">{t("IsUrgent")}</label>
          </div>

          <div className="col-sm-1">
            <input
              type="checkbox"
              name="IsCulture"
              value={payload?.IsCulture}
              checked={payload?.IsCulture}
              onChange={handleChange}
            />
            <label className="ml-2">{t("IsCulture")}</label>
          </div>

          <div className="col-sm-1">
            <button
              onClick={() => TableData(payload?.SampleStatus)}
              className="btn btn-success btn-sm w-100"
            >
              <div className="">{t("Search")}</div>
            </button>
          </div>
        </div>
      </Accordion>
      <Accordion title={t("Search Data")} defaultValue={true}>
        {load ? (
          <Loading />
        ) : (
          <>
            {currentTableTestData?.length > 0 ? (
              <div>
                <div className="row p-2">
                  <div className="col-12">
                    <div
                      style={{
                        maxHeight: "500px",
                        overflowY: "auto",
                      }}
                    >
                      <Tables>
                        <thead
                          className="cf"
                          style={{
                            position: "sticky",
                            // zIndex: 99,
                            top: 0,
                          }}
                        >
                          <tr>
                            <th>{t("S.No")}</th>
                            <th>
                              <input
                                style={{ marginRight: "10px" }}
                                type="checkbox"
                                name="isChecked"
                                onChange={(e) => {
                                  handleCheck(e);
                                }}
                                checked={
                                  currentTableTestData.length > 0
                                    ? isChecked(
                                        "isChecked",
                                        currentTableTestData,
                                        true
                                      ).includes(false)
                                      ? false
                                      : true
                                    : false
                                }
                              />
                            </th>
                            <th>{t("Barcode No.")}</th>
                            <th>{t("Investigation")}</th>
                            <th>{t("Lab Ref No.")}</th>
                            <th>{t("Delay")}</th>
                            <th>{t("Result/Value")}</th>
                            <th>{t("Reference Range")}</th>
                            <th>{t("Details")}</th>
                            <th>{t("Print")}</th>
                            <th>{t("Customize Date")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentTableTestData?.map((ele, index) => (
                            <>
                              <tr key={index}>
                                <td
                                  colSpan={2}
                                  className={`Status-${ele?.Status}`}
                                ></td>
                                <td colSpan={8}>
                                  LabNo:{ele?.LedgerTransactionNo}, UHID:
                                  {ele?.PatientCode}, PatientName:
                                  {ele?.PatientName}, Age/Gender:
                                  {ele?.AgeGender}, SINNo:
                                  {ele?.BarcodeNo}, RegistrationDate:
                                  {ele?.orderDAte}, IPNo:
                                  {ele?.IPNo ?? "-"}, Source:
                                  {ele?.Source ?? "-"}, RefBy:{ele?.RefBy}
                                </td>
                              </tr>
                              <tr
                                style={{
                                  backgroundColor: `${ele?.Isculture && "#e8fdb4"}`,
                                }}
                              >
                                <td data-title={t("S.No")}>
                                  {index +
                                    1 +
                                    IndexHandle(currentPage, PageSize)}
                                  &nbsp;
                                </td>
                                <td data-title={t("Select")}>
                                  {
                                    <input
                                      type="checkbox"
                                      name="isChecked"
                                      onChange={(e) => {
                                        handleCheck(e, index);
                                      }}
                                      checked={ele?.isChecked}
                                    ></input>
                                  }
                                  &nbsp;
                                </td>
                                <td
                                  data-title={t("Barcode No.")}
                                  ref={(el) => {
                                    if (
                                      el &&
                                      downloadLoading?.[ele?.TestIDHash]
                                        ?.icons &&
                                      downloadLoading?.[ele?.TestIDHash]
                                        ?.TestIDHash === ele?.TestIDHash
                                    ) {
                                      el.scrollIntoView({
                                        behavior: "smooth",
                                        block: "nearest",
                                      });
                                    }
                                  }}
                                >
                                  {ele?.BarcodeNo}&nbsp;
                                  {downloadLoading?.[ele?.TestIDHash]
                                    ?.TestIDHash === ele?.TestIDHash && (
                                    <div
                                      className="box-title"
                                      style={{
                                        padding: "1px",
                                        borderRadius: "3px",
                                        backgroundColor:
                                          downloadLoading?.[ele?.TestIDHash]
                                            ?.backgroundColor,
                                      }}
                                    >
                                      <strong
                                        className={
                                          downloadLoading?.[ele?.TestIDHash]
                                            ?.className
                                        }
                                      >
                                        {t(
                                          downloadLoading?.[ele?.TestIDHash]
                                            ?.display
                                        )}
                                        {
                                          downloadLoading?.[ele?.TestIDHash]
                                            ?.icons
                                        }
                                      </strong>
                                    </div>
                                  )}
                                </td>
                                <td data-title={t("Investigation")}>
                                  {ele?.InvestigationName}&nbsp;
                                </td>
                                <td data-title={t("Lab Ref No.")}>
                                  {ele?.LedgerTransactionNo}&nbsp;
                                </td>
                                <td data-title={t("Delay")}>{}&nbsp;</td>
                                {ele?.Isculture === 0 ? (
                                  <td data-title={t("Result/Value")}>
                                    {ele?.Parametercount === 1 ? (
                                      ele?.VALUE
                                    ) : actionLoading?.load &&
                                      actionLoading?.type === "showResult" &&
                                      actionLoading?.index === index ? (
                                      <SpinnerLoad />
                                    ) : (
                                      <div
                                        className="text-primary"
                                        style={{
                                          textDecoration: "underline",
                                          cursor: "pointer",
                                        }}
                                        onClick={() =>
                                          showResult(
                                            Number(ele?.Investigationid),
                                            ele?.PatientCode,
                                            index
                                          )
                                        }
                                      >
                                        {t("Result")}
                                      </div>
                                    )}
                                    &nbsp;
                                  </td>
                                ) : (
                                  <td data-title={t("Result/Value")}></td>
                                )}
                                <td data-title={t("Reference Range")}>
                                  {ele?.ReferenceRange}&nbsp;
                                </td>
                                <td
                                  data-title={t("Details")}
                                  onClick={() => {
                                    setModal(true);
                                    setVisitID(ele?.LedgerTransactionNo);
                                  }}
                                >
                                  <i className="fa fa-search" />
                                </td>
                                {[6, 5].includes(ele?.Status) ? (
                                  <td data-title={t("Print")}>
                                    {actionLoading?.load &&
                                    actionLoading?.type ===
                                      "Printwithoutheader" &&
                                    actionLoading?.index === index ? (
                                      <Loading />
                                    ) : (
                                      <i
                                        className="fa fa-print"
                                        style={{
                                          cursor: "pointer",
                                          textAlign: "center",
                                        }}
                                        onClick={() =>
                                          handleReport(
                                            ele?.TestIDHash,
                                            0,
                                            "Printwithoutheader",
                                            index
                                          )
                                        }
                                        title="Print without header"
                                      ></i>
                                    )}
                                    &nbsp;
                                    {/* <br></br>
                                    <br></br> */}
                                    {actionLoading?.load &&
                                    actionLoading?.type === "Printwithheader" &&
                                    actionLoading?.index === index ? (
                                      <Loading />
                                    ) : (
                                      <i
                                        className="fa fa-print"
                                        style={{
                                          color: "red",
                                          cursor: "pointer",
                                          textAlign: "center",
                                        }}
                                        onClick={() =>
                                          handleReport(
                                            ele?.TestIDHash,
                                            1,
                                            "Printwithheader",
                                            index
                                          )
                                        }
                                        title="Print with header"
                                      ></i>
                                    )}
                                  </td>
                                ) : (
                                  <td></td>
                                )}

                                <td data-title={t("Customize Date")}>
                                  <div
                                    className="text-info"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setCustomizeDateModal({
                                        TestId: ele?.TestID.toString(),
                                        show: true,
                                      });
                                    }}
                                  >
                                    <i className="fa fa-edit"></i>
                                  </div>
                                  &nbsp;
                                </td>
                              </tr>
                            </>
                          ))}
                        </tbody>
                      </Tables>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <>
                    {[3, 10].includes(parseInt(payload?.SampleStatus)) && (
                      <>
                        <div className="col-sm-2">
                          <SelectBox
                            selectedValue={ApprovedBy}
                            id="ApprovedBy"
                            lable="ApprovedBy"
                            options={doctorAdmin}
                            name="ApprovedBy"
                            onChange={handleDoctorName}
                          ></SelectBox>
                        </div>{" "}
                        <div className="col-sm-2">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={ApproveAllTest}
                          >
                            Approve
                          </button>
                        </div>
                      </>
                    )}

                    {[5, 6].includes(parseInt(payload?.SampleStatus)) && (
                      <div className="col-sm-1">
                        <button
                          className="btn btn-sm btn-success mx-2 my-1 my"
                          disabled={
                            filterOutChecked(currentTableTestData, "TestID")
                              .length > 0
                              ? false
                              : true
                          }
                          onClick={() => {
                            if (downloadLoad) {
                              toast.warn("Please wait Generating Report");
                            } else setBulkDownloadtypeState(true);
                          }}
                        >
                          {t("Bulk Download")}
                        </button>
                      </div>
                    )}
                    {[5, 6].includes(parseInt(payload?.SampleStatus)) && (
                      <button
                        className="btn btn-sm btn-success mx-2 my-1 my"
                        disabled={
                          filterOutChecked(currentTableTestData, "TestID")
                            .length > 0
                            ? false
                            : true
                        }
                        onClick={() =>
                          setBulkEmailModalState({
                            modal: true,
                            data: currentTableTestData,
                            type: "EmailSend",
                          })
                        }
                      >
                        {t("Bulk Email")}
                      </button>
                    )}
                    <div className="col-sm-6 mb-1" style={{ textAlign: "end" }}>
                      <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={tableData?.length}
                        pageSize={PageSize}
                        onPageChange={(page) => setCurrentPage(page)}
                      />
                    </div>
                  </>
                </div>
              </div>
            ) : (
              <NoRecordFound />
            )}
          </>
        )}
      </Accordion>
      {/* {observationData.length > 0 && (
        <BulkApprovalModal
          show={true}
          onHide={() => setObservationData([])}
          data={observationData}
        />
      )} */}

      {modal && (
        <CustomModal
          show={modal}
          visitID={visitID}
          onHide={() => setModal(false)}
        />
      )}

      {customizeDateModal?.show && (
        <CustomDateModal
          show={customizeDateModal?.show}
          data={customizeDateModal?.TestId}
          onHide={() =>
            setCustomizeDateModal({
              show: false,
              TestId: "",
            })
          }
        />
      )}

      {bulkDownloadtypeState && (
        <BulkDownloadType
          show={bulkDownloadtypeState}
          onHide={() => setBulkDownloadtypeState(false)}
          onSubmit={handleBulkDownload}
        />
      )}

      {BulkEmailModalState?.modal && (
        <BulkEmailModal
          data={BulkEmailModalState}
          onHide={() =>
            setBulkEmailModalState({
              modal: false,
              data: [],
              type: "",
            })
          }
        />
      )}
    </>
  );
};

export default BulkActivity;
