import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import Accordion from "@app/components/UI/Accordion";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";
import Input from "../../components/formComponent/Input";
import { number } from "../../utils/helpers";

const MembershipCardItemMapping = () => {
  const [isFirst, setIsFirst] = useState(false);
  const [Memberships, setMemberships] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [tabledata, setTableData] = useState([]);
  const [payload, setPayload] = useState({
    MembershipId: "",
    DepartmentID: "",
  });
  const [details, setDetails] = useState({
    SELF: "",
    DEP: "",
    SelfFreeTest: "",
    DependentFreeTest: "",
  });

  const [load, setload] = useState({
    search: false,
    save: false,
  });
  const { t } = useTranslation();

  const getDepartment = () => {
    axiosInstance
      .get(`Department/getDepartment`)
      .then((res) => {
        let data = res.data.message;
        let Department = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        Department.unshift({ label: "Department", value: "" });
        setDepartment(Department);
      })
      .catch((err) => console.log(err));
  };

  const fetchMemberships = () => {
    axiosInstance
      .get(`MembershipCardMaster/BindMembership`)
      .then((res) => {
        let data = res.data.message;
        let Department = data.map((ele) => {
          return {
            value: ele.Id,
            label: ele.Name,
          };
        });
        setMemberships(Department);
      })
      .catch((err) => console.log(err));
  };
  const handleSubmit = (memID, depID) => {
    console.log("memID", memID, "depID", depID);
    setload({ ...load, search: true });

    if (
      (payload?.DepartmentID !== "" && payload?.MembershipId !== "") ||
      memID ||
      depID
    ) {
      axiosInstance
        .post("MembershipCardMaster/GetTestData", {
          MemberShipId: memID ?? payload?.MembershipId,
          DepartmentId: depID ?? payload?.DepartmentID,
        })
        .then((res) => {
          const data = res?.data?.message.map((item) => {
            return {
              TestCODE: item?.TestCode,
              TESTNAME: item?.TestName,
              TestId: item?.ItemId,
              SELF: item?.SelfDisc,
              DEP: item?.DependentDisc,
              SELFTESTCOUNT: item?.SelfFreeTestCount,
              DEPTESTCOUNT: item?.DependentFreeTestCount,
              DependentFreeTest: item?.DependentFreeTest,
              SelfFreeTest: item?.SelfFreeTest,
              SubcategoryID: item?.DepartmentId,
            };
          });
          setDetails({
            SELF: "",
            DEP: "",
            SelfFreeTest: "",
            DependentFreeTest: "",
          });
          setload({ ...load, search: false });
          setTableData(data);
        })
        .catch((err) => {
          setload({ ...load, search: false });
          toast.error(err?.response?.data?.message);
        });
    } else {
      toast.error("Please select required feild");
      setload({ ...load, search: false });
    }
  };

  function checkArray(array) {
    for (let obj of array) {
      if (Object.keys(obj).length !== 4) {
        return false;
      }
      for (let key in obj) {
        if (obj[key] !== "") {
          return false;
        }
      }
    }
    return true;
  }
  const handleSave = () => {
    const checkedArray = tabledata.map((item) => {
      return {
        SelfDisc: item?.SELF ? item?.SELF : "",
        DependentDisc: item?.DEP ? item?.DEP : "",
        SelfFreeTestCount: item?.SELFTESTCOUNT,
        DependentFreeTestCount: item?.DEPTESTCOUNT,
      };
    });
    const checktbdata = checkArray(checkedArray);
    console.log(checkedArray, checktbdata);
    const obj = {
      MappingDetail: tabledata.map((item) => {
        return {
          SubcategoryId: item?.SubcategoryID,
          ItemId: item?.TestId,
          SelfDisc: item?.SELF ? item?.SELF : "",
          DependentDisc: item?.DEP ? item?.DEP : "",
          SelfFreeTestCount: 0,
          DependentFreeTestCount: 0,
          SelfFreeTest: item?.SelfFreeTest,
          DependentFreeTest: item?.DependentFreeTest,
        };
      }),
      MembershipCardId: payload?.MembershipId,
    };
    setload({ ...load, save: true });
    if (!checktbdata) {
      axiosInstance
        .post("MembershipCardMaster/SaveMappingData", obj)
        .then((res) => {
          toast.success(res?.data?.message);
          setload({ ...load, save: false });
          setTableData([]);
          setDetails({
            SELF: "",
            DEP: "",
            SelfFreeTest: "",
            DependentFreeTest: "",
          });
          handleSubmit();
        })
        .catch((err) => {
          setload({ ...load, save: false });
          toast.error(err?.response?.data?.message);
        });
    } else {
      setload({ ...load, save: false });
      toast.error("Give any discount to proceed");
    }
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setTableData([]);
    setDetails({
      SELF: "",
      DEP: "",
      SelfFreeTest: "",
      DependentFreeTest: "",
    });
    setPayload({ ...payload, [name]: value });
    name === "DepartmentID" &&
      payload?.MembershipId !== "" &&
      handleSubmit(null, value);
    name === "MembershipId" &&
      payload?.DepartmentID !== "" &&
      handleSubmit(value, null);
  };

  const handleChangeMain = (e, index) => {
    const { value, name, checked, type } = e.target;

    if (index >= 0) {
      if (name === "SELF" || name === "DEP") {
        if (value <= 100) {
          const data = [...tabledata];
          data[index][name] = value;
          setTableData(data);
        }
      } else {
        const data = [...tabledata];
        data[index][name] = value;
        setTableData(data);
      }
    } else {
      if (name === "SELF" || name === "DEP") {
        if (value <= 100) {
          setDetails({ ...details, [name]: value });
          const updatedTableData = tabledata.map((ele) => ({
            ...ele,
            [name]: value,
          }));
          setTableData(updatedTableData);
        }
      } else {
        console.log(value, value);
        setDetails({ ...details, [name]: value });
        const updatedTableData = tabledata.map((ele) => ({
          ...ele,
          [name]: value,
        }));
        setTableData(updatedTableData);
      }
    }
  };

  useEffect(() => {
    fetchMemberships();
    getDepartment();
  }, []);
  return (
    <>
      <Accordion
        name={t("Membership Item Mapping")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row pt-2 pl-2 pr-2 mt-1">
          <div className=" col-sm-2">
            <SelectBox
              options={[
                { label: "Select Membership", value: "" },
                ...Memberships,
              ]}
              name="MembershipId"
              id="MembershipId"
              className="required-fields"
              placeholder=""
              selectedValue={payload?.MembershipId}
              onChange={handleSelectChange}
              lable={t("Membership Card")}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={Department}
              name="DepartmentID"
              label="Department"
              className="required-fields"
              placeholder=""
              selectedValue={payload?.DepartmentID}
              onChange={handleSelectChange}
              lable={t("Department List")}
            />
          </div>
          <div className="col-sm-1">
            {!load.search && (
              <button
                className="btn btn-primary btn-sm btn-block"
                onClick={() => handleSubmit(null, null)}
              >
                {t("Search")}
              </button>
            )}
            {load.search && <Loading />}
          </div>
        </div>
      </Accordion>
      <Accordion title={t("Search Data")} defaultValue={true}>
        {tabledata.length > 0 && (
          <>
            <Tables>
              <thead>
                <tr>
                  <th>{t("S.No")}</th>
                  <th>{t("Test Code")}</th>
                  <th>{t("Test Name")}</th>
                  <th>
                    {t("Self Discount %")}
                    <br></br>
                    <Input
                      id="DaysInput"
                      type="number"
                      name="SELF"
                      onChange={(e) => handleChangeMain(e, -1)}
                      value={details?.SELF}
                      onInput={(e) => number(e, 3, 100)}
                    />
                  </th>
                  <th>
                    {t("Dependent Discount%")}
                    <br></br>
                    <Input
                      id="DaysInput"
                      type="number"
                      name="DEP"
                      onChange={(e) => handleChangeMain(e, -1)}
                      value={details?.DEP}
                      onInput={(e) => number(e, 3, Number(details?.SELF))}
                    />
                  </th>
                  <th>
                    {t("Self Free Test Count")}
                    <br></br>
                    <Input
                      id="DaysInput"
                      type="number"
                      name="SelfFreeTest"
                      onChange={(e) => handleChangeMain(e, -1)}
                      value={details?.SelfFreeTest}
                      onInput={(e) => number(e, 2)}
                    />
                  </th>
                  <th>
                    {t("Dependent Free Test Count")}
                    <br></br>
                    <Input
                      id="DaysInput"
                      type="number"
                      name="DependentFreeTest"
                      onChange={(e) => handleChangeMain(e, -1)}
                      value={details?.DependentFreeTest}
                      onInput={(e) =>
                        number(e, 2, Number(details?.SelfFreeTest))
                      }
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {tabledata?.map((data, index) => (
                  <tr key={index}>
                    <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                    <td data-title={t("Test Code")}>{data?.TestCODE}&nbsp;</td>
                    <td data-title={t("Test Name")}>{data?.TESTNAME}&nbsp;</td>
                    <td data-title={t("Base Rate")}>
                      <Input
                        type="number"
                        name="SELF"
                        value={data?.SELF}
                        min={"0"}
                        onChange={(e) => handleChangeMain(e, index)}
                        onInput={(e) => number(e, 3, 100)}
                      />
                    </td>
                    <td data-title={t("Max Rate")}>
                      <Input
                        type="number"
                        name="DEP"
                        value={data?.DEP}
                        min={"0"}
                        onInput={(e) => number(e, 3, Number(data?.SELF))}
                        onChange={(e) => handleChangeMain(e, index)}
                      />
                    </td>
                    <td data-title={t("Base Rate")}>
                      <Input
                        type="number"
                        name="SelfFreeTest"
                        value={data?.SelfFreeTest}
                        min={"0"}
                        onInput={(e) => number(e, 2)}
                        onChange={(e) => handleChangeMain(e, index)}
                      />
                    </td>
                    <td data-title={t("Max Rate")}>
                      <Input
                        type="number"
                        name="DependentFreeTest"
                        value={data?.DependentFreeTest}
                        min={"0"}
                        onInput={(e) =>
                          number(e, 2, Number(data?.SelfFreeTest))
                        }
                        onChange={(e) => handleChangeMain(e, index)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Tables>
            <div className="col-sm-2     mt-2 mb-2">
              {!load.save && (
                <button
                  className="btn btn-success btn-sm btn-block"
                  onClick={handleSave}
                >
                  {t("Save")}
                </button>
              )}
              {load.save && <Loading />}
            </div>
          </>
        )}
      </Accordion>
    </>
  );
};

export default MembershipCardItemMapping;
