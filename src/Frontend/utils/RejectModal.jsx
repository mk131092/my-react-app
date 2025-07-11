import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { getRejectCount } from "../../utils/NetworkApi/commonApi";
import { axiosInstance } from "../../utils/axiosInstance";
import { Dialog } from "primereact/dialog";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { SelectBox } from "../../components/formComponent/SelectBox";

function RejectModal({ show, handleShow, data, TableData }) {
  const [dropDown, setDropDown] = useState([]);
  const { t } = useTranslation();
  const [payload, setPayload] = useState({
    Reason: "",
    CustomReason: "",
  });

  const getDropDown = () => {
    axiosInstance
      .post("Global/getGlobalData", {
        Type: "RejectReason",
      })
      .then((res) => {
        let data = res.data.message;

        let selectdata = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        selectdata.unshift({ label: t("Other"), value: "other" });
        setDropDown(selectdata);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : t("Error Occurred")
        );
      });
  };

  const handleSelect = (event) => {
    const { name, value } = event?.target;
    if (value !== "other") {
      setPayload({ ...payload, [name]: value, CustomReason: value });
    } else {
      setPayload({ ...payload, [name]: value, CustomReason: "" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleReason = () => {
    return payload?.Reason === "other"
      ? payload?.CustomReason
        ? true
        : false
      : payload?.Reason;
  };

  const handleSubmit = () => {
    if (handleReason()) {
      axiosInstance
        .post("SC/SampleRejection", {
          data: [
            {
              ...data,
              Reason: payload?.Reason,
              CustomReason: payload?.CustomReason,
            },
          ],
        })
        .then((res) => {
          handleShow();
          toast.success(res.data?.message);
          TableData("");
          getRejectCount();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : t("Error Occurred")
          );
        });
    } else {
      toast.error(t("Please Choose Reason"));
    }
  };

  useEffect(() => {
    getDropDown();
  }, []);

  const theme = useLocalStorage("theme", "get");

  return (
    <Dialog
      visible={show}
      header={t("Select Reason to Reject Sample")}
      top={"10%"}
      onHide={handleShow}
      className={theme}
    >
      <div className="row">
        <div className="col-sm-12">
          <SelectBox
            options={[{ label: t("Select"), value: "" }, ...dropDown]}
            name="Reason"
            selectedValue={payload?.Reason}
            onChange={handleSelect}
            lable={t("Select Reason")}
          />
        </div>
        {payload?.Reason === "other" && (
          <div className="col-sm-12">
            <input
              className="form-control"
              name="CustomReason"
              placeholder={t("Enter your reason")}
              onChange={handleChange}
              value={payload?.CustomReason}
            />
          </div>
        )}
      </div>

      <div className="row mt-2">
        <div className="col-sm-6 p-1">
          <button
            type="button"
            className="btn btn-block btn-danger btn-sm"
            onClick={handleSubmit}
          >
            {t("Reject")}
          </button>
        </div>
        <div className="col-sm-6 p-1">
          <button
            type="button"
            className="btn btn-block btn-secondary btn-sm"
            onClick={handleShow}
          >
            {t("Close")}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default RejectModal;
