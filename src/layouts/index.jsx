import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebarMenu } from "@app/store/reducers/ui";
import { addWindowClass, removeWindowClass } from "@app/utils/helpers";
import Header from "@app/layouts/header/Header";
import MenuSidebar from "@app/layouts/menu-sidebar/MenuSidebar";
import Footer from "@app/layouts/footer/Footer";

import { toast } from "react-toastify";
import { axiosInstance } from "../utils/axiosInstance";

import Loading from "../components/loader/Loading";
import NotificationContent from "./NotificationContent";
import moment from "moment";
import { useLocalStorage } from "../utils/hooks/useLocalStorage";

const Index = (props) => {
  const [menuData, setmenuData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [load, setLoad] = useState([]);
  const [downTimeData, setDownTimeData] = useState([]);
  const [notification, setNotification] = useState(true);
  const [downtimeMessage, setDowntimeMessage] = useState(false);
  const filtermenu = (menu, page) => {
    let resultData = [];
    const menuData = [...menu];
    const pageData = [...page];
    for (const item of menuData) {
      let subMenu = pageData.filter(
        (ele) =>
          ele.MenuName === item?.MenuName &&
          ele.MenuID === item?.MenuID &&
          ele.PageName !== "" &&
          ele.PageUrl !== ""
      );
      subMenu = subMenu.map((ele) => {
        return { ...ele, label: ele?.PageName, value: ele.PageID };
      });
      item.value = item?.MenuID;
      item.label = item?.MenuName;
      item.pageData = subMenu;
      resultData.push(item);
    }
    return resultData;
  };
  useEffect(() => {
    getPageData(setmenuData, setPageData);
  }, []);
  const SuperAdmin = useLocalStorage("userData", "get")?.SuperAdmin;

  const getPageData = (state, state2) => {
    setLoad(true);
    axiosInstance
      .get("Menu/MainMenuPageData")
      .then((res) => {
        let data = res?.data?.message;
        let finalData = filtermenu(data?.menuData, data?.pageData);
        const allPageData = finalData.flatMap((menu) => menu.pageData);
        const allMenu = {
          MenuID: 9999,
          MenuName: "All Menu",
          value: 9999,
          label: "All Menu",
          pageData: allPageData,
        };
        finalData.unshift(allMenu);
        state(finalData);
        if (res?.data?.message?.downTimeData?.length > 0) {
          if (
            moment(new Date()).format("YYYY-MM-DD") ==
              moment(
                new Date(res?.data?.message?.downTimeData[0]?.DownTimeDate)
              ).format("YYYY-MM-DD") &&
            ((res?.data?.message?.downTimeData[0]?.IsShowAlertToSuperAdmin ==
              1 &&
              SuperAdmin == 1) ||
              res?.data?.message?.downTimeData[0]?.IsShowAlertToAllEmployee ==
                1)
          ) {
            const downtime = res?.data?.message?.downTimeData?.map((ele) => {
              return {
                ...ele,
              };
            });
            const currentTime = moment().format("HH:mm:ss");

            const formattedFromTime = downtime[0]?.FromTime;
            const formattedToTime = downtime[0]?.ToTime;

            if (
              (formattedFromTime <= formattedToTime &&
                currentTime >= formattedFromTime &&
                currentTime <= formattedToTime) ||
              (formattedFromTime > formattedToTime &&
                (currentTime >= formattedFromTime ||
                  currentTime <= formattedToTime))
            ) {
              setDownTimeData(downtime);
              setDowntimeMessage(true);
            } else {
              setDowntimeMessage(false);
            }
          }
        }

        state2(finalData[0].pageData);
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  const dispatch = useDispatch();
  const menuSidebarCollapsed = useSelector(
    (state) => state.ui.menuSidebarCollapsed
  );
  const controlSidebarCollapsed = useSelector(
    (state) => state.ui.controlSidebarCollapsed
  );
  const screenSize = useSelector((state) => state.ui.screenSize);

  const handleToggleMenuSidebar = () => {
    dispatch(toggleSidebarMenu());
  };

  useEffect(() => {
    removeWindowClass("register-page");
    removeWindowClass("login-page");
    removeWindowClass("hold-transition");
  }, []);

  useEffect(() => {
    removeWindowClass("sidebar-closed");
    removeWindowClass("sidebar-collapse");
    removeWindowClass("sidebar-open");
    if (menuSidebarCollapsed && screenSize === "lg") {
      addWindowClass("sidebar-collapse");
    } else if (menuSidebarCollapsed && screenSize === "xs") {
      addWindowClass("sidebar-open");
    } else if (menuSidebarCollapsed && screenSize === "sm") {
      addWindowClass("sidebar-open");
    } else if (!menuSidebarCollapsed && screenSize !== "lg") {
      addWindowClass("sidebar-closed");
      addWindowClass("sidebar-collapse");
    }
  }, [screenSize, menuSidebarCollapsed]);

  useEffect(() => {
    if (controlSidebarCollapsed) {
      removeWindowClass("control-sidebar-slide-open");
    } else {
      addWindowClass("control-sidebar-slide-open");
    }
  }, [screenSize, controlSidebarCollapsed]);
  const handlePage = (e) => {
    setPageData(e);
  };

  const User = localStorage.getItem("User") ? true : false;

  return (
    <div className="wrapper">
      {" "}
      <>
        {!User && (
          <>
            {notification && (
              <>
                <div className="text-notification">
                  <span>
                    <NotificationContent setNotification={setNotification} />
                  </span>
                  <i
                    className="pi pi-times"
                    onClick={() => setNotification(false)}
                  ></i>
                </div>
              </>
            )}
            {downtimeMessage && (
              <>
                <div className="text-notification">
                  <span style={{ color: "red" }}>
                    ⚠️ **Alert:** There is a scheduled downtime between **
                    {downTimeData[0]?.FromTime} - {downTimeData[0]?.ToTime}**.
                    Please avoid using the system during this time.
                  </span>
                  <i
                    className="pi pi-times"
                    onClick={() => setDowntimeMessage(false)}
                  ></i>
                </div>
              </>
            )}
          </>
        )}
        {!User && (
          <div id="main-header">
            <div className="header-fixed">
              <Header menuData={menuData} handlePage={handlePage} />
            </div>

            <MenuSidebar menuData={menuData} pageData={pageData} />
          </div>
        )}
        {load ? (
          <Loading />
        ) : (
          <div className="p-1 content-wrapper" id="page-data">
            {props.children}
          </div>
        )}

        <Footer />
        <div
          id="sidebar-overlay"
          role="presentation"
          onClick={handleToggleMenuSidebar}
          onKeyDown={() => {}}
        />
      </>
    </div>
  );
};

export default Index;
