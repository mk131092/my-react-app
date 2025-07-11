import React from "react";
import { Calendar } from "primereact/calendar";
import Tooltip from "./Tooltip";
// import { Tooltip } from "primereact/tooltip";

import { useTranslation } from "react-i18next";
const TimePicker = (props) => {
  const { respclass, placeholder, value, onChange, name, lable, id,disabled } = props;

  const handleTimeChange = (e) => {
    const selectedDate = e.value;
    onChange(selectedDate, name);
  };

  const [t] = useTranslation();
  return (
    <>
      {/* <Tooltip target={`#${id}`} position="top" content={lable} /> */}
      <div className={respclass}>
        <Calendar
          inputId="calendar-timeonly"
          style={{ width: "100%" }}
          wrapperClassName="datepicker"
          value={value}
          onChange={handleTimeChange}
          timeOnly
          hourFormat="12"
          placeholder={placeholder}
          name={name}
          disabled={disabled}
          inputClassName="form-control select-focus"
        />
        {lable && (
          <label
            htmlFor={id}
            className="label lable truncate time_Lable"
            style={{ fontSize: "5px !important" }}
          >
            {t(lable)}
          </label>
        )}
      </div>{" "}
    </>
  );
};

export default TimePicker;
