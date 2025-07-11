import React, { useEffect, useState } from "react";
import axios from "axios";
import ShowTextEditors from "./ShowTextEditors";
import Loading from "../../components/loader/Loading";
import { Image } from "react-bootstrap";
import transfericon from "./../HomeCollection/TRY6_28.gif";
import Accordion from "@app/components/UI/Accordion";
import { useTranslation } from "react-i18next";
import UploadFile from "../utils/UploadFileModal/UploadFile";
import ResultEditAddModal from "../utils/ResultEditAddModal";
import Input from "../../components/formComponent/Input";
import { dateConfig } from "../../utils/helpers";
import PatientDetailModal from "../utils/PatientDetailModal";
import { getPaymentModes } from "../../utils/NetworkApi/commonApi";
import SampleRemark from "../utils/SampleRemark";
import SlidingDetailModal from "../utils/SlidingDetailModal";
import ImmunoHistoryModal from "../utils/ImmunoHistoryModal";
import ReactSelectHead from "../../components/formComponent/ReactSelectHead";
import { axiosReport } from "../../utils/axiosInstance";
import ImageUpload from "../utils/UploadFileModal/ImageUpload";
const TEMPLATEDROPDOWN = [
  {
    label: "MacroScropic findings",
    type: "Gross",
  },
  {
    label: "MicroScopic description",
    type: "MicroScopic",
  },
  {
    label: "Impression",
    type: "Impression",
  },
];

function HistoCytoResultEntrySecondPage({ innerData, setinnerData }) {
  const { t } = useTranslation();
  const [templateData, setTemplateData] = useState([]);
  const [printReportLoading, setPrintReportLoading] = useState(false);
  const [payload, setPayload] = useState({
    ClinicalHistory: "gagan",
    Specimen: "verma",
    MacroScopicFinding: "rajput",
    MicroScopicDescription: "it",
    Impression: "dose",
    COMMENT: "",
    BlockKey: "",
    RADIOLOGY_IMAGING_Findings: "",
    SlidingDetail: [],
    Image:null,
  });

  const [showRemark, setShowRemark] = useState(false);
  const [show, setShow] = useState({
    modal: false,
    data: "",
    pageName: "Add Images",
  });
  const [show5, setShow5] = useState({
    modal: false,
    data: "",

    pageName: "Add Report",
  });
  const [showIH, setShowIH] = useState(false);
  const [showPH, setShowPH] = useState(false);
  const [show6, setShow6] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  const [showSlide, setShowSlide] = useState(false);
  const [Identity, setIdentity] = useState([]);
  const [show2, setShow2] = useState({
    modal: false,
    data: {},
    pageName: "Add Comments",
  });
  console.log(innerData);

  const handleShowRemark = () => {
    setShowRemark(false);
  };
  const heading = (head, isShow) => {
    return (
      <div className="bg-primary " style={{ marginTop: "10px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0px 1px",
          }}
        >
          <div className="text-white">{head}</div>
          {isShow && (
            <div>
              <input
                type={"checkbox"}
                id={"FavouriteTemplateOnly"}
                onChange={(e) => fetch(e.target.checked ? 1 : 0)}
              />
              <label htmlFor="FavouriteTemplateOnly">
                Favourite Template Only
              </label>
            </div>
          )}
        </div>
      </div>
    );
  };

  const fetch = (type) => {
    setTemplateData([]);
    axios
      .post("/api/v1/HistoCytoResultEntry/LoadSpecimenTemplate", {
        favonly: type,
      })
      .then((res) => {
        const data = res?.data?.message;
        const finalData = data?.map((ele) => {
          return {
            ...ele,
            value: ele?.Template_Name,
            label: ele?.Template_Name,
          };
        });
        setTemplateData(finalData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(payload);
  const handleTextEditorChanges = (name, value) => {
    setPayload({ ...payload, [name]: value });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    setPayload({ ...payload, [name]: value });
  };

  const handleTemplateData = (id) => {
    console.log(document.getElementById(id)?.value);
  };

  useEffect(() => {
    fetch("0");

    getPaymentModes("Identity", setIdentity);
  }, []);
  const handleSave = (data, _) => {
    setPayload({
      ...payload,
      COMMENT: data?.COMMENT,
    });
    setShow2({ moadal: false, data: {}, COMMENT: "" });
  };
  const handleUploadCount = () => {};
  const handleSlideSave = (data) => {
    console.log(data);
  };
  const handleImmunoSave = (data) => {
    console.log(data);
  };
  const handleReport = () => {
    setPrintReportLoading(true);
    axiosReport
      .post(`commonReports/GetLabReport`, {
        TestIDHash: innerData?.LedgertransactionIDHash,
        PrintColour: "1", PHead: 0,
      })
      .then((res) => {
        window.open(res?.data?.url, "_blank");
        setPrintReportLoading(false);
      })
      .catch((err) => {
        setPrintReportLoading(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
      });
  };
  return (
    <>
      {" "}
      {show?.modal && (
        <UploadFile
          show={show?.modal}
          handleClose={() => {
            setShow({
              modal: false,
              data: "",
              pageName: "",
            });
          }}
          formData={innerData}
          documentId={show.data}
          pageName={show?.pageName}
        />
      )}
      {show5?.modal && (
        <UploadFile
          show={show5?.modal}
          handleClose={() => {
            setShow5({
              modal: false,
              data: "",
              pageName: "",
            });
          }}
          documentId={show5.data}
          pageName={show5?.pageName}
          formData={innerData}
        />
      )}
      {show2.modal && (
        <ResultEditAddModal
          show={{ ...show2, COMMENT: payload?.COMMENT }}
          handleClose={() => {
            setShow2({ moadal: false, data: {}, COMMENT: "" });
          }}
          handleSave={handleSave}
        />
      )}
      {showSlide && (
        <SlidingDetailModal
          show={showSlide}
          handleClose={() => {
            setShowSlide(false);
          }}
          handleSave={handleSlideSave}
        />
      )}
      {showIH && (
        <ImmunoHistoryModal
          show={showIH}
          handleClose={() => {
            setShowIH(false);
          }}
          handleSave={handleImmunoSave}
        />
      )}
      {showPH && (
        <PatientDetailModal
          showPH={showPH}
          setShowPH={() => setShowPH(false)}
          ResultData={[
            {
              LedgerTransactionNo: innerData?.VisitNo,
              TestID: innerData?.TestID?.split(",")?.[0],
            },
          ]}
        />
      )}
      {show6?.modal && (
        <UploadFile
          show={show6?.modal}
          handleClose={() => {
            setShow6({ modal: false, data: "", index: -1 });
          }}
          options={Identity}
          documentId={show6?.data}
          pageName="Patient Registration"
          handleUploadCount={handleUploadCount}
          formData={innerData}
        />
      )}
      {showRemark && (
        <SampleRemark
          show={showRemark}
          handleShow={handleShowRemark}
          state={handleShowRemark}
          PageName={innerData?.Remarks}
          handleSave={handleShowRemark}
          title={"Remarks"}
        />
      )}{" "}
      <div className="p-2">
        <div>
          <div className="box-header with-border">
            <div
              className="p-dialog-header custom-box-body mb-1"
              style={{
                display: "flex",
                flexDirection: "column",
                alignContent: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <div className="custom-row">
                <div className="custom-col custom-col-visit">
                  <span className="fa fa-folder custom-text">
                    &nbsp; <span>{innerData?.VisitNo}</span>
                  </span>
                </div>

                <div className="custom-col">
                  <span className="fa fa-user custom-text">
                    &nbsp; <span>{innerData?.PatientName}</span>
                  </span>
                </div>

                <div className="custom-col">
                  <span className="fa fa-book custom-text">
                    &nbsp;<span>{innerData?.PatientCode}</span>
                  </span>
                </div>

                <div className="custom-col custom-col-age-gender">
                  <span className="fa fa-calendar custom-text">
                    &nbsp;<span> {innerData?.Age}</span>
                  </span>
                  <span className="fa fa-street-view custom-text">
                    &nbsp; <span> {innerData?.Gender}</span>
                  </span>
                </div>

                <div className="custom-col">
                  <span className="fa fa-h-square custom-text">
                    &nbsp; <span>{innerData?.Centre}</span>
                  </span>
                </div>

                <div className="custom-col">
                  <span className="fa fa-user-md custom-text">
                    &nbsp; <span> {innerData?.DoctorName}</span>
                  </span>
                </div>

                <div className="custom-col">
                  <span className="fa fa-plus-square custom-text">
                    &nbsp;<span> {innerData?.SinNo} </span>
                  </span>
                </div>

                <div className="custom-col custom-col-regdate">
                  <span className="fa fa-calendar custom-text">
                    &nbsp; <span> {dateConfig(innerData?.RegDate)}</span>
                  </span>
                </div>

                <br></br>
              </div>
              <div className="custom-row">
                <div
                  className={` round font-weight-bold mx-2 mt-1 Status-${innerData.Status}`}
                >
                  {" "}
                  {innerData?.TestName}
                </div>
              </div>
            </div>

            <div>
              <div className="p-2">
                {" "}
                <div className="row mt-1">
                  <div className="col-sm-4">
                    {TEMPLATEDROPDOWN?.map((ele, index) => (
                      <div className="row p-2 d-flex" key={index}>
                        <div className="col-3">{ele?.label}</div>
                        <div className="col-6">
                          <ReactSelectHead
                            searchable={true}
                            respclass="roll-off"
                            dynamicOptions={[]}
                            id={`SelectedValueOfTemplate_${ele?.type}`}
                          />
                        </div>
                        <div className="col-1">
                          <span
                            onClick={() =>
                              handleTemplateData(
                                `SelectedValueOfTemplate_${ele?.type}`
                              )
                            }
                          >
                            <Image
                              src={transfericon}
                              style={{ height: "20px", marginTop: "2px" }}
                            />
                          </span>
                        </div>
                        <div className="col-1">
                          <button className="btn btn-sm btn-primary">
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="row mt-2">
                      {[
                        {
                          label: "Block Key",
                          id: "BlockKey",
                          value: payload?.BlockKey,
                          name: "BlockKey",
                        },
                        {
                          label: "RADIOLOGY IMAGING FINDINGS",
                          id: "RADIOLOGY_IMAGING_Findings",
                          value: payload?.RADIOLOGY_IMAGING_Findings,
                          name: "RADIOLOGY_IMAGING_Findings",
                        },
                      ].map((input, index) => (
                        <div key={index} className="col-md-6">
                          <Input
                            type="text"
                            autoComplete="off"
                            lable={input.label}
                            id={input.id}
                            placeholder=" "
                            name={input.name}
                            value={input.value}
                            onChange={handleChange}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <Accordion
                      title={t("Clinical History")}
                      defaultValue={true}
                    >
                      <div id="ClinicalHistory">
                        <ShowTextEditors
                          value={payload?.ClinicalHistory}
                          onChange={handleTextEditorChanges}
                          name={"ClinicalHistory"}
                        />{" "}
                      </div>{" "}
                    </Accordion>
                  </div>
                  <div className="col-sm-4">
                    <Accordion title="Add Image" defaultValue={true}>
                      <ImageUpload payload={payload} setPayload={setPayload} />
                    </Accordion>
                  </div>
                </div>
                <div className="row mt-2">
                  {[
                    {
                      title: t("Specimen"),
                      name: "Specimen",
                      value: payload?.Specimen,
                    },
                    {
                      title: t("MacroScropic findings"),
                      name: "MacroScopicFinding",
                      value: payload?.MacroScopicFinding,
                    },
                    {
                      title: t("MicroScopicDescription"),
                      name: "MicroScopicDescription",
                      value: payload?.MicroScopicDescription,
                    },
                    {
                      title: t("Impression"),
                      name: "Impression",
                      value: payload?.Impression,
                    },
                  ].map((item, index) => (
                    <div key={index} className="col-sm-3">
                      <Accordion title={item.title} defaultValue={true}>
                        <ShowTextEditors
                          value={item.value}
                          onChange={handleTextEditorChanges}
                          name={item.name}
                        />
                      </Accordion>
                    </div>
                  ))}
                </div>
                <div className="row mt-2 mx-1">
                  {/* <button
                    className="btn btn-sm btn-primary  mx-2"
                    onClick={() => {
                      setShow({
                        modal: true,
                        data: innerData?.PatientGuid,
                        pageName: "Add Images",
                      });
                    }}
                  >
                    Add Images
                  </button> */}
                  <button
                    className="btn btn-sm btn-primary mx-1"
                    onClick={() => {
                      setShow2({
                        modal: true,
                        data: {
                          ...payload,
                          labObservationID: innerData?.LedgerTransactionID,
                          COMMENT: payload?.COMMENT ?? "",
                          pageName: "All",
                        },
                      });
                    }}
                  >
                    Add Comment
                  </button>
                  <button
                    className="btn btn-sm btn-primary "
                    onClick={() => {
                      setShowPH(true);
                    }}
                  >
                    Patient Info
                  </button>
                  <button
                    className="btn btn-sm btn-primary mx-2"
                    onClick={() => {
                      setShowIH(true);
                    }}
                  >
                    Immuno History
                  </button>
                  <button
                    className="btn btn-sm btn-primary mx-2"
                    onClick={() => {
                      setShow6({
                        modal: true,
                        data: innerData?.PatientGuid,
                        index: 0,
                      });
                    }}
                  >
                    View Doc
                  </button>
                  <button
                    className="btn btn-sm btn-primary mx-2"
                    onClick={() => setShowRemark(true)}
                  >
                    View Remarks
                  </button>

                  <button
                    className="btn btn-primary btn-sm mx-2"
                    onClick={() => setinnerData({})}
                  >
                    Main List
                  </button>
                  <button className="btn btn-sm btn-primary  mx-2">
                    Save Report
                  </button>
                  <button className="btn btn-sm btn-primary   mx-2">
                    Provisional{" "}
                  </button>
                  <button className="btn btn-sm btn-primary  mx-2 ">
                    Forward
                  </button>
                  <button
                    className="btn btn-sm btn-primary  mx-2 "
                    onClick={() => setShowSlide(true)}
                  >
                    ReSlide
                  </button>
                  <button
                    className="btn btn-sm btn-primary   mx-2"
                    onClick={() => {
                      setShow5({
                        modal: true,
                        data: innerData?.LedgertransactionIDHash,
                        pageName: "Add Report",
                      });
                    }}
                  >
                    Add Report
                  </button>
                  {printReportLoading ? (
                    <Loading />
                  ) : (
                    <button
                      className="btn btn-sm btn-primary  mx-2 "
                      onClick={handleReport}
                    >
                      Report
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HistoCytoResultEntrySecondPage;
