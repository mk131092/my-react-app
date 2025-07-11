import React from "react";

const CloseButton = ({ handleClick }) => {
  return (
    <div className="w-100 d-flex justify-content-center">
      <span
        style={{
          borderRadius: "50%",
          width: "25px",
          display: "flex",
          justifyContent: "center",
          alignItems: "end",
          fontWeight: "bold",
          font: "20px !important",
        }}
        className="btn btn-"
        onClick={handleClick}
      >
        <i
          className="fa fa-trash"
          style={{ fontSize: "30px !important", color: "red" }}
        ></i>
      </span>
    </div>
  );
};

export default CloseButton;
