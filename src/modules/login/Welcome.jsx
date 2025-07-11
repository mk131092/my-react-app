import React, { useEffect, useState } from "react";
import axios from "axios";
import "./WelcomePage.css";
import welcomeImage from "../../assets/image/welcomimg.png";
import Loading from "../../components/loader/Loading";
import { formatDate } from "../../utils/helpers";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import RazorPay from "../../Frontend/Payment/RazorPay";
import QrCodeDropdown from "../../layouts/header/qrcode-dropdown/QrCodeDropdown";
import { axiosInstance } from "../../utils/axiosInstance";
import { useTranslation } from "react-i18next";

const Welcome = () => {
  const { t } = useTranslation();
  const username = useLocalStorage("userData", "get")?.Username;
  console.log(username);
  const [details, setDetails] = useState({});
  const [CentreData, setCentreData] = useState([]);
  const [themeColor, setThemeColor] = useState("white");
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getColor = () => {
    const theme = localStorage.getItem("Theme");
    const colors = {
      Default: "lightblue",
      "light Green": "lightgreen",
      Peach: "#ffdab9",
      "Pale Pink": "pink",
      Red: "#FFCCCB",
      "Sky Blue": "#7CB9E8",
      Grey: "lightgrey",
    };
    return colors[theme] || "white";
  };

  const getEmployeeDetails = async () => {
    try {
      const response = await axios.get("api/v1/Employee/WelcomeDetails");
      setDetails(response?.data?.message[0] || {});
    } catch (error) {
      console.error("Error fetching employee details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAccessCentres = () => {
    setLoading(true);

    axiosInstance
      .get("Centre/getAccessCentres")
      .then((res) => {
        setLoading(true);
        let data = res.data.message;
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
            B2B: ele.BTB,
            Image: ele.awsKey,
          };
        });
        setCentreData(CentreDataValue);
        setLoading(false);
      })
      .catch((err) => {
        console.log({ err });
        setLoading(false);
      });
  };
  const DesignationName = useLocalStorage("userData", "get")?.DesignationName;
  useEffect(() => {
    setThemeColor(getColor());
    getEmployeeDetails();
    getAccessCentres();
  }, []);

  const centreId = useLocalStorage("DefaultCentre", "get");
  const showQRIcon = CentreData?.find((ele) => ele?.value === centreId);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <RazorPay />
      <div className="welcomemain-div">
        <div
          className="welcome-maincontainercls"
          style={{ backgroundColor: themeColor }}
        >
          <div className="welcome-content">
            <h1 className="welcome-heading welcomePage">
              {t("Welcome")} {username || "User"}
            </h1>
            <div className="ml-1 row">
              <p className="welcome-subheading welcomePage">
                {t("Employee Details")}
              </p>
              <div className="mt-2 ml-4">
                <QrCodeDropdown
                  setDropdownOpen={setDropdownOpen}
                  dropdownOpen={dropdownOpen}
                  showQRIcon={showQRIcon}
                  className="mt"
                  DesignationName={DesignationName}
                />
              </div>
            </div>
            <p className="welcome-textHeading ">
              {t("Designation")}&nbsp;:{" "}
              <span className="welcome-textdisplay welcomePage">
                {details.Designation || "Not Available"}
              </span>
            </p>

            <p className="welcome-textHeading">
              {t("Current Login Time")}&nbsp;:{" "}
              <span className="welcome-textdisplay welcomePage">
                {details.LoginTime ? details.LoginTime : "Not Available"}
              </span>
            </p>

            <p className="welcome-textHeading">
              {t("Last Logout Time")}&nbsp;:{" "}
              <span className="welcome-textdisplay welcomePage">
                {details.LogoutTime ? details.LogoutTime : "Not Available"}
              </span>
            </p>
          </div>
          <div className="welcome-img">
            <img src={welcomeImage} alt="Welcome" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;
