import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  getAccessCentres,
  getDepartment,
} from "../../utils/NetworkApi/commonApi";
import { isChecked } from "../util/Commonservices";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import Accordion from "@app/components/UI/Accordion";
import { SelectBox } from "../../components/formComponent/SelectBox";
import { ManageDeliveryDaysType } from "../../utils/Constants";
import Input from "../../components/formComponent/Input";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";

const ManageDeliveryDays = () => {
  const [CentreID, setCentreID] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [load, setLoad] = useState({
    searchLoad: false,
    saveLoad: false,
  });
  const [tableData, setTableData] = useState([]);
  const [state, setState] = useState({
    searchText: "",
    centreId: "",
    departmentId: "",
    allCentres: false,
    type: 1,
  });
  const { t } = useTranslation();

  const handleSelectChange = (event) => {
    const { name, value, checked, type } = event.target;
    if (name == "allCentres")
      setState({ ...state, [name]: type === "checkbox" ? checked : value });
    else if (name == "type") {
      setState({
        ...state,
        [name]: type === "checkbox" ? checked : value,
        searchText: "",
      });
      setTableData([]);
    } else {
      setState({ ...state, [name]: type === "checkbox" ? checked : value });
      setTableData([]);
    }
  };

  const handleChangeMain = (e, index) => {
    const { value, name, checked, type } = e.target;
    if (name == "Hours" && value > 24) {
      return;
    }
    if (index >= 0) {
      const data = [...tableData];
      data[index][name] = type === "checkbox" ? checked : value;
      setTableData(data);
    } else {
      const updatedTableData = tableData.map((ele) => {
        return {
          ...ele,
          [name]: type === "checkbox" ? checked : value,
        };
      });
      setTableData(updatedTableData);
    }
  };

  const handleWeekDays = (name, value, index) => {
    const data = [...tableData];
    data[index][name] = value == "0" ? "1" : "0";
    setTableData(data);
  };

  const fetch = (type) => {
    setLoad({ ...load, searchLoad: true });
    const payload = {
      TestName: state?.searchText.trim(),
      DepartmentId: state?.departmentId,
      CentreId: state?.centreId,
      MasterStatus: type,
      type: state?.type,
    };
    if (payload.CentreId == "") {
      setTableData([]);
      toast.error("Select Centre");
      setLoad({ ...load, searchLoad: false });
    } else {
      axiosInstance
        .post("ManageDeliveryDays/getDeliveryDays", payload)
        .then((res) => {
          setLoad({ ...load, searchLoad: false });
          const data = res.data.message;
          const val = data.map((ele) => {
            return {
              ...ele,
              isChecked: false,
              centreId: "",
            };
          });
          setTableData(val);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setLoad({ ...load, searchLoad: false });
          setTableData([]);
        });
    }
  };

  const handleSubmit = () => {
    const find = tableData.filter((ele) => ele?.isChecked === true);
    const data = find.map((ele) => {
      if (!state?.allCentres) {
        return { ...ele, centreId: state?.centreId, allCentres: "" };
      } else {
        return {
          ...ele,
          centreId: "0",
          allCentres: "1",
        };
      }
    });
    const payload = data.map((item) => ({
      invId: state?.type == 2 ? 0 : item.InvestigationId,
      departmentId: item.DepartmentId,
      Sun: item.Sun.toString(),
      Mon: item.Mon.toString(),
      Tue: item.Tue.toString(),
      Wed: item.Wed.toString(),
      Thu: item.Thu.toString(),
      Fri: item.Fri.toString(),
      Sat: item.Sat.toString(),
      CutOffTime: item.CutOffTime,
      WorkingHours: item.Hours,
      centreId: item.centreId,
      allCentres: item.allCentres,
      DayType: "Hours",
      TATType: "Hours",
      type: state?.type,
      IsUrgent: state?.type == 3 ? 1 : 0,
      ExcludeHoliday: item?.ExcludeHoliday?true:false,
    }));
    const check = payload.some(
      (item) =>
        item.Sun == "0" &&
        item.Mon == "0" &&
        item.Tue == "0" &&
        item.Wed == "0" &&
        item.Thu == "0" &&
        item.Fri == "0" &&
        item.Sat == "0"
    );

    if (data?.length > 0) {
      if (!check) {
        setLoad({ ...load, saveLoad: true });

        axiosInstance
          .post("ManageDeliveryDays/SaveManageDeliveryDays", {
            deliveryCollectionList: payload,
          })
          .then((res) => {
            toast.success(res.data.message);
            setLoad({ ...load, saveLoad: false });
            setTableData([]);
            setState({
              ...state,
              allCentres: false,
            });
            document.getElementById("DaysInput").value = "";
          })
          .catch((err) => {
            setLoad({ ...load, saveLoad: false });
            console.log(err);
          });
      } else {
        toast.error("Please Tick Any Week Day In Selected Rows");
      }
    } else {
      toast.error("Please Select Any One Row");
    }
  };
  const addRow = (data, index) => {
    const allData = [...tableData];
    allData.splice(index + 1, 0, {
      ...data,
      IsDelete: true,
      ExcludeHoliday: 0,
      isChecked: 0,
      Sun: "0",
      Mon: "0",
      Tue: "0",
      Wed: "0",
      Thu: "0",
      Fri: "0",
      Sat: "0",
      Hours: "",
      CutOffTime: "14:00:00",
    });
    setTableData(allData);
  };
  const handleRemove = (index) => {
    const updatedData = [...tableData];
    updatedData.splice(index, 1);
    setTableData(updatedData);
  };

  useEffect(() => {
    if (state?.searchText !== "") {
      fetch();
    }
  }, [state?.searchText]);

  console.log(tableData);
  const toggleWeekDayForAll = (day) => {
    const updatedData = tableData.map((data) => {
      data[day] = data[day] == "1" ? "0" : "1";
      return data;
    });
    setTableData(updatedData);
  };

  const checkDay = (day) => {
    const check = tableData?.filter((ele) => ele[day] == "0");
    if (check?.length == 0 && tableData?.length > 0) return true;
    else return false;
  };
  useEffect(() => {
    getAccessCentres(setCentreID);
    getDepartment(setDepartment);
  }, []);
  return (
    <>
      <Accordion
        name={t("Manage Delivery Days")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row pt-2 pl-2 pr-2 pb-2">
          <div className="col-sm-2">
            <SelectBox
              options={ManageDeliveryDaysType}
              name="type"
              id="type"
              selectedValue={state?.type}
              onChange={handleSelectChange}
              placeholder=""
              lable={t("Type")}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={[{ label: "Select Centre", value: "" }, ...CentreID]}
              name="centreId"
              id="centreId"
              selectedValue={state?.centreId}
              onChange={handleSelectChange}
              placeholder=""
              lable={t("Centre")}
              className="required-fields"
            />
          </div>
          <div className="col-sm-2 ">
            <SelectBox
              options={[
                { label: "Select Department", value: "" },
                ...Department,
              ]}
              name="departmentId"
              id="departmentId"
              onChange={handleSelectChange}
              selectedValue={state?.departmentId}
              placeholder=""
              lable={t("Department")}
            />
          </div>
          <div className="col-sm-2">
            <Input
              type="text"
              name="searchText"
              id="searchText"
              disabled={state?.type == 2}
              value={state?.searchText}
              onChange={handleSelectChange}
              placeholder=""
              lable={t("Search Test")}
            />
          </div>
          <div className="col-sm-1">
            {load.searchLoad ? (
              <Loading />
            ) : (
              <button
                className="btn btn-block btn-primary btn-sm"
                onClick={() => fetch("")}
              >
                {t("Search")}
              </button>
            )}
          </div>
          <div className="col-sm-2">
            <span
              className="btn btn-warning btn-sm"
              style={{
                width: "24px",
                // height: "10px",
                backgroundColor: "orange",
              }}
              onClick={() => fetch("1")}
            ></span>
            &nbsp;&nbsp;
            <label>{t("Master Not Defined")} </label>
          </div>
        </div>
        {tableData.length > 0 && (
          <div
            style={{
              maxHeight: "410px",
              overflowY: "auto",
            }}
          >
            {load?.searchLoad ? (
              <Loading />
            ) : (
              <>
                <Tables>
                  <thead
                    className="cf text-center"
                    style={{
                      position: "sticky",
                    }}
                  >
                    <tr>
                      <th className="text-center">{t("S.No")}</th>

                      <th className="text-center">{t("Department")}</th>

                      {state?.type != 2 && (
                        <th className="text-center" style={{ width: "20%" }}>
                          {t("Item Name")}
                        </th>
                      )}
                      <th className="text-center">
                        {t("Hours")}
                        <br></br>
                        <Input
                          id="Hours"
                          type="number"
                          name="Hours"
                          max={2}
                          onChange={(e) => {
                            handleChangeMain(e);
                          }}
                          className="form-control ui-autocomplete-input input-sm"
                          disabled={tableData.length == 0}
                        />
                      </th>

                      <th className="text-center" style={{ width: "20%" }}>
                        {t("Week Days")}
                        <br />
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                          (day) => (
                            <>
                              <button
                                className={checkDay(day) && "checkedWeekday"}
                                type="checkbox"
                                style={{
                                  color: "black",
                                  border: "none",
                                  width: "auto",
                                  height: "auto",
                                }}
                                key={day}
                                onClick={() => toggleWeekDayForAll(day)}
                              >
                                <span>{t(day)}</span>
                              </button>
                              &nbsp;
                            </>
                          )
                        )}
                      </th>

                      <th className="text-center">
                        {t("CutoffTime")}
                        <br></br>
                        <Input
                          type="time"
                          name="CutOffTime"
                          disabled={tableData.length == 0}
                          onChange={(e) => handleChangeMain(e)}
                        />
                      </th>
                      <th className="text-center">{t("Remove")}</th>
                      <th
                        className="text-center"
                        style={{ textAlign: "center" }}
                      >
                        {t("Holiday")}

                        <input
                          type="checkbox"
                          className="mt-1 ml-1"
                          checked={
                            tableData?.length > 0
                              ? isChecked(
                                  "ExcludeHoliday",
                                  tableData,
                                  true
                                ).includes(false)
                                ? false
                                : true
                              : false
                          }
                          name="ExcludeHoliday"
                          onChange={(e) => handleChangeMain(e)}
                        />
                      </th>
                      <th
                        className="text-center"
                        style={{ textAlign: "center" }}
                      >
                        <input
                          type="checkbox"
                          checked={
                            tableData?.length > 0
                              ? isChecked(
                                  "isChecked",
                                  tableData,
                                  true
                                ).includes(false)
                                ? false
                                : true
                              : false
                          }
                          name="isChecked"
                          onChange={(e) => handleChangeMain(e)}
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((data, index) => (
                      <tr
                        key={index}
                        style={{
                          backgroundColor:
                            data.rowColor === "orange" ? "orange" : "white",
                        }}
                      >
                        <td className="text-center" data-title={t("S.No")}>
                          {index + 1}&nbsp;
                          <span
                            className="PlusBtn"
                            onClick={() => addRow(data, index)}
                            style={{ width: "30%" }}
                          >
                            <i
                              className="pi pi-plus"
                              style={{ marginTop: "4px" }}
                            ></i>
                          </span>
                        </td>
                        <td
                          className="text-center"
                          data-title={t("Department")}
                        >
                          {data?.DeptName}&nbsp;
                        </td>
                        {state?.type != 2 && (
                          <td
                            className="text-center"
                            data-title={t("Item Name")}
                          >
                            {data?.InvName}&nbsp;
                          </td>
                        )}
                        <td className="text-center" data-title="Hours">
                          <Input
                            type="number"
                            name="Hours"
                            value={data?.Hours}
                            max={2}
                            onChange={(e) => handleChangeMain(e, index)}
                          />
                        </td>
                        <td className="text-center" data-title={t("Week Days")}>
                          <div
                            className="weekDays-selector"
                            data-title="Week Days"
                          >
                            <button
                              type="button"
                              name="Mon"
                              className={data?.Mon == "1" && "checkedWeekday"}
                              onClick={() =>
                                handleWeekDays("Mon", data?.Mon, index)
                              }
                            >
                              <span>{t("Mon")}</span>
                            </button>
                            &nbsp;
                            <button
                              type="button"
                              name="Tue"
                              className={data?.Tue == "1" && "checkedWeekday"}
                              onClick={() =>
                                handleWeekDays("Tue", data?.Tue, index)
                              }
                            >
                              <span>{t("Tue")}</span>
                            </button>
                            &nbsp;
                            <button
                              type="button"
                              name="Wed"
                              className={data?.Wed == "1" && "checkedWeekday"}
                              onClick={() =>
                                handleWeekDays("Wed", data?.Wed, index)
                              }
                            >
                              <span>{t("Wed")}</span>
                            </button>
                            &nbsp;
                            <button
                              type="checkbox"
                              name="Thu"
                              className={data?.Thu == "1" && "checkedWeekday"}
                              onClick={() =>
                                handleWeekDays("Thu", data?.Thu, index)
                              }
                            >
                              <span>{t("Thu")}</span>
                            </button>
                            &nbsp;
                            <button
                              type="button"
                              name="Fri"
                              className={data?.Fri == "1" && "checkedWeekday"}
                              onClick={() =>
                                handleWeekDays("Fri", data?.Fri, index)
                              }
                            >
                              <span>{t("Fri")}</span>
                            </button>
                            &nbsp;
                            <button
                              type="button"
                              name="Sat"
                              className={data?.Sat == "1" && "checkedWeekday"}
                              onClick={() =>
                                handleWeekDays("Sat", data?.Sat, index)
                              }
                            >
                              <span>{t("Sat")}</span>
                            </button>
                            &nbsp;
                            <button
                              type="button"
                              name="Sun"
                              id="weekday-sun"
                              checked="checked"
                              className={data?.Sun == "1" && "checkedWeekday"}
                              onClick={() =>
                                handleWeekDays("Sun", data?.Sun, index)
                              }
                            >
                              <span>{t("Sun")}</span>
                            </button>
                          </div>
                        </td>
                        <td
                          className="text-center"
                          data-title={t("CutOffTime")}
                        >
                          <Input
                            type="time"
                            value={data?.CutOffTime}
                            name="CutOffTime"
                            onChange={(e) => handleChangeMain(e, index)}
                          />
                        </td>
                        <td className="text-center" data-title={t("Remove")}>
                          {data?.IsDelete ? (
                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleRemove(index)}
                              style={{
                                backgroundColor: "red",
                                color: "white",
                                border: "none",
                                padding: "2px 7px",
                                fontSize: "12px",
                                cursor: "pointer",
                                borderRadius: "4px",
                              }}
                            >
                              X
                            </button>
                          ) : (
                            <>&nbsp;</>
                          )}
                        </td>{" "}
                        <td
                          className="text-center"
                          data-title={t("Holiday")}
                          style={{ textAlign: "center" }}
                        >
                          <input
                            type="checkbox"
                            checked={data?.ExcludeHoliday}
                            name="ExcludeHoliday"
                            onChange={(e) => handleChangeMain(e, index)}
                          />
                        </td>
                        <td
                          className="text-center"
                          data-title={t("isChecked")}
                          style={{ textAlign: "center" }}
                        >
                          <input
                            type="checkbox"
                            checked={data?.isChecked}
                            name="isChecked"
                            onChange={(e) => handleChangeMain(e, index)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Tables>
              </>
            )}
          </div>
        )}
        <div className="row p-2">
          <div className="col-sm-1">
            {load?.saveLoad ? (
              <Loading />
            ) : (
              <button
                className="btn btn-block btn-success btn-sm"
                onClick={handleSubmit}
              >
                {t("Save")}
              </button>
            )}
          </div>
          <div className="col-sm-2">
            <input
              type="checkbox"
              name="allCentres"
              checked={state?.allCentres}
              onChange={handleSelectChange}
            />
            &nbsp;
            <label>{t("Save for all centre")} </label>
          </div>
        </div>{" "}
      </Accordion>
    </>
  );
};

export default ManageDeliveryDays;
