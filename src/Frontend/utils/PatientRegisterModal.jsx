import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { number } from "../../utils/helpers";
import { axiosInstance } from "../../utils/axiosInstance";
import { DoctorSchema } from "../../utils/Schema";
import Input from "../../components/formComponent/Input";
import { Dialog } from "primereact/dialog";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";

const initialValues = {
  Name: "",
  Mobile: "",
};

const PatientRegisterModal = ({ show, handleClose, Type }) => {
  const { values, errors, handleChange, touched, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: DoctorSchema,
    onSubmit: (values, { resetForm }) => {
      const Url =
        Type == "Secondary"
          ? "DoctorReferal/InsertSecondDoctorReferal"
          : "DoctorReferal/InsertDoctorReferal";
      axiosInstance
        .post(Url, {
          Name: values?.Name,
          Mobile: values?.Mobile == "" ? 0 : values?.Mobile,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          handleClose();
          resetForm({ values: "" });
        })
        .catch((err) => console.log(err));
    },
  });
  const { t } = useTranslation();
  const theme = useLocalStorage("theme", "get");
  return (
    <>
      <Dialog
        visible={show}
        header={t(`${Type} Doctor`)}
        onHide={handleClose}
        top={"25%"}
        className={theme}
      >
        <div className="modal-card">
          <form onSubmit={handleSubmit} className="w-100">
            <div className="row">
              <div className="col-sm-6">
                <Input
                  lable={t("Doctor Name")}
                  placeholder=" "
                  type="text"
                  id="Doctor"
                  name="Name"
                  value={values.Name}
                  onChange={(e) => handleChange(e)}
                />
                {errors?.Name && touched?.Name && (
                  <span className="error-message">{errors?.Name}</span>
                )}
              </div>

              <div className="col-sm-6">
                <Input
                  id="MobileDoctor"
                  placeholder=" "
                  lable={t("Mobile No")}
                  type="number"
                  name="Mobile"
                  onInput={(e) => number(e, 10)}
                  value={values.Mobile}
                  onChange={handleChange}
                  required
                />
                {errors?.Mobile && touched?.Mobile && (
                  <span className="error-message">{errors?.Mobile}</span>
                )}
              </div>
            </div>
          </form>
          <div className="row w-100">
            <div className="col-sm-6">
              <button
                type="submit"
                className="btn btn-success btn-block btn-sm"
                onClick={handleSubmit}
              >
                {t("Save")}
              </button>
            </div>
            <div className="col-sm-6">
              <button
                className="btn btn-danger btn-block btn-sm"
                onClick={handleClose}
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

export default PatientRegisterModal;
