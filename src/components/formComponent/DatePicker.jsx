import React, { useRef } from "react";
import { Calendar } from "primereact/calendar";
import { Tooltip } from "primereact/tooltip";
import { useTranslation } from "react-i18next";

function DatePicker({
  name,
  className,
  respclass,
  id,
  placeholder,
  lable,
  value,
  onChange,
  tabIndex,
  inputClassName,
  removeFormGroupClass,
  maxDate,
  minDate,
  disabled,
  showOnFocus = false,
}) {
  const [t] = useTranslation();
  const calendarWrapperRef = useRef(null);
  const calendarRef = useRef(null);

  const handleDateChange = (e) => {
    onChange(e?.target?.value, name);
  };

  const handleInputClick = (e) => {
    if (calendarRef.current && !calendarRef.current.panel?.offsetParent) {
      calendarRef.current.show();
    }
  };

  const handleMonthChange = () => {
    if (calendarRef.current) {
      calendarRef.current.show();
    }
  };

  const handleYearChange = () => {
    if (calendarRef.current) {
      calendarRef.current.show();
    }
  };

  return (
    <>
      <Tooltip target={`#${id}`} position="top" content={t(lable)} />
      <div className={respclass} style={{ position: "relative" }}>
        <div
          className={removeFormGroupClass ? "" : "form-group"}
          ref={calendarWrapperRef}
        >
          <Calendar
            ref={calendarRef}
            inputId={id}
            showIcon
            placeholder="DD/MM/YYYY"
            className={className}
            dateFormat="dd-M-yy"
            value={value || null}
            name={name}
            maxDate={maxDate}
            minDate={minDate}
            disabled={disabled}
            onChange={handleDateChange}
            onMonthChange={handleMonthChange}
            onYearChange={handleYearChange}
            wrapperClassName="datepicker"
            inputClassName={`${inputClassName} form-control select-focus`}
            showOnFocus={showOnFocus}
            tabIndex={tabIndex || "0"}
            onClick={handleInputClick}
          />
          {lable && (
            <label
              htmlFor={id}
              className="label lable truncate"
              style={{ fontSize: "5px !important" }}
            >
              {t(lable)}
            </label>
          )}
        </div>
      </div>
    </>
  );
}

export default DatePicker;
