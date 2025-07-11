import axios from "axios";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dialog } from "primereact/dialog";
import Tables from "../../components/UI/customTable";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import Loading from "../../components/loader/Loading";
import { axiosInstance } from "../../utils/axiosInstance";

function TestNameModal({ show, onHandleShow, id, LTData }) {
  const [tableData, setTableData] = useState([]);
  const isMobile = window.innerWidth <= 768;
  const { t } = useTranslation();
  const theme = useLocalStorage("theme", "get");

  const fetch = () => {
    axiosInstance
      .post("PatientRegistration/GetTestInfo", {
        InvestigationId: id,
      })
      .then((res) => {
        setTableData(res?.data?.message);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetch();
  }, [id]);

  return tableData?.length > 0 ? (
    <>
      <Dialog
        header={t("Investigation Information")}
        style={{ width: isMobile ? "80vw" : "50vw" }}
        className={theme}
        visible={show}
        top={"10%"}
        onHide={onHandleShow}
      >
        <Tables>
          <thead className="cf">
            <tr>
              <th>{t("Investigation Name")}</th>
              <th>{t("Test Name")}</th>
              <th>{t("Test/Profile")}</th>
              <th>{t("Department")}</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.map((data, index) => (
              <tr key={index}>
                <td data-title={t("Investigation Name")}>{data?.TestName}</td>
                <td data-title={t("Test Name")}>{data?.TestName}&nbsp;</td>
                <td data-title={t("Test/Profile")}>{data?.DataType}&nbsp;</td>
                <td data-title={t("Department")}>{data?.Department}&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </Tables>
        <div className="row mt-2">
          <div className="col-sm-3">
            <button
              type="button"
              className="btn btn-block btn-danger btn-sm"
              onClick={onHandleShow}
            >
              {t("Close")}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  ) : (
    <Loading />
  );
}

export default TestNameModal;
