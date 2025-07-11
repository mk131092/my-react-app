import React, { useEffect, useState } from "react";
import Accordion from "@app/components/UI/Accordion";
import { SelectBox } from "../../components/formComponent/SelectBox";
import DatePicker from "../../components/formComponent/DatePicker";
import Input from "../../components/formComponent/Input";
import { AddBlankData } from "../../utils/helpers";
import { axiosInstance } from "../../utils/axiosInstance";
import { useTranslation } from "react-i18next";
import Tables from "../../components/UI/customTable";
import Loading from "../../components/loader/Loading";
import FullTextEditor from "../../components/formComponent/TextEditor";
import ReactSelect from "../../components/formComponent/ReactSelect";
import ViewRemarkModal from "../utils/ViewRemarkModal";
import { toast } from "react-toastify";
import moment from "moment";
import { SelectBoxWithCheckbox } from "../../components/formComponent/MultiSelectBox";
import { elements } from "chart.js";
import UploadFile from "../utils/UploadFileModal/UploadFile";
import { FaYCombinator } from "react-icons/fa";
import NoRecordFound from "../../components/formComponent/NoRecordFound";

const STATUS = [
  {
    label: "Assigned",
    value: "",
  },
  {
    label: "Grossed",
    value: "Grossed",
  },
  {
    label: "Slided",
    value: "Slided",
  },
  {
    label: "Completed",
    value: "Completed",
  },
];

const STATUS_BUTTON = [
  {
    label: "Assigned",
    type: "",
    color: "#ffffe0",
  },
  {
    label: "Grossed",
    type: "Grossed",
    color: "#ffc0cb",
  },
  {
    label: "Slided",
    type: "Slided",
    color: "#90ee90",
  },
  {
    label: "Completed",
    type: "Completed",
    color: "#ff00ff",
  },
];

const NO_OF_CASSET = [
  { label: "Select", value: "" },
  ...Array.from({ length: 200 }, (_, i) => ({
    label: (i + 1).toString(),
    value: (i + 1).toString(),
  })),
  { label: "BRT", value: "BRT" },
  { label: "BRN", value: "BRN" },
];

const ALPHABETS = Array.from({ length: 26 }, (_, i) => ({
  label: String.fromCharCode(65 + i), // ASCII value of 'A' is 65
  value: String.fromCharCode(65 + i),
}));

const CASSET_RANGE = [
  { label: "Select", value: "" },
  ...ALPHABETS,
  { label: "BRT", value: "BRT" },
  { label: "BRN", value: "BRN" },
];

const NO_OF_SLIDES = [
  { label: "Select", value: "" },
  ...Array.from({ length: 200 }, (_, i) => ({
    label: (i + 1).toString(),
    value: (i + 1).toString(),
  })),
];

const HistoCytoGrossingAndSliding = () => {
  const { t } = useTranslation();

  const [payload, setPayload] = useState({
    TestCentreId: "",
    FromDate: new Date(),
    ToDate: new Date(),
    LedgerTransactionNo: "",
    BarcodeNo: "",
    Hno: "",
    DepartmentId: 0,
    HistoCytoStatus: "",
    TestId: "",
    Doc: "",
  });
  const [DepartmentData, setDepartmentData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [DoctorData, setDoctorData] = useState([]);
  const [TemplateData, setTemplateData] = useState([]);
  const handleClose = () => setShow(false);

  const getDepartment = () => {
    axiosInstance
      .get("Department/getDepartment")
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const dateSelect = (value, name) => {
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    console.log("Selected:", name, value);
    setPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };

  const handleSearch = (type) => {
    console.log(type);
    setLoad(true);
    setTableData([]);
    setSingleData({});
    let searchType = type;

    axiosInstance
      .post("HistoCyto/HistoSearchData", {
        FromDate: moment(payload.FromDate).format("DD/MMM/YYYY 00:00:00"),
        ToDate: moment(payload.ToDate).format("DD/MMM/YYYY HH:mm:ss"),
        LedgerTransactionNo: payload?.LedgerTransactionNo,
        BarcodeNo: payload?.BarcodeNo,
        DepartmentId:
          payload?.DepartmentId == "" ? 0 : Number(payload?.DepartmentId),
        HistoCytoStatus: searchType,
      })
      .then((response) => {
        setLoad(false);
        const data = response?.data?.message;
        if (response?.data?.success) {
          if (data.length === 0) {
            toast.error("No Record Found");
            setTableData([]);
          } else if (searchType === "") {
            const filteredData = data.filter(
              (item) => item.HistoCytoStatus === ""
            );
            setTableData(filteredData);
          } else {
            setTableData(data);
          }
        } else {
          toast.error(response?.data?.error);
          setTableData([]);
        }
      })
      .catch((error) => {
        setLoad(false);
        const errorMessage = error?.response?.data?.message;
        console.error("Error:", error);
        toast.error(errorMessage);
      });
    console.log(tableData);
  };

  const getDoctorSuggestion = () => {
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
        setDoctorData([{ label: "Select", value: "" }, ...val]);
      })
      .catch((err) => console.log(err));
  };

  const getBindTemplate = () => {
    axiosInstance
      .get("HistoCyto/BindTemplate")
      .then((response) => {
        const data = response?.data?.message;
        const val = data?.map((element) => {
          return {
            label: element?.Template_Name,
            text: element[element?.fieldtype],
            value: element?.Template_ID,
          };
        });
        setTemplateData([{ label: "Select", value: "", text: "" }, ...val]);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getDepartment();
    getDoctorSuggestion();
    getBindTemplate();
  }, []);

  const GrossingDetailComponent = ({ data, show }) => {
    const [tableData, setTableData] = useState([]);
    const [payload2, setPayload2] = useState({
      TestId: "",
      Hno: "",
      LabNo: "",
      BlockId: "",
      NoOfCasset: "",
      RangeFrom: "",
      BlockComment: "",
      GrossComment: "",
      InvestigationTemplate: "",
    });
    const [editorText, setEditorText] = useState("");
    console.log(payload2);
    const [Editable, setEditable] = useState(false);
    const handleChange2 = (e) => {
      console.log(e.target.value);
      const { name, value } = e.target;
      // if (name == "InvestigationTemplate") {
      //   const filteredData = TemplateData?.filter((ele) => ele?.value == value);
      //   console.log(filteredData);
      //   setEditable(true);
      //   setEditorText(filteredData[0]?.text ?? "");
      //   setPayload2({
      //     ...payload2,
      //     [name]: value,
      //   });
      // } else
      setPayload2({ ...payload2, [name]: value });
    };

    const handleUseTemplate = () => {
      const filteredData = TemplateData?.filter(
        (ele) => ele?.value == payload2?.InvestigationTemplate
      );
      console.log(filteredData);
      setEditable(true);
      setEditorText(filteredData[0]?.text ?? "");
    };

    const handleCreate = () => {
      const noOfCasset = Number(payload2?.NoOfCasset);
      const rangeStart = payload2?.RangeFrom || "";

      if (!noOfCasset && !rangeStart) {
        toast.error("Please select both Number of Casset and Start From");
        return;
      }
      if (!noOfCasset) {
        toast.error("Please select Number of Casset");
        return;
      }
      if (!rangeStart) {
        toast.error("Please select Start From");
        return;
      }

      const desiredBlockIds = [];
      for (let i = 1; i <= noOfCasset; i++) {
        desiredBlockIds.push(`${rangeStart}${i}`);
      }

      const otherRows = tableData.filter(
        (row) => !row.blockId.startsWith(rangeStart)
      );

      const existingRows = tableData.filter((row) =>
        row.blockId.startsWith(rangeStart)
      );

      const newRows = desiredBlockIds
        .filter(
          (blockId) => !existingRows.some((row) => row.blockId === blockId)
        )
        .map((blockId, index) => ({
          serialNo: tableData.length + index + 1,
          secNo: "",
          blockId: blockId,
          comment: "",
        }));

      const updatedTableData = [
        ...otherRows,
        ...existingRows.filter((row) => desiredBlockIds.includes(row.blockId)),
        ...newRows,
      ];

      setTableData(updatedTableData);

      if (newRows.length > 0) {
        toast.success(`${newRows.length} new casset IDs added successfully.`);
      } else {
        toast.info("No new rows can be added.");
      }
    };

    const handleCommentChange = (e, index) => {
      const updatedTableData = [...tableData];
      updatedTableData[index].comment = e.target.value;
      setTableData(updatedTableData);
    };

    const handleDelete = (index) => {
      const updatedData = tableData.filter((_, i) => i !== index);
      setTableData(updatedData);
    };

    const handleSaveGrossing = (e) => {
      const noOfCasset = Number(payload2?.NoOfCasset);
      const rangeStart = payload2?.RangeFrom;
      const isGrossDataValid = tableData.every((row) => row.blockId);
      const isPayloadValid = editorText?.trim() !== "";
      console.log(isGrossDataValid);
      console.log(isPayloadValid);

      if (tableData.length === 0) {
        if (!noOfCasset) {
          toast.error("Please select Number of Casset");
          return;
        }

        if (!rangeStart) {
          toast.error("Please select Start From");
          return;
        }

        toast.error("Please create Blocks");
        return;
      }

      if (!isPayloadValid) {
        toast.error(
          "Please add text to editor or Select Investigation Template"
        );
        return;
      }

      const GrossDataList = tableData.map((row) => ({
        TestId: String(data?.TestID || "").trim(),
        Hno: data?.Hno?.trim(),
        LabNo: data?.LedgerTransactionNo?.trim(),
        BlockId: row?.blockId,
        BlockComment: row?.comment?.trim(),
        GrossComment: editorText,
      }));

      setLoading(true);
      axiosInstance
        .post("HistoCyto/SaveGrossData", { GrossDataList })
        .then((response) => {
          setLoading(false);
          setSingleData({});
          toast.success(response?.data?.message);
          setTableData([]);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    };
    const handleChangeEditor = (data) => {
      setEditorText(data);
    };
    console.log(TemplateData);
    useEffect(() => {
      show;
    }, []);

    return (
      <>
        {/* {show && (
          <ViewRemarkModal 
          show={show}
          handleClose={handleClose}
          />
        )} */}
        <Accordion title="Grossing Detail" defaultValue={true}>
          {show && (
            <>
              <div className="row px-2 mt-2 mb-1">
                <div className="col-sm-4">
                  <SelectBox
                    className="required-fields"
                    options={NO_OF_CASSET}
                    lable="Number of Casset"
                    id="NoOfCasset"
                    name="NoOfCasset"
                    value={payload2?.NoOfCasset}
                    onChange={handleChange2}
                  />
                </div>

                <div className="col-sm-4">
                  <SelectBox
                    className="required-fields"
                    options={CASSET_RANGE}
                    lable="Start From"
                    id="RangeFrom"
                    name="RangeFrom"
                    value={payload2?.RangeFrom}
                    onChange={handleChange2}
                  />
                </div>
                <div className="col-sm-4 mb-1">
                  <button
                    className="btn btn-sm btn-block btn-success w-50"
                    onClick={() => handleCreate()}
                  >
                    {t("Make")}
                  </button>
                </div>
              </div>
              <div className="row p-2">
                <div className="col-sm-12">
                  <Tables>
                    <thead>
                      <tr>
                        <th>S No.</th>
                        <th>Sec No.</th>
                        <th>Block ID</th>
                        <th>Comment</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData?.map((row, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            {/* <input
                              type="text"
                              value={row.secNo}
                              onChange={(e) => handleSecNoChange(e, index)} // Handling changes for Sec No.
                              placeholder="Enter Sec No"
                            /> */}
                          </td>
                          <td>{row.blockId}</td>
                          <td>
                            <input
                              type="text"
                              className="select-input-box form-control input-sm"
                              value={row.comment}
                              onChange={(e) => handleCommentChange(e, index)}
                              placeholder="Enter Comment"
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-block btn-danger w-25"
                              onClick={() => handleDelete(index)}
                            >
                              <i className="pi pi-times" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Tables>
                </div>
              </div>
              <div className="row px-2 mt-2 mb-1">
                <div className="col-sm-4">
                  <SelectBox
                    name="InvestigationTemplate"
                    lable="Investigation ID"
                    className="required-fields"
                    placeholderName=""
                    selectedValue={payload2?.InvestigationTemplate}
                    options={TemplateData}
                    onChange={handleChange2}
                  />
                </div>
                <div className="col-sm-4">
                  <button
                    className="btn btn-sm btn-block btn-success w-50"
                    onClick={(e) => handleUseTemplate(e)}
                  >
                    {t("Use Template")}
                  </button>
                </div>
              </div>
              {/* <div className="row px-2 mt-2 mb-1"> */}
              <div id="TemplateText">
                <FullTextEditor
                  value={editorText}
                  setValue={handleChangeEditor}
                  EditTable={Editable}
                  setEditTable={setEditable}
                />
              </div>
              {/* </div> */}
              <div className="row px-2 mt-2 mb-1">
                <div className="col-sm-2">
                  <button
                    className="btn btn-sm btn-block btn-success w-100"
                    onClick={() => handleSaveGrossing()}
                  >
                    {t("Save Grossing")}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* {show && (
            <div>
              {loading.pend && <Loading />}
              {!loading.pend && (
                <div className="col-sm-2 mb-1">
                  <button
                    className="btn btn-sm btn-block btn-success"
                    onClick={() => handleSave(data)}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          )} */}
        </Accordion>
      </>
    );
  };

  const SlidingDetailComponent = ({ data, show }) => {
    const [tableData, setTableData] = useState([]);
    const [DetailBlock, setDetailBlock] = useState([]);
    const [StainData, setStainData] = useState([]);
    const [payload2, setPayload2] = useState({
      TestId: "",
      LabNo: "",
      BlockId: "",
      SlideNo: "",
      SlideComment: "",
      Hno: "",
      Stain: "",
      InitialJunior: "",
      InitialSenior: "",
      JuniorEmpId: "",
      SeniorEmpId: "",
    });

    console.log(payload2);

    const handleChange2 = (e) => {
      const { name, value } = e.target;
      if (name == "JuniorEmpId") {
        const selectedDoctor = DoctorData?.find((doc) => doc.value == value);
        setPayload2((prev) => ({
          ...prev,
          JuniorEmpId: value,
          InitialJunior: selectedDoctor?.label,
        }));
      }
      if (name == "SeniorEmpId") {
        const selectedDoctor = DoctorData?.find((doc) => doc.value == value);
        setPayload2((prev) => ({
          ...prev,
          SeniorEmpId: value,
          InitialSenior: selectedDoctor?.label,
        }));
      } else {
        setPayload2((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    };

    const handleStainSelect = (index) => (e) => {
      const selectedStainId = e.target.value;
      const selectedStain = StainData.find(
        (stain) => stain.value == selectedStainId
      );
      setTableData((prev) =>
        prev.map((item, idx) =>
          idx === index ? { ...item, stain: selectedStain?.label || "" } : item
        )
      );
      setPayload2((prev) => ({
        ...prev,
        Stain: selectedStain?.label || "",
      }));
    };

    const getStainValue = (stainLabel) => {
      const stain = StainData.find((stain) => stain.label === stainLabel);
      return stain ? stain.value : "";
    };

    const handleSelectChange = (select, name) => {
      let val = "";
      for (let i = 0; i < select.length; i++) {
        val = val === "" ? `${select[i].value}` : `${val},${select[i].value}`;
      }
      setPayload({ ...payload, [name]: val });
    };

    const handleCreate = () => {
      const selectedBlockOption = DetailBlock.find(
        (option) => option.value === payload2?.SelectBlock
      );
      const selectBlock = selectedBlockOption?.label;

      const noOfSlides = parseInt(payload2?.NoOfSlides, 10) || 0;

      if (!selectBlock && !noOfSlides) {
        toast.error("Please select both Block and Slides");
        return;
      }
      if (!selectBlock || selectBlock === "Select") {
        toast.error("Please select Block");
        return;
      }
      if (!noOfSlides) {
        toast.error("Please select No of Slides");
        return;
      }

      const newRows = [];
      for (let i = 1; i <= noOfSlides; i++) {
        const slideNo = `${selectBlock}${String(i).padStart(2, "0")}`;
        newRows.push({
          serialNo: i,
          blockId: selectBlock,
          slideNo: slideNo,
          secNo: "",
          comment: "",
          stain: "",
        });
      }

      setTableData((prevData) => {
        const filteredData = prevData.filter(
          (row) => row.blockId !== selectBlock
        );

        return [...filteredData, ...newRows];
      });

      // toast.success(`${newRows.length} slides created successfully for block ${selectBlock}.`);
    };

    const handleSaveSliding = (e) => {
      const selectedBlockOption = DetailBlock.find(
        (option) => option.value === payload2?.SelectBlock
      );
      const selectBlock = selectedBlockOption?.label;
      const noOfSlides = parseInt(payload2?.NoOfSlides, 10) || 0;
      const isValidStain = tableData?.every((row) => row?.stain !== "");
      const juniorConsultant = payload2?.InitialJunior && payload2?.JuniorEmpId;
      const seniorConsultant = payload2?.InitialSenior && payload2?.SeniorEmpId;

      if (tableData.length === 0) {
        if (!selectBlock || selectBlock === "Select") {
          toast.error("Please select Block");
          return;
        }

        if (!noOfSlides) {
          toast.error("Please select No of Slides");
          return;
        }

        toast.error("Please create Slides");
        return;
      }

      console.log(isValidStain);

      if (!isValidStain) {
        toast.error("Please select Stain for all slides.");
        return;
      }

      // if (!payload2?.InitialJunior && !payload2?.JuniorEmpId) {
      //   toast.error("Please select junior consultant");
      //   return;
      // }

      if (!juniorConsultant) {
        toast.error("Please select primary consultant");
        return;
      }

      if (!seniorConsultant) {
        toast.error("Please select secondary consultant");
        return;
      }

      setLoading(true);
      const SlideDataList = tableData.map((row) => ({
        TestId: String(data?.TestID),
        Hno: data?.Hno,
        LabNo: data?.LedgerTransactionNo,
        BlockId: row?.blockId,
        SlideNo: row?.slideNo,
        SlideComment: row?.comment,
        Stain: row?.stain,
      }));
      console.log(SlideDataList);
      axiosInstance
        .post("HistoCyto/SaveDataSlide", {
          SlideDataList,
          InitialJunior: payload2?.InitialJunior,
          InitialSenior: payload2?.InitialSenior,
          JuniorEmpId: payload2?.JuniorEmpId,
          SeniorEmpId: payload2?.SeniorEmpId,
        })
        .then((res) => {
          setLoading(false);
          toast.success(res?.data?.message);
          setTableData([]);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    };

    const getDetailBlock = () => {
      axiosInstance
        .post("HistoCyto/Getdetailblock", {
          TestId: String(data?.TestID),
        })
        .then((res) => {
          const data = res?.data?.message;

          const val = data?.map((ele) => {
            return {
              label: ele?.blockid,
              value: ele?.VALUE,
            };
          });
          setDetailBlock([{ label: "Select", value: "" }, ...val]);

          console.log("setDetailBlock => " + JSON.stringify(setDetailBlock));
        })
        .catch((err) => console.log(err));
    };

    const getBindStain = () => {
      axiosInstance
        .get("HistoCyto/BindStain")
        .then((res) => {
          const data = res?.data?.message;
          const val = data?.map((ele) => {
            return {
              label: ele?.OrganName,
              value: ele?.ID,
            };
          });
          setStainData([{ label: "Select", value: "" }, ...val]);
        })
        .catch((err) => console.log(err));
    };

    console.log(DetailBlock);
    console.log(DoctorData);

    useEffect(() => {
      show && getDetailBlock();
      getBindStain();
    }, []);

    return (
      <>
        <Accordion title="Sliding Detail" defaultValue={true}>
          <div className="row px-2 mt-2 mb-1">
            <div className="col-sm-3">
              <SelectBox
                className="required-fields"
                options={DetailBlock}
                name="SelectBlock"
                id="SelectBlock"
                lable="Select Block"
                value={payload2.SelectBlock}
                onChange={handleChange2}
              />
            </div>
            <div className="col-sm-3">
              <SelectBox
                className="required-fields"
                options={NO_OF_SLIDES}
                name="NoOfSlides"
                id="NoOfSlides"
                lable="Number Of Slides"
                value={payload2.NoOfSlides}
                onChange={handleChange2}
              />
            </div>
            <div className="col-sm-2">
              <button
                className="btn btn-sm btn-block btn-success"
                onClick={() => handleCreate()}
              >
                {t("Make")}
              </button>
            </div>
          </div>
          <div className="row p-2">
            <div className="col-sm-12">
              <Tables>
                <thead>
                  <tr>
                    <th>S No.</th>
                    <th>HNo/CYNo</th>
                    <th>Sec No.</th>
                    <th>Block ID</th>
                    <th>Slide No</th>
                    <th>Comment</th>
                    <th>Stain</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, index) => (
                    <tr key={index}>
                      <td>{row.serialNo}</td>
                      <td>{/* Future HNo/CYNo */}</td>
                      <td>
                        {/* <input
                          type="text"
                          className="form-control"
                          value={row.secNo}
                          onChange={(e) =>
                            setTableData((prev) =>
                              prev.map((item, idx) =>
                                idx === index
                                  ? { ...item, secNo: e.target.value }
                                  : item
                              )
                            )
                          }
                          placeholder="Enter Sec No"
                        /> */}
                      </td>
                      <td>{row.blockId}</td>
                      <td>{row.slideNo}</td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={row.comment}
                          onChange={(e) =>
                            setTableData((prev) =>
                              prev.map((item, idx) =>
                                idx === index
                                  ? { ...item, comment: e.target.value }
                                  : item
                              )
                            )
                          }
                          placeholder="Enter Comment"
                        />
                      </td>
                      <td>
                        {/* <input
                          type="text"
                          className="form-control"
                          value={row.stain}
                          onChange={(e) =>
                            setTableData((prev) =>
                              prev.map((item, idx) =>
                                idx === index
                                  ? { ...item, stain: e.target.value }
                                  : item
                              )
                            )
                          }
                          placeholder="Enter Stain"
                        /> */}
                        <SelectBox
                          name="Stain"
                          className="required-fields"
                          id={`stain-${index}`}
                          options={StainData}
                          value={getStainValue(row.stain)}
                          onChange={handleStainSelect(index)}
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            setTableData((prev) =>
                              prev.filter((_, idx) => idx !== index)
                            )
                          }
                        >
                          <i className="pi pi-times" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Tables>
            </div>
          </div>
          <div className="row px-2 mt-2 mb-1">
            <div className="col-sm-4">
              <SelectBox
                className="required-fields"
                options={DoctorData}
                value={payload2.JuniorEmpId}
                name="JuniorEmpId"
                id="JuniorEmpId"
                lable="Consultant Pathologist"
                onChange={handleChange2}
                placeholder=""
              />
            </div>
            <div className="col-sm-4">
              <SelectBox
                className="required-fields"
                options={DoctorData}
                value={payload2.SeniorEmpId}
                name="SeniorEmpId"
                id="SeniorEmpId"
                lable="Secondary Pathologist"
                onChange={handleChange2}
                placeholder=""
              />
            </div>
            <div className="col-sm-2">
              <button
                className="btn btn-block btn-sm btn-success"
                onClick={() => handleSaveSliding()}
              >
                {t("Save Sliding")}
              </button>
            </div>
          </div>
        </Accordion>
      </>
    );
  };

  const GrossingAndSlidingComponent1 = ({ data, show }) => {
    const [BlockData, setBlockData] = useState([]);
    const [StainData, setStainData] = useState([]);
    const [payload2, setPayload2] = useState({
      NoOfBlock: "",
      StartFrom: "",
      SelectBlock: "",
      NoOfSlides: "",
      DoctorID1: "",
      DoctorID2: "",
    });

    const handleChange2 = (e) => {
      const { name, value } = e.target;
      setPayload2((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleSelectChange = (e, index) => {
      const { name, value } = e.target;
      setBlockData((prev) =>
        prev.map((block, i) =>
          i === index ? { ...block, [name]: value } : block
        )
      );
    };

    const handleCreate = () => {
      alert("handleCreate()");
    };

    const handleMarkComplete = () => {
      axiosInstance
        .post("HistoCyto/MarkComplete", {
          testid: String(data?.TestID),
        })
        .then((res) => {
          setLoading(true);
          toast.success(res?.data?.message);
          setBlockData([]);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    };

    const handlePrintGross = () => {
      alert("handlePrintGross()");
    };

    const handlePrintLabel = () => {
      alert("handlePrintLabel()");
    };

    const testSelectBlockOptions = [
      {
        label: "Select",
        value: "",
      },
      {
        label: "A1_",
        value: "A1_",
      },
      {
        label: "A2_",
        value: "A2_",
      },
      {
        label: "A3_",
        value: "A3_",
      },
    ];

    const getBindStain = () => {
      axiosInstance
        .get("HistoCyto/BindStain")
        .then((res) => {
          const data = res?.data?.message;
          const val = data?.map((ele) => {
            return {
              label: ele?.OrganName,
              value: ele?.ID,
            };
          });
          setStainData([{ label: "Select", value: "" }, ...val]);
        })
        .catch((err) => console.log(err));
    };

    const getDetailBackDataBlock = () => {
      axiosInstance
        .post("HistoCyto/getdetailBackDataBlock", {
          TestId: String(data?.TestID),
        })
        .then((res) => {
          const data = res?.data?.message;
          setBlockData(data);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
        });
    };

    useEffect(() => {
      if (show) {
        getDetailBackDataBlock();
        getBindStain();
      }
    }, []);

    return (
      <>
        <Accordion title="Grossing and Sliding Detail" defaultValue={true}>
          <div className="row px-2 mt-2 mb-1">
            <div className="col-sm-4">
              <SelectBox
                options={testSelectBlockOptions}
                id="NoOfBlock"
                lable="No. of Block"
                name="NoOfBlock"
                selectedValue={payload2?.NoOfBlock}
                onChange={handleChange2}
                isDisabled={true}
              />
            </div>
            <div className="col-sm-4">
              <SelectBox
                option={CASSET_RANGE}
                name="StartFrom"
                id="StartFrom"
                lable="Start From"
                selectedValue={payload2?.StartFrom}
                onChange={handleChange2}
                isDisabled={true}
              />
            </div>
            <div className="col-sm-2">
              <button
                className="btn btn-sm btn-block btn-success"
                onClick={() => handleCreate()}
                disabled={true}
              >
                {t("Make")}
              </button>
            </div>
          </div>
          <div className="row px-2 mt-2 mb-1">
            <div className="col-sm-4">
              <SelectBox
                options={testSelectBlockOptions}
                name="SelectBlock"
                id="SelectBlock"
                lable="Select Block"
                selectedValue={payload2?.SelectBlock}
                onChange={handleChange2}
                isDisabled={true}
              />
            </div>
            <div className="col-sm-4">
              <SelectBox
                options={NO_OF_SLIDES}
                name="NoOfSlides"
                id="NoOfSlides"
                lable="No of Slides"
                selectedValue={payload2?.NoOfSlides}
                onChange={handleChange2}
                isDisabled={true}
              />
            </div>
            <div className="col-sm-2">
              <button
                className="btn btn-sm btn-block btn-success"
                onClick={() => handleCreate()}
                disabled={true}
              >
                {t("Make")}
              </button>
            </div>
          </div>
          <div className="row p-2">
            <div className="col-sm-12">
              <Tables>
                <thead>
                  <tr>
                    <th>S No.</th>
                    <th>HNo/CYNo</th>
                    <th>Sec No.</th>
                    <th>Block ID</th>
                    <th>Slide No</th>
                    <th>Comment</th>
                    <th>Stain</th>
                  </tr>
                </thead>
                <tbody>
                  {BlockData.map((block, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{block?.HNo}</td>
                      <td></td>
                      <td>{block?.blockid}</td>
                      <td>{block?.slideno}</td>
                      <td>
                        <Input
                          type="text"
                          className="required-fields"
                          value={block?.slidecomment}
                          name="slidecomment"
                          id="slidecomment"
                          onChange={handleChange2}
                          placeholder=""
                          lable={t("Enter Comment")}
                        />
                      </td>
                      {console.log(block)}
                      {console.log(StainData)}
                      <td>
                        <SelectBox
                          name="Stain"
                          id="Stain"
                          options={StainData}
                          selectedValue={block?.StainId}
                          className="required-fields"
                          onChange={(e) => handleSelectChange(e, index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Tables>
            </div>
          </div>
          <div className="row px-2 mt-2 mb-1">
            <div className="col-sm-4">
              <button
                className="btn btn-block btn-sm btn-success"
                onClick={() => handleMarkComplete()}
              >
                {t("Mark Complete")}
              </button>
            </div>
            <div className="col-sm-4">
              <button
                className="btn btn-block btn-sm btn-success"
                onClick={() => handlePrintGross()}
              >
                {t("Print Gross Label")}
              </button>
            </div>
            <div className="col-sm-4">
              <button
                className="btn btn-block btn-sm btn-success"
                onClick={() => handlePrintLabel()}
              >
                {t("Print Slide Label")}
              </button>
            </div>
          </div>
        </Accordion>
      </>
    );
  };

  const GrossingAndSlidingComponent2 = ({ data, show }) => {
    const [tableData, setTableData] = useState([]);
    const [payload2, setPayload2] = useState({
      NoOfBlock: "",
      StartFrom: "",
      SelectBlock: "",
      NoOfSlides: "",
    });

    const handleChange2 = (e) => {
      const { name, value } = e.target;
      setPayload2((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleCreate = () => {
      alert("handleCreate()");
    };

    const handleMarkComplete = () => {
      alert("handleMarkComplete()");
    };

    const handlePrintGross = () => {
      alert("handlePrintGross()");
    };

    const handlePrintLabel = () => {
      alert("handlePrintLabel()");
    };

    const testSelectBlockOptions = [
      {
        label: "Select Block",
        value: "",
      },
      {
        label: "A1_",
        value: "A1_",
      },
      {
        label: "A2_",
        value: "A2_",
      },
      {
        label: "A3_",
        value: "A3_",
      },
    ];

    return (
      <>
        <Accordion title="Grossing and Sliding Detail" defaultValue={true}>
          <div className="row px-2 mt-2 mb-1">
            <div className="col-sm-4">
              <SelectBox
                options={testSelectBlockOptions}
                id="NoOfBlock"
                lable="No. of Block"
                name="NoOfBlock"
                selectedValue={payload2?.NoOfBlock}
                onChange={handleChange2}
                isDisabled={true}
              />
            </div>
            <div className="col-sm-4">
              <SelectBox
                option={CASSET_RANGE}
                name="StartFrom"
                id="StartFrom"
                lable="Start From"
                selectedValue={payload2?.StartFrom}
                onChange={handleChange2}
                isDisabled={true}
              />
            </div>
            <div className="col-sm-2">
              <button
                className="btn btn-sm btn-block btn-success"
                onClick={() => handleCreate()}
                disabled={true}
              >
                {t("Make")}
              </button>
            </div>
          </div>
          <div className="row px-2 mt-2 mb-1">
            <div className="col-sm-4">
              <SelectBox
                options={testSelectBlockOptions}
                name="SelectBlock"
                id="SelectBlock"
                lable="Select Block"
                selectedValue={payload2?.SelectBlock}
                onChange={handleChange2}
                isDisabled={true}
              />
            </div>
            <div className="col-sm-4">
              <SelectBox
                options={NO_OF_SLIDES}
                name="NoOfSlides"
                id="NoOfSlides"
                lable="No of Slides"
                selectedValue={payload2?.NoOfSlides}
                onChange={handleChange2}
                isDisabled={true}
              />
            </div>
            <div className="col-sm-2">
              <button
                className="btn btn-sm btn-block btn-success"
                onClick={() => handleCreate()}
                disabled={true}
              >
                {t("Make")}
              </button>
            </div>
          </div>
          <div className="row p-2">
            <div className="col-sm-12">
              <Tables>
                <thead>
                  <tr>
                    <th>S No.</th>
                    <th>HNo/CYNo</th>
                    <th>Sec No.</th>
                    <th>Block ID</th>
                    <th>Slide No</th>
                    <th>Comment</th>
                    <th>Stain</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {tableData.map((row, index) => ( */}
                  {/* <tr key={index}> */}
                  <tr>
                    <td>1</td>
                    <td>H-08216/24</td>
                    <td></td>
                    <td>E1_</td>
                    <td>E1_01</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        // value={""}
                        // onChange={(e) =>
                        //   setTableData((prev) =>
                        //     prev.map((item, idx) =>
                        //       idx === index
                        //         ? { ...item, comment: e.target.value }
                        //         : item
                        //     )
                        //   )
                        // }
                        onChange={handleChange2}
                        placeholder="Enter Comment"
                      />
                    </td>
                    <td>
                      <SelectBox
                        name="Stain"
                        id="Stain"
                        selectedValue={block?.Stain}
                        onChange={handleChange2}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>H-08216/24</td>
                    <td></td>
                    <td>E1_</td>
                    <td>E1_02</td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        // value={""}
                        // onChange={(e) =>
                        //   setTableData((prev) =>
                        //     prev.map((item, idx) =>
                        //       idx === index
                        //         ? { ...item, comment: e.target.value }
                        //         : item
                        //     )
                        //   )
                        // }
                        placeholder="Enter Comment"
                        onChange={handleChange2}
                      />
                    </td>
                    <td>
                      <SelectBox
                        name="Stain"
                        id="Stain"
                        onChange={handleChange2}
                      />
                    </td>
                  </tr>
                  {/* ))} */}
                </tbody>
              </Tables>
            </div>
          </div>
          <div className="row px-2 mt-2 mb-1">
            <div className="col-sm-4">
              <button
                className="btn btn-block btn-sm btn-success"
                onClick={() => handleMarkComplete()}
              >
                {t("Mark Complete")}
              </button>
            </div>
            <div className="col-sm-4">
              <button
                className="btn btn-block btn-sm btn-success"
                onClick={() => handlePrintGross()}
              >
                {t("Print Gross Label")}
              </button>
            </div>
            <div className="col-sm-4">
              <button
                className="btn btn-block btn-sm btn-success"
                onClick={() => handlePrintLabel()}
              >
                {t("Print Slide Label")}
              </button>
            </div>
          </div>
        </Accordion>
      </>
    );
  };

  const handleSearchWiseDetails = (type, data) => {
    switch (type) {
      case "":
        return <GrossingDetailComponent data={data} show={true} />;
        break;
      case "Grossed":
        return <SlidingDetailComponent data={data} show={true} />;
        break;
      case "Slided":
        return <GrossingAndSlidingComponent1 data={data} show={true} />;
        break;
      case "Completed":
        return <GrossingAndSlidingComponent2 data={data} show={true} />;
        break;
      default:
        break;
    }
    // return (
    //   <>
    //     <GrossingDetailComponent data={data} show={true} />
    //     <SlidingDetailComponent data={data} show={true} />
    //     <GrossingAndSlidingComponent1 data={data} show={true} />
    //     <GrossingAndSlidingComponent2 data={data} show={true} />
    //   </>
    // );
  };

  return (
    <>
      {" "}
      {load ? (
        <Loading />
      ) : (
        <>
          {show2 && (
            <UploadFile
              show={show2}
              handleClose={() => setShow2(false)}
              pageName="ViewDoc"
              documentId={payload?.Doc}
            />
          )}
          <Accordion
            name="Histo Cyto Grossing And Sliding"
            defaultValue={true}
            isBreadcrumb={true}
          >
            <div className="row px-2 mt-2 mb-1">
              <div className="col-sm-2">
                <SelectBox
                  name="HistoCytoStatus"
                  id="Status"
                  lable="Status"
                  options={STATUS}
                  selectedValue={payload?.HistoCytoStatus}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-sm-2">
                <DatePicker
                  name="FromDate"
                  id="FromDate"
                  lable="From Date"
                  className="custom-calendar"
                  value={payload?.FromDate}
                  onChange={dateSelect}
                  maxDate={new Date(payload?.ToDate)}
                />
              </div>
              <div className="col-sm-2">
                <DatePicker
                  name="ToDate"
                  id="ToDate"
                  lable="To Date"
                  className="custom-calendar"
                  value={payload?.ToDate}
                  onChange={dateSelect}
                  maxDate={new Date()}
                  minDate={new Date(payload?.FromDate)}
                />
              </div>
              <div className="col-sm-2">
                <Input
                  type="text"
                  name="LedgerTransactionNo"
                  id="VisitNo"
                  lable="Visit Number"
                  placeholder=""
                  value={payload?.LedgerTransactionNo}
                  onChange={handleChange}
                />
              </div>
              <div className="col-sm-2">
                <Input
                  type="text"
                  name="BarcodeNo"
                  id="BarcodeNo"
                  lable="Barcode"
                  placeholder=""
                  value={payload?.BarcodeNo}
                  onChange={handleChange}
                />
              </div>
              <div className="col-sm-2">
                <SelectBox
                  options={AddBlankData(DepartmentData, "All Department")}
                  lable="Department"
                  id="Department"
                  selectedValue={payload.DepartmentId}
                  name="DepartmentId"
                  onChange={handleSelectChange}
                />
              </div>
            </div>
            <div className="row px-2 mb-1">
              <div className="col-sm-1">
                <button
                  className="btn btn-sm btn-success w-100"
                  onClick={() => handleSearch(payload?.HistoCytoStatus)}
                >
                  {t("Search")}
                </button>
              </div>
              {STATUS_BUTTON.map((ele, index) => (
                <div key={index} className="col-sm-1 mt-1 d-flex">
                  <button
                    className="statusConfirmed"
                    style={{
                      backgroundColor: ele?.color,
                    }}
                    id={ele?.label}
                    onClick={() => handleSearch(ele?.type)}
                  ></button>
                  <label
                    className="mt-1 ml-1"
                    htmlFor={ele?.label}
                    style={{
                      color: "black",
                    }}
                  >
                    {ele?.label}
                  </label>
                </div>
              ))}
            </div>
            {console.log(tableData)}
          </Accordion>
          {
            <>
              <div className="row">
                <div className="col-sm-6">
                  {loading ? (
                    <Loading />
                  ) : (
                    <>
                      <Accordion
                        title={`Total Patient : ${tableData?.length}`}
                        defaultValue={true}
                      >
                        {tableData.length > 0 ? (
                          <>
                            <Tables>
                              <thead>
                                <tr>
                                  <th>S.No</th>
                                  <th>VisitNo./LRN</th>
                                  <th>Barcode No</th>
                                  <th>Patient Name</th>
                                  <th>Test Name</th>
                                  <th>Sample Receiving Date and Time</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Array.isArray(tableData) &&
                                  tableData.map((ele, index) => (
                                    <tr
                                      key={index}
                                      style={{
                                        cursor: "pointer",
                                        background: ele?.rowcolor,
                                      }}
                                      onClick={() => setSingleData(ele)}
                                    >
                                      <td>{index + 1}</td>
                                      <td>{ele?.LedgerTransactionNo}</td>
                                      <td>{ele?.BarcodeNo}</td>
                                      <td>{ele?.PName}</td>
                                      <td>{ele?.TestName}</td>
                                      <td>{ele?.SampleReceiveDate}</td>
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
                      </Accordion>
                    </>
                  )}
                </div>
                {singleData && Object?.keys(singleData)?.length > 0 && (
                  <div className="col-sm-6">
                    {!loading && (
                      <Accordion title="Details" defaultValue={true}>
                        <Tables>
                          <tbody>
                            <tr className="line-height-table">
                              <td className="requiredlabel">Patient Name:</td>
                              <td colSpan={3}>{singleData?.PName}</td>
                            </tr>
                            <tr className="line-height-table">
                              <td className="requiredlabel">Age:</td>
                              <td>{singleData?.Age}</td>
                              <td className="requiredlabel">Gender:</td>
                              <td>{singleData?.Gender}</td>
                            </tr>

                            <tr className="line-height-table">
                              <td className="requiredlabel">Visit No:</td>
                              <td>{singleData?.LedgerTransactionNo}</td>
                              <td className="requiredlabel">Barcode No:</td>
                              <td>{singleData?.BarcodeNo}</td>
                            </tr>

                            <tr className="line-height-table">
                              <td className="requiredlabel">Test Name:</td>
                              <td colSpan={3}>{singleData?.TestName}</td>
                            </tr>

                            <tr className="line-height-table">
                              <td className="requiredlabel">Sample Type:</td>
                              <td>{singleData?.SampleTypeName}</td>
                              <td className="requiredlabel">Sample Info</td>
                              <td>{singleData?.SampleInfo}</td>
                            </tr>

                            <tr className="line-height-table">
                              <td className="requiredlabel">
                                Sample Col. Date:
                              </td>
                              <td>{singleData?.SampleCollectionDate}</td>
                              <td className="requiredlabel">
                                Sample Rec. Date:
                              </td>
                              <td>{singleData?.SampleReceiveDate}</td>
                            </tr>

                            <tr className="line-height-table">
                              <td className="requiredlabel">Status:</td>
                              <td>{singleData?.HistoCytoStatus}</td>
                              <td className="requiredlabel">Slide Number:</td>
                              <td>{singleData?.SlideNumber}</td>
                            </tr>

                            <tr className="line-height-table">
                              <td className="requiredlabel">HNo:</td>
                              <td>{singleData?.Hno}</td>
                              <td className="requiredlabel">Speciment Type:</td>
                              <td>{}</td>
                            </tr>
                          </tbody>
                        </Tables>
                        <div className="row px-2 mt-2 mb-1">
                          <div className="col-sm-2">
                            <button
                              className="btn btn-sm btn-success w-100"
                              onClick={() => {
                                setShow(true);
                              }}
                            >
                              {t("View Remarks")}
                            </button>
                          </div>
                          <div className="col-sm-2">
                            <button
                              className="btn btn-sm btn-success w-100"
                              onClick={() => {
                                setShow2(true);
                              }}
                            >
                              {t("View Doc")}
                            </button>
                          </div>
                        </div>
                        <div className="mt-3">
                          {handleSearchWiseDetails(
                            singleData?.HistoCytoStatus,
                            singleData
                          )}
                        </div>
                        {loading && <Loading />}
                      </Accordion>
                    )}
                    {loading && <Loading />}
                  </div>
                )}
              </div>
            </>
          }
        </>
      )}
    </>
  );
};

export default HistoCytoGrossingAndSliding;
