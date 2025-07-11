import React from "react";
import "./Tooltip.css";

import { useTranslation } from "react-i18next";
const Tooltip = ({ label, children, className, position = "top" }) => {
  const [t] = useTranslation();
  return (
    <div
      className={`tooltip-container ${className}`}
      // style={{ position: "relative", zIndex: 10000 }}
    >
      {children}
      <div
        className={`tooltip ${
          position === "bottom" ? "tooltip-bottom" : "tooltip-top"
        }`}
      >
        {t(label)}
      </div>
    </div>
  );
};

export default Tooltip;
