import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { Dialog } from "primereact/dialog";
import { useLocalStorage } from "../../utils/hooks/useLocalStorage";
import { SelectBoxWithCheckbox } from "../../components/formComponent/MultiSelectBox";
import { SelectBox } from "../../components/formComponent/SelectBox";
import Input from "../../components/formComponent/Input";
import { number } from "../../utils/helpers";

function RSadvanceFilter({
  show,
  handleShow,
  handleAdvSearch,
  data,
  handleFilterChange,
}) {
  const [TestSuggestion, setTestSuggestion] = useState([]);
  const getInvestigationList = () => {
    axiosInstance
      .get("Investigations/BindInvestigationList")
      .then((res) => {
        let data = res.data.message;

        let MapTest = data.map((ele) => {
          return {
            value: ele.InvestigationID,
            label: ele.TestName,
          };
        });

        setTestSuggestion(MapTest);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getInvestigationList();
  }, []);

  const handleSelectMultiChange = (select, name) => {
    const val = select?.map((ele) => ele?.value);
    let e = { target: { name: name, value: val } };
    return handleFilterChange(e);
  };
  
  const theme = useLocalStorage("theme", "get");
  return (
    <Dialog
      header={"Advance FIlter"}
      style={{width:"40%"}}
      visible={show}
      onHide={handleShow}
      className={theme}
    >
      <div className="">
        <div className="row">
          <label className="col-sm-4">Parameter Name</label>
          <div className="col-sm-8">
            <SelectBoxWithCheckbox
              options={TestSuggestion}
              value={data?.parameterId}
              name="parameterId"
              onChange={handleSelectMultiChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4"></div>
          <div className="col-sm-4">
            <SelectBox
              options={[
                { label: "Select", value: "" },
                { label: ">", value: ">" },
                { label: "<", value: "<" },
                { label: "=", value: "=" },
              ]}
              name={"valueCheck"}
              selectedValue={data?.valueCheck}
              onChange={handleFilterChange}
            />
          </div>
          <div className="col-sm-4">
            <Input
              className="select-input-box form-control input-sm"
              placeholder={"Enter Value to Search"}
              name={"valueToSearch"}
              value={data?.valueToSearch}
              onChange={handleFilterChange}
              onInput={(e) => number(e, 2)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4"></div>
          <div className="col-sm-4">
            <Input
              className="select-input-box form-control input-sm"
              placeholder={"Value Range From"}
              name={"valueRangeFrom"}
              value={data?.valueRangeFrom}
              onChange={handleFilterChange}
              onInput={(e) => number(e, 2)}
            />
          </div>
          <div className="col-sm-4">
            <Input
              className="select-input-box form-control input-sm"
              placeholder={"Value Range To"}
              name={"valueRangeTo"}
              value={data?.valueRangeTo}
              onChange={handleFilterChange}
              onInput={(e) => number(e, 4)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-4"></div>
          <div className="col-sm-2">
            <button
              type="button"
              className="btn btn-block btn-success btn-sm"
              onClick={handleAdvSearch}
            >
              Search
            </button>
          </div>
          <div className="col-sm-2">
            <button
              type="button"
              className="btn btn-block btn-danger btn-sm"
              onClick={handleShow}
            >
              Close
            </button>
          </div>
        </div>
        <div className="row">&nbsp;</div>
      </div>
    </Dialog>
  );
}

export default RSadvanceFilter;
