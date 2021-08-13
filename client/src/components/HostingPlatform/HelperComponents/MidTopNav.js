import React from "react";
import "./../Styles/root.scss";

import RightContent from "./RightContent";

const MidTopNav = ({eventName}) => {
  return (
    <>
      <div className="mid-top-nav ps-3 py-2 d-flex flex-row justify-content-between align-items-center">
        <div className="event-name-l2">{eventName}</div>
        <div className="d-flex flex-row">
          <RightContent />
        </div>
      </div>
    </>
  );
};

export default MidTopNav;
