import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../components/formComponent/Input";
import { SelectBox } from "../../components/formComponent/SelectBox";
import { RoundUpTo } from "../../utils/Constants";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { Dialog } from "primereact/dialog";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";

import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";
const MachineParamModal = ({
  show,
  handleClose,
  data,
  active,
  onclickmachinedata,
  bindlabobservationdata,
}) => {
  console.log(data, active);
  const [payload, setPayload] = useState({
    Machine_ParamID: data?.Machine_ParamID ? data?.Machine_ParamID : "",
    MACHINEID: data?.Machineparam ?? "",
    MachineParam: "",
    Suffix: "",
    AssayNo: "",
    RoundUpTo: (data?.RoundUpTo ?? 0).toString(),
    IsOrderable: data?.IsOrderable == "FALSE" ? 0 : 1,
    Decimalcalc: data?.Decimalcalc ?? "",
    IsRound: data?.IsRound == "1" ? 1 : 0,
  });

  const { t, i18n } = useTranslation();
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleSubmit = (url) => {
    axiosInstance
      .post(url, payload)
      .then((res) => {
        handleClose()
        toast.success(res?.data?.message);
        onclickmachinedata(active, true);
        bindlabobservationdata(data?.Machine_ParamID);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const isMobile = window.innerWidth <= 768;
  const theme = useLocalStorage("theme", "get");
  return (
    <>
      <Dialog
        header={t("Machine Param Basic Information")}
        onHide={() => {
          handleClose();
        }}
        className={theme}
        visible={show}
        style={{
          width: isMobile ? "80vw" : "50vw",
        }}
      >
        <Tables>
          <tbody>
            <tr>
              <td className="py-2">
                <label for="usr">{t("MachineID")}:</label>
              </td>
              <td className="py-2">
                <Input
                  name="MACHINEID"
                  id="MACHINEID"
                  type="text"
                  onChange={handleChange}
                  className="select-input-box form-control input-sm"
                  readonly="readonly"
                  disabled={data?.isId ? true : false}
                  value={payload?.MACHINEID}
                />
              </td>
            </tr>
            <tr>
              <td className="py-2">
                <label for="usr">{t("Machine_ParamID")}:</label>
              </td>
              <td className="py-2">
                <Input
                  name="Machine_ParamID"
                  type="text"
                  onChange={handleChange}
                  className="select-input-box form-control input-sm"
                  // disabled={data?.isEnable ? true : false}
                  value={payload?.Machine_ParamID}
                  readonly={payload?.Machine_ParamID ? true : false}
                />
              </td>
            </tr>
            <tr>
              <td className="py-2">
                <label for="usr">{t("Param Alias")}:</label>
              </td>
              <td className="py-2">
                <Input
                  name="MachineParam"
                  type="text"
                  value={payload?.MachineParam}
                  onChange={handleChange}
                  className="select-input-box form-control input-sm"
                />
              </td>
            </tr>
            <tr>
              <td className="py-2">
                <label for="usr">{t("Suffix")}:</label>
              </td>
              <td className="py-2">
                <Input
                  name="Suffix"
                  type="text"
                  value={payload?.Suffix}
                  onChange={handleChange}
                  className="select-input-box form-control input-sm"
                />
              </td>
            </tr>
            <tr>
              <td className="py-2">
                <label for="usr">{t("Assay No")}:</label>
              </td>
              <td className="py-2">
                <Input
                  name="AssayNo"
                  type="text"
                  value={payload?.AssayNo}
                  onChange={handleChange}
                  className="select-input-box form-control input-sm"
                />
              </td>
            </tr>

            <tr>
              <td className="py-2">
                <label for="usr">{t("isOrderable")}:</label>
              </td>
              <td className="py-2">
                <Input
                  name="IsOrderable"
                  type="checkbox"
                  checked={payload?.IsOrderable}
                  onChange={handleChange}
                />
              </td>
            </tr>

            <tr>
              <td className="py-2">
                <label for="usr">{t("Multiple")}:</label>
              </td>
              <td className="py-2">
                <Input
                  name="Decimalcalc"
                  type="text"
                  onChange={handleChange}
                  className="select-input-box form-control input-sm"
                  value={payload?.Decimalcalc}
                />
              </td>
            </tr>
            <tr>
              <td className="py-2">
                <label for="usr">{t("RoundUpTo")}:</label>
              </td>
              <td className="py-2">
                <SelectBox
                  name="RoundUpTo"
                  options={RoundUpTo}
                  onChange={handleChange}
                  className="select-input-box form-control input-sm"
                  selectedValue={payload?.RoundUpTo}
                />
              </td>
            </tr>
            <tr>
              <td className="py-2">
                <label for="usr">{t("IsRound")}:</label>
              </td>
              <td className="py-2">
                <Input
                  name="IsRound"
                  type="checkbox"
                  checked={payload?.IsRound}
                  onChange={handleChange}
                />
              </td>
            </tr>
          </tbody>
        </Tables>

        <div className="row mt-2 mb-1">
          {data?.Machine_ParamID ? (
            <div className="col-sm-3">
              <button
                className="btn  btn-primary btn-sm"
                onClick={() => handleSubmit("MachineGroup/UpdateParam")}
              >
                {t("Update & Close")}
              </button>
            </div>
          ) : (
            <div className="col-sm-3">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleSubmit("MachineGroup/AddParam")}
              >
                {t("Set & Close")}
              </button>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};

export default MachineParamModal;
