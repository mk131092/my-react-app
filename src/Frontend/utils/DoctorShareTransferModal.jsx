import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import { Dialog } from "primereact/dialog";
import { SelectBox } from "../../components/formComponent/SelectBox";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { useTranslation } from "react-i18next";

const DoctorShareTransferModal = ({ show, handleClose }) => {
    const { t } = useTranslation();
  const [DoctorData, setDoctorData] = useState([]);

  const [state, setState] = useState({
    FromDoctorID: "",
    ToDoctorID: "",
  });
  const handleSelectChange = (event) => {
    const { name, value } = event?.target;
    if (name == "FromDoctorID") {
      setState({
        ...state,
        [name]: String(value),
        ToDoctorID: value == state?.ToDoctorID ? "" : state?.ToDoctorID,
      });
    } else
      setState({
        ...state,
        [name]: String(value),
      });
  };
  console.log(DoctorData, state);
  const postApi = () => {
    if (state?.FromDoctorID && state?.ToDoctorID) {
      axiosInstance
        .post("DocShareMaster/transferDocShare", {
          FromDoctorID: state?.FromDoctorID,
          ToDoctorID: state?.ToDoctorID,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setState({
            FromDoctorID: "",
            ToDoctorID: "",
          });
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "SomeThing Went Wrong"
          );
        });
    } else {
      toast.error("Please Choose FromDoctorID and ToDoctorID");
    }
  };

  const BindDoctorData = () => {
    axiosInstance
      .post("DoctorReferal/getDoctorDataBind")
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            label: ele?.DoctorName,
            value: ele?.DoctorID,
          };
        });
        setDoctorData(val);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "SomeThing Went Wrong"
        );
      });
  };

  useEffect(() => {
    BindDoctorData();
  }, []);

  const theme = useLocalStorage("theme", "get");

  return (
    <>
      <Dialog
        header={t("Doctor Share Transfer")}
        visible={show}
        onHide={() => {
          handleClose();
        }}
        draggable={false}
        className={theme}
        style={{ width: "500px" }}
      >
        <div className="row">
          <div className="col-sm-6">
            <SelectBox
              options={[
                { label: "Select From Doctor", value: "" },
                ...DoctorData,
              ]}
              onChange={handleSelectChange}
              name={"FromDoctorID"}
              is="FromDoctorID"
              lable="From Doctor"
              selectedValue={state?.FromDoctorID}
            />
          </div>
          <div className="col-sm-6">
            <SelectBox
              options={[
                { label: "Select To Doctor", value: "" },
                ...(state?.FromDoctorID
                  ? DoctorData.filter((ele) => ele.value != state?.FromDoctorID)
                  : DoctorData),
              ]}
              onChange={handleSelectChange}
              name={"ToDoctorID"}
              id="ToDoctorID"
              lable="To Doctor"
              selectedValue={state?.ToDoctorID}
              className="required"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-2">
            <button
              className="btn btn-block btn-success btn-sm"
              onClick={postApi}
            >
              Save
            </button>
          </div>
          <div className="col-sm-2">
            <button
              className="btn btn-block btn-danger btn-sm"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DoctorShareTransferModal;
