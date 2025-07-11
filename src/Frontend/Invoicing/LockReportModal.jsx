import React, { useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { Dialog } from "primereact/dialog";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import Input from "../../components/formComponent/Input";
import { toast } from "react-toastify";
import { number } from "../../utils/helpers";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Loading from "../../components/loader/Loading";
import { useTranslation } from "react-i18next";
const LockReportModal = ({
  selectedData,
  lockreportshow,
  setLockReportShow,
  handleSearch,
}) => {
  const theme = useLocalStorage("theme", "get");
  const isMobile = window.innerWidth <= 768;
  console.log(selectedData);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    DaysHour: "days",
    txtTimeLimit: "0",
    Reason: "",
    LastReason: "",
    UpdateTimeLimit: false,
  });

  const { t } = useTranslation();
  const handleSelectChange = (e) => {
    const { name, value } = e?.target;

    if (name == "Reason") {
      setPayload({
        ...payload,
        [name]: value,
      });
    } else if (name == "LastReason") {
      setPayload({
        ...payload,
        [name]: value,
      });
    } else {
      setPayload({ ...payload, [name]: value });
    }
  };
  const handleUpdate = () => {
    setLoading(true);
    if (payload?.txtTimeLimit)
      if (!payload?.txtTimeLimit || payload?.txtTimeLimit == 0) {
        toast.error("Limit Can't Be Blank Or Zero.");
        setLoading(false);
      } else if (payload?.Reason == "") {
        toast.error("Please Enter Lock Client Reason.");
        setLoading(false);
      } else {
        axiosInstance
          .post("Accounts/ForcefullyLockOrUnlock", {
            Reason: payload.Reason.toString(),
            LastReason: payload.LastReason.toString(),
            IsLock: selectedData?.IsLockStatus ? 0 : 1,
            RateTypeID: Number(selectedData.CentreID),
            Uptodate: `${payload?.txtTimeLimit?.toString()} ${payload?.DaysHour?.toString()}`,
          })
          .then((res) => {
            toast.success(res?.data?.message);
            setLoading(false);
            setLockReportShow(false);
            handleSearch();
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

  return (
    <>
      <Dialog
        visible={lockreportshow}
        header={t(
          selectedData?.IsLockStatus === 1
            ? "Enter Time Limit To Unlock The Client"
            : "Enter Time Limit To Lock The Client"
        )}
        onHide={() => setLockReportShow(false)}
        className={theme}
        style={{
          width: isMobile ? "80vw" : "40vw",
        }}
      >
        <div className="row">
          <label className="col-sm-1">{t("PUP")}:</label>
          <div className="col-sm-10">{selectedData?.centre}</div>
        </div>
        <div className="row">
          <div className="col-sm-5 d-flex">
            <input
              type="checkbox"
              className="mb-3"
              name="UpdateTimeLimit"
              checked={payload?.UpdateTimeLimit}
              onChange={(e) => {
                setPayload({
                  ...payload,
                  [e.target.name]: e.target.checked,
                });
              }}
            />
            <label className="control-label" style={{ marginLeft: "5px" }}>
              {t(
                selectedData.IsLockStatus === 0
                  ? "Lock Client for Time Limit :"
                  : "Unlock Client for Time Limit :"
              )}
            </label>
          </div>

          <div className="col-sm-3">
            <Input
              type="number"
              className="required-fields"
              name="txtTimeLimit"
              onInput={(e) => number(e, 2)}
              value={payload?.txtTimeLimit}
              disabled={payload?.UpdateTimeLimit ? false : true}
              onChange={handleSelectChange}
            />
          </div>

          <div className="col-sm-4">
            <SelectBox
              options={[
                { label: "Hours", value: "hours" },
                { label: "Days", value: "days" },
              ]}
              isDisabled={payload?.UpdateTimeLimit ? false : true}
              name="DaysHour"
              selectedValue={payload?.DaysHour}
              onChange={handleSelectChange}
            />
          </div>
        </div>
        <div className="row">
          <label className="col-sm-2">{t("Reason")} :</label>

          <div className="col-sm-10">
            <Input
              className="required-fields"
              type="text"
              name="Reason"
              onInput={(e) => number(e, 50)}
              value={payload?.Reason}
              onChange={handleSelectChange}
              disabled={payload?.UpdateTimeLimit ? false : true}
            />
          </div>
        </div>
        <div className="row">
          <label className="col-sm-2">{t("Last Reason")} :</label>

          <div className="col-sm-10">
            <Input
              className="form-control input-sm"
              type="text"
              name="LastReason"
              onInput={(e) => number(e, 50)}
              value={payload?.LastReason}
              onChange={handleSelectChange}
              disabled={payload?.UpdateTimeLimit ? false : true}
            />
          </div>
        </div>
        <div className="row">
          {loading ? (
            <Loading />
          ) : (
            <div className="col-sm-2">
              <button
                className="btn btn-block btn-sm btn-success"
                onClick={handleUpdate}
                disabled={payload?.UpdateTimeLimit ? false : true}
              >
                {t("Update")}
              </button>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};
export default LockReportModal;
