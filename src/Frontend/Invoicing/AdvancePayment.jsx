import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import moment from "moment";

import { useTranslation } from "react-i18next";
import { axiosInstance, axiosReport } from "../../utils/axiosInstance";
import { dateConfig, ExportToExcel, number } from "../../utils/helpers";
import { AdvancePaymentValidationSchema } from "../../utils/Schema";
import { getPaymentModes } from "../../utils/NetworkApi/commonApi";
import AdvancePaymentCancelModal from "./AdvancePaymentCancelModal";
import AdvancePaymentCreditModal from "./AdvancePaymentCreditModal";
// import RazorPay from "../../Payment/RazorPay";
import DatePicker from "../../components/formComponent/DatePicker";
import { RADIOADVANCEINPUT } from "../../utils/Constants";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Tables from "../../components/UI/customTable";

import Accordion from "@app/components/UI/Accordion";

import Loading from "../../components/loader/Loading";
import Input from "../../components/formComponent/Input";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
import RazorPay from "../Payment/RazorPay";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import ReactSelect from "../../components/formComponent/ReactSelect";

function AdvancePayment() {
  const [CentreData, setCentreData] = useState([]);
  const [PaymentMode, setPaymentMode] = useState([]);
  const [loadingSecond, setLoadingSecond] = useState(false);
  const [OldInvoiceDropDown, setOldInvoiceDropDown] = useState([]);
  const [creditdebit, setCreditDebit] = useState([]);
  const [BankName, setBankName] = useState([]);
  const [CreditModalShow, setCreditModalShow] = useState(false);
  const [AdvancePaymentDetail, setAdvancePaymentDetail] = useState([]);
  const [show, setShow] = useState({
    id: "",
    modalShow: false,
    cancelReason: "",
  });
  const [paymenyId, setPaymentId] = useState({
    receipt: "",
    key_id: "",
    key_secret: "",
  });
  const [err, setErr] = useState("");
  const [TypeRate, setType] = useState([]);
  const [outstanding, setOutstanding] = useState({
    OutstandingAmount: 0,
    ReceivedAmount: 0,
    CreditLimit: 0,
    BillingAmount: 0,
  });
  const [formData, setFormData] = useState({
    paymentModeID: "",
    TransactionId: "",
    InvoiceNo: "",
    InvoiceAmount: "",
    ReceivedAmt: "0",
    PaymentMode: "",
    BankName: "",
    CreditCardNo: "",
    DraftNo: "",
    ChequeNo: "",
    ChequeDate: new Date(),
    ReceiveDate: new Date(),
    RateTypeID: "",
    AdvanceAmtDate: new Date(),
    CreditNote: "1",
    Remarks: "",
    Type: "",
    CreditDebit: "",
  });
  const [isRazorPayOpen, setIsRazorPayOpen] = useState(false);
  const [PendingandOutstandingAmt, setPendingandOutstandingAmt] = useState({
    pending: 0,
    outstanding: 0,
  });
  const IsOnlinePayment = () => {
    axiosInstance
      .get("RazorPay/Otherpayment")
      .then((res) => {
        console.log(res);
        if (res?.data?.message?.payment_capture == 1) {
          setIsRazorPayOpen(true);
          setPaymentId({
            receipt: res?.data?.message?.receipt,
            key_id: res?.data?.message?.key_id,
            key_secret: res?.data?.message?.key_secret,
          });
        } else {
          saveData();
        }
      })
      .catch((err) =>
        toast.error(
          err?.data?.response?.message
            ? err?.data?.response?.message
            : "Error Occur"
        )
      );
  };

  const { t } = useTranslation();
  const close = () => {
    handleCreditDebit();
  };
  console.log(outstanding);
  const CompanyID = useLocalStorage("userData", "get")?.CompanyID;
  const getOutstandingAmount = (id) => {
    axiosInstance
      .post("Accounts/CheckAgainstInvoiceAmt", {
        RateTypeID: id?.toString(),
        CompanyID: CompanyID,
      })
      .then((res) => {
        if (res?.data?.success) {
          const data = res?.data?.message?.split("#");
          console.log(data);
          setOutstanding({
            OutstandingAmount: Number(data[2]) + Number(data[1]) - data[0],
            ReceivedAmount: data[1],
            CreditLimit: data[2],
            BillingAmount: data[0],
          });
        } else
          setOutstanding({
            OutstandingAmount: 0,
            ReceivedAmount: 0,
            CreditLimit: 0,
            BillingAmount: 0,
          });
      })
      .catch((err) => {
        setOutstanding({
          OutstandingAmount: 0,
          ReceivedAmount: 0,
          CreditLimit: 0,
          BillingAmount: 0,
        });
        console.log(err);
      });
  };

  const handleSearchSelectChange = (label, value) => {
    console.log({ label, value });
    if (label === "RateTypeID") {
      setFormData({ ...formData, [label]: value?.value?.toString() });
      handleOldReceipt(value?.value);
      getOutstandingAmount(value?.value);
    }
  };
  const handleSelectChange = (event) => {
    const { name, value, selectedIndex } = event.target;
    const label = event.target.children[selectedIndex].text;
    if (name == "Type") {
      setFormData({
        ...formData,
        [name]: value,
      });
      setCentreData([]);
      getRateType(value);
    }
    if (name === "InvoiceNo") {
      setFormData({ ...formData, [name]: value });
      handlePendingAmount(value, formData?.RateTypeID);
    }

    if (name === "paymentModeID") {
      setFormData({
        ...formData,
        [name]: value,
        PaymentMode: label,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePendingAmount = (id, id2) => {
    if (id) {
      axiosInstance
        .post("Accounts/PendingandOutstandingAmt", {
          InvoiceNo: id,
          RateTypeID: id2,
        })
        .then((res) => {
          const data = res?.data?.message;
          setPendingandOutstandingAmt({
            pending: data?.pendingAmt ?? 0,
            outstanding: data?.outstanding ?? 0,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleCreditDebit = () => {
    axiosInstance
      .get("Accounts/GetCreditDebitNote")
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => {
          return {
            value: ele?.Id,
            label: ele?.CreditDebit,
          };
        });
        setCreditDebit(val);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOldReceipt = (id) => {
    axiosInstance
      .post("Accounts/SelectOldInvoiceNo", { RateTypeID: id })
      .then((res) => {
        const data = res?.data?.message?.map((ele) => {
          return {
            value: ele?.InvoiceNo,
            label: ele?.InvoiceNo,
            shareamt: ele?.shareamt,
          };
        });
        setOldInvoiceDropDown([
          { label: "select", value: "", shareamt: 0 },
          ...data,
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRadioSelect = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = (condition1, condition, InvoiceAmt) => {
    let disable = false;
    let message = "";
    if (condition === "") {
      disable = true;
      message = "Please Choose Payment Mode";
    } else if (["Paytm", "Online Payment"].includes(condition)) {
    } else if (["Debit Card", "Credit Card"].includes(condition)) {
      if (formData["BankName"] === "") {
        disable = true;
        message = "Please Choose BankName";
      } else if (formData["CreditCardNo"].length < 15) {
        disable = true;
        message = `Please Enter Valid ${condition} Number`;
      }
    } else if (["Cheque"].includes(condition)) {
      if (formData["BankName"] === "") {
        disable = true;
        message = "Please Choose BankName";
      } else if (formData["ChequeNo"].length < 15) {
        disable = true;
        message = `Please Enter Valid ${condition} Number`;
      }
    }

    if (condition) {
      if (InvoiceAmt === "" || InvoiceAmt == 0) {
        disable = true;
        message = "Please Enter InvoiceAmt";
      }
      if (condition1 === "") {
        disable = true;
        message = "Please Enter Remarks";
      }

      if (condition != "Cash" && condition != "Online Payment") {
        if (formData["TransactionId"].length < 10) {
          disable = true;
          message = "Please Fill Correct Transaction Number";
        }
      }
    }
    return {
      disable: disable,
      message: message,
    };
  };

  const getType = () => {
    axiosInstance
      .get("centre/getCentreType")
      .then((res) => {
        const data = res?.data?.message;

        const Type = data?.map((ele) => {
          return {
            value: ele?.id,
            label: ele?.Centretype,
          };
        });
        setType(Type);
        // getRateType("");
      })
      .catch((err) => {
        toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong");
      });
  };

  // const getAccessCentres = () => {
  //   axiosInstance
  //     .get("Accounts/GetRateTypeByGlobalCentre")
  //     .then((res) => {
  //       let data = res.data.message;
  //       let CentreDataValue = data.map((ele) => {
  //         return {
  //           value: ele.RateTypeID,
  //           label: ele.RateTypeName,
  //         };
  //       });
  //       setCentreData(CentreDataValue);
  //     })
  //     .catch((err) => console.log(err));
  // };

  const AdvancePaymentDetail1 = (name, type, save) => {
    axiosInstance
      .post("Accounts/AdvancePaymentDetail", {
        ClientID: formData?.RateTypeID,
        CreditNote: formData?.CreditNote,
        isCancel: type,
      })
      .then((res) => {
        if (save == "Save") {
          setFormData({
            ...formData,
            paymentModeID: "",
            TransactionId: "",
            InvoiceNo: "",
            InvoiceAmount: "",
            ReceivedAmt: "0",
            PaymentMode: "",
            BankName: "",
            CreditCardNo: "",
            DraftNo: "",
            ChequeNo: "",
            ChequeDate: new Date(),
            ReceiveDate: new Date(),
            AdvanceAmtDate: new Date(),
            Remarks: "",
            CreditDebit: "",
          });
        }
        if (name === "display") {
          setAdvancePaymentDetail(res?.data?.data);
        } else {
          ExportToExcel(res?.data?.data);
        }
      })
      .catch();
  };

  const dateSelect = (value, name) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getlabel = () => {
    const ele = creditdebit?.filter((item) => {
      return item?.value == formData?.CreditDebit;
    });

    if (ele.length > 0) {
      return ele[0].label;
    }
  };

  const handleSave = () => {
    const { disable, message } = validate(
      formData["Remarks"],
      formData["PaymentMode"],
      formData.InvoiceAmount
    );

    const generatedError = AdvancePaymentValidationSchema(formData);
    if (generatedError === "") {
      if (!disable) {
        if (formData?.PaymentMode == "Online Payment") {
          IsOnlinePayment();
        } else {
          saveData();
        }
      } else {
        toast.error(message);
      }
    } else {
      setErr(generatedError);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    getType();
    getPaymentModes("PaymentMode", setPaymentMode);
    getPaymentModes("BankName", setBankName);
  }, []);

  useEffect(() => {
    if (formData?.RateTypeID) {
      AdvancePaymentDetail1("display", "0");
    } else {
      setAdvancePaymentDetail([]);
    }
  }, [formData?.RateTypeID, formData?.CreditNote, formData?.Type]);

  const handlePDF = (e, data) => {
    axiosReport
      .post("commonReports/GetSingleReceiptData", {
        ReceiptNo: data,
      })
      .then((res) => {
        window.open(res?.data?.url, "_blank");
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
      });
  };
  console.log(OldInvoiceDropDown);
  const handleFindAll = (id) => {
    const data = OldInvoiceDropDown.find((ele) => ele?.value === id);
    return data?.shareamt;
  };

  const handleCancel = () => {
    if (show?.cancelReason) {
      axiosInstance
        .post("Accounts/AdvanceAmountCancel", {
          AdvanceAmountId: show?.id,
          CancelReason: show?.cancelReason,
        })
        .then((res) => {
          AdvancePaymentDetail1("display", "0");
          handleHide();
          toast.success(res?.data?.message);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          );
        });
    } else {
      toast.error("Please Enter Remark");
    }
  };

  const handleChangeNew = (e) => {
    const { name, value } = e.target;
    setShow({ ...show, [name]: value });
  };

  const handleHide = () => {
    setShow({
      id: "",
      modalShow: false,
      cancelReason: "",
    });
  };

  useEffect(() => {
    handleCreditDebit();
  }, []);

  const saveData = (data) => {
    if (data) {
      setIsRazorPayOpen(false);
      setLoadingSecond(false);
      setPendingandOutstandingAmt({
        pending: 0,
        outstanding: 0,
      });
      setPaymentId({
        receipt: "",
        key_id: "",
        key_secret: "",
      });
      setErr("");
      setFormData({
        paymentModeID: "",
        TransactionId: "",
        InvoiceNo: "",
        InvoiceAmount: "",
        ReceivedAmt: "0",
        PaymentMode: "",
        BankName: "",
        CreditCardNo: "",
        DraftNo: "",
        ChequeNo: "",
        ChequeDate: new Date(),
        ReceiveDate: new Date(),
        RateTypeID: "",
        AdvanceAmtDate: new Date(),
        CreditNote: "1",
        Remarks: "",
        Type: "",
        CreditDebit: "",
      });

      AdvancePaymentDetail1("display");
    } else {
      setLoadingSecond(true);
      axiosInstance
        .post("Accounts/InsertAdvancePayment", {
          ...formData,
          CreditDebitNoteType: getlabel(),
          ReceiveDate: moment(formData?.ReceiveDate).format("DD-MMM-YYYY"),
          ChequeDate: moment(formData?.ChequeDate).format("DD-MMM-YYYY"),
          AdvanceAmtDate: moment(formData?.AdvanceAmtDate).format(
            "DD-MMM-YYYY"
          ),
        })
        .then((res) => {
          if (res?.data?.success) {
            setIsRazorPayOpen(false);
            toast.success(res?.data?.message);
            getOutstandingAmount(formData?.RateTypeID);
            handleOldReceipt(formData?.RateTypeID);
            setPendingandOutstandingAmt({
              pending: 0,
              outstanding: 0,
            });
            setPaymentId({
              receipt: "",
              key_id: "",
              key_secret: "",
            });
            setErr("");
            AdvancePaymentDetail1("display", "", "Save");
          } else {
            toast.error(res?.data?.message);
          }
          setLoadingSecond(false);
        })
        .catch((err) => {
          setIsRazorPayOpen(false);
          toast.error(
            err?.data?.message ? err?.data?.message : "Something Went Wrong"
          );
          setLoadingSecond(false);
        });
    }
  };

  const getTotalInvoiceAmount = () => {
    const returnAmount = OldInvoiceDropDown?.reduce(
      (acc, current) => acc + current.shareamt ?? 0,
      0
    );
    console.log(OldInvoiceDropDown);
    return OldInvoiceDropDown?.length > 1 ? returnAmount : 0;
  };

  const getRateType = (value) => {
    axiosInstance
      .post("Accounts/GetRateTypeByGlobalCentre", {
        TypeId: value?.toString(),
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
  console.log(formData);
  return (
    <>
      {show?.modalShow && (
        <AdvancePaymentCancelModal
          show={show}
          handleChange={handleChangeNew}
          onhide={handleHide}
          handleCancel={handleCancel}
        />
      )}

      {CreditModalShow && (
        <AdvancePaymentCreditModal
          onhandleClose={close}
          CreditModalShow={CreditModalShow}
          setCreditModalShow={setCreditModalShow}
        />
      )}
      {isRazorPayOpen && (
        <RazorPay
          AnotherPageCommonFunction={saveData}
          IsOpen={isRazorPayOpen}
          payload={{
            ...formData,
            amount: formData?.InvoiceAmount,
            currency: "INR",
            tnx_type: "Client",
            receipt: paymenyId?.receipt,
            key_id: paymenyId?.key_id,
            key_secret: paymenyId?.key_secret,
          }}
          setIsRazorPayOpen={setIsRazorPayOpen}
        />
      )}
      <Accordion
        name={t("Advance Payment")}
        isBreadcrumb={true}
        defaultValue={true}
        linkTo="/AdvancePayment"
        linkTitle={
          <div className="link-title-container mt-2" id="pr_id_11">
            <label>
              {t("Total Invoice Amount")} :
              <span className="text-danger" style={{ marginLeft: "10px" }}>
                {getTotalInvoiceAmount() ?? 0}
              </span>
            </label>
            |{" "}
            <label>
              {t("Total Received Amount")} :
              <span className="text-danger" style={{ marginLeft: "10px" }}>
                {outstanding?.ReceivedAmount}
              </span>
            </label>
            |
            <label>
              {t("Credit Limit")} :
              <span className="text-danger" style={{ marginLeft: "10px" }}>
                {outstanding?.CreditLimit}
              </span>
            </label>
            |
            <label>
              {t("Billing Amount")} :
              <span className="text-danger" style={{ marginLeft: "10px" }}>
                {outstanding?.BillingAmount}
              </span>
            </label>
          </div>
        }
      >
        <div className="row px-2 mt-2 mb-1">
          <div className="col-sm-2">
            <SelectBox
              selectedValue={formData?.Type}
              name="Type"
              options={[
                { label: "Select Centre Type", value: "" },
                ...TypeRate,
              ]}
              lable="Centre Type"
              id="Centre Type"
              onChange={handleSelectChange}
              className="required-fields"
            />
            {formData?.Type == "" && (
              <span className="error-message">{err?.Type}</span>
            )}
          </div>

          <div className="col-sm-2">
            <ReactSelect
              dynamicOptions={CentreData}
              name="RateTypeID"
              lable={t("RateType")}
              id="RateType"
              removeIsClearable={true}
              placeholderName={t("RateType")}
              value={formData?.RateTypeID}
              onChange={handleSearchSelectChange}
              className="required-fields"
            />

            {formData?.RateTypeID === "" && (
              <span className="error-message">{err?.RateTypeID}</span>
            )}
          </div>

          <div className="col-sm-2">
            <DatePicker
              className="custom-calendar"
              placeholder=" "
              id="ReceivedDate"
              lable="ReceivedDate"
              name="AdvanceAmtDate"
              value={formData?.AdvanceAmtDate}
              onChange={dateSelect}
              maxDate={new Date()}
            />
          </div>

          <div className="col-sm-2">
            <Input
              id="Advance Amount"
              lable="Advance Amount"
              placeholder=" "
              disabled={true}
            />
          </div>
          <div className="col-sm-3">
            {RADIOADVANCEINPUT.map((ele, index) => (
              <span key={index}>
                <input
                  type="radio"
                  name="CreditNote"
                  value={ele?.value}
                  checked={formData?.CreditNote === ele?.value && true}
                  onChange={handleRadioSelect}
                />
                <label className="mx-2">{t(ele?.label)}</label>
              </span>
            ))}
          </div>
        </div>
        {/* <div className="row px-2 mt-1 mb-1">
          {["2", "3"].includes(formData?.CreditNote) && (
            <>
              <div className="col-sm-2">
                <SelectBox
                  options={[{ label: "Select", value: "" }, ...creditdebit]}
                  lable="Credit/Debit Note Type"
                  id="CreditDebit Note Type"
                  name="CreditDebit"
                  selectedValue={formData?.CreditDebit}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-sm-1">
                <button
                  className="btn btn-sm btn-block btn-primary"
                  onClick={() => {
                    setCreditModalShow(true);
                  }}
                >
                  New
                </button>
              </div>
            </>
          )}
        </div> */}

        <div className="row p-2">
          {OldInvoiceDropDown.length > 1 ? (
            <>
              <div className="col-sm-2">
                <SelectBox
                  options={OldInvoiceDropDown}
                  name="InvoiceNo"
                  lable="Invoice Number"
                  id="Invoice Number"
                  selectedValue={formData?.InvoiceNo}
                  onChange={handleSelectChange}
                  className={"input-sm"}
                />
              </div>
              <div className="col-sm-6">
                <span
                  className="row"
                  style={{ border: "1px solid rgb(224, 225, 226)" }}
                >
                  <div className="col-sm-4">
                    <label>
                      {t("Invoice Amount")} :
                      <span
                        className="text-danger"
                        style={{ marginLeft: "10px" }}
                      >
                        {formData?.InvoiceNo
                          ? handleFindAll(formData?.InvoiceNo)
                          : 0}
                      </span>
                    </label>
                  </div>
                  <div className="col-sm-4">
                    <label>
                      {t("Received Amount")} :
                      <span
                        className="text-danger"
                        style={{ marginLeft: "10px" }}
                      >
                        {formData?.InvoiceNo
                          ? PendingandOutstandingAmt?.pending
                          : 0}
                      </span>
                    </label>
                  </div>
                  <div className="col-sm-4">
                    <label>
                      {t("Total OutStanding Amt.")} :
                      <span
                        className="text-danger"
                        style={{ marginLeft: "10px" }}
                      >
                        {formData?.InvoiceNo
                          ? PendingandOutstandingAmt?.outstanding
                          : 0}
                      </span>
                    </label>
                  </div>
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="col-sm-2">
                <label>
                  {t("Total OutStanding Amt.")} :
                  <span className="text-danger" style={{ marginLeft: "10px" }}>
                    {outstanding?.OutstandingAmount}
                  </span>
                </label>
              </div>{" "}
            </>
          )}
        </div>
      </Accordion>

      <Accordion
        title={t("Payment Detail")}
        // isBreadcrumb={true}
        defaultValue={true}
      >
        <div className="row  px-2 mt-2 mb-1">
          <div className="col-sm-2">
            <SelectBox
              options={[{ label: "Select Payment Mode" }, ...PaymentMode]}
              onChange={handleSelectChange}
              name="paymentModeID"
              lable="Payment Mode"
              id="Payment Mode"
              className="required-fields"
              selectedValue={(PaymentMode, formData?.paymentModeID)}
            />
          </div>

          <div className="col-sm-2">
            <Input
              id="CURRound"
              lable="CUR.Round"
              placeholder=" "
              disabled={true}
            />
          </div>
          {formData?.PaymentMode != "Online Payment" && (
            <>
              <div className="col-sm-2">
                <Input
                  name="TransactionId"
                  id="TransactionID"
                  lable="TransactionID"
                  placeholder=" "
                  type="text"
                  className="required-fields"
                  disabled={
                    formData?.PaymentMode == "Online Payment" ||
                    formData?.PaymentMode == "Cash"
                      ? true
                      : false
                  }
                  value={formData?.TransactionId}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="col-sm-2">
            <Input
              type="text"
              id="Remarks"
              lable="Remarks"
              placeholder=" "
              name="Remarks"
              value={formData?.Remarks}
              onChange={handleChange}
            />
          </div>
        </div>

        <>
          <Tables>
            <thead class="cf">
              <tr>
                {[
                  t("Payment Mode"),
                  t("Paid Amt."),
                  t("Currency"),
                  t("Base"),
                  ["Cheque", "Credit Card", "Debit Card"].includes(
                    formData?.PaymentMode
                  )
                    ? t("Cheque/Card No.")
                    : "",
                  ["Cheque", "Credit Card", "Debit Card"].includes(
                    formData?.PaymentMode
                  )
                    ? "Cheque/Card Date"
                    : "",
                  ["Cheque", "Credit Card", "Debit Card"].includes(
                    formData?.PaymentMode
                  )
                    ? t("Bank Name")
                    : "",
                ].map((ele, index) => ele !== "" && <th key={index}>{ele}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-title={t("PaymentMode")}>
                  {formData?.PaymentMode}&nbsp;
                </td>
                <td data-title={t("Paid Amt.")}>
                  <Input
                    className="required w-100"
                    type="number"
                    name="InvoiceAmount"
                    onInput={(e) => number(e, 7)}
                    value={formData?.InvoiceAmount}
                    onChange={handleChange}
                  />
                </td>
                <td data-title={t("Currency")}>INR</td>
                <td data-title={t("Base")}>0</td>
                {["Cheque"].includes(formData?.PaymentMode) && (
                  <td data-title={t("Cheque No")}>
                    <Input
                      className="required"
                      type="number"
                      onInput={(e) => number(e, 16)}
                      name="ChequeNo"
                      value={formData?.ChequeNo}
                      onChange={handleChange}
                    />
                  </td>
                )}

                {["Credit Card", "Debit Card"].includes(
                  formData?.PaymentMode
                ) && (
                  <td data-title={t("PaymentMode")}>
                    <Input
                      className=" required"
                      type="number"
                      onInput={(e) => number(e, 16)}
                      name="CreditCardNo"
                      value={formData?.CreditCardNo}
                      onChange={handleChange}
                    />
                  </td>
                )}
                {["Cheque", "Credit Card", "Debit Card"].includes(
                  formData?.PaymentMode
                ) && (
                  <td data-title={t("PaymentMode")}>
                    <div id="PaymentMode">
                      <DatePicker
                        name="ChequeDate"
                        value={formData?.ChequeDate}
                        onChange={dateSelect}
                        maxDate={new Date()}
                      />
                    </div>
                  </td>
                )}
                {["Cheque", "Credit Card", "Debit Card"].includes(
                  formData?.PaymentMode
                ) && (
                  <td data-title={t("BankName")}>
                    <SelectBox
                      name="BankName"
                      options={BankName}
                      selectedValue={formData?.BankName}
                      onChange={handleChange}
                    ></SelectBox>
                  </td>
                )}
              </tr>
            </tbody>
          </Tables>
        </>

        <div>
          {loadingSecond ? (
            <Loading />
          ) : (
            <>
              <div className="row mt-2 mb-1 px-1">
                <div className="col-sm-1">
                  <button
                    className="btn btn-block btn-success btn-sm"
                    onClick={() => handleSave()}
                  >
                    {t("Save")}
                  </button>
                </div>

                <div className="col-sm-2">
                  <button
                    className="btn btn-block btn-danger btn-sm"
                    onClick={() => AdvancePaymentDetail1("download", "1")}
                  >
                    {t("Excel (Cancel Entry)")}
                  </button>
                </div>

                <div className="col-sm-2">
                  <button
                    className="btn btn-block btn-success btn-sm"
                    onClick={() => AdvancePaymentDetail1("download", "0")}
                  >
                    {t("Excel (Active Entry)")}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </Accordion>

      <Accordion title={t("Previous Advance Amount")} defaultValue={true}>
        <>
          {AdvancePaymentDetail.length > 0 ? (
            <Tables>
              <thead class="cf">
                <tr>
                  <th>{t("S.No")}</th>
                  <th>{t("ReceiptNo")}</th>

                  <th>{t("PaymentType")}</th>
                  <th>{t("ClientCode")}</th>
                  <th>{t("ClientName")}</th>
                  <th>{t("ReceivedAmt")}</th>
                  <th>{t("PaymentMode")}</th>
                  <th>{t("AdvanceAmtDate")}</th>
                  <th>{t("Cancel")}</th>
                  <th>{t("Print")}</th>
                </tr>
              </thead>
              <tbody>
                {AdvancePaymentDetail?.map((data, index) => (
                  <tr key={index}>
                    <td data-title={t("S.No")}>
                      <div>{index + 1}</div>
                    </td>

                    <td data-title={t("ReceiptNo")}>{data?.ReceiptNo}&nbsp;</td>
                    <td data-title={t("PaymentType")}>{data?.Type}&nbsp;</td>
                    <td data-title={t("ClientCode")}>
                      {data?.ClientCode}&nbsp;
                    </td>
                    <td data-title={t("ClientName")}>
                      {data?.ClientName}&nbsp;
                    </td>
                    <td data-title={t("ReceivedAmt")}>
                      {data?.ReceivedAmt}&nbsp;
                    </td>
                    <td data-title={t("PaymentMode")}>
                      {data?.PaymentMode}&nbsp;
                    </td>
                    <td data-title={t("AdvanceAmtDate")}>
                      {dateConfig(data.AdvanceAmtDate, 0)}
                    </td>
                    <td data-title={t("Cancel")}>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                          setShow({
                            id: data?.ID,
                            modalShow: true,
                            cancelReason: "",
                          });
                        }}
                      >
                        {t("Cancel")}
                      </button>
                    </td>
                    <td data-title={t("Print")}>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={(e) => handlePDF(e, data?.ReceiptNo)}
                      >
                        {t("Print")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Tables>
          ) : (
            <NoRecordFound />
          )}
        </>
      </Accordion>
    </>
  );
}

export default AdvancePayment;
