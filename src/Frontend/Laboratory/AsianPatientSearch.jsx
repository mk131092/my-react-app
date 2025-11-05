import React, { useEffect, useState } from "react";
import Accordion from "../../components/UI/Accordion";
import { useTranslation } from "react-i18next";
import Input from "../../components/formComponent/Input";
import { axiosInstance} from "../../utils/axiosInstance";
import { notify } from "../../utils/utils";
import Tables from "../../components/UI/customTable";
import { FaPrint } from "react-icons/fa";
import Loading from "../../components/loader/Loading";

const AsianPatientSearch = ({ selectedUHID }) => {
    const [t] = useTranslation();

    const [uhid, setUhid] = useState(""); 
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(false);
    
    //handle UHID input change
    const handleUHIDChange = (e) => {
        const value = e.target.value;
        setUhid(value); 
    };
    
    //handle Print click
    const handlePrintClick = async (reportNumber) => {
        
        await axiosInstance.post(
            "Lab/PatientReport",
            { ReportNumber: reportNumber }
        ).then((res) => {
           // const fileUrl = res?.data?.url;
            // Open in a new browser tab
         

           let fileUrl = res?.data?.url;
        const randomNumber = Math.floor(Math.random() * 1000000); // generate random number

        // Check if the URL already has a query string
        if (fileUrl.includes("?")) {
            fileUrl += `&rnd=${randomNumber}`;
        } else {
            fileUrl += `?rnd=${randomNumber}`;
        }
           window.open(fileUrl, "_blank");

        })
        .catch((err) => {
            console.log("Error", err);
            notify(err?.data?.message, "error");
        })
    };

    //handle Report Search
    const handleReportSearch = async (reportNumber) => {
        
        const searchPayload = {
            UHID: reportNumber
        }
      try {
    setLoading(true); 
    const res = await axiosInstance.post(
        "Lab/LabTestDetails",
        searchPayload
    );

    const parsedMessage = JSON.parse(res?.data?.message || "[]");

    // ✅ Group by ReportNumber
    const grouped = parsedMessage.reduce((acc, item) => {
        const key = item.ReportNumber || "NoReport"; 
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {});

    // ✅ Convert groups into mapped array
    let srNo = 1;
    const mapped = Object.entries(grouped).map(([reportNumber, items]) => {
        // Format date (take first item’s BillDate)
        const dateObj = new Date(items[0].BillDate);
        const formattedDate = dateObj
            .toLocaleDateString("en-GB")
            .replace(/\//g, "-");

        // ✅ Distinct Bill Numbers
        const distinctBills = [...new Set(items.map(x => x.BillNumber))].join(", ");

        // ✅ Service Names (can also make distinct if needed)
        const serviceNames = items.map(x => x.ServiceName).join(", ");

        return {
            SrNo: srNo++,
            BillDate: formattedDate,
            BillNumber: distinctBills,
            ServiceName: serviceNames,
            ReportNumber: reportNumber !== "NoReport" ? reportNumber : "",
            Print: reportNumber && reportNumber !== "NoReport" ? (
                <div style={{ display: "flex", gap: "8px" }}>
                    <span
                        style={{ cursor: "pointer" }}
                        onClick={() => handlePrintClick(reportNumber)}
                    >
                        <FaPrint />
                    </span>
                </div>
            ) : "Report not generated",
        };
    });

    setTableData(mapped);

} catch (err) {
    console.error("Error", err);
    notify(err?.data?.message || "Something went wrong", "error");
} finally {
    setLoading(false); 
}


    };

    useEffect(() => {
        if (selectedUHID) {
            setUhid(selectedUHID); 
            handleReportSearch(selectedUHID);
        }
    }, [selectedUHID]);

    return (
        <>
            
                <Accordion defaultValue={true} title={t("Asian Patient Search")} />
                <div className="row pt-2 pl-2 pr-2">

                    <div className="col-sm-3 col-6">
                        <Input
                            type="text"
                            lable={t("UHID")}
                            max={15}
                            value={uhid}
                            name="UHIDReport"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleReportSearch(uhid);
                                }
                            }}
                            placeholder=" "
                            id="UHIDReport"
                            onChange={handleUHIDChange}
                        />
                    </div>
                    {/* <div className="col-sm-2">
                        <button
                            type="button"
                            className="btn btn-block btn-info btn-sm"
                            onClick={() => handleReportSearch(uhid)}
                        >
                            {t("Search")}
                        </button>
                    </div> */}
                </div>
                <Accordion defaultValue={true} title={t("Search Details")} />
                <div className="row pt-2 pl-2 pr-2">
                    <div className="col-12">
                        {loading ? (
                            <Loading />
                        ) : (
                            <Tables>
                                <thead>
                                    <tr>
                                        <th className="text-center" style={{ width: "50px" }}>{"Sr No."}</th>
                                        <th>{t("Bill Date")}</th>
                                        <th>{t("Bill Number")}</th>
                                        <th>{t("Service Name")}</th>
                                        <th>{t("Report Number")}</th>
                                        <th>{t("Print")}</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {tableData.length > 0 ? (
                                        tableData.map((data, index) => (
                                            <tr key={index}>
                                                <td className="text-center" style={{ width: "50px" }}>{data.SrNo}</td>
                                                <td>{data.BillDate}</td>
                                                <td>{data.BillNumber}</td>
                                                <td style={{ width: "150px", whiteSpace: "normal", wordBreak: "break-word" }}>{data.ServiceName}</td>
                                                <td>{data.ReportNumber}</td>
                                                <td>{data.Print}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center text-muted">
                                                No record found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Tables>
                        )}

                    </div>
                </div>
        </>
    );
}

export default AsianPatientSearch;