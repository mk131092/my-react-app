import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import DatePicker from "../../components/formComponent/DatePicker";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Loading from "../../components/loader/Loading";
import { Dialog } from "primereact/dialog";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
const SlotBookModal = ({
    show,
  slotOpen,
  setSlotOpen,
  handleSelectSlot,
  LTData,
  tableData,
}) => {
  const { t } = useTranslation();
  const statusArray = [
    { status: "Available", color: "rgb(111 224 161)" },
    { status: "Already Booked", color: "rgb(97 176 215)" },
    { status: "Selected", color: "rgb(241 173 199)" },
    { status: "Expired", color: "rgb(192 191 191)" },
    { status: "Selected Slot In Current Booking", color: "#e0ba5e" },
    { status: "Temporary Hold", color: "#f63d3d" },
  ];
  const [slotData, setSlotData] = useState([]);
  const [modality, setModality] = useState([]);
  const [shift, setShift] = useState([]);
  const [load, setLoad] = useState(false);
  const [payload, setPayload] = useState({
    InvestigationDate: new Date(),
    ModalityId: "",
    SelectedTimeSlot: "",
    ModalityName: "",
    ShiftName: "",
  });
  const handleSingleClick = (_, index) => {
    const updatedSlotData = slotData.map((item, idx) => ({
      ...item,
      isSelected: idx === index ? (item?.isSelected === 1 ? 0 : 1) : 0,
    }));
    setSlotData(updatedSlotData);
  };
  const checkSelectedDate = (Invdate) => {
    const currentTime = new Date(slotOpen?.data?.InvestigationDate);

    const currentYear = currentTime.getFullYear();
    const currentMonth = currentTime.getMonth();
    const currentDay = currentTime.getDate();

    const investigateYear = Invdate.getFullYear();
    const investigateMonth = Invdate.getMonth();
    const investigateDay = Invdate.getDate();
    return (
      currentYear === investigateYear &&
      currentMonth === investigateMonth &&
      currentDay === investigateDay
    );
  };
  const checkColor = (ele, Invdate) => {
    const { status, StartTime } = ele;
    const currentTime = new Date();
    const startTime = new Date(
      `${moment(Invdate).format("YYYY-MM-DD")}T${StartTime}`
    );

    if (checkDate(Invdate)) {
      if (startTime < currentTime) {
        return "rgb(192 191 191)";
      }
    }
    switch (status) {
      case "0":
        return "rgb(111 224 161)";
      case "1":
        return "rgb(97 176 215)";
      default:
        return "#000000";
    }
  };

  const setSelectedSlot = (ele, shift, id, name, date) => {
    const table = tableData?.map((ele) => {
      return {
        ...ele,
        InvestigationDate: moment(ele?.InvestigationDate).format("DD/MMM/YYYY"),
      };
    });
    const pay = {
      ...payload,
      ModalityId: id,
      ModalityName: name,
      ShiftName: shift,
      InvestigationDate: moment(date).format("DD/MMM/YYYY"),
    };

    const payloadKeys = Object.keys(pay);
    const matchedObjects = table.filter((item) => {
      return payloadKeys.every(
        (key) => item.hasOwnProperty(key) && item[key] === pay[key]
      );
    });

    return matchedObjects.some(
      (obj) => obj?.StartEndTimeSlot === ele?.StartEndTimeSlot
    );
  };
  // console.log(slotData);
  const BindShift = () => {
    axiosInstance
      .get("ModalityMaster/BindShift")
      .then((res) => {
        let data = res.data.message;
        let responce = data.map((ele) => {
          return {
            value: ele.ShiftName,
            label: ele.ShiftName,
          };
        });
        setShift(responce);
        BindModality(responce);
      })
      .catch((err) =>
        console.log(err?.res?.data ? err?.res?.data : "Something Went Wrong")
      );
  };
  const IshandleBookedSlot = (payload, ele, slotOpen) => {
    const bookingData = {
      StartEndTimeSlot: ele?.StartEndTimeSlot,
      InvestigationDate: payload?.InvestigationDate,
      ModalityId: payload?.ModalityId,
      ShiftName: payload?.ShiftName,
      CentreId: LTData?.CentreID,
      DepartmentId: slotOpen?.DepartmentID,
    };
    axiosInstance
      .post("ModalityMaster/SaveTimeSlotHold", {
        ...bookingData,
      })
      .then((res) => {
        if (res?.data?.message == "True") {
          handleSelectSlot(payload, ele, slotOpen);
          setSlotOpen({
            ...slotOpen,
            show: false,
          });
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message ?? "Something Went Wrong");
      });
  };
  const BindModality = (shift) => {
    axiosInstance
      .post("ModalityMaster/BindModality", {
        DepartmentId: slotOpen?.data?.DepartmentID,
      })
      .then((res) => {
        let data = res.data.message;
        let responce = data.map((ele) => {
          return {
            value: ele.Id,
            label: ele.NAME,
          };
        });
        setModality(responce);
        setPayload({
          ...payload,
          ShiftName:
            slotOpen?.data?.ShiftName && slotOpen?.data?.ShiftName != ""
              ? slotOpen?.data?.ShiftName
              : shift[0]?.value,
          ModalityId:
            slotOpen?.data?.ModalityId &&
            (slotOpen?.data?.ModalityId != "" ||
              slotOpen?.data?.ModalityId != 0)
              ? slotOpen?.data?.ModalityId
              : responce[0]?.value,
          ModalityName:
            slotOpen?.data?.ModalityName && slotOpen?.data?.ModalityName != ""
              ? slotOpen?.data?.ModalityName
              : responce[0]?.label,
          InvestigationDate:
            slotOpen?.data?.InvestigationDate &&
            slotOpen?.data?.InvestigationDate != ""
              ? slotOpen?.data?.InvestigationDate
              : new Date(),
        });
        GetInvestigationTimeSlot(
          slotOpen?.data?.ShiftName && slotOpen?.data?.ShiftName != ""
            ? slotOpen?.data?.ShiftName
            : shift[0]?.value,
          slotOpen?.data?.ModalityId &&
            (slotOpen?.data?.ModalityId != "" ||
              slotOpen?.data?.ModalityId != 0)
            ? slotOpen?.data?.ModalityId
            : responce[0]?.value,
          slotOpen?.data?.ModalityName && slotOpen?.data?.ModalityName != ""
            ? slotOpen?.data?.ModalityName
            : responce[0]?.label,
          slotOpen?.data?.InvestigationDate &&
            slotOpen?.data?.InvestigationDate != ""
            ? slotOpen?.data?.InvestigationDate
            : new Date()
        );
      })
      .catch((err) => {
        setSlotData([]);

        console.log(err?.res?.data ? err?.res?.data : "Something Went Wrong");
      });
  };

  useEffect(() => {
    BindShift();
  }, []);

  const checkDate = (Invdate) => {
    const currentTime = new Date();

    const currentYear = currentTime.getFullYear();
    const currentMonth = currentTime.getMonth();
    const currentDay = currentTime.getDate();

    const investigateYear = Invdate.getFullYear();
    const investigateMonth = Invdate.getMonth();
    const investigateDay = Invdate.getDate();

    return (
      currentYear === investigateYear &&
      currentMonth === investigateMonth &&
      currentDay === investigateDay
    );
  };
  const GetInvestigationTimeSlot = (shift, id, name, date) => {
    setLoad(true);
    axiosInstance
      .post("ModalityMaster/GetInvestigationTimeSlot", {
        ShiftName: shift,
        ModalityId: id,
        ModalityName: name,
        DepartmentId: slotOpen?.data?.DepartmentID,
        InvestigationDate: moment(date).format("DD/MMM/YYYY"),
        DoctorId: LTData?.DoctorID,
        BookingType: 2,
        ItemId: slotOpen?.data?.InvestigationID,
        CentreId: LTData?.CentreID,
      })
      .then((res) => {
        setLoad(false);

        const data = res?.data?.message;
        const datas = data?.map((ele) => {
          return {
            ...ele,
            color: checkColor(ele, date),
            SelectedSlot: setSelectedSlot(ele, shift, id, name, date),
          };
        });
        setSlotData(datas);
      })
      .catch((err) => {
        setLoad(false);
        setSlotData([]);
        console.log(err?.res?.data ? err?.res?.data : "Something Went Wrong");
      });
  };
  const handleChange = (e) => {
    const { name, value, selectedIndex } = e.target;
    const label = e?.target?.children?.[selectedIndex]?.text;

    if (name === "ModalityId") {
      setPayload({
        ...payload,
        [name]: value,
        ModalityName: label,
      });
      GetInvestigationTimeSlot(
        payload?.ShiftName,
        value,
        label,
        payload?.InvestigationDate
      );
    }
    if (name === "ShiftName") {
      setPayload({
        ...payload,
        [name]: value,
      });
      GetInvestigationTimeSlot(
        value,
        payload?.ModalityId,
        payload?.ModalityName,
        payload?.InvestigationDate
      );
    }
  };

  const dateSelect = (value, name) => {
    setPayload({
      ...payload,
      [name]: value,
    });

    GetInvestigationTimeSlot(
      payload?.ShiftName,
      payload?.ModalityId,
      payload?.ModalityName,
      value
    );
  };
  const theme = useLocalStorage("theme", "get");
  return (
    <>
      <Dialog
        header={"Slot Booking"}
        visible={show}
        onHide={() =>
          setSlotOpen({
            data: "",
            show: false,
          })
        }
        className={theme}
        draggable={false}
        // style={{width:"170vh"}}
      >
        <>
          <div
            style={{
              backgroundColor: "transparent",
              maxHeight: "600px",
              overflowY: "auto",
            }}
          >
            <div className="row mt-2">
              <div className="col-md-3">
                <DatePicker
                  name="InvestigationDate"
                  minDate={new Date()}
                  placeholder=" "
                  id="InvestigationDate"
                  lable="InvestigationDate"
                  onChange={dateSelect}
                  className="custom-calendar"
                  value={payload?.InvestigationDate}
                />
              </div>

              <div className="col-md-3">
                <SelectBox
                  name="ModalityId"
                  options={modality}
                  lable="ModalityId"
                  id="ModalityId"
                  selectedValue={payload?.ModalityId}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-3  ">
                <SelectBox
                  name="ShiftName"
                  options={shift}
                  lable="ShiftName"
                  id="ShiftName"
                  selectedValue={payload?.ShiftName}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="row d-flex align-items-stretch">
            <div className="col-sm-9 p-0 d-flex flex-column">
              <div className="">
                {load ? (
                  <Loading />
                ) : slotData?.length !== 0 ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        maxHeight: "400px",
                        overflowY: "auto",
                      }}
                    >
                      {slotData?.map((ele, index) => (
                        <>
                          <span style={{ padding: "5px", cursor: "pointer" }}>
                            <button
                              className="circle"
                              style={{
                                backgroundColor:
                                  ele?.SelectedSlot === true
                                    ? "#e0ba5e"
                                    : ele?.status == 1
                                    ? "rgb(97 176 215)"
                                    : ele?.tempHold == 1
                                    ? "#f63d3d"
                                    : ele?.isSelected == 1
                                    ? "rgb(241 173 199)"
                                    : ele?.color,
                                padding: "2px",
                                cursor: "pointer",
                              }}
                              title={
                                ele?.status == 0 && "Double Click to Select"
                              }
                              onClick={() => handleSingleClick(ele, index)}
                              onDoubleClick={() =>
                                IshandleBookedSlot(payload, ele, slotOpen?.data)
                              }
                              disabled={
                                !(ele?.status == 0) ||
                                ele?.color == "rgb(192 191 191)" ||
                                ele?.SelectedSlot === true ||
                                ele?.tempHold == 1
                              }
                            >
                              <label
                                style={{ color: "black", cursor: "pointer" }}
                              >
                                {ele?.StartEndTimeSlot}
                              </label>
                            </button>
                          </span>
                        </>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", fontSize: "15px" }}>
                    <label style={{ fontWeight: "bold", color: "#b24040" }}>
                      No Slot Found
                    </label>
                  </div>
                )}
              </div>
            </div>
            <div className="col-sm-3 pr-0 d-flex flex-column">
              <div
                className=""
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  unicodeBidi: "isolate",
                }}
              >
                {/* <span className="slot-modal-txt" htmlFor="Investigation Date">
                  {payload?.ShiftName}
                </span> */}
                {statusArray?.map((ele, _) => (
                  <>
                    <span style={{ padding: "2px" }}>
                      <button
                        className="minicircle"
                        style={{
                          backgroundColor: ele?.color,
                          padding: "2px",
                        }}
                      ></button>
                      <label style={{ marginLeft: "4px", marginRight: "8px" }}>
                        {ele?.status}
                      </label>
                    </span>
                  </>
                ))}
                <a style={{ color: "red" }}>
                  <i>* Only Available Slot Can be Selected</i>
                </a>
              </div>
            </div>
          </div>
        </>
      </Dialog>
    </>
  );
};

export default SlotBookModal;
