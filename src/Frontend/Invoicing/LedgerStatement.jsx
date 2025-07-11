import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SelectBoxWithCheckbox } from "../../components/formComponent/MultiSelectBox";
import Tables from "../../components/UI/customTable";
import Accordion from "@app/components/UI/Accordion";
import { toast } from "react-toastify";
import DatePicker from "../../components/formComponent/DatePicker";
import moment from "moment";
import Loading from "../../components/loader/Loading";
import { ExportToExcel } from "../../utils/helpers";
import { axiosInstance } from "../../utils/axiosInstance";
import NoRecordFound from "../../components/formComponent/NoRecordFound";

const LedgerStatement = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    CentreId: "",
    Paymentmode: "",
    selectall: false,
    Date: new Date(),
    RateTypeID: [],
  });
  const [loading, setLoading] = useState(false);
  const [excelData, setExcelData] = useState([]);
  const [Ratetypes, setRatetypes] = useState([]);

  const handleSelectMultiChange = (select, name) => {
    const val = select.map((ele) => {
      return ele?.value;
    });

    setFormData({ ...formData, [name]: val });
  };

  const handleSearch = () => {
    setLoading(true);
    console.log(formData);
    let obj = {
      chkCenter: formData?.RateTypeID,
      FromDate: moment(formData?.Date).format("DD-MMM-YYYY"),
    };
    if (obj?.chkCenter?.length > 0) {
      axiosInstance
        .post("Accounts/GetLedgerStatement", obj)
        .then((res) => {
          console.log(res?.data?.message);
          if (res?.data?.message.length == 0) {
            toast.error("No Data Found");
            setExcelData([]);
          } else {
            setExcelData(res?.data?.message);
          }
          setLoading(false);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
          setLoading(false);
        });
    } else {
      toast.error("Select Any Panel");
      setLoading(false);
    }
  };
  const fetchPanels = () => {
    axiosInstance
      .post("Accounts/GetRateTypeByGlobalCentre", {
        TypeId: "",
      })
      .then((res) => {
        console.log(res?.data?.message);
        const Ratetypes = res?.data?.message.map((item) => {
          return {
            label: item?.RateTypeName,
            value: item?.RateTypeID,
            Paymode: item?.PayMode,
            isChecked: false,
          };
        });
        setRatetypes(Ratetypes);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const dateSelect = (value, name) => {
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchPanels();
  }, []);

  return (
    <>
      <Accordion
        name={t("Ledger Statement")}
        isBreadcrumb={true}
        defaultValue={true}
      >
        <div className="row px-2 mt-2 mb-1">
          <div className="col-sm-2">
            <SelectBoxWithCheckbox
              name="RateTypeID"
              className="required-fields"
              placeholder=" "
              lable="RateType"
              id="RateType"
              onChange={handleSelectMultiChange}
              options={Ratetypes}
              value={formData?.RateTypeID}
            />
          </div>

          <div className="col-sm-2">
            <DatePicker
              className="custom-calendar"
              placeholder=" "
              id="Date"
              lable="Date"
              name="Date"
              maxDate={new Date()}
              value={formData?.Date}
              onChange={dateSelect}
            />
          </div>
          <div className="col-sm-1">
            {!loading && (
              <button
                type="button"
                className="btn btn-block btn-primary btn-sm"
                onClick={handleSearch}
              >
                {t("Search")}
              </button>
            )}
            {loading && <Loading />}
          </div>

          <div className="col-sm-1">
            <button
              className="btn btn-block  btn-sm btn-success"
              onClick={() => ExportToExcel(excelData)}
              disabled={!excelData || excelData.length === 0}
            >
              {t("Get Report")}
            </button>
          </div>
        </div>
      </Accordion>
      <Accordion title={t("Search Data")} defaultValue={true}>
        {excelData?.length > 0 ? (
          <div className="row">
            <div className="col-12">
              <>
                <Tables>
                  <thead className="cf text-center" style={{ zIndex: 99 }}>
                    <tr>
                      <th className="text-center">{t("PanelCode")}</th>
                      <th className="text-center">{t("PanelName")}</th>
                      <th className="text-center">{t("Opening Amount")}</th>
                      <th className="text-center">{t("CurrentBooking")}</th>
                      <th className="text-center">{t("ReceivedAmount")}</th>
                      <th className="text-center">{t("ClosingAmount")}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {excelData.map((ele, index) => (
                      <>
                        <tr key={ele?.RouteId}>
                          <td data-title="PanelCode" className="text-center">
                            {ele?.PanelCode}
                          </td>
                          <td data-title="PanelName" className="text-center">
                            {ele?.PanelName}
                          </td>
                          <td data-title="Opening Amount" className="amount">
                            {ele?.OpeningAmount}
                          </td>
                          <td data-title="CurrentBooking" className="amount">
                            {ele?.CurrentBooking}
                          </td>
                          <td data-title="ReceivedAmount" className="amount">
                            {ele?.ReceivedAmount}
                          </td>
                          <td data-title="ClosingAmount" className="amount">
                            {ele?.ClosingAmount}
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </Tables>
              </>
            </div>
          </div>
        ) : (
          <div className="card">
            <NoRecordFound />
          </div>
        )}{" "}
      </Accordion>
    </>
  );
};

export default LedgerStatement;
