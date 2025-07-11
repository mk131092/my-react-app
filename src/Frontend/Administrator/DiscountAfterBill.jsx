import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import { useTranslation } from "react-i18next";
import Input from "../../components/formComponent/Input";
import Tables from "../../components/UI/customTable";
import Loading from "../../components/loader/Loading";
import {
  checkEmploypeeWiseDiscount,
  getBindDiscApproval,
  getBindDiscReason,
} from "../../utils/NetworkApi/commonApi";
import { isChecked } from "../util/Commonservices";
import { SelectBox } from "../../components/formComponent/SelectBox";

import Accordion from "@app/components/UI/Accordion";
import { number } from "../../utils/helpers";
const DiscountAfterBill = () => {
  const [load, setLoad] = useState({
    saveLoad: false,
    searchLoad: false,
  });
  const [LabNo, setLabNo] = useState([]);
  const [BindDiscApproval, setBindDiscApproval] = useState([]);
  const [BindDiscReason, setBindDiscReason] = useState([]);
  const [dropdownData, setDropDownData] = useState({
    DiscountApprovedBy: "",
    DiscountReason: "",
  });
  const [tableData, setTableData] = useState([]);

  const fetch = () => {
    setLoad({ ...load, searchLoad: true });
    axiosInstance
      .post("DiscountAfterBill/GetItemsToGetDiscount", {
        LedgerTransactionNo: LabNo.trim(),
      })
      .then((res) => {
        if (res?.data?.success) {
          let data = res?.data?.message;

          let val = data.map((ele) => {
            return {
              ...ele,
              DiscountAmt: 0,
              isActive: 0,
            };
          });
          setTableData(val);
        } else {
          setTableData([]);
          toast.error("No Record Found");
        }

        setLoad({ ...load, searchLoad: false });
      })
      .catch((err) => {
        setLoad({ ...load, searchLoad: false });
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    if (name === "DiscountApprovedBy") {
      if (value) {
        const { GrossAmount, DiscAmt } = DiscountValidation();
        checkEmploypeeWiseDiscount(
          {
            GrossAmount: GrossAmount,
            CentreID: tableData[0]?.CentreId ?? "",
            DiscountOnTotal: DiscAmt,
          },
          value
        )
          .then((res) => {
            setDropDownData({ ...dropdownData, [name]: value });
          })
          .catch((err) => {
            toast.error(err);
            setDropDownData({ ...dropdownData, [name]: "" });
          });
      } else {
        setDropDownData({ ...dropdownData, [name]: "" });
      }
    }
    setDropDownData({ ...dropdownData, [name]: value });
  };

  const handleChange = (e, index, Amount) => {
    const data = [...tableData];
    const { name, value, id } = e.target;
    data[index][name] = value > Amount ? "" : value;
    setTableData(data);
    if (value > Amount) {
      document.getElementById([id]).value = "";
    }
  };

  const handleSaveShowButton = () => {
    let show = false;
    for (let i = 0; tableData?.length > i; i++) {
      if (
        document?.getElementById(`DiscountAmt-${i}`)?.value !== "" &&
        document?.getElementById(`DiscountAmt-${i}`)?.value != 0
      ) {
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
  const handleSave = () => {
    if (dropdownData?.DiscountApprovedBy && dropdownData?.DiscountReason) {
      setLoad({ ...load, saveLoad: true });
      const data = tableData
        .filter(
          (ele) =>
            ele?.isActive == "1" && ele?.Approved == 0 && ele?.InvoiceNo == ""
        )
        .map((ele) => {
          return {
            ItemId: ele?.ItemId,
            LedgerTransactionID: ele?.LedgerTransactionID,
            DiscountAmt: ele?.DiscountAmt,
            DiscountApprovedBy: dropdownData?.DiscountApprovedBy,
            DiscountReason: dropdownData?.DiscountReason,
            IsCancel: 0,
          };
        });
      axiosInstance
        .post("DiscountAfterBill/SaveDiscountAfterBill", {
          PLONew: data,
        })
        .then((res) => {
          for (let i = 0; i < tableData?.length; i++) {
            document.getElementById(`DiscountAmt-${i}`).value = "";
          }
          document.getElementById("DiscountByPercentage").value = "";
          document.getElementById("DiscountByRS").value = "";

          toast.success(res?.data?.message);
          setLoad({ ...load, saveLoad: false });
          setDropDownData({
            DiscountApprovedBy: "",
            DiscountReason: "",
          });

          setTableData([]);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something went wrong"
          );
          setLoad({ ...load, saveLoad: false });
        });
    } else {
      toast.error("Please Choose Discount Approval and Reason");
    }
  };

  const DiscountValidation = (id) => {
    let GrossAmount = 0;
    let DiscAmt = 0;
    for (let i = 0; tableData.length > i; i++) {
      GrossAmount = GrossAmount + Number(tableData[i]?.Rate);
      DiscAmt =
        DiscAmt + Number(document.getElementById(`DiscountAmt-${i}`).value);
    }
    return {
      GrossAmount,
      DiscAmt,
    };
  };

  const total = () => {
    const totalvalue = tableData
      .filter((ele) => ele?.Approved === 0)
      .reduce((prev, current, index) => prev + current.Amount, 0);
    return totalvalue;
  };

  const handleSumOfTest = (id, value) => {
    if (id === "DiscountByRS") {
      const totalvalue = total();
      document.getElementById("DiscountByPercentage").value = "";
      return {
        totalvalue: totalvalue >= value ? true : false,
        message: "Your value is Greater then total value",
      };
    } else {
      document.getElementById("DiscountByRS").value = "";
      return {
        totalvalue: value <= 100 ? true : false,
        message: "Discount Percentage is greater than 100%",
      };
    }
  };

  const findPercentageAmount = (value) => {
    const findPercentageDiscount = ((value / total()) * 100).toFixed(2);
    return findPercentageDiscount;
  };

  const sumTotal = [];

  const separateAmountByDiscount = (
    value,
    percentage,
    lastindex,
    condition,
    inputValue
  ) => {
    if (condition) {
      if (!lastindex) {
        const data = (value * percentage) / 100;
        const finalData = data.toFixed(2);
        sumTotal.push(finalData);
        return finalData;
      } else {
        const finalData = sumTotal.reduce(
          (acc, current) => acc + parseFloat(current),
          0
        );

        const finalResult = parseFloat((inputValue - finalData).toFixed(2));
        return finalResult;
      }
    } else {
      const data = (value * percentage) / 100;
      const finalData = data.toFixed(2);
      return finalData;
    }
  };

  const handleChangeMain = (e) => {
    const { name, value, id } = e.target;
    if (id !== "DiscountByRS" && value.length > 3) {
      e.preventDefault();
      return;
    }
    const { totalvalue, message } = handleSumOfTest(id, value);
    if (totalvalue) {
      console.log(tableData);

      const data = tableData.map((ele, index) => {
        if (ele?.Approved === 0 && ele?.isActive == 1) {
          const inputValue = separateAmountByDiscount(
            ele?.Amount,
            id === "DiscountByRS" ? findPercentageAmount(value) : value,
            index + 1 === tableData.length,
            id === "DiscountByRS",
            value
          );
          document.getElementById(`DiscountAmt-${index}`).value = inputValue;

          return {
            ...ele,
            [name]: inputValue,
          };
        } else {
          return ele;
        }
      });
      setTableData(data);
    } else {
      toast.error(message);
    }
  };
  const handleTableData = (e, index, data) => {
    const { checked } = e.target;
    const updatedTableData = [...tableData];
    const inputElement = document.getElementById(`DiscountAmt-${index}`);
    if (inputElement) {
      inputElement.value = "";
    }
    updatedTableData[index].isActive = checked ? "1" : "0";

    setTableData(updatedTableData);
  };

  useEffect(() => {
    getBindDiscApproval(setBindDiscApproval);
    getBindDiscReason(setBindDiscReason);
  }, []);

  const handleCheckbox = (e) => {
    const { checked } = e.target;

    const data = tableData?.map((ele) => {
      return {
        ...ele,
        isActive: checked && ele?.InvoiceNo == "" ? "1" : "0",
      };
    });

    setTableData(data);
  };
  const { t } = useTranslation();
  const handleCancelAll = (flag, data) => {
    const userConfirmed = window.confirm("Are you sure you want to cancel?");

    if (!userConfirmed) return;
    setLoad({ ...load, saveLoad: true });
    const finalData = flag ? tableData : [data];
    const datas = finalData
      .filter((ele) => ele?.Approved == 0 || ele?.DiscAmt != 0)
      .map((ele) => {
        return {
          ItemId: ele?.ItemId,
          LedgerTransactionID: ele?.LedgerTransactionID,
          DiscountAmt: ele?.DiscAmt,
          DiscountApprovedBy: 0,
          DiscountReason: "",
          IsCancel: 1,
        };
      });
    axiosInstance
      .post("DiscountAfterBill/SaveDiscountAfterBill", {
        PLONew: datas,
      })
      .then((res) => {
        if (res?.data?.success) {
          for (let i = 0; i < tableData?.length; i++) {
            document.getElementById(`DiscountAmt-${i}`).value = "";
          }
          document.getElementById("DiscountByPercentage").value = "";
          document.getElementById("DiscountByRS").value = "";

          toast.success(res?.data?.message);
          setLoad({ ...load, saveLoad: false });
          setDropDownData({
            DiscountApprovedBy: "",
            DiscountReason: "",
          });
          setTableData([]);
        } else {
          setLoad({ ...load, saveLoad: false });
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        setLoad({ ...load, saveLoad: false });
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };
  return (
    <>
      <Accordion
        name={t("Discount After Bill")}
        isBreadcrumb={true}
        defaultValue={true}
      >
        <div className="row  px-2 mt-2 mb-1">
          <div className="col-sm-2">
            <Input
              type="text"
              id="LabNo"
              lable="Lab Number"
              placeholder=" "
              value={LabNo}
              onKeyDown={handleKeyDown}
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
        </div>
      </Accordion>

      {!load?.searchLoad ? (
        tableData.length > 0 ? (
          <>
            <Accordion title={t("Search Detail")} defaultValue={true}>
              <Tables>
                <thead className="cf">
                  <tr>
                    <th>{t("S.No")}</th>
                    <th>{t("Lab No")}</th>
                    <th>{t("Test Name")}</th>
                    <th>{t("Quantity")}</th>
                    <th>{t("Rate")}</th>
                    <th>
                      <div className="row">
                        <div className="col-sm-6">
                          <Input
                            placeholder={t("Dis.in(RS)")}
                            name="DiscountAmt"
                            id="DiscountByRS"
                            value={
                              document.getElementById("DiscountByRS")?.value
                            }
                            disabled={
                              tableData?.some((item) => item.isActive == 1)
                                ? false
                                : true
                            }
                            onChange={handleChangeMain}
                            type="number"
                          />
                        </div>{" "}
                        <div className="col-sm-6">
                          <Input
                            placeholder={t("Dis.in(%)")}
                            type="number"
                            name="DiscountAmt"
                            id="DiscountByPercentage"
                            disabled={
                              tableData?.some((item) => item.isActive == 1)
                                ? false
                                : true
                            }
                            value={
                              document.getElementById("DiscountByPercentage")
                                ?.value
                            }
                            onChange={handleChangeMain}
                          />
                        </div>
                      </div>
                    </th>
                    <th>{t("Amount")}</th>
                    <th>
                      {t("DisAmount")}
                      {/* &nbsp;&nbsp;
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleCancelAll(true, "")}
                      >
                        Cancel All
                      </button> */}
                    </th>
                    <th>
                      <input
                        type="checkbox"
                        checked={
                          tableData.length > 0
                            ? isChecked("isActive", tableData, "1").includes(
                                false
                              )
                              ? false
                              : true
                            : false
                        }
                        onChange={handleCheckbox}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((data, index) => (
                    <tr key={index}>
                      <td data-title={t("S.No")}>{index + 1}</td>
                      <td data-title={t("Lab No")}>
                        {data?.LedgerTransactionNo}
                      </td>
                      <td data-title={t("Test Name")}>{data?.ItemName}</td>
                      <td data-title={t("Quantity")}>{data?.Quantity}</td>
                      <td data-title={t("Rate")}>{data?.Rate}</td>
                      <td data-title={t("Discount")}>
                        <Input
                          type="number"
                          name="DiscountAmt"
                          disabled={data?.isActive == 1 ? false : true}
                          id={`DiscountAmt-${index}`}
                          value={
                            document.getElementById(`DiscountAmt-${index}`)
                              ?.value
                          }
                          min={0}
                          onWheel={(e) => e.target.blur()}
                          onInput={(e) => {
                            number(e, data?.Rate.toString().length);
                          }}
                          onChange={(e) => handleChange(e, index, data?.Amount)}
                        ></Input>
                      </td>
                      <td data-title={t("Amount")}>{data?.Amount}</td>
                      <td data-title={t("DisAmount")}>
                        {data?.DiscAmt}
                        <button
                          disabled={
                            data?.Approved != 0 ||
                            data?.DiscAmt == 0 ||
                            data?.InvoiceNo != "" ||
                            data?.paymentmode == "Credit"
                          }
                          title={
                            data?.Approved == 1
                              ? "Already Approved. Cannot Be Canceled."
                              : "Click to Cancel Discount"
                          }
                          className="ml-3 btn btn-success btn-sm"
                          onClick={() => handleCancelAll(false, data)}
                          style={{
                            backgroundColor: "red",
                            color: "white",
                            border: "none",
                            padding: "4px 7px",
                            fontSize: "12px",
                            cursor: "pointer",
                            borderRadius: "4px",
                          }}
                        >
                          X
                        </button>
                      </td>
                      <td data-title={t("Status")}>
                        {data?.InvoiceNo == "" ? (
                          <input
                            type="checkbox"
                            name="isActive"
                            checked={data?.isActive === "1" ? true : false}
                            onChange={(e) => handleTableData(e, index, data)}
                          />
                        ) : (
                          <span className="text-danger">
                            Discount Not Possible : Invoice Already Generated
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Tables>

              {handleSaveShowButton() && (
                <div className="row mt-4 px-2">
                  <div className="col-sm-2 col-md-2">
                    <SelectBox
                      options={BindDiscApproval}
                      onChange={handleSelectChange}
                      name="DiscountApprovedBy"
                      id="DiscountApprovedBy"
                      lable="DiscountApprovedBy"
                      selectedValue={dropdownData?.DiscountApprovedBy}
                    />
                  </div>
                  <div className="col-sm-2">
                    <SelectBox
                      options={BindDiscReason}
                      lable="DiscountReason"
                      id="DiscountReason"
                      onChange={handleSelectChange}
                      selectedValue={dropdownData?.DiscountReason}
                      name="DiscountReason"
                    />
                  </div>
                  <div className="col-sm-1">
                    {/* <div className="ApproveBarcodeChild"> */}
                    {load?.saveLoad ? (
                      <Loading />
                    ) : (
                      <button
                        className="btn btn-success btn-block btn-sm"
                        onClick={handleSave}
                        disabled={
                          dropdownData?.DiscountReason <= 0 ||
                          tableData[0]?.paymentmode == "Credit"
                            ? true
                            : false
                        }
                      >
                        {t("Save")}
                      </button>
                    )}
                  </div>
                  {/* </div> */}
                </div>
              )}
            </Accordion>
          </>
        ) : (
          ""
        )
      ) : (
        <Loading />
      )}
    </>
  );
};

export default DiscountAfterBill;
