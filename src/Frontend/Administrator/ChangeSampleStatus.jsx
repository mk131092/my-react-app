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
const ChangeSampleStatus = () => {
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [visitID, setVisitID] = useState();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    LabNo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const fetch = (e) => {
    e.preventDefault();
    axiosInstance
      .post("ChangeSampleStatusData/GetChangeSampleStatusData", {
        LabNo: input?.LabNo,
      })
      .then((res) => {
        const data = res?.data?.message;
        if (data.length > 0) {
          const val = data.map((ele) => {
            return {
              ...ele,
              ResultRemove: "0",
              SampleRemove: "0",
            };
          });
          setData(val);
        } else {
          toast.error("No Data Found");
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
      });
  };

  const validate = () => {
    let match = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i]["ResultRemove"] === "1" || data[i]["SampleRemove"] === "1") {
        match = true;
        break;
      }
    }
    return match;
  };

  const Submit = () => {
    setLoading(true);
    const match = validate();
    if (match) {
      const val = data.filter(
        (ele) => ele?.ResultRemove == "1" || ele?.SampleRemove == "1"
      );
      const playdata = val.map((ele) => {
        return {
          LabNo: ele?.LedgerTransactionNo,
          ResultRemove: ele?.ResultRemove?.toString(),
          TestId: ele?.TestID,
          SampleRemove: ele?.SampleRemove?.toString(),
        };
      });
      axiosInstance
        .post("ChangeSampleStatusData/UpdateChangeSampleStatusData", playdata)
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
      toast.error("Please Choose AtLeast One Test");
      setLoading(false);
    }
  };

  const ShowBtn = () => {
    const val = data.filter(
      (ele) => ele?.ResultRemove === "1" || ele?.SampleRemove === "1"
    );
    return val.length > 0 ? true : false;
  };

  const handleCheckbox = (e, index) => {
    const { name, checked } = e.target;
    const val = [...data];
    val[index][name] = checked ? "1" : "0";
    setData(val);
  };

  const handleCancel = () => {
    setData([]);
    setInput({ LabNo: "" });
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
      <Accordion
        name={t("Change Sample Status")}
        isBreadcrumb={true}
        defaultValue={true}
      >
        <form onSubmit={fetch}>
          <div className="row px-2 mt-2 mb-1">
            <div className="col-sm-2">
              <Input
                id="Lab No"
                lable="Lab Number"
                placeholder=" "
                type="text"
                name="LabNo"
                value={input.LabNo}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-1">
              <button
                className="btn btn-block btn-info btn-sm"
                disabled={input?.LabNo.length > 3 ? false : true}
              >
                {t("Search")}
              </button>
            </div>
          </div>
        </form>
      </Accordion>
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
                  <th>{t("Result Remove")}</th>
                  <th>{t("Sample Status Remove")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                      <td
                        data-title={t("View")}
                        onClick={() => {
                          setModal(true);
                          setVisitID(item.LedgerTransactionNo);
                        }}
                      >
                        <i className="fa fa-search" />
                      </td>
                      <td data-title={t("Lab No.")}>
                        {item.LedgerTransactionNo}&nbsp;
                      </td>
                      <td data-title={t("PName")}>{item?.PName}&nbsp;</td>
                      <td data-title={t("Age/Sex")}>{item.AgeGender}&nbsp;</td>
                      <td data-title={t("Investigation")}>
                        {item.Investigation}&nbsp;
                      </td>
                      <td data-title={t("BarcodeNo")}>
                        {item.BarcodeNo}&nbsp;
                      </td>

                      <td data-title={t("Result Remove")}>
                        <input
                          type="checkbox"
                          name="ResultRemove"
                          checked={item?.ResultRemove === "1" ? true : false}
                          disabled={item?.status != 10 && true}
                          onChange={(e) => {
                            handleCheckbox(e, index);
                          }}
                        />
                      </td>
                      <td data-title={t("Sample Status Remove")}>
                        <input
                          type="checkbox"
                          name="SampleRemove"
                          checked={item?.SampleRemove === "1" ? true : false}
                          disabled={item?.status == 1 && true}
                          onChange={(e) => {
                            handleCheckbox(e, index);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Tables>

            {loading ? (
              <Loading />
            ) : (
              ShowBtn() && (
                <>
                  <div className="row mt-2 mb-1 px-2">
                    <div className="col-sm-1">
                      <button
                        className="btn btn-block btn-success btn-sm"
                        onClick={Submit}
                      >
                        {t("Update")}
                      </button>
                    </div>
                    <div className="col-sm-1">
                      <button
                        className="btn btn-block btn-success btn-sm"
                        onClick={handleCancel}
                      >
                        {t("Cancel")}
                      </button>
                    </div>
                  </div>
                </>
              )
            )}
          </>
        ) : (
          <>
            {" "}
            <NoRecordFound />{" "}
          </>
        )}{" "}
      </Accordion>
    </>
  );
};

export default ChangeSampleStatus;
