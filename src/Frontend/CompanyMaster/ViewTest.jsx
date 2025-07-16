import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { Dialog } from "primereact/dialog";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";

const ViewTest = ({ show, setShow,id }) => {
  const [loading, setLoading] = useState(false);
  const [bindTest, setBindTest] = useState([]);
  const getBindTestModal = () => {
    setLoading(true);
    axiosInstance
      .post("CouponMasterApproval/BindTestModal", {
        CoupanID: [id],
      })
      .then((res) => {
        console.log(res);
        let data = res?.data?.message;
        let BindTest = data?.map((ele) => {
          return {
            Testname: ele?.TestName,
            discper: ele?.discper,
            discamount: ele?.discamount,
          };
        });
        setLoading(false);
        setBindTest(BindTest);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getBindTestModal();
    return () => {
      setBindTest([]);
    };
  }, [id]);
  const { t } = useTranslation();

  const theme = useLocalStorage("theme", "get");

  return (
    <>
      <Dialog
        visible={show}
        className={theme}
        // header={t("Appointment")}
        onHide={() => {
            setShow();
        }}
        style={{
          width: isMobile ? "80vw" : "70vw",
        }}
      >
        <div className="row">
          {loading && <Loading />}
          {!loading && (
            <Tables>
              <thead>
                <tr>
                  <th data-title="Test">{"Test Name"}</th>
                  <th data-title="Discount(%)">{"Discount %"}</th>
                </tr>
              </thead>
              <tbody>
                {bindTest.map((ele, index) => (
                  <>
                    <tr key={index}>
                      <td data-title="Test">{ele?.Testname} &nbsp;</td>
                      <td data-title="Discount%">{ele?.discper}&nbsp;</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </Tables>
          )}
        </div>
        <div className="row" style={{ textAlign: "center" }}>
          <div className="col-md-12">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setShow();
              }}
            >
              {t("Close")}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ViewTest;
