// import React, { useState } from "react";
// import { MultiSelect } from 'primereact/multiselect';

// const MultiSelectComp = (props) => {
//     const {respclass, dynamicOptions,value,handleChange} = props
//     const cities = [
//         { name: 'New York', code: 'NY' },
//         { name: 'Rome', code: 'RM' },
//         { name: 'London', code: 'LDN' },
//         { name: 'Istanbul', code: 'IST' },
//         { name: 'Paris', code: 'PRS' }
//     ];

//     return (
//         <div className={respclass}>
//             <MultiSelect filter value={value} onChange={handleChange} options={dynamicOptions?dynamicOptions:cities} optionLabel="name"
//                 placeholder="Select Cities" maxSelectedLabels={3} className={"multislect"} />
//         </div>
//     );
// }

// export default MultiSelectComp

import React from "react";
import { MultiSelect } from "primereact/multiselect";

const MultiSelectComp = (props) => {
  const {
    respclass,
    dynamicOptions,
    value,
    handleChange,
    name,
    placeholderName,
    requiredClassName
  } = props;
  const isMobile = window.innerWidth <= 768;
  // Default cities array
  const cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  // Map the dynamicOptions to the desired format
  // const mappedOptions = dynamicOptions ? dynamicOptions.map((item) => ({
  //     name: item.name,
  //     code: item.subCategoryID
  // })) : cities;
  const truncate = (str, maxLength) => {
    if (str?.length > maxLength) {
      return isMobile ? str : str?.substring(0, maxLength) + "...";
    }
    return str;
  };

  const itemTemplate = (option) => {
    return <div>{truncate(option.name, 20)}</div>;
  };

  return (
    <div className={respclass}>
      <div className="form-controls mb-2">
        <MultiSelect
          filter
          value={value}
          onChange={(e) => handleChange(name, e.value)}
          // onChange={handleChange}
          options={dynamicOptions}
          optionLabel="name"
          placeholder={placeholderName}
          maxSelectedLabels={3}
          className={`multiselect ${requiredClassName ? "required-fields" : ""} `}
          name={name}
          closeIcon
          itemTemplate={itemTemplate}
        />
      </div>
    </div>
  );
};

export default MultiSelectComp;
