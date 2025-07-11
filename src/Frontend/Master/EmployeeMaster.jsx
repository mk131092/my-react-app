import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { getDesignationData } from "../../utils/NetworkApi/commonApi";
import Accordion from "@app/components/UI/Accordion";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Loading from "../../components/loader/Loading";
import Input from "../../components/formComponent/Input";
import NoRecordFound from "../../components/formComponent/NoRecordFound";
import Tables from "../../components/UI/customTable";
import { Link } from "react-router-dom";
import { PreventNumber } from "../../utils/helpers";

const EmployeeMaster = () => {
  const [Designation, setDesigation] = useState([]);
  const [load, setLoad] = useState(false);

  const [payload, setPayload] = useState({
    DesignationID: "",
    Name: "",
  });
  const [tableData, setTableData] = useState([]);

  const handleSelectChange = (e) => {
    const { value, name } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const { t } = useTranslation();
  const handleSearch = () => {
    setLoad(true);
    axiosInstance
      .post("Employee/getEmployeeDetails", payload)
      .then((res) => {
        setTableData(res.data?.message);
        setLoad(false);
        if (res.data.message.length === 0) {
          toast.error("No Data Found");
        }
      })
      .catch((err) => {
        setTableData([]);

        toast.error("No Data Found");
        console.log(err);
        setLoad(false);
      });
  };

  useEffect(() => {
    handleSearch()
    getDesignationData(setDesigation);
  }, []);

  useEffect(() => {
    setPayload({
      ...payload,
      DesignationID: Designation[0]?.value,
    });
  }, [Designation]);
  return (
    <>
      <Accordion
        name={t("EmployeeMaster")}
        defaultValue={true}
        isBreadcrumb={true}
        linkTo="/CreateEmployeeMaster"
        linkTitle={t("Create New")}
      >
        <div className="row pt-2 pl-2 pr-2">
          <div className="col-sm-2">
            <SelectBox
              name="DesignationID"
              lable="Designation"
              options={Designation}
              value={payload?.DesignationID}
              onChange={handleSelectChange}
              id="Designation"
            />
          </div>
          <div className="col-sm-2">
            <Input
              name="Name"
              value={payload?.Name}
              id="Name"
              lable="Name"
              placeholder=" "
              type="text"
              max={50}
              onChange={(e) => {
                const validateValue = PreventNumber(e.target.value);
                if (validateValue !== false) {
                  setPayload({ ...payload, Name: e.target.value });
                }
              }}
            />
          </div>
          <div className="col-sm-1">
            {load ? (
              <Loading />
            ) : (
              <button
                className="btn btn-block btn-info btn-sm"
                onClick={handleSearch}
              >
                {t("Search")}
              </button>
            )}
          </div>
        </div>
      </Accordion>
      <Accordion title={t("Search Data")} defaultValue={true}>
        {tableData.length > 0 ? (
          <Tables>
            <thead className="cf">
              <tr>
                <th>{t("S.No")}</th>
                <th>{t("Name")}</th>
                <th>{t("HouseNo")}</th>
                <th>{t("StreetName")}</th>
                <th>{t("Locality")}</th>
                <th>{t("City")}</th>
                <th>{t("Pincode")}</th>
                <th>{t("PHouseNo")}</th>
                <th>{t("PStreetName")}</th>
                <th>{t("PLocality")}</th>
                <th>{t("PCity")}</th>
                <th>{t("PPincode")}</th>
                <th>{t("Mobile")}</th>
                <th>{t("Email")}</th>
                <th>{t("Active")}</th>
                <th>{t("Edit")}</th>
              </tr>
            </thead>
            <tbody>
              {tableData?.map((data, index) => (
                <tr key={index}>
                  <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                  <td data-title={t("Name")}>{data?.Name}&nbsp;</td>
                  <td data-title={t("HouseNo")}>{data?.HouseNo}&nbsp;</td>
                  <td data-title={t("StreetName")}>{data?.StreetName}&nbsp;</td>
                  <td data-title={t("Locality")}>{data?.Locality}&nbsp;</td>
                  <td data-title={t("City")}>{data?.City}&nbsp;</td>
                  <td data-title={t("Pincode")}>{data?.Pincode}&nbsp;</td>
                  <td data-title={t("PHouseNo")}>{data?.PHouseNo}&nbsp;</td>
                  <td data-title={t("PStreetName")}>
                    {data?.PStreetName}&nbsp;
                  </td>
                  <td data-title={t("PLocality")}>{data?.PLocality}&nbsp;</td>
                  <td data-title={t("PCity")}>{data?.PCity}&nbsp;</td>
                  <td data-title={t("PPincode")}>{data?.PPincode}&nbsp;</td>
                  <td data-title={t("Mobile")}>{data?.Mobile}&nbsp;</td>
                  <td data-title={t("Email")}>{data?.Email}&nbsp;</td>
                  <td data-title={t("Active")}>
                    {data?.isActive === 1 ? "Active" : "DeActive"}&nbsp;
                  </td>
                  <td data-title={t("Action")} className="text-center">
                    <Link
                      to="/CreateEmployeeMaster"
                      state={{
                        button: "Update",
                        url1: "Employee/getEmployeeDetailsByID",
                        url2: "Employee/UpdateEmployee",
                        id: data?.EmployeeID,
                      }}
                    >
                      <i
                        className="fa fa-edit"
                        style={{ color: "#605ca8", cursor: "pointer" }}
                      ></i>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Tables>
        ) : (
          <NoRecordFound />
        )}
      </Accordion>
    </>
  );
};

export default EmployeeMaster;
