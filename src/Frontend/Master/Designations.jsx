import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { useTranslation } from "react-i18next";
import DesignationModal from "../utils/DesignationModal";
import Accordion from "@app/components/UI/Accordion";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";
import { Link } from "react-router-dom";
import { dateConfig } from "../../utils/helpers";
import { toast } from "react-toastify";

const Designations = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState({
    modal: false,
    id: "",
    name: "",
  });
  const { t } = useTranslation();
  const getDesignationData = () => {
    axiosInstance
      .get("Designation/getDesignationData")
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleCheckboxChange = (_, designation) => {
    setLoading(true);
    const updatedCheckboxValue = designation.reportopen == 1 ? 0 : 1;

    const updatedPayload = {
      Name: designation.DesignationName,
      SequenceNo: designation.SequenceNo,
      IsDirectApprove: designation.IsDirectApprove.toString(),
      IsNewTestApprove: designation.IsNewTestApprove.toString(),
      IsSales:
        designation.IsSales !== undefined ? designation.IsSales.toString() : "",
      IsShowSpecialRate: designation.IsShowSpecialRate.toString(),
      isActive: designation.isActive.toString(),
      DesignationID: designation.DesignationID,
      RecEdit: 0,
      EditInfo: 0,
      reportopen: updatedCheckboxValue,
    };

    axiosInstance
      .post("Designation/UpdateDesignationData", updatedPayload)
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          getDesignationData();
          toast.success(res?.data?.message);
        } else {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          );
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  const handleCloseModal = () => {
    setShow({
      modal: false,
      id: "",
      name: "",
    });
  };

  useEffect(() => {
    getDesignationData();
  }, []);
  return (
    <>
      {show?.modal && (
        <DesignationModal show={show} onHandleClose={handleCloseModal} />
      )}
      <Accordion
        name={t("Designations")}
        isBreadcrumb={true}
        defaultValue={true}
        linkTo="/DesignationsCreate"
        linkTitle={t("Create New")}
        state={{
          url: "Designation/InsertDesignationData",
        }}
      >
        <div className="row px-2 mt-2 mb-2">
          <div className="col-12">
            {loading ? (
              <Loading />
            ) : (
              <>
                {loading ? (
                  <Loading />
                ) : (
                  <Tables>
                    <thead className="cf">
                      <tr>
                        <th>{t("S.No")}</th>
                        <th>{t("Designation Name")}</th>
                        <th>{t("View Rights")}</th>
                        <th>{t("Sequence No")}</th>
                        <th>{t("Date Of Creation")}</th>
                        <th>{t("Date Of Updation")}</th>
                        <th>{t("New Test Approve")}</th>
                        <th>{t("ShowSpecialRate")}</th>
                        <th>{t("Active Status")}</th>
                        <th>{t("Direct Approve")}</th>
                        <th>{t("IsReportOpen")}</th>
                        <th>{t("Action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.map((data, i) => (
                        <tr key={i}>
                          <td data-title={t("S.No")}>{i + 1}</td>
                          <td data-title={t("Designation Name")}>
                            {data?.DesignationName}
                          </td>
                          <td data-title={t("View Rights")}>
                            <a
                              title="Page Rights"
                              className="fa fa-search coloricon"
                              onClick={() => {
                                setShow({
                                  modal: true,
                                  id: data?.DesignationID,
                                  name: data?.DesignationName,
                                });
                              }}
                            ></a>
                          </td>

                          <td data-title={t("Sequence No")}>
                            {data?.SequenceNo}
                          </td>
                          <td data-title={t("Date Of Creation")}>
                            {dateConfig(data?.dtEntry)}
                          </td>
                          <td data-title={t("Date Of Updation")}>
                            {data?.dtUpdate !== "0000-00-00 00:00:00"
                              ? dateConfig(data?.dtUpdate)
                              : "-"}
                          </td>
                          <td data-title={t("New Test Approve")}>
                            {data?.NewTestApproves}
                          </td>
                          <td data-title={t("ShowSpecialRate")}>
                            {data?.ShowSpecialRate}
                          </td>
                          <td data-title={t("Active Status")}>
                            {data?.ActiveStatus}
                          </td>
                          <td data-title={t("Direct Approve")}>
                            {data?.DirectApprove}
                          </td>
                          <td data-title={t("IsReportOpen")}>
                            <label
                              className="switch"
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <input
                                name="IsReportOpen"
                                type="checkbox"
                                checked={data?.reportopen}
                                onChange={(e) => handleCheckboxChange(e, data)}
                              />{" "}
                              <span className="slider round2"></span>
                            </label>
                          </td>
                          <td data-title={t("Action")}>
                            <Link
                              state={{
                                data: data,
                                other: { button: "Update" },
                                url: "Designation/UpdateDesignationData",
                              }}
                              to="/DesignationsCreate"
                            >
                              {t("Edit")}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Tables>
                )}
              </>
            )}
          </div>
        </div>
      </Accordion>
    </>
  );
};

export default Designations;
