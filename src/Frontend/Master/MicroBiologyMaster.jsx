import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import { useTranslation } from "react-i18next";
import { MicroBioMasterSchema } from "../../utils/Schema";
import { dateConfig, getTrimmedData, number } from "../../utils/helpers";
import Accordion from "@app/components/UI/Accordion";
import { SelectBox } from "../../components/formComponent/SelectBox";
import { MicroBioMaster } from "../../utils/Constants";
import Input from "../../components/formComponent/Input";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";
import { Link } from "react-router-dom";

const MicroBiologyMaster = () => {
  const [TableData, setTableData] = useState([]);
  const [loading, setLoading] = useState({
    save: false,
    search: false,
  });
  const [payload, setPayload] = useState({
    Name: "",
    TypeID: "2",
    TypeName: "Organism",
    Code: "",
    IsActive: "1",
  });
  const [err, setErr] = useState({});
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const handleTestSearch = (id) => {
    setLoading({
      ...loading,
      search: true,
    });
    axiosInstance
      .post("MicroMaster/getmasterdata", {
        TypeID: id,
      })
      .then((res) => {
        setLoading({
          ...loading,
          search: false,
        });
        setTableData(res?.data?.message);
        setErr({});
      })
      .catch((err) => {
        setLoading({
          ...loading,
          search: false,
        });
        setTableData([]);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong."
        );
      });
  };

  const handleSelect = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    setPayload({ ...payload, [name]: value, TypeName: label });
    handleTestSearch(value);
  };

  const handleEdit = (data) => {
    setPayload({
      Name: data?.Name,
      TypeID: data?.typeid,
      TypeName: data?.typename,
      Code: data?.Code,
      IsActive: data?.isactive,
      ID: data?.id,
    });
    window.scrollTo(0, 0);
  };

  const handleSave = (url) => {
    const generatedError = MicroBioMasterSchema(payload);

    if (generatedError === "") {
      setLoading({
        ...loading,
        save: true,
      });
      axiosInstance
        .post(url, getTrimmedData(payload))
        .then((res) => {
          toast.success(res?.data?.message);
          setLoading({
            ...loading,
            save: false,
          });
          setErr({});
          setPayload({
            Name: "",
            TypeID: "2",
            IsActive: "1",
            TypeName: "Organism",
            Code: "",
          });
          handleTestSearch("2");
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoading({
            ...loading,
            save: false,
          });
        });
    } else setErr(generatedError);
  };
  useEffect(() => {
    handleTestSearch("2");
  }, []);
  return (
    <>
      <Accordion
        name={t("Micro Biology Master")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row pt-2 pl-2 pr-2">
          <div className="col-sm-2">
            <SelectBox
              options={MicroBioMaster}
              name="TypeID"
              lable="Organism"
              id="Organism"
              onChange={handleSelect}
              selectedValue={payload?.TypeID}
            />
          </div>
          <div className="col-sm-2">
            <Input
              className="required-fields"
              id="Name"
              lable="Name"
              placeholder=" "
              type="text"
              name="Name"
              value={payload?.Name}
              onChange={handleChange}
            />

            {payload?.Name?.trim() === "" && (
              <span className="error-message">{err?.Name}</span>
            )}
          </div>
          <div className="col-sm-2">
            <Input
              id="Code"
              className="required-fields"
              lable="Code"
              placeholder=" "
              type="text"
              onInput={(e) => number(e, 20)}
              name="Code"
              value={payload?.Code}
              onChange={handleChange}
            />
            {payload?.Code?.trim() === "" && (
              <span className="error-message">{err?.Code}</span>
            )}
          </div>
          <div className="col-sm-1 mt-1 d-flex">
            <div className="mt-1">
              <input
                type="checkbox"
                name="IsActive"
                checked={payload?.IsActive == "1" ? true : false}
                onChange={(e) => handleChange(e)}
              />
            </div>
            <label className="ml-2" htmlFor="IsActive">
              {t("Active")}
            </label>
          </div>
          <div className="col-sm-1">
            {loading?.save ? (
              <Loading />
            ) : payload?.ID ? (
              <button
                className="btn btn-success btn-sm btn-block"
                onClick={() =>
                  handleSave("MicroMaster/updatemasterdata", "Update")
                }
              >
                {t("Update")}
              </button>
            ) : (
              <button
                className="btn btn-success btn-sm btn-block"
                onClick={() => handleSave("MicroMaster/savemasterdata", "Save")}
              >
                {t("Save")}
              </button>
            )}
          </div>
          <div className="col-sm-1">
            <button
              className="btn btn-success btn-sm btn-block"
              onClick={() => {
                setErr({});
                setPayload({
                  Name: "",
                  TypeID: "2",
                  IsActive: "1",
                  TypeName: "Organism",
                  Code: "",
                });
              }}
            >
              {t("Reset")}
            </button>
          </div>
        </div>
      </Accordion>
      <Accordion title={t("Search Data")} defaultValue={true}>
        {loading?.search ? (
          <Loading />
        ) : (
          TableData?.length > 0 && (
            <Tables>
              <thead>
                <tr>
                  {[
                    t("S.No"),
                    t("Code"),
                    t("Name"),
                    t("Type"),
                    t("Status"),
                    t("Insert By"),
                    t("Insert Date"),
                    t("Last Update By"),
                    t("Last Update Date"),
                    t("Edit"),
                    t("Tagging"),
                  ].map((ele, index) => (
                    <th key={index}>{ele}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading?.search ? (
                  <Loading />
                ) : (
                  TableData.map((item, index) => (
                    <tr key={index}>
                      <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                      <td data-title={t("Code")}>{item?.Code}&nbsp;</td>
                      <td data-title={t("Name")}>{item?.Name}&nbsp;</td>
                      <td data-title={t("Type")}>{item?.typename}&nbsp;</td>
                      <td data-title={t("Status")}>{item?.STATUS}&nbsp;</td>
                      <td data-title={t("Insert By")}>
                        {item?.InsertByname}&nbsp;
                      </td>
                      <td data-title={t("Insert Date")}>
                        {dateConfig(item?.entrydate)}&nbsp;
                      </td>
                      <td data-title={t("Last Update By")}>
                        {item?.UpdateByname}&nbsp;
                      </td>
                      <td data-title={t("Last Update Date")}>
                        {dateConfig(item?.updatedate)}&nbsp;
                      </td>
                      <td data-title={t("Edit")}>
                        <div
                          className="text-primary"
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleEdit(item)}
                        >
                          {t("Edit")}
                        </div>
                      </td>
                      <td data-title={t("Tagging")}>
                        {item?.typeid == "2" && (
                          <Link
                            className="text-primary"
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                            to={`/MicroBiologyMasterMapping`}
                            state={{
                              id: item?.id,
                              Code: item?.Code,
                              Name: item?.Name,
                              typeid: item?.typeid,
                            }}
                          >
                            {t("Tagging")}
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Tables>
          )
        )}
      </Accordion>
    </>
  );
};

export default MicroBiologyMaster;
