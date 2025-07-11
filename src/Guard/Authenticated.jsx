import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosInstance } from "../utils/axiosInstance";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";
import { setWindowClass } from "../utils/helpers";

import { useTranslation } from "react-i18next";
const Authenticated = ({ children }) => {
  const CompanyCode = useLocalStorage("userData", "get")?.CompanyCode;
  const Showdashboard = useLocalStorage("userData", "get")?.ShowDashboard;
  const token = localStorage.getItem("token");
  const User = localStorage.getItem("User");
  const navigate = useNavigate();

  const { t } = useTranslation();
  const accessedURL = async (value) => {
    const currentPath = window.location.pathname.toLowerCase();
    if (User == "1") {
      if (currentPath !== "/dispatchreport") {
        useLocalStorage("theme", "set", "sky_blue_theme");
        setWindowClass(`hold-transition login-page ${"sky_blue_theme"}`);
        toast.error("Redirecting to DispatchReport...");
        navigate("/DispatchReport");
        return;
      }
    }
    try {
      const res = await axiosInstance.post("Menu/ValidMenuPageData", {
        Url: value,
      });
      return res.data;
    } catch (err) {
      console.log(err.response ? err.response.data : "Something Went Wrong");
      return null;
    }
  };

  const checkAccessRights = async () => {
    const accessedData = await accessedURL(window.location.pathname);
    const accessiblePaths = [
      "/dashboard",
      "/designations",
      "/pagemaster",
      "/menumaster",
      "/subpagemaster",
      "/apireportxyg",
      "/welcome",
      "/login",
      "/forgotpassword",
      "/",
      "*",
      "/welcomepage",
      "/blankpage",
      "/patientportallogin",
    ];

    if (!accessiblePaths.includes(window.location.pathname.toLowerCase())) {
      const restrictedPaths = [
        "/companymasterlist",
        "/companymaster",
        "/companypaymentdetail",
        "/companykey",
        "/onlinepaymentpage",
        "/smsdata",
        "/downtimemaster",
      ];

      if (
        (CompanyCode?.toLowerCase() !== "itd" &&
          restrictedPaths.includes(window.location.pathname.toLowerCase())) ||
        accessedData?.message === "False"
      ) {
        toast.error(
          t(
            "You have not rights to access this page, Redirecting to Dashboard.........."
          )
        );

        const redirectPath = Showdashboard == 1 ? "/Dashboard" : "/Welcome";

        window.location.replace(redirectPath);
      }
    }
  };
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event?.key === "userData") {
        const encryptedData = event?.newValue;
        if (encryptedData) {
          const decryptedData = useLocalStorage("userData", "get")?.CompanyCode;
          if (decryptedData !== CompanyCode) {
            window.location.reload();
          }
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [CompanyCode]);
  useEffect(() => {
    if (window.location.pathname.toLowerCase() == "/dashboard") {
      const redirectPath = Showdashboard == 1 ? "/Dashboard" : "/Welcome";
      navigate(redirectPath);
    }
    checkAccessRights();
  }, [window.location.pathname]);

  return token ? children : <Navigate to="/login" replace />;
};

export default Authenticated;
