import { useSelector } from "react-redux";

import DesktopMenuItem from "./DesktopMenuItem";

import { toggleSidebarMenu } from "@app/store/reducers/ui";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SelectBox } from "../../components/formComponent/SelectBox";
import { useDispatch } from "react-redux";
const MenuSidebar = ({ menuData, pageData }) => {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState({
    menuValue: menuData || [],
    pageData: pageData || [],
  });
  const screenSize = useSelector((state) => state.ui.screenSize);
  const sidebarSkin = useSelector((state) => state.ui.sidebarSkin);
  const getPageData = (value) => {
    const data = menuData?.filter((ele) => ele?.value == value);
    return data[0]?.pageData;
  };
  const handleChange = (e) => {
    const { value } = e.target;

    setSelectedMenu({
      menuValue: value,
      pageData: getPageData(value) ?? [],
    });
    setOriginalPageData(getPageData(value) ?? []);
  };
  const [originalPageData, setOriginalPageData] = useState(
    selectedMenu?.pageData
  );

  const dispatch = useDispatch();
  useEffect(() => {
    setSelectedMenu({
      menuValue: menuData || [],
      pageData: pageData || [],
    });
  }, [menuData, pageData]);
  const handleSearchPage = (value) => {
    if (!value) {
      setSelectedMenu({
        ...selectedMenu,
        pageData: originalPageData,
      });
      return;
    }
    const filteredPages = originalPageData?.filter((page) =>
      page?.PageName?.toLowerCase()?.includes(value?.toLowerCase())
    );

    setSelectedMenu({
      ...selectedMenu,
      pageData: filteredPages,
    });
  };
  return ["lg", "md"].includes(screenSize) ? (
    <DesktopMenuItem pageData={pageData} menuData={menuData} />
  ) : (
    <aside className={`main-sidebar sidebar_border ${sidebarSkin}`}>
      <div className="sidebar">
        <div className=" mt-3 bindrole col-sm-12">
          <SelectBox
            placeholderName=""
            id="MenuBar"
            options={menuData?.map((ele) => {
              return {
                label: ele?.label,
                value: ele?.value,
                pageData: ele?.pageData,
              };
            })}
            // searchable={true}
            name="MenuBar"
            // respclass="col-12"
            selectedValue={selectedMenu?.menuValue}
            onChange={handleChange}
          />
        </div>
        <div className=" bindrole">
          <div className="col-12">
            <input
              type="text"
              className="form-control search_Items"
              id="search"
              name="search"
              label=""
              onChange={(e) => handleSearchPage(e?.target?.value)}
              placeholder="Search"
              respclass="col-12"
            />
            <i className="fa fa-search search_icon" aria-hidden="true"></i>
          </div>
        </div>

        <nav className="mt-2">
          {selectedMenu?.pageData?.map((ele) => {
            return (
              <p
                className="sidebar-submenu"
                onClick={() => {
                  navigate(ele?.PageUrl);
                  dispatch(toggleSidebarMenu());
                }}
              >
                <i className="fa fa-bullseye" aria-hidden="true">
                  &nbsp;&nbsp;
                </i>
                {ele?.PageName}
              </p>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default MenuSidebar;
