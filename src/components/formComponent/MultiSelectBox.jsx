import React, { useState, useEffect, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { MultiSelect } from "react-multi-select-component";

export const SelectBoxWithCheckbox = ({
  isDisabled,
  name,
  options,
  value,
  onChange,
  className,
  depends,
  lable,
  label,
  id,
}) => {
  const [data, setData] = useState([]);
  const {t} =useTranslation();

  useEffect(() => {
    if (value !== "" || value.length > 0) {
      let array1 = [];
      if (typeof value === "string") {
        array1 = value?.split(",");
      } else {
        array1 = value;
      }

      var result = options.filter(function (o1) {
        return array1?.some(function (o2) {
          return o1.value == o2;
        });
      });
      setData(result);
      if (depends) {
        depends(result);
      }
    } else {
      setData([]);
    }
  }, [options, value]);

  return (
    <div className="form-group">
      <MultiSelect
        options={options}
        disabled={isDisabled}
        onChange={(e) => {
          onChange(e, name);
          setData(e);
        }}
        labelledBy="Select"
        value={data}
        className={className}
        overrideStrings={{
          selectSomeItems: label ?? "Select...",
        }}
        style={{
          background: isDisabled ? "gray" : "",
          cursor: isDisabled ? "not-allowed" : "",
        }}
      />
      <label htmlFor={id} className="floating-label">
        {t(lable)}
      </label>
    </div>
  );
};
