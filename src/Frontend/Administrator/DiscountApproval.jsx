import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Accordion from "@app/components/UI/Accordion";
import Input from "../../components/formComponent/Input";
import Tables from "../../components/UI/customTable";
import Loading from "../../components/loader/Loading";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
import { axiosInstance } from "../../utils/axiosInstance";
import DatePicker from "../../components/formComponent/DatePicker";
import { isChecked } from "../util/Commonservices";
import { SelectBox } from "../../components/formComponent/SelectBox";
import { dateConfig } from "../../utils/helpers";
const DiscountApproval = () => {
  const [payload, setPayload] = useState({
    PatientName: "",
    LedgertransactionNo: "",
    FromDate: new Date(),
    FromTime: "00:00",
    ToDate: new Date(),
    ToTime: "23:59",
    CentreID: "",
    DiscountApprovedByID: "",
  });
  const [Center, setCenter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [DiscApprove, setDiscApprove] = useState([]);
  const [tableData, setTableData] = useState([]);

  const { t } = useTranslation();
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
        CentreDataValue.unshift({ label: "Booking Centre", value: "" });
        setCenter(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };

  const getDiscountApproval = () => {
    axiosInstance
      .get("DiscountApprovalByEmployee/BindDiscApprovedBy")
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => {
          return {
            label: ele?.EmployeeName,
            value: ele?.EmployeeID,
          };
        });
        val.unshift({ label: "Discount Approved By", value: "" });
        setDiscApprove(val);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
      });
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  useEffect(() => {
    getAccessCentres();
    getDiscountApproval();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const getTableData = () => {
    setLoading(true);
    axiosInstance
      .post("DiscountApprovalByEmployee/getDiscountApprovalData", {
        ...payload,
        FromDate: moment(payload?.FromDate).format("DD-MMM-YYYY"),
        ToDate: moment(payload?.ToDate).format("DD-MMM-YYYY"),
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            ...ele,
            isChecked: false,
          };
        });
        setTableData(val);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
        setLoading(false);
      });
  };

  const handleChangeNew = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const data = [...tableData];
      data[index][name] = checked;
      setTableData(data);
    } else {
      const data = tableData.map((ele) => {
        return {
          ...ele,
          isChecked: checked,
        };
      });
      setTableData(data);
    }
  };
  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;

    setPayload({ ...payload, [secondName]: TimeStamp });
  };
  const postApi = () => {
    const data = tableData.filter((ele) => ele?.isChecked);
    if (data.length > 0) {
      setLoading(true);
      axiosInstance
        .post("DiscountApprovalByEmployee/UpdateDiscApprovedBy", data)
        .then((res) => {
          toast.success(res?.data?.message);
          setPayload({
            PatientName: "",
            LedgertransactionNo: "",
            FromDate: new Date(),
            FromTime: "00:00",
            ToDate: new Date(),
            ToTime: "23:59",
            CentreID: "",
            DiscountApprovedByID: "",
          });
          setLoading(false);
          setTableData([]);
        })
        .catch((err) => {
          toast.error(
            err?.data?.message ? err?.data?.message : "Something Went Wrong"
          );
          setLoading(false);
        });
    } else {
      toast.error("please Choose One Test");
    }
  };

  const dateSelect = (value, name) => {
    setPayload({
      ...payload,
      [name]: value,
    });
  };
  return (
    <>
      <Accordion
        name="Discount Approval"
        isBreadcrumb={true}
        defaultValue={true}
      >
        <div className="row px-2 mt-2">
          <div className="col-sm-2">
            <div>
              <DatePicker
                name="FromDate"
                value={payload?.FromDate}
                onChange={dateSelect}
                className="custom-calendar"
                placeholder=" "
                id="FromDate"
                lable="FromDate"
                maxDate={new Date()}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div>
              <DatePicker
                name="ToDate"
                value={payload?.ToDate}
                onChange={dateSelect}
                className="custom-calendar"
                placeholder=" "
                id="ToDate"
                lable="ToDate"
                maxDate={new Date()}
                minDate={new Date(payload.FromDate)}
              />
            </div>
          </div>

          <div className="col-sm-2">
            <Input
              placeholder=" "
              lable="Visit Number"
              id="Visit Number"
              type="text"
              name="LedgertransactionNo"
              value={payload.LedgertransactionNo}
              onChange={handleChange}
            />
          </div>

          <div className="col-sm-2">
            <Input
              placeholder=" "
              lable="Patient Number"
              id="Patient Number"
              type="text"
              name="PatientName"
              value={payload.PatientName}
              onChange={handleChange}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={Center}
              name="CentreID"
              lable="Centre"
              id="Centre"
              selectedValue={payload?.CentreID}
              onChange={handleSelectChange}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              lable="DiscAppByID"
              id="DiscAppByID"
              options={DiscApprove}
              name={"DiscountApprovedByID"}
              selectedValue={payload?.DiscountApprovedByID}
              onChange={handleSelectChange}
            />
          </div>
        </div>
        <div className="row px-2  mb-1">
          <div className="col-sm-1">
            <button
              className="btn btn-block btn-info btn-sm"
              onClick={getTableData}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </Accordion>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Accordion title={t("Search Detail")} defaultValue={true}>
            {tableData?.length > 0 ? (
              <>
                <Tables>
                  <thead className="cf">
                    <tr>
                      {[
                        t("S.No"),
                        t("Booking Centre"),
                        t("Visit No"),
                        t("BarcodeNo"),
                        t("Date"),
                        t("Patient Name"),
                        t("Gender"),
                        t("Gross Amt."),
                        t("Discount Amt."),
                        t("Net Amt."),
                        t("Dis Reason"),
                        t("Remarks"),
                        t("CreatedBy"),
                        <input
                          type="checkbox"
                          checked={
                            tableData.length > 0
                              ? isChecked(
                                  "isChecked",
                                  tableData,
                                  true
                                ).includes(false)
                                ? false
                                : true
                              : false
                          }
                          onChange={handleChangeNew}
                        />,
                      ].map((ele, index) => (
                        <th key={index}>{ele}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.map((ele, index) => (
                      <tr key={index}>
                        {[
                          index + 1,
                          ele?.Centre,
                          ele?.LedgerTransactionNo,
                          "-",
                          dateConfig(ele?.BillingDATE),
                          ele?.PatientName,
                          ele?.Gender,
                          ele?.GrossAmount,
                          ele?.DiscountOnTotal,
                          ele?.NetAmount,
                          "-",
                          "-",
                          ele?.DiscountApprovedByName,
                          <input
                            type="checkbox"
                            checked={ele?.isChecked}
                            name="isChecked"
                            onChange={(e) => handleChangeNew(e, index)}
                          />,
                        ].map((item, i) => (
                          <td key={i} data-title={t("Item")}>
                            {item}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Tables>

                {loading ? (
                  <Loading />
                ) : (
                  <div className="row mt-2 mb-1 px-2">
                    <div className="col-sm-2">
                      <button
                        className="btn btn-block btn-success btn-sm"
                        onClick={postApi}
                      >
                        {t("Discount Approve")}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <NoRecordFound />
              </>
            )}
          </Accordion>
        </>
      )}
    </>
  );
};

export default DiscountApproval;
