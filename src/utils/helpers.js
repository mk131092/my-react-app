import moment from "moment";
import { useEffect } from "react";
import { StatusCheck } from "./Constants";
import * as XLSX from "xlsx";
import { useLocalStorage } from "./hooks/useLocalStorage";
export const sleep = (time) => new Promise((res) => setTimeout(res, time));

export const calculateWindowSize = (windowWidth) => {
  if (windowWidth >= 1200) {
    return "lg";
  }
  if (windowWidth >= 992) {
    return "md";
  }
  if (windowWidth >= 768) {
    return "sm";
  }
  return "xs";
};

export const setWindowClass = (classList) => {
  const window = document && document?.getElementById("root");
  if (window) {
    // @ts-ignore
    window.classList = classList;
  }
};
export const addWindowClass = (classList) => {
  const window = document && document?.getElementById("root");
  if (window) {
    // @ts-ignore
    window.classList.add(classList);
  }
};

export const removeWindowClass = (classList) => {
  const window = document && document?.getElementById("root");
  if (window) {
    // @ts-ignore
    window.classList.remove(classList);
  }
};

export const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};

export const Tabfunctionality = (event) => {
  if (event.key === "Tab") {
    const currentInput = event.target;
    const inputs = Array.from(document.querySelectorAll("input[required]"));
    const currentIndex = inputs.findIndex((input) => input === currentInput);

    if (currentIndex !== -1) {
      const nextIndex = (currentIndex + 1) % inputs.length; // Get the index of the next required input
      inputs[nextIndex].focus(); // Focus on the next required input
      event.preventDefault(); // Prevent the default tab behavior
    }
  }
};

export const TruncatedLabel = (lable, length) => {
  if (typeof lable === "string" || typeof lable === "number") {
    const labelAsString = typeof lable === "number" ? lable.toString() : lable;
    if (length === undefined) {
      return labelAsString.length > 15
        ? labelAsString.substring(0, 15) + "..."
        : labelAsString;
    } else {
      return labelAsString.length > 8
        ? labelAsString.substring(0, 8) + "..."
        : labelAsString;
    }
  }
};

export function getCookie(name) {
  const matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function useClickOutside(ref, handleClose, active) {
  useEffect(() => {
    if (!active) return;

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handleClose, active]);
}
export const changeDarkMode = () => {
  document.documentElement.getAttribute("data-theme") == "DarkMode"
    ? document.documentElement.removeAttribute("data-theme")
    : document.documentElement.setAttribute("data-theme", "DarkMode");
};
// export const useLocalStorage = (key, type, valueToStore) => {
//   if (type === "set") {
//     window.localStorage.setItem(key, JSON.stringify(valueToStore));
//   } else if (type === "get") {
//     return JSON.parse(getLocalStorageDecryptData(key));
//   }
// };
export const PreventNumber = (value) => {
  const reg = /^([^0-9$%]*)$/;
  if (reg.test(value)) {
    return PreventSpecialCharacter(value);
    // return true;
  } else {
    return false;
  }
};
export const number = (e, sliceValue, valueGreater) => {
  if (handleCheckDot(e)) {
    return (e.target.value = e.target.value.replace(".", ""));
  } else {
    if (valueGreater) {
      return e.target.value > valueGreater
        ? (e.target.value = e.target.value.slice(0, e.target.value.length - 1))
        : (e.target.value = e.target.value.slice(0, sliceValue));
    } else {
      return (e.target.value = e.target.value.slice(0, sliceValue));
    }
  }
};
const handleCheckDot = (e) => {
  const data = [...e.target.value];
  return data.includes(".");
};

export const PreventSpecialCharacter = (value) => {
  const reg = /[^a-zA-Z 0-9 ]/g;
  if (!reg.test(value)) {
    return true;
  } else {
    return false;
  }
};
export const PreventSpecialCharacterFirstName = (value) => {
  const reg = /[^a-zA-Z0-9. ]/g;
  return !reg.test(value);
};

export const autocompleteOnBlur = (state) => {
  setTimeout(() => {
    state([]);
  }, 500);
};
export const getTrimmedData = (obj) => {
  if (obj && typeof obj === "object") {
    Object.keys(obj).map((key) => {
      if (typeof obj[key] === "object") {
        getTrimmedData(obj[key]);
      } else if (typeof obj[key] === "string") {
        obj[key] = obj[key].trim();
      }
    });
  }
  return obj;
};

export const AddBlankData = (state, name) => {
  return [{ label: name, value: "" }, ...state];
};
export const AllDataDropDownPayload = (data, state, key) => {
  if (data) {
    return [parseInt(data)];
  } else {
    const val = state?.map((ele) => ele[key]);
    return val;
  }
};

export const isChecked = (name, state, value, id) => {
  if (id) {
    const data = state?.map((ele) => {
      if (ele?.TestID === id) {
        return ele[name] === value ? true : false;
      } else {
        return ele;
      }
    });
    return data;
  } else {
    const data = state?.map((ele) => {
      return ele[name] == value ? true : false;
    });
    return data;
  }
};
export const dateConfig = (date, withTime) => {
  if (withTime === 0) {
    return moment(date && date).format("DD/MMM/YYYY") === "Invalid date"
      ? "-"
      : moment(date && date).format("DD/MMM/YYYY");
  } else {
    return moment(date && date).format("DD/MMM/YYYY hh:mm a") === "Invalid date"
      ? "-"
      : moment(date && date).format("DD/MMM/YYYY hh:mm a");
  }
};
export const Time = (date) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};
export const selectedValueCheck = (selectedState, state) => {
  const data = selectedState.find((ele) => ele.value == state);
  return data === undefined ? { label: "", value: "" } : data;
};
export const DyanmicStatusResponse = (state) => {
  let status = -1;
  for (let i = 0; i < state?.length; i++) {
    if (state[i].isChecked == 1) {
      status = state[i].Status;
      break;
    }
  }
  return StatusCheck[status];
};

export const shouldIncludeAIIMSID = () => {
  const IsPoct = useLocalStorage("userData", "get")?.IsPoct;
  return IsPoct == 1 ? true : false;
};
export const DyanmicStatusResponseCulture = (state) => {
  console.log(state);
  let status = -1;
  for (let i = 0; i < state?.length; i++) {
    if (state[i].IsChecked == 1) {
      status = state[i].Status;
      break;
    }
  }
  console.log(status);
  return StatusCheck[status];
};
export const AllowCharactersNumbersAndSpecialChars = (value) => {
  const reg = /[^a-zA-Z0-9\-\/ ]|(\s{2,})|(\/{2,})|(-{2,})/g;
  return !reg.test(value);
};
export const IndexHandle = (currentPage, pageSize) => {
  return (currentPage - 1) * pageSize;
};

export const ExportToExcel = (data, fileName = "data.xlsx") => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, fileName);
};

export const isCheckedNew = (name, state, value, id, secondName) => {
  const data = state?.map((ele) => {
    if (ele[secondName] === id) {
      return ele[name] === value ? true : false;
    } else {
      return ele;
    }
  });
  return data;
};

export const getBase64 = (file) => {
  return new Promise((resolve) => {
    let baseURL = "";
    // Make new FileReader
    let reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(file);

    // on reader load somthing...
    reader.onload = () => {
      // Make a fileInfo Object
      baseURL = reader.result;
      resolve(baseURL);
    };
  });
};

export function formatDate(dateString) {
  const date = new Date(dateString);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

export const isValidPercent = (value) => {
  return /^\d+(\.\d{0,2})?$/.test(value);
};
export const AllowedSpecialChar = (val, allowedSpecialCharacters) => {
  const isValid =
    val === "" ||
    [...val].every(
      (char) =>
        /[a-zA-Z0-9]/.test(char) || allowedSpecialCharacters.includes(char)
    );
  if (isValid) {
    return val;
  } else {
    return;
  }
};
export const PreventSpecialCharacterandNumber = (value) => {
  const reg = /[^a-zA-Z ]/g;
  if (!reg.test(value)) {
    return true;
  } else {
    return false;
  }
};
export const PreventCharacter = (value) => {
  const reg = /[^0-9]/g;
  if (!reg.test(value)) {
    return true;
  } else {
    return false;
  }
};

export const HandleHCEditBooking = (appointData, coupon) => {
  let err = "";
  if (!appointData.AlternateMobileNo) {
    err = { ...err, Alternatemobilenos: "This Field is Required" };
  }
  if (appointData?.AlternateMobileNo.length !== 10) {
    err = { ...err, Alternatemobilenum: "Please enter valid number" };
  }
  if (appointData?.PaymentMode == "") {
    err = { ...err, Paymentmode: "Select Payment Mode" };
  }
  if (appointData?.RefDoctor == "") {
    err = { ...err, RefDoc: "Select Refer Doctor" };
  }
  if (appointData?.SourceofCollection == "") {
    err = { ...err, Source: "Select Source of Collection" };
  }
  if (
    !coupon &&
    (appointData?.DisAmt != "" || appointData?.DiscountPercentage != "")
  ) {
    if (appointData?.DisReason == "") {
      err = { ...err, DisReason: "Enter Discount Reason" };
    }
    if (appointData?.DoctorId == "") {
      err = { ...err, DoctorId: "Select Discount Given By" };
    }
  }

  return err;
};

export const commonDataState = (data) => {
  return data?.map((ele) => ele?.value);
};
export function removeSpecialCharacters(str) {
  return str.replace(/[^a-zA-Z0-9\s]/g, "");
}
export function convertValuesToString(arr) {
  return arr.map((obj) => {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
      newObj[key] = obj[key]?.toString();
    });
    return newObj;
  });
}

export function onlyNumbers(s) {
  return /^\d+$/.test(s);
}
export function CheckDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
    ? 1
    : 0;
}
export function downloadPdf(blobData) {
  console.log(blobData);
  const blob = new Blob([blobData], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `LabReport_${new Date().getTime()}.pdf`;

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

