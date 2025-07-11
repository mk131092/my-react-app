import React from "react";
import { useTranslation } from "react-i18next";
import Accordion from "@app/components/UI/Accordion";
import TestNameModal from "./TestNameModal";
import ResultEntryTableCustom from "../Laboratory/ResultEntryTableCustom";

const PackageSuggestion = ({
  title,
  data,
  testData,
  handleSuggestion,
  handleViewTestDetails,
  suggestionData,
  setSuggestionData,
  view,
}) => {
  const { t } = useTranslation();

  const handleClose2 = () => {
    setSuggestionData((ele) => ({
      ...ele,
      viewTestModal: false,
    }));
  };
  return (
    <>
      {suggestionData?.viewTestModal && (
        <TestNameModal
          show={suggestionData?.viewTestModal}
          onHandleShow={handleClose2}
          id={suggestionData?.viewTestModalId}
        />
      )}
      {data?.length > 0 && (
        <Accordion title={t(title)} defaultValue={true}>
          {view && (
            <div style={{ padding: "4px", transition: "padding 0.3s ease" }}>
              <ResultEntryTableCustom>
                <thead>
                  <tr>
                    <th className="text-center" style={{ width: "38px" }}>
                      {t("Select")}
                    </th>
                    <th className="text-center" style={{ width: "37px" }}>
                      {t("View")}
                    </th>
                    <th className="text-center" style={{ width: "60px" }}>
                      {t("Item Id")}
                    </th>
                    <th
                      style={{
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {t("Investigation Name")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.length > 0 &&
                    data
                      .filter(
                        (item, index, self) =>
                          index ===
                          self.findIndex(
                            (t) => t.InvestigationID === item.InvestigationID
                          )
                      )
                      .map((ele) => {
                        const check = testData.includes(ele.InvestigationID);
                        return (
                          <tr
                            key={ele.id}
                            style={{
                              background: `${check ? "rgb(186, 202, 247)" : "inherit"}`,
                              transition:
                                "background 0.3s ease, transform 0.3s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "scale(1.02)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "scale(1)";
                            }}
                          >
                            <td data-title="Select" className="text-center">
                              {ele?.PromotionalID &&
                              ele?.PromotionalID != "0" &&
                              ele?.Rate == null ? (
                                <i
                                  className="fa fa-ban"
                                  disabled={true}
                                  style={{
                                    cursor: "not-allowed",
                                    opacity: 0.6,
                                  }}
                                ></i>
                              ) : (
                                <i
                                  className="fa fa-plus-circle fa-sm"
                                  onClick={() => handleSuggestion(ele, title)}
                                ></i>
                              )}
                            </td>
                            <td data-title={t("View")} className="text-center">
                              <i
                                className="fa fa-search"
                                onClick={() => {
                                  handleViewTestDetails(ele?.InvestigationID);
                                }}
                                style={{
                                  cursor: "pointer",
                                  transition: "color 0.3s ease",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.color = "#007bff")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.color = "black")
                                }
                              />
                            </td>
                            <td
                              data-title="InvestigationID"
                              className="text-center"
                            >
                              {ele.InvestigationID}
                            </td>
                            <td
                              data-title="TestName"
                              style={{
                                wordWrap: "break-word",
                                whiteSpace: "normal",
                              }}
                            >
                              {ele.TestName}
                            </td>
                          </tr>
                        );
                      })}
                </tbody>
              </ResultEntryTableCustom>
            </div>
          )}
          {/* </div> */}
        </Accordion>
      )}
    </>
  );
};

export default PackageSuggestion;
