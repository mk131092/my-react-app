import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { SelectAccredition } from "../../utils/Constants";
import { getAccessCentres } from "../../utils/NetworkApi/commonApi";
import Loading from "../../components/loader/Loading";
import Accordion from "@app/components/UI/Accordion";
import Tables from "../../components/UI/customTable";
import { axiosInstance } from "../../utils/axiosInstance";
import { SelectBox } from "../../components/formComponent/SelectBox";
import { isChecked } from "../../utils/helpers";
const ManageNabl = () => {
  const { t } = useTranslation();
  const [CentreData, setCentreData] = useState([]);
  const [load, setLoad] = useState({
    saveLoad: false,
    searchLoad: false,
  });
  const [DepartmentData, setDepartmentData] = useState([]);

  const [RateTypes, setRateTypes] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [checkAll, setCheckAll] = useState(0);
  const [payload, setPayload] = useState({
    CentreID: "",
    DepartmentID: "",
    InvestigationID: "",
    RateTypeID: "",
  });

  const handleChangeDropDown = (e, index) => {
    const { name, value } = e.target;
    const data = [...tableData];
    const dropLabel = SelectAccredition.find((ele) => ele?.value === value);
    if (index >= 0) {
      data[index][name] = value;
      data[index]["AccreditionName"] = dropLabel?.label;
      setTableData(data);
    } else {
      const val = data.map((ele) => {
        return {
          ...ele,
          [name]: value,
          AccreditionName: dropLabel?.label,
        };
      });
      setTableData(val);
    }
  };

  console.log(tableData);
  const getDepartment = () => {
    axiosInstance
      .get("Department/getDepartmentData")
      .then((res) => {
        let data = res.data.message;
        let DeptDataValue = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        setDepartmentData(DeptDataValue);
        DeptDataValue.unshift({ label: "DepartmentID", value: "" });
      })
      .catch((err) => console.log(err));
  };

  const handleSelect = (event) => {
    const { name, value } = event.target;
    if (name === "DepartmentID") {
      setPayload({ ...payload, [name]: value, InvestigationID: "" });
    } else if (name === "CentreID") {
      setPayload({ ...payload, [name]: value, RateTypeID: "" });
      fetchRateTypes(value);
    } else setPayload({ ...payload, [name]: value });
  };

  const bindDropDown = () => {
    if (
      payload?.CentreID !== "" &&
      payload?.RateTypeID !== "" &&
      payload?.DepartmentID !== ""
    ) {
      setLoad({ ...load, searchLoad: true });

      axiosInstance
        .post("ManageIsNablController/BindManageIsNablData", {
          ...payload,
          CentreID: payload?.RateTypeID,
        })
        .then((res) => {
          const updateData = res?.data?.message.map((data) => ({
            ...data,
            isActive: 0,
          }));
          setTableData(updateData);
          setLoad({ ...load, searchLoad: false });
        })
        .catch((err) => {
          setTableData([]);
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "error occured"
          );
          setLoad({ ...load, searchLoad: false });
        });
    } else {
      setTableData([]);
      toast.error("Centre Id and RateTypeID and Department Id are required");
    }
  };

  const handleSave = () => {
    const updatedPayload = tableData.filter(
      (payload) => payload.isActive == 1 && payload.AccreditionId != ""
    );
    console.log(updatedPayload);
    if (updatedPayload.length !== 0) {
      setLoad({ ...load, saveLoad: true });
      axiosInstance
        .post("ManageIsNablController/SaveManageIsNabl", updatedPayload)
        .then((res) => {
          toast.success(res?.data?.message);
          setLoad({ ...load, saveLoad: false });
          bindDropDown();
        })
        .catch((err) => {
          console.log(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoad({ ...load, saveLoad: false });
        });
    } else {
      toast.error("please select any Accredentials to update");
    }
  };

  useEffect(() => {
    getDepartment();
    getAccessCentres(setCentreData);
  }, []);

  const handleCheckbox = (e, ind) => {
    const { name, value, checked, type } = e.target;
    if (name === "SingleCheck") {
      const updateData = tableData.map((data, index) => ({
        ...data,
        isActive:
          ind === index && type === "checkbox"
            ? checked
              ? 1
              : 0
            : data?.isActive,
      }));
      setTableData(updateData);
    } else if (name === "AllCheck") {
      setCheckAll(type === "checkbox" ? (checked ? 1 : 0) : value);
      const updateData = tableData.map((data) => ({
        ...data,
        isActive: type === "checkbox" ? (checked ? 1 : 0) : value,
      }));
      setTableData(updateData);
    }
  };
  const fetchRateTypes = async (id) => {
    try {
      const res = await axiosInstance.post("Centre/GetRateType", {
        CentreId: [id],
      });
      const list = res?.data?.message.map((item) => ({
        label: item?.RateTypeName,
        value: item?.RateTypeID,
      }));
      setRateTypes(list);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <>
        <Accordion
          name={t("Manage NABL")}
          isBreadcrumb={true}
          defaultValue={true}
        >
          <div className="row pt-2 pl-2 pr-2 mt-1">
            <div className="col-sm-2">
              <SelectBox
                className="required-fields"
                name="CentreID"
                lable="Select Centre"
                options={[
                  { label: "Select Centre", value: "" },
                  ...(CentreData ?? []),
                ]}
                selectedValue={payload?.CentreID}
                onChange={handleSelect}
              />
            </div>

            <div className="col-sm-2">
              <SelectBox
                className="required-fields"
                lable="Select RateType"
                options={[
                  { label: "Select RateType", value: "" },
                  ...RateTypes,
                ]}
                name="RateTypeID"
                onChange={handleSelect}
                selectedValue={payload?.RateTypeID}
              />
            </div>

            <div className="col-sm-2">
              <SelectBox
                className="required-fields"
                lable="Select Department"
                name="DepartmentID"
                options={[
                  { label: "Select Department", value: "" },
                  ...(DepartmentData ?? []),
                ]}
                selectedValue={payload?.DepartmentID}
                onChange={handleSelect}
              />
            </div>
            {/* <label className="col-sm-1">{t("Test")}:</label>
            <div className="col-sm-2">
              <SelectBox
                name="InvestigationID"
                options={[
                  { label: "All", value: "" },
                  ...(InvestigationID ?? []),
                ]}
                selectedValue={payload?.InvestigationID}
                onChange={handleSelect}
              />
            </div> */}
            <div className="col-sm-1">
              <button
                type="submit"
                className="btn btn-block btn-info btn-sm"
                onClick={bindDropDown}
              >
                {t("Search")}
              </button>
            </div>
          </div>
        </Accordion>
        {tableData?.length > 0 && (
          <Accordion title={"Search Data"} defaultValue={true}>
            {!load?.searchLoad ? (
              <>
                <div
                  style={{
                    maxHeight: "410px",
                    overflowY: "auto",
                  }}
                >
                  <Tables>
                    <thead>
                      <tr>
                        <th>{t("S No.")}</th>
                        <th>{t("Department")}</th>
                        <th>{t("Investigation")}</th>
                        <th>{t("Rate")}</th>

                        <th>
                          <select
                            disabled={checkAll === 0 ? true : false}
                            className="form-control ui-autocomplete-input input-sm mb-1"
                            onChange={handleChangeDropDown}
                            name="AccreditionId"
                          >
                            {SelectAccredition.map((data, index) => (
                              <option value={data?.value} key={index}>
                                {data?.label}
                              </option>
                            ))}
                          </select>
                        </th>
                        <th>
                          <input
                            type="checkbox"
                            name="AllCheck"
                            checked={
                                tableData.length > 0
                                  ? isChecked("isActive", tableData, "1").includes(
                                      false
                                    )
                                    ? false
                                    : true
                                  : false
                              }
                            onChange={handleCheckbox}
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((data, index) => (
                        <tr key={index}>
                          <td data-title={t("S No.")}>{index + 1}&nbsp;</td>
                          <td data-title={t("Department")}>
                            {data?.Department}&nbsp;
                          </td>
                          <td data-title={t("Investigation")}>
                            {data?.TestName}&nbsp;
                          </td>
                          <td data-title={t("Rate")}>{data?.Rate}&nbsp;</td>
                          <td data-title={t("AccreditionId")}>
                            <select
                              disabled={data.isActive === 0 ? true : false}
                              className="form-control ui-autocomplete-input input-sm"
                              value={data?.AccreditionId}
                              name="AccreditionId"
                              onChange={(e) => handleChangeDropDown(e, index)}
                            >
                              {SelectAccredition.map((data, index) => (
                                <option value={data?.value} key={index}>
                                  {data?.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              name="SingleCheck"
                              checked={data?.isActive === 0 ? false : true}
                              onChange={(e) => handleCheckbox(e, index, data)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Tables>
                </div>

                <div className="row mt-2 ml-1 mb-1">
                  {load?.saveLoad ? (
                    <Loading />
                  ) : (
                    <div className="col-sm-1">
                      <button
                        type="button"
                        className="btn btn-success btn-block btn-sm"
                        onClick={handleSave}
                      >
                        {t("Save")}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Loading />
            )}
          </Accordion>
        )}
      </>
    </>
  );
};

export default ManageNabl;
