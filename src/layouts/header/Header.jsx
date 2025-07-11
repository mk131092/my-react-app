import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebarMenu } from "@app/store/reducers/ui";
import { Image } from "primereact/image";
import LanguagesDropdown from "@app/layouts/header/languages-dropdown/LanguagesDropdown";
import Themedropdown from "@app/layouts/header/Theme-dropdown";
import { toggleFullScreen, useClickOutside } from "../../utils/helpers";

import { useNavigate } from "react-router-dom";
import ReactSelectHead from "../../components/formComponent/ReactSelectHead";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import UserDropdown from "./user-dropdown/UserDropdown";

import logoitdose from "../../assets/image/logoitdose.png";
import logoelabprobg from "../../assets/image/logo elabpro bg.png";

import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import Input from "../../components/formComponent/Input";
import VoiceNavigation from "../../pages/VoiceNavigation";
import Loading from "../../components/loader/Loading";
import { reset } from "../../store/reducers/loginSlice/loginSlice";
import { getS3FileData } from "../../Frontend/util/Commonservices";
import { Tooltip } from "primereact/tooltip";

const Header = ({ menuData, handlePage }) => {
  const localData = useLocalStorage("userData", "get");
  const [t] = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navbarVariant = useSelector((state) => state.ui.navbarVariant);
  const headerBorder = useSelector((state) => state.ui.headerBorder);
  const screenSize = useSelector((state) => state.ui.screenSize);
  const [selectedMenu, setSelectedMenu] = useState(
    menuData?.length > 0 ? menuData[0]?.value : []
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [load, setLoad] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const handleUserProfile = () => {
    setShowUserProfile(!showUserProfile);
  };
  const Showdashboard = useLocalStorage("userData", "get")?.ShowDashboard;
 
  const userProfile = useRef(null);
  useClickOutside(userProfile, handleUserProfile, showUserProfile);

  useEffect(() => {
    setSelectedMenu(menuData?.length > 0 ? menuData[0]?.value : []);
  }, [menuData]);
  const [centreData, setCentreData] = useState([]);
  const handleToggleMenuSidebar = () => {
    dispatch(toggleSidebarMenu());
  };
  const handlePatientLabSearch = (e) => {
    const { value } = e.target;
    const keypress = [9, 13];
    if (keypress.includes(e.which)) {
      if (value.trim() === "") {
        toast.error("Please enter Value");
        return;
      }
      e.preventDefault();
      navigate("/DynamicLabSearch", { state: { data: value?.trim() } });
    }
  };
  const getContainerClasses = useCallback(() => {
    let classes = `main-header navbar navbar-expand ${navbarVariant}`;
    if (headerBorder) {
      classes = `${classes} border-bottom-0`;
    }
    return classes;
  }, [navbarVariant, headerBorder]);

  const [showInput, setShowInput] = useState(false);
  const logOut = async () => {
    try {
      setLoad(true);
      axiosInstance
        .post("Users/logout", {
          Username: localData.Username,
        })
        .then(() => {
          dispatch(reset());
          setLoad(false);
          window.sessionStorage.clear();
          window.localStorage.clear();
          navigate("/login");
        })
        .catch((err) => {
          setLoad(false);
          toast.error(
            err?.data?.message ? err?.data?.message : "Error Occured"
          );
        });
    } catch (err) {
      setLoad(false);
      toast.error(err?.message || "Error Occurred");
    }
  };

  const getCentreDetails = (state) => {
    axiosInstance
      .get("Centre/getGlobalCentres")
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
            DefaultCentreId: ele.DefaultCentreId,
          };
        });
        state(value);
      })
      .catch((err) => {
        dispatch(reset());
        setLoad(false);
        window.sessionStorage.clear();
        window.localStorage.clear();
        navigate("/login");
        toast.error("Something went wrong");
      });
  };
  // console.log(localData?.CompanyLogo)
  
  useEffect(() => {
   
    getCentreDetails(setCentreData);
  }, []);
  const handleChangeCentre = (value) => {
    axiosInstance
      .post("Users/ChangeCentre", {
        CentreID: value?.toString(),
      })
      .then((res) => {
        useLocalStorage("DefaultCentre", "set", value);
        window.location.reload();
      })
      .catch((err) =>
        toast.error(
          err?.data?.response?.message
            ? err?.data?.response?.message
            : "Error Occur"
        )
      );
  };
  // console.log(emp);

  return (
    <>
      {load && <Loading />}
      <nav className={getContainerClasses()} style={{ position: "relative" }}>
        <ul className="navbar-nav">
          {["lg", "md"].includes(screenSize) ? (
            <div className="img-conatiner">
              <div style={{ width: "90%", margin: "auto" }}>
                <img
                  src={`https://elabassets.s3.ap-south-1.amazonaws.com/${localData?.ImageLogo}`}
                  alt={localData?.CompanyCode}
                  className="img-fluid"
                  style={{
                    height: "38px",
                    width: "80px",
                    transition: "transform 0.3s ease",
                    borderBottomRightRadius: "15px !important",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "scale(1.2)")
                  } // Zoom in on hover
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                  onError={(e) => (e.target.src = logoitdose)}
                />
                {/* <Image
                  src={url}
                  width="60px"
                  height="38px"
                  alt={localData?.CompanyCode}
                  style={{
                    height: "38px",
                    width: "60px",
                  }}
                  preview
                /> */}
              </div>
            </div>
          ) : (
            <li className="nav-item">
              <button
                onClick={handleToggleMenuSidebar}
                type="button"
                className="nav-link mobilerespBars"
              >
                <i className="fas fa-bars" />
              </button>
            </li>
          )}
        </ul>
        {/* <ul className="navbar-nav ml-6"></ul> */}

        <ul className="navbar-nav ml-auto selectHRes d-flex">
          <li className="nav-item savetheme">
            <div type="button" className=" headerboxsize">
              <ReactSelectHead
                placeholderName="Select Centre"
                dynamicOptions={centreData?.map((ele) => {
                  return { label: ele.label, value: ele.value };
                })}
                searchable={true}
                value={useLocalStorage("DefaultCentre", "get")}
                respclass="roll-off"
                handleChange={(e) => handleChangeCentre(e.value)}
                plcN="center"
              />
            </div>
          </li>
          {["lg", "md"].includes(screenSize) && (
            <li className="nav-item savetheme">
              <div type="button" className=" headerboxsize">
                <ReactSelectHead
                  placeholderName="Select Menu"
                  dynamicOptions={menuData?.map((ele) => {
                    return {
                      label: ele?.label,
                      value: ele?.value,
                      pageData: ele?.pageData,
                    };
                  })}
                  searchable={true}
                  respclass="col-12 roll-off"
                  value={Number(selectedMenu)}
                  handleChange={(e) => {
                    handlePage(e.pageData);
                    setSelectedMenu(e.value);
                  }}
                  plcN="center"
                />
              </div>
            </li>
          )}
         
          {["lg", "md"].includes(screenSize) && (
            <li className="nav-item md-none mt-1">
              <Input
                type="text"
                // id="LabNo"
                name="LabNo"
                // lable={"Visit No. / Barcode No."}
                placeholder="Visit No. / Barcode No."
                onKeyDown={(e) => handlePatientLabSearch(e, "LabNo")}
              />
            </li>
          )}
          {!["lg", "md"].includes(screenSize) && (
            <i
              className="fa fa-barcode mr-1 ml-3 pointer ls-none"
              onClick={() => setShowInput(!showInput)}
            ></i>
          )}
          {showInput && (
            <div className="header-search-menu">
              <div className="header-search-input">
                <div className="maindiv mt-2">
                  <Input
                    type="text"
                    id="LabNo"
                    name="LabNo"
                    // lable={"Visit No. / Barcode No."}
                    placeholder="Visit No. / Barcode No."
                    onKeyDown={(e) => handlePatientLabSearch(e, "LabNo")}
                  />
                </div>
              </div>
            </div>
          )}
          <li className="nav-item d-md-flex px-1">
            <Themedropdown />
          </li>
          <li className="nav-item d-md-flex ">
            <LanguagesDropdown />
          </li>
          <li className="nav-item d-md-flex px-1">
            <div type="button">
              <Tooltip target=".fa-home" />
              <i
                className="fa fa-home text-white"
                aria-hidden="true"
                data-pr-tooltip={t("Go To Dashboard")}
                data-pr-position="bottom"
                onClick={() => {
                  Showdashboard == 1
                    ? navigate("/dashboard")
                    : navigate("/Welcome");
                }}
              ></i>
            </div>
          </li>
          <li className="nav-item d-none d-md-flex px-2">
            <div onClick={toggleFullScreen}>
              <Tooltip target=".fa-arrows-alt" />
              <i
                className="fa fa-arrows-alt text-white "
                data-pr-tooltip={t("Full Screen")}
                data-pr-position="bottom"
                aria-hidden="true"
              ></i>
            </div>
          </li>{" "}
          <li className="nav-item d-none d-md-flex px-2">
            <VoiceNavigation />
          </li>
          <li className="nav-item d-none d-md-flex">
            {/* <Tooltip target=".Logout" /> */}
            <button
              type="button"
              className="nav-link Logout"
              data-pr-tooltip={t("Logout")}
              data-pr-position="bottom"
              onClick={logOut}
            >
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </li>
          &nbsp;&nbsp;
          <li className="nav-item d-md-flex">
            <button type="button" className="nav-link d-flex">
              <UserDropdown
                setDropdownOpen={setDropdownOpen}
                dropdownOpen={dropdownOpen}
                logOut={logOut}
                emp={`https://elabassets.s3.ap-south-1.amazonaws.com/${localData?.EmployeeImage}`}
              />
              <label className="control-label ml-1 d-none d-lg-block text-white">
                {localData?.Username}
              </label>
            </button>
          </li>
          &nbsp;&nbsp;
          {/* <li className="nav-item d-none d-md-flex ">
            <LanguagesDropdown />
          </li> */}
        </ul>
      </nav>
    </>
  );
};

export default Header;
