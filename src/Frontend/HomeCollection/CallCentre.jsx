import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import Input from "../../components/formComponent/Input";
import { useTranslation } from "react-i18next";
import NewPatientDetailModal from "./NewPatientDetailModal";
import RegisteredPatientDetailModal from "./RegisteredPatientDetailModal";
import moment from "moment";
import { number } from "../../utils/helpers";
import AppointmentModal from "./AppointmentModal";
import HCHistoryModal from "./HCHistoryModal";
import { axiosInstance } from "../../utils/axiosInstance";

import Accordion from "@app/components/UI/Accordion";
import Tables from "../../components/UI/customTable";
import { Link } from "react-router-dom";
import { HCNewPatientForm } from "../../utils/Constants";
const CallCentre = () => {
  const { t } = useTranslation();
  const [mobile, setMobile] = useState("");
  const [mobileData, setMobileData] = useState([]);
  const [show, setShow] = useState(false);
  const [detailShow, setDetailShow] = useState(false);
  const [appointShow, setAppointShow] = useState(false);
  const [hcHistoryShow, sethcHistoryShow] = useState(false);
  const [showPatientData, setShowPatientData] = useState({});
  const [hcStatusShow, setHcStatusShow] = useState([]);

  const handleClose = () => {
    setShow(false);
    setShowPatientData({});
  };

  const handleCloseDetailShow = () => {
    setDetailShow(false);
  };

  const handleCloseAppoint = () => setAppointShow(false);
  const handleClosehcHistory = () => sethcHistoryShow(false);
  const handleOpenhcHistory = () => sethcHistoryShow(true);

  const handleClear = () => {
    setMobile("");
    setShowPatientData({});
  };

  const handleMobile = (e) => {
    setMobile(e.target.value);
  };

  const handlePatientData = (e) => {
    const keypress = [13];
    if (keypress.includes(e.which)) {
      e.preventDefault();

      getDataByMobileNo();
    }
  };
  const BindNumber = () => {
    axiosInstance
      .post("CustomerCare/BindOldPatient", {
        mobile: mobile,
      })
      .then((res) => {
        if (res?.data?.message?.length == 0) {
          setShowPatientData({});
          toast.error("No Patient Found");
          setShow(true);
        } else {
          setMobileData(res?.data?.message);
          setDetailShow(true);
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  console.log({ mobileData });
  const getDataByMobileNo = () => {
    if (mobile.length === 10) {
      axiosInstance
        .post("CommonController/CheckInvalidMobileNo", {
          MobileNo: mobile,
        })
        .then((res) => {
          console.log(res);
          BindNumber();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message == 1
              ? "Invalid Mobile Number"
              : BindNumber()
          );
        });
    } else {
      toast.error("Mobile length must be equal to 10");
    }
  };

  // CustomerCare / SaveNewPatientFromHIS;
  const handleCustomerCare = (data) => {
    // const payload = {
    //   ...HCNewPatientForm,
    //   Title: data?.title || "",
    //   PName: data?.NAME || "",
    //   HouseNo: data?.HouseNo,
    //   StreetName: data?.Street ? data?.Street : "",
    //   LocalityID: (data?.LocalityID).toString() || "0",
    //   CityID: (data?.CityID).toString() || "0",
    //   Pincode: data?.Pincode || "0",
    //   StateID: (data?.StateID).toString() || "0",
    //   CountryID: data?.CountryID ?( data?.CountryID).toString() : "10",
    //   Phone: data?.Phone ? data?.Phone : "",
    //   Mobile: data?.Mobile ? data?.Mobile : "",
    //   Email: data?.Email ? data?.Email : "",
    //   DOB: data?.DOB ? new Date(data?.DOB).toISOString() : "",
    //   Age: data?.Age || "",
    //   AgeYear: (data?.AgeYear).toString() || "",
    //   AgeMonth: Number(data?.AgeMonth) || 0,
    //   AgeDays: Number(data?.AgeDays) || 0,
    //   TotalAgeInDays: Number(data?.TotalAgeInDays) || 0,
    //   Gender: data?.Gender || "",
    //   Landmark: data?.Landmark ? data?.Landmark : "",
    //   PatientCode: data?.Patientid ? data?.Patientid : "",
    // };
    const payload = {
      ...HCNewPatientForm,
      Title: data?.title || "",
      PName: data?.NAME || "",
      HouseNo: data?.HouseNo,
      StreetName: data?.Street || "",
      LocalityID: data?.LocalityID != null ? data.LocalityID.toString() : "0",
      CityID: data?.CityID != null ? data.CityID.toString() : "0",
      Pincode: data?.Pincode || "0",
      StateID: data?.StateID != null ? data.StateID.toString() : "0",
      CountryID: data?.CountryID != null ? data.CountryID.toString() : "10",
      Phone: data?.Phone || "",
      Mobile: data?.Mobile || "",
      Email: data?.Email || "",
      DOB: data?.DOB ? new Date(data.DOB).toISOString() : "",
      Age: String(data?.Age) || "",
      AgeYear: data?.AgeYear !== undefined && data?.AgeYear !== null ? String(data.AgeYear) : "",
      AgeMonth: String(data?.AgeMonth) || "0",
      AgeDays: String(data?.AgeDays) || "0",
      TotalAgeInDays: Number(data?.TotalAgeInDays) || 0,
      Gender: data?.Gender || "",
      Landmark: data?.Landmark || "",
      PatientCode: data?.Patientid || "",
    };

    axiosInstance
      .post("CustomerCare/SaveNewPatientFromHIS", {
        NewPatientData: payload,
      })
      .then((res) => {
        console.log(res?.data, "new patiendt data---");
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          handleCloseDetailShow();
          setMobileData([]);

          setShowPatientData(data);
        } else {
          toast.error(res?.data?.message);
        }
        // setShowPatientData(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const handleSelectData = (ele) => {
    // console.log({ ele });
    ele?.FromHis && handleCustomerCare(ele);
    getHcHistory(ele);
  };

  const getHcHistory = (ele) => {
    axiosInstance
      .post("CustomerCare/BindOldPatientHomeCollectionData", {
        patient_id: ele?.Patientid,
        // patient_id: "AKKR.0000131251",
      })
      .then((res) => {
        console.log(res?.data?.message);
        setHcStatusShow(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };
  return (
    <>
      {show && (
        <NewPatientDetailModal
          show={show}
          handleClose={handleClose}
          mobile={mobile}
        />
      )}
      {detailShow && (
        <RegisteredPatientDetailModal
          setShow={setShow}
          mobileData={mobileData}
          detailShow={detailShow}
          handleCloseDetailShow={handleCloseDetailShow}
          handleSelectData={handleSelectData}
          handleCustomerCare={handleCustomerCare}
        />
      )}
      {appointShow && (
        <AppointmentModal
          showPatientData={showPatientData}
          appointShow={appointShow}
          handleCloseAppoint={handleCloseAppoint}
        />
      )}
      {hcHistoryShow && (
        <HCHistoryModal
          showPatientData={showPatientData}
          hcHistoryShow={hcHistoryShow}
          handleClosehcHistory={handleClosehcHistory}
        />
      )}
      {/* <Accordion
        name={t("Customer Care Management")}
        defaultValue={true}
        isBreadcrumb={true}
      > */}
      <Accordion
        name="Custmor Care Management"
        defaultValue={true}
        isBreadcrumb={true}
        linkTo="/HomeCollectionSearcH"
        linkTitle={
          <>
            <Link to="/PhelebotomistMapping">
              <button type="button" className="btn btn-sm btn-primary mr-3">
                <i className="fa fa-arrow-left  text-black "></i>
              </button>
            </Link>
            <button type="button" className="btn btn-sm btn-primary">
              <i className="fa fa-arrow-right  text-black "></i>
            </button>
          </>
        }
      >
        <div className="row pt-2 pl-2 pr-2 mb-1">
          <div className="col-md-1">
            <input
              type="radio"
              checked={true}
              name="Patient"
              className="mt-1"
            ></input>
            &nbsp;
            <label htmlFor="Patient" className="control-label">
              {t("Patient")}
            </label>
          </div>
          <div className=" col-md-2">
            <div className="d-flex">
              <div style={{ width: "86%" }}>
                <Input
                  type="number"
                  lable="Mobile No."
                  id="Mobile No"
                  className="required-fields"
                  placeholder=" "
                  name="Mobile"
                  value={mobile}
                  max={10}
                  onInput={(e) => number(e, 10)}
                  onKeyDown={handlePatientData}
                  onChange={handleMobile}
                  autoComplete="off"
                />
              </div>
              <div style={{ width: "10%" }}>
                <button
                  className="btn btn-sm btn-primary"
                  type="button"
                  onClick={getDataByMobileNo}
                >
                  <i className="fa fa-plus-circle fa-sm"></i>
                </button>
              </div>{" "}
            </div>
          </div>
          <div className="col-md-1">
            <button
              className=" btn btn-danger btn-sm"
              onClick={() => {
                handleClear();
              }}
            >
              {t("Clear")}
            </button>
          </div>
        </div>{" "}
      </Accordion>
      {Object.keys(showPatientData).length > 0 && (
        <>
          {" "}
          <Accordion title={t("Selected Patient Details")} defaultValue={true}>
            <Tables>
              <thead>
                <tr>
                  <th>{t("UHID")}</th>
                  <th>{t("Patient Name")}</th>
                  <th>{t("Age")}</th>
                  <th>{t("Gender")}</th>
                  <th>{t("Mobile")}</th>
                  <th>{t("State")}</th>
                  <th>{t("City")}</th>
                  <th>{t("Area")}</th>
                  <th>{t("Email")}</th>
                  <th>{t("DOB")}</th>
                  <th>{t("Pincode")}</th>
                  <th>{t("Last Call")}</th>
                  <th>{t("Reason of Call")}</th>
                  <th>{t("LastHC History")}</th> <th>{t("PrebookingID")}</th>{" "}
                  <th>{t("LastHCApp.Date")}</th> <th>{t("LastHCStatus")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td data-title="UHID">{showPatientData?.Patientid}</td>
                  <td data-title="NAME">{showPatientData?.NAME}</td>
                  <td data-title="Age">{showPatientData?.Age}</td>
                  <td data-title="Gender">{showPatientData?.Gender}</td>
                  <td data-title="Mobile">{showPatientData?.Mobile}</td>
                  <td data-title="StateName">{showPatientData?.StateName}</td>
                  <td data-title="City">{showPatientData?.City}</td>
                  <td data-title="LocalityName">
                    {showPatientData?.LocalityName}
                  </td>
                  <td data-title="Email">{showPatientData?.Email}</td>
                  <td data-title="DOB">
                    {moment(showPatientData?.DOB).format("DD-MMM-YYYY")}
                  </td>
                  <td data-title="Pincode">{showPatientData?.Pincode}</td>
                  <td data-title="LastCall">
                    {showPatientData?.LastCall}&nbsp;
                  </td>
                  <td data-title="ReasonofCall">
                    {showPatientData?.ReasonofCall}&nbsp;
                  </td>
                  <td data-title="HC History">
                    {hcStatusShow?.length > 0 && (
                      <button
                        type="button"
                        name="HC History"
                        className="btn btn-success btn-sm "
                        onClick={handleOpenhcHistory}
                      >
                        {t("HC History")}
                      </button>
                    )}
                    &nbsp;
                  </td>
                  <td data-title="PrebookingID">
                    {hcStatusShow[0]?.prebookingid}&nbsp;
                  </td>
                  <td data-title="LastHCApp.Date">
                    {hcStatusShow[0]?.appdate}&nbsp;
                  </td>
                  <td data-title="LastHCStatus">
                    {hcStatusShow[0]?.currentstatus}&nbsp;
                  </td>
                </tr>
              </tbody>
            </Tables>
            <div className="row mb-2 mt-2 px-1">
              <div className="col-sm-3">
                <button
                  className="btn btn-primary btn-sm"
                  style={{ height: "30px", fontSize: "15px" }}
                  onClick={() => setAppointShow(true)}
                >
                  {t("Home Collection")}
                </button>
              </div>
            </div>
          </Accordion>{" "}
        </>
      )}{" "}
    </>
  );
};

export default CallCentre;
