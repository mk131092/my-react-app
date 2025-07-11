import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import Accordion from "@app/components/UI/Accordion";
import Heading from "../../components/UI/Heading";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";
import { Link } from "react-router-dom";

const FieldBoyMaster = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();

  const getFieldBoyMasterData = () => {
    axiosInstance
      .get("FieldBoyMaster/getFieldBoy")
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getFieldBoyMasterData();
  }, []);
  return (
    <>
      <Accordion
        name={t("Field Boy Master")}
        defaultValue={true}
        isBreadcrumb={true}
        linkTo="/CreateFieldBoyMaster"
        linkTitle={t("Create New")}
      >
        <div className="row px-2 mt-2 mb-2">
          <div className="col-12">
            {loading ? (
              <Loading />
            ) : (
              <Tables>
                <>
                  <thead className="cf">
                    <tr>
                      <th>{t("S.No")}</th>
                      <th>{t("Name")}</th>
                      <th>{t("Age")}</th>
                      <th>{t("Mobile")}</th>
                      <th>{t("City")}</th>
                      <th>{t("State")}</th>
                      <th>{t("PinCode")}</th>
                      <th>{t("Home Collection")}</th>
                      <th>{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.map((ele, index) => (
                      <tr key={index}>
                        <td data-title={t("S.No")}>{index + 1}</td>
                        <td data-title={t("Name")}>{ele?.NAME}</td>
                        <td data-title={t("Age")}>{ele?.Age}</td>
                        <td data-title={t("Contact No")}>{ele?.Mobile}</td>
                        <td data-title={t("City")}>{ele?.City}</td>
                        <td data-title={t("State")}>{ele?.State}</td>
                        <td data-title={t("PinCode")}>{ele?.Pincode}</td>
                        <td data-title={t("Home Collection")}>
                          {ele?.HomeCollection ? t("Yes") : t("No")}
                        </td>
                        <td data-title={t("Action")}>
                          <Link
                            state={{
                              data: ele?.FieldBoyID,
                              other: { button: "Update" },
                              url: "FieldBoyMaster/EditFieldBoy",
                            }}
                            to="/CreateFieldBoyMaster"
                          >
                            <span className="pt-2">{t("Edit")}</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </>
              </Tables>
            )}
          </div>
        </div>
      </Accordion>
    </>
  );
};

export default FieldBoyMaster;
