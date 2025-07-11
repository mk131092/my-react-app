import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import { Dialog } from "primereact/dialog";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import Tables from "../../components/UI/customTable";
import Input from "../../components/formComponent/Input";
import { isCheckedNew } from "../../utils/helpers";
import Loading from "../../components/loader/Loading";

import { useTranslation } from "react-i18next";
const DesignationModal = ({ show, onHandleClose }) => {
  const [HeaderData, setHeaderData] = useState([]);
  const [TableData, setTableData] = useState([]);
  const [filterAllData, setFilterAllData] = useState([]);
  const [load, setLoad] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const { t } = useTranslation();
  const fetchPageAccessRightsData = (id) => {
    axiosInstance
      .post("Menu/PageAccessRightsData", { DesignationID: id })
      .then((res) => {
        const data = res?.data?.message;
        setFilterAllData(data);
        setTableData(data);
        let ids = "";
        let headerData = data.filter((ele) => {
          if (ele.MenuName !== ids) {
            ids = ele?.MenuName;
            return ele;
          } else {
            ids = ele?.MenuName;
          }
        });
        console.log(headerData);
        const uniqueHeaderData = headerData.filter((item, index, self) => {
          return self.findIndex((obj) => obj.MenuID === item.MenuID) === index;
        });
        setHeaderData(uniqueHeaderData);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  useEffect(() => {
    fetchPageAccessRightsData(show?.id);
  }, [show]);

  const handleChange = (e, index, find) => {
    const { name, checked } = e.target;

    if (index >= 0) {
      const data = [...TableData];
      data[index][name] = checked === true ? 1 : 0;
      setTableData(data);
    } else {
      const data = TableData.map((ele) => {
        if (ele?.MenuName === find) {
          return {
            ...ele,
            [name]: checked === true ? 1 : 0,
          };
        } else {
          return ele;
        }
      });
      setTableData(data);
    }
  };

  const handleSearch = (e, data) => {
    const { value } = e?.target;
    let val = [...filterAllData];

    let filterDataNew = val.filter((ele) => {
      if (ele.MenuID === data?.MenuID) {
        if (ele?.PageName?.toLowerCase().includes(value.toLowerCase())) {
          return ele;
        }
      } else {
        return ele;
      }
    });

    setTableData(value ? filterDataNew : val);
  };

  const handleSubmit = () => {
    const data = TableData.filter((ele) => ele?.Allow === 1);
    if (data.length > 0) {
      setLoad(true);
      const val = data.map((ele) => {
        return {
          ...ele,
          DesignationID: show?.id,
        };
      });
      axiosInstance
        .post("Menu/AddPageRightsData", val)
        .then((res) => {
          toast.success(res?.data?.message);
          setLoad(false);
          onHandleClose();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          );
          setLoad(false);
        });
    } else {
      toast.error("Please Select Atleast One");
    }
  };
  const isMobile = window.innerWidth <= 768;
  const theme = useLocalStorage("theme", "get");
  // console.log(HeaderData)
  return (
    <>
      <Dialog
        header={t("Page Rights")}
        onHide={onHandleClose}
        className={theme}
        visible={show}
        style={{
          width: isMobile ? "80vw" : "30vw",
          height: "100vw",
        }}
      >
        <div className="row mb-2">
          {HeaderData?.map((ele, index) => (
            <div key={index} className="col-12 mb-2">
              <div>
                <button
                  className="btn btn-primary w-100"
                  onClick={() =>
                    setActiveSection(
                      activeSection === ele.MenuName ? null : ele.MenuName
                    )
                  }
                >
                  {t(ele?.MenuName)}
                </button>
              </div>

              {activeSection === ele.MenuName && (
                <div className="mt-2">
                  <Tables>
                    <thead className="cf">
                      <tr>
                        <th style={{ width: "45%", padding: "2px" }}>
                          <span style={{ padding: "2px" }}>
                            {t(ele?.MenuName)}
                          </span>
                        </th>
                        <th style={{ color: "black", width: "45%" }}>
                          <Input
                            onChange={(e) => handleSearch(e, ele)}
                            className="mt-1"
                          />
                        </th>
                        <th style={{ width: "10%", textAlign: "center" }}>
                          {show?.name !== "Sales Person" && (
                            <input
                              type="checkbox"
                              name="Allow"
                              onChange={(e) =>
                                handleChange(e, -1, ele?.MenuName)
                              }
                              checked={
                                TableData?.length > 0
                                  ? isCheckedNew(
                                      "Allow",
                                      TableData,
                                      1,
                                      ele?.MenuName,
                                      "MenuName"
                                    ).includes(false)
                                    ? false
                                    : true
                                  : false
                              }
                            />
                          )}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {TableData?.map(
                        (data, ind) =>
                          data?.MenuName === ele?.MenuName && (
                            <tr key={ind}>
                              <td
                                data-title="PageName"
                                colSpan={2}
                                style={{ padding: "2px" }}
                              >
                                {t(data?.PageName)}
                              </td>
                              <td
                                data-title="Allow"
                                style={{ textAlign: "center" }}
                              >
                                <input
                                  type="checkbox"
                                  checked={data?.Allow}
                                  name="Allow"
                                  onChange={(e) => handleChange(e, ind)}
                                />
                              </td>
                            </tr>
                          )
                      )}
                    </tbody>
                  </Tables>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="box-footer">
          <div className="row">
            <div className="col-sm-2">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={handleSubmit}
                >
                 {t("Save")}
                </button>
              )}
            </div>
            <div className="col-sm-2">
              <button
                className="btn btn-block btn-danger btn-sm"
                onClick={onHandleClose}
              >
                
                {t("Close")}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default DesignationModal;
