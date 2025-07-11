import React, { useState } from "react";
import Accordion from "../../components/UI/Accordion";
import { useTranslation } from "react-i18next";
import DatePicker from "../../components/formComponent/DatePicker";
// import Loading from "../../components/common/Loading";
import Loading from "../../components/loader/Loading";
import { axiosInstance } from "../../utils/axiosInstance";
import moment from "moment";
import Tables from "../../components/UI/customTable";
import { toast } from "react-toastify";
import { tab } from "@testing-library/user-event/dist/cjs/setup/directApi.js";
const DepartmentMasterUpdate = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
  });
  const [tableData, setTableData] = useState("");

  const dateSelect = (value, name) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //   const TableData = (searchValue) => {
  //     setLoading(true);

  //     console.log("Search triggered with:", formData, searchValue);
  //     setTimeout(() => setLoading(false), 1000);
  //   };

  const getDepartmentData = () => {
  setLoading(true);

  axiosInstance
    .get("Department/GetDepartmentSyncDetail")
    .then((res) => {
      if (res?.data) {  // fixed typo: `re` -> `res`
        const data = res.data;
        setTableData(data);
      } else {
        toast.error("Something went wrong");
        setTableData("");
      }
      setLoading(false); // ensure it runs in both success branches
    })
    .catch((err) => {
      toast.error(
        err?.response?.data?.message || "Error Occurred"
      );
      setTableData("");
      setLoading(false);
    });
};

  const handleUpdate = () => {
    setLoading(true);

    axiosInstance
      .post("Department/DepartmentDataSync", {
        FromDate: moment(formData?.FromDate).format("YYYY-MM-DD"),
        ToDate: moment(formData?.ToDate).format("YYYY-MM-DD"),
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setLoading(false);
        getDepartmentData();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err.response.data.message
            : "Error Occurred"
        );
        setLoading(false);
      });
  };

  console.log({ tableData });
  return (
    <div>
      <Accordion
        name="Department Master Update"
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row mt-2">
          <div className="col-sm-2">
            <DatePicker
              className="custom-calendar"
              name="FromDate"
              value={formData?.FromDate}
              onChange={dateSelect}
              placeholder=" "
              id="FromDate"
              lable="FromDate"
              maxDate={new Date(formData?.ToDate)}
            />
          </div>

          <div className="col-sm-2">
            <DatePicker
              className="custom-calendar"
              name="ToDate"
              value={formData?.ToDate}
              onChange={dateSelect}
              placeholder=" "
              id="ToDate"
              lable="ToDate"
              maxDate={new Date()}
              minDate={new Date(formData?.FromDate)}
            />
          </div>

          <div className="col-sm-1">
            {loading ? (
              <Loading />
            ) : (
              <button
                type="button"
                className="btn btn-block btn-info btn-sm"
                onClick={getDepartmentData}
                // onClick={() =>
                //   TableData(
                //     document.getElementById("SampleStatusSearch")?.value || ""
                //   )
                // }
              >
                {t("Search")}
              </button>
            )}
          </div>
        </div>
      </Accordion>
      <Accordion title={<span>{t("Search Data")}</span>} defaultValue={true}>
        {tableData && (
          <Tables>
            <thead>
              <tr>
                {/* <th>{t("S.No")}</th> */}
                <th className="text-sm-center text-center">
                  {t("Last Update")}
                </th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {/* {tableData.map((ele, index) => { */}
              <tr>
                {/* <td>{index + 1}</td> */}
                <td className="text-center" data-title={t("Last Update")}>
                  {tableData?.message}
                </td>
                <td data-title={t("Action")}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleUpdate}
                  >
                    {t("Update Now")}
                  </button>
                </td>
              </tr>
            </tbody>
          </Tables>
        )}
      </Accordion>
    </div>
  );
};

export default DepartmentMasterUpdate;
