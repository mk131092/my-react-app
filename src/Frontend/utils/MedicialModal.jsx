import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { useTranslation } from "react-i18next";
import { GetMedicalHistoryData } from "../../utils/NetworkApi/commonApi";
import { dateConfig } from "../../utils/helpers";
import { axiosInstance } from "../../utils/axiosInstance";
import { useLocalStorage } from "@app/utils/hooks/useLocalStorage";
import { toast } from "react-toastify";
import moment from "moment";
import Loading from "../../components/loader/Loading";

const MedicialModal = ({
  MedicalId,
  ID,
  handleUploadCount,
  handleClose,
  show,
}) => {
  const { t } = useTranslation();
  const [history, setHistory] = useState("");
  const [load, setLoad] = useState(false);
  const [data, setData] = useState({
    PatientGuid: MedicalId,
    LedgerTransactionID: ID ? ID : 0,
    patientmedicalhistoryiesVM: [],
  });

  const theme = useLocalStorage("theme", "get");
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    setData({ ...data, PatientGuid: MedicalId });
  }, [MedicalId]);

  useEffect(() => {
    GetMedicalHistoryData(MedicalId, setData, data, ID, handleUploadCount);
  }, []);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const val = [...data.patientmedicalhistoryiesVM];
    val[index][name] = value;
    setData({ ...data, patientmedicalhistoryiesVM: val });
  };

  const handleDelete = (index) => {
    const val = data.patientmedicalhistoryiesVM.filter(
      (ele, idx) => idx !== index
    );
    setLoad(true);
    axiosInstance
      .post("PatientRegistration/Deletemedicalhistorydata", {
        PatientMedicalHistoryID:
          data.patientmedicalhistoryiesVM[index]?.PatientMedicalHistoryID,
      })
      .then((res) => {
        setLoad(false);
        GetMedicalHistoryData(MedicalId, setData, data, ID, handleUploadCount);
        toast.success(t("Successfully Deleted"));
      })
      .catch((err) => {
        setLoad(false);
        toast.error(err?.response?.data?.message);
      });
  };
  console.log(data);
  const handleUpload = (updatedData) => {
    if (history !== "") {
      axiosInstance
        .post("PatientRegistration/UploadMedicalHistory", updatedData)
        .then(() => {
          setHistory("");
          GetMedicalHistoryData(
            MedicalId,
            setData,
            updatedData,
            ID ? ID : 1,
            handleUploadCount
          );
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || t("Error Occurred"));
        });
    } else {
      toast.error(t("Please Enter Value"));
    }
  };

  const handleAdd = () => {
    if (history !== "") {
      const updateDetails = {
        MedicalHistory: history,
        LedgerTransactionID: 0,
        PatientMedicalHistoryID: "",
        date: moment(new Date())
          .utcOffset("+05:30")
          .format("YYYY-MM-DDTHH:mm:ss"),
      };
      const updatedData = { ...data };
      updatedData.patientmedicalhistoryiesVM.push(updateDetails);
      setData(updatedData);
      handleUpload(updatedData);
    } else {
      toast.error(t("Please Enter Any Value"));
    }
  };

  return (
    <Dialog
      header={t("Medical History")}
      visible={show}
      onHide={handleClose}
      draggable={false}
      className={theme}
      //   footer={footerContent}
    >
      <Divider className={`custom-divider-header ${theme}`} />
      <div className="medical-modal">
        <div
          className="col-md-6 d-flex"
          style={{ flexDirection: "column", width: "40%" }}
        >
         <label htmlFor="medicalHistory">{t("New Medical History")}</label>
          <textarea
            className="p-1"
            id="medicalHistory"
            rows="4"
            cols="50"
            placeholder={t("Enter medical history...")}
            style={{ height: "150px" }}
            value={history}
            name="MedicalHistory"
            max={200}
            onChange={(e) => setHistory(e.target.value)}
          ></textarea>
          <div className="col-sm-5 m-0 mt-2 p-0">
            {load ? (
              <Loading />
            ) : (
              <button className="btn btn-success" onClick={handleAdd}>
                 {t("Create New")}
              </button>
            )}
          </div>
        </div>
        <div
          className="d-flex"
          style={{ flexDirection: "column", width: "48%" }}
        >
       <label htmlFor="allergies">{t("Previous Medical History")}</label>
          {data.patientmedicalhistoryiesVM.length > 0 ? (
            <div
              className="d-flex"
              style={{
                flexDirection: "column",
                width: "100%",
                height: "240px",
                overflowX: "auto",
                padding: "5px",
              }}
            >
              {data.patientmedicalhistoryiesVM.map((ele, index) => (
                <MedicalHistorySpan
                  key={index}
                  data={ele}
                  index={index}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <label>{t("No Medical History")}</label>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default MedicialModal;

function MedicalHistorySpan({ data, index, handleDelete }) {
  
  const { t } = useTranslation();
  return (
    <div
      className="d-flex w-100 simple-box-container mt-2"
      style={{ flexDirection: "column" }}
    >
      <div className="d-flex justify-content-between">
        <span className="col-sm-7 small">{dateConfig(data?.date)}</span>
        <i
          className="fa fa-trash pointer pr-1 pt-1"
          title={t("Remove this medical History")}
          style={{ fontSize: "0.9rem", color: "inherit" }}
          onClick={() => handleDelete(index)}
        ></i>
      </div>
      <span className="col-sm-12">{data?.MedicalHistory}</span>
    </div>
  );
}
