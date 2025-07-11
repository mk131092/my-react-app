import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { validationForSampleType } from "../../utils/Schema";
import { getTrimmedData } from "../../utils/helpers";
import { toast } from "react-toastify";
import Accordion from "@app/components/UI/Accordion";
import Input from "../../components/formComponent/Input";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Tables from "../../components/UI/customTable";
import Loading from "../../components/loader/Loading";

const SampleTypeCreate = () => {
  const [data, setData] = useState([]);
  const [Color, setColor] = useState([]);
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState({});
  const [formData, setFormData] = useState({
    SampleName: "",
    Container: "",
    ColorName: "red",
    isActive: 1,
  });
  const { t } = useTranslation();

  const getDropDownData = (name) => {
    axiosInstance
      .post("Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });

        switch (name) {
          case "Color":
            setColor(value);
            break;
        }
      })
      .catch((err) => console.log(err));
  };
  const handleSearch = () => {
    setLoad(true);
    axiosInstance
      .get("SampleType/getSampleType")
      .then((res) => {
        setData(res.data.message);

        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
        console.log(err);
      });
  };
  const postData = (url) => {
    let generatedError = validationForSampleType(formData);
    if (generatedError === "") {
      setLoad(true);
      axiosInstance
        .post(url, getTrimmedData({ ...formData, id: formData?.id ?? "" }))
        .then((res) => {
          setFormData({
            SampleName: "",
            Container: "",
            ColorName: "red",
            isActive: 0,
          });
          toast.success(res?.data?.message);
          handleSearch();
          setErr({});
          setLoad(false);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoad(false);
        });
    } else {
      setErr(generatedError);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(type);
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    handleSearch();
    getDropDownData("Color");
  }, []);

  const handleEdit = (data) => {
    console.log(data);
    setFormData({
      SampleName: data?.SampleName,
      Container: data?.Container,
      ColorName: data?.ColorName,
      isActive: data?.isActive,
      id: data?.id,
    });
  };

  return (
    <>
      <Accordion
        name={t("Sample Type Create")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row pt-2 pl-2 pr-2">
          <div className="col-sm-2">
            <Input
              className="required-fields"
              type="text"
              lable="Sample Name"
              id="SampleName"
              name="SampleName"
              placeholder=" "
              max={50}
              onChange={handleChange}
              value={formData?.SampleName}
            />
            {formData?.SampleName?.trim() === "" && (
              <span className="error-message">{err?.SampleName}</span>
            )}
          </div>
          <div className="col-sm-2">
            <Input
              className="required-fields"
              type="text"
              lable="Container"
              id="Container"
              name="Container"
              placeholder=" "
              max={15}
              onChange={handleChange}
              value={formData?.Container}
            />
            {formData?.Container?.trim() === "" && (
              <span className="error-message">{err?.Container}</span>
            )}
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={Color}
              name="ColorName"
              id="ColorName"
              lable="Color"
              selectedValue={formData?.ColorName}
              onChange={handleSelectChange}
            />
          </div>
          <div className="col-sm-1 mt-1 d-flex">
            <div className="mt-1">
              <input
                name="isActive"
                type="checkbox"
                className="mb-3"
                checked={formData?.isActive}
                onChange={handleChange}
              />
            </div>
            <label htmlFor="isActive" className="ml-2">
              {t("Active")}
            </label>
            &nbsp;
          </div>
          <div className="col-sm-1">
            <button
              type="button"
              className={`btn ${
                formData?.id ? "btn-warning" : "btn-success"
              } btn-sm w-100`}
              onClick={() =>
                postData(
                  formData?.id
                    ? "SampleType/UpdateSampleType"
                    : "SampleType/SaveSampleType"
                )
              }
            >
              {formData?.id ? t("Update") : t("Save")}
            </button>
          </div>
          <div className="col-sm-1">
            <button
              type="button"
              className="btn btn-block btn-danger btn-sm"
              id="Reset"
              title="Reset"
              onClick={() => {
                setFormData({
                  SampleName: "",
                  Container: "",
                  ColorName: "red",
                  isActive: 0,
                });
                setErr({});
              }}
            >
              {t("Reset")}
            </button>
          </div>
        </div>
      </Accordion>
      <Accordion title={t("Search Data")} defaultValue={true}>
        {load ? (
          <Loading />
        ) : (
          <div className="row p-2">
            <div className="col-12">
              <Tables>
                <thead>
                  <tr>
                    <th>{t("S.No")}</th>
                    <th>{t("SampleName")}</th>
                    <th>{t("Container")}</th>
                    <th>{t("ColorName")}</th>
                    <th>{t("Active")}</th>
                    <th className="text-center">
                      <i class="fa fa-edit"></i>
                    </th>
                  </tr>
                </thead>
                {data.map((data, i) => (
                  <tbody>
                    {" "}
                    <tr>
                      <td data-title={t("S.No")} className="text-center">
                        {i + 1}&nbsp;
                      </td>
                      <td data-title={t("SampleName")} className="text-center">
                        {data?.SampleName}&nbsp;
                      </td>

                      <td data-title={t("Container")} className="text-center">
                        {data?.Container}&nbsp;
                      </td>
                      <td data-title={t("ColorName")} className="text-center">
                        {data?.ColorName}&nbsp;
                      </td>
                      <td data-title={t("IsActive")} className="text-center">
                        {data?.isActive == 1 ? "Active" : "InActive"}&nbsp;
                      </td>
                      <td data-title="Select" className="text-center">
                        <button
                          className="btn btn-primary btn-sm btn-class"
                          onClick={() => {
                            handleEdit(data);
                          }}
                        >
                          <i class="fa fa-edit"></i>
                        </button>
                      </td>
                    </tr>{" "}
                  </tbody>
                ))}
              </Tables>
            </div>
          </div>
        )}
      </Accordion>
    </>
  );
};

export default SampleTypeCreate;
