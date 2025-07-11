import React, { useRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { getDepartment } from "../../utils/NetworkApi/commonApi";
import Accordion from "@app/components/UI/Accordion";
import Loading from "../../components/loader/Loading";
import Tables from "../../components/UI/customTable";
import ReactSelect from "../../components/formComponent/ReactSelect";

const ManageOrdering = () => {
  const { t } = useTranslation();
  const [Department, setDepartment] = useState([]);
  const [Investigation, setInvestigation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [invSequence, setSequence] = useState([]);
  const [dep, setDep] = useState("");
  const dragItem = useRef();
  const dragOverItem = useRef();
  const tableRef = useRef(); // Reference for the scrollable table container
  const [searchTest, setSearchTest] = useState("Department");

  const dragStart = (_, position) => {
    dragItem.current = position;
  };

  const dragEnter = (_, position) => {
    dragOverItem.current = position;
  };

  const autoScroll = (e) => {
    const container = tableRef.current;
    if (container) {
      const { clientY } = e;
      const { top, bottom } = container.getBoundingClientRect();

      const scrollStep = 5;
      if (clientY < top + 50) {
        container.scrollTop -= scrollStep; // Scroll up
      } else if (clientY > bottom - 50) {
        container.scrollTop += scrollStep; // Scroll down
      }
    }
  };

  const dropDep = (_) => {
    const copyListItems = [...Department];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setDepartment(copyListItems);
  };

  const dropInv = (_) => {
    const copyListItems = [...Investigation];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setInvestigation(copyListItems);
  };

  const updateHandler = () => {
    const data =
      searchTest === "Department"
        ? Department.map((ele, index) => ({
            PrintOrder: index + 1,
            DepartmentID: ele?.value,
            DepartmentName: ele?.label,
          }))
        : Investigation.map((ele, index) => ({
            DepartmentId: dep,
            printsequence: dep === "" ? index + 1 : invSequence[index],
            InvestigationID: ele?.InvestigationID,
            TestName: ele?.TestName,
          }));

    if (data?.length > 0) {
      const url =
        searchTest === "Department"
          ? "Department/UpdateDepartmentDataWithOrdering"
          : "Investigations/UpdateprintsequenceForTest";
      setLoading(true);
      axiosInstance
        .post(url, { Data: data })
        .then((res) => {
          toast.success(res?.data?.message);
          getDepartment(setDepartment, "getDepartmentEmployeeMaster", true);
          DepartmentWiseItemList("");
          setLoading(false);
          setDep("");
          setSequence([]);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "Something Went Wrong");
          setLoading(false);
        });
    } else {
      toast.error("Data Can't Be Blank");
    }
  };

  useEffect(() => {
    getDepartment(setDepartment, "getDepartmentEmployeeMaster", true);
    DepartmentWiseItemList("");
  }, []);

  const DepartmentWiseItemList = (id) => {
    axiosInstance
      .post("CommonController/DepartmentWiseItemList", {
        DepartmentID: id,
        TestName: "",
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => ({
          TestName: ele?.TestName,
          InvestigationID: ele?.InvestigationID,
          printsequence: ele?.printordering,
        }));
        const values = data.map((ele) => ele?.printordering);
        setSequence(values);
        setInvestigation(val);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Error Occurred");
      });
  };

  return (
    <>
      <Accordion
        name={t("Manage Ordering")}
        defaultValue={true}
        isBreadcrumb={true}
      >
        <div className="row pt-2 pl-2 pr-2">
          <div className="col-sm-1">
            <input
              type="radio"
              id="Department"
              name="type"
              value="Department"
              checked={searchTest === "Department"}
              onChange={(e) => {
                setSearchTest(e.target.value);
                getDepartment(
                  setDepartment,
                  "getDepartmentEmployeeMaster",
                  true
                );
                setDep("");
              }}
            />
            <label htmlFor="Department">{t("Department")}</label>
          </div>
          <div className="col-sm-1">
            <input
              type="radio"
              name="type"
              value="Investigation"
              id="Investigation"
              checked={searchTest === "Investigation"}
              onChange={(e) => {
                setSearchTest(e.target.value);
                DepartmentWiseItemList("");
                getDepartment(
                  setDepartment,
                  "getDepartmentEmployeeMaster",
                  true
                );
                setDep("");
              }}
            />
            <label htmlFor="Investigation">{t("Investigation")}</label>
          </div>
        </div>
      </Accordion>
      <Accordion title={t("Search Data")} defaultValue={true}>
        {loading ? (
          <Loading />
        ) : searchTest === "Department" ? (
          <div
            className="p-2 mb-2"
            style={{ maxHeight: "370px", overflowY: "auto" }}
            ref={tableRef}
            onDragOver={autoScroll}
          >
            <Tables>
              <thead>
                <tr>
                  <th>{t("Sequence")}</th>
                  <th>{t("Department ID")}</th>
                  <th>{t("Department Name")}</th>
                </tr>
              </thead>
              <tbody>
                {Department?.map((ele, index) => (
                  <tr
                    key={index}
                    draggable
                    onDragStart={(e) => dragStart(e, index)}
                    onDragEnter={(e) => dragEnter(e, index)}
                    onDragEnd={dropDep}
                    style={{ cursor: "move" }}
                  >
                    <td>{ele?.printOrder}</td>
                    <td>{ele?.value}</td>
                    <td>{ele?.label}</td>
                  </tr>
                ))}
              </tbody>
            </Tables>
          </div>
        ) : (
          <div>
            <div className="col-sm-3 mt-2">
              <ReactSelect
                placeholderName="Select Department"
                lable="Select Department"
                dynamicOptions={[
                  { label: "Select...", value: "" },
                  ...Department,
                ]}
                removeIsClearable={true}
                value={dep}
                onChange={(_, e) => {
                  setDep(e?.value);
                  DepartmentWiseItemList(e?.value);
                }}
              />
            </div>
            <div
              className="p-2 mb-2"
              ref={tableRef}
              onDragOver={autoScroll}
              style={{ maxHeight: "370px", overflowY: "auto" }}
            >
              <Tables>
                <thead>
                  <tr>
                    <th>{t("Sequence")}</th>
                    <th>{t("Investigation ID")}</th>
                    <th>{t("Investigation Name")}</th>
                  </tr>
                </thead>
                <tbody>
                  {Investigation?.map((ele, index) => (
                    <tr
                      key={index}
                      draggable
                      onDragStart={(e) => dragStart(e, index)}
                      onDragEnter={(e) => dragEnter(e, index)}
                      onDragEnd={dropInv}
                      style={{ cursor: "move" }}
                    >
                      <td>{ele?.printsequence}</td>
                      <td>{ele?.InvestigationID}</td>
                      <td>{ele?.TestName}</td>
                    </tr>
                  ))}
                </tbody>
              </Tables>
            </div>
          </div>
        )}
        <button
          className="btn btn-success btn-sm mb-2 ml-3 mt-1"
          onClick={updateHandler}
        >
          {t("Save Ordering")}
        </button>
      </Accordion>
    </>
  );
};

export default ManageOrdering;
