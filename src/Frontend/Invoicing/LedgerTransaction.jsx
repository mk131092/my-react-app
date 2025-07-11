import React, { useEffect, useState } from "react";
import DatePicker from "../../components/formComponent/DatePicker";
import { SelectBox } from "../../components/formComponent/SelectBox";
import moment from "moment";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import Loading from "../../components/loader/Loading";
import Accordion from "@app/components/UI/Accordion";
import Tables from "../../components/UI/customTable";
import { useTranslation } from "react-i18next";
import ReactSelect from "../../components/formComponent/ReactSelect";
const LedgerTransaction = () => {
  const [data, setData] = useState({
    rateTypeOption: [],
    rateTypeId: "",
    fromDate: new Date(),
    toDate: new Date(),
    searchResult: "",
    isPrint: false,
    RateTypeID: "",
    OpeningAmount: "",
    BillAmount: "",
    ClosingAmount: "",
    AmountDeposit: "",
    panelname: "",
    creditlimit: "",
  });
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
const {t} = useTranslation();
  const getAccessRateType = () => {
    axiosInstance
      .post("Accounts/GetRateTypeByGlobalCentre", {
        TypeId: "",
      })
      .then((res) => {
        let data = res.data.message;
        let responce = data.map((ele) => {
          return {
            value: ele.RateTypeID,
            label: ele.RateTypeName,
          };
        });
        setData((data) => ({ ...data, rateTypeOption: responce }));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAccessRateType();
  }, []);

  const dateSelect = (date, name, value) => {
    if (name === "fromDate") {
      const updateDate = new Date(data?.toDate) - date < 0 ? date : data.toDate;
      setData({ ...data, [name]: date, toDate: updateDate });
    } else {
      setData({ ...data, [name]: date });
    }
  };
  const handleSearch = () => {
    if (data?.RateTypeID) {
      setLoading(true);

      axiosInstance
        .post("Accounts/BindPUPData", {
          RateTypeId: data?.RateTypeID,
          FromDate: moment(data?.fromDate).format("DD-MMM-YYYY"),
          ToDate: moment(data?.toDate).format("DD-MMM-YYYY"),
        })
        .then((res) => {
          const responseData = res.data.message;

          setData({
            ...data,
            creditlimit: responseData?.creditlimit ?? 0,
            OpeningAmount: responseData.openingAmount,
            BillAmount: responseData.billAmount,
            ClosingAmount: responseData.closingAmount,
            AmountDeposit: responseData.amountDeposit,
            panelname: responseData?.panelname,
          });

          setTableData(responseData.data || []);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      setData({
        ...data,
        creditlimit: "",
        OpeningAmount: "",
        BillAmount: "",
        ClosingAmount: "",
        AmountDeposit: "",
        panelname: "",
      });
      setTableData([]);
      toast.error("Please Select any Rate type");
    }
  };

  const handleSearchSelectChange =(label,value) =>{
    if(label==="RateTypeID"){
      setData({...data, [label]: String(value?.value)})
      
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((data) => ({
      ...data,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  return (
    <>
      <Accordion
        name={t("Ledger Transaction")}
        isBreadcrumb={true}
        defaultValue={true}
      >
        <div className="row px-2 mt-2 mb-1">
          <div className="col-sm-2 ">
            <DatePicker
              className="custom-calendar"
              placeholder=" "
              id="fromDate"
              lable="FromDate"
              name="fromDate"
              value={new Date(data?.fromDate)}
              onChange={dateSelect}
            />
          </div>

          <div className="col-sm-2">
            <DatePicker
              name="toDate"
              value={new Date(data?.toDate)}
              className="custom-calendar"
              placeholder=" "
              id="ToDate"
              lable="ToDate"
              onChange={dateSelect}
              minDate={new Date(data?.fromDate)}
            />
          </div>

          <div className="col-sm-2 ">
            <ReactSelect
              dynamicOptions={data?.rateTypeOption ?? []}
              name="RateTypeID"
              lable={t("RateType")}
              id="RateType"
              removeIsClearable={true}
              placeholderName={t("RateType")}
              value={data?.RateTypeID}
              onChange={handleSearchSelectChange}
              className="required-fields"
            />
          </div>
          <div className="col-sm-1">
            <button
              className="btn btn-block btn-sm btn-info"
              onClick={handleSearch}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </Accordion>

      <>
        <div className="card">
          <div>
            <>
              <span
                className="p-dialog-header"
                style={{
                  //   background: "#605ca8",
                  color: "white",
                  padding: "3px",
                  borderRadius: "3px",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                {`${t("Total Debit")} = ${tableData?.reduce(
                  (acc, current) => acc + current.debit,
                  0
                )} ${t("Total Credit")} = ${tableData?.reduce(
                  (acc, current) => acc + current.credit,
                  0
                )}`}
              </span>
            </>
          </div>
          <>
            <div
              className="card mt-2 p-2"
              style={{ border: "1px solid #d1d0e5" }}
            >
              <div className="col-sm-12"></div>
              <div
                className="row "
                style={{ borderBottom: "1px solid #d1d0e5" }}
              >
                <label className="col-sm-10" htmlFor="inputEmail3">
                  {t("Client")}
                </label>
                <span className="col-sm-2" htmlFor="inputEmail3">
                  {tableData[0]?.panelname}
                </span>
              </div>
              <div
                className="row"
                style={{ borderBottom: "1px solid #d1d0e5" }}
              >
                <label className="col-sm-10" htmlFor="inputEmail3">
                  {t("CLOSING BALANCE")}
                </label>
                <span className="col-sm-2" htmlFor="inputEmail3">
                  {data?.ClosingAmount ? data?.ClosingAmount * -1 : 0}
                </span>
              </div>
              {console.log(data)}
              <div
                className="row"
                style={{ borderBottom: "1px solid #d1d0e5" }}
              >
                <label className="col-sm-10" htmlFor="inputEmail3">
                  {t("SECURITY AMOUNT")}
                </label>
                <span className="col-sm-2" htmlFor="inputEmail3">
                  {data?.AmountDeposit ? parseInt(data?.AmountDeposit) : 0}
                </span>
              </div>
              <div
                className="row"
                style={{ borderBottom: "1px solid #d1d0e5" }}
              >
                <label className="col-sm-10" htmlFor="inputEmail3">
                 {t("TESTING CHARGES AFTER LAST CREDIT BILL")}
                </label>
                <span className="col-sm-2" htmlFor="inputEmail3">
                  {data?.BillAmount ? parseInt(data?.BillAmount) * -1 : 0}
                </span>
              </div>
              <div className="row">
                <label className="col-sm-10" htmlFor="inputEmail3">
                 {t("NET PAYABLE")}
                </label>
                <span className="col-sm-2" htmlFor="inputEmail3">
                  {data?.ClosingAmount == "" && data?.BillAmount == ""
                    ? 0
                    : parseInt(data?.ClosingAmount)*-1 +
                      parseInt(data?.creditlimit) +
                      parseInt(data?.BillAmount) * -1}
                </span>
              </div>
            </div>

            {loading ? (
              <Loading />
            ) : (
              <>
                <Tables>
                  <thead className="text-center cf" style={{ zIndex: 99 }}>
                    <tr>
                      <th>{t("S.No")}</th>
                      <th>{t("Bill Date")}</th>
                      <th>{t("InvoiceNo./ReceiptNo.")}</th>
                      <th>{t("TransectionID")}</th>
                      <th style={{ width: "200px", wordWrap: "break-word" }}>
                        {t("Particulars")} <br /> {t("Opening Balance")}
                      </th>
                      <th>
                        {t("Debit Amount")} <br />
                      </th>
                      <th>
                        {t("Credit Amount")} <br />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((ele, index) => (
                      <tr key={index}>
                        <td data-title="S.No">{index + 1}</td>
                        <td data-title="Bill Date">{ele?.BillDate}</td>
                        <td data-title="InvoiceNo./ReceiptNo.">
                          {ele?.invoiceno}
                        </td>
                        <td
                          data-title="TransectionID"
                          style={{ width: "200px", wordWrap: "break-word" }}
                        >
                          {ele?.TransactionID}
                        </td>
                        <td data-title="Particulars">{ele?.period}</td>
                        <td data-title=" Debit Amount" className="amount">
                          {ele?.debit}
                        </td>
                        <td data-title=" Credit Amount " className="amount">
                          {ele?.credit}
                        </td>
                      </tr>
                    ))}

                    <tr style={{ color: "red" }}>
                      <td colSpan={4}></td>
                      <td>Total</td>
                      <td>
                        {tableData?.reduce(
                          (acc, current) => acc + current.debit,
                          0
                        )}
                      </td>
                      <td>
                        {tableData?.reduce(
                          (acc, current) => acc + current.credit,
                          0
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Tables>
              </>
            )}

            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                {t("ClosingAmount")} : &nbsp;
              </span>
              <span
                style={{ fontSize: "15px", fontWeight: "bold", color: "red" }}
              >
                {data?.ClosingAmount * -1}
              </span>
            </div>
          </>
        </div>
      </>
    </>
  );
};

export default LedgerTransaction;
