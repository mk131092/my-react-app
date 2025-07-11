import React from "react";
import nodata from "./NoRecord.png";

const NoRecordFound = () => {
  return (
    <div className="no-record-found">
      <img src={nodata} alt="" />
    </div>
  );
};

export default NoRecordFound;
