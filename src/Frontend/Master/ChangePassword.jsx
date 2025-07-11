import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Heading from "../../components/UI/Heading";
import Accordion from "@app/components/UI/Accordion";
import Input from "../../components/formComponent/Input";
import Loading from "../../components/loader/Loading";

const ChangePassword = () => {
  const [state, setState] = useState({
    UserType: "",
    UserName: "",
    OldPassword: "",
    NewPassword: "",
    ConfirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [load, setLoad] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = () => {
    axiosInstance
      .get("Users/logout")
      .then(() => {
        window.localStorage.clear();
        navigate("/login");
        toast.success("Logout Successfully");
      })
      .catch((err) => {
        toast.error(err?.data?.message || "Error Occurred");
      });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!state.OldPassword) {
      newErrors.OldPassword = "Old password is required.";
    }

    if (!state.NewPassword) {
      newErrors.NewPassword = "New password is required.";
    } else if (state.NewPassword.length < 6) {
      newErrors.NewPassword =
        "New password must be at least 6 characters long.";
    }

    if (state.ConfirmPassword !== state.NewPassword) {
      newErrors.ConfirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoad(true);
    axiosInstance
      .post("changePassword/changeUserPassword", {
        UserType: state.UserType,
        UserName: state.UserName,
        OldPassword: state.OldPassword,
        NewPassword: state.NewPassword,
        ConfirmPassword: state.ConfirmPassword,
      })
      .then((res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          handleLogout();
        } else {
          toast.error(res?.data?.message);
        }
        setLoad(false);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Error Occurred");
        setLoad(false);
      });
  };

  const fetchDetail = () => {
    axiosInstance
      .get("changePassword/getUserDetail")
      .then((res) => {
        const data = res?.data?.message[0];
        setState({
          ...state,
          UserType: data?.UserTypeName,
          UserName: data?.Username,
        });
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Error Occurred");
      });
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Accordion
      name={t("Change Password")}
      defaultValue={true}
      isBreadcrumb={true}
    >
      <form onSubmit={handleSubmit}>
        <div className="row pt-2 pl-2 pr-2 pb-2">
          <div className="col-sm-2 ">
            <Input
              name="UserType"
              id="UserType"
              lable="User Type"
              placeholder=""
              disabled={true}
              max={30}
              value={state?.UserType}
            />
          </div>
          <div className="col-sm-2 ">
            <Input
              name="UserName"
              id="UserName"
              lable="User Name"
              placeholder=""
              disabled={true}
              max={30}
              value={state?.UserName}
            />
          </div>

          <div className="col-sm-2 ">
            <Input
              lable="Old Password"
              id="OldPassword"
              placeholder=""
              type="password"
              max={30}
              name="OldPassword"
              className="required-fields"
              onChange={handleChange}
              value={state?.OldPassword}
            />
            {errors?.OldPassword && (
              <div className="error-message">{errors?.OldPassword}</div>
            )}
          </div>
          <div className="col-sm-2 ">
            <Input
              lable="New Password"
              id="NewPassword"
              placeholder=""
              className="required-fields"
              type="password"
              max={30}
              onChange={handleChange}
              name="NewPassword"
              value={state?.NewPassword}
            />
            {errors?.NewPassword && (
              <div className="error-message">{errors?.NewPassword}</div>
            )}
          </div>
          <div className="col-sm-2">
            <Input
              lable="Confirm Password"
              id="ConfirmPassword"
              placeholder=""
              className="required-fields"
              type="password"
              max={30}
              onChange={handleChange}
              name="ConfirmPassword"
              value={state?.ConfirmPassword}
            />
            {errors?.ConfirmPassword && (
              <div className="error-message">{errors?.ConfirmPassword}</div>
            )}
          </div>
          <div className="col-sm-1">
            {load ? (
              <Loading />
            ) : (
              <button
                className="btn btn-block btn-success btn-sm"
                type="submit"
              >
                {t("Save")}
              </button>
            )}
          </div>
        </div>
      </form>
    </Accordion>
  );
};

export default ChangePassword;
