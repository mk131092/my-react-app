import { StyledDropdown } from "@app/styles/common";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "../../../utils/hooks/useLocalStorage";
import { axiosInstance } from "../../../utils/axiosInstance";
import { toast } from "react-toastify";

const languages = [
  {
    key: "en",
    icon: "fi fi-us",
    label: "English",
  },
  {
    key: "hi",
    icon: "fi fi-in",
    label: "Hindi",
  },
  {
    key: "ta",
    icon: "fi fi-in", // India
    label: "Tamil",
  },
  {
    key: "te",
    icon: "fi fi-in", // India
    label: "Telugu",
  },
  {
    key: "pa",
    icon: "fi fi-in", // India
    label: "Punjabi",
  },
  {
    key: "bl",
    icon: "fi fi-in", // India
    label: "Bundeli",
  },
  {
    key: "ru",
    icon: "fi fi-ru", //Russia
    label: "Russian",
  },
  {
    key: "ar",
    icon: "fi fi-sa", // Saudi Arabia
    label: "Arabic",
  },
  {
    key: "fa",
    icon: "fi fi-ir", // Iran
    label: "Farsi",
  },

  {
    key: "sw",
    icon: "fi fi-ug", // Uganda
    label: "Swahili",
  },
  {
    key: "de",
    icon: "fi fi-de", // Germany
    label: "German",
  },
  {
    key: "es",
    icon: "fi fi-es", // Spain
    label: "Spanish",
  },
];

const LanguagesDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const languageApiCall = async (item, EmpLanguage) => {
    let userData = useLocalStorage("userData", "get");
    axiosInstance
      .post("CommonController/UpdateLanguage", {
        EmpLanguageCode: item,
        EmpLanguage: EmpLanguage,
        EmployeeID: userData?.EmployeeID.toString(),
      })
      .then((res) => {
        useLocalStorage("language", "set", item);
        i18n.changeLanguage(item);
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const getCurrentLanguage = () => {
    const currentLanguage = i18n.language;
    if (currentLanguage) {
      const language = languages.find(
        (language) => language.key === currentLanguage
      );
      return language || languages[0];
    }
    return languages[0];
  };

  const isActiveLanguage = (language) => {
    if (language) {
      return getCurrentLanguage().key === language.key ? "active" : "";
    }
    return "";
  };

  return (
    <StyledDropdown isOpen={dropdownOpen} hideArrow>
      <div className="nav-link " slot="head">
        <i className={`flag-icon ${getCurrentLanguage().icon}`} />
      </div>
      <div slot="body">
        {languages.map((language) => {
          return (
            <span
              type="button"
              key={language.key}
              className={`dropdown-item ${isActiveLanguage(language)}`}
              onClick={() => {
                languageApiCall(language?.key, language?.label);
                setDropdownOpen(false);
              }}
            >
              <i className={`flag-icon ${language.icon} mr-2`} />
              <span>{language.label}</span>
            </span>
          );
        })}
      </div>
    </StyledDropdown>
  );
};

export default LanguagesDropdown;
