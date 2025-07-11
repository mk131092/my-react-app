import { axiosInstance } from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Input from "../../components/formComponent/Input";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Loading from "../../components/loader/Loading";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
import { useTranslation } from "react-i18next";

import Accordion from "@app/components/UI/Accordion";
import Tables from "../../components/UI/customTable";
const RefundAfterBill = () => {
  const [tableData, setTableData] = useState([]);
  const [BindRefundReason, setBindRefundReason] = useState([]);
  const [dropdownData, setDropDownData] = useState({
    RefundReason: "",
  });
  const [LabNo, setLabNo] = useState([]);

  const [load, setLoad] = useState({
    saveLoad: false,
  });

  console.log(tableData);

  const fetch = () => {
    setLoad({ ...load, saveLoad: true });
    axiosInstance
      .post("RefundAfterBill/GetItemsToRefund", {
        LedgerTransactionNo: LabNo.trim(),
      })
      .then((res) => {
        if (res?.data?.message.length == 0) {
          toast.error("No record found");
        }

        setLoad({ ...load, saveLoad: false });
        setTableData(res?.data?.message);
      })
      .catch((err) => {
        setLoad({ ...load, saveLoad: false });
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong."
        );
      });
  };

  const getDropDownData = (name) => {
    axiosInstance.post("Global/getGlobalData", { Type: name }).then((res) => {
      let data = res.data.message;
      console.log(data);
      let value = data.map((ele) => {
        return {
          value: ele.FieldDisplay,
          label: ele.FieldDisplay,
        };
      });
      setDropDownData({ RefundReason: value[0]?.value });
      setBindRefundReason(value);
    });
  };

  const handleCheckbox = (e, index) => {
    const { name, checked } = e.target;
    const data = [...tableData];
    data[index][name] = checked === true ? 1 : 0;
    setTableData(data);
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setDropDownData({ ...dropdownData, [name]: value });
  };

  const handleSave = () => {
    setLoad({ ...load, saveLoad: true });
    const data = tableData.filter((ele) => ele?.IsRefund === 1);

    const val = data?.map((ele) => {
      return {
        LedgerTransactionID: ele?.LedgerTransactionID,
        ItemId: ele?.ItemId,
        BillNo: ele?.BillNo,
        DiscountAmt: ele?.DiscountAmt,
        Amount: ele?.Amount,
        RefundReason: dropdownData?.RefundReason,
      };
    });
    axiosInstance
      .post("RefundAfterBill/SaveRefundAfterBill", {
        PLO: val,
      })
      .then((res) => {
        console.log(res);
        toast.success(res?.data?.message);
        setLoad({ ...load, saveLoad: false });
        setLabNo("");
        setTableData([]);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong."
        );
        setLoad({ ...load, saveLoad: false });
      });
  };

  useEffect(() => {
    getDropDownData("RefundReason");
  }, []);

  const handleShowSubmit = () => {
    let show = false;
    for (let i = 0; i < tableData.length; i++) {
      if (tableData[i]["IsRefund"] === 1) {
        show = true;
        break;
      }
    }
    return show;
  };
  const handleKeyDown = (e) => {
    if (e?.key === "Enter") {
      fetch(e);
    }
  };
  const { t } = useTranslation();

  return (
    <>
      <Accordion
        name={t("Refund After Bill")}
        isBreadcrumb={true}
        defaultValue={true}
      >
        <div className="row px-2 mt-2 mb-1">
          <div className="col-sm-2">
            <Input
              type="text"
              id="LabNo"
              lable="Lab Number"
              placeholder=" "
              onKeyDown={handleKeyDown}
              value={LabNo}
              onChange={(e) => {
                setLabNo(e?.target?.value);
              }}
            />
          </div>

          <div className="col-sm-1">
            <button
              onClick={fetch}
              className="btn btn-primary btn-sm w-100"
              disabled={LabNo.length == 0}
            >
              {t("Search")}
            </button>
          </div>
        </div>{" "}
      </Accordion>

      {tableData.length > 0 ? (
        <Accordion title={t("Search Detail")} defaultValue={true}>
          {load?.saveLoad ? (
            <Loading />
          ) : (
            <Tables>
              <thead>
                <tr>
                  {[
                    t("S.No."),
                    t("Lab No"),
                    t("UHID"),
                    t("Test Name"),
                    t("Quantity"),
                    t("Rate"),
                    t("Amount"),
                    t("Select"),
                  ].map((ele, index) => (
                    <th key={index}>{ele}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((data, index) => (
                  <tr key={index}>
                    <td data-title={t("S.No.")}>{index + 1}&nbsp;</td>
                    <td data-title={t("Lab No")}>
                      {data?.LedgerTransactionNo}&nbsp;
                    </td>
                    <td data-title={t("UHID")}>{data?.PatientCode}&nbsp;</td>
                    <td data-title={t("Test Name")}>{data?.ItemName}&nbsp;</td>
                    <td data-title={t("Quantity")} className="amount">
                      {data?.Quantity}&nbsp;
                    </td>
                    <td data-title={t("Rate")} className="amount">
                      {Number(data?.Rate).toFixed(2)}&nbsp;
                    </td>
                    <td data-title={t("Amount")} className="amount">
                      {Number(data?.Amount).toFixed(2)}&nbsp;
                    </td>
                    <td data-title={t("Select")}>
                      {data?.InvoiceNo == "" ? (
                        <input
                          type="checkbox"
                          checked={data?.IsRefund}
                          disabled={data?.Rate == 0}
                          name="IsRefund"
                          onChange={(e) => handleCheckbox(e, index)}
                        />
                      ) : (
                        <span className="text-danger">
                          Refund Not Possible : Invoice Already Generated
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Tables>
          )}

          {handleShowSubmit() && (
            <>
              <div className="row mt-4 px-2">
                <div className="col-sm-2">
                  <SelectBox
                    name="RefundReason"
                    options={BindRefundReason}
                    onChange={handleSelectChange}
                    id="RefundReason"
                    lable="RefundReason"
                    selectedValue={dropdownData?.RefundReason}
                  />
                </div>

                <div className="col-sm-1">
                  {load?.saveLoad ? (
                    <Loading />
                  ) : (
                    <button
                      className="btn btn-block btn-success btn-sm"
                      onClick={handleSave}
                    >
                      {t("Save")}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </Accordion>
      ) : (
        <></>
      )}
    </>
  );
};

export default RefundAfterBill;
