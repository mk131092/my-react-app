import React, { useEffect, useState } from "react";
import Accordion from "@app/components/UI/Accordion";
import { useTranslation } from "react-i18next";
import Input from "../../components/formComponent/Input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Tables from "../../components/UI/customTable";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { SelectBox } from "../../components/formComponent/SelectBox";
import { fontName, fontSize } from "../../utils/Constants";
import Loading from "../../components/loader/Loading";
import UploadFile from "../utils/UploadFileModal/UploadFile";
import PdfViewer from "../Components/PdfViewer";

const ConcentFormMaster = () => {
  const [tableData, setTableData] = useState([]);
  const [tableData1, setTableData1] = useState([]);
  const [pdfType, setPdfType] = useState(true);
  const [loading, setLoading] = useState({
    type: "",
    laod: false,
  });
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [documentId, setDocumentID] = useState("");
  const [pageType, setPageType] = useState(true);
  const [payload, setPayload] = useState({
    name: "",
    fileName: "",
    url: "",
    base64image: "",
  });

  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };

  const guidNumber = () => {
    const guidNumber =
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4();

    setDocumentID(guidNumber);
  };

  const getBindConcentForm = () => {
    axiosInstance
      .get("ConcentFormMaster/BindConcentForm")
      .then((res) => {
        const data = res?.data?.message?.map((ele) => {
          return {
            formid: "",
            name: "",
            fieldsId: ele?.id,
            FieldsName: ele?.Fieldsname,
            Left: 0,
            Top: 0,
            fontname: "Aharoni",
            fontsize: "8",
            isbold: 0,
            isPrint: 0,
          };
        });

        setTableData1(data);
      })
      .catch((err) => console.log(err));
  };

  const Fetch = async (guidNumber, pageName) => {
    const response = await axiosInstance.post("CommonController/GetDocument", {
      Page: pageName,
      Guid: guidNumber,
    });
    return response?.data?.message;
  };

  const getS3url = async (id) => {
    const response = await axiosInstance.post("CommonController/GetFileUrl", {
      Key: id,
    });

    return response?.data?.message;
  };

  const editIDMaster = async (id, awsKey) => {
    setLoading({ type: "Search", laod: true });
    try {
      const res = await axiosInstance.post(
        "ConcentFormMaster/GetConcentFormDataById",
        { id: id }
      );
      const data = res?.data?.message;
      const { concentFormData } = data;
      const response = await getS3url(awsKey);
      const promises = concentFormData.map(async (ele) => {
        return {
          ...ele,
          url: response,
        };
      });
      console.log(concentFormData);
      const finalData = concentFormData?.map((ele) => {
        return {
          formid: ele?.formId,
          name: ele?.concentformname,
          fieldsId: ele?.fieldsid,
          FieldsName: ele?.fieldsName,
          Left: ele?.left,
          Top: ele?.top,
          fontname: ele?.fontname,
          fontsize: ele?.fontsize,
          isbold: ele?.isbold,
          isPrint: ele?.isPrint,
        };
      });
      const tableData = await Promise.all(promises);
      setLoading({ type: "", laod: false });
      setDocumentID(tableData[0]?.guidNumber);
      setPayload(tableData[0]);
      setTableData1(finalData);
      setPageType(false);
    } catch (err) {
      setLoading({ type: "", laod: false });
      console.error(err);
    }
  };

  const handleUpdate = () => {
    if (payload?.name != "") {
      setLoading({ type: "Submit", laod: true });
      const obj = {
        ...payload,
        concentformname: payload?.concentformname,
        name: payload?.concentformname,
      };
      axiosInstance
        .post("ConcentFormMaster/UpdateConcentForm", {
          ...obj,
          fields: tableData1,
        })
        .then((res) => {
          setLoading({ type: "", laod: false });
          toast.success(res?.data?.message);
          editIDMaster(state?.id, state?.awskey);
          navigate("/ConcentFormList");
        })
        .catch((err) => {
          setLoading({ type: "", laod: false });
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went wrong"
          );
        });
    } else {
      toast.error("Enter Concent form name");
    }
  };

  const handleSave = () => {
    if (payload?.concentformname !== "" && payload?.url !== "") {
      setLoading({ type: "Submit", laod: true });
      axiosInstance
        .post("ConcentFormMaster/SaveConcentForm", {
          ...payload,
          guidNumber: documentId,
          fields: tableData1,
          name: payload?.concentformname,
        })
        .then((res) => {
          setLoading({ type: "", laod: false });
          toast.success(res?.data?.message);
          setPayload({
            name: "",
            concentformname: "",
            fileName: "",
            url: "",
            base64image: "",
          });
          pageType && getBindConcentForm();
          guidNumber();
          navigate("/ConcentFormList");
        })
        .catch((err) => {
          setLoading({ type: "", laod: false });
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went wrong"
          );
        });
    } else {
      toast.error("Please Select Image and file name");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const handlePreview = (data = null) => {
    let obj = { ...payload, concentformname: payload?.name };
    axiosInstance
      .post("ConcentFormMaster/PreviewConcentForm", {
        ...obj,
        fields: data ?? tableData1,
      })
      .then((res) => {
        setPdfType(false);
        setPayload({
          ...payload,
          base64image: res?.data?.message,
          url: res?.data?.Url,
        });
      })
      .catch((err) => {
        setLoading({ type: "", laod: false });
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went wrong"
        );
      });
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const debouncedHandlePreview = debounce(handlePreview, 3000);

  const handleTableDataChange = (e, index) => {
    setPdfType(false);
    const { name, value, type, checked } = e.target;
    const data = [...tableData1];
    data[index][name] = type === "checkbox" ? (checked ? 1 : 0) : value;
    setTableData1(data);
    (value !== "" || checked || !checked) && debouncedHandlePreview(data);
  };

  const handlePreviewImage = async (guidNumber) => {
    setLoading({ type: "Preview", laod: true });
    const response = await Fetch(guidNumber, "ConcentFormMaster");
    const imgURL = await getS3url(response[0]?.awsKey);
    setPayload({ ...payload, url: imgURL, base64image: imgURL });
    setLoading({ type: "", laod: false });
  };

  useEffect(() => {
    guidNumber();
    pageType && getBindConcentForm();
    if (state?.id) {
      editIDMaster(state?.id, state?.awskey);
    }
  }, []);
  console.log(tableData1);
  return (
    <>
      {show && (
        <UploadFile
          show={show}
          documentId={documentId}
          handleClose={() => {
            handlePreviewImage(documentId);
            setShow(false);
          }}
          pageName="ConcentFormMaster"
          docType={"imgpdf"}
        />
      )}
      <Accordion
        name={t("Consent Form Master")}
        isBreadcrumb={true}
        defaultValue={true}
      >
        <div className="row pt-2 pl-2 pr-2 mt-1">
          <div className="col-sm-2">
            <Input
              type="text"
              className="required-fields"
              name="concentformname"
              id="ConcentFormName"
              lable={t("Concent Form Name")}
              placeholder=""
              value={payload?.concentformname}
              onChange={handleChange}
            />
          </div>
          <div className="col-sm-1">
            <button
              className="btn btn-block btn-info btn-sm"
              type="button"
              id="btnUplaod"
              disabled={payload?.concentformname?.length == 0 || state?.id}
              onClick={() => {
                setShow(true);
              }}
            >
              {t("Upload File")}
            </button>
          </div>
        </div>
      </Accordion>
      <div className="row mb-2 d-flex">
        <div className="col-sm-5">
          <Accordion title={t("Show Fields")} defaultValue={true}>
            <div className="row p-2">
              <div className="col-sm-12">
                <Tables>
                  <thead>
                    <tr>
                      {[
                        t("Fields"),
                        t("Left"),
                        t("Top"),
                        t("Font"),
                        t("Size"),
                        t("Bold"),
                        t("Print"),
                      ].map((ele, index) => (
                        <th key={index}>{ele}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData1?.map((ele, index) => (
                      <tr key={index}>
                        <td>{ele?.FieldsName}</td>
                        <td>
                          <Input
                            type={"number"}
                            className="select-input-box form-control input-sm required"
                            style={{
                              width: "30px",
                              borderRadius: "4px",
                            }}
                            value={ele?.Left}
                            name="Left"
                            onChange={(e) => handleTableDataChange(e, index)}
                          />
                        </td>
                        <td>
                          <Input
                            type="number"
                            className="select-input-box form-control input-sm required"
                            style={{
                              width: "30px",
                              borderRadius: "4px",
                            }}
                            value={ele?.Top}
                            name="Top"
                            onChange={(e) => handleTableDataChange(e, index)}
                          />
                        </td>
                        <td>
                          <SelectBox
                            options={fontName}
                            selectedValue={ele?.fontname}
                            name="fontname"
                            id="fontname"
                            onChange={(e) => handleTableDataChange(e, index)}
                          />
                        </td>
                        <td>
                          <SelectBox
                            options={fontSize}
                            selectedValue={ele?.fontsize}
                            name="fontsize"
                            id="fontsize"
                            onChange={(e) => handleTableDataChange(e, index)}
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            className="mt-2"
                            checked={ele?.isbold}
                            name="isbold"
                            onChange={(e) => handleTableDataChange(e, index)}
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            className="mt-2"
                            checked={ele?.isPrint}
                            name="isPrint"
                            onChange={(e) => handleTableDataChange(e, index)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Tables>
              </div>
            </div>
          </Accordion>
        </div>
        <div className="col-sm-7">
          <Accordion title={t("Preview")} defaultValue={true}>
            <div className="row">
              {loading?.type === "Preview" && loading?.laod ? (
                <Loading />
              ) : (
                <div className="col-sm-6" style={{ height: "500px" }}>
                  {pageType || pdfType ? (
                    <img
                      src={payload?.url}
                      style={{
                        width: "500px",
                        height: "500px",
                        objectFit: "contain",
                        margin: "0 auto",
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                      className="img-fluid"
                    />
                  ) : (
                    <PdfViewer base64Pdf={payload?.base64image} />
                  )}
                </div>
              )}
            </div>
          </Accordion>
        </div>
      </div>
      <div className="row pl-2 pr-2 pb-2">
        {loading?.type === "Submit" && loading?.laod === true ? (
          <Loading />
        ) : (
          <div className="col-sm-1">
            {pageType ? (
              <button
                className="btn btn-block btn-success btn-sm"
                style={{ marginTop: "-10px" }}
                onClick={handleSave}
              >
                {t("Save")}
              </button>
            ) : (
              <button
                className="btn btn-block btn-success btn-sm"
                style={{ marginTop: "-10px" }}
                onClick={handleUpdate}
              >
                {t("Update")}
              </button>
            )}
          </div>
        )}
        <div className="col-sm-1">
          <button
            className="btn btn-block btn-success btn-sm"
            style={{ marginTop: "-10px" }}
            onClick={() => handlePreview()}
          >
            {t("Preview")}
          </button>
        </div>
        <div className="col-sm-1">
          <a href="/ConcentFormList">
            <button
              className="btn btn-block btn-success btn-sm"
              style={{ marginTop: "-10px" }}
            >
              {t("Back to List")}
            </button>
          </a>
        </div>
      </div>
    </>
  );
};

export default ConcentFormMaster;
