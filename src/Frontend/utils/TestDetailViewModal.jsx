import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { Dialog } from "primereact/dialog";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";

const TestDetailViewModal = ({ data, show, onHide }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  console.log(data);
  const getMemberShipCard = (id) => {
    setLoading(true);
    axiosInstance
      .post("MembershipCardIssue/ViewCardDetail", {
        FamilyMemberGroupId: id,
      })
      .then((res) => {
        if (res.status === 200) {
          setTableData(res.data.message);
          toast.success(res?.data?.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response.data.message);
      });
  };
  useEffect(() => {
    getMemberShipCard(data?.FamilyMemberGroupID);
  }, []);

  const theme = useLocalStorage("theme", "get");

  return (
    <>
      <Dialog
        {...{ show, onHide }}
        header={`Test Details           Card No.: ${data?.cardno}`}
        visible={show}
        onHide={() => {
          onHide();
        }}
        draggable={false}
        className={theme}
        style={{ width: "1000px" }}
      >
        {loading ? (
          <Loading />
        ) : (
          <>
            <Tables>
              <thead className="cf">
                <tr>
                  <th>S.N.</th>
                  <th>Dependent </th>
                  <th>Test Code </th>
                  <th>Test Name</th>
                  <th>SelfDisc</th>
                  <th>DeptDisc</th>
                  <th>SelfFreeTestCount</th>
                  <th>DeptFreeTestCount</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((ele, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{ele?.deptname}</td>
                    <td>{ele?.TestCode}</td>
                    <td>{ele?.ItemName}</td>
                    <td>{ele?.SelfDisc}</td>
                    <td>{ele?.DependentDisc}</td>
                    <td>{ele?.SelfFreeTestCount}</td>
                    <td>{ele?.DependentFreeTestCount}</td>
                    {/* <td>{ele?.}</td> */}
                  </tr>
                ))}
              </tbody>
            </Tables>
            <div className="row mt-2">
              <div className="col-sm-2">
                <button
                  className="btn btn-block btn-danger btn-sm"
                  onClick={onHide}
                >
                  {t("Close")}
                </button>
              </div>
            </div>
          </>
        )}
      </Dialog>
    </>
  );
};

export default TestDetailViewModal;
