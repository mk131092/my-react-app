import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import Accordion from "@app/components/UI/Accordion";
import Input from "../../components/formComponent/Input";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";

const MachineGroup = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    MachineName: "",
  });

  const { t, i18n } = useTranslation();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const fetch = () => {
    setLoading(true);
    axiosInstance
      .get("MachineGroup/BindMachineGroup")
      .then((res) => {
        setTableData(res?.data?.message);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went Wrong"
        );
        setLoading(false);
      });
  };

  const BindData = (data) => {
    setState({
      ID: data?.ID,
      MachineName: data?.Name,
    });
  };

  const handleSave = (url) => {
    axiosInstance
      .post(url, state)
      .then((res) => {
        toast.success(res?.data?.message);
        setState({
          MachineName: "",
        });
        fetch();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went Wrong"
        );
      });
  };

  useEffect(() => {
    fetch();
  }, []);
  return (
    <>
      <Accordion
        name={t("Machine Group")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row pt-2 pl-2 pr-2">
          <div className="col-sm-2">
            <Input
              placeholder=""
              type="text"
              className="required-fields"
              max={25}
              name="MachineName"
              id="MachineName"
              value={state?.MachineName}
              onChange={handleChange}
              required
              lable={t("Machine Name")}
            />
          </div>
          <div className="col-sm-1">
            {loading ? (
              <Loading />
            ) : state?.ID ? (
              <button
                className="btn btn-block btn-success btn-sm"
                onClick={() => handleSave("MachineGroup/UpdateMachineGroup")}
                disabled={state?.MachineName?.length > 3 ? false : true}
              >
                {t("Update")}
              </button>
            ) : (
              <button
                className="btn btn-block btn-success btn-sm"
                onClick={() => handleSave("MachineGroup/InsertMachineGroup")}
                disabled={state?.MachineName?.length > 3 ? false : true}
              >
                {t("Save")}
              </button>
            )}
          </div>
        </div>

        <Tables>
          <thead className="cf">
            <tr>
              {[t("S.No"), t("Name"), t("Action")].map((ele, index) => (
                <th key={index}>{ele}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData?.map((ele, index) => (
              <tr key={index}>
                <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                <td data-title={t("Name")}>{ele?.Name}&nbsp;</td>
                <td
                  data-title={t("Action")}
                  className="text-info"
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    window.scroll(0, 0);
                    BindData(ele);
                  }}
                >
                  {t("Select")}
                </td>
              </tr>
            ))}
          </tbody>
        </Tables>
      </Accordion>
    </>
  );
};

export default MachineGroup;
