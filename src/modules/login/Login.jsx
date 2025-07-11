

import { useTranslation } from "react-i18next";
import { setWindowClass } from "@app/utils/helpers";
import "./Login.css";
import LoginComponent from "./LoginComponent";
const Login = () => {
  const [t] = useTranslation();

  setWindowClass("hold-transition login-page");

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
              <p className="bottom-text" >
                POWERED BY : <span className="bottom-text-span">ITDOSE INFOSYSTEMS PVT. LTD.</span>
              </p>
            </div>
          </div> */}

          <div className="login-form-section">
            <LoginComponent />
          </div>

          {/* <div className="logo-note">
            <p className="logo-note-text">ITDOSEINFOSYSTEMS PVT. LTD.</p>
          </div> */}
        </div>
      </div>
      <div></div>
    </>
  );
};

export default Login;

