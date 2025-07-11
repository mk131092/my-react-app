import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import { useTranslation } from "react-i18next";
import Heading from "../../components/UI/Heading";
import Accordion from "@app/components/UI/Accordion";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Input from "../../components/formComponent/Input";
import { isChecked } from "../util/Commonservices";
import Loading from "../../components/loader/Loading";
import ReactSelect from "../../components/formComponent/ReactSelect";

const CentrePanel = () => {
  const [t] = useTranslation();
  const [CentreData, setCentreData] = useState([]);
  const [ReferenceRate, setReferenceRate] = useState([]);
  const [Disable, setDisable] = useState(true);
  const [load, setLoad] = useState({
    ReferenceRateLoading: false,
    SaveLoad: false,
  });

  const [payload, setPayload] = useState({
    CentreID: "",
    CentreName: "",
    Data: [],
  });

  const handleChange = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const data = [...ReferenceRate];
      data[index][name] = checked;
      setReferenceRate(data);
    } else {
      const data = ReferenceRate.map((ele) => {
        return {
          ...ele,
          [name]: checked,
        };
      });
      setReferenceRate(data);
    }
  };

  useEffect(() => {
    if (CentreData.length > 0) {
      const name = CentreData.find((ele) => ele.value === payload?.CentreID);
      setPayload({ ...payload, CentreName: name?.label });
    }
  }, [payload?.CentreID, CentreData]);

  const saveData = () => {
    setLoad({ ...load, SaveLoad: true });
    const data = ReferenceRate.filter((ele) => ele.isChecked === true);
    const val = data.map((ele) => {
      return { RateTypeID: ele?.value, RateTypeName: ele?.label };
    });
    setPayload({ ...payload, Data: val });

    axiosInstance
      .post("CentreAccess/InsertCentreAccessData", {
        ...payload,
        Data: val,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setLoad({ ...load, SaveLoad: false });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoad({ ...load, SaveLoad: false });
      });
  };
  const getReferenceRate = (id) => {
    axiosInstance
      .get("CentreAccess/CentreAllRateTypeList")
      .then((res) => {
        let data = res.data.message;
        let CentreReferRate = data.map((ele) => {
          return {
            value: ele.RateTypeID,
            label: ele.RateTypeName,
            isChecked: false,
          };
        });
        setReferenceRate(CentreReferRate);
        fetch(CentreReferRate, id);
      })
      .catch((err) => console.log(err));
  };
  const handleSearchSelectChange =(label,value) =>{
    setPayload({...payload, [label]: String(value?.value)})
    fetch(ReferenceRate, value?.value);
  }



  const disable = () => {
    let disable = true;
    for (var i = 0; i < ReferenceRate.length; i++) {
      if (ReferenceRate[i].isChecked === true) {
        disable = false;
        break;
      }
    }
    setDisable(disable);
  };

  useEffect(() => {
    disable();
  }, [ReferenceRate]);

  const fetch = (mapdata, id) => {
    setLoad({ ...load, ReferenceRateLoading: true });
    axiosInstance
      .post("CentreAccess/GetCentreAccessData", {
        CentreID: id,
      })
      .then((res) => {
        const data = res?.data?.message;

        const val = [...mapdata];

        const haveIds = new Set(data.map(({ RateTypeId }) => RateTypeId));

        const result = val.map((ele) => {
          return {
            ...ele,
            isChecked: haveIds.has(ele?.value),
          };
        });
        setReferenceRate(result);
        setLoad({ ...load, ReferenceRate: false });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoad({ ...load, ReferenceRate: false });
      });
  };

  useEffect(() => {
    if (CentreData.length > 0) {
      getReferenceRate(CentreData[0]?.value);
    }
  }, [CentreData]);
  const getAccessCentres = (state, centreState, setCentreState) => {
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
        state(CentreDataValue);
        if (centreState) {
          setCentreState({
            CentreID: CentreDataValue[0]?.value,
            CentreName: CentreDataValue[0]?.label,
          });
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.sessionStorage.clear();
          window.location.href = "/login";
        }
      });
  };
  useEffect(() => {
    getAccessCentres(setCentreData, payload, setPayload);
  }, []);
  return (
    <>
      <Accordion
        name={t("Centre Panel")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row pt-2 pl-2 pr-2">
          <div className="col-sm-2">
          <ReactSelect
              dynamicOptions={CentreData}
              name="CentreID"
              lable={t("Centre ID")}
              id="CentreID"
              removeIsClearable={true}
              placeholderName={t("Centre ID")}
              value={payload?.CentreID}
              onChange={handleSearchSelectChange}
              className="required-fields"
            />
           
          </div>
          <div className="col-sm-2 d-flex align-items-center">
            <input
              type="checkbox"
              name="isChecked"
              checked={
                ReferenceRate?.length > 0
                  ? isChecked("isChecked", ReferenceRate, true).includes(false)
                    ? false
                    : true
                  : false
              }
              onChange={(e) => handleChange(e)}
            />
            <label className="col-sm-10">{t("Select all")}</label>
          </div>
        </div>
      </Accordion>
      <Accordion
        title={t("Tag Rate Type To Selected Centre")}
        defaultValue={true}
      >
        <div className="row px-2 mt-2 mb-2">
          <div className="col-12">
            {load?.ReferenceRateLoading ? (
              <div className="d-flex align-items-center justify-content-center">
                <Loading />
              </div>
            ) : (
              <div
                className="row"
                style={{
                  maxHeight: "50vh",
                  overflow: "auto",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
                }}
              >
                {ReferenceRate.map((ele, index) => (
                  <div
                    key={index}
                    className="col-sm-3 d-flex justify-content-between mt-2 pr-4"
                    style={{ boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)" }}
                  >
                    <span className="">{ele.label}</span>
                    <input
                      type="checkbox"
                      className="mb-3"
                      checked={ele?.isChecked}
                      name="isChecked"
                      onChange={(e) => handleChange(e, index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {load?.SaveLoad ? (
          <Loading />
        ) : (
          <div className="col-sm-1 ml-2 mb-2">
            <button
              type="submit"
              className="btn btn-success btn-sm btn-block mt-3"
              onClick={saveData}
              disabled={Disable}
            >
              {t("Save")}
            </button>{" "}
          </div>
        )}
      </Accordion>
    </>
  );
};

export default CentrePanel;
