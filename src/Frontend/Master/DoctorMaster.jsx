import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { ActiveDoctor, Record } from "../../utils/Constants";
import Accordion from "@app/components/UI/Accordion";
import Input from "../../components/formComponent/Input";
import { IndexHandle, number } from "../../utils/helpers";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Loading from "../../components/loader/Loading";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
import Tables from "../../components/UI/customTable";
import { Link } from "react-router-dom";
import Pagination from "../../Pagination/Pagination";

const DoctorMaster = () => {
  const [details, setDetails] = useState({
    pagesize: 0,
    totalcount: 0,
  });
  const [Specialization, setSpecialization] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [payload, setPayload] = useState({
    DoctorName: "",
    Mobile: "",
    Specialization: "All",
    isActive: ActiveDoctor[0]?.value,
    SecondReferDoctor: 0,
  });
  const { t } = useTranslation();
  // const checkChanges = () => {
  //   for (let key in initialPayload) {
  //     if (payload[key] !== initialPayload[key]) {
  //       return true;
  //     }
  //   }
  //   return false;
  // };

  const [PageSize, setPageSize] = useState(15);
  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e.target;
    setPayload((payload) => ({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const getDropDownData = (name) => {
    axiosInstance
      .post("Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        if (name == "Specialization") {
          setSpecialization(value);
        }
      })
      .catch((err) => console.log(err));
  };

  const fetch = (flag) => {
    setLoading(true);
    axiosInstance
      .post("DoctorReferal/SearchDoctorData", {
        ...payload,
        Name: payload?.DoctorName,
        PageNo: flag ? 1 : currentPage,
        PageSize: PageSize,
      })
      .then((res) => {
        if (res?.data.success) {
          setTableData(res?.data?.message);
        } else {
          setTableData([]);
          toast.error(res?.data?.message);
        }
        setDetails((details) => ({
          ...details,
          totalcount: res?.data?.totalCount ?? 10,
        }));
        flag && setCurrentPage(1);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoading(false);
      });
  };
  const handleKeyDown = (e) => {
    if (e?.key === "Enter") {
      fetch(true);
    }
  };
  useEffect(() => {
    fetch(false);
  }, [currentPage, PageSize]);
  useEffect(() => {
    getDropDownData("Specialization");
  }, []);
  return (
    <>
      <Accordion
        name={t("Doctor Master")}
        isBreadcrumb={true}
        defaultValue={true}
        linkTo="/CreateDoctorReferal"
        linkTitle={t("Create New Doctor")}
      >
        <div className="row pt-2 pl-2 pr-2 mt-1">
          <div className="col-sm-2 ">
            <Input
              lable="Doctor Name"
              id="DoctorName"
              placeholder=" "
              name="DoctorName"
              value={payload?.DoctorName}
              type="text"
              onKeyDown={handleKeyDown}
              autoComplete={"off"}
              onChange={(e) => {
                handleSelectChange(e);
              }}
            />
          </div>
          <div className="col-sm-2">
            <Input
              lable="Mobile"
              id="Mobile"
              placeholder=" "
              type="number"
              name="Mobile"
              onInput={(e) => number(e, 10)}
              value={payload.Mobile}
              onChange={handleSelectChange}
              required
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={[
                { label: "Specialization", value: "" },
                ...Specialization,
              ]}
              lable="Specialization"
              id="Specialization"
              value={payload?.Specialization}
              name="Specialization"
              onChange={handleSelectChange}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={ActiveDoctor}
              value={payload?.isActive}
              name="isActive"
              lable="isActive"
              id="isActive"
              onChange={handleSelectChange}
            />
          </div>
          <div className="col-sm-2 mt-1 d-flex">
            <div className="mt-1">
              <input
                type="checkbox"
                checked={payload?.SecondReferDoctor}
                onChange={handleSelectChange}
                name="SecondReferDoctor"
              />
            </div>
            <label className="control-label ml-2">
              {t("Second Refer Doctor")}
            </label>
          </div>
          <div className="col-sm-1">
            <button
              type="button"
              className="btn btn-block btn-success btn-sm"
              onClick={() => fetch(true)}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </Accordion>
      <Accordion title={t("Search Data")} defaultValue={true}>
        {loading ? (
          <Loading />
        ) : (
          <>
            {tableData?.length > 0 ? (
              <>
                <Tables>
                  <thead>
                    <tr>
                      <th>{t("S.No")}</th>
                      <th>{t("Name")}</th>
                      <th>{t("Phone")}</th>
                      <th>{t("Specialization")}</th>
                      <th>{t("Email")}</th>
                      <th>{t("ClinicName")}</th>
                      <th>{t("Degree")}</th>
                      <th>{t("Address")}</th>
                      <th>{t("Mobile")}</th>
                      <th>{t("Active")}</th>
                      <th>{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.map((data, index) => (
                      <tr key={index}>
                        <td data-title={t("S.No")}>
                          {index + 1 + IndexHandle(currentPage, PageSize)}
                          &nbsp;
                        </td>
                        <td data-title={t("Name")}>{data?.Name}&nbsp;</td>
                        <td data-title={t("Phone")}>
                          {data?.Phone ? data?.Phone : "-"}&nbsp;
                        </td>
                        <td data-title={t("Specialization")}>
                          {data?.Specialization ? data?.Specialization : "-"}
                          &nbsp;
                        </td>
                        <td data-title={t("Email")}>
                          {data?.Email ? data?.Email : "-"}&nbsp;
                        </td>
                        <td data-title={t("ClinicName")}>
                          {data?.ClinicName ? data?.ClinicName : "-"}&nbsp;
                        </td>
                        <td data-title={t("Degree")}>
                          {data?.Degree ? data?.Degree : "-"}&nbsp;
                        </td>
                        <td data-title={t("Address")}>
                          {data?.Address ? data?.Address : "-"}&nbsp;
                        </td>
                        <td data-title={t("Mobile")}>
                          {data?.Mobile ? data?.Mobile : "-"}&nbsp;
                        </td>
                        <td data-title={t("Active")}>
                          {data?.isActive === 1 ? t("Active") : t("De-Active")}
                          &nbsp;
                        </td>
                        <td data-title={t("Action")} className="text-primary">
                          <Link
                            to="/CreateDoctorReferal"
                            state={{
                              url: "DoctorReferal/GetSingleDoctorData",
                              url1: "DoctorReferal/UpdateDoctorReferal",
                              id: data?.DoctorReferalID,
                            }}
                          >
                            {t("Edit")}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Tables>
                <div className="d-flex flex-wrap justify-content-end">
                  <label className="mt-4 mx-2">{t("No Of Record/Page")}</label>
                  <SelectBox
                    className="mt-3 p-1 RecordSize mr-2"
                    selectedValue={PageSize}
                    options={[
                      { label: "All", value: details?.totalcount },
                      ...Record,
                    ]}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  />
                  <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={details?.totalcount}
                    pageSize={PageSize}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              </>
            ) : (
              <NoRecordFound />
            )}
          </>
        )}
      </Accordion>
    </>
  );
};

export default DoctorMaster;
