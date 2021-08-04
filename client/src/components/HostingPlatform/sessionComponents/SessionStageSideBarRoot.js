import React, { useState } from "react";

const SessionStageSideBarRoot = () => {
  const [selectedTab, setSelectedTab] = useState("all");

  return (
    <>
      <div
        className="session-sidebar-nav-primary px-1"
        style={{ maxWidth: "23vw" }}
      >
        <div className="stage-nav-button-primary sidebar-active-btn-stage  py-3">
          Happenings
        </div>
        <div className="stage-nav-button-primary py-3">
          People in session (2)
        </div>
      </div>

      <div className="session-stage-side-main-body">
        <div className="session-happenings-sec-nav">
          <div className="slider-nav-event-platform session-stage-sec-nav-wrapper d-flex flex-row justify-content-between align-items-center py-1 px-2 mb-3 my-2">
            <div
              onClick={() => {
                setSelectedTab("all");
              }}
              className={`slider-nav-btn silde-nav-btn-stage ${
                selectedTab === "all" ? "slider-btn-active-stage" : " "
              } d-flex flex-row align-items-center justify-content-center`}
            >
              Chats
            </div>
            <div
              onClick={() => {
                setSelectedTab("q&a");
              }}
              className={`slider-nav-btn silde-nav-btn-stage mx-2 ${
                selectedTab === "q&a" ? "slider-btn-active-stage" : " "
              } d-flex flex-row align-items-center justify-content-center`}
            >
              Q & A
            </div>
            <div
              onClick={() => {
                setSelectedTab("polls");
              }}
              className={`slider-nav-btn silde-nav-btn-stage ${
                selectedTab === "polls" ? "slider-btn-active-stage" : " "
              } d-flex flex-row align-items-center justify-content-center`}
            >
              Polls
            </div>
            <div
              onClick={() => {
                setSelectedTab("raisedhands");
              }}
              className={`slider-nav-btn silde-nav-btn-stage mx-2 ${
                selectedTab === "raisedhands" ? "slider-btn-active-stage" : " "
              } d-flex flex-row align-items-center justify-content-center`}
            >
              Hands
            </div>
            <div
              onClick={() => {
                setSelectedTab("video");
              }}
              className={`slider-nav-btn silde-nav-btn-stage ${
                selectedTab === "video" ? "slider-btn-active" : " "
              } d-flex flex-row align-items-center justify-content-center`}
            >
              Video
            </div>
          </div>
        </div>

        <div className="session-stage-main-content-section">
          {/* <MainChatComponent /> */}
        </div>
      </div>
    </>
  );
};

export default SessionStageSideBarRoot;