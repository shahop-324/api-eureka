import React, { useState } from "react";
import SessionHappeningRoot from "./SubComponents/SessionHappeningRoot";

const SessionStageSideBarRoot = () => {
  const [selectedTab, setSelectedTab] = useState("happening");

  return (
    <>
      <div
        className="session-sidebar-nav-primary px-1"
        style={{ maxWidth: "23vw" }}
      >
        <div
          onClick={() => {
            setSelectedTab("happening");
          }}
          className={`stage-nav-button-primary ${
            selectedTab === "happening" ? "sidebar-active-btn-stage" : ""
          }  py-3`}
        >
          Happenings
        </div>
        <div
          onClick={() => {
            setSelectedTab("people");
          }}
          className={`stage-nav-button-primary ${
            selectedTab === "people" ? "sidebar-active-btn-stage" : ""
          } py-3`}
        >
          People in session (2)
        </div>
      </div>

      {(() => {
        switch (selectedTab) {
          case "happening":
            return <SessionHappeningRoot />;

          case "people":
            return "This is session people section.";

          default:
            return <div>This is side drawer chat section.</div>;
        }
      })()}
    </>
  );
};

export default SessionStageSideBarRoot;
