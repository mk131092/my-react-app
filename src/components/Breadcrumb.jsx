import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export default function Breadcrumb({ name }) {
  const location = useLocation();

  return (
    <div className="pb-2 cursor-pointer font-weight-bold ml-1 mt-2 text-nowrap">
      <i className="fa fa-home" aria-hidden="true"></i>
      {/* {location?.state?.data} */}
      &nbsp; {name}
    </div>
  );
}
