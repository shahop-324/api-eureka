import React, { useState } from "react";
import { IconButton } from "@material-ui/core";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";

import "./../../Styles/root.scss";
import AllChatsComponent from "./helper/AllChatsComponent";
import "./../../../../index.css";

const MainChatComponent = (props) => {
  const [selectedTab, setSelectedTab] = useState("all");

  return (
    <>
      <div>
        <div className="side-drawer-heading-and-close-row d-flex flex-row align-items-center justify-content-between mb-2">
          <div className="event-platform-side-drawer-heading">Messages</div>

          <div
            onClick={() => {
              props.resetSelectedTab();
              props.setOpenDrawer(false);
            }}
          >
            <IconButton aria-label="close-drawer">
              <CancelOutlinedIcon
                style={{ fontSize: "18", color: "#4D4D4D" }}
              />
            </IconButton>
          </div>
        </div>

        <div className="slider-nav-event-platform d-flex flex-row justify-content-between align-items-center py-1 px-2 mb-3">
          <div
            onClick={() => {
              setSelectedTab("all");
            }}
            className={`slider-nav-btn ${
              selectedTab === "all" ? "slider-btn-active" : " "
            } d-flex flex-row align-items-center justify-content-center`}
          >
            All
          </div>
          <div
            onClick={() => {
              setSelectedTab("private");
            }}
            className={`slider-nav-btn ${
              selectedTab === "private" ? "slider-btn-active" : " "
            } d-flex flex-row align-items-center justify-content-center`}
          >
            Private
          </div>
        </div>

        {(() => {
          switch (selectedTab) {
            case "all":
              return <AllChatsComponent />;

            case "private":
              return "This is private chats section.";

            default:
              return <div>This is side drawer chat section.</div>;
          }
        })()}

        {/* here comes all and private chats conditionally */}
      </div>
    </>
  );
};

export default MainChatComponent;
