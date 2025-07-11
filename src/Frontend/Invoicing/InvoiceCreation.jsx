import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import moment from "moment";

import DatePicker from "../../components/formComponent/DatePicker";
import { SelectBox } from "../../components/formComponent/SelectBox";
import { ExportToExcel } from "../../utils/helpers";
import Tables from "../../components/UI/customTable";
import Accordion from "@app/components/UI/Accordion";
import Loading from "../../components/loader/Loading";
import { axiosInstance } from "../../utils/axiosInstance";
import { isChecked } from "../util/Commonservices";
import InvoiceCreationModal from "./InvoiceCreationModal";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../components/formComponent/ReactSelect";

const InvoiceCreation = () => {
  const [tableData, setTableData] = useState([]);
  const [patientType, setPatientType] = useState([]);
  const [show, setShow] = useState({
    modal: false,
    id: "",
  });
  const [load, setLoad] = useState({
    name: "",
    loading: false,
  });
  const [CentreData, setCentreData] = useState([]);
  const [payload, setPayload] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    CentreID: "",
    InvoiceDate: new Date(),
    PatientTypes: "",
    IsChecked: "",
  });
  const [excelLoad, setExcelLoad] = useState({
    index: -1,
    load: false,
  });

  const {t} = useTranslation();
  const getPatientType = () => {
    axiosInstance
      .get("centre/getCentreType")
      .then((res) => {
        let data = res?.data?.message;
        let PatientTypeList = data?.map((ele) => {
          return {
            value: ele?.id,
            label: ele?.Centretype,
          };
        });
        setPatientType(PatientTypeList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCheck = (e, index) => {
    const { checked, name } = e.target;
    if (index >= 0) {
      const data = [...tableData];
      data[index][name] = checked;
      setTableData(data);
    } else {
      const data = tableData.map((ele) => {
        return {
          ...ele,
          [name]: checked,
        };
      });
      setTableData(data);
    }
  };

  const saveInvoice = () => {
    const filteredData = tableData.filter((ele) => ele.IsChecked === true);
    if (filteredData.length > 0) {
      setLoad({
        name: "SaveLoading",
        loading: true,
      });
      const val = filteredData.map((ele) => {
        return ele.ClientID;
      });

      axiosInstance
        .post("Accounts/InvoiceCreation", {
          FromDate: moment(payload?.FromDate).format("YYYY-MM-DD"),
          ToDate: moment(payload?.ToDate).format("YYYY-MM-DD"),
          InvoiceDate: moment(payload?.InvoiceDate).format("YYYY-MM-DD"),
          InvoiceTo: val,
        })
        .then((res) => {
          setLoad({
            name: "",
            loading: false,
          });
          InvoiceCreationSearch();
          toast.success(res?.data?.message);
        })
        .catch(() => {
          setLoad({
            name: "",
            loading: false,
          });
        });
    } else {
      toast.error("Please select atleast one.");
    }
  };
  const handleSearchSelectChange =(label,value) =>{
    setPayload({...payload, [label]: String(value?.value)})
    
  }

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    if (name === "PatientTypes") {
      setPayload({ ...payload, [name]: value, CentreID: "" });
      getAccessCentres(value);
    } else {
      setPayload({ ...payload, [name]: value });
    }
  };

  const dateSelect = (value, name) => {
    setPayload({
      ...payload,
      [name]: value,
    });
    setTableData([]);
  };
  const InvoiceCreationSearch = () => {
    if (payload?.PatientTypes) {
      setLoad({
        name: "searchLoading",
        loading: true,
      });

      axiosInstance
        .post("Accounts/InvoiceCreationSearch", {
          ...payload,
          InvoiceTo: payload?.CentreID,
          FromDate: moment(payload?.FromDate).format("DD-MMM-YYYY"),
          ToDate: moment(payload?.ToDate).format("DD-MMM-YYYY"),
        })
        .then((res) => {
          setLoad({
            name: "",
            loading: false,
          });
          if (res?.data.success) {
            if (res?.data?.message.length > 0) {
              setTableData(res?.data?.message);
            } else {
              toast.error("No Record Found");
              setTableData([]);
            }
          } else {
            toast.error("No Record Found");
            setTableData([]);
          }
        })
        .catch((err) => {
          setLoad({
            name: "",
            loading: false,
          });
          toast.error("Something went wrong");
        });
    } else {
      toast.error("Please Select Any Centre Type");
    }
  };
  const downloadExcel = (ele, index) => {
    setExcelLoad({
      index: index,
      load: true,
    });
    axiosInstance
      .post("Accounts/InvoiceDetails", {
        FromDate: moment(payload?.FromDate).format("DD-MMM-YYYY"),
        ToDate: moment(payload?.ToDate).format("DD-MMM-YYYY"),
        InvoiceDate: moment(payload?.InvoiceDate).format("DD-MMM-YYYY"),
        ClientID: ele?.ClientID,
        PatientTypes: ele?.PatientTypes?.toString(),
      })
      .then((res) => {
        setExcelLoad({
          index: index,
          load: false,
        });
        toast.success("Successfully Download");
        let data = res.data.message;
        ExportToExcel(data);
      })
      .catch((err) => {
        setExcelLoad({
          index: index,
          load: false,
        });
        console.log(err);
      });
  };
  const handleModalState = (data) => {
    setShow({
      modal: true,
      id: {
        FromDate: moment(payload?.FromDate).format("DD-MMM-YYYY"),
        ToDate: moment(payload?.ToDate).format("DD-MMM-YYYY"),
        InvoiceDate: moment(payload?.InvoiceDate).format("DD-MMM-YYYY"),
        ClientID: data?.ClientID,
        PatientTypes: data?.PatientTypes?.toString(),
      },
    });
  };

  const handleModalClose = () => {
    setShow({
      modal: false,
      id: "",
    });
  };

  const getAccessCentres = (value) => {
    axiosInstance
      .post("Accounts/GetRateTypeByGlobalCentreById", {
        TypeId: value,
      })
      .then((res) => {
        let data = res.data.message;
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.RateTypeID,
            label: ele.RateTypeName,
          };
        });

        setCentreData(CentreDataValue);
      })
      .catch((err) => {
        setCentreData([]);
        console.log(err);
      });
  };

  const CheckedBox = () => {
    const value = tableData?.filter((ele) => {
      return ele?.IsChecked === true;
    });
    return value.length > 0;
  };

  useEffect(() => {
    getPatientType();
  }, []);
  return (
    <>
      <Accordion
        name={t("Invoice Creation")}
        isBreadcrumb={true}
        defaultValue={true}
      >
        <div className="row px-2 mt-2 mb-1">
          <div className="col-sm-2">
            <SelectBox
              options={[{ label: "Select", value: "" }, ...patientType]}
              name="PatientTypes"
              className="required-fields"
              lable="Centre Type"
              id="Centre Type"
              selectedValue={payload?.PatientTypes}
              onChange={handleSelectChange}
            />
          </div>

          <div className="col-sm-2">
          <ReactSelect
              dynamicOptions={CentreData}
              name="CentreID"
              lable={t("Rate Type")}
              id="Rate Type"
              removeIsClearable={true}
              placeholderName={t("Rate Type")}
              value={payload?.CentreID}
              onChange={handleSearchSelectChange}
              className="required-fields"
            />
          </div>
          <div className="col-sm-2">
            <div>
              <DatePicker
                className="custom-calendar"
                placeholder=" "
                id="FromDate"
                lable="FromDate"
                name="FromDate"
                value={payload?.FromDate}
                onChange={dateSelect}
                maxDate={new Date()}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div>
              <DatePicker
                className="custom-calendar"
                placeholder=" "
                id="ToDate"
                lable="ToDate"
                name="ToDate"
                value={payload?.ToDate}
                onChange={dateSelect}
                minDate={new Date(payload.FromDate)}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div>
              <DatePicker
                className="custom-calendar"
                placeholder=" "
                id="InvoiceDate"
                lable="InvoiceDate"
                name="InvoiceDate"
                value={payload?.InvoiceDate}
                onChange={dateSelect}
                maxDate={new Date()}
              />
            </div>
          </div>
          <div className="col-sm-1">
            <button
              className="btn btn-block btn-success btn-sm"
              onClick={InvoiceCreationSearch}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </Accordion>
      <Accordion title={t("Search Detail")} defaultValue={true}>
        {load?.name === "searchLoading" && load?.loading ? (
          <Loading />
        ) : tableData?.length > 0 ? (
          <>
            <Tables>
              <thead className="text-center cf" style={{ zIndex: 99 }}>
                <tr>
                  <th>{t("View")}</th>
                  <th>{t("S.No")}</th>
                  <th>{t("Code")}</th>
                  <th>{t("Client Name")}</th>
                  <th>{t("Share Amt.")}</th>
                  <th>{t("Net Amt.")}</th>
                  <th>
                    <input
                      type="checkbox"
                      name="IsChecked"
                      onChange={(e) => {
                        handleCheck(e);
                      }}
                      checked={
                        tableData.length > 0
                          ? isChecked("IsChecked", tableData, true).includes(
                              false
                            )
                            ? false
                            : true
                          : false
                      }
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData?.map((ele, index) => (
                  <tr key={index}>
                    <td data-title="View">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <i
                          className="fa fa-search mt-2"
                          onClick={() => handleModalState(ele)}
                        />
                        {excelLoad.load && excelLoad.index == index ? (
                          <Loading />
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="29"
                              height="23"
                              viewBox="0 0 48 48"
                              onClick={() => downloadExcel(ele, index)}
                            >
                              <path
                                fill="#169154"
                                d="M29,6H15.744C14.781,6,14,6.781,14,7.744v7.259h15V6z"
                              ></path>
                              <path
                                fill="#18482a"
                                d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42H29v-8.946H14z"
                              ></path>
                              <path
                                fill="#0c8045"
                                d="M14 15.003H29V24.005000000000003H14z"
                              ></path>
                              <path
                                fill="#17472a"
                                d="M14 24.005H29V33.055H14z"
                              ></path>
                              <g>
                                <path
                                  fill="#29c27f"
                                  d="M42.256,6H29v9.003h15V7.744C44,6.781,43.219,6,42.256,6z"
                                ></path>
                                <path
                                  fill="#27663f"
                                  d="M29,33.054V42h13.257C43.219,42,44,41.219,44,40.257v-7.202H29z"
                                ></path>
                                <path
                                  fill="#19ac65"
                                  d="M29 15.003H44V24.005000000000003H29z"
                                ></path>
                                <path
                                  fill="#129652"
                                  d="M29 24.005H44V33.055H29z"
                                ></path>
                              </g>
                              <path
                                fill="#0c7238"
                                d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"
                              ></path>
                              <path
                                fill="#fff"
                                d="M9.807 19L12.193 19 14.129 22.754 16.175 19 18.404 19 15.333 24 18.474 29 16.123 29 14.013 25.07 11.912 29 9.526 29 12.719 23.982z"
                              ></path>
                            </svg>
                          </>
                        )}
                      </div>
                    </td>
                    <td data-title="S.No">{index + 1}&nbsp;</td>
                    <td data-title="Code">{ele.ClientCode}&nbsp;</td>
                    <td data-title="Client Name">{ele.ClientName}&nbsp;</td>
                    <td data-title="Share Amt." className="amount">
                      {ele.ShareAmt}&nbsp;
                    </td>
                    <td data-title="Net Amount." className="amount">
                      {ele.Amount}&nbsp;
                    </td>
                    <td data-title="Action">
                      <input
                        type="checkbox"
                        name="IsChecked"
                        onChange={(e) => {
                          handleCheck(e, index);
                        }}
                        checked={ele?.IsChecked}
                      ></input>
                    </td>
                  </tr>
                ))}
              </tbody>

              {CheckedBox() && (
                <div className="row mt-2 mb-1 px-1">
                  {load?.name === "SaveLoading" && load?.loading ? (
                    <Loading />
                  ) : (
                    <div className="col-sm-4">
                      <button
                        type="button"
                        className="btn btn-sm btn-success btn-block"
                        onClick={saveInvoice}
                      >
                        {t("Save")}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </Tables>
          </>
        ) : (
          <div className="card">
            <NoRecordFound />
          </div>
        )}
      </Accordion>
      {show?.modal && (
        <InvoiceCreationModal
          show={show?.modal}
          data={show?.id}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};

export default InvoiceCreation;
