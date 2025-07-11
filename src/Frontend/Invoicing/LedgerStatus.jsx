import React, { useEffect, useState } from "react";
import { SelectBoxWithCheckbox } from "../../components/formComponent/MultiSelectBox";
import LockReportModal from "./LockReportModal";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ExportToExcel } from "../../utils/helpers";
import Accordion from "@app/components/UI/Accordion";
import { GetRateTypeByGlobalCentre } from "../../utils/NetworkApi/commonApi";
import Loading from "../../components/loader/Loading";
import { axiosInstance, axiosReport } from "../../utils/axiosInstance";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
import Tables from "../../components/UI/customTable";

import { useTranslation } from "react-i18next";
const LedgerStatus = () => {
  const [lockreportshow, setLockReportShow] = useState(false);
  const [selectedData, setSelectedData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [panelName, setPanelName] = useState([]);
  const [payload, setPayload] = useState({
    PanelName: [],
  });

  const handleSelectMultiChange = (select, name, value) => {
    if (name === "PanelName") {
      const val = select.map((ele) => {
        return ele?.value?.toString();
      });
      setPayload({ ...payload, [name]: val });
    }
  };
  const { t } = useTranslation();

  const handleSearch = () => {
    setLoading(true);
    setTableData([]);
    if (payload?.PanelName == "" || payload?.PanelName?.length == 0) {
      toast.error("Please Select Rate Type.");
      setLoading(false);
    } else {
      axiosInstance
        .post("Accounts/LedgerStatusReport", {
          RateTypeId: payload?.PanelName,
          CentreId: [],
        })
        .then((res) => {
          if (res?.data?.success) setTableData(res?.data?.message);
          else setTableData([]);
          setLoading(false);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong."
          );
          setLoading(false);
        });
    }
  };

  const handlePdf = (id) => {
    axiosReport
      .post("commonReports/BindPUPData", { RateTypeId: id })
      .then((res) => {
        window.open(res?.data?.url, "_blank");
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong."
        );
      });
  };

  useEffect(() => {
    GetRateTypeByGlobalCentre(setPanelName);
  }, []);
  return (
    <div>
      {lockreportshow && (
        <LockReportModal
          selectedData={selectedData}
          lockreportshow={lockreportshow}
          setLockReportShow={setLockReportShow}
          handleSearch={handleSearch}
        />
      )}
      <Accordion
        name={t("Ledger Status")}
        isBreadcrumb={true}
        defaultValue={true}
      >
        <div className="row px-2 mt-2 mb-1">
          <div className="col-sm-2 ">
            <SelectBoxWithCheckbox
              className="required-fields"
              options={panelName}
              name="PanelName"
              placeholder=" "
              lable="Rate Type"
              id="Rate Type"
              value={payload?.PanelName}
              onChange={handleSelectMultiChange}
            />
          </div>
          <div className="col-sm-1 col-12">
            <button
              className="btn btn-info btn-block btn-sm"
              onClick={handleSearch}
            >
              {t("Search")}
            </button>
          </div>
          <div className="col-sm-1 col-12">
            <button
              className="btn btn-success btn-block btn-sm"
              onClick={() => ExportToExcel(tableData)}
              disabled={tableData?.length == 0}
            >
              {t("Report")}
            </button>
          </div>
        </div>
      </Accordion>
      {loading ? (
        <Loading />
      ) : (
        <Accordion title={t("Search Detail")} defaultValue={true}>
          {tableData?.length > 0 ? (
            <>
              <div className="m-2">
                <Tables>
                  {" "}
                  <thead className="cf">
                    <tr>
                      <th>{t("Code")}</th>

                      {/* <th>Sales Manager</th> */}

                      <th>{t("Client Name")}</th>
                      <th>{t("Curr. Month Opening")}</th>
                      <th>{t("Curr. Received Amt")}</th>
                      <th>{t("Rec.AmtOpening")}</th>
                      {/* <th>Rec.AmtCurrent</th> */}
                      <th>{t("BookingOpening")}</th>
                      <th>{t("BookingCurrent")}</th>
                      <th>{t("TotalOutstanding")}</th>
                      <th>{t("Credit Limit")}</th>
                      <th>{t("Status")}</th>
                      <th>{t("LockReport")}</th>
                      <th>{t("LockRegistration")}</th>
                      {/* <th>Lock/Unlock Reason</th> */}
                      {/* <th>Security Amount</th> */}
                      <th>{t("PaymentMode")}</th>
                      {/* <th>Intimation</th>
                    <th>Intimation Limit</th>
                    <th>Booking Lock</th>
                    <th>Booking Limit</th>
                    <th>Reporting Lock</th>
                    <th>Reporting Limit</th> */}
                      <th>{t("Last Paid Amt.")}</th>
                      <th>{t("Last Paid Date")}</th>
                      <th>{t("Mobile")}</th>
                      <th>{t("DtEntry")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.map((ele, index) => (
                      <tr
                        key={index}
                        style={{
                          cursor: "pointer",
                          background:
                            ele.IsLockStatus == 1 ? "#89CFF0" : "#90EE90",
                        }}
                      >
                        <td data-title="PUP">
                          <Link
                            //   className="btn btn-primary btn-sm"
                            onClick={() => handlePdf(ele?.CentreID)}
                          >
                            PUP
                          </Link>
                        </td>
                        <td data-title="PanelName">{ele?.centre}&nbsp;</td>
                        {/* <td data-title="SalesManager">{ele?.SalesManager}&nbsp;</td> */}
                        <td data-title="Curr. Month Opening" className="amount">
                          {ele?.CurrentMonthOpening}&nbsp;
                        </td>
                        <td
                          data-title="CurrentReceivedAmount"
                          className="amount"
                        >
                          {ele?.CurrentReceivedAmount}&nbsp;
                        </td>
                        <td data-title="ReceivedAmtOpening" className="amount">
                          {ele?.ReceivedAmtOpening}&nbsp;
                        </td>
                        {/* <td data-title="ReceivedAmtCurrent" className="amount">
                          {ele?.ReceivedAmtCurrent}&nbsp;
                        </td> */}
                        <td data-title="BookingOpening" className="amount">
                          {ele?.BookingOpening}&nbsp;
                        </td>{" "}
                        <td data-title="BookingCurrent" className="amount">
                          {ele?.BookingCurrent}&nbsp;
                        </td>
                        <td data-title="TotalOutstanding" className="amount">
                          {ele?.TotalOutstanding}&nbsp;
                        </td>
                        <td data-title="CreditLimit" className="amount">
                          {ele?.CreditLimit}&nbsp;
                        </td>
                        <td data-title="Open">
                          <span
                            onClick={() => {
                              setLockReportShow(true);
                              setSelectedData(ele);
                            }}
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline",
                              color: "blue",
                            }}
                          >
                            <span>
                              {ele.Upto
                                ? `Manually ${ele?.IsLockStatus == 1 ? "Lock" : "Open"} Till ${ele?.Upto}`
                                : ele?.LockRegistration
                                  ? "System Lock"
                                  : "Open"}
                            </span>
                          </span>
                        </td>
                        <td data-title="LockRegistration">
                          {ele?.LockRegistration == 1 ? "Yes" : "No"}&nbsp;
                        </td>
                        <td data-title="LockReport">
                          {ele?.LockReport == 1 ? "Yes" : "No"}&nbsp;
                        </td>
                        {/* <td data-title="LockUnlockReason">
                          {ele?.LockUnlockReason}&nbsp;
                        </td> */}
                        {/* <td data-title="SecurityAmt" className="amount">
                        {ele?.SecurityAmt}&nbsp;
                      </td> */}
                        <td data-title="PaymentMode">
                          {ele?.PaymentMode}&nbsp;
                        </td>
                        {/* <td data-title="IsShowIntimation">
                        {ele?.IsShowIntimation}&nbsp;
                      </td>
                      <td data-title="IntimationLimit" className="amount">
                        {ele?.IntimationLimit}&nbsp;
                      </td>
                      <td data-title="IsBlockPanelBooking">
                        {ele?.IsBlockPanelBooking}&nbsp;
                      </td>
                      <td data-title="LabReportLimit" className="amount">
                        {ele?.LabReportLimit}&nbsp;
                      </td>
                      <td data-title="IsBlockPanelReporting">
                        {ele?.IsBlockPanelReporting}&nbsp;
                      </td>
                      <td data-title="LabReportLimit" className="amount">
                        {ele?.LabReportLimit}&nbsp;
                      </td> */}
                        <td data-title="LastPaidAmt" className="amount">
                          {ele?.LastPaidAmt}&nbsp;
                        </td>
                        <td data-title="LastPaidDate">
                          {ele?.LastPaidDate}&nbsp;
                        </td>
                        <td data-title="Mobile">{ele?.Mobile}&nbsp;</td>{" "}
                        <td data-title="CreationDate">
                          {ele?.CreatorDate}&nbsp;
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Tables>
              </div>
            </>
          ) : (
            <NoRecordFound />
          )}
        </Accordion>
      )}
    </div>
  );
};

export default LedgerStatus;
