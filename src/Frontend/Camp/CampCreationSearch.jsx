import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import CampTestDetailModal from "../utils/CampTestDetailModal";
import Accordion from "@app/components/UI/Accordion";
import DatePicker from "../../components/formComponent/DatePicker";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";
import NoRecordFound from "../../components/formComponent/NoRecordFound";

const CampCreationSearch = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const [type, setType] = useState([]);
  const [show, setShow] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    FromDate: new Date(),
    FromTime: "00:00",
    ToDate: new Date(),
    ToTime: "23:59",
    Status: "0",
    Type: "0",
  });
  const dateSelect = (date, name) => {
    setPayload({
      ...payload,
      [name]: date,
    });
  };

  const StatusType = [
    {
      label: "All",
      value: "0",
    },
    {
      label: "Pending",
      value: "1",
    },
    {
      label: "Rejected",
      value: "2",
    },
  ];

  const getType = () => {
    axiosInstance
      .get("centre/getCentreType")
      .then((res) => {
        const data = res?.data?.message;
        const Type = data?.map((ele) => {
          return {
            value: ele?.id,
            label: ele?.Centretype,
          };
        });
        setType(Type);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (event) => {
    const { name, value } = event?.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleSearch = (data) => {
    setLoading(true);
    const updatedFormData = {
      fromDate: moment(payload?.FromDate).format("YYYY-MM-DD"),
      toDate: moment(payload?.ToDate).format("YYYY-MM-DD"),
      searchType: data,
      status: Number(payload?.Status),
      TypeID: payload?.Type,
    };
    axiosInstance
      .post("Camp/getCampCreation", updatedFormData)
      .then((res) => {
        const datas = res?.data?.message;
        if (datas?.length > 0) {
          setTableData(datas);
          setLoading(false);
        } else {
          setLoading(false);
          toast.error("No Camp Request Found.");
          setTableData([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleCampCreate = (ele) => {
    setLoading(true);
    axiosInstance
      .post("Camp/CreateCampRequest", {
        ID: ele?.ID,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setLoading(false);
        navigate("/camprequest", {
          state: { data: ele },
        });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong."
        );
        setLoading(false);
      });
  };

  const getColor = (ele) => {
    if (ele?.IsCreated === 1 && ele?.IsActive === 1) {
      return "#FFC0CB";
    } else if (ele?.IsCreated === 0 && ele?.IsActive === 1) {
      return "#b0c4de";
    } else if (ele?.IsActive === 0) {
      return "white";
    }
  };

  useEffect(() => {
    getType();
  }, []);
  return (
    <>
      {show && (
        <CampTestDetailModal
          selectedData={selectedData}
          show={show}
          onHide={() => {
            setShow(false);
          }}
        />
      )}
      <Accordion
        name={t("Camp Creation Search")}
        isBreadcrumb={true}
        defaultValue={true}
      >
        <div className="row px-2 mt-2 mb-1">
          <div className="col-sm-2 ">
            <DatePicker
              name="FromDate"
              id="FromDate"
              value={payload?.FromDate}
              onChange={dateSelect}
              maxDate={new Date()}
              placeholder=""
              lable={t("From Date")}
            />
          </div>
          <div className="col-sm-2 ">
            <DatePicker
              name="ToDate"
              id="ToDate"
              value={payload?.ToDate}
              onChange={dateSelect}
              maxDate={new Date()}
              minDate={new Date(payload?.FromDate)}
              placeholder=""
              lable={t("To Date")}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={[...StatusType]}
              name="Status"
              id="Status"
              selectedValue={payload?.Status}
              onChange={handleChange}
              placeholder=""
              lable={t("Status")}
            />
          </div>
          <div className="col-sm-3">
            <div style={{ display: "flex" }}>
              <div
                style={{
                  height: "20px",
                  width: "20px",
                  backgroundColor: "#b0c4de",
                  border: "1px solid black",
                  marginLeft: "20px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleSearch(1);
                }}
              ></div>
              <label style={{ marginRight: "25px", marginLeft: "5px" }}>
                {t("Pending")}
              </label>

              <div
                style={{
                  height: "20px",
                  width: "20px",
                  backgroundColor: "#FFC0CB",
                  border: "1px solid black",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleSearch(2);
                }}
              ></div>

              <label style={{ marginLeft: "5px", marginRight: "25px" }}>
                {t("Created")}
              </label>

              <div
                style={{
                  height: "20px",
                  width: "20px",
                  backgroundColor: "white",
                  border: "1px solid black",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleSearch(3);
                }}
              ></div>
              <label style={{ marginLeft: "5px" }}>{t("Rejected")}</label>
            </div>
          </div>
          <div className="col-sm-1">
            <button
              className="btn btn-sm btn-block btn-primary"
              onClick={() => handleSearch(0)}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </Accordion>
      <Accordion title={t("Search Detail")} defaultValue={true}>
        {loading ? (
          <Loading />
        ) : (
          <>
            {tableData?.length > 0 ? (
              <>
                <Tables>
                  <thead>
                    <tr>
                      <th>{t("S.No.")}</th>
                      <th>{t("Camp Centre")}</th>
                      <th>{t("Camp Name")}</th>
                      <th>{t("Camp Type")}</th>
                      <th>{t("Camp Start Date")}</th>
                      <th>{t("Created By")}</th>
                      <th>{t("Created Date")}</th>
                      <th>{t("Approved Date")}</th>
                      <th>{t("Create")}</th>
                      <th>{t("View Test")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.map((ele, index) => (
                      <tr
                        key={index}
                        style={{ backgroundColor: getColor(ele) }}
                      >
                        <td data-title={t("S.No.")}>{index + 1}</td>
                        <td data-title={t("Camp Centre")}>
                          {ele?.Company_Name}
                        </td>
                        <td data-title={t("Camp Name")}>{ele?.CampName}</td>
                        <td data-title={t("Camp Type")}>{ele?.CampType}</td>
                        <td data-title={t("Camp Start Date")}>
                          {ele?.StartDate}
                        </td>
                        <td data-title={t("Created By")}>{ele?.CreatedBy}</td>
                        <td data-title={t("Created Date")}>
                          {ele?.CreatedDate}
                        </td>
                        <td data-title={t("Approved Date")}>
                          {ele?.ApprovedDate}
                        </td>
                        <td
                          data-title={t("Create")}
                          style={{ textAlign: "center" }}
                        >
                          {ele.IsCreated == 0 && ele.IsActive == 1 ? (
                            <button
                              className="btn-xs btn-success btn w-7"
                              onClick={() => {
                                handleCampCreate(ele);
                              }}
                            >
                              {t("Create")}
                            </button>
                          ) : (
                            ""
                          )}
                        </td>
                        <td
                          data-title={t("View Test")}
                          style={{ textAlign: "center", fontWeight: "bold" }}
                        >
                          {
                            <i
                              className="fa fa-search"
                              onClick={() => {
                                setSelectedData(ele);
                                setShow("show");
                              }}
                            />
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Tables>
              </>
            ) : (
              <>
                <NoRecordFound />
              </>
            )}
          </>
        )}
      </Accordion>
    </>
  );
};

export default CampCreationSearch;
