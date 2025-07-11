import { Tooltip } from "primereact/tooltip";

import { useTranslation } from "react-i18next";
export const SelectBox = ({
  isDisabled,
  options,
  id,
  name,
  onChange,
  className,
  selectedValue,
  keyEvent,
  onKeyPress,
  lable,
}) => {
  const [t] = useTranslation();
  return (
    <>
      {" "}
      <Tooltip target={`#${id}`} position="top" content={t(lable)} />
      <div className="form-group">
        <select
          className={`form-control  ${className} custominputbox select-focus`}
          value={selectedValue?.label !== "" && selectedValue}
          disabled={isDisabled}
          name={name}
          id={id}
          defaultValue={selectedValue}
          onChange={onChange}
          onKeyDown={(e) => keyEvent && onKeyPress(e, name)}
        >
          {options?.map((ele, index) => (
            <option
              key={index}
              value={ele?.value}
              className={`Status-${ele?.status && ele?.value} p-0 m-0 mt-0`}
              style={
                selectedValue == ele?.value ? { background: "lightblue" } : {}
              }
            >
              {t(ele?.label)}
            </option>
          ))}
        </select>
        {lable && lable !== "" && (
          <label htmlFor={id} className="lable truncate ">
            {t(lable)}
          </label>
        )}
      </div>
    </>
  );
};
