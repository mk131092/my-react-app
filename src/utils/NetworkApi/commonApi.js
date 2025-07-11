import { toast } from "react-toastify";
import axios from "axios";
import { axiosInstance } from "../axiosInstance";
import moment from "moment";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const getCentreDetails = (state) => {
  axiosInstance
    .get("Centre/getGlobalCentres")
    .then((res) => {
      let data = res.data.message;
      let value = data.map((ele) => {
        return {
          value: ele.CentreID,
          label: ele.Centre,
          DefaultCentreId: ele.DefaultCentreId,
        };
      });
      state(value);
    })
    .catch((err) => {
      console.log(err);
      toast.error("Something went wrong");
    });
};

export const getPageData = (state, state2) => {
  axiosInstance
    .get("Menu/MainMenuPageData")
    .then((res) => {
      let data = res?.data?.message;
      let finalData = filtermenu(data?.menuData, data?.pageData);
      const allPageData = finalData.flatMap((menu) => menu.pageData);
      const allMenu = {
        MenuID: 9999,
        MenuName: "All Menu",
        value: 9999,
        label: "All Menu",
        pageData: allPageData,
      };
      finalData.unshift(allMenu);
      state(finalData);
      state2(finalData[0].pageData);
    })
    .catch((err) => {
      toast.error(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : "Something Went Wrong"
      );
    });
};

const filtermenu = (menu, page) => {
  let resultData = [];
  const menuData = [...menu];
  const pageData = [...page];
  for (const item of menuData) {
    let subMenu = pageData.filter(
      (ele) =>
        ele.MenuName === item?.MenuName &&
        ele.MenuID === item?.MenuID &&
        ele.PageName !== "" &&
        ele.PageUrl !== ""
    );
    subMenu = subMenu.map((ele) => {
      return { ...ele, label: ele?.PageName, value: ele.PageID };
    });
    item.value = item?.MenuID;
    item.label = item?.MenuName;
    item.pageData = subMenu;
    resultData.push(item);
  }
  return resultData;
};

export const getQuickLinks = (setState) => {
  axiosInstance.get("Menu/getQuickLinks").then((res) => {
    const datas = res?.data?.message?.map((ele) => ele?.Url?.toLowerCase());
    setState(datas);
  });
};

export const checkDuplicateBarcode = (barcodeNumber, LedgerTransactionID) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post("PatientRegistration/checkBarcodeNo", {
        BarcodeNo: barcodeNumber,
        LedgerTransactionID: LedgerTransactionID?.toString(),
      })
      .then((res) => {
        resolve(res?.data?.message);
      })
      .catch((err) => {
        resolve(err?.response?.data?.message);
      });
  });
};
export const getAccessCentres = (
  state,
  centreState,
  setCentreState,
  LTDataIniti,
  handleRateType,
  VisitTypeCategory,
  fetchFields
) => {
  axiosInstance
    .get("Centre/getAccessCentres")
    .then((res) => {
      let data = res.data.message;
      let CentreDataValue = data.map((ele) => {
        return {
          value: ele.CentreID,
          label: ele.Centre,
          VisitType: ele?.VisitType,
          // HideAmount: ele?.HideAmount,
          SetMRP: ele?.SetMRP,
          BTB: ele?.BTB,
        };
      });
      state(CentreDataValue);

      if (centreState) {
        const filteredSelectedCentre = CentreDataValue?.filter(
          (ele) => ele?.value == useLocalStorage("DefaultCentre", "get")
        );
        setCentreState({
          ...LTDataIniti,
          SrfId: "",
          IcmrId: "",
          RegistrationDate: new Date(),
          CentreID: filteredSelectedCentre[0]?.value,
          CentreName: filteredSelectedCentre[0]?.label,
          VisitType: filteredSelectedCentre[0]?.VisitType,
          SetMRP: filteredSelectedCentre[0]?.SetMRP,
          BTB: filteredSelectedCentre[0]?.BTB,
          OPDIPD: "",
          HLMUHID: "",
          ID_Passport: "",
          Nationality: "",
          HLMOPDIPDNo: "",
          DiscountApprovedBy: "",
          DiscountOnTotal: "",
          DiscountId: "",
          DiscountReason: "",
          Category: "",
          HisBillNo: "",
          BedNo: "",
        });
        VisitTypeCategory(filteredSelectedCentre[0]?.VisitType);
        handleRateType(filteredSelectedCentre[0]?.value);
        fetchFields(filteredSelectedCentre[0]?.VisitType);
      }
    })
    .catch((err) => {
      if (err.response.status === 401) {
        window.sessionStorage.clear();
        window.location.href = "/login";
      }
    });
};
export const getAccessDataRate = (state, centerID) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post("Centre/getRateTypeWithCentre", {
        CentreID: centerID,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => {
          return {
            value: ele?.RateTypeID,
            label: ele?.RateTypeName,
            BarcodeLogic: ele?.BarcodeLogic,
            LockRegistration: ele?.LockRegistration,
            PayMode: ele?.PayMode,
            RateTypeEmail: ele?.Email,
            RateTypePhone: ele?.Phone,
            ClientAddress: ele?.ClientAddress,
            HideAmount: ele?.HideAmount,
            ProEmployee: ele?.ProEmployee,
            AutoEmail: ele?.IsAutoPRDM,
          };
        });
        centerID === "" && val.unshift({ label: "All RateType", value: "" });
        state(val);
        resolve(val);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
export const getAccessDataRateReport = (state, centerID) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post("Centre/GetRateType", {
        CentreID: Array?.isArray(centerID) ? centerID : [],
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => {
          return {
            value: ele?.RateTypeID,
            label: ele?.RateTypeName,
            BarcodeLogic: ele?.BarcodeLogic,
            LockRegistration: ele?.LockRegistration,
            PayMode: ele?.PayMode,
            RateTypeEmail: ele?.Email,
            RateTypePhone: ele?.Phone,
            ClientAddress: ele?.ClientAddress,
            HideAmount: ele?.HideAmount,
            ProEmployee: ele?.ProEmployee,
          };
        });
        state(val);
        resolve(val);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
export const getBindDiscApproval = (state) => {
  axiosInstance
    .get("DiscApproval/BindDiscApproval")
    .then((res) => {
      const data = res.data?.message;
      let val = data.map((ele) => {
        return {
          label: ele?.Name,
          value: ele?.EmployeeID,
        };
      });
      val.unshift({ label: "Select Disc Approval", value: "" });
      state(val);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getBindDiscReason = (state) => {
  axiosInstance
    .post("Global/getGlobaldata", {
      Type: "DiscountReason",
    })
    .then((res) => {
      const data = res.data?.message;
      let val = data.map((ele) => {
        return {
          label: ele?.FieldDisplay,
          value: ele?.FieldDisplay,
        };
      });
      val.unshift({ label: "SelectDiscountReason", value: "" });
      state(val);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getBindReportDeliveryMethod = (state) => {
  axiosInstance
    .post("Global/getGlobaldata", {
      Type: "ReportDeliveryMethod",
    })
    .then((res) => {
      const data = res.data?.message;
      const val = data.map((ele) => {
        return {
          label: ele?.FieldDisplay,
          value: ele?.FieldDisplay,
        };
      });
      state(val);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getCollectionBoy = (state) => {
  axiosInstance
    .get("FieldBoyMaster/BindFieldBoy")
    .then((res) => {
      let data = res.data.message;
      let collection = data.map((ele) => {
        return {
          value: ele.FieldBoyID,
          label: ele.Name,
        };
      });
      state(collection);
    })
    .catch((err) => console.log(err));
};

export const getDoctorSuggestion = (formData, state, setFormData) => {
  if (formData.DoctorName.length >= 1) {
    axiosInstance
      .post("DoctorReferal/getDoctorData", {
        DoctorName: formData.DoctorName,
      })
      .then((res) => {
        if (res?.data?.message?.length > 0) {
          state(res?.data?.message);
        } else {
          setTimeout(() => {
            setFormData({ ...formData, DoctorName: "" });
          }, 100);
        }
      })
      .catch((err) => console.log(err));
  } else {
    state([]);
    setFormData({ ...formData, DoctorReferal: "" });
  }
};
export const getPaymentModes = (name, state) => {
  axiosInstance
    .post("Global/getGlobalData", { Type: name })
    .then((res) => {
      let data = res.data.message;
      let value = data.map((ele) => {
        return {
          value: [
            "specialization",
            "PatientType",
            "Source",
            "BankName",
          ].includes(name)
            ? ele.FieldDisplay
            : ele.FieldID,
          label: ele.FieldDisplay,
        };
      });
      state(value);
    })
    .catch((err) => {
      toast.error(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : "Something Went Wrong"
      );
    });
};

export const getDashboardAccessCentres = ({ state, callbackFun }) => {
  axiosInstance
    .get("Centre/getAccessCentres")
    .then((res) => {
      let data = res.data.message;
      if (Array.isArray(data)) {
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        state(CentreDataValue);
        callbackFun(
          "CentreID",
          CentreDataValue?.map((ele) => ele?.value)
        );
      } else {
        console.error("Unexpected data format:", data);
      }
    })
    .catch((err) => {
      console.log("API call failed:", err); // Log error
    });
};
export const getVisitType = (state) => {
  axiosInstance
    .get("Centre/visitTypeList")
    .then((res) => {
      let data = res.data.message;
      let Visit = data.map((ele) => {
        return {
          value: ele.FieldID,
          label: ele.FieldDisplay,
        };
      });
      state(Visit);
    })
    .catch((err) => console.log(err));
};
export const getsecondDoctorSuggestion = (formData, state, setFormData) => {
  if (formData.SecondReferDoctor.length >= 1) {
    axiosInstance
      .post("DoctorReferal/getSecondaryDoctorData", {
        DoctorName: formData.SecondReferDoctor,
      })
      .then((res) => {
        if (res?.data?.message?.length > 0) {
          state(res?.data?.message);
        } else {
          setTimeout(() => {
            setFormData({ ...formData, SecondReferDoctor: "" });
          }, 100);
        }
      })
      .catch((err) => console.log(err));
  } else {
    state([]);
    setFormData({ ...formData, DoctorReferal: "" });
  }
};

export const GetMedicalHistoryData = (
  MedicalId,
  setState,
  state,
  ID,
  handleUploadCount
) => {
  axiosInstance
    .post("patientRegistration/GetMedicalHistoryData", {
      PatientGuid: MedicalId,
      LedgerTransactionID: ID ? ID : 1,
    })
    .then((res) => {
      const data = res?.data?.message;
      if (res?.data?.success) {
        const val = data.map((ele) => {
          return {
            MedicalHistory: ele?.MedicalHistory,
            LedgerTransactionID: ele?.LedgerTransactionID,
            PatientMedicalHistoryID: ele?.PatientMedicalHistoryID,
            date: moment(ele?.dtEntry)
              .utcOffset("+05:30")
              .format("YYYY-MM-DDTHH:mm:ss"),
          };
        });
        handleUploadCount(
          "MedicalHistoryCount",
          data.length,
          "IsMedicalHistory"
        );
        setState({
          PatientGuid: MedicalId,
          patientmedicalhistoryiesVM: val,
        });
      } else {
        handleUploadCount("MedicalHistoryCount", 0, "IsMedicalHistory");
        setState({ PatientGuid: MedicalId, patientmedicalhistoryiesVM: [] });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getSampleType = (state, id) => {
  axiosInstance
    .post("SampleType/getSampleTypeInVestigationWise", {
      InvestigationID: id,
    })
    .then((res) => {
      const data = res.data.message;
      console.log(data);
      let maindata = data.map((ele) => {
        return {
          value: ele?.id,
          label: ele?.SampleName,
        };
      });
      state(maindata);
    })
    .catch((err) => {
      toast.error(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : "Error Occured"
      );
    });
};

export const getRejectCount = () => {
  axiosInstance
    .get("SC/getrejectcount")
    .then((res) => {
      const data = res?.data?.message[0]?.Rejected;
      const rejectCountElement = document.getElementById("RejectCount");
      if (rejectCountElement) {
        rejectCountElement.textContent = data;
        if (data === 0) {
          document.getElementById("rejectCountCont").style.display = "none";
        } else {
          document.getElementById("rejectCountCont").style.display = "flex";
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const checkEmploypeeWiseDiscount = (data, id) => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post("PatientRegistration/IsValidDiscountAmount", {
        TotalAmount: data?.GrossAmount,
        EmployeeID: id,
        CentreId: data?.CentreID,
        DiscountAmount: data?.DiscountOnTotal,
      })
      .then((res) => {
        resolve(false);
      })
      .catch((err) => {
        reject(err?.response?.data?.message);
      });
  });
};

export const DepartmentWiseItemList = (id, name, state, autocomplete) => {
  axiosInstance
    .post("CommonController/DepartmentWiseItemList", {
      DepartmentID: id,
      TestName: name,
    })
    .then((res) => {
      const data = res?.data?.message;
      const val = data.map((ele) => {
        return {
          label: ele?.TestName,
          value: ele?.TestName,
        };
      });
      state(autocomplete ? val : data);
    })
    .catch((err) => {
      toast.error(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : "Error Occured"
      );
    });
};
export const BindEmployeeReports = (state) => {
  axiosInstance
    .get("Camp/GetEmployees")
    .then((res) => {
      let data = res.data.message;
      let EmployeeData = data.map((ele) => {
        return {
          value: ele?.EmployeeID,
          label: ele?.NAME,
        };
      });
      state(EmployeeData);
    })
    .catch((err) => console.log(err));
};
export const BindFieldType = (state) => {
  axiosInstance
    .get("Global/BindFieldType")
    .then((res) => {
      const data = res.data?.message;
      const val = data.map((ele) => {
        return {
          label: ele?.FieldType,
          value: ele?.FieldType,
        };
      });
      state(val);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getAccessCentresReports = (state) => {
  axiosInstance
    .get("Centre/getAccessCentres")
    .then((res) => {
      let data = res.data.message;
      console.log(data);
      let CentreDataValue = data.map((ele) => {
        return {
          value: ele.CentreID,
          label: ele.Centre,
        };
      });
      state(CentreDataValue);
    })
    .catch((err) => {
      toast.error(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : "Error Occured"
      );
    });
};

export const BindApprovalDoctorReports = (state) => {
  axiosInstance
    .get("CommonController/GetReferalDoctorData")
    .then((res) => {
      let data = res.data.message;
      let doctorData = data.map((ele) => {
        return {
          value: ele?.DoctorReferalId,
          label: ele?.Name,
        };
      });
      state(doctorData);
    })
    .catch((err) => console.log(err));
};

export const BindProEmployee = (state) => {
  axiosInstance
    .get("Employee/ProEmployee")
    .then((res) => {
      let data = res.data.message;
      let doctorData = data.map((ele) => {
        return {
          value: ele?.EmployeeID,
          label: ele?.EmployeeName,
        };
      });
      state(doctorData);
    })
    .catch((err) => console.log(err));
};
export const getDepartment = (state, api, manageOrdering, setCheckField) => {
  axiosInstance
    .get(`Department/${api ? api : "getDepartmentData"}`)
    .then((res) => {
      let data = res.data.message;
      let Department = data.map((ele, index) => {
        if (manageOrdering) {
          return {
            printOrder: ele?.printorder,
            value: ele.DepartmentID,
            label: ele.Department,
          };
        } else {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        }
      });
      if (setCheckField) {
        setCheckField({
          billingCategory: true,
          department: true,
        });
      }
      state(Department);
    })
    .catch((err) => {
      if (setCheckField) {
        setCheckField({
          billingCategory: true,
          department: true,
        });
      }
      console.log(err);
    });
};
export const getDesignationData = (state, all) => {
  axiosInstance
    .get("Designation/getDesignation")
    .then((res) => {
      let data = res.data.message;
      let Visit = data.map((ele) => {
        return {
          value: ele.DesignationID,
          label: ele.DesignationName,
        };
      });
      !all && Visit.unshift({ label: "All", value: "" });
      state(Visit);
    })
    .catch((err) => console.log(err));
};
export const GetAccessRightMaster = (state) => {
  axios
    .get("/api/v1/Employee/GetAccessRightMaster")
    .then((res) => {
      let data = res.data.message;
      let CentreDataValue = data.map((ele) => {
        return {
          value: ele.AccessbyId,
          label: ele.accessby,
        };
      });
      state(CentreDataValue);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const GetAccessRightApproval = (state) => {
  axios
    .post("/api/v1/Employee/getApprovalRightMaster")
    .then((res) => {
      let data = res.data.message;

      let CentreDataValue = data.map((ele) => {
        return {
          value: ele.EmployeeID,
          label: ele.NAME,
        };
      });
      state(CentreDataValue);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getEmployeeCenter = (state) => {
  axios
    .get("/api/v1/Employee/GetAllCentres")
    .then((res) => {
      const data = res?.data?.message;
      const val = data.map((ele) => {
        return {
          value: ele?.CentreID,
          label: ele?.Centre,
        };
      });
      state(val);
    })
    .catch((err) => {
      console.log(err);
    });
};
export const GetRateTypeByGlobalCentre = (state) => {
  axios
    .post("/api/v1/Accounts/GetRateTypeByGlobalCentre", {
      TypeId: "",
    })
    .then((res) => {
      let data = res.data.message;
      let responce = data.map((ele) => {
        return {
          value: ele.RateTypeID,
          label: ele.RateTypeName,
        };
      });
      state(responce);
    })
    .catch((err) => console.log(err));
};

export const getAccessRateType = (state) => {
  axios
    .get("/api/v1/RateType/getAccessRateType")
    .then((res) => {
      let data = res.data.message;
      let CentreDataValue = data.map((ele) => {
        return {
          value: ele.RateTypeID,
          label: ele.Rate,
        };
      });
      state(CentreDataValue);
    })
    .catch((err) => console.log(err));
};

export const bindDepartment = (state) => {
  axios
    .get("/api/v1/ModalityMaster/BindDepartment")
    .then((res) => {
      let data = res.data.message;
      let responce = data.map((ele) => {
        return {
          value: ele.DepartmentId,
          label: ele.Department,
        };
      });
      state(responce);
    })
    .catch((err) =>
      toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong")
    );
};
export const bindFloor = (state) => {
  axios
    .get("/api/v1/ModalityMaster/BindFloor")
    .then((res) => {
      let data = res.data.message;
      let responce = data.map((ele) => {
        return {
          value: ele.NAME,
          label: ele.NAME,
        };
      });
      state(responce);
    })
    .catch((err) =>
      toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong")
    );
};
export const BindRoomList = (state) => {
  axios
    .get("/api/v1/ModalityMaster/BindRoomList")
    .then((res) => {
      let data = res.data.message;
      let responce = data.map((ele) => {
        return {
          value: ele.Id,
          label: ele.RoomName,
        };
      });
      state(responce);
    })
    .catch((err) =>
      toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong")
    );
};
export const BindGroupToken = (state) => {
  axios
    .get("/api/v1/ModalityMaster/BindGroupToken")
    .then((res) => {
      let data = res.data.message;
      let responce = data.map((ele) => {
        return {
          value: ele.GroupID,
          label: ele.GroupName,
        };
      });
      state(responce);
    })
    .catch((err) =>
      console.log(err?.res?.data ? err?.res?.data : "Something Went Wrong")
    );
};

export const CheckApprovalRights = (state) => {
  axiosInstance.get("Camp/Aprrovalrights").then((res) => {
    state(res?.data?.message);
  });
};
