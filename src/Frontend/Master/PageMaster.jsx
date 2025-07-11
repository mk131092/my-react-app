import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { PageMasterValidation } from "../../utils/Schema";
import Accordion from "@app/components/UI/Accordion";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Input from "../../components/formComponent/Input";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";
import { Link } from "react-router-dom";
import { number } from "../../utils/helpers";

const PageMaster = () => {
  const [menudata, setMenuData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [load, setLoad] = useState(false);
  const [savedata, setSaveData] = useState([]);
  const [errors, setErrors] = useState({});
  const [payload, setPayload] = useState({
    PageName: "",
    Url: "",
    Priority: "",
    isActive: 1,
    MenuID: "",
    SetMaster: 0,
    PageID: "",
  });
  const { t, i18n } = useTranslation();

  const handleSelectChange = (e) => {
    const { name, value } = e.target;

    if (name === "MenuID") {
      setPayload({ ...payload, [name]: value, ItemValue: "" });
      setErrors({});
      fetchPageMaster(value);
    } else {
      setPayload({ ...payload, [name]: value, ItemValue: "" });
      setErrors({});
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const fetchMenuApi = () => {
    axiosInstance
      .get("Menu/SelectAllMenu")
      .then((res) => {
        console.log(res);
        const data = res?.data?.message;
        const menuapi = data.map((ele) => {
          return {
            label: ele?.MenuName,
            value: ele?.ID,
          };
        });
        menuapi.unshift({ label: "Select", value: "" });
        setMenuData(menuapi);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong."
        );
      });
  };

  const fetchPageMaster = (value) => {
    axiosInstance
      .post("Menu/SelectAllPage", { MenuID: value })
      .then((res) => {
        console.log(res);
        if (res?.data?.success) {
          const data = res?.data?.message;
          setSaveData(data);
        } else {
          setSaveData([]);
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const editIDMaster = (id) => {
    setUpdate(true);
    axiosInstance
      .post("Menu/SelectAllPageByPageID", {
        PageID: id,
      })
      .then((res) => {
        console.log(res);
        const data = res.data.message[0];
        setPayload(data);
      })
      .catch((err) => console.log(err));
  };
  console.log(payload);
  const handleSave = (url, btnName) => {
    let generatedError = PageMasterValidation(payload);
    if (generatedError === "") {
      setLoad(true);
      axiosInstance
        .post(url, payload)
        .then((res) => {
          if (res?.data?.success) {
            toast.success(res.data?.message);

            fetchPageMaster("");
            if (btnName === "Update") {
              setUpdate(false);
            }
            setPayload({
              PageName: "",
              Url: "",
              Priority: "",
              isActive: 1,
              MenuID: "",
              SetMaster: 0,
              PageID: "",
            });
          } else {
            toast.error(res?.data?.message);
          }
          setLoad(false);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoad(false);
        });
    } else {
      setErrors(generatedError);
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchPageMaster("");
    fetchMenuApi();
  }, []);
  return (
    <>
      <Accordion name={t("Page Master")} defaultValue={true} isBreadcrumb={true}>
        <div className="row pt-2 pl-2 pr-2">
          <div className="col-sm-2">
            <SelectBox
              name="MenuID"
              onChange={handleSelectChange}
              className="required-fields"
              options={menudata}
              isDisabled={payload?.CompanyID == 0 ? true : false}
              selectedValue={payload?.MenuID}
              lable="Menu"
            />
            <div className="error-message">{errors?.MenuID}</div>
          </div>
          <div className="col-sm-2">
            <Input
              type="text"
              lable="Page Name"
              className="required-fields"
              name="PageName"
              id="PageName"
              placeholder=""
              max={50}
              disabled={payload?.CompanyID == 0 ? true : false}
              value={payload?.PageName}
              onChange={handleChange}
            />
            <div className="error-message">{errors?.PageName}</div>
          </div>
          <div className="col-sm-2">
            <Input
              type="text"
              lable="URL"
              className="required-fields"
              name="Url"
              id="Url"
              placeholder=""
              disabled={payload?.CompanyID == 0 ? true : false}
              value={payload?.Url}
              onChange={handleChange}
            />
            <div className="error-message">{errors?.Url}</div>
          </div>
          <div className="col-sm-2">
            <Input
              type="number"
              lable="Priority"
              name="Priority"
              id="Priority"
              placeholder=""
              onInput={(e) => number(e, 4)}
              value={payload?.Priority}
              onChange={handleChange}
            />
            <div className="error-message">{errors?.Priority}</div>
          </div>
          <div className="col-sm-1 mt-1 d-flex">
            <div className="mt-1">
              <input
                name="isActive"
                type="checkbox"
                disabled={payload?.CompanyID == 0 ? true : false}
                checked={payload?.isActive}
                onChange={handleChange}
              />
            </div>
            <label className="col-sm-10">{t("Active")}</label>
          </div>
          {payload?.PageID == "" ? (
            <div className="col-sm-1 mt-1 d-flex">
              <div className="mt-1">
                <input
                  name="SetMaster"
                  type="checkbox"
                  max={50}
                  checked={payload?.SetMaster}
                  onChange={handleChange}
                />
              </div>
              <label className="col-sm-10">{t("SetMaster")}</label>
            </div>
          ) : (
            ""
          )}
          <div className="col-sm-1">
            {load ? (
              <Loading />
            ) : update ? (
              <button
                type="button"
                className="btn btn-block btn-warning btn-sm"
                id="btnSave"
                title="Update"
                onClick={() => handleSave("Menu/UpdatePageMaster", "Update")}
              >
                {t("Update")}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-block btn-success btn-sm"
                id="btnSave"
                title="Update"
                onClick={() => handleSave("Menu/SavePageMaster", "Save")}
              >
                {t("Save")}
              </button>
            )}
          </div>
          <div className="col-sm-1">
            <button
              type="button"
              className="btn btn-block btn-danger btn-sm"
              id="Reset"
              title="Reset"
              onClick={() => {
                setPayload({
                  PageName: "",
                  Url: "",
                  Priority: "",
                  isActive: 1,
                  MenuID: "",
                  SetMaster: 0,
                  PageID: "",
                });
                setUpdate(false);
                setErrors({});
              }}
            >
              {t("Reset")}
            </button>
          </div>
        </div>
      </Accordion>
      <Accordion title={t("Search Data")} defaultValue={true}>
        {load ? (
          <Loading />
        ) : (
          <div className="row p-2 ">
            <div className="col-12">
              <Tables>
                <thead>
                  <tr>
                    <th>{t("S.No")}</th>
                    <th>{t("Menu Name")}</th>
                    <th>{t("Page Name")}</th>
                    <th>{t("URL")}</th>
                    <th>{t("Is Master")}</th>
                    <th>{t("Priority")}</th>
                    <th>{t("IsActive")}</th>
                    <th>{t("Action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {savedata.map((ele, index) => (
                    <tr key={index}>
                      <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                      <td data-title={t("Menu Name")}>{ele?.MenuName}&nbsp;</td>
                      <td data-title={t("PageName")}>{ele?.PageName}&nbsp;</td>
                      <td data-title={t("Active")}>{ele?.Url}&nbsp;</td>
                      <td data-title={t("IsMaster")}>
                        {ele?.CompanyID == 0 ? "Master" : "Self"}&nbsp;
                      </td>
                      <td data-title={t("Priority")}>{ele?.Priority}&nbsp;</td>
                      <td data-title={t("IsActive")}>
                        {ele?.isActive == 1 ? "Active" : "InActive"}&nbsp;
                      </td>
                      <td>
                        <Link
                          className="text-primary"
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => {
                            window?.scroll(0, 0);
                            editIDMaster(ele?.PageID);
                            setErrors({});
                          }}
                        >
                          {t("Edit")}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Tables>
            </div>
          </div>
        )}
      </Accordion>
    </>
  );
};

export default PageMaster;
