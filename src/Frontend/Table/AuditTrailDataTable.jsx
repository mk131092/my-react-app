import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { dateConfig } from "../../utils/helpers";
import Tables from "../../components/UI/customTable";
import Loading from "../../components/loader/Loading";
import RejectReasonModal from "../utils/RejectReasonModal";
function AuditTrailDataTable({ tableData, optionData }) {
  // i18n start
  const { t } = useTranslation();
  const [showRejectReason, setShowRejectReason] = useState({
    modal: false,
    data: "",
    index: -1,
  });

  return (
    <>
      {showRejectReason?.modal && (
        <RejectReasonModal
          show={showRejectReason?.modal}
          handleShow={() =>
            setShowRejectReason({ modal: false, data: "", index: -1 })
          }
          state={showRejectReason?.data}
          title={"RejectReason"}
        />
      )}
      {tableData.length > 0 ? (
        <div className="row px-2 mt-2">
          <div className="col-12">
            <Tables>
              <thead style={{ width: "auto" }}>
                <tr>
                  <th>{t("S.No")}</th>
                  <th>{t("Date")}</th>
                  <th>{t("Entry By")}</th>
                  <th>{t("Status")}</th>
                  <th>{t("Centre")}</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((data, index) => (
                  <tr key={index}>
                    <td data-title={t("S.No")}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          margin: "0",
                        }}
                      >
                        {index + 1}&nbsp;
                        <div key={index}>
                          {data?.ColorStatus === 4 && (
                            <i
                              className="fa fa-search mt-1"
                              onClick={() => {
                                setShowRejectReason({
                                  modal: true,
                                  data: data,
                                  index: index,
                                });
                              }}
                            ></i>
                          )}
                        </div>
                      </div>
                    </td>
                    <td data-title={t("Date")}>
                      {dateConfig(data.dtEntry)}&nbsp;
                    </td>
                    <td data-title={t("Entry By")}>
                      {data?.CreatedByName}&nbsp;
                    </td>
                    <td
                      data-title={t("Status")}
                      className={`${
                        data?.ColorStatus === 1
                          ? "color-Status-1"
                          : data?.ColorStatus === 2
                            ? "color-Status-2"
                            : data?.ColorStatus === 3
                              ? "color-Status-3"
                              : data?.ColorStatus === 4
                                ? "color-Status-4"
                                : data?.ColorStatus === 5
                                  ? "color-Status-5"
                                  : data?.ColorStatus === 10
                                    ? "color-Status-10"
                                    : data?.ColorStatus === 16
                                      ? "color-Status-16"
                                      : ""
                      }`}
                      style={{
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {data?.ItemName}&nbsp;
                    </td>
                    <td data-title={t("Center")}>{data?.Centre}&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </Tables>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default AuditTrailDataTable;
