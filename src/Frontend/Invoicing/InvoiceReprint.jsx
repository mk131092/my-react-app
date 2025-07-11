import React, { useEffect, useState } from "react";
import DatePicker from "../../components/formComponent/DatePicker";
import { axiosInstance, axiosReport } from "../../utils/axiosInstance";
import Loading from "../../components/loader/Loading";
import { toast } from "react-toastify";
import { SelectBoxWithCheckbox } from "../../components/formComponent/MultiSelectBox";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Accordion from "@app/components/UI/Accordion";
import Tables from "../../components/UI/customTable";
import Input from "../../components/formComponent/Input";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
const InvoiceReprint = () => {
  const [center, setCentre] = useState([]);
  const [load, setLoad] = useState(false);
  const [loads, setLoads] = useState({
    name: "",
    loading: -1,
  });

  const [invoiceReprintData, setinvoiceReprintData] = useState([]);
  const [payload, setPayload] = useState({
    InvoiceNo: "",
    DateTypeSearch: "1",
    InvoiceFromDate: new Date(),
    InvoiceFromTime: "00:00",
    InvoiceToDate: new Date(),
    InvoiceToTime: "23:59",
    centreID: [],
  });
  const [fileLoad, setFileLoad] = useState({
    Excel: false,
    PDF: false,
    loading: -1,
  });

  const { t } = useTranslation();

  const handleSelectchange = (select, name) => {
    const data = select.map((ele) => ele.value);
    setPayload({ ...payload, [name]: data });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const dateSelect = (value, name) => {
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const getAccessCentres = () => {
    axiosInstance
      .post("Accounts/GetRateTypeByGlobalCentre", {
        TypeId: "",
      })
      .then((res) => {
        let data = res.data.message;
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.RateTypeID,
            label: ele.RateTypeName,
          };
        });

        setCentre(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAccessCentres();
  }, []);

  const handleSearch = () => {
    setLoad(true);
    const centerId = payload?.centreID?.length ? payload.centreID : center?.map((ele) => ele?.value);
    axiosInstance
      .post("Accounts/InvoiceReprint1", {
        ...payload,
        centreID:centerId,
        InvoiceFromDate: moment(payload?.InvoiceFromDate).format("DD-MMM-YYYY"),
        InvoiceToDate: moment(payload?.InvoiceToDate).format("DD-MMM-YYYY"),
      })
      .then((res) => {
        setLoad(false);
        setinvoiceReprintData(res?.data?.message);
      })
      .catch((err) => {
        setLoad(false);
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
      });
  };

  const exportExcelDataApi = (id, callFor, index, name) => {
    setFileLoad({
      ...fileLoad,
      [name]: true,
      loading: index,
    });

    axiosReport
      .post(
        "commonReports/ExportInvoiceReprintData",
        {
          InvoiceNo: id,
          DocumentType: callFor?.toString(),
        },
        callFor == 1 && { method: "GET", responseType: "blob" }
      )
      .then((res) => {
        console.log(res)
        setFileLoad({
          ...fileLoad,
          [name]: false,
          index: -1,
        });
        if (callFor == 1) {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `Invoice.xlsx`);
          document.body.appendChild(link);
          link.click();
        }
        if (callFor == 2) {
          window.open(res?.data?.url, "_blank");
        }
      })
      .catch((err) => {
        setFileLoad({
          ...fileLoad,
          [name]: false,
          index: -1,
        });
        setLoads({ loading: -1, name: "" });
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
      });
  };

  const handleGetReport = (id, index, name) => {
    setLoads({ loading: index, name: name });
    axiosReport
      .post("commonReports/InvoiceReceiptData", {
        DocumentType: "2",
        InvoiceNo: id,
      })
      .then((res) => {
        setLoads({ loading: -1, name: "" });
        window.open(res?.data?.url, "_blank");
      })
      .catch((err) => {
        setLoads({ loading: -1, name: "" });
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
      });
  };

  return (
    <>
      <Accordion name={t("Invoice Reprint")} isBreadcrumb={true} defaultValue={true}>
        <div className="row px-2 mt-2 mb-1">
          <div className="col-sm-2 ">
            <DatePicker
              name="InvoiceFromDate"
              value={payload?.InvoiceFromDate}
              className="custom-calendar"
              placeholder=" "
              id="From Date"
              lable="From Date"
              onChange={dateSelect}
              maxDate={new Date()}
            />
          </div>

          <div className="col-sm-2 ">
            <DatePicker
              name="InvoiceToDate"
              value={payload?.InvoiceToDate}
              className="custom-calendar"
              placeholder=" "
              id="To Date"
              lable="To Date"
              onChange={dateSelect}
              maxDate={new Date()}
              minDate={new Date(payload?.InvoiceFromDate)}
            />
          </div>

          <div className="col-sm-2 ">
            <Input
              value={payload?.InvoiceNo}
              onChange={handleChange}
              id="InvoiceNo"
              name="InvoiceNo"
              lable="Invoice Number"
              placeholder=" "
              required
            />
          </div>
          <div className="col-sm-2 ">
            <SelectBoxWithCheckbox
              options={center}
              name="centreID"
              placeholder=" "
              lable="Rate Type"
              id="Rate Type"
              value={payload?.centreID}
              onChange={handleSelectchange}
            />
          </div>
          <div className="col-sm-1">
            {load ? (
              <Loading />
            ) : (
              <button
                className="btn btn-block btn-sm btn-info"
                onClick={handleSearch}
              >
                {t("Search")}
              </button>
            )}
          </div>
        </div>
      </Accordion>
      <Accordion title={t("Search Detail")} defaultValue={true}>
        {invoiceReprintData?.length > 0 ? (
          <>
            <Tables>
              <thead className="text-center cf" style={{ zIndex: 99 }}>
                <tr>
                  <th>{t("S.No")}</th>
                  <th>{t("Invoice No")}</th>
                  <th>{t("Code")}</th>
                  <th>{t("Client Name")}</th>
                  <th>{t("Share Amt.")}</th>
                  <th>{t("Invoice Date")}</th>
                  <th>{t("Business Unit")}</th>
                  <th>{t("Created By")}</th>
                  <th>{t("Export Excel")}</th>
                  <th>{t("PDF")}</th>
                </tr>
              </thead>
              <tbody>
                {invoiceReprintData?.map((ele, index) => (
                  <tr key={index}>
                    <td data-title="S.No">{index + 1}&nbsp;</td>
                    <td data-title="InvoiceNo">{ele.InvoiceNo}&nbsp;</td>
                    <td data-title="CentreCode">{ele.CentreCode}&nbsp;</td>
                    <td data-title="PanelName">{ele.PanelName}&nbsp;</td>
                    <td data-title="InvoiceAmt" className="amount">
                      {ele.ShareAmt}&nbsp;
                    </td>
                    <td data-title="InvoiceDate" className="amount">
                      {ele.InvoiceDate}&nbsp;
                    </td>
                    <td data-title="BusinessUnit" className="amount">
                      {ele.BusinessUnit}&nbsp;
                    </td>
                    <td data-title="CreatedBy" className="amount">
                      {ele.CreatedBy}&nbsp;
                    </td>
                    <td data-title="Excel">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                        }}
                      >
                        {fileLoad?.Excel && fileLoad?.loading === index ? (
                          <Loading />
                        ) : (
                          <i>
                            <span
                              className="pi pi-file-excel"
                              style={{
                                width: "15px",
                                height: "15px",
                                color: "green",
                              }}
                              onClick={() =>
                                exportExcelDataApi(
                                  ele?.InvoiceNo,

                                  1,
                                  index,
                                  "Excel"
                                )
                              }
                            />
                          </i>
                        )}
                        {fileLoad?.PDF && fileLoad?.loading === index ? (
                          <Loading />
                        ) : (
                          <i>
                            <span
                              className="pi pi-file-pdf"
                              style={{
                                width: "15px",
                                height: "15px",
                                color: "red",
                              }}
                              onClick={() =>
                                exportExcelDataApi(
                                  ele?.InvoiceNo,

                                  2,
                                  index,
                                  "PDF"
                                )
                              }
                            />
                          </i>
                        )}
                      </div>
                    </td>
                    <td data-title="Pdf">
                      {loads?.name === "print" && loads?.loading === index ? (
                        <Loading />
                      ) : (
                        <i>
                          <span
                            className="pi pi-file-pdf"
                            style={{
                              width: "15px",
                              height: "15px",
                              color: "red",
                            }}
                            onClick={() =>
                              handleGetReport(ele?.InvoiceNo, index, "print")
                            }
                          />
                        </i>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Tables>
          </>
        ) : (
          <NoRecordFound />
        )}
      </Accordion>
    </>
  );
};

export default InvoiceReprint;
