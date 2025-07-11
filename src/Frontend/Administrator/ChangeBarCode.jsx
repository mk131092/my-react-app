import React, { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import CustomModal from "../utils/CustomModal";
import Accordion from "@app/components/UI/Accordion";
import Input from "../../components/formComponent/Input";
import Tables from "../../components/UI/customTable";
import Loading from "../../components/loader/Loading";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
import { checkDuplicateBarcode } from "../../utils/NetworkApi/commonApi";
import { isChecked } from "../util/Commonservices";

const ChangeBarCode = () => {
  const { t } = useTranslation();
  const [LabNo, setLabNo] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [visitID, setVisitID] = useState();

  const handleChangeNew = (e, index, sampletypeId) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const updateData = data.map((ele) => {
        if (ele?.SampleTypeID === sampletypeId) {
          return {
            ...ele,
            isSelect: checked,
          };
        } else {
          return ele;
        }
      });

      setData(updateData);
    } else {
      const updateData = data.map((ele) => {
        return {
          ...ele,
          isSelect: checked,
        };
      });
      setData(updateData);
    }
  };

  const fetch = (e) => {
    setLoading(true);
    axiosInstance
      .post("ChangeBarcode/GetData", {
        labNo: LabNo,
      })
      .then((res) => {
        const data = res?.data?.message;
        if (data.length > 0) {
          const val = data.map((ele) => {
            return {
              ...ele,
              labNo: ele?.LedgerTransactionNo,
              isSelect: false,
              oldBarcodeNo: ele?.BarcodeNo,
            };
          });
          setLoading(false);
          setData(val);
        } else {
          toast.error("No Data Found");
          setData([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
        setLoading(false);
      });
  };

  const Submit = () => {
    const val = data.filter((ele) => ele?.isSelect === true);
    if (val.length > 0) {
      setLoading(true);
      axiosInstance
        .post("ChangeBarcode/UpdateBarcode", {
          savedata: val,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setLoading(false);
          fetch();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : err?.data?.message
          );
          setLoading(false);
        });
    } else {
      toast.error("Please Choose One Test");
    }
  };

  const handleBarcode = (e, i, barcodeLogic, sampletypeId) => {
    const { value } = e.target;
    if (barcodeLogic === 1 || barcodeLogic === 2) {
      const updateData = data.map((ele, index) => {
        if (index === i) {
          return {
            ...ele,
            isSelect: false,
            BarcodeNo: value,
          };
        } else {
          return ele;
        }
      });
      setData(updateData);
    } else if (barcodeLogic === 3) {
      const updateData = data.map((ele) => {
        return {
          ...ele,
          BarcodeNo: value,
        };
      });
      setData(updateData);
    }

    if (barcodeLogic === 4) {
      let flag = true;
      for (let i = 0; i < data.length; i++) {
        if (
          data[i]?.SampleTypeID !== sampletypeId &&
          value !== "" &&
          value === data[i]?.BarcodeNo
        ) {
          flag = false;
          break;
        }
      }
      if (flag) {
        const updateData = data.map((ele) => {
          if (ele?.SampleTypeID === sampletypeId) {
            return {
              ...ele,
              BarcodeNo: value,
            };
          } else {
            return ele;
          }
        });
        setData(updateData);
      } else {
        toast.error("This BarCode is Already Given");
      }
    }
  };

  // validation
  const handleCloseBarcodeModal = (
    value,
    LedgerTransactionID,
    barcodeLogic,
    sampletypeId
  ) => {
    if (value !== "") {
      checkDuplicateBarcode(value, LedgerTransactionID).then((res) => {
        if (res === " " || res === "") {
        } else {
          if (barcodeLogic === 3) {
            const updatedData = data.map((ele) => {
              return {
                ...ele,
                BarcodeNo: value,
                LedgerTransactionID: LedgerTransactionID,
              };
            });
            setData(updatedData);
            toast.error(res);
          }

          if (barcodeLogic === 4) {
            const updatedData = data.map((ele) => {
              if (ele?.SampleTypeID === sampletypeId) {
                return {
                  ...ele,
                  BarcodeNo: "",
                  isChecked: "true",
                };
              } else {
                return ele;
              }
            });
            setData(updatedData);
            toast.error(res);
          }
        }
      });
    }
  };

  // end

  const handleCancle = () => {
    setData("");
    setLabNo("");
  };

  const hiddenButtons = () => {
    const val = data?.filter((item) => item?.isSelect === true);
    return val.length > 0 ? true : false;
  };

  return (
    <>
      {modal && (
        <CustomModal
          show={modal}
          visitID={visitID}
          onHide={() => setModal(false)}
        />
      )}
      <Accordion name={t("Change BarCode")} isBreadcrumb={true} defaultValue={true}>
        <form action="" onSubmit={fetch}>
          <div className="row px-2 mt-2 mb-1">
            <div className="col-sm-2">
              <Input
                id="Lab No"
                lable="Lab Number"
                placeholder=" "
                type="text"
                value={LabNo}
                onChange={(e) => setLabNo(e.target.value)}
                required
              />
            </div>
            <div className="col-sm-1">
              {loading ? (
                <Loading />
              ) : (
                <button
                  type="button"
                  className="btn btn-block btn-info btn-sm"
                  id="btnSave"
                  onClick={fetch}
                  disabled={LabNo.length > 3 ? false : true}
                >
                  {t("Search")}
                </button>
              )}
            </div>
          </div>
        </form>
      </Accordion>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Accordion title={t("Search Detail")} defaultValue={true}>
            {data.length > 0 ? (
              <>
                <Tables>
                  <thead className="cf">
                    <tr>
                      <th>{t("S.No")}</th>
                      <th>{t("View")}</th>
                      <th>{t("Lab No.")}</th>
                      <th>{t("PName")}</th>
                      <th>{t("Age/Sex")}</th>
                      <th>{t("Investigation")}</th>
                      <th>{t("BarCode")}</th>
                      <th>
                        <div>{t("Test")}</div>
                        <div>
                          <input
                            type="checkbox"
                            name="isSelect"
                            checked={
                              data.length > 0
                                ? isChecked("isSelect", data, true).includes(
                                    false
                                  )
                                  ? false
                                  : true
                                : false
                            }
                            onChange={(e) => {
                              handleChangeNew(e);
                            }}
                            disabled={
                              data[0]?.BarcodeLogic === 4 ||
                              data[0]?.BarcodeLogic === 2
                                ? true
                                : false
                            }
                          />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.map((item, index) => (
                      <tr key={index}>
                        <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                        <td
                          data-title={t("View")}
                          onClick={() => {
                            setModal(true);
                            setVisitID(item?.LedgerTransactionNo);
                          }}
                        >
                          <i className="fa fa-search" />
                        </td>
                        <td data-title={t("Lab No.")}>
                          {item.LedgerTransactionNo}&nbsp;
                        </td>
                        <td data-title={t("PName")}>{item?.PName}&nbsp;</td>
                        <td data-title={t("Age/Sex")}>
                          {item.AgeGender}&nbsp;
                        </td>
                        <td data-title={t("Investigation")}>
                          {item.Investigation}&nbsp;
                        </td>
                        <td data-title={t("BarCode")}>
                          {item.BarcodeLogic === 3 ||
                          item.BarcodeLogic === 4 ? (
                            <Input
                              type="text"
                              value={item.BarcodeNo}
                              name="BarcodeNo"
                              onChange={(e) => {
                                handleBarcode(
                                  e,
                                  index,
                                  item?.BarcodeLogic,
                                  item?.SampleTypeID
                                );
                              }}
                              onBlur={(e) => {
                                handleCloseBarcodeModal(
                                  e.target.value,
                                  item?.LedgerTransactionID,
                                  item?.BarcodeLogic,
                                  item?.SampleTypeID
                                );
                              }}
                            />
                          ) : (
                            item.BarcodeNo
                          )}
                          &nbsp;
                        </td>
                        <td data-title={t("Test")}>
                          <input
                            type="checkbox"
                            name="isSelect"
                            onChange={(e) =>
                              handleChangeNew(e, index, item?.SampleTypeID)
                            }
                            checked={item?.isSelect}
                            disabled={
                              item?.BarcodeLogic === 1 ||
                              item?.BarcodeLogic === 3
                                ? true
                                : item?.BarcodeNo
                                  ? false
                                  : true
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Tables>

                {loading ? (
                  <Loading />
                ) : (
                  <>
                    {hiddenButtons() && (
                      <div className="row mt-2 mb-2 px-2">
                        <div className="col-sm-1">
                          <button
                            type="button"
                            className="btn btn-block btn-success btn-sm"
                            id="btnUpdate"
                            onClick={Submit}
                          >
                            {t("Update")}
                          </button>
                        </div>
                        <div className="col-sm-1">
                          <button
                            type="button"
                            className="btn btn-block btn-danger btn-sm"
                            id="btnCancle"
                            onClick={handleCancle}
                          >
                            {t("Cancel")}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
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

export default ChangeBarCode;
