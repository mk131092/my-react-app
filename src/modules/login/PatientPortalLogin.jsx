
import { useTranslation } from "react-i18next";
import { setWindowClass } from "@app/utils/helpers";
import "./Login.css";
import LoginComponent from "./LoginComponent";
import LogoImage from "../../assets/image/logo elabpro bg.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PatientPortalLoginComponent from "./PatientPortalLoginComponent";

const PatientPortalLogin = () => {
  const [t] = useTranslation();
  setWindowClass("hold-transition login-page");

  //   useEffect(() => {
  //     localStorage.setItem("patientPortalLoginURL", window.location.path);
  //   }, []);

  console.log(window.location.pathname);
  console.log(window.location.href);

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          {/* <div className="welcome-section">
            <div className="logo-container">
              <a href="#.in" className="text-white">
                <img className="logo-img" src={LogoImage} alt="logo" />
              </a>
            </div>

            <div className="text-container">
              <p className="bottom-text">
                POWERED BY : <span className="bottom-text-span">Elab Pro</span>
              </p>
            </div>
          </div> */}

          <div className="login-form-section">
            <PatientPortalLoginComponent />
          </div>

          {/* <div className="logo-note">
            <p className="logo-note-text">ITDOSEINFOSYSTEMS PVT. LTD.</p>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default PatientPortalLogin;
