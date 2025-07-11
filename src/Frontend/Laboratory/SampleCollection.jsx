import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import {
  checkDuplicateBarcode,
  getDoctorSuggestion,
  getPaymentModes,
  getRejectCount,
} from "../../utils/NetworkApi/commonApi";

import {
  AddBlankData,
  AllDataDropDownPayload,
  Time,
  autocompleteOnBlur,
  dateConfig,
  getTrimmedData,
  isChecked,
  number,
  shouldIncludeAIIMSID,
} from "../../utils/helpers";
import { SampleStatusSearch, SearchBy } from "../../utils/Constants";
import Accordion from "@app/components/UI/Accordion";

import { useTranslation } from "react-i18next";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Input from "../../components/formComponent/Input";
import DatePicker from "../../components/formComponent/DatePicker";
import CustomTimePicker from "../../components/formComponent/TimePicker";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
import MedicialModal from "../utils/MedicialModal";
import SampleRemark from "../utils/SampleRemark";
import { axiosInstance } from "../../utils/axiosInstance";
import Heading from "../../components/UI/Heading";
import UploadFile from "../utils/UploadFileModal/UploadFile";
import CustomModal from "../utils/CustomModal";
import Tooltip from "../../components/formComponent/Tooltip";
import SampleCollectionTable from "../Table/SampleCollectionTable";
import Medical from ".././Images/Medical.png";
import file from ".././Images/file.png";
import Remark from ".././Images/Remark.png";
import Prick from ".././Images/Prick.png";

import Urgent from ".././Images/urgent.gif";
import UpdateRemark from "../utils/UpdateRemark";
import ReactSelect from "../../components/formComponent/ReactSelect";
const SampleCollection = () => {
  const [CentreData, setCentreData] = useState([]);
  const [toggleTable, setToggleTable] = useState(true);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [payload, setPayload] = useState([]);
  const [Identity, setIdentity] = useState([]);
  const [RateTypes, setRateTypes] = useState([]);
  const [scdata, setScData] = useState([]);
  const [searchInvdata, setSearchInvdata] = useState([]);
  const [newdata, setNewData] = useState([]);
  const [snr, setSnr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [indexMatch, setIndexMatch] = useState(0);
  const [dropFalse, setDropFalse] = useState(true);
  const [show4, setShow4] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  const [saveLoad, setSaveLoad] = useState(false);
  const [show, setShow] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  const [showLog, setShowLog] = useState({
    modal: false,
    visitId: "",
  });
  const today = new Date();
  const [formData, setFormData] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    CentreID: "",
    ItemValue: "",
    RateID: "",
    SelectTypes: "",
    RefundFilter: null,
    FromTime: new Date(today.setHours(0, 0, 0, 0)),
    ToTime: new Date(today.setHours(23, 59, 59, 999)),
    DoctorReferal: "",
    DepartmentID: "",
    DoctorName: "",
    SampleStatus: "1",
  });
  const location = useLocation();
  const { state } = location;
  const [local, setLocal] = useState(state?.other);
  const [showRemark, setShowRemark] = useState(false);
  const [showUpdateRemark, setShowUpdateRemark] = useState({
    modal: false,
    data: "",
    index: -1,
  });

  const [showPrickRemark, setShowPrickRemark] = useState(false);

  const navigate = useNavigate();
  const handleIndex = (e) => {
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
        handleListSearch(doctorSuggestion[indexMatch], "DoctorName");
        setIndexMatch(0);
        break;
      default:
        break;
    }
  };

  const handleListSearch = (data, name) => {
    switch (name) {
      case "DoctorName":
        setFormData({
          ...formData,
          [name]: data?.Name,
          DoctorReferal: data?.Name ? data?.DoctorReferalID : "",
        });
        setIndexMatch(0);
        setDoctorSuggestion([]);
        setDropFalse(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getDoctorSuggestion(formData, setDoctorSuggestion, setFormData);
    if (formData?.DoctorName === "") {
      setDropFalse(true);
    }
  }, [formData?.DoctorName]);

  // const validation = () => {
  //   let error = "";
  //   if (
  //     formData?.SelectTypes.trim() !== "" &&
  //     formData?.ItemValue.trim() === ""
  //   ) {
  //     error = { ...error, ItemValue: t("Please Choose Value") };
  //   }

  //   if (formData.SelectTypes === "Mobile") {
  //     if (formData?.SelectTypes !== "" && formData?.ItemValue === "") {
  //       error = { ...error, ItemValue: t("This Field is Required") };
  //     } else if (formData.ItemValue.length !== 10) {
  //       error = { ...error, ItemValue: t("Invalid Mobile Number") };
  //     }
  //   }
  //   return error;
  // };

  // const handleToggle = (name) => {
  //   setToggleDate({ ...toggleDate, [name]: !toggleDate[name] });
  // };

  const dateSelect = (value, name) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSearchSelectChange = (label, value) => {
    if (label === "CentreID") {
      setFormData({ ...formData, [label]: value?.value, RateTypeID: "" });
      fetchRateTypes(
        value?.value == ""
          ? CentreData?.map((ele) => ele?.value)
          : [value?.value],
        DepartmentData?.map((ele) => ele?.value)
      );
    } else {
      setFormData({ ...formData, [label]: value?.value });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
        const Centre = CentreDataValue?.map((ele) => ele?.value);
        getDepartment(Centre);
        setCentreData(CentreDataValue);
      })
      .catch((err) => {
        getDepartment([]);
      });
  };

  const handleTime = (time, name) => {
    setFormData({ ...formData, [name]: time });
  };

  const getDepartment = (Centre) => {
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
        const Dept = DeptDataValue?.map((ele) => ele?.value);
        setDepartmentData(DeptDataValue);
        fetchRateTypes(Centre, Dept);
      })
      .catch((err) => {});
  };

  const filterPayload = (filterData) => {
    const data = filterData.filter(
      (ele) =>
        ele.Status === 1 || (ele.Status === 4 && ele?.isSampleReCollection == 1)
    );
    return data;
  };
  const filterPayload2 = (filterData) => {
    const data = filterData.filter(
      (ele) =>
        ele.Status == 1 ||
        (ele.Status == 4 && ele?.isSampleReCollection == 1) ||
        ele.Status == 2
    );
    return data;
  };

  const handleCheckboxCondition = useCallback(
    (data) => {
      let status = false;
      for (let i = 0; i < data?.length; i++) {
        if ([1, 4, 2].includes(data[i]["Status"])) {
          status = true;
          break;
        }
      }
      return status;
    },
    [searchInvdata]
  );

  const getBarcodeData = (arr, VisitNo, SINNo) => {
    axiosInstance
      .post("SC/getBarcode", {
        LedgerTransactionNo: VisitNo,
        BarcodeNo: SINNo,
        TestID: arr,
      })
      .then((res) => {
        if (res?.data?.message != "") window.open(res?.data?.message);
        //toast.success(res.data.message);
      })
      .catch((err) => {
        if (err.response.status === 504) {
          toast.error(t("Something Went Wrong"));
        }
        if (err.response.status === 401) {
          toast.error(err.response.data.message);
        }
      });
  };

  const checkSampleTypeIdCheck = (payload) => {
    const hasInvalidSampleType = payload.some(
      (ele) => ele.SampleTypeID === 0 || ele.SampleTypeID === ""
    );

    return !hasInvalidSampleType;
  };

  const SaveSampleCollection = () => {
    const getBarcodeDate = getTrimmedData(filterPayload(payload));
    const testidArray =
      getBarcodeDate &&
      getBarcodeDate.map((ele) => {
        return ele?.TestID;
      });
    const barcodeArray =
      getBarcodeDate &&
      Array.from(
        new Set(getBarcodeDate.map((ele) => ele?.SINNo).filter(Boolean))
      );
    if (filterPayload(payload)?.length > 0) {
      setSaveLoad(true);
      axiosInstance
        .post("SC/SampleCollection", {
          data: getTrimmedData(
            filterPayload(payload).map((item) => ({
              ...item,
              HistoCytoSampleDetail: `${item?.Container}^${item?.Slide}^${item?.Block}^`,
            }))
          ),
        })
        .then((res) => {
          setSaveLoad(false);
          toast.success(res.data.message);
          // getBarcodeData(testidArray, getBarcodeDate[0]?.VisitNo, barcodeArray);
          getRejectCount();
          setPayload([]);
          if (payload.length === searchInvdata.length) {
            TableData("");
          } else {
            TableData(document.getElementById("SampleStatusSearch").value);
          }
        })
        .catch((err) => {
          setSaveLoad(false);
          if (err.response.status === 504) {
            toast.error(t("Something Went Wrong"));
          }
          if (err.response.status === 401) {
            toast.error(err.response.data.message);
          }
        });
    } else {
      toast.error(
        "Please Select Atlease One Test Or For Collect Rejected test contact to admin"
      );
    }
  };

  const SaveSNR = () => {
    const getBarcodeDate = getTrimmedData(filterPayload2(payload));
    const testidArray =
      getBarcodeDate &&
      getBarcodeDate.map((ele) => {
        return ele?.TestID;
      });
    const barcodeArray =
      getBarcodeDate &&
      Array.from(
        new Set(getBarcodeDate.map((ele) => ele?.SINNo).filter(Boolean))
      );
    if (filterPayload2(payload)?.length > 0) {
      setSaveLoad(true);
      axiosInstance
        .post("SC/SampleSNR", {
          data: getTrimmedData(
            filterPayload2(payload).map((item) => ({
              ...item,
              HistoCytoSampleDetail: `${item?.Container}^${item?.Slide}^${item?.Block}^`,
            }))
          ),
        })
        .then((res) => {
          setSaveLoad(false);
          toast.success(res.data.message);
          getBarcodeData(testidArray, getBarcodeDate[0]?.VisitNo, barcodeArray);
          getRejectCount();
          setPayload([]);
          if (payload.length === searchInvdata.length) {
            TableData("");
          } else {
            // SearchInvestigationData(payload[0]?.LedgerTransactionID);
            TableData(document.getElementById("SampleStatusSearch").value);
          }
        })
        .catch((err) => {
          setSaveLoad(false);
          if (err.response.status === 504) {
            toast.error(t("Something Went Wrong"));
          }
          if (err.response.status === 401) {
            toast.error(err.response.data.message);
          }
        });
    } else {
      toast.error("Please Select atlease One Test to Continue");
    }
  };
  const TableData = (status, centre, Dep, Rate) => {
    axiosInstance
      .post(
        "SC/GetSampleCollection",
        getTrimmedData({
          CentreID:
            centre ??
            AllDataDropDownPayload(formData?.CentreID, CentreData, "value"),
          SelectTypes: formData.SelectTypes,
          ItemValue: formData.ItemValue.trim(),
          RateTypeID:
            Rate ??
            AllDataDropDownPayload(formData?.RateTypeID, RateTypes, "value"),
          DoctorReferal: formData.DoctorReferal,
          FromDate: moment(formData.FromDate).format("DD/MMM/YYYY"),
          ToDate: moment(formData.ToDate).format("DD/MMM/YYYY"),
          FromTime: Time(formData.FromTime),
          ToTime: Time(formData.ToTime),
          DepartmentID:
            Dep ??
            AllDataDropDownPayload(
              formData?.DepartmentID,
              DepartmentData,
              "value"
            ),
          SampleStatus: status,
        })
      )
      .then((res) => {
        if (res?.data?.success) {
          setScData(res?.data?.message);
          setToggleTable(true);
        } else {
          setScData([]);
          setToggleTable(true);
          setSearchInvdata([]);
          toast.error("No Record Found");
        }

        setLoading(false);
      })
      .catch((err) => setLoading(false));
  };
  const [t] = useTranslation();
  const SearchInvestigationData = (LedgerTransactionID) => {
    axiosInstance
      .post("SC/SearchInvestigation", {
        LedgerTransactionID: LedgerTransactionID,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele, index) => {
          return {
            ...ele,
            index: index,
            isSelected: false,
            valQty: 1,

            Container:
              ele?.HistoCytoSampleDetail == ""
                ? "0"
                : ele?.HistoCytoSampleDetail?.split("^")?.[0],
            Slide:
              ele?.HistoCytoSampleDetail == ""
                ? "0"
                : ele?.HistoCytoSampleDetail?.split("^")?.[1],
            Block:
              ele?.HistoCytoSampleDetail == ""
                ? "0"
                : ele?.HistoCytoSampleDetail?.split("^")?.[2],
          };
        });
        console.log(val);
        setSearchInvdata(val);
        setNewData(
          res?.data?.message.some((x) => x.Status == "1" || x.Status == "4")
        );
        setSnr(
          res?.data?.message.some(
            (x) => x.Status == "1" || x.Status == "4" || x.Status == "2"
          )
        );
        setToggleTable(false);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  };

  const handlePayload = (e) => {
    const { checked } = e.target;
    let flag = 1;
    for (let i = 0; i < searchInvdata.length; i++) {
      if (
        ["", null].includes(searchInvdata[i].SINNo) ||
        searchInvdata[i]?.SINNo?.length < 3
      ) {
        flag = 0;
      }
      break;
    }
    if (checked) {
      if (flag) {
        const data = searchInvdata.map((ele) => {
          return {
            ...ele,
            isSelected: true,
          };
        });
        setSearchInvdata(data);
        setPayload(data);
      } else {
        toast.error(
          t("Barcode is Required Field and Should Contain atleast 3 character")
        );
      }
    } else {
      const data = searchInvdata.map((ele) => {
        return {
          ...ele,
          isSelected: false,
        };
      });
      setSearchInvdata(data);
      setPayload([]);
    }
  };

  const handleCloseBarcodeModal = (
    value,
    LedgerTransactionID,
    barcodeLogic,
    sampletypeId
  ) => {
    checkDuplicateBarcode(value, LedgerTransactionID).then((res) => {
      if (res === " " || res === "") {
      } else {
        if (barcodeLogic === 3) {
          const data = searchInvdata.map((ele) => {
            return {
              ...ele,
              SINNo: "",
            };
          });
          setSearchInvdata(data);
          toast.error(res);
        }

        if (barcodeLogic === 4) {
          const data = searchInvdata.map((ele) => {
            if (ele?.SampleTypeID === sampletypeId) {
              return {
                ...ele,
                SINNo: "",
              };
            } else {
              return ele;
            }
          });
          setSearchInvdata(data);
          toast.error(res);
        }
      }
    });
  };

  const handleBarcode = (e, barcodeLogic, sampletypeId) => {
    console.log(barcodeLogic, sampletypeId, "this is handleBarcode");
    console.log(e, "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    const { value } = e.target;
    if (barcodeLogic === 3) {
      const data = searchInvdata.map((ele) => {
        return {
          ...ele,
          SINNo: value,
        };
      });
      console.log(value, "value-------");
      setSearchInvdata(data);
    }
    if (barcodeLogic === 4) {
      let flag = true;
      for (let i = 0; i < searchInvdata.length; i++) {
        if (
          searchInvdata[i]?.SampleTypeID !== sampletypeId &&
          value !== "" &&
          value === searchInvdata[i]?.SINNo
        ) {
          flag = false;
          break;
        }
      }
      if (flag) {
        const data = searchInvdata.map((ele) => {
          if (ele?.SampleTypeID === sampletypeId) {
            return {
              ...ele,
              SINNo: value,
            };
          } else {
            return ele;
          }
        });
        setSearchInvdata(data);
      } else {
        toast.error(t("This BarCode is Already Given"));
      }
    }
  };

  const handleUploadCount = (name, value, secondName) => {
    const data = searchInvdata?.map((ele) => {
      return {
        ...ele,
        [name]: value,
        [secondName]: value === 0 ? 0 : 1,
      };
    });
    setSearchInvdata(data);
  };

  const handleSearchByDropDown = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      ["SampleStatus"]: value,
    });
    TableData(value);
  };
  const fetchRateTypes = async (Center, Dept) => {
    try {
      const res = await axiosInstance.post("Centre/GetRateType", {
        CentreId: Center,
      });
      const list = res?.data?.message.map((item) => ({
        label: item?.RateTypeName,
        value: item?.RateTypeID,
      }));

      setRateTypes(list);
      const Rate = list?.map((ele) => ele?.value);
      if (local) {
        TableData("4", Center, Dept, Rate);
        setFormData({
          ...formData,
          ["SampleStatus"]: "4",
        });
        setLocal(false);
      }
    } catch (err) {
      if (local) {
        TableData("4", Center, Dept, []);
        setFormData({
          ...formData,
          ["SampleStatus"]: "4",
        });
      }
      console.log(err);
    }
  };

  useEffect(() => {
    getAccessCentres();
    getPaymentModes("Identity", setIdentity);
  }, []);

  const handleKeyDown = (e) => {
    if (e?.key === "Enter") {
      TableData("1");
    }
  };

  const handleShowRemark = () => {
    setShowRemark(false);
  };
  const handleShowPrickRemarks = () => {
    setShowPrickRemark(false);
  };

  const handleValQty = (type, sinNo, active) => {
    const data = searchInvdata.map((ele) => {
      if (sinNo === ele?.SINNo) {
        if (type === "add") {
          return {
            ...ele,
            valQty: ele.valQty + 1,
          };
        } else if (type === "sub" && ele?.valQty > 0) {
          return {
            ...ele,
            valQty: ele.valQty - 1,
          };
        } else {
          return ele;
        }
      } else {
        return ele;
      }
    });
    setSearchInvdata(data);
  };
  return (
    <>
      {showLog?.modal && (
        <CustomModal
          show={showLog?.modal}
          visitID={showLog?.visitId}
          onHide={() =>
            setShowLog({
              modal: false,
              visitId: "",
            })
          }
        />
      )}
      {show?.modal && (
        <UploadFile
          handleClose={() => {
            setShow({ modal: false, data: "", index: -1 });
          }}
          show={show?.modal}
          options={Identity}
          documentId={show?.data}
          pageName="Patient Registration"
          handleUploadCount={handleUploadCount}
        />
      )}
      {showUpdateRemark?.modal && (
        <UpdateRemark
          show={showUpdateRemark?.modal}
          handleShow={() =>
            setShowUpdateRemark({ modal: false, data: "", index: -1 })
          }
          state={showUpdateRemark?.data}
          PageName={showUpdateRemark?.data?.Remarks}
          status={formData?.SampleStatus}
          title={"Remarks"}
          TableData={TableData}
        />
      )}
      {/* <Heading isBreadcrumb={true} name="SampleCollection" /> */}
      <Accordion
        name={t("Sample Collection Details")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <Accordion defaultValue={true} title={t("Sample Collection Details")} />
        <div className="row pt-2 pl-2 pr-2">
          <div className="col-sm-2">
            <div className="d-flex" style={{ display: "flex" }}>
              <div style={{ width: "50%" }}>
                <SelectBox
                  options={[
                    ...SearchBy,
                    ...(shouldIncludeAIIMSID()
                      ? [{ label: "AIIMSID", value: "AIIMSID" }]
                      : []),
                  ]}
                  selectedValue={formData?.SelectTypes}
                  name="SelectTypes"
                  id="SelectTypes"
                  lable="SelectTypes"
                  onChange={handleChange}
                />
              </div>
              <div style={{ width: "50%" }}>
                {formData?.SelectTypes === "Mobile" ? (
                  <div style={{ width: "100%" }}>
                    <Input
                      className="select-input-box form-control input-sm"
                      type="number"
                      name="ItemValue"
                      max={10}
                      onKeyDown={handleKeyDown}
                      value={formData?.ItemValue}
                      onChange={handleChange}
                      onInput={(e) => number(e, 10)}
                    />
                    {errors?.ItemValue && (
                      <div className="error-message">{errors?.ItemValue}</div>
                    )}
                  </div>
                ) : (
                  <div style={{ width: "100%" }}>
                    <Input
                      className="select-input-box form-control input-sm"
                      type="text"
                      name="ItemValue"
                      max={20}
                      onKeyDown={handleKeyDown}
                      value={formData?.ItemValue}
                      onChange={handleChange}
                    />
                    {errors?.ItemValue && (
                      <div className="error-message">{errors?.ItemValue}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-sm-2">
            <ReactSelect
              dynamicOptions={AddBlankData(CentreData, "All Centre")}
              name="CentreID"
              lable={t("Centre")}
              id="Centre"
              removeIsClearable={true}
              placeholderName={t("Centre")}
              value={formData?.CentreID}
              onChange={handleSearchSelectChange}
            />
          </div>

          <div className="col-sm-2">
            <ReactSelect
              dynamicOptions={AddBlankData(RateTypes, "All RateType")}
              name="RateTypeID"
              lable={t("RateType")}
              id="RateType"
              removeIsClearable={true}
              placeholderName={t("RateType")}
              value={formData?.RateTypeID}
              onChange={handleSearchSelectChange}
            />
          </div>
          <div className="col-sm-2  ">
            <ReactSelect
              dynamicOptions={AddBlankData(DepartmentData, "All Department")}
              name="DepartmentID"
              lable={t("Department")}
              id="Department"
              removeIsClearable={true}
              placeholderName={t("Department")}
              value={formData?.DepartmentID}
              onChange={handleSearchSelectChange}
            />
          </div>
          <div className="col-sm-2 ">
            <Input
              type="text"
              name="DoctorName"
              lable="DoctorName"
              id="DoctorName"
              value={formData?.DoctorName}
              onChange={handleChange}
              onKeyDown={handleIndex}
              placeholder=" "
              onBlur={(e) => {
                autocompleteOnBlur(setDoctorSuggestion);
                setTimeout(() => {
                  const data = doctorSuggestion.filter(
                    (ele) => ele?.Name === e.target.value
                  );
                  if (data.length === 0) {
                    setFormData({ ...formData, DoctorName: "" });
                  }
                }, 500);
              }}
              autoComplete="off"
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
          </div>

          <div className="col-sm-2">
            <SelectBox
              options={SampleStatusSearch}
              className="input-sm"
              lable="SampleStatusSearch"
              name="SelectTypes"
              id="SampleStatusSearch"
              selectedValue={formData?.SampleStatus}
              onChange={handleSearchByDropDown}
            />
          </div>
        </div>
        <div className="row pt-1 pl-2 pr-2">
          <div className="col-sm-2">
            <DatePicker
              className="custom-calendar"
              name="FromDate"
              value={formData?.FromDate}
              placeholder=" "
              id="FromDate"
              lable="FromDate"
              onChange={dateSelect}
              maxDate={new Date(formData.ToDate)}
            />
          </div>
          <div className="col-sm-1">
            <CustomTimePicker
              name="FromTime"
              placeholder="FromTime"
              value={formData?.FromTime}
              id="FromTime"
              lable="FromTime"
              onChange={handleTime}
            />
          </div>
          <div className="col-sm-2">
            <DatePicker
              className="custom-calendar"
              name="ToDate"
              value={formData?.ToDate}
              placeholder=" "
              id="ToDate"
              lable="ToDate"
              onChange={dateSelect}
              maxDate={new Date()}
              minDate={new Date(formData.FromDate)}
            />
          </div>
          <div className="col-sm-1">
            <CustomTimePicker
              name="ToTime"
              placeholder="ToTime"
              value={formData?.ToTime}
              id="ToTime"
              lable="ToTime"
              onChange={handleTime}
            />
          </div>
          <div className="col-sm-1">
            {loading ? (
              <Loading />
            ) : (
              <button
                type="button"
                className="btn btn-block btn-info btn-sm"
                onClick={() =>
                  TableData(document.getElementById("SampleStatusSearch").value)
                }
              >
                {t("Search")}
              </button>
            )}
          </div>{" "}
          {/* <div className="col-sm-2">
            <Input
              type="text"
              placeholder=""
            />
          </div> */}
        </div>
      </Accordion>
      <Accordion title={t("Search Data")} defaultValue={true}>
        <div className="row px-2 mt-2 mb-2">
          <div className="col-12">
            {loading ? (
              <Loading />
            ) : toggleTable ? (
              <>
                {scdata.length > 0 ? (
                  <Tables
                    style={{
                      maxHeight: "400px",
                      overflowY: "auto",
                    }}
                  >
                    <thead className="cf">
                      <tr>
                        <th>{t("S.No")}</th>
                        <th>{t("Barcode No")}</th>
                        <th>{t("RegDate")}</th>
                        <th>{t("VisitNo")}</th>
                        <th>{t("UHID")}</th>
                        <th>{t("Name")}</th>
                        <th>{t("Mobile")}</th>
                        <th>{t("Remarks")}</th>
                        <th className="text-center">
                          <i title={t("Barcode")} className="fa fa-barcode"></i>
                        </th>
                        <th>{t("Age")}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {scdata &&
                        scdata?.map((data, index) => (
                          <tr key={index}>
                            <td data-title={t("S.No")}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                  margin: "0",
                                }}
                              >
                                {index + 1}

                                {data?.isUrgent == 1 && (
                                  <div>
                                    <img
                                      src={Urgent}
                                      className="sizeicon"
                                    ></img>
                                  </div>
                                )}

                                {/* {data?.IsVip === 1 && (
                                    <div>
                                      <img src={VIP}></img>
                                    </div>
                                  )} */}
                              </div>
                            </td>

                            <td data-title={t("Barcode No")}>
                              {data?.SinNo}&nbsp;
                            </td>
                            <td data-title={t("Date")}>
                              {dateConfig(data.Date)}&nbsp;
                            </td>
                            <td
                              className={`color-Status-${data.Status} `}
                              onClick={() =>
                                SearchInvestigationData(
                                  data.LedgerTransactionID
                                )
                              }
                              data-title={"Status"}
                              style={{
                                cursor: "pointer",
                                color: "black !important",
                              }}
                            >
                              {data?.VisitNo}&nbsp;
                            </td>
                            <td data-title={t("UHID")}>
                              {data?.PatientCode}&nbsp;
                            </td>
                            <td data-title={t("PName")}>{data?.PName}&nbsp;</td>
                            <td data-title={t("Mobile")}>
                              {data?.Mobile}&nbsp;
                            </td>
                            <td data-title={t("Remarks")}>
                              <div
                                className="m-0 p-0"
                                onClick={() => {
                                  setShowUpdateRemark({
                                    modal: true,
                                    data: data,
                                    index: index,
                                  });
                                }}
                              >
                                {!data?.Remarks ? (
                                  <i className="bi bi-chat-right-text m-0 text-icon-size-comment ml-2"></i>
                                ) : (
                                  <div className="d-flex align-items-center blink-icon">
                                    {data?.Remarks
                                      ? data?.Remarks.length > 20
                                        ? data?.Remarks.slice(0, 15) + "..."
                                        : data?.Remarks
                                      : ""}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td
                              data-title={t("Barcode Print")}
                              className="text-center"
                            >
                              <span
                                // className="text"
                                style={{ cursor: "pointer" }}
                              >
                                {data?.Status == 2 || data?.Status == 3 ? (
                                  <i
                                    className="fa fa-print"
                                    onClick={() => {
                                      getBarcodeData(
                                        data?.TestID,
                                        data?.VisitNo,
                                        [data?.SinNo]
                                      );
                                    }}
                                  ></i>
                                ) : null}
                              </span>
                              &nbsp;
                            </td>
                            <td data-title={t("Gender")}>
                              {data?.Age}/{data?.Gender}&nbsp;
                            </td>
                            <td className="text-center">
                              <i
                                className="fa fa-search mt-2 mb-1"
                                style={{
                                  cursor: "pointer",
                                  color: "red",
                                }}
                                onClick={() => {
                                  setShowLog({
                                    modal: true,
                                    visitId: data?.VisitNo,
                                  });
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Tables>
                ) : (
                  <NoRecordFound />
                )}
              </>
            ) : (
              <>
                {show4?.modal && (
                  <MedicialModal
                    show={show4.modal}
                    handleClose={() => {
                      setShow4({
                        modal: false,
                        data: "",
                        index: -1,
                      });
                    }}
                    MedicalId={show4?.data}
                    handleUploadCount={handleUploadCount}
                  />
                )}
                {showRemark && (
                  <SampleRemark
                    show={showRemark}
                    handleShow={handleShowRemark}
                    state={handleShowRemark}
                    PageName={searchInvdata[0]?.Remarks}
                    handleSave={handleShowRemark}
                    title={"Remarks"}
                  />
                )}
                {showPrickRemark && (
                  <SampleRemark
                    show={showPrickRemark}
                    handleShow={handleShowPrickRemarks}
                    state={handleShowPrickRemarks}
                    PageName={searchInvdata[0]?.PricksRemarks}
                    handleSave={handleShowRemark}
                    title={"PricksRemarks"}
                  />
                )}
                <div className="p-dialog-header custom-box-body mb-3">
                  <div className="custom-row">
                    <div className="custom-col custom-col-visit">
                      <span className="fa fa-folder custom-text">
                        &nbsp; <span> {searchInvdata[0]?.VisitNo}</span>
                      </span>
                      {searchInvdata.filter((item) => item.StatSample == 1)
                        .length > 0 ? (
                        <span
                          className="fa fa-cog fa-spin"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="STATSample"
                          style={{ marginLeft: "4px" }}
                        ></span>
                      ) : (
                        <></>
                      )}
                    </div>

                    <div className="custom-col">
                      <span className="fa fa-user custom-text">
                        &nbsp; <span>{searchInvdata[0]?.PName}</span>
                      </span>
                    </div>

                    <div className="custom-col">
                      <span className="fa fa-book custom-text">
                        &nbsp;<span>{searchInvdata[0]?.PatientCode}</span>
                      </span>
                    </div>

                    <div className="custom-col custom-col-age-gender">
                      <span className="fa fa-calendar custom-text">
                        &nbsp;<span> {searchInvdata[0]?.Age}</span>
                      </span>
                      <span className="fa fa-street-view custom-text">
                        &nbsp; <span> {searchInvdata[0]?.Gender}</span>
                      </span>
                    </div>

                    <div className="custom-col justify-content-center">
                      <span className="fa fa-h-square custom-text">
                        &nbsp; <span>{searchInvdata[0]?.Centre}</span>
                      </span>
                    </div>

                    <div className="custom-col">
                      <span className="fa fa-user-md custom-text">
                        &nbsp; <span> {searchInvdata[0]?.ReferDoctor}</span>
                      </span>
                    </div>

                    <div className="custom-col">
                      <span className="fa fa-plus-square custom-text">
                        &nbsp;<span> {searchInvdata[0]?.RateType} </span>
                      </span>
                    </div>

                    <div className="custom-col custom-col-regdate">
                      <span className="fa fa-calendar custom-text">
                        &nbsp;{" "}
                        <span> {dateConfig(searchInvdata[0]?.RegDate)}</span>
                      </span>
                    </div>

                    <div className="custom-col custom-end">
                      <Tooltip label={"Uploaded Document"} className={"d-flex"}>
                        <img
                          src={file}
                          className="sizeicon"
                          onClick={() => {
                            setShow({
                              modal: true,
                              data: searchInvdata[0]?.PatientGuid,
                            });
                          }}
                          style={{
                            color:
                              searchInvdata[0]?.UploadDocumentCount > 0
                                ? "#4ea30c"
                                : "black !important",
                            marginRight: "10px",
                            cursor: "pointer",
                          }}
                        ></img>
                        &nbsp;
                        <span>{searchInvdata[0]?.UploadDocumentCount}</span>
                      </Tooltip>
                      <Tooltip label={"Medical History"} className={"d-flex"}>
                        <img
                          src={Medical}
                          className="sizeicon"
                          onClick={() => {
                            setShow4({
                              modal: true,
                              data: searchInvdata[0]?.PatientGuid,
                            });
                          }}
                          style={{
                            color:
                              searchInvdata[0]?.MedicalHistoryCount > 0
                                ? "#4ea30c"
                                : "black !important",
                            marginRight: "10px",
                            cursor: "pointer",
                          }}
                        ></img>
                        &nbsp;
                        <span>{searchInvdata[0]?.MedicalHistoryCount}</span>
                      </Tooltip>
                      <Tooltip label={"Remark"}>
                        <img
                          src={Remark}
                          className="sizeicon"
                          onClick={() => setShowRemark(true)}
                          style={{ marginRight: "10px" }}
                        ></img>
                      </Tooltip>
                      <Tooltip label={"Pricks Remark"}>
                        <img
                          src={Prick}
                          className="sizeicon"
                          onClick={() => setShowPrickRemark(true)}
                        ></img>{" "}
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <div>
                  {}
                  {searchInvdata.length > 0 ? (
                    <div
                      className="box-body divResult boottable table-responsive"
                      id="no-more-tables"
                    >
                      <Tables>
                        <thead>
                          <tr>
                            <th>{t("S.No")}</th>
                            <th>{t("Test")}</th>
                            <th>{t("Barcode Number")}</th>
                            <th>{t("Barcode Print")}</th>
                            <th>{t("Source")}</th>
                            <th>{t("DOS")}</th>
                            <th>{t("Vial Qty")}</th>
                            <th>{t("No Of Pricks")}</th>
                            <th>{t("Prick Remarks")}</th>
                            <th>{t("SampleTypeName")}</th>
                            <th>{t("Reject")}</th>

                            <th className="text-center">
                              {handleCheckboxCondition(searchInvdata) && (
                                <input
                                  type="checkbox"
                                  onChange={(e) => {
                                    setTimeout(handlePayload(e), 500);
                                  }}
                                  className="mt-1"
                                  checked={
                                    searchInvdata.length > 0
                                      ? isChecked(
                                          "isSelected",
                                          searchInvdata,
                                          true
                                        ).includes(false)
                                        ? false
                                        : true
                                      : false
                                  }
                                />
                              )}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchInvdata?.map((data, index) => (
                            <tr
                              key={index}
                              style={{
                                backgroundColor:
                                  data?.isOutSource == 1 ? "pink" : "",
                              }}
                            >
                              <SampleCollectionTable
                                data={data}
                                index={index}
                                payload={payload}
                                setPayload={setPayload}
                                setSearchInvdata={setSearchInvdata}
                                searchInvdata={searchInvdata}
                                TableData={TableData}
                                handleBarcode={handleBarcode}
                                handleCloseBarcodeModal={
                                  handleCloseBarcodeModal
                                }
                                handleValQty={handleValQty}
                                snr={snr}
                              />
                            </tr>
                          ))}
                        </tbody>
                      </Tables>
                    </div>
                  ) : (
                    "No Data Found"
                  )}
                  {saveLoad ? (
                    <Loading />
                  ) : (
                    <div className="row mt-3 mb-2">
                      <div className="d-flex col-md-12 ms-auto justify-content-end">
                        <button
                          className="btn btn-info btn-sm mx-2"
                          onClick={() => {
                            setToggleTable(true);
                          }}
                        >
                          {t("Main List")}
                        </button>
                        &nbsp;
                        {newdata && (
                          <button
                            className="btn btn-info btn-sm mx-2"
                            onClick={() => {
                              SaveSampleCollection();
                            }}
                          >
                            {t("Collect")}
                          </button>
                        )}
                        &nbsp;
                        {snr && (
                          <button
                            className="btn btn-danger btn-sm mx-2"
                            onClick={() => {
                              SaveSNR();
                            }}
                          >
                            {t("SNR")}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>{" "}
        </div>{" "}
      </Accordion>
    </>
  );
};

export default SampleCollection;
