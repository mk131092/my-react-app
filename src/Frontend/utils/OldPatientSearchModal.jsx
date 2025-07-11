import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Input from "../../components/formComponent/Input";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { Dialog } from "primereact/dialog";
import moment from "moment";
import DatePicker from "../../components/formComponent/DatePicker";
import { dateConfig, Time } from "../../utils/helpers";
import CustomTimePicker from "../../components/formComponent/TimePicker";
import Tables from "../../components/UI/customTable";
import Pagination from "../../Pagination/Pagination";
import { Record } from "../../utils/Constants";
import { axiosInstance } from "../../utils/axiosInstance";
import { SelectBox } from "../../components/formComponent/SelectBox";
import ReactSelect from "../../components/formComponent/ReactSelect";
import Loading from "../../components/loader/Loading";
const OldPatientSearchModal = ({ show, setShow, handleSelctData }) => {
  const today = new Date();
  const [payload, setPayload] = useState({
    Mobile: "",
    UHID: "",
    Name: "",
    FromDate: new Date(),
    ToDate: new Date(),
    CentreID: "",
    FromTime: new Date(today.setHours(0, 0, 0, 0)),
    ToTime: new Date(today.setHours(23, 59, 59, 999)),
  });

  const { t } = useTranslation();
  const dateSelect = (date, name) => {
    setPayload({
      ...payload,
      [name]: date,
    });
  };
  const [tableData, setTableData] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };
  const [load, setLoad] = useState(false);
  const [PageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [CentreData, setCentreData] = useState([]);
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return tableData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, tableData, PageSize]);

  const isMobile = window.innerWidth <= 768;
  const theme = useLocalStorage("theme", "get");

  const handleSearch = () => {
    setLoad(true);
    axiosInstance
      .post("Booking/getPatientDetails", {
        Mobile: payload?.Mobile?.trim(),
        PatientCode: payload?.UHID?.trim(),
        Name: payload?.Name?.trim(),
        FromDate: moment(payload.FromDate).format("DD/MMM/YYYY"),
        ToDate: moment(payload.ToDate).format("DD/MMM/YYYY"),
        FromTime: Time(payload.FromTime),
        ToTime: Time(payload.ToTime),
        CentreID: payload?.CentreID?.toString(),
      })
      .then((res) => {
        setTableData(res.data.message);
        setLoad(false);
      })
      .catch((err) => {
        setTableData([]);
        setLoad(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };
  const handleTime = (time, name) => {
    setPayload({ ...payload, [name]: time });
  };
  const handleSearchSelectChange = (label, value) => {
    if (label === "CentreID") {
      setPayload({
        ...payload,
        ["CentreID"]: value?.value,
      });
    }
  };
  const getAccessCentres = (state) => {
    axiosInstance
      .get("Centre/getAccessCentres")
      .then((res) => {
        let data = res.data.message;
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        CentreDataValue.unshift({ label: t("None"), value: "" });
        state(CentreDataValue);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.sessionStorage.clear();
          window.location.href = "/login";
        }
      });
  };
  useEffect(() => {
    getAccessCentres(setCentreData);
  }, []);
  return (
    <>
      <Dialog
        header={t("Old Patient Search")}
        visible={show}
        className={theme}
        onHide={() => setShow(false)}
        style={{
          width: isMobile ? "80vw" : "75vw",
        }}
      >
        <div className="row">
          <div className="col-sm-2">
            <ReactSelect
              dynamicOptions={CentreData}
              name="CentreID"
              lable="Centre"
              id="Centre"
              removeIsClearable={true}
              placeholderName="Centre"
              value={payload?.CentreID}
              onChange={handleSearchSelectChange}
            />
          </div>
          <div className="col-sm-2">
            <Input
              type="text"
              lable="Mobile"
              id="Mobile"
              name="Mobile"
              value={payload.Mobile}
              onChange={handleChange}
              placeholder=" "
            />
          </div>
          <div className="col-sm-2">
            <Input
              type="text"
              lable="UHID"
              id="UHID"
              name="UHID"
              value={payload.UHID}
              onChange={handleChange}
              placeholder=" "
            />
          </div>
          <div className="col-sm-2">
            <Input
              type="text"
              lable="Patient Name"
              id="Name"
              name="Name"
              value={payload.Name}
              onChange={handleChange}
              placeholder=" "
            />
          </div>
          <div className="col-sm-2">
            <DatePicker
              className="custom-calendar"
              name="FromDate"
              value={payload?.FromDate}
              onChange={dateSelect}
              placeholder=" "
              id="FromDate"
              lable="FromDate"
              maxDate={new Date(payload?.ToDate)}
            />
          </div>
          <div className="col-md-1">
            <CustomTimePicker
              name="FromTime"
              placeholder="FromTime"
              value={payload?.FromTime}
              id="FromTime"
              lable="FromTime"
              onChange={handleTime}
            />
          </div>
        </div>
        <div className="row mb-2">
          <div className="col-sm-2">
            <DatePicker
              className="custom-calendar"
              name="ToDate"
              value={payload?.ToDate}
              onChange={dateSelect}
              placeholder=" "
              id="ToDate"
              lable="ToDate"
              maxDate={new Date()}
              minDate={new Date(payload?.FromDate)}
            />
          </div>
          <div className="col-md-1">
            <CustomTimePicker
              name="ToTime"
              placeholder="ToTime"
              value={payload?.ToTime}
              id="ToTime"
              lable="ToTime"
              onChange={handleTime}
            />
          </div>
          <div className="col-sm-1">
            <button
              type="button"
              value={"Search"}
              id="btnSearch"
              className="btn btn-block btn-success btn-sm"
              onClick={handleSearch}
            >
              {t("Search")}
            </button>
          </div>
        </div>
        {load ? (
          <Loading />
        ) : (
          <div
            style={{
              maxHeight: "310px",
              overflowY: "auto",
            }}
          >
            {" "}
            <Tables>
              <thead className="cf">
                <tr>
                  <th>{t("Select")}</th>
                  <th>{t("UHID")}</th>
                  <th>{t("Patient Name")}</th>
                  <th>{t("Age")}</th>
                  <th>{t("DOB")}</th>
                  <th>{t("Gender")}</th>
                  <th>{t("Mobile")}</th>
                  <th>{t("City")}</th>
                  <th>{t("State")}</th>
                </tr>
              </thead>
              <tbody>
                {currentTableData.map((data, index) => (
                  <tr key={index}>
                    <td data-title={t("Select")}>
                      <button
                        className="btn btn-info  btn-sm d-flex"
                        onClick={() => handleSelctData(data)}
                      >
                        {t("Select")}&nbsp;
                      </button>
                    </td>
                    <td data-title={t("UHID")}>{data?.PatientCode}&nbsp;</td>
                    <td data-title={t("Patient Name")}>
                      {data?.Title +
                        " " +
                        data?.FirstName +
                        " " +
                        data?.MiddleName +
                        " " +
                        data?.LastName}
                      &nbsp;
                    </td>
                    <td data-title={t("Age")}>{data?.Age}&nbsp;</td>
                    <td data-title={t("DOB")}>{dateConfig(data?.DOB)}&nbsp;</td>
                    <td data-title={t("Gender")}>{data?.Gender}&nbsp;</td>
                    <td data-title={t("Mobile")}>{data?.Mobile}&nbsp;</td>
                    <td data-title={t("City")}>{data?.City}&nbsp;</td>
                    <td data-title={t("State")}>{data?.State}&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </Tables>
          </div>
        )}

        {currentTableData?.length > 0 && (
          <div className="d-flex justify-content-end">
            <label className="mt-4 mx-2">{t("No Of Record/Page")}</label>
            <SelectBox
              className="mt-3 p-1 RecordSize mr-2"
              options={Record}
              selectedValue={PageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            />{" "}
            <Pagination
              className="pagination-bar mb-2"
              currentPage={currentPage}
              totalCount={tableData?.length}
              pageSize={PageSize}
              onPageChange={(page) => setCurrentPage(page)}
            />{" "}
          </div>
        )}
      </Dialog>
    </>
  );
};

export default OldPatientSearchModal;
