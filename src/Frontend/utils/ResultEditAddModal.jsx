import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import FullTextEditor from "../../components/formComponent/TextEditor";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { Dialog } from "primereact/dialog";

function ResultEditAddModal({ show, handleClose, handleSave }) {
  const [EditTable, setEditTable] = useState(true);
  const [EditData, setEditData] = useState(show?.data);
  const [SelectedBox, setSelectedBox] = useState([]);

  const { t } = useTranslation();

  // i18n end
  const getInvestigationsListData = () => {
    axiosInstance
      .post("InvestigationCommentMaster/getInvestigationCommentData", {
        InvestigationID: Array.isArray(show?.data?.labObservationID)
          ? show?.data?.labObservationID
          : [show?.data?.labObservationID],
        Template: "",
        TemplateText: "",
      })
      .then((res) => {
        if (res.status === 200) {
          setSelectedBox(res.data.message);
        }
        if (res?.data?.message.length === 0) {
          toast.success(t("No Data Found"));
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDropdown = (e) => {
    const { value } = e.target;
    setEditTable(true);
    setEditData({ ...EditData, COMMENT: value });
  };

  useEffect(() => {
    getInvestigationsListData();
  }, []);
  const theme = useLocalStorage("theme", "get");
  const handleChange = (data) => {
    setEditData({ ...EditData, COMMENT: data });
  };

  return (
    <Dialog visible={show} onHide={handleClose} className={theme}>
      <div className="">
        <div className="row mb-3">
          <label className="col-sm-2">{t("Select Comment")}:</label>
          <div className="col-sm-10 m-0 p-0 ">
            <select
              className="select-input-box form-control input-sm "
              onChange={handleDropdown}
            >
              <option>{t("Select")}</option>
              {SelectedBox?.map((ele) => (
                <option value={ele?.TemplateText}>{ele?.Template}</option>
              ))}
            </select>
          </div>
        </div>
        <FullTextEditor
          value={EditData?.COMMENT}
          EditTable={EditTable}
          setEditTable={setEditTable}
          setValue={handleChange}
        />
        <div className="row mt-2 mb-2">
          <div className="col-sm-6">
            <button
              type="button"
              className="btn btn-block btn-success btn-sm"
              onClick={() => handleSave(EditData, "AddComment")}
            >
              {t("Save")}
            </button>
          </div>
          <div className="col-sm-6">
            <button
              type="button"
              className="btn btn-block btn-danger btn-sm"
              onClick={handleClose}
            >
              {t("Close")}
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default ResultEditAddModal;
