import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import moment from "moment";
import Accordion from "@app/components/UI/Accordion";
import DatePicker from "../../components/formComponent/DatePicker";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Input from "../../components/formComponent/Input";
import { NoOfRecord, Showonly } from "../../utils/Constants";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";
import Pagination from "../../Pagination/Pagination";

const MachineReading = () => {
  const [machineId, setMachineId] = useState([]);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  //State For Components Start
  const [state, setState] = useState({
    FromDate: new Date(),
    FromTime: "00:00:00",
    ToDate: new Date(),
    ToTime: "23:59:59",
    RegistredPatients: "",
    Type: "",
    MachineID: "",
    SampleID: "",
    PageSize: "10",
  });
  //State For Components end

  //onChange Start
  const dateSelect = (date, name) => {
    setState({
      ...state,
      [name]: date,
    });
  };
  //onChange End

  //For Checkbox Start For Future

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };
  const { t, i18n } = useTranslation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setState({
      ...state,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const BindMachineName = () => {
    axiosInstance
      .get("Investigations/BindMachineList")
      .then((res) => {
        let data = res?.data?.message;
        console.log(data);
        let val = data?.map((ele) => {
          return {
            value: ele?.MachineId,
            label: ele?.MachineName,
          };
        });

        val.unshift({ label: "Machine Id", value: "" });
        setMachineId(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occur"
        );
      });
  };
  useEffect(() => {
    BindMachineName();
  }, []);

  const currentTableData = useMemo(() => {
    if (typeof state?.PageSize === "number") {
      const firstPageIndex = (currentPage - 1) * state?.PageSize;
      const lastPageIndex = firstPageIndex + state?.PageSize;
      return tableData.slice(firstPageIndex, lastPageIndex);
    } else {
      return tableData;
    }
  }, [currentPage, tableData]);

  //For Checkbox For Future end

  function handleTableButton() {
    setLoading(true);
    axiosInstance
      .post("MachineGroup/getMachineReading", {
        ...state,
        FromDate: moment(state?.FromDate).format("YYYY-MM-DD"),
        ToDate: moment(state?.ToDate).format("YYYY-MM-DD"),
      })
      .then((res) => {
        if (res?.data?.message?.length > 0) setTableData(res?.data?.message);
        else {
          setTableData([]);
          toast.error("No Record Found");
        }
        setCurrentPage(1);
        setLoading(false);
      })
      .catch((err) => {
        setTableData([]);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoading(false);
      });
  }

  const exportExcel = () => {
    if (tableData?.length > 0) {
      const excelData = tableData.map((ele) => {
        return {
          ...ele,
          Period:
            "Period From : " +
            moment(state?.FromDate).format("YYYY-MMM-DD") +
            "To " +
            moment(state?.ToDate).format("YYYY-MMM-DD"),
        };
      });
      ExportToExcel(excelData);
    } else {
      toast.error("Not print Empty Data");
    }
  };
  useEffect(() => {
    handleTableButton();
  }, [state?.PageSize]);
  return (
    <>
      <Accordion
        name={t("Machine Reading")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row  pt-2 pl-2 pr-2">
          <div className="col-sm-2">
            <DatePicker
              name="FromDate"
              id="FromDate"
              placeholder=""
              value={state?.FromDate}
              onChange={dateSelect}
              maxDate={new Date()}
              lable={t("FromDate")}
            />
            {errors?.FromDate && (
              <span className="error-message">{errors?.FromDate}</span>
            )}
          </div>
          <div className="col-sm-2">
            <DatePicker
              name="ToDate"
              id="ToDate"
              placeholder=""
              value={state?.ToDate}
              onChange={dateSelect}
              maxDate={new Date()}
              minDate={new Date(state.FromDate)}
              lable="ToDate"
            />
            {errors?.ToDate && (
              <span className="error-message">{errors?.ToDate}</span>
            )}
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={machineId}
              onChange={handleSelectChange}
              name="MachineID"
              id="MachineID"
              selectedValue={state.MachineID}
              lable={t("MachineID")}
            />
          </div>
          <div className="col-sm-2">
            <Input
              type="text"
              placeholder=""
              className="form-control input-sm"
              name="SampleID"
              id="SampleID"
              value={state?.SampleID}
              max={50}
              onChange={handleChange}
              lable={t("Sample")}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={[{ label: "Select", value: "" }, ...Showonly]}
              onChange={handleSelectChange}
              name="Type"
              id="Type"
              placeholder=""
              selectedValue={state?.Type}
              lable={t("ShowOnly")}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={NoOfRecord}
              onChange={handleSelectChange}
              name="PageSize"
              id="PageSize"
              placeholder=""
              selectedValue={state?.PageSize}
              lable={t("Page Size")}
            />
          </div>
        </div>
        <div className="row  pt-1 pl-2 pr-2 mb-2">
          <div className="col-sm-2 d-flex align-items-center">
            <input
              name="RegistredPatients"
              id="RegistredPatients"
              type="checkbox"
              checked={state?.RegistredPatients == 1 ? true : false}
              onChange={handleChange}
            />
            <label className="col-sm-10">
              {t("Not Registred Patients Only")}
            </label>
          </div>
          <div className="col-sm-1">
            <button
              className="btn btn-block btn-primary btn-sm"
              onClick={handleTableButton}
            >
              {t("Search")}
            </button>
          </div>
          <div className="col-sm-1">
            <button
              className="btn btn-block btn-warning btn-sm"
              onClick={() => exportExcel()}
            >
              {t("Report")}
            </button>
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : (
          tableData.length > 0 && (
            <>
              <Tables>
                <thead className="cf">
                  <tr>
                    <th>{t("S.No")}</th>
                    <th>{t("Lab No")}</th>
                    <th>{t("MACHINE_ID")}</th>
                    <th>{t("Machine_ParamID")}</th>
                    <th>{t("Reading")}</th>
                    <th>{t("DtEntry")}</th>
                    <th>{t("isSync")}</th>
                    <th>{t("Machine_Param")}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTableData?.map((data, index) => (
                    <tr key={index}>
                      <td data-title={t("S.No")}>
                        {index + 1 + IndexHandle(currentPage, state?.PageSize)}
                        &nbsp;
                      </td>
                      <td data-title={t("LabNo")}>{data?.LabNo}&nbsp;</td>
                      <td data-title={t("MACHINE_ID")}>
                        {data?.MACHINE_ID}&nbsp;
                      </td>
                      <td data-title={t("Machine_ParamID")}>
                        {data?.Machine_ParamID}&nbsp;
                      </td>
                      <td data-title={t("Reading")}>{data?.Reading}&nbsp;</td>
                      <td data-title={t("DtEntry")}>{data?.dtEntry}&nbsp;</td>
                      <td data-title={t("isSync")}>{data?.isSync}&nbsp;</td>
                      <td data-title={t("Machine_Param")}>
                        {data?.machine_param ? data?.machine_param : "-"}&nbsp;
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Tables>
              {typeof state?.PageSize === "number" && (
                <Pagination
                  className="pagination-bar"
                  currentPage={currentPage}
                  totalCount={tableData.length}
                  pageSize={state?.PageSize}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )}
            </>
          )
        )}
      </Accordion>
    </>
  );
};

export default MachineReading;
