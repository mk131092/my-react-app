import React, { useState } from "react";
import parse from "html-react-parser";
import { toast } from "react-toastify";
import { dateConfig, isChecked } from "../../utils/helpers";
import CustomModal from "../utils/CustomModal";
import RejectModal from "../utils/RejectModal";
import { axiosInstance } from "../../utils/axiosInstance";
import Tables from "../../components/UI/customTable";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
import Loading from "../../components/loader/Loading";
import HoldReason from "../utils/HoldReason";
import Medical from ".././Images/Medical.png";
import file from ".././Images/file.png";
import SampleHisto from "./SampleHisto";
import { SelectBox } from "../../components/formComponent/SelectBox";

import { useTranslation } from "react-i18next";
import Urgent from ".././Images/urgent.gif";
import { HistoSeries } from "../../utils/Constants";

import UpdateRemark from "../utils/UpdateRemark";
import Tooltip from "../../components/formComponent/Tooltip";
function DepartmentReceiveTable({
  drdata,
  show,
  show2,
  TableData,
  setDrData,
  pageType,
  organ,
  doctorAdmin,
  formData,
  searchstatus,
}) {
  const [modal, setModal] = useState(false);
  const [visitID, setVisitID] = useState();
  const [show1, setShow1] = useState({
    modal: false,
    data: {},
  });
  const [load, setLoad] = useState({
    index: -1,
    load: false,
  });
  const [showHold, setShowHold] = useState({
    show: false,
    data: "",
    index: -1,
  });

  const [t] = useTranslation();
  const [showUpdateRemark, setShowUpdateRemark] = useState({
    modal: false,
    data: "",
    index: -1,
  });

  const handleShow = (data, type) => {
    setShow1({
      modal: type,
      data: data,
    });
  };
  const handleCheckbox = (e) => {
    const { checked } = e.target;
    const data = drdata?.map((ele) => {
      return {
        ...ele,
        IsChecked: checked ? 1 : 0,
      };
    });

    setDrData(data);
  };
  const handleTestID = (e, index) => {
    const { name, checked } = e.target;
    const datas = [...drdata];
    datas[index][name] = checked ? 1 : 0;
    setDrData(datas);
  };
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const data = [...drdata];

    data[index][name] = value;
    setDrData(data);
  };

  const handleHold = (data, index) => {
    if (load?.load) {
      toast.warn("Please Wait Other Test Are Holding");
    } else {
      setLoad({
        load: true,
        index: index,
      });
      axiosInstance
        .post(`${data?.Status == "16" ? "SC/UnHoldSample" : "SC/HoldSample"}`, {
          data: [
            {
              LedgerTransactionID: data?.LedgerTransactionID,
              VisitNo: data?.VisitNo,
              TestID: data?.TestID,
              Test: data?.ItemName,
              CentreID: data?.CentreID,
              SINNo: data?.SinNo,
              HoldReason: data?.HoldReason?.trim(),
            },
          ],
        })
        .then((res) => {
          setLoad({
            load: false,
            index: -1,
          });
          setShowHold({ data: "", show: false, index: -1 });
          toast.success(res?.data?.message);
          TableData(2);
        })
        .catch((err) => {
          setLoad({
            load: false,
            index: -1,
          });
          setShowHold({ data: "", show: false, index: -1 });
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          );
        });
    }
  };
  console.log(drdata);
  return (
    <>
      {show1?.modal && (
        <RejectModal
          show={show1?.modal}
          handleShow={() => handleShow(null, false)}
          data={show1?.data}
          TableData={TableData}
        />
      )}

      {showHold?.show && (
        <HoldReason
          showHold={showHold}
          setShowHold={setShowHold}
          handleHold={handleHold}
        />
      )}
      {showUpdateRemark?.modal && (
        <UpdateRemark
          show={showUpdateRemark?.modal}
          handleShow={() =>
            setShowUpdateRemark({ modal: false, data: "", index: -1 })
          }
          state={showUpdateRemark?.data}
          PageName={showUpdateRemark?.data?.Remarks}
          status={searchstatus}
          title={"Remarks"}
          TableData={TableData}
        />
      )}
      {drdata.length > 0 ? (
        <div className="row px-2 mt-2 mb-2">
          <div className="col-12">
            <Tables paginate={"true"} data={drdata}>
              <thead>
                <tr>
                  <th>{t("S.No")}</th>
                  <th>{t("Barcode No")}</th>
                  <th>{t("Reg Date")}</th>
                  <th>{t("Visit No")}</th>
                  <th>{t("UHID")}</th>
                  <th>{t("Name")}</th>
                  <th>{t("Mobile")}</th>
                  <th>{t("Remarks")}</th>
                  <th>{t("Age")}</th>
                  <th>{t("SampleType")}</th>
                  <th>{t("Department")}</th>
                  <th>{t("Organ")}</th>
                  <th>{t("Vial Qty")}</th>
                  <th>{t("Test")}</th>
                  <th>{t("Reject")}</th>
                  <th>{t("Hold")}</th>
                  <th
                    data-toggle="tooltip"
                    data-placement="top"
                    title={t("Uploaded Document")}
                  >
                    {t("U.D")}
                  </th>
                  <th
                    data-toggle="tooltip"
                    data-placement="top"
                    title={t("Medical History")}
                  >
                    {t("M.H")}
                  </th>

                  {pageType == 2 && (
                    <th className="text-center">
                      <input
                        type="checkbox"
                        className="mt-2"
                        checked={
                          drdata?.length > 0
                            ? isChecked("IsChecked", drdata, 1).includes(false)
                              ? false
                              : true
                            : false
                        }
                        onChange={handleCheckbox}
                      />
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {drdata.map((data, index) => (
                  <tr
                    key={index + 1}
                    style={{
                      backgroundColor: data?.isOutSource == 1 ? "pink" : "",
                    }}
                  >
                    <td
                      data-title="SNo"
                      className={`color-Status-${data.Status}`}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>{index + 1}</div>
                        {data.StatSample == 1 ? (
                          <div>
                            <span
                              className="fa fa-cog fa-spin"
                              data-toggle="tooltip"
                              data-placement="top"
                              title="STATSample"
                            ></span>
                          </div>
                        ) : (
                          <> &nbsp;</>
                        )}{" "}
                        &nbsp;
                        <div>
                          <i
                            className="fa fa-search"
                            onClick={() => {
                              setModal(true);
                              setVisitID(data?.VisitNo);
                            }}
                          />
                        </div>{" "}
                        &nbsp; &nbsp;
                        {data?.isUrgent == 1 && (
                          <div>
                            <img src={Urgent} className="sizeicon"></img>
                          </div>
                        )}
                      </div>
                    </td>

                    <td data-title={"SinNo"}>{data?.SinNo}</td>
                    <td data-title={"Date"}>
                      <div>{dateConfig(data.Date)}</div>
                    </td>
                    <td data-title={"VisitNo"}>{data?.VisitNo}</td>
                    <td data-title={"PatientCode"}>{data?.PatientCode}</td>
                    <td data-title={"PName"}>{data?.PName}</td>
                    <td data-title={"Mobile"}>{data?.Mobile}</td>
                    <td data-title={"Remarks"}>
                      <div
                        className="m-0 p-0"
                        onClick={() => {
                          setShowUpdateRemark({
                            modal: true,
                            data: data,
                            index: index,
                          });
                        }}
                      >
                        {!data?.Remarks ? (
                          <i className="bi bi-chat-right-text m-0 text-icon-size-comment ml-2"></i>
                        ) : (
                          <div className="d-flex align-items-center blink-icon">
                            {data?.Remarks
                              ? data?.Remarks.length > 20
                                ? data?.Remarks.slice(0, 15) + "..."
                                : data?.Remarks
                              : ""}
                          </div>
                        )}
                      </div>
                    </td>
                    <td data-title={"Gender"}>
                      <div>
                        {data?.Age}/{data?.Gender}
                      </div>
                    </td>
                    <td data-title={"SampleName"}>
                      <div>&nbsp;{data?.SampleName}</div>
                      {data?.IsHisto == 1 && (
                        <div className="organInput">
                          {" "}
                          <SampleHisto
                            lable="No. Of Container"
                            name="Container"
                            handleChange={(e) => handleChange(e, index)}
                            value={data?.Container}
                          />
                          <SampleHisto
                            lable="No. Of Slide"
                            name="Slide"
                            handleChange={(e) => handleChange(e, index)}
                            value={data?.Slide}
                          />
                          <SampleHisto
                            lable="No. Of Block"
                            name="Block"
                            handleChange={(e) => handleChange(e, index)}
                            value={data?.Block}
                          />
                          <SelectBox
                            className="HistoColor mt-2"
                            options={doctorAdmin}
                            lable="Doctor"
                            name="Doctor"
                            onChange={(e) => handleChange(e, index)}
                            selectedValue={data?.Doctor}
                          />
                        </div>
                      )}
                    </td>
                    <td data-title={"Department"}>{parse(data?.Department)}</td>
                    <td data-title={"Organ"}>&nbsp;
                      {data?.IsHisto == 1 && (
                        <SelectBox
                          className="organInput HistoColor"
                          options={organ}
                          // lable="Organ"
                          name="Organ"
                          onChange={(e) => handleChange(e, index)}
                          selectedValue={data?.Organ}
                        />
                      )}
                    </td>
                    <td data-title={"Vial Qty"}>&nbsp;{data?.VialQty}</td>
                    <td data-title={"ItemName"}>{parse(data?.Test)}</td>
                    {data?.Status === 4 || data?.Status === 5 ? (
                      <td></td>
                    ) : (
                      <td data-title={"Reject"}>
                        <div
                          onClick={() => handleShow(data, true)}
                          className="m-0 p-0"
                        >
                          <Tooltip label="Reject">
                            <i
                              className="bi bi-ban m-0 text-icon-size-comment ml-3"
                              style={{ color: "red" }}
                            ></i>
                          </Tooltip>
                        </div>
                      </td>
                    )}
                    {data?.Status === 4 || data?.Status === 5 ? (
                      <td></td>
                    ) : (
                      <td
                        data-title={`${data?.Status == "16" ? "UnHold" : "Hold"}`}
                      >
                        {load?.load && load?.index == index ? (
                          <Loading />
                        ) : (
                          <div
                            onClick={() => {
                              if (data?.Status == "16") {
                                handleHold(data, index);
                              } else
                                setShowHold({
                                  data: { ...data },
                                  show: true,
                                  index: index,
                                });
                            }}
                          >
                            {data?.Status == "16" ? (
                              <Tooltip label={`UnHold`}>
                                <i
                                  className="bi bi-play-circle m-0 text-icon-size-comment ml-2"
                                  style={{
                                    color: "green",
                                  }}
                                  type="button"
                                ></i>
                              </Tooltip>
                            ) : (
                              <Tooltip label="Hold">
                                <i
                                  className="bi bi-stop-circle m-0 text-icon-size-comment ml-2"
                                  style={{
                                    color: "#d9070e",
                                  }}
                                  type="button"
                                ></i>{" "}
                              </Tooltip>
                            )}
                          </div>
                        )}
                      </td>
                    )}

                    <td data-title={"File Count"}>
                      <div
                        className="text-primary "
                        style={{
                          cursor: "pointer",
                          color: data?.UploadDocumentCount > 0 ? "#4ea30c" : "",
                        }}
                        onClick={() => {
                          show2({
                            modal: true,
                            data: data?.PatientGuid,
                            index: index,
                          });
                        }}
                      >
                        <img src={file} className="sizeicon" />
                        &nbsp;&nbsp;{data?.UploadDocumentCount}
                      </div>
                    </td>

                    <td data-title={"Medical History"}>
                      <div
                        className="text-primary"
                        style={{
                          cursor: "pointer",
                          color:
                            data?.MedicalHistoryCount > 0
                              ? "#4ea30c !important"
                              : "",
                        }}
                        onClick={() => {
                          show({
                            modal: true,
                            data: data?.PatientGuid,
                            index: index,
                          });
                        }}
                      >
                        <img src={Medical} className="sizeicon" />
                        &nbsp;&nbsp;{data?.MedicalHistoryCount}
                      </div>
                    </td>
                    {pageType == 2 && (
                      <td data-title={"Select"} className="text-center">
                        {data?.Status == 2 && (
                          <input
                            type="checkbox"
                            name="IsChecked"
                            checked={data?.IsChecked}
                            onChange={(e) => handleTestID(e, index)}
                          />
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Tables>
          </div>
        </div>
      ) : (
        <div className="">
          <NoRecordFound />
        </div>
      )}
      {modal && (
        <CustomModal
          show={modal}
          visitID={visitID}
          onHide={() => setModal(false)}
        />
      )}
    </>
  );
}

export default DepartmentReceiveTable;
