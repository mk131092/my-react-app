import React from "react";
import Breadcrumb from "../Breadcrumb";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Heading({
  title,
  onClick,
  secondTitle,
  isBreadcrumb,
  ReactSelectPageWise,
  name,
  linkTo,
  linkTitle,
  state,
  logout = false,
  handleLogout,
}) {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <div className="card card_background">
      <div className="card-header" onClick={onClick}>
        <h4 className="card-title w-100 d-md-flex align-items-center justify-content-between">
          {isBreadcrumb ? (
            <Breadcrumb path={location?.pathname} name={name} />
          ) : (
            <div>
              <label className="text-nowrap m-0"> {title} </label>
            </div>
          )}

          {secondTitle && (
            <div className="mr-3 d-flex color-code-search-resp align-items-center justify-content-start justify-content-md-end overflow-auto w-md-50 w-100">
              {ReactSelectPageWise && (
                <div className="mr-3 w" style={{ width: "1%" }}>
                  {ReactSelectPageWise}
                </div>
              )}
              {secondTitle}
            </div>
          )}

          {linkTo && (
            <div
              className={`main-heading-link ${linkTo === "/receiptreprint" ? "d-none d-md-flex" : ""}`}
            >
              <Link to={linkTo} state={state} className="btn btn-link">
                {linkTitle}
              </Link>
            </div>
          )}

          {logout && (
            <div className="mr-4">
              <div onClick={handleLogout}>
                <i className="pi pi-sign-out"></i>
              </div>
            </div>
          )}
        </h4>
      </div>
    </div>
  );
}

export default Heading;
