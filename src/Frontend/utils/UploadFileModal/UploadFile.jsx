import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../../utils/axiosInstance";
import { dateConfig } from "../../../utils/helpers";
import { toast } from "react-toastify";
import { SelectBox } from "../../../components/formComponent/SelectBox";
import { Divider } from "primereact/divider";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import Loading from "../../../components/loader/Loading";

const UploadFile = ({
  options,
  show,
  handleClose,
  documentId,
  pageName,
  handleUploadCount,
  getDocumentType,
  formData,
  isPrintHeader = 0,
  showHeader = true,
  ChangeApi = false,
  CompanyId,
  blockUpload = false,
  LedgerTransactionIDHash = "",
}) => {
  const { t } = useTranslation();
  console.log(blockUpload);
  const [state, setState] = useState({
    DocumentName: options ? options[0]?.value : "",
    DocumentID: documentId ?? "",
    file: null, // Updated to store file
    previewUrl: null, // State to store the preview URL
  });
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [printHeader, setPrintHeader] = useState(isPrintHeader);

  const handleDrop = (event) => {
    event.preventDefault();
    const newFile = event.dataTransfer.files[0];
    setFile(newFile);
  };
  console.log(isPrintHeader);
  console.log(printHeader);
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType.startsWith("image/")) {
        // Handle image preview
        const previewUrl = URL.createObjectURL(file);
        setState({
          ...state,
          file,
          previewUrl,
        });
      } else if (fileType === "application/pdf") {
        // Handle PDF preview
        const previewUrl = URL.createObjectURL(file);
        setState({
          ...state,
          file,
          previewUrl,
        });
      } else {
        setState({
          ...state,
          file: null,
          previewUrl: null,
        });
        toast.error(t("Only image or PDF files are allowed for preview"));
      }
    }
    // Reset the file input value
    event.target.value = "";
  };

  const handleFileRemove = () => {
    setState({
      ...state,
      file: null,
      previewUrl: null,
    });
    document.getElementById("file-upload").value = ""; // Reset the file input
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const data = options.find((ele) => ele.value === value);
    setState({
      ...state,
      [name]: data?.value,
      DocumentName: data?.label,
    });
  };

  const getDocumentFiletype = (data) => {
    let TypeDocument = [];
    data.map((ele) => {
      return TypeDocument.push(ele?.DocumentName);
    });
    getDocumentType(TypeDocument);
  };

  const Fetch = async () => {
    try {
      const response = await axiosInstance.post(
        ChangeApi
          ? "CommonController/GetCompanyLogo"
          : "CommonController/GetDocument",
        {
          Page: pageName,
          Guid: documentId,
          CompanyId: CompanyId ? CompanyId?.toString() : "",
        }
      );
      const documents = response?.data?.message || [];
      const tableData = await Promise.all(
        documents.map(async (data) => {
          const imgUrl = await getimgurl(data?.awsKey);
          return { ...data, imgUrl };
        })
      );
      setTableData(tableData);

      if (["Patient Registration"].includes(pageName)) {
        handleUploadCount(
          "UploadDocumentCount",
          documents.length,
          "IsDocumentUploaded"
        );
        if (
          ["/EditPatientDetails", "/patientregister"].includes(
            window.location.pathname
          )
        ) {
          getDocumentFiletype(documents);
        }
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : t("Something Went Wrong")
      );
    }
  };

  const DeleteImage = (id) => {
    setLoad(true);
    axiosInstance
      .post(
        ChangeApi
          ? "CommonController/InActiveCompanyDocument"
          : "CommonController/InActiveDocument",
        {
          Hash_Id: id,
          CompanyId: CompanyId ? CompanyId?.toString() : "",
        }
      )
      .then((res) => {
        setLoad(false);
        toast.success(res?.data?.message);
        Fetch();
      })
      .catch((err) => {
        setLoad(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : t("Something Went Wrong")
        );
      });
  };

  const UploadDocumentModalValidation = (state) => {
    let err = "";
    if (state?.DocumentID === "") {
      err = { ...err, DocumentID: "This Field is Required" };
    }
    return err;
  };
  console.log(state);
  const handleUpload = async (e) => {
    e.preventDefault();

    const generatedError = UploadDocumentModalValidation(state);
    if (generatedError === "") {
      if (!state.file) {
        toast.error("Please attach a file first.");
      } else {
        if (state.file.size > 1024 * 2048) {
          toast.error("File size must not exceed 2MB.");
          return;
        }
        const names = [
          "EmployeMaster",
          "CentreMaster",
          "RateTypeMaster",
          "MembershipCardLogo",
          "MembershipCardIssue",
          "CentreMaster",
          "RateTypeMaster",
          "attachmentHeader",
          "attachmentfooter",
          "CompanyLogo",
        ];
        if (names.includes(pageName) && tableData?.length > 0) {
          toast.error(t("Please Remove Image to Upload New Image"));
        } else {
          setLoad(true);

          let formData = new FormData();
          formData.append("file", state.file);
          formData.append("DocumentID", state.DocumentID);
          formData.append("Page", pageName);
          formData.append(
            "DocumentName",
            pageName === "centreMasterNabl" ? "Nabl Logo" : state.DocumentName
          );
          formData.append("Guid", documentId);
          formData.append("LedgerTransactionIDHash", LedgerTransactionIDHash);
          formData.append("FileName", "");
          formData.append("CompanyId", CompanyId ? CompanyId : "");
          for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value, typeof value);
          }
          await axiosInstance
            .post(
              ChangeApi
                ? "CommonController/UploadCompanylogo"
                : "CommonController/UploadDocument",
              formData
            )
            .then((res) => {
              toast.success(res?.data?.message);
              Fetch();
              setLoad(false);
              setState({ ...state, file: null, previewUrl: null });
            })
            .catch((err) => {
              setLoad(false);
              toast.error(
                err?.response?.data?.message
                  ? err?.response?.data?.message
                  : t("Something Went Wrong")
              );
            });
        }
      }
    } else {
      setErr(generatedError);
    }
  };

  const getS3url = (id) => {
    axiosInstance
      .post("CommonController/GetFileUrl", {
        Key: id,
      })
      .then((res) => {
        const url = res?.data?.message;
        if (
          ["jpeg", "jpg", "png"].includes(id.split(".").pop().toLowerCase())
        ) {
          const a = document.createElement("a");
          a.href = url;
          a.download = "downloaded-image.jpeg";
          a.target = "_blank";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        } else window.open(url, "_blank");
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : t("Something went Wrong")
        );
      });
  };

  const getimgurl = async (id) => {
    try {
      const response = await axiosInstance.post("CommonController/GetFileUrl", {
        Key: id,
      });
      return response?.data?.message;
    } catch (err) {
      toast.error(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : t("Something went Wrong")
      );
      return null; // Return null or a placeholder URL if there's an error
    }
  };

  useEffect(() => {
    Fetch();
  }, []);

  const theme = useLocalStorage("theme", "get");
  return (
    <Dialog
      header={t("Upload File")}
      visible={show}
      //   style={{ width: "50vw" }}
      onHide={() => handleClose(printHeader)}
      className={theme}
    >
      <Divider className={`custom-divider-header ${theme}`} />
      <div className="main-upload-container">
        <div className="upload-file-cont mt-3">
          <div className="d-flex justify-content-between px-3  mb-2">
            <label>{t("Upload File")}</label>
            {options && (
              <div style={{ width: "50%" }}>
                <SelectBox
                  options={options}
                  name="DocumentID"
                  label="DocumentType"
                  selectedValue={state?.DocumentID}
                  onChange={handleChange}
                />
                {state?.DocumentID === "" && (
                  <div className="error-message">{err?.DocumentID}</div>
                )}
              </div>
            )}
          </div>
          <div
            className="file-upload-container"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              disabled={blockUpload}
              name="file"
              id="file-upload"
              className="file-upload-input"
              onChange={handleFileChange}
              accept={
                (pageName === "CompanyMaster" && "image/png; image/jpeg") ||
                pageName === "Add Report" ||
                (pageName === "Add Attachment" && ".pdf") ||
                (pageName === "downtimemaster" &&
                  ".pdf, .doc, .docx, .xls, .xlsx")
              }
            />
            <label htmlFor="file-upload" className="file-upload-message">
              {t("Drag and drop files here or click to upload")}
              <br />
              {["Add Report", "Add Attachment"].includes(pageName) ? (
                <>
                  <span className="text-warning">
                    ( {t("Only Pdf is allowed")})
                  </span>
                  <div className="text-danger">
                    ({t("Upto 2MB Size are Allowed")})
                  </div>
                </>
              ) : ["downtimemaster"].includes(pageName) ? (
                <>
                  <span className="text-warning">
                    ({t("Only word, excel and pdf are allowed")})
                  </span>
                  <div className="text-danger">
                    ( {t("Upto 2MB Size are Allowed")})
                  </div>
                </>
              ) : (
                <>
                  <span className="text-warning">
                    ( {t("Only jpg, jpeg, png, gif and pdf are allowed")})
                  </span>
                  <div className="text-danger">
                    ( {t("Upto 2MB Size are Allowed")})
                  </div>
                </>
              )}
            </label>
          </div>

          {state?.file && (
            <>
              <label className="py-3 px-3">{t("Preview")}</label>
              <div className="px-3" style={{ width: "100%" }}>
                <div className="file-upload-preview">
                  <div className="preview-file">
                    {state.previewUrl && (
                      <img src={state.previewUrl} alt="Preview" />
                    )}
                  </div>
                  <div className="document-details">
                    <span>{state.DocumentName}</span>
                    <span
                      style={{
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                        display: "block",
                        maxWidth: "100%",
                      }}
                    >
                      {state.file.name}
                    </span>
                  </div>
                  <i
                    className="fa fa-trash mt-2 mr-2"
                    onClick={handleFileRemove}
                  ></i>
                  {load ? (
                    <Loading />
                  ) : (
                    <button
                      type="button"
                      className="btn btn-success btn-block btn-sm"
                      id="btnSave"
                      onClick={handleUpload}
                      disabled={blockUpload}
                    >
                      {t("Upload File")}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="uploaded-file-preview mt-3">
          <div className="d-flex justify-content-between px-3 ">
            <label className="mb-3">{t("Uploaded Files")}</label>
            {pageName === "Add Report" && showHeader && (
              <label>
                <input
                  className="px-2"
                  type="checkbox"
                  onChange={(e) => setPrintHeader(e.target.checked ? 1 : 0)}
                  checked={printHeader === 1 ? true : false}
                />
                <span>{t("Print with Header/Footer")}</span>
              </label>
            )}
          </div>
          <div className="upload-file-preview-cont simple-box-container">
            {tableData && tableData.length > 0 ? (
              tableData.map((ele, index) => {
                return (
                  <div className="upload-file-preview " key={index}>
                    <div className="preview-file">
                      {["jpeg", "jpg", "png"].includes(
                        ele?.awsKey.split(".").pop().toLowerCase()
                      ) ? (
                        <img src={ele?.imgUrl} alt={"imgUrl"} />
                      ) : (
                        <span>
                          <i
                            style={{ cursor: "pointer" }}
                            className="fa fa-download mt-1 mr-2 reportPreview"
                            onClick={() => getS3url(ele?.awsKey)}
                          ></i>
                        </span>
                      )}
                    </div>
                    <div className="document-details">
                      <span>{ele?.DocumentName}</span>
                      <span>{dateConfig(ele?.dtEntry)}</span>
                      <span
                        style={{
                          wordWrap: "break-word",
                          whiteSpace: "normal",
                          overflowWrap: "break-word",
                          display: "block",
                          maxWidth: "100%",
                        }}
                      >
                        {ele?.FileName}
                      </span>
                      <span>{ele?.CreatedByName}</span>
                    </div>
                    <div>
                      <i
                        style={{ cursor: "pointer" }}
                        className="fa fa-trash mt-2 mr-2"
                        onClick={() =>
                          blockUpload ? null : DeleteImage(ele?.ID_Hash)
                        }
                        disabled={false}
                      ></i>
                      <br />
                      <i
                        style={{ cursor: "pointer" }}
                        className="fa fa-download mt-1 mr-2"
                        onClick={() => getS3url(ele?.awsKey)}
                      ></i>
                    </div>
                  </div>
                );
              })
            ) : (
              <span className="w-100 text-center">
                {t("No files uploaded")}
              </span>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default UploadFile;
