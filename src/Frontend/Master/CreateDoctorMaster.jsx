import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { getTrimmedData, number } from "../../utils/helpers";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { DocotorReferal } from "../../utils/Schema";
import Accordion from "@app/components/UI/Accordion";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Input from "../../components/formComponent/Input";
import Loading from "../../components/loader/Loading";

const CreateDoctorMaster = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const [Title, setTitle] = useState([]);
  const [Specialization, setSpecialization] = useState([]);
  const [Degree, setDegree] = useState([]);
  const [load, setLoad] = useState(false);
  const [proEmplyee, setProEmployee] = useState([]);
  const [payload, setPayload] = useState({
    Title: "Dr.(Mr)",
    Name: "",
    ClinicName: "",
    Email: "",
    Address: "",
    Phone: "",
    Mobile: "",
    Specialization: "",
    Degree: "",
    Zone: "",
    Locality: "",
    isActive: 1,
    SecondReferDoctor: 0,
    ProEmployee: "",
  });

  const getProEmployee = () => {
    axiosInstance
      .get("Employee/ProEmployee")
      .then((res) => {
        let data = res?.data?.message;
        let proData = data?.map((ele) => {
          return {
            value: ele?.EmployeeID,
            label: ele?.EmployeeName,
          };
        });
        setProEmployee(proData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const { values, errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: payload,
    enableReinitialize: true,
    validationSchema: DocotorReferal,
    onSubmit: (values) => {
      setLoad(true);
      axiosInstance
        .post(
          state?.url1 ? state?.url1 : "DoctorReferal/SaveDoctorReferal",
          getTrimmedData(values)
        )
        .then((res) => {
          setLoad(false);
          toast.success(res?.data?.message);
          navigate("/DoctorReferal");
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "error occured"
          );
          setLoad(false);
        });
    },
  });
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
        console.log(value);
        if (name == "Title") {
          setTitle(value);
        }
        if (name == "Specialization") {
          setSpecialization(value);
        }
        if (name == "Degree") {
          setDegree(value);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange = (e) => {
    const { value, name } = e.target;
    setPayload({ ...values, [name]: value });
  };

  useEffect(() => {
    getDropDownData("Title");
    getDropDownData("Specialization");
    getDropDownData("Degree");
    getProEmployee();
  }, []);

  const handleChanges = (e) => {
    const { name, value, checked, type } = e.target;
    setPayload((payload) => ({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const fetch = () => {
    axiosInstance
      .post(state?.url, {
        DoctorReferalID: state?.id,
      })
      .then((res) => {
        setPayload(res?.data?.message[0]);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "error occured"
        );
      });
  };

  useEffect(() => {
    if (state) {
      fetch();
    }
  }, []);
  useEffect(() => {
    setPayload({
      ...payload,
      Title: payload?.Title ?? Title[0]?.value,
    });
  }, [Title]);
  return (
    <>
      <Accordion
        name={t("Create New Doctor")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row pt-2 pl-2 pr-2 mt-1">
          <div className="col-sm-2">
            <SelectBox
              options={Title}
              name="Title"
              selectedValue={payload?.Title}
              onChange={(e) => handleSelectChange(e, values)}
              id="Title"
              lable="Title"
            />
          </div>
          <div className="col-sm-2">
            <Input
              type="text"
              className="required-fields"
              placeholder=" "
              lable="Doctor Name"
              id="DoctorName"
              name="Name"
              max={75}
              value={values?.Name}
              onChange={handleChange}
            />
            {errors?.Name && touched?.Name && (
              <div className="error-message">{errors?.Name}</div>
            )}
          </div>
          <div className="col-sm-2">
            <div>
              <Input
                type="text"
                placeholder=" "
                lable="ClinicName"
                id="ClinicName"
                name="ClinicName"
                max={75}
                value={values?.ClinicName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <div>
              <Input
                type="email"
                placeholder=" "
                lable="Email"
                id="Email"
                name="Email"
                max={50}
                value={values?.Email}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-sm-2">
            <Input
              type="number"
              placeholder=" "
              lable="Phone"
              id="Phone"
              name="Phone"
              onInput={(e) => number(e, 10)}
              value={values?.Phone}
              onChange={handleChange}
            />
          </div>
          <div className="col-sm-2">
            <Input
              className="required-fields"
              type="number"
              placeholder=" "
              lable="Mobile"
              id="Mobile"
              name="Mobile"
              onInput={(e) => number(e, 10)}
              value={values?.Mobile}
              onChange={handleChange}
            />
            {errors?.Mobile && touched?.Mobile && (
              <div className="error-message">{errors?.Mobile}</div>
            )}
          </div>
        </div>
        <div className="row pt-1 pl-2 pr-2">
          <div className="col-sm-2">
            <SelectBox
              lable="Specialization"
              name="Specialization"
              options={[
                { label: "Select Specialization", value: "" },
                ...Specialization,
              ]}
              selectedValue={payload?.Specialization}
              id="Specialization"
              onChange={handleSelectChange}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={[{ label: "Select Degree", value: "" }, ...Degree]}
              id="Degree"
              lable="Degree"
              name="Degree"
              selectedValue={payload?.Degree}
              onChange={handleSelectChange}
            />
          </div>
          <div className="col-sm-2">
            <Input
              type="text"
              max={200}
              placeholder=" "
              lable="Address"
              id="Address"
              name="Address"
              value={values?.Address}
              onChange={handleChange}
            />
          </div>
          <div className="col-sm-2">
            <Input
              type="text"
              max={200}
              placeholder=" "
              lable="Zone"
              id="Zone"
              name="Zone"
              value={values?.Zone}
              onChange={handleChange}
            />
          </div>
          <div className="col-sm-2">
            <Input
              type="text"
              max={200}
              placeholder=" "
              lable="Locality"
              id="Locality"
              name="Locality"
              value={values?.Locality}
              onChange={handleChange}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={[{ label: "Select", value: "" }, ...proEmplyee]}
              name="ProEmployee"
              selectedValue={payload?.ProEmployee}
              onChange={handleSelectChange}
              id="ProEmployee"
              lable="ProEmployee"
            />
          </div>
        </div>
        <div className="row pt-2 pl-2 pr-2 mt-1">
          <div className="col-sm-1 mt-1 d-flex">
            <div className="mt-1">
              <input
                type="checkbox"
                checked={payload?.isActive}
                onChange={handleChanges}
                name="isActive"
              />
            </div>
            <label className="control-label ml-2">{t("Active")}</label>
          </div>
          <div className="col-sm-2 mt-1 d-flex">
            <div className="mt-1">
              <input
                type="checkbox"
                checked={payload?.SecondReferDoctor}
                onChange={handleChanges}
                name="SecondReferDoctor"
              />
            </div>
            <label className="control-label ml-2">
              {t("Second Refer Doctor")}
            </label>
          </div>
          <div className="col-sm-1">
            {load ? (
              <Loading />
            ) : (
              <button
                className="btn btn-block btn-success btn-sm"
                onClick={handleSubmit}
              >
                {state?.url1 ? t("Update") : t("Save")}
              </button>
            )}
          </div>
          <div className="col-sm-2">
            <Link to="/DoctorReferal">{t("Back to List")}</Link>
          </div>
        </div>
      </Accordion>
    </>
  );
};

export default CreateDoctorMaster;
