import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import { useTranslation } from "react-i18next";
import { validationForMachineMaster } from "../../utils/Schema";
import Accordion from "@app/components/UI/Accordion";
import Input from "../../components/formComponent/Input";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";
import { SelectBox } from "../../components/formComponent/SelectBox";

const MachineMaster = () => {
  const [centreId, setCentreId] = useState([]);
  const [GlobalMachineID, setGlobalMachineID] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [err, setErr] = useState({});
  const [payload, setPayload] = useState({
    MachineID: "",
    MachineName: "",
    CentreID: "",
    GlobalMachineID: "",
    BatchRequest: 0,
    ITDKEY: "",
  });
  const { t } = useTranslation();

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value, ItemValue: "" });
    setErr({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const getGlobalMachineGroup = () => {
    axiosInstance
      .post("MachineGroup/macGroup")
      .then((res) => {
        let data = res?.data?.message;
        let CentreDataValue = data?.map((ele) => {
          return {
            value: ele.GlobalMachineID,
            label: ele.GlobalMachineName,
          };
        });
        setGlobalMachineID(CentreDataValue);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAccessCentres = (state, centre, setCentre) => {
    axiosInstance
      .get("Centre/getAccessCentres")
      .then((res) => {
        let data = res.data.message;
        console.log(data);
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        CentreDataValue.unshift({ label: "Select Centre", value: "" });
        state(CentreDataValue);
        if (centre) {
          setCentre({ ...centre, CentreID: CentreDataValue[0]?.value });
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.sessionStorage.clear();
          window.localStorage.clear();
          window.location.href = "/login";
        }
      });
  };

  const handleSave = () => {
    let generatedError = validationForMachineMaster(payload);
    console.log(generatedError);
    if (generatedError === "") {
      setLoading(true);
      axiosInstance
        .post("MachineGroup/InsertMachineData", payload)
        .then((res) => {
          toast.success(res?.data?.message);
          setPayload({
            MachineID: "",
            MachineName: "",
            CentreID: "",
            GlobalMachineID: "",
            BatchRequest: 0,
            ITDKEY: "",
          });
          setLoading(false);
          fetch();
          setIsUpdate(false);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          );
          setLoading(false);
        });
    } else {
      setErr(generatedError);
    }
  };

  const fetch = () => {
    setLoading(true);
    axiosInstance
      .post("MachineGroup/LoadMachineMasterData")
      .then((res) => {
        setTableData(res?.data?.message);
        setLoading(false);
      })
      .catch((err) => {
        
        setTableData([]);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
        setLoading(false);
      });
  };

  const BindData = (data) => {
    setIsUpdate(true);
    setPayload({
      ITDKEY: data?.ITDKEY,
      MachineID: data?.MachineID,
      MachineName: data?.MachineName,
      CentreID: data?.CentreID,
      GlobalMachineID: data?.GlobalMachineID,
      BatchRequest: data?.BatchRequest,
    });
  };

  useEffect(() => {
    getAccessCentres(setCentreId);
    getGlobalMachineGroup();
    fetch();
  }, []);
  return (
    <>
      <Accordion
        name={t("Machine Master")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <>
          <div className="row  pt-2 pl-2 pr-2">
            <div className="col-sm-2">
              <Input
                placeholder=""
                name="MachineID"
                id="MachineID"
                className="required-fields"
                value={payload?.MachineID}
                onChange={handleChange}
                max={30}
                required
                disabled={isUpdate ? true : false}
                lable={t("MachineID")}
              />
              {payload.MachineID === "" && (
                <div className="error-message">{err?.MachineID}</div>
              )}
            </div>
            <div className="col-sm-2">
              <Input
                placeholder=""
                type="text"
                name="MachineName"
                className="required-fields"
                id="MachineName"
                value={payload?.MachineName}
                onChange={handleChange}
                max={35}
                required
                disabled={isUpdate ? true : false}
                lable={t("Machine Name")}
              />
              {payload.MachineName === "" && (
                <div className="error-message">{err?.MachineName}</div>
              )}
            </div>
            <div className="col-sm-2">
              <SelectBox
                name="CentreID"
                id="CentreID"
                options={centreId}
                className="required-fields"
                selectedValue={payload?.CentreID}
                onChange={handleSelectChange}
                lable={t("Centre")}
              />
              {payload.CentreID === "" && (
                <div className="error-message">{err?.CentreID}</div>
              )}
            </div>
            <div className="col-sm-2">
              <SelectBox
                name="GlobalMachineID"
                className="required-fields"
                id="GlobalMachineID"
                options={[
                  { label: "GlobalMachineID", value: "" },
                  ...GlobalMachineID,
                ]}
                selectedValue={payload?.GlobalMachineID}
                onChange={handleSelectChange}
                lable={t("GlobalMachine")}
              />
              {payload.GlobalMachineID === "" && (
                <div className="error-message">{err?.GlobalMachineID}</div>
              )}
            </div>
            <div className="col-sm-1">
              <Input
                type="text"
                value={payload?.ITDKEY}
                className="required-fields"
               
                name="ITDKEY"
                id="ITDKEY"
                placeholder=""
                onChange={handleChange}
                lable={t("ITDKEY")}
              />
              {payload.ITDKEY === "" && (
                <div className="error-message">{err?.ITDKEY}</div>
              )}
            </div>
            <div className="col-sm-1 d-flex align-items-center">
              <input
                type="checkbox"
                id="checkbox"
                name="BatchRequest"
                checked={payload?.BatchRequest == "1" ? true : false}
                onChange={handleChange}
              />&nbsp;
              <label>{t("BatchRequest")}</label>
            </div>
            <div className="col-sm-1">
              {loading ? (
                <Loading />
              ) : (
                <>
                  {isUpdate ? (
                    <button
                      type="button"
                      className="btn btn-block btn-success btn-sm"
                      id="btnSave"
                      onClick={() => handleSave()}
                    >
                      {t("Update")}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-block btn-success btn-sm"
                      id="btnSave"
                      onClick={() => handleSave()}
                    >
                      {t("Save")}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <>
              {tableData?.length > 0 && (
                <div className="mt-2">
                  <Tables>
                    <thead className="cf">
                      <tr>
                        <th>{t("S.No")}</th>
                        <th>{t("MachineID")}</th>
                        <th>{t("Machine Name")}</th>
                        <th>{t("Centre")}</th>
                        <th>{t("Batch Request")}</th>
                        <th>{t("GlobalMachine")}</th>
                        <th>{t("ITDKEY")}</th>
                        <th>{t("Select")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData?.map((ele, index) => (
                        <tr key={index}>
                          <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                          <td data-title={t("MachineID")}>
                            {ele?.MachineID}&nbsp;
                          </td>
                          <td data-title={t("Machine Name")}>
                            {ele?.MachineName}&nbsp;
                          </td>
                          <td data-title={t("Centre")}>
                            {ele?.Centre}&nbsp;
                          </td>
                          <td data-title={t("Batch Request")}>
                            {ele?.BatchRequest === 1 ? t("Yes") : t("No")}&nbsp;
                          </td>
                          <td data-title={t("GlobalMachineID")}>
                            {ele?.GlobalMachineName}&nbsp;
                          </td>
                          <td data-title={t("ITDKEY")}>{ele?.ITDKEY}&nbsp;</td>
                          <td
                            data-title={t("Action")}
                            className="text-info"
                            style={{
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                            onClick={() => BindData(ele)}
                          >
                            {t("Select")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Tables>
                </div>
              )}
            </>
          )}
        </>
      </Accordion>
    </>
  );
};

export default MachineMaster;
