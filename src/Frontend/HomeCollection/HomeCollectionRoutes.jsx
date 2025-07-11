import React from "react";
import { useTranslation } from "react-i18next";
import Accordion from "@app/components/UI/Accordion";
import Tables from "../../components/UI/customTable";
const HomeCollectionRoutes = () => {
  const { t } = useTranslation();
  const links = [
    {
      name: "Location Master",
      url: "https://uat.elabpro.in/LocationMaster",
      href: "/LocationMaster",
    },
    {
      name: "Home Collection Location Master",
      url: "https://uat.elabpro.in/HomeCollectionLocationMaster",
      href: "/HomeCollectionLocationMaster",
    },
    {
      name: "Route Master",
      url: "https://uat.elabpro.in/RouteMaster",
      href: "/RouteMaster",
    },

    {
      name: "Phlebotomist Registration",
      url: "https://uat.elabpro.in/PhelebotomistRegisteration",
      href: "/PhelebotomistRegisteration",
    },
    {
      name: "Phlebotomist Mapping",
      url: "https://uat.elabpro.in/PhelebotomistMapping",
      href: "/PhelebotomistMapping",
    },
    {
      name: "Call Centre",
      url: "https://uat.elabpro.in/CallCentre",
      href: "/CallCentre",
    },
    {
      name: "Home Collection Search",
      url: "https://uat.elabpro.in/HomeCollectionSearcH",
      href: "/HomeCollectionSearcH",
    },
    {
      name: "Home Collection Patient Edit",
      url: "https://uat.elabpro.in/HCPatientEdit",
      href: "/HCPatientEdit",
    },
    {
      name: "Home Collection Change Phlebotomist",
      url: "https://uat.elabpro.in/HCChangePhlebotomist",
      href: "/HCChangePhlebotomist",
    },
    {
      name: "Home Collection Change Drop Location",
      url: "https://uat.elabpro.in/HCChangeDropLocation",
      href: "/HCChangeDropLocation",
    },
    {
      name: "Home Collection Phlebotomist Holiday",
      url: "https://uat.elabpro.in/HCPhlebotomistHoliday",
      href: "/HCPhlebotomistHoliday",
    },
    {
      name: "Phlebo Call Transfer",
      url: "https://uat.elabpro.in/PhelbomistCallTransfer",
      href: "/PhelbomistCallTransfer",
    },
    {
      name: "Home Collection Temporary Phlebo Approval",
      url: "https://uat.elabpro.in/HCTemporaryPhelboAproval",
      href: "/HCTemporaryPhelboAproval",
    },
    {
      name: "Home Collection Phlebo Login Details",
      url: "https://uat.elabpro.in/HCPhelboLoginDetails",
      href: "/HCPhelboLoginDetails",
    },
  ];
  return (
    <>
      <Accordion
        name={t("Home Collection Routes")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <Tables
          className="table table-bordered table-hover table-striped tbRecord"
          cellPadding="{0}"
          cellSpacing="{0}"
        >
          <thead className="cf text-center" style={{ zIndex: 99 }}>
            <tr>
              <th className="text-center">{t("S.No")}</th>
              <th className="text-center">{t("Page Name")}</th>
              <th className="text-center">{t("URL")}</th>
            </tr>
          </thead>

          <tbody>
            {links.map((ele, index) => (
              <>
                <tr key={index}>
                  <td data-title="Index" className="text-center">
                    <h5>{index + 1}</h5>
                  </td>
                  <td data-title="Page Name" className="text-center">
                    <h5>{ele?.name}</h5>
                  </td>
                  <td data-title="URL" className="text-center">
                    <a href={ele?.href}>
                      <h5>{ele?.url}</h5>
                    </a>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </Tables>
      </Accordion>
    </>
  );
};

export default HomeCollectionRoutes;
