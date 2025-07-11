import React, { useEffect, useState } from "react";
import {
  getAccessRateTypeNew,
  getBillingCategory,
} from "../util/Commonservices";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import { useTranslation } from "react-i18next";
import Accordion from "@app/components/UI/Accordion";
import DoctorShareTransferModal from "../utils/DoctorShareTransferModal";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";
import Input from "../../components/formComponent/Input";
import { IndexHandle, number } from "../../utils/helpers";
import { Record } from "../../utils/Constants";
import Pagination from "../../Pagination/Pagination";
import ReactSelect from "../../components/formComponent/ReactSelect";

const SetDoctorShare = () => {
  const [loading, setLoading] = useState(false);
  const [secondLoading, setSecondLoading] = useState(false);
  const [formTable, setFormTable] = useState([]);
  const [formTableNew, setFormTableNew] = useState([]);
  const [saveItem, setSaveItem] = useState([]);
  const [RateData, setRateData] = useState([]);
  const [DoctorData, setDoctorData] = useState([]);
  const [Category, setCategory] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [totalRecord, settotalRecord] = useState("");
  const [PageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);

  const [state, setState] = useState({
    ToggleData: "Department",
    searchType: "1",
    RateTypeID: "",
    DoctorID: "",
  });

  const { t } = useTranslation();
  const [payload, setPayload] = useState({
    DoctorID: "0",
    RateTypeID: "",
    DepartmentID: "",
    BillingCategoryID: "",
  });

  const [show, setShow] = useState(false);

  const handleChange = (name, value) => {
    if (name === "ToggleData") {
      if (value === "Department") {
        setFormTableNew([]);
        setPayload({
          DoctorID: "0",
          RateTypeID: "",
          DepartmentID: "",
          BillingCategoryID: "",
        });
        setState({ ...state, [name]: value });
      }

      if (value === "Item") {
        setState({
          ...state,
          [name]: value,
          RateTypeID: "",
          DoctorID: "",
        });

        setFormTable([]);
      }
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
    if (["DoctorID", "RateTypeID"].includes(name) && value === "") {
      setFormTable([]);
    }
  };

  const  handleSearchSelectChange =(label,value)=>{
    console.log({label,value})
      setState({
        ...state, [label]: String(value?.value)
      })
    if(["DoctorID", "RateTypeID"].includes(label) && value?.value ==="") {
      setFormTable([])
    }
  }
  const handleArrayChange = (e, index) => {
    const { name, value } = e.target;
    const data = [...formTable];
    data[index][name] = value > 100 ? "" : value;
    setFormTable(data);
  };

  const handleSelectChangeDoctor = (event) => {
    const { name, value } = event.target;
    setPayload({
      ...payload,
      [name]: value,
    });
    setCurrentPage(1)
  };

   const  handleSearchSelectChangeDoctor =(label,value)=>{
    console.log({label,value})
      setPayload({
        ...payload, [label]: String(value?.value)
      })
    if(label==="DoctorID" && value?.value==="") {
      setFormTableNew([]);
    }
    setCurrentPage(1)
  }


  const validation = () => {
    const data = formTableNew.filter(
      (ele) =>
        ["", 0].includes(ele?.DocShareAmt) && ["", 0].includes(ele?.DocSharePer)
    );
    return data.length > 0 ? true : false;
  };

  const isChecked = (name, state, value, id) => {
    if (id) {
      const data = state?.map((ele) => {
        if (ele?.TestID === id) {
          return ele[name] === value ? true : false;
        } else {
          return ele;
        }
      });
      return data;
    } else {
      const data = state?.map((ele) => {
        return ele[name] === value ? true : false;
      });
      return data;
    }
  };

  const handleChangeNew = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === "checkbox") {
      const data = formTableNew.map((ele) => {
        return {
          ...ele,
          [name]: checked,
        };
      });
      setFormTableNew(data);
    } else {
      if (name === "DocSharePer") {
        const datas = formTableNew.map((ele) => {
          return {
            ...ele,
            [name]: value > 100 ? "" : value,
            DocShareAmt: "",
            isChecked: ["", 0].includes(value) && false,
          };
        });
        setFormTableNew(datas);
        let data = parseInt(document.getElementById("DocSharePer").value);
        document.getElementById("DocShareAmt").value = "";
        if (data > 100) {
          document.getElementById("DocSharePer").value = "";
        }
      } else if (name === "DocShareAmt") {
        const datas = formTableNew.map((ele) => {
          return {
            ...ele,
            [name]: value,
            DocSharePer: "",
            isChecked: ["", 0].includes(value) && false,
          };
        });
        setFormTableNew(datas);
        document.getElementById("DocSharePer").value = "";
      }
    }
  };

  const handleChangeNewOne = (e, index) => {
    const { name, value, checked, type } = e.target;
    const val = [...formTableNew];
    if (type === "checkbox") {
      val[index][name] = checked;
      setFormTableNew(val);
    } else {
      val[index][name] = value;
      if (name === "DocShareAmt") {
        val[index].DocSharePer = "";
        val[index][name] = value;
        val[index]["isChecked"] = ["", 0].includes(value) && false;
      } else if (name === "DocSharePer") {
        val[index].DocShareAmt = "";
        val[index][name] = value > 100 ? "" : value;
        val[index]["isChecked"] = ["", 0].includes(value) && false;
      }

      setFormTableNew(val);
    }
  };
  const handleChangeDepShare = (e) => {
    const { name, value } = e.target;
    const datas = formTable.map((ele) => {
      return {
        ...ele,
        [name]: value > 100 ? "" : value,
      };
    });
    let data = parseInt(document.getElementById("DocSharePer").value);
    if (data > 100) {
      document.getElementById("DocSharePer").value = "";
    }
    setFormTable(datas);
  };
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
      })
      .catch((err) => console.log(err));
  };

  const getTableData = (data) => {
    setLoading(true);
    axiosInstance
      .post("DocShareMaster/getDepartmentDocData", data)
      .then((res) => {
        if (res?.data?.message?.length > 0) {
          setFormTable(res?.data?.message);
        } else {
          setFormTable([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const getDepartmentDocData = () => {
    setSecondLoading(true);
    axiosInstance
      .post("DocShareMaster/getDepartmentDocDataByItem", {
        ...payload,
        PageNo:currentPage,
        PageSize: PageSize,
        searchType: state?.searchType,
      })
      .then((res) => {
        const data = res?.data?.message;
        if (data.length > 0) {
          const val = data.map((ele) => {
            return {
              ...ele,
              isChecked: false,
            };
          });

          setFormTableNew(val);
          settotalRecord(res?.data?.totalRecord);
          // setCurrentPage(1);

        } else {
          toast.error("no data found");
          setFormTableNew([]);
        }
        setSecondLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "SomeThing Went Wrong"
        );
        setSecondLoading(false);
      });
  };

  const BindDoctorData = () => {
    axiosInstance
      .post("DoctorReferal/getDoctorDataBind")
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            label: ele?.DoctorName,
            value: ele?.DoctorID,
          };
        });
        val.unshift({ label: "Select Doctor", value: "" });
        setDoctorData(val);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "SomeThing Went Wrong"
        );
      });
  };

  useEffect(() => {
    if (
      state?.searchType === "1" &&
      state?.ToggleData === "Department" &&
      state?.RateTypeID
    ) {
      getTableData({
        searchType: state?.searchType,
        DoctorID: state?.DoctorID,
        RateTypeID: state?.RateTypeID,
      });
    }
  }, [state?.RateTypeID]);

  useEffect(() => {
    if (state?.searchType === "2" && state?.ToggleData === "Department") {
      if (state?.DoctorID) {
        getTableData({
          searchType: state?.searchType,
          DoctorID: state?.DoctorID,
          RateTypeID: state?.RateTypeID,
        });
      }
    }
  }, [state?.DoctorID, state?.RateTypeID]);

  const submit = () => {
    setLoading(true);
    axiosInstance
      .post("DocShareMaster/DefaulDepartmentShareCreate", {
        RateTypeID: state?.RateTypeID,
        DoctorID: state?.DoctorID,
        Data: formTable,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        getTableData({
          searchType: state?.searchType,
          DoctorID: state?.DoctorID,
          RateTypeID: state?.RateTypeID,
        });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong"
        );
        setLoading(false);
      });
  };

  const handleSubmit = () => {
    const finalData = formTableNew?.filter((ele) => ele?.isChecked);
    const payloadApi = finalData?.map((ele) => {
      return {
        ...ele,
        DocShareAmt: ele?.DocShareAmt ?? "0",
        DocSharePer: ele?.DocSharePer ?? "0",
      };
    });
    setSecondLoading(true);
    axiosInstance
      .post("DocShareMaster/SaveDocItemShare", {
        RateTypeID: payload?.RateTypeID,
        DoctorID: payload?.DoctorID,
        DepartmentID: payload?.DepartmentID,
        Data: payloadApi,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setCurrentPage(1);
        getDepartmentDocData();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong"
        );
        setSecondLoading(false);
      });
  };

  useEffect(() => {
    if (
      payload.BillingCategoryID &&
      payload?.DepartmentID &&
      payload?.RateTypeID &&
      (payload?.DoctorID !== "" || payload?.DoctorID === "0")
    ) {
      getDepartmentDocData();}
  }, [payload,currentPage,PageSize]);

  useEffect(() => {
    getAccessRateTypeNew(setRateData);
    getDepartment();
    BindDoctorData();
    getBillingCategory(setCategory);
  }, []);
  return (
    <>
      {show && (
        <DoctorShareTransferModal
          show={show}
          handleClose={() => setShow(false)}
        />
      )}
      <Accordion
        name={t("Set Doctor Share")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row pt-2 pl-2 pr-2">
          <div className="col-sm-1 mt-1 d-flex">
            <div className="mt-1">
              <input
                type="radio"
                name="searchType"
                id="searchType"
                value="1"
                checked={state?.searchType == "1" ? true : false}
                onChange={(e) => {
                  handleChange(e.target.name, e.target.value);
                  setPayload({ ...payload, DoctorID: "0" });
                }}
              />
            </div>
            <label className="col-sm-10 ml-2">{t("Master")}</label>
          </div>
          <div className="col-sm-1 mt-1 d-flex">
            <div className="mt-1">
              <input
                type="radio"
                name="searchType"
                id="searchType"
                value="2"
                checked={state?.searchType == "2" ? true : false}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </div>
            <label className="col-sm-10 ml-2">{t("Doctor")}</label>
          </div>
          <div className="col-sm-2">
            <button
              type="submit"
              className="btn btn-block btn-primary btn-sm w-100"
              onClick={() => setShow(true)}
            >
              {t("Transfer Doctor Share")}
            </button>
          </div>
          <div className="col-sm-1">
            <button
              type="button"
              onClick={() => handleChange("ToggleData", "Department")}
              disabled={state?.ToggleData==="Department" ? true : false}
              className={`btn btn-success w-100`}
            >
              {t("Department")}
            </button>
          </div>
          <div className="col-sm-1">
            <button
              type="button"
              onClick={() => handleChange("ToggleData", "Item")}
              disabled={state?.ToggleData==="Item" ? true : false}
              className={`btn btn-sm ${state?.ToggleData === "Item"
                  ? "btn-success"
                  : "btn-success"
              } w-100`}
            >
              {t("Item")}
            </button>
          </div>
        </div>
      </Accordion>
      <Accordion title={state?.ToggleData === "Department" ? t("Department Search Data") :t("Item Search Data") } defaultValue={true}>
        {state?.ToggleData === "Department" && (
          <div className="row pt-2 pl-2 pr-2">
            <div className="col-sm-2">
              <ReactSelect
                dynamicOptions={[{ label: "SelectRateType", value: "" }, ...RateData]}
                name="RateTypeID"
                lable={t("Rate Type")}
                id="RateTypeID"
                removeIsClearable={true}
                placeholderName={t("All Rate Type")}
                value={state?.RateTypeID}
                onChange={handleSearchSelectChange}
              />
                         </div>
            {state?.searchType == "2" && (
              <div className="col-sm-2">

                <ReactSelect
                  dynamicOptions={DoctorData}
                  name="DoctorID"
                  lable={t("Doctor")}
                  id="DoctorID"
                  removeIsClearable={true}
                  placeholderName={t("Doctor")}
                  value={state?.DoctorID}
                  onChange={handleSearchSelectChange}
                  isDisabled={state?.RateTypeID ? false : true}
                />
                
              </div>
            )}
          </div>
        )}
        {loading ? (
          <Loading />
        ) : (
          <>
            {formTable.length > 0 && (
              <>
                <div className="row p-2">
                  <div className="col-12">
                    <Tables>
                      <thead>
                        <tr>
                          <th>{t("S.No")}</th>
                          <th>{t("Department")}</th>
                          <th>
                            {t("Percentage %")}
                            <Input
                              type="number"
                              id="DocSharePer"
                              name="DocSharePer"
                              placeholder={t("Enter Percent(%)")}
                              onChange={handleChangeDepShare}
                            />
                          </th>
                        </tr>
                      </thead>
                      {formTable.map((ele, index) => (
                        <tbody>
                          <tr key={index}>
                            <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                            <td data-title={t("Department")}>
                              {ele?.Department}&nbsp;
                            </td>
                            <td data-title={t("Enter Percent%")}>
                              <Input
                                type="number"
                                name="DocSharePer"
                                id="DocSharePer"
                                placeholder=""
                                value={ele?.DocSharePer}
                                onChange={(e) => handleArrayChange(e, index)}
                              />
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </Tables>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-1 mb-2 ml-2">
                    <button
                      type="button"
                      className="btn btn-block btn-success btn-sm"
                      id="btnSave"
                      title="Save"
                      options={saveItem}
                      onClick={submit}
                    >
                      {t("Save")}
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
        {state?.ToggleData === "Item" && (
          <>
            <div className="row pt-2 pl-2">
              <div className="col-sm-2">
                <ReactSelect
                dynamicOptions={[
                  { label: "Select RateType", value: "" },
                  ...RateData,
                ]}
                name="RateTypeID"
                lable={t("Rate Type")}
                id="RateTypeID"
                removeIsClearable={true}
                placeholderName={t("All Rate Type")}
                value={payload?.RateTypeID}
                onChange={handleSearchSelectChangeDoctor}
              />
              </div>
              <div className="col-sm-2">
                <ReactSelect
                dynamicOptions={[
                  { label: "Select Department", value: "" },
                    ...DepartmentData,
                ]}
                name="DepartmentID"
                lable={t("Department")}
                id="DepartmentID"
                removeIsClearable={true}
                placeholderName={t("Department")}
                value={payload?.DepartmentID}
                onChange={handleSearchSelectChangeDoctor}
              />
              </div>
              <div className="col-sm-2">
                <SelectBox
                  options={[
                    { label: "Select Category", value: "" },
                    ...Category,
                  ]}
                  name={"BillingCategoryID"}
                  id="BillingCategoryID"
                  placeholder=""
                  lable={t("Category")}
                  selectedValue={payload?.BillingCategoryID}
                  onChange={handleSelectChangeDoctor}
                />
              </div>
              {state?.searchType == "2" && (
                <>
                  <div className="col-sm-2">
                  <ReactSelect
                  dynamicOptions={DoctorData}
                  name="DoctorID"
                  lable={t("Doctor")}
                  id="DoctorID"
                  removeIsClearable={true}
                  placeholderName={t("Doctor")}
                  value={payload?.DoctorID}
                  onChange={handleSearchSelectChangeDoctor}
                />
                   
                  </div>
                </>
              )}
            </div>
            {secondLoading ? (
              <Loading />
            ) : (
              <>
                {formTableNew.length > 0 && (
                  <div className="row p-2">
                    <div className="col-12">
                      <Tables>
                        <thead>
                          <tr>
                            <th>{t("S.No")}</th>
                            <th>{t("Test Code")}</th>
                            <th>{t("Investigation Name")}</th>
                            <th>
                              {t("DocShare Amt")}
                              <Input
                                className="form-control ui-autocomplete-input input-sm"
                                type="number"
                                name="DocShareAmt"
                                id="DocShareAmt"
                                placeholder={t("Enter Amount")}
                                onChange={handleChangeNew}
                              />
                            </th>
                            <th>
                              {t("DocShare Per (%)")}
                              <Input
                                className="form-control ui-autocomplete-input input-sm"
                                type="number"
                                name="DocSharePer"
                                id="DocSharePer"
                                placeholder={t("Enter Percent(%)")}
                                onChange={handleChangeNew}
                              />
                            </th>
                            <th>
                              <input
                                type="checkbox"
                                name="isChecked"
                                onChange={handleChangeNew}
                                disabled={validation()}
                                checked={
                                  formTableNew?.length > 0
                                    ? isChecked(
                                        "isChecked",
                                        formTableNew,
                                        true
                                      ).includes(false)
                                      ? false
                                      : true
                                    : false
                                }
                              />
                            </th>
                          </tr>
                        </thead>
                        {formTableNew.map((ele, index) => (
                          <tbody>
                            <tr key={index}>
                              <td data-title={t("S.No")}>{index + 1 + IndexHandle(currentPage,PageSize)}&nbsp;</td>
                              <td data-title={t("Test Code")}>
                                {ele?.TestCode}&nbsp;
                              </td>
                              <td data-title={t("Investigation Name")}>
                                {ele?.InvestigationName}&nbsp;
                              </td>
                              <td data-title={t("DocShare Amt")}>
                                <Input
                                  type="number"
                                  name="DocShareAmt"
                                  id="DocShareAmt"
                                  onInput={(e) => number(e, 6)}
                                  value={ele?.DocShareAmt}
                                  onChange={(e) => handleChangeNewOne(e, index)}
                                />
                              </td>
                              <td data-title={t("DocSharePer")}>
                                <Input
                                  type="number"
                                  name="DocSharePer"
                                  id="DocSharePer"
                                  onInput={(e) => number(e, 3)}
                                  value={ele?.DocSharePer}
                                  onChange={(e) => handleChangeNewOne(e, index)}
                                />
                              </td>
                              <td data-title={t("Status")}>
                                <input
                                  type="checkbox"
                                  name="isChecked"
                                  checked={ele?.isChecked}
                                  disabled={
                                    ele?.DocSharePer || ele?.DocShareAmt
                                      ? false
                                      : true
                                  }
                                  onChange={(e) => handleChangeNewOne(e, index)}
                                />
                              </td>
                            </tr>
                          </tbody>
                        ))}
                      </Tables>
                      {formTableNew?.length > 0 &&
                        isChecked("isChecked", formTableNew, true).includes(
                          true
                        ) && (
                          <div className="box-footer">
                            <div className="col-sm-1">
                              <button
                                type="button"
                                className="btn btn-block btn-success btn-sm"
                                id="btnSave"
                                title="Save"
                                onClick={handleSubmit}
                              >
                                {t("Save")}
                              </button>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                )}
                {formTableNew?.length > 0 && (
                  <div className="d-flex flex-wrap justify-content-end">
                    <label className="mt-4 mx-2">{t("No Of Record/Page")}</label>
                    <SelectBox
                      className="mt-3 p-1 RecordSize mr-2"
                      selectedValue={PageSize}
                      options={[
                        // { label: "All", value: totalRecord },
                        ...Record,
                      ]}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value))
                        setCurrentPage(1)
                      }}
                    />
                    <Pagination
                      className="pagination-bar"
                      currentPage={currentPage}
                      totalCount={totalRecord}
                      pageSize={PageSize}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </Accordion>
    </>
  );
};

export default SetDoctorShare;
