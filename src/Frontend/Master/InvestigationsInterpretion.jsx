import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import Accordion from "@app/components/UI/Accordion";
import Input from "../../components/formComponent/Input";
import { SelectBox } from "../../components/formComponent/SelectBox";
import FullTextEditor from "../../components/formComponent/TextEditor";
import Loading from "../../components/loader/Loading";

const InvestigationsInterpretion = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [CentreData, setCentreData] = useState([]);
  const [load, setLoad] = useState(false);
  const [Machine, setMachine] = useState([]);
  const [Editable, setEditable] = useState(false);
  const [Editor, setEditor] = useState("");
  const [isUpdateExist, setIsUpdateExist] = useState(false);
  const [payload, setPayload] = useState({
    CentreID: "",
    MacID: "",
    Interpretation: "",
    InvestigationID: state?.InvestigationID ? state?.InvestigationID : "",
    PrintInterPackage: "",
    UpdateExisting: 0,
  });

  const { t } = useTranslation();

  console.log(state);

  const fetch = (centre, mac) => {
    axiosInstance
      .post(state?.url, {
        CentreID: centre?.toString(),
        InvestigationID: payload?.InvestigationID,
        MacID: mac?.toString(),
      })
      .then((res) => {
        if (res?.data?.message.length === 0) {
          toast.success("No Data Found");
          setPayload({
            ...payload,
            CentreID: centre,
            MacID: mac,
            Interpretation: "",
            UpdateExisting: 0,
          });
          setEditor("");
          setEditable(true);
          setIsUpdateExist(true);
        } else {
          const data = res?.data?.message[0];
          setPayload({
            ...payload,
            CentreID: data?.CentreID,
            MacID: data?.MacID,
            Interpretation: data?.Interpretation,
            InvestigationID: data?.InvestigationID,
            PrintInterPackage: "",
          });
          setEditor(data?.Interpretation);
          setEditable(true);
          setIsUpdateExist(false);
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setIsUpdateExist(true); 
        setPayload({
          ...payload,
          UpdateExisting: 0, 
        });
      });
  };

  console.log(payload);

  const SaveInterpretion = () => {
    if (payload?.CentreID && payload?.MacID) {
      setLoad(true);
      axiosInstance
        .post("Investigations/SaveInterpretation", {
          ...payload,
          PrintInterPackage: payload?.PrintInterPackage?.toString(),
          UpdateExisting: payload?.UpdateExisting,
          CentreID: payload?.CentreID,
          MacID: payload?.MacID,
        })
        .then((res) => {
          if (res.data.message) {
            setLoad(false);
            toast.success(res.data.message);
            // navigate(-1);
          } else {
            toast.error("Something went wrong");
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setLoad(false);
          if (err?.response?.status === 504) {
            toast.error("Something went wrong");
          }
        });
    } else {
      toast.error("Please Choose Centre and Machine");
    }
  };

  const getMachine = () => {
    axiosInstance
      .get("Investigations/BindMachineList")
      .then((res) => {
        let data = res.data.message;
        let Machine = data.map((ele) => {
          return {
            value: ele.MachineId,
            label: ele.MachineName,
          };
        });
        setMachine(Machine);
      })
      .catch((err) => console.log(err));
  };

  const getAccessCentres = () => {
    axiosInstance
      .get("Centre/getAccessCentres")
      .then((res) => {
        let data = res.data.message;
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        setCentreData(CentreDataValue);
        getMachine();
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;

    name === "CentreID"
      ? fetch(value, payload?.MacID)
      : fetch(payload?.CentreID, value);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  useEffect(() => {
    setPayload({ ...payload, Interpretation: Editor });
  }, [Editor]);

  useEffect(() => {
    getAccessCentres();
  }, []);
  return (
    <>
      <Accordion
        name={"Investigations Interpretion"}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row pt-2 pl-2 pr-2">
          <div className="col-sm-2">
            <Input
              placeholder=" "
              lable="TestName"
              id="TestName"
              disabled={true}
              value={state?.data}
              name="TestName"
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={[{ label: "Select Centre", value: "" }, ...CentreData]}
              onChange={handleSelectChange}
              name="CentreID"
              id="Centre Name"
              lable="Centre Name"
              selectedValue={payload?.CentreID}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={[{ label: "Select Machine", value: "" }, ...Machine]}
              id="Machine"
              lable="Machine"
              onChange={handleSelectChange}
              name="MacID"
              selectedValue={payload?.MacID}
            />
          </div>
          <div className="col-sm-1 mt-1 d-flex">
            <div className="mt-1">
              <input
                name="PrintInterPackage"
                type="checkbox"
                checked={payload?.PrintInterPackage}
                onChange={handleChange}
              />
            </div>
            <label className="control-label ml-2">{t("For All Centre")}</label>
          </div>
          
          <div className="col-sm-2 mt-1 d-flex">
            <div className="mt-1">
              <input
                name="UpdateExisting"
                type="checkbox"
                checked={payload?.UpdateExisting}
                onChange={handleChange}
                id="UpdateExisting"
                disabled={isUpdateExist}
              />
            </div>
            <label className="control-label ml-2" htmlFor="UpdateExisting">{t("Update Existing")}</label>
          </div>
        </div>
        <div className="row pt-2 pl-2 pr-2">
          <div className="col-sm-12">
            <FullTextEditor
              value={payload?.Interpretation}
              setValue={setEditor}
              EditTable={Editable}
              setEditTable={setEditable}
            />
          </div>
        </div>
        <div className="row pt-2 pl-2 pr-2 pb-2">
          <div className="col-sm-1">
            {load ? (
              <Loading />
            ) : (
              <button
                className="btn btn-block btn-success btn-sm "
                onClick={SaveInterpretion}
              >
                {t("Save")}
              </button>
            )}
          </div>
          <div className="col-sm-1">
            {state?.flag ? (
              <Link
                to="/Investigations"
                state={{
                  other: {
                    button: "Update",
                    pageName: "Edit",
                    showButton: true,
                  },
                  url1: state?.url1,
                  url: "Investigations/UpdateInvestigation",
                }}
              >
                <span className="btn btn-block btn-primary btn-sm"> {t("Back")}</span>
              </Link>
            ) : (
              <button
                className="btn btn-block btn-primary btn-sm"
                onClick={() => navigate(-1)}
              > {t("Back")}
                
              </button>
            )}
          </div>
        </div>
      </Accordion>
    </>
  );
};

export default InvestigationsInterpretion;
