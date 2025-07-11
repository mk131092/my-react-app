import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";
const SeeMoreIconInTable = ({
  receiptData = [],
  index,
  getReceipt,
  getReceiptFullyPaid,
  setModal,
  setVisitID,
  setShowEmail,
  show3,
  show2,
  DesignationName,
}) => {
  const [show, setShow] = useState(false);
  
    const { t } = useTranslation();
  const actions = [
    {
      name: `Actions For ${receiptData?.LedgerTransactionNo}`,
      icon: "fa fa-book",
    },
    {
      name: "EditPatientDetails",
      icon: "fas fa-edit",
      functionality: () =>
        navigate(`/EditPatientDetails`, {
          state: { data: receiptData?.LedgerTransactionNo },
        }),
    },
    ...(receiptData?.CentreType == "B2B" && DesignationName == "B2B"
      ? []
      : [
          {
            name: "EditPatientInfo",
            icon: "fas fa-info-circle",
            functionality: () =>
              navigate(`/EditPatientInfo`, {
                state: { data: receiptData?.LedgerTransactionNo },
              }),
          },
        ]),
    ...(receiptData?.HideReceipt != 1
      ? [
          {
            name: "Cash Receipt",
            icon: "fas fa-file-invoice-dollar",
            functionality: () =>
              getReceipt(receiptData?.LedgertransactionIDHash, index),
          },
        ]
      : []),
    ...(receiptData?.HideReceipt != 1
      ? [
          {
            name: "FullyPaid Receipt",
            icon: "fas fa-file-invoice-dollar",
            functionality: () =>
              getReceiptFullyPaid(receiptData?.LedgertransactionIDHash, index),
          },
        ]
      : []),
    {
      name: "View Details",
      icon: "fa fa-search",
      functionality: () => {
        setModal(true);
        setVisitID(receiptData?.LedgerTransactionNo);
      },
    },
    {
      name: "Send Email",
      icon: "fas fa-envelope",
      functionality: () => {
        setShowEmail({
          modal: true,
          patientData: receiptData,
        });
      },
    },
    {
      name: "Upload Document",
      icon: "fas fa-cloud-upload-alt",
      functionality: () => {
        show2({
          modal: true,
          data: receiptData?.PatientGuid,
          index: index,
        });
      },
    },
    {
      name: "Medical History",
      icon: "fas fa-notes-medical",
      functionality: () => {
        show3({
          modal: true,
          data: receiptData?.PatientGuid,
          index: index,
        });
      },
    },
  ];
  const [filterData, setFilterData] = useState(actions);
  const [isOpenFromBottom, setIsOpenFromBottom] = useState(true);

  const cardRef = useRef(null);
  const buttonRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cardRef.current &&
        !cardRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleCard = () => {
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const spaceBelow = windowHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    if (spaceBelow > 250) {
      setIsOpenFromBottom(true);
    } else if (spaceAbove > 200) {
      setIsOpenFromBottom(false);
    }

    setShow(!show);
  };

  const handleSearch = (e) => {
    const { value } = e.target;
    const filterResponse = actions.filter((page) =>
      page?.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilterData(filterResponse);
  };

  useEffect(() => {
    if (show) {
      inputRef.current?.focus();
    }
  }, [show]);
  const navigate = useNavigate();
  useEffect(() => {
    setFilterData(filterData);
  }, [filterData, navigate]);

  const renderCard = () => {
    if (!show) return null;

    const buttonRect = buttonRef.current.getBoundingClientRect();

    let horizontalPosition;
    if (buttonRect.left > 150)
      horizontalPosition = `${buttonRect.left - 150 + buttonRect.width / 2}px`;
    else horizontalPosition = `${buttonRect.left}px`;

    return ReactDOM.createPortal(
      <div
        ref={cardRef}
        className="children-data"
        style={{
          position: "absolute",
          backgroundColor: "white",
          borderRadius: "5px",
          zIndex: 999,
          minWidth: "auto",
          maxWidth: "500px",
          maxHeight: "60%",
          overflow: "auto",
          border: "1px solid grey",
          left: horizontalPosition,
          top: isOpenFromBottom ? `${buttonRect.bottom + 5}px` : "auto",
          bottom: isOpenFromBottom
            ? "auto"
            : `${window.innerHeight - buttonRect.top + 5}px`,
          transition: "top 0.3s ease, bottom 0.3s ease, left 0.3s ease",
        }}
      >
        <div
          style={{ position: "sticky", top: 0, backgroundColor: "white" }}
          className="p-1"
        >
          <input
            type="text"
            placeholder="Search..."
            ref={inputRef}
            onChange={handleSearch}
            className="form-control"
          />
        </div>

        <div
          className="p-1"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr", // One column per row
            gap: "4px", // Spacing between rows
          }}
        >
          {filterData.map((action, actionIndex) => (
            <div
              key={actionIndex}
              style={{
                color: "black",
                padding: "1px",
                cursor: "pointer",
                margin: "1px",
              }}
              onClick={action?.functionality}
            >
              <i className={`${action.icon} nav-icon mr-2`} />
              {t(action.name)}
            </div>
          ))}
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div ref={buttonRef}>
      <div
        className="header"
        style={{ cursor: "pointer" }}
        onClick={handleToggleCard}
      >
        <span className="header" style={{ cursor: "pointer" }}>
          <svg
            width={17}
            height={17}
            viewBox="0 0 64 64"
            fill={"black"}
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="12"
              y="8"
              width="40"
              height="48"
              rx="4"
              ry="4"
              fill="#fff"
              stroke="#000"
              strokeWidth="2"
            />
            <rect
              x="24"
              y="4"
              width="16"
              height="8"
              rx="2"
              ry="2"
              fill="#f2c744"
              stroke="#000"
              strokeWidth="2"
            />
            <circle cx="18" cy="22" r="3" fill="#ff5f5f" />
            <rect x="26" y="20" width="20" height="2" rx="1" fill="#000" />
            <circle cx="18" cy="32" r="3" fill="#ff995f" />
            <rect x="26" y="30" width="20" height="2" rx="1" fill="#000" />
            <circle cx="18" cy="42" r="3" fill="#ffcf5f" />
            <rect x="26" y="40" width="20" height="2" rx="1" fill="#000" />
          </svg>
        </span>
      </div>

      {renderCard()}
    </div>
  );
};

export default SeeMoreIconInTable;
