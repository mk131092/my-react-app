import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import {
  AllowCharactersNumbersAndSpecialChars,
  dateConfig,
  getTrimmedData,
} from "../../utils/helpers";
import { validation } from "../../utils/Schema";
import { toast } from "react-toastify";
import Heading from "../../components/UI/Heading";
import Accordion from "@app/components/UI/Accordion";
import Input from "../../components/formComponent/Input";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";

const Departments = () => {
  const [loading, setLoading] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [err, setErr] = useState({});
  const [formData, setFormData] = useState({
    Department: "",
    DepartmentID:0,
    DepartmentCode: "",
    isActive: 1,
    isMembershipcard: 0,
    isPackage: 0,
    Microbiology: 0,
    radiology: 0,
    IsHisto:0,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (
      ["isMembershipcard", "isPackage", "Microbiology", "radiology","IsHisto"].includes(
        name
      )
    ) {
      setFormData({
        ...formData,
        [name]: checked ? 1 : 0,
      });
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: AllowCharactersNumbersAndSpecialChars(value)
          ? value
          : formData[name],
      });
    }
  };

  const { t } = useTranslation();
  const postData = () => {
    let generatedError = validation(formData);
    if (generatedError === "") {
      setLoading(true);
      axiosInstance
        .post("Department/InsertDepartmentData", getTrimmedData({...formData,isActive:formData?.isActive?true:false}))
        .then((res) => {
          if (res.data.message) {
            setFormData({
              Department: "",
              DepartmentCode: "",
              isActive: 1,
              DepartmentID: 0,
              isMembershipcard: 0,
              isPackage: 0,
              Microbiology: 0,
              radiology: 0,
              IsHisto:0
            });
            setLoading(false);
            getTableData();
            setErr({});
            toast.success(res.data.message);
          } else {
            toast.error("Something went wrong");
            setLoading(false);
          }
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoading(false);
        });
    } else {
      setErr(generatedError);
      setLoading(false);
    }
  };
  const EditData = (data) => {
    console.log(data);
    setFormData({
      Department: data?.Department,
      DepartmentCode: data?.DepartmentCode,
      isActive: data?.Status == "Active" ? 1 : 0,
      DepartmentID: data?.DepartmentID,
      isMembershipcard: data?.isMembershipcard,
      isPackage: data?.isPackage,
      Microbiology: data?.Microbiology,
      radiology: data?.Radiology,
      IsHisto:data?.IsHisto
    });
  };
  const getTableData = () => {
    axiosInstance
      .get("Department/getDepartmentData")
      .then((res) => {
        setTableData(res.data.message);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getTableData();
  }, []);
  return (
    <>
      <Accordion
        name={t("Departments")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row pt-2 pl-2 pr-2">
          <div className="col-sm-2">
            <Input
              className="required-fields"
              name="DepartmentCode"
              lable="Department Code"
              id="Department Code"
              placeholder=" "
              value={formData?.DepartmentCode}
              onChange={handleChange}
            />
            {formData?.DepartmentCode.trim() === "" && (
              <span className="error-message">{err?.DepartmentCode}</span>
            )}
            {formData?.DepartmentCode.trim().length > 0 &&
              formData?.DepartmentCode.trim().length < 2 && (
                <span className="error-message">{err?.DepartmentCodes}</span>
              )}
          </div>
          <div className="col-sm-2">
            <Input
              className="required-fields"
              name="Department"
              lable="Department Name"
              id="Department Name"
              placeholder=" "
              value={formData?.Department}
              onChange={handleChange}
            />
            {formData?.Department.trim() === "" && (
              <span className="error-message">{err?.Department}</span>
            )}
            {formData?.Department.trim().length > 0 &&
              formData?.Department.trim().length < 2 && (
                <span className="error-message">{err?.Department}</span>
              )}
          </div>
          <div className="col-sm-1 mt-1 d-flex">
            <div className="mt-1">
              <input
                name="isActive"
                type="checkbox"
                checked={formData?.isActive}
                onChange={handleChange}
              />
            </div>
            <label className="col-sm-10">{t("Active")}</label>
          </div>
          <div className="col-sm-1 mt-1 d-flex">
            <div className="mt-1">
              <input
                name="isPackage"
                type="checkbox"
                checked={formData?.isPackage == 0 ? false : true}
                onChange={handleChange}
              />
            </div>
            <label className="col-sm-10">{t("IsPackage")}</label>
          </div>
          <div className="col-sm-1 mt-1 d-flex">
            <div className="mt-1">
              <input
                name="isMembershipcard"
                type="checkbox"
                checked={formData?.isMembershipcard == 0 ? false : true}
                onChange={handleChange}
              />
            </div>
            <label className="col-sm-10">{t("Membership")}</label>
          </div>
          <div className="col-sm-1 mt-1 d-flex">
            <div className="mt-1">
              <input
                name="Microbiology"
                type="checkbox"
                checked={formData?.Microbiology == 0 ? false : true}
                onChange={handleChange}
              />
            </div>
            <label className="col-sm-10">{t("IsMicroBio.")}</label>
          </div>
          <div className="col-sm-1 mt-1 d-flex">
            <div className="mt-1">
              <input
                name="radiology"
                type="checkbox"
                checked={formData?.radiology == 0 ? false : true}
                onChange={handleChange}
              />
            </div>
            <label className="col-sm-12">{t("IsRadiology")}</label>
          </div>
          {/* <div className="col-sm-1 mt-1 d-flex">
            <div className="mt-1">
              <input
                name="IsHisto"
                type="checkbox"
                checked={formData?.IsHisto == 0 ? false : true}
                onChange={handleChange}
              />
            </div>
            <label className="col-sm-10">{t("IsHisto")}</label>
          </div> */}
          <div className="col-sm-1">
            {loading ? (
              <Loading />
            ) : (
              <>
                {}
                <button
                  type="button"
                  className={`btn ${
                    formData?.DepartmentID ? "btn-warning" : "btn-info"
                  } btn-block  btn-sm`}
                  id="btnSave"
                  onClick={postData}
                >
                  {formData?.DepartmentID ? t("Update") : t("Create")}
                </button>
              </>
            )}
          </div>
          <div className="col-sm-1">
            {loading ? (
              <Loading />
            ) : (
              <>
                {}
                <button
                  type="button"
                  className="btn btn-danger btn-block  btn-sm"
                  id="btnSave"
                  onClick={() => {
                    setFormData({
                      Department: "",
                      DepartmentCode: "",
                      isActive: 1,
                      DepartmentID: 0,
                      isMembershipcard: 0,
                      isPackage: 0,
                      Microbiology: 0,
                      radiology: 0,
                    });
                    setErr({});
                  }}
                >
                  {t("Reset")}
                </button>
              </>
            )}
          </div>
        </div>
      </Accordion>
      <Accordion title={t("Search Data")} defaultValue={true}>
        <div className="row px-2 mt-2 mb-2">
          <div className="col-12">
            <Tables data={tableData ?? []}>
              <>
                <thead className="cf">
                  <tr>
                    <th>{t("S.No")}</th>
                    <th>{t("Code")}</th>
                    <th>{t("Department")}</th>
                    <th>{t("Active")}</th>
                    <th>{t("Entry Date")}</th>
                    <th>{t("Update Date")}</th>
                    <th>{t("Action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {(tableData ?? []).map((data, index) => (
                    <tr key={index}>
                      <td data-title={"S.No"}>{index + 1}&nbsp;</td>
                      <td data-title={"Code"}>{data?.DepartmentCode}&nbsp;</td>
                      <td data-title={"Department"}>
                        {data?.Department}&nbsp;
                      </td>
                      <td data-title={"Active"}>{data?.Status}&nbsp;</td>
                      <td data-title={"Entry Date"}>
                        {dateConfig(data?.dtEntry)}
                      </td>
                      <td data-title={"Update Date"}>
                        {data?.dtUpdate !== "0000-00-00 00:00:00"
                          ? dateConfig(data?.dtUpdate)
                          : "-"}
                        &nbsp;
                      </td>
                      <td data-title={"Action"}>
                        {data.companyId === 0 ? (
                          <p
                            style={{ color: "red" }}
                            Tooltip="System Generated it can't be changed"
                          >
                            {t("System Generated it can't be changed")}
                          </p>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-primary btn-lg"
                            id="btnSave"
                            title="Edit"
                            onClick={() => EditData(data)}
                          >
                            {t("Edit")}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            </Tables>
          </div>
        </div>
      </Accordion>
    </>
  );
};

export default Departments;
