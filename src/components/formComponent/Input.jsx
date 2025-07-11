import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Tooltip } from "primereact/tooltip";

function Input({
  type,
  name,
  className,
  respclass,
  id,
  placeholder,
  lable,
  value,
  onKeyDown,
  onPaste,
  required,
  display,
  onChange,
  disabled,
  readOnly,
  defaultValue,
  onBlur,
  inputRef,
  removeFormGroupClass,
  onInput,
  max,
  min,
  key,
  showTooltipCount,
  maxLength,
  tabIndex,
  placeholderLabel,
}) {
  const [t] = useTranslation();

  return (
    <>
      <Tooltip
        target={`#${id}`}
        position="top"
        content={
          t(lable) +
          ` ${showTooltipCount ? "Count : " + (value?.length ? value?.length : "0") : ""}`
        }
        event="focus"
        className="ToolTipCustom"
      />

      <div className={`${respclass}  custominputbox`}>
        {/* <div className={!isFromGroup ? "" : "form-group"}> */}
        <div className={removeFormGroupClass ? "" : "form-group"}>
          <input
            type={type}
            className={`${className}  form-control select-focus`}
            id={id}
            name={name}
            placeholder={t(placeholder)}
            value={value}
            onKeyDown={onKeyDown}
            key={key}
            onPaste={onPaste}
            onChange={onChange}
            autoComplete="off"
            step={type === "number" ? "0.01" : ""}
            required={required}
            ref={inputRef}
            onBlur={onBlur}
            max={max}
            min={min}
            style={{ textAlign: display ?? "left" }}
            onInput={onInput}
            disabled={disabled ? disabled : false}
            // tabIndex={tabIndex ? tabIndex : "-1"}
            readOnly={readOnly}
            maxLength={maxLength}
            onWheel={(e) => e?.target?.blur()}
          />
          {lable && (
            <label htmlFor={id} className="lable truncate">
              {t(lable)}
            </label>
          )}
          <span className="placeholderLabel"> {placeholderLabel} </span>
        </div>
      </div>
    </>
  );
}

export default Input;
