import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import moment from "moment";
import { isChecked } from "../util/Commonservices";
import Accordion from "@app/components/UI/Accordion";
import DatePicker from "../../components/formComponent/DatePicker";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";

const MergeDoctor = () => {
  const { t } = useTranslation();
  const [load, setLoad] = useState(false);

  const [payload, setPayload] = useState({
    formDate: new Date(),
    ToDate: new Date(),
    Status: "0",
  });

  const [tableData, setTableData] = useState([]);

  const handleDate = (value, name) => {
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleSelect = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
    handleSearch(value);
  };

  const handleSave = (url) => {
    const data = tableData.filter((ele) => ele?.isChecked === "1");
    if (data.length > 0) {
      axiosInstance
        .post(`DoctorReferal/${url}`, data)
        .then((res) => {
          toast.success(res?.data?.message);
          setTableData([]);
          handleSearch(payload?.Status);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
        });
    } else {
      toast.error("Select One Data");
    }
  };

  const handleCheck = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const data = [...tableData];
      data[index][name] = checked ? "1" : "0";
      setTableData(data);
    } else {
      const data = tableData.map((ele) => {
        return {
          ...ele,
          [name]: checked ? "1" : "0",
        };
      });
      setTableData(data);
    }
  };

  const handleSearch = (Status) => {
    setLoad(true);
    axiosInstance
      .post("DoctorReferal/getTempDoctorData", {
        FromDate: moment(payload?.formDate).format("YYYY-MM-DD 00:00:00"),
        ToDate: moment(payload?.ToDate).format("YYYY-MM-DD 23:59:59"),
        Status: Status,
      })
      .then((res) => {
        if (res?.data?.success) {
          const data = res?.data?.message;
          if (data?.length === 0) {
            toast.error("No data Found");
            setTableData([]);
            return;
          }
          const val = data.map((ele) => {
            return {
              ...ele,
              isChecked: "0",
            };
          });
          setTableData(val);
        } else {
          setTableData([]);
          toast.error(res?.data?.message);
        }
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occur"
        );
      });
  };
  return (
    <>
      <Accordion
        name={t("Merge Doctor")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row pt-2 pl-2 pr-2">
          <div className="col-sm-2">
            <DatePicker
              className="custom-calendar"
              maxDate={new Date()}
              value={payload?.formDate}
              name={"formDate"}
              id="From Date"
              lable={t("From Date")}
              onChange={handleDate}
            />
          </div>
          <div className="col-sm-2">
            <DatePicker
              className="custom-calendar"
              maxDate={new Date()}
              value={payload?.ToDate}
              minDate={payload?.formDate}
              name={"ToDate"}
              id="ToDate"
              lable={t("To Date")}
              onChange={handleDate}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={[
                {
                  label: "Non Merge",
                  value: "0",
                },
                {
                  label: "Merge",
                  value: "1",
                },
              ]}
              selectedValue={payload?.Status}
              name="Status"
              id="Status"
              labe={t("Status")}
              onChange={handleSelect}
            />
          </div>
          <div className="col-sm-1">
            {load ? (
              <Loading />
            ) : (
              <button
                className="btn btn-sm btn-success w-100"
                onClick={() => handleSearch(payload?.Status)}
              >
                {t("Search")}
              </button>
            )}
          </div>
        </div>
      </Accordion>
      {tableData?.length > 0 && (
        <Accordion title={t("Search Data")} defaultValue={true}>
          <div className="row p-2">
            <div className="col-12">
              <Tables>
                <thead>
                  <tr>
                    {[
                      "S.no",
                      "Doctor Name",
                      "Contact No.",
                      "Email",
                      <input
                        type="checkbox"
                        name={"isChecked"}
                        onChange={handleCheck}
                        checked={
                          tableData.length > 0
                            ? isChecked("isChecked", tableData, "1").includes(
                                false
                              )
                              ? false
                              : true
                            : false
                        }
                      />,
                    ].map((ele, index) => (
                      <th key={index}>{ele}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((ele, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{ele?.DoctorName}</td>
                      <td>{ele?.ContactNo}</td>
                      <td>{ele?.Email}</td>
                      <td>
                        <input
                          type="checkbox"
                          name={"isChecked"}
                          checked={ele?.isChecked === "1" ? true : false}
                          onChange={(e) => handleCheck(e, index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Tables>
              <div
                className="row"
                style={{
                  marginTop: "5px",
                //   display: "flex",
                //   justifyContent: "center",
                }}
              >
                {payload?.Status == 0 ? (
                  <div className="col-sm-2">
                    <button
                      className="btn btn-lg w-100 btn-success mx-2"
                      onClick={() => handleSave("InsertTempDoctor")}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="col-sm-2">
                    <button
                      className="btn btn-lg w-100 btn-danger mx-2"
                      onClick={() => handleSave("RemoveTempDoctor")}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Accordion>
      )}
    </>
  );
};

export default MergeDoctor;
