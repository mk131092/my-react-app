import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { PreventSpecialCharacterandNumber } from "../util/Commonservices";
import Accordion from "@app/components/UI/Accordion";
import { SelectBox } from "../../components/formComponent/SelectBox";
import DatePicker from "../../components/formComponent/DatePicker";
import Input from "../../components/formComponent/Input";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";
import HomeCollectionDetailModal from "./HomeCollectionDetailModal";
import NoRecordFound from "../../components/formComponent/NoRecordFound";

const HomeCollectionSearch = () => {
  const { t } = useTranslation();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [load, setLoad] = useState(false);
  const [index, setIndex] = useState();
  const [formData, setFormdata] = useState({
    DateOption: "hc.AppID",
    FromDate: new Date(),
    ToDate: new Date(),
    FromTime: "00:00:00",
    ToTime: "23:59:59",
    StateId: "",
    CityId: "",
    AreaId: "",
    PinCode: "",
    CentreId: "",
    PhelboId: "",
    RouteId: "",
    PName: "",
    Mobile: "",
    PreBookingId: "",
    Status: "",
  });
  const [collectionList, setCollectionList] = useState([]);
  const [show, setShow] = useState(false);
  const [areas, setAreas] = useState([]);
  const [Phelbos, setPhelbos] = useState([]);
  const [dropLocations, setDroplocations] = useState([]);
  const [routes, setroutes] = useState([]);
  const [statusDetails, setStatusDetails] = useState();
  const DateType = [
    { label: "Entry Date", value: "hc.EntryDateTime" },
    {
      label: "App Date",
      value: "hc.AppDateTime",
    },
    {
      label: "Last Status",
      value: "hc.CurrentStatusDate",
    },
    { label: "App ID", value: "hc.AppID" },
  ];

  const getStates = () => {
    axiosInstance
      .post("CommonHC/GetStateData", {
        BusinessZoneID: 0,
      })
      .then((res) => {
        const data = res.data.message;
        const States = data.map((ele) => {
          return {
            value: ele.ID,
            label: ele.State,
          };
        });
        States.unshift({ label: t("Select State"), value: "" });
        setStates(States);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSplitData = (id) => {
    const data = id?.split("#")[0];
    return data;
  };

  const fetchCities = (id) => {
    const postdata = {
      StateId: [Number(id)],
    };

    axiosInstance
      .post("CommonHC/GetCityData", postdata)
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: handleSplitData(ele.ID),
            label: ele.City,
          };
        });
        setCities(value);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getPinCode = (value) => {
    axiosInstance
      .post("CustomerCare/BindPinCode", {
        LocalityID: value,
      })
      .then((res) => {
        const data = res?.data?.message;

        setFormdata({
          ...formData,
          PinCode: data[0].pincode,
          AreaId: value,
        });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };
  const getLocalityDropDown = (value) => {
    axiosInstance
      .post("CustomerCare/BindLocality", {
        cityid: value,
      })
      .then((res) => {
        const data = res?.data?.message;
        const localities = data?.map((ele) => {
          return {
            ID: ele?.id,
            value: ele?.id,
            label: ele?.NAME,
          };
        });

        setAreas(localities);
      })
      .catch((err) => {
        toast.error(
          err?.res?.data ? err?.response?.data?.message : "Something Went Wrong"
        );
      });
  };

  const formChangeHandler = (event) => {
    const { name, value } = event?.target;

    if (name === "StateId") {
      fetchCities(value);
      setFormdata({
        ...formData,
        [name]: value,
        CityId: "",
        AreaId: "",
        PinCode: "",
        CentreId: "",
      });
      setAreas([]);
      setDroplocations([]);
    } else if (name === "CityId") {
      getLocalityDropDown(value);
      setFormdata({
        ...formData,
        [name]: value,
        AreaId: "",
        CentreId: "",
        PinCode: "",
      });
      setAreas([]);
      setDroplocations([]);
    } else if (name === "AreaId") {
      getPinCode(value);
      getDropLocation(value);
      setFormdata({
        ...formData,
        [name]: value,
        PinCode: "",
        CentreId: "",
      });
    } else if (name == "PinCode") {
      return;
    } else if (name === "PName") {
      setFormdata({
        ...formData,
        [name]: PreventSpecialCharacterandNumber(value)
          ? value
          : formData[name],
      });
    } else if (name === "Mobile") {
      if (value.length <= 10) {
        setFormdata({ ...formData, [name]: value });
      }
    } else {
      setFormdata({ ...formData, [name]: value });
    }
  };

  console.log(formData);
  const getDropLocation = (id) => {
    axiosInstance
      .post("HomeCollectionSearch/BindDropLocation", {
        AreaId: id,
      })
      .then((res) => {
        const data = res?.data?.message;

        const droplocations = data?.map((ele) => {
          return {
            value: ele?.DropLocationId,
            label: ele?.Centre,
          };
        });
        console.log(dropLocations);

        setDroplocations(droplocations);
      })
      .catch((err) => {
        toast.error("No DropLocation Found");
      });
  };

  const searchCollectionHandler = () => {
    setLoad(true);
    console.log(formData);

    const updatedFormData = {
      ...formData,
      FromDate: moment(formData?.FromDate).format("DD/MMM/YYYY"),
      ToDate: moment(formData?.ToDate).format("DD/MMM/YYYY"),
    };
    console.log(updatedFormData);

    axiosInstance
      .post("HomeCollectionSearch/GetData", updatedFormData)
      .then((res) => {
        console.log(res.data.message);
        setCollectionList(res.data.message);
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
        setCollectionList([]);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went wrong"
        );
      });
  };
  const handleClose = () => {
    setShow(false);
    searchCollectionHandler();
  };

  const bindPhelbo = () => {
    axiosInstance
      .get("HomeCollectionSearch/BindPhelebo")
      .then((res) => {
        const data = res.data.message;
        console.log(data);
        const Phelbos = data.map((ele) => {
          return {
            name: ele.name,
            value: ele.PhlebotomistID,
            label: ele.name,
          };
        });

        setPhelbos(Phelbos);
      })
      .catch((err) => {
        toast.error("Something Went wrong");
      });
  };

  const bindRoute = () => {
    axiosInstance
      .get("HomeCollectionSearch/BindRoute")
      .then((res) => {
        const data = res.data.message;
        console.log(data);
        const routes = data.map((ele) => {
          return {
            value: ele.RouteID,
            label: ele.Route,
          };
        });

        setroutes(routes);
      })
      .catch((err) => {
        toast.error("Something Went wrong");
      });
  };
  const dateSelect = (date, name, value) => {
    setFormdata({ ...formData, [name]: date });
  };
  const handleStatusButton = (status) => {
    const updatedFormData = {
      ...formData,
      FromDate: moment(formData?.FromDate).format("DD/MMM/YYYY"),
      ToDate: moment(formData?.ToDate).format("DD/MMM/YYYY"),
      Status: status,
    };

    console.log(updatedFormData);

    axiosInstance
      .post("HomeCollectionSearch/GetData", updatedFormData)
      .then((res) => {
        console.log(res.data.message);
        setCollectionList(res.data.message);
      })
      .catch((err) => {
        setCollectionList([]);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data.message
            : "Something Went wrong"
        );
      });
  };
  const getColor = (status) => {
    if (status) {
      switch (status) {
        case "Rescheduled":
          return "#ADD8E6";
        case "Pending":
          return "white";
        case "DoorLock":
          return "#4acfee";
        case "RescheduleRequest":
          return "#9370DB";
        case "CancelRequest":
          return "#FFC0CB";
        case "Checkin":
          return "rgb(244 244 165)";
        case "Completed":
          return "#90EE90";
        case "BookingCompleted":
          return "#00FFFF";
        case "Cancelled":
          return "#E75480";
        case "Canceled":
          return "#E75480";
      }
    }
  };
  const statusChecker = (status) => {
    console.log(status);
    switch (status) {
      case "BoookingCompleted":
        setStatusDetails({
          edit: false,
          cancel: false,
          reschedule: false,
        });
        break;
      case "Cancelled" || "Canceled":
        setStatusDetails({
          edit: false,
          cancel: false,
          reschedule: false,
        });
        break;
      case "Pending":
        setStatusDetails({
          edit: true,
          cancel: true,
          reschedule: true,
        });
        break;
      case "RescheduleRequest":
        setStatusDetails({
          edit: true,
          cancel: true,
          reschedule: true,
        });
        break;
      case "Rescheduled":
        setStatusDetails({
          edit: true,
          cancel: true,
          reschedule: true,
        });
        break;
      case "Checkin":
        setStatusDetails({
          edit: false,
          cancel: false,
          reschedule: false,
        });
        break;
      case "Completed":
        setStatusDetails({
          edit: false,
          cancel: false,
          reschedule: false,
        });
        break;
    }
  };

  useEffect(() => {
    getStates();
    bindPhelbo();
    bindRoute();
  }, []);
  return (
    <>
      {show && (
        <HomeCollectionDetailModal
          show={show}
          handleClose={handleClose}
          ele={collectionList[index]}
          statusDetails={statusDetails}
        />
      )}
      <Accordion
        name={t("Home Collection Search")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row pt-2 pl-2 pr-2">
          <div className="col-sm-1">
            <SelectBox
              name="DateOption"
              lable={t("From Date")}
              onChange={formChangeHandler}
              options={DateType}
              selectedValue={formData?.DateOption}
            />
          </div>
          <div className="col-sm-2">
            <DatePicker
              name="FromDate"
              className="custom-calendar"
              lable={t("From Date")}
              value={formData?.FromDate}
              onChange={dateSelect}
              maxDate={formData?.ToDate}
            />
          </div>
          <div className="col-sm-1">
            <Input
              type="text"
              lable={t("To Date")}
              placeholder=""
              name="FromTime"
              className="form-control input-sm"
              value={formData?.FromTime}
            />
          </div>
          <div className="col-sm-2">
            <DatePicker
              name="ToDate"
              className="custom-calendar"
              lable={t("To Date")}
              value={formData?.ToDate}
              onChange={dateSelect}
              minDate={formData?.FromDate}
            />
          </div>{" "}
          <div className="col-sm-1">
            <Input
              type="text"
              lable={t("To Time")}
              placeholder=""
              name="ToTime"
              className="form-control input-sm"
              value={formData?.ToTime}
            />
          </div>
          <div className="col-sm-1">
            <Input
              type="number"
              max={10}
              name="Mobile"
              lable={"Mobile No."}
              onChange={formChangeHandler}
              value={formData?.Mobile}
              placeholder=""
            />
          </div>
          <div className="col-sm-2">
            <Input
              name="PreBookingId"
              lable={"Prebooking Id"}
              onChange={formChangeHandler}
              value={formData?.PreBookingId}
              placeholder=""
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              name="StateId"
              options={states}
              placeholder={t("State")}
              label=""
              onChange={formChangeHandler}
              selectedValue={formData?.StateId}
            />
          </div>
        </div>
        <div className="row pl-2 pr-2">
          <div className="col-sm-1">
            <SelectBox
              name="CityId"
              placeholder={t("City")}
              lable=""
              options={[{ label: "Select City", value: "" }, ...cities]}
              selectedValue={formData?.CityId}
              onChange={formChangeHandler}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              name="AreaId"
              lable={t("Area")}
              placeholder=""
              options={[{ label: "Select Area", value: "" }, ...areas]}
              selectedValue={formData?.AreaId}
              onChange={formChangeHandler}
            />
          </div>
          <div className="col-sm-1">
            <Input
              name="PinCode"
              lable={t("Pincode")}
              value={formData?.PinCode}
              placeholder=""
              onChange={formChangeHandler}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              name="CentreId"
              lable={t("Drop Location")}
              placeholder=""
              selectedValue={formData?.DropLocationId}
              options={[
                { label: "Select Drop Location", value: "" },
                ...dropLocations,
              ]}
              onChange={formChangeHandler}
            />
          </div>
          <div className="col-sm-2">
            <Input
              name="PName"
              lable={t("Patient Name")}
              onChange={formChangeHandler}
              value={formData?.PName}
              placeholder=""
              max={30}
            />
          </div>
          <div className="col-sm-1">
            <SelectBox
              name="PhelboId"
              lable={t("Phelbo")}
              placeholder=""
              selectedValue={formData?.PhelboId}
              options={[{ label: "Select Phelbo", value: "" }, ...Phelbos]}
              onChange={formChangeHandler}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              name="RouteId"
              lable={t("Route")}
              placeholder=""
              options={[{ label: "Select Route", value: "" }, ...routes]}
              selectedValue={formData?.RouteId}
              onChange={formChangeHandler}
            />
          </div>
          <div className="col-md-1 col-sm-6 col-xs-12">
            {load ? (
              <Loading />
            ) : (
              <button
                type="button"
                className="btn btn-block btn-success btn-sm"
                onClick={searchCollectionHandler}
              >
                {t("Search")}
              </button>
            )}
          </div>
        </div>
      </Accordion>
      <Accordion title={t("Search Data")} defaultValue={true}>
        {collectionList.length > 0 ? (
          <>
            <div
              className="row hcStatus mt-1"
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div className="status-item">
                <button
                  style={{
                    height: "16px",
                    width: "16px",
                    backgroundColor: "white",
                    marginRight: "3px",
                  }}
                  onClick={() => {
                    handleStatusButton("Pending");
                  }}
                ></button>
                <label htmlFor="Pending" className="control-label">
                  {t("Pending")}
                </label>
              </div>
              <div className="status-item">
                <button
                  style={{
                    height: "16px",
                    width: "16px",
                    backgroundColor: "#ADD8E6",
                    marginRight: "3px",
                  }}
                  onClick={() => {
                    handleStatusButton("Rescheduled");
                  }}
                ></button>
                <label htmlFor="Rescheduled" className="control-label">
                  {t("Rescheduled")}
                </label>
              </div>
              <div className="status-item">
                <button
                  style={{
                    height: "16px",
                    width: "16px",
                    backgroundColor: "rgb(244 244 165)",
                    marginRight: "3px",
                  }}
                  onClick={() => {
                    handleStatusButton("Checkin");
                  }}
                ></button>
                <label htmlFor="CheckIn" className="control-label">
                  {t("CheckIn")}
                </label>
              </div>
              <div className="status-item">
                <button
                  style={{
                    height: "16px",
                    width: "16px",
                    backgroundColor: "#90EE90",
                    marginRight: "3px",
                  }}
                  onClick={() => {
                    handleStatusButton("Completed");
                  }}
                ></button>
                <label htmlFor="Completed" className="control-label">
                  {t("Completed")}
                </label>
              </div>
              <div className="status-item">
                <button
                  style={{
                    height: "16px",
                    width: "16px",
                    backgroundColor: "#00FFFF",
                    marginRight: "3px",
                  }}
                  onClick={() => {
                    handleStatusButton("BookingCompleted");
                  }}
                ></button>

                <label htmlFor="BookingCompleted" className="control-label">
                  {t("Booking Completed")}
                </label>
              </div>
              <div className="status-item">
                <button
                  style={{
                    height: "16px",
                    width: "16px",
                    backgroundColor: "#9370DB",
                    marginRight: "3px",
                  }}
                  onClick={() => {
                    handleStatusButton("RescheduleRequest");
                  }}
                ></button>
                <label htmlFor="RescheduleRequest" className="control-label">
                  {t("RescheduleRequest")}
                </label>
              </div>
              <div className="status-item">
                <button
                  style={{
                    height: "16px",
                    width: "16px",
                    backgroundColor: "#E75480",
                    marginRight: "3px",
                  }}
                  onClick={() => {
                    handleStatusButton("Canceled");
                  }}
                ></button>
                <label htmlFor="Cancelled" className="control-label">
                  {t("Cancelled")}
                </label>
              </div>
            </div>
            <div className="row px-2">
              <div className="col-12">
                <Tables>
                  <thead>
                    <tr>
                      <th>{t("#")}</th>
                      <th>{t("CreateDate")}</th>
                      <th>{t("CreateBy")}</th>
                      <th>{t("AppDate")}</th>
                      <th>{t("PrebookingID")}</th>
                      <th>{t("MobileNo")}</th>
                      <th>{t("PatientName")}</th>
                      <th>{t("City")}</th>
                      <th>{t("Area")}</th>
                      <th>{t("Pincode")}</th>
                      <th>{t("Route")}</th>
                      <th>{t("Phelebo")}</th>
                      <th>{t("Phelbo Mo.")}</th>
                      <th>{t("Phelebo Source")}</th>
                      <th>{t("Drop Location")}</th>
                      <th>{t("Status")}</th>
                      <th>{t("Paid Status")}</th>
                      <th>{t("Visit Id")}</th>
                      <th>{t("Phelbo Type")}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {collectionList.map((ele, index) => (
                      <>
                        <tr
                          key={index}
                          style={{ background: getColor(ele.CStatus) }}
                        >
                          <td data-title="#">
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                statusChecker(ele.CStatus);
                                setIndex(index);
                                setShow(true);
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                {index + 1}
                                <button>
                                  <i
                                    className="fa fa-plus"
                                    style={{ marginTop: "3px" }}
                                  ></i>
                                </button>
                              </span>
                            </div>
                          </td>
                          <td data-title="CreateDate">
                            {ele.EntryDateTime} &nbsp;
                          </td>
                          <td data-title="CreateBy">{ele.EntryByName}&nbsp;</td>
                          <td data-title="AppDate">{ele.AppDate}&nbsp;</td>
                          <td data-title="PrebookingID" className="text-center">
                            {ele.PreBookingId}&nbsp;
                          </td>
                          <td data-title="MobileNo">{ele.Mobile}&nbsp;</td>
                          <td data-title="CreateBy" className="text-center">
                            {ele.PatientName}&nbsp;
                          </td>
                          <td data-title="AppDate" className="text-center">
                            {ele.City}&nbsp;
                          </td>
                          <td data-title="Locality" className="text-center">
                            {ele.Locality} &nbsp;
                          </td>
                          <td data-title="Pincode" className="text-center">
                            {ele.PinCode}&nbsp;
                          </td>
                          <td data-title="Route" className="text-center">
                            {ele.RouteName}&nbsp;
                          </td>
                          <td data-title="Phelebo" className="text-center">
                            {ele.PhleboName}&nbsp;
                          </td>
                          <td data-title="Phelebo No.">{ele.PMobile} &nbsp;</td>
                          <td
                            data-title="Phelebo Source"
                            className="text-center"
                          >
                            {ele.PhelboSource} &nbsp;
                          </td>
                          <td data-title="Drop Location">
                            {ele.Centre} &nbsp;
                          </td>
                          <td data-title="Status">{ele.CStatus} &nbsp;</td>
                          <td data-title="Status">&nbsp;{ele.IsPaid} </td>
                          <td data-title="Visit Id">{ele.VisitId}&nbsp;</td>
                          <td data-title="Phelebo Type">
                            {ele.PhelboType}&nbsp;
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </Tables>
              </div>
            </div>
          </>
        ) : (
          <NoRecordFound />
        )}
      </Accordion>
    </>
  );
};

export default HomeCollectionSearch;
