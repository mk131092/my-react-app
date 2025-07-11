import React, { useState } from "react";
import Accordion from "@app/components/UI/Accordion";
import { useTranslation } from "react-i18next";
import Input from "../../components/formComponent/Input";
import Tables from "../../components/UI/customTable";
import Loading from "../../components/loader/Loading";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { number } from "../../utils/helpers";

const SMSData = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const getDepartmentWiseItemList = async () => {
    if (inputValue?.length < 10) {
      toast.error("Mobile Number Must Be Of 10 Digits");
      setTableData([]);
      return;
    }

    setLoading(true);
    axiosInstance
      .post("CompanyMaster/GetSmsData", {
        MOBILENO: inputValue,
      })
      .then((res) => {
        setTableData(res?.data?.data);
        toast.success(res?.data?.message);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(
          err?.response?.data?.message
            ? err.response.data.message
            : "Error occurred while fetching data"
        );
        setTableData([]);
      });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <Accordion name={t("Print Page")} isBreadcrumb={true} defaultValue={true}>
        <div className="row pt-2 pl-2 pr-2 mt-1">
          <div className="col-sm-2">
            <Input
              className="required-fields"
              lable="Enter Mobile Number"
              id="Mobile"
              placeholder=" "
              name="Mobile"
              max={10}
              type="number"
              value={inputValue}
              onInput={(e) => number(e, 10)}
              onChange={handleInputChange}
            />
          </div>

          <div className="col-md-1">
            <button
              className="btn btn-block btn-sm btn-success"
              onClick={getDepartmentWiseItemList}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </Accordion>
      <Accordion title={t("Search Data")} defaultValue={true}>
        {loading ? (
          <Loading />
        ) : (
          <div className="row p-2 ">
            <div className="col-12">
              <Tables>
                <thead>
                  <tr>
                    <th>{t("S No.")}</th>
                    <th>{t("LabNo")}</th>
                    <th>{t("Mobile Number")}</th>
                    <th>{t("SMS Text")}</th>
                    <th>{t("Is Send")}</th>
                    <th>{t("Type")}</th>
                    <th>{t("Company ID")}</th>
                    <th>{t("Is Active")}</th>
                    <th>{t("Entry Date")}</th>
                    <th>{t("Created By ID")}</th>
                    <th>{t("Created By Name")}</th>
                    <th>{t("Updated By ID")}</th>
                    <th>{t("Updated By Name")}</th>
                    <th>{t("WhatsApp Send Status")}</th>
                    <th>{t("WhatsApp Date")}</th>
                    <th>{t("Is WhatsApp SMS")}</th>
                    <th>{t("Category")}</th>
                  </tr>
                </thead>
                {tableData.map((ele, index) => (
                  <tbody key={index}>
                    <tr>
                      <td>{index + 1}</td>
                      <td>{ele?.LabNo}</td>
                      <td>{ele?.MOBILENO}</td>
                      <td>{ele?.SMSTEXT}</td>
                      <td>{ele?.IsSend}</td>
                      <td>{ele?.TYPE}</td>
                      <td>{ele?.CompanyID}</td>
                      <td>{ele?.isActive ? "Active" : "InActive"}</td>
                      <td>{ele?.dtEntry}</td>
                      <td>{ele?.CreatedBy}</td>
                      <td>{ele?.CreatedByName}</td>
                      <td>{ele?.UpdatedBy}</td>
                      <td>{ele?.UpdatedByName}</td>
                      <td>{ele?.IsWhatsAppSend}</td>
                      <td>{ele?.dtWhatsApp}</td>
                      <td>{ele?.IsWhatsAppSms}</td>
                      <td>{ele?.Category}</td>
                    </tr>
                  </tbody>
                ))}
              </Tables>
            </div>
          </div>
        )}
      </Accordion>
    </>
  );
};

export default SMSData;
