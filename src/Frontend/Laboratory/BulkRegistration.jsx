import React, { useState } from "react";
import Accordion from "@app/components/UI/Accordion";
import Input from "../../components/formComponent/Input";
import { SelectBox } from "../../components/formComponent/SelectBox";
import ExportFile from "../../components/formComponent/ExportFile";
import * as XLSX from "xlsx";
import moment from "moment";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";

import { useTranslation } from "react-i18next";
const options = [
  {
    label: "Bulk Registration",
    value: "1",
  },
];

const BulkRegistration = () => {
  const PATIENT_HEADER = [
    {
      Title: "",
      PatientName: "",
      Centre: "",
      CentreID: "",
      RateTypeID: "",
      RateTypeName: "",
      DOB: "",
      Gender: "",
      AgeYear: "",
      DoctorID: "",
      DoctorName: "",
      TestId: "",
      IsPackage: "",
      Mobile: "",
      SampleCollectionDate: "",
      SampleCollectionTime: "",
    },
  ];

  const { t } = useTranslation();
  const [tableData, setTableData] = useState(PATIENT_HEADER);
  const [dropValue, setDropValue] = useState("1");
  const [ExcelPreview, setExcelPreview] = useState({
    header: [],
    body: [],
    exportJSON: [],
  });

  const uploadFile = (event) => {
    let fileObj = event.target.files[0];

    var reader = new FileReader();

    reader.readAsArrayBuffer(fileObj);

    reader.onload = () => {
      // Make a fileInfo Object
      var data = new Uint8Array(reader.result);
      var work_book = XLSX.read(data, { type: "array" });
      var sheet_name = work_book.SheetNames;
      var exportJSON = XLSX.utils.sheet_to_json(
        work_book.Sheets[sheet_name[0]]
      );
      var sheet_data = XLSX.utils.sheet_to_json(
        work_book.Sheets[sheet_name[0]],
        {
          header: 1,
        }
      );
      console.log(exportJSON);
      setExcelPreview({
        ...ExcelPreview,
        header: sheet_data[0],
        body: sheet_data.slice(1, sheet_data.length),
        exportJSON: exportJSON,
      });
    };
  };
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
    return guidNumber;
  };

  const handleSPlit = (data, sepa) => {
    const finalData = data?.toString();
    return finalData?.split(sepa);
  };
  const calculateDOB = (dob) => {
    console.log(dob);
    if (dob != "") {
      const currentDate = new Date();
      const currentYear = currentDate?.getFullYear();
      const birthYear = currentYear - dob;
      const month = currentDate?.getMonth();
      const day = currentDate?.getDate();

      const calculatedDOB = new Date(birthYear, month, day);

      return moment(calculatedDOB).format("YYYY-MM-DD");
    } else return "";
  };

  const handlePayloadAndURL = () => {
    if (dropValue === "1") {
      console.log(ExcelPreview?.exportJSON);
      const data = ExcelPreview?.exportJSON?.map((ele) => {
        return {
          PatientData: {
            DOB:
              ele?.DOB === "" || !ele?.DOB
                ? calculateDOB(ele?.AgeYear)
                : ele?.DOB,
            Age: ele?.AgeYear,
            AgeYear: ele?.AgeYear,
            Title: ele?.Title,
            FirstName: ele?.PatientName,
            CentreID: ele?.CentreID,
            Gender: ele?.Gender,
            Mobile: ele?.Mobile,
          },
          LTData: {
            PName: ele?.Title + " " + ele?.PatientName,
            Age: ele?.AgeYear,
            Gender: ele?.Gender,
            CentreName: ele?.Centre,
            DoctorID: ele?.DoctorID,
            DoctorName: ele?.DoctorName,
            CentreID: ele?.CentreID,
            RateTypeName: ele?.RateTypeName,
            RateTypeID: ele?.RateTypeID,
            LedgerTransactionIDHash: guidNumber(),
          },
          PLO: handleSPlit(ele?.TestId, ",").map((datas) => {
            return {
              ItemId: datas,
              InvestigationID: datas,
              Gender: ele?.Gender,
              CentreID: ele?.CentreID,
              IsPackage: ele?.IsPackage,
              SampleCollectionDateTime:
                ele?.SampleCollectionDate + " " + ele?.SampleCollectionTime,
              Status:
                !ele?.SampleCollectionDate || ele?.SampleCollectionDate === ""
                  ? "1"
                  : "2",
            };
          }),
        };
      });
      return {
        URL: "Camp/BulkSaveData",
        payload: data,
      };
    } else if (dropValue === "2") {
      return {
        URL: "SC/BulkSampleCollecitonReceive",
        payload: ExcelPreview?.exportJSON,
      };
    } else if (dropValue === "3") {
      return {
        URL: "SC/BulkDepatmentReceive",
        payload: ExcelPreview?.exportJSON,
      };
    }
  };

  const handleSaveToDatabase = () => {
    const { URL, payload } = handlePayloadAndURL();
    axiosInstance
      .post(URL, { data: payload })
      .then((res) => {
        document.getElementById("file").value = "";
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      });
  };

  const SearchURL = (value) => {
    return value === "2"
      ? "SearchBulkSampleColleciton"
      : "SearchBulkDepatmentReceive";
  };

  const handleSelect = (e) => {
    const { value } = e.target;
    setDropValue(value);
    if (["1", "2"].includes(value)) {
      axios
        .post(`SC/${SearchURL(value)}`)
        .then((res) => {
          setTableData(res?.data?.message);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      <Accordion
        name={t("Bulk Registration")}
        isBreadcrumb={true}
        defaultValue={true}
      >
        <div className="row  px-2 mt-2">
          <div className="col-sm-2">
            <SelectBox
              options={options}
              onChange={handleSelect}
              value={dropValue}
              name="BulkRegistration"
              id="BulkRegistration"
              lable="Bulk Registration"
            />
          </div>
          <div className="col-sm-2">
            <ExportFile dataExcel={tableData} />
          </div>
          <div className="col-sm-2">
            <input
              type="file"
              className="form-control-file"
              onChange={uploadFile}
              id="file"
            />
          </div>
          <div className="col-sm-2">
            <button
              className="btn btn-block btn-primary btn-sm"
              onClick={() => handleSaveToDatabase()}
              disabled={ExcelPreview?.exportJSON?.length === 0 ? true : false}
            >
              {t("Save To Database")}
            </button>
          </div>
        </div>
      </Accordion>
    </>
  );
};

export default BulkRegistration;
