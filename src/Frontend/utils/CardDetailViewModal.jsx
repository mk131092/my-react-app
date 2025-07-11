import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import { Dialog } from "primereact/dialog";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";

const CardDetailViewModal = ({ data, show, onHide }) => {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  console.log(data);
  const getMemberShipCard = async (id) => {
    setLoading(true);
    await axiosInstance
      .post("MembershipCardIssue/GetCardDetail", {
        MemberShipId: id,
      })
      .then((res) => {
        if (res.status === 200) {
          setTableData(res.data.message);
          toast.success(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };
  useEffect(() => {
    getMemberShipCard(data);
  }, []);
  return (
    <>
      <Dialog
        {...{ show, onHide }}
        header={("Card Test Details")}
        visible={show}
        onHide={() => {
          onHide();
        }}
        draggable={false}
        className={theme}
        style={{ width: "1000px" }}
      >
        <div className="row">
          {loading ? (
            <Loading />
          ) : (
            <Tables>
              <thead>
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
          )}
        </div>
      </Dialog>
    </>
  );
};

export default CardDetailViewModal;
