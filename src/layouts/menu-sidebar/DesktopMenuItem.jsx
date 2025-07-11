import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import SeeMorePages from "./SeeMorePages";

import { useTranslation } from "react-i18next";
const DesktopMenuItem = ({ pageData = [], menuData = [] }) => {
  const navigate = useNavigate();

  const [menu, setMenu] = useState([]);
  const [filterdMenu, setFilterdMenu] = useState([]);
  const [originalPageData, setOriginalPageData] = useState([]);

  useEffect(() => {
    setFilterdMenu(pageData ? pageData : []);
    setOriginalPageData(pageData ? pageData : []);
    const data = menuData?.map((ele) => {
      return {
        ...ele,
        selectedMenu: ele?.MenuID == 9999 ? true : false,
      };
    });
    setMenu(data ? data : []);
  }, [pageData]);
  // console.log(originalPageData)
  // console.log(pageData);
  // console.log(menuData);
  const filterMenu = (id) => {
    const data = menu?.filter((ele) => ele?.MenuID == id);
    setFilterdMenu(data[0]?.pageData);
    setOriginalPageData(data[0]?.pageData);
    const Menudata = menuData?.map((ele) => {
      return {
        ...ele,
        selectedMenu: ele?.MenuID == id ? true : false,
      };
    });
    if (menuRef?.current) {
      menuRef.current.scrollLeft = 0;
    }
    setMenu(Menudata);
  };

  const { t } = useTranslation();
  // console.log(menu);
  const containerRef = useRef(null);

  const menuRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = (event, ref) => {
      if (event.deltaY !== 0 && ref.current) {
        event.preventDefault();
        ref.current.scrollLeft += event.deltaY;
      }
    };

    const currentRef = containerRef.current;
    const menuRefs = menuRef.current;

    if (currentRef) {
      currentRef.addEventListener("wheel", (e) => handleScroll(e, currentRef));
    }
    if (menuRefs) {
      menuRefs.addEventListener("wheel", (e) => handleScroll(e, menuRefs));
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("wheel", handleScroll);
      }
      if (menuRefs) {
        menuRefs.removeEventListener("wheel", handleScroll);
      }
    };
  }, []);

  const handleChange = (event) => {
    const { value } = event.target;

   
      setFilterdMenu(
        originalPageData.filter((item) =>
          item?.PageName?.toLowerCase()?.includes(value.toLowerCase())
        )
      );
  
  };

  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -100, // Adjust scroll distance as needed
        behavior: "smooth", // Smooth scrolling
      });
    }
  };

  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 100, // Adjust scroll distance as needed
        behavior: "smooth", // Smooth scrolling
      });
    }
  };
  const handleScrollLeftMenu = () => {
    console.log(menuRef);
    if (menuRef.current) {
      menuRef.current.scrollBy({
        left: -100, // Adjust scroll distance as needed
        behavior: "smooth", // Smooth scrolling
      });
    }
  };

  const handleScrollRightMenu = () => {
    if (menuRef.current) {
      menuRef.current.scrollBy({
        left: 100, // Adjust scroll distance as needed
        behavior: "smooth", // Smooth scrolling
      });
    }
  };
  const menuItemRefs = useRef([]);
  useEffect(() => {
    const activeIndex = filterdMenu?.findIndex(
      (ele) => location.pathname.toLowerCase() === ele?.PageUrl.toLowerCase()
    );

    if (activeIndex !== -1 && menuItemRefs.current[activeIndex]) {
      const item = menuItemRefs.current[activeIndex];
      const container = item.parentElement; // Assuming the container is the parent of the menu items
      const offset = item.offsetLeft - container.offsetLeft;
      container.scrollLeft =
        offset - container.offsetWidth / 2 + item.offsetWidth / 2;
    }
  }, [location.pathname, filterdMenu]);

  // const checkMenu = () => {
  //   console.log(pageData,window.location.pathname)
  //   const check = pageData?.filter(ele =>  ele?.PageUrl?.toLowerCase() == window.location.pathname.toLowerCase()
  //   );
  //   console.log(check?.[0]?.MenuName);
  //   return check ? true : false;
  // };
  const getIconComponent = (menuname) => {
    const keywordIconMap = {
      Camp: "fa fa-ambulance",
      Report: "fa fa-newspaper",
      Collection: "fa fa-newspaper",
      Combine: "fa fa-newspaper",
      Membership: "pi pi-id-card",
      Doc: "fa fa-user-md",
    };

    for (let keyword in keywordIconMap) {
      if (menuname.includes(keyword)) {
        return keywordIconMap[keyword];
      }
    }

    const iconMap = {
      Laboratory: "fa fa-flask",
      Reports: "fa fa-hospital-o",
      Administrator: "fa fa-user",
      Master: "fa fa-wrench",
      Invoicing: "pi pi-wallet",
      DocAccount: "fa fa-user-md",
      CouponMaster: "pi pi-ticket",
      MembershipMaster: "pi pi-id-card",
      CustomerCare: "pi pi-home",
      "Online Payment": "pi pi-money-bill",
      Radiology: "fa fa-solid fa-people-arrows",
      Tools: "fa fa-solid fa-cog",
    };
    return iconMap[menuname] || "pi pi-bullseye";
  };
  return (
    <>
      <div className="menubar-main-container ss-none bg-color-container">
        <i
          className="pi pi-caret-left px-1 pointer mr-2 text-white leftRightMenu"
          onClick={handleScrollLeft}
        ></i>

        <div className="main-menu-container" ref={containerRef}>
          {menu.map((ele, key) => (
            <span
              key={ele?.MenuID}
              ref={(el) => (menuItemRefs.current[key] = el)}
              onClick={() => filterMenu(ele?.MenuID)}
              className={`nav-item mx-2 fw-normal ${
                ele?.selectedMenu ? "active-sub-menu-list-style" : ""
              } ${key % 2 === 0 ? "even-menu-item" : "odd-menu-item"}`}
            >
              <i className={getIconComponent(ele?.MenuName)}></i>{" "}
              {t(ele?.MenuName)}
            </span>
          ))}
        </div>
        <i
          className="pi pi-caret-right mr-2 px-1 pointer text-white leftRightMenu"
          onClick={handleScrollRight}
        ></i>
        <div className="search-container">
          <input
            className="search-menu-container"
            type="text"
            placeholder={t("Search Page")}
            onChange={handleChange}
          />
          <i className="fa fa-search"></i>
        </div>
      </div>
      <div className="desktop-sidebar">
        <i
          className="pi pi-chevron-circle-left px-1 pointer mr-1 text-black leftRightMenu"
          onClick={handleScrollLeftMenu}
        ></i>
        <SeeMorePages name="Page" pages={filterdMenu} />
        <div
          style={{ backgroundColor: "white", position: "sticky" }}
          className="w-100 mr-0"
        >
          <ul className="nav d-flex" ref={menuRef}>
            {filterdMenu?.map((ele, key) => (
              <li
                key={ele?.PageName}
                ref={(el) => (menuItemRefs.current[key] = el)}
                onClick={() => navigate(ele?.PageUrl)}
                style={{ padding: "3px 10px" }}
                className={`nav-item mx-1 ${
                  location.pathname.toLowerCase() === ele?.PageUrl.toLowerCase()
                    ? "active-tab-menu"
                    : "text-black"
                }`}
              >
                <NavLink>
                  <p style={{ whiteSpace: "nowrap", margin: "0px" }}>
                    <i className={`fas fa-tachometer-alt nav-icon mr-1`} />{" "}
                    {t(ele?.PageName)}
                  </p>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <i
          className="pi pi-chevron-circle-right ml-2  px-1 pointer text-black leftRightMenu"
          onClick={handleScrollRightMenu}
        ></i>
      </div>
    </>
  );
};

export default DesktopMenuItem;
