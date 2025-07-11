import React from "react";

function AutoComplete({ selects, test, handleListSearch, indexMatch }) {
  return (
    <div>
      {selects && (
        <ul className="suggestion-data">
          {test?.map((data, index) => (
            <li
              onClick={() => handleListSearch(data, "TestName")}
              className={`${index === indexMatch && "matchIndex"}`}
              key={index}
            >
              {data?.TestName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AutoComplete;
