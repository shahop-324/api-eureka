import React, { useState } from "react";
import { IconButton } from "@material-ui/core";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";

import "./../../Styles/root.scss";
import "./../../../../index.css";
import EventAlerts from "./helper/EventAlerts";
import GeneralAlerts from "./helper/GeneralAlerts";

const MainChatComponent = (props) => {
  const [selectedTab, setSelectedTab] = useState("event");

  return (
    <>
      <div>
        <div className="side-drawer-heading-and-close-row d-flex flex-row align-items-center justify-content-between mb-2">
          <div className="d-flex flex-column mb-3">
            <div className="event-platform-side-drawer-heading">Alerts</div>
            <div className="setting-tab-sub-text">
              Alerts from event organiser
            </div>
          </div>
          <div
            onClick={() => {
              props.resetSelectedTab();
              props.openAndCloseDrawer(false);
            }}
          >
            <IconButton aria-label="close-drawer">
              <CancelOutlinedIcon
                style={{ fontSize: "18", color: "#4D4D4D" }}
              />
            </IconButton>
          </div>
        </div>

        {(() => {
          switch (selectedTab) {
            case "event":
              return <EventAlerts />;

            default:
              return <div>This is side drawer alerts section.</div>;
          }
        })()}

        {/* here comes all and private chats conditionally */}
      </div>
    </>
  );
};

export default MainChatComponent;
