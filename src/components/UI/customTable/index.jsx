import React, { useRef, useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
function Tables({
  children,
  style,
  tableHeight,
  scrollView,
}) {
  const tableRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollStartX, setScrollStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const handleMouseUp = () => setIsScrolling(false);

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only allow left mouse button
    setIsScrolling(true);
    setScrollStartX(e.pageX - tableRef.current.offsetLeft);
    setScrollLeft(tableRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isScrolling) return;
    const x = e.pageX - tableRef.current.offsetLeft;
    const walk = x - scrollStartX;
    tableRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      id="no-more-tables"
      style={{
        ...style,
        overflowX: "auto", 
        cursor: isScrolling ? "grabbing" : "grab", 
        // userSelect: "none",
        whiteSpace: "nowrap", 
        scrollbarWidth: "thin",
        scrollbarColor: "#a1c6db white", 
        borderRadius:"5px",
      }}
      // style={style}
      className={`${tableHeight} ${scrollView} custom-scrollbar TabScroll`}
      ref={tableRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <div className="row">
        <div className="col-12">
          <Table className="mainTable pt-2 pl-2 pr-2 pb-2" bordered>
            {children}
          </Table>
        </div>
      </div>
    </div>
  );
}

export default Tables;
