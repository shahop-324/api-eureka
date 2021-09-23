import React, { useState } from "react";
import "./../Styles/root.scss";

import GroupIcon from "@material-ui/icons/Group";

import DashboardIcon from "@material-ui/icons/Dashboard";


import AssessmentIcon from "@material-ui/icons/Assessment";
import SecurityIcon from "@material-ui/icons/Security";
import SettingsRoundedIcon from "@material-ui/icons/SettingsRounded";

import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import NotificationsRoundedIcon from "@material-ui/icons/NotificationsRounded";

import MainChatComponent from "../SideDrawerComponents/Chat/MainChatComponent";
import MainPeopleComponent from "../SideDrawerComponents/People/MainPeopleComponent";
import AlertMainComponent from "../SideDrawerComponents/Alerts/AlertsMainComponent";
import PollsMainComponent from "../SideDrawerComponents/Polls/PollsMainComponent";
import ModerationMainComponent from "../SideDrawerComponents/Moderation/ModerationMainComponent";
import SettingsDrawer from "./SettingsDrawer";
import styled from 'styled-components';

const DrawerBackground = styled.div`
background-color: #ffffff;
`

const RightContent = () => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const [openSettings, setOpenSettings] = useState(false);

  const [selectedTab, setSelectedTab] = useState("");

  const resetSelectedTab = () => {
    setSelectedTab("");
  };

  const handleOpenSettings = () => {
    setOpenSettings(true);
  }

  const handleCloseSettings = () => {
    setOpenSettings(false);
  }

  return (
    <>
      <div>
        <div className="right-top-nav-h d-flex flex-row justify-content-between align-items-center py-3 px-4">
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center me-3 pe-3"
            onClick={() => {
              // setSelectedTab("feed");
              // setOpenDrawer(true);
              handleOpenSettings();
            }}
            style={{ borderRight: "1px solid #D3D2D2" }}
          >
            <div
              className={`icon-wrapper ${
                selectedTab === "feed" ? "active-wrapper-h" : " "
              } py-2 px-3 mb-1`}
            >
              <SettingsRoundedIcon
                className={`icon-btn-h ${
                  selectedTab === "feed" ? "icon-btn-active-h" : " "
                }`}
                style={{ fontSize: "19" }}
              />
            </div>
            <div
              className={`icon-btn-text ${
                selectedTab === "feed" ? "icon-btn-text-active-h" : " "
              }`}
            >
              Settings
            </div>
          </div>
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center me-3"
            onClick={() => {
              setSelectedTab("feed");
              setOpenDrawer(true);
            }}
          >
            <div
              className={`icon-wrapper ${
                selectedTab === "feed" ? "active-wrapper-h" : " "
              } py-2 px-3 mb-1`}
            >
              <DashboardIcon
                className={`icon-btn-h ${
                  selectedTab === "feed" ? "icon-btn-active-h" : " "
                }`}
                style={{ fontSize: "19" }}
              />
            </div>
            <div
              className={`icon-btn-text ${
                selectedTab === "feed" ? "icon-btn-text-active-h" : " "
              }`}
            >
              Feed
            </div>
          </div>

          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center me-3"
            onClick={() => {
              setSelectedTab("people");
              setOpenDrawer(true);
            }}
          >
            <div
              className={`icon-wrapper ${
                selectedTab === "people" ? "active-wrapper-h" : " "
              } py-2 px-3 mb-1`}
            >
              <GroupIcon
                className={`icon-btn-h ${
                  selectedTab === "people" ? "icon-btn-active-h" : " "
                }`}
                style={{ fontSize: "19" }}
              />
            </div>
            <div
              className={`icon-btn-text ${
                selectedTab === "people" ? "icon-btn-text-active-h" : " "
              }`}
            >
              People
            </div>
          </div>

          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center me-3"
            onClick={() => {
              setSelectedTab("alerts");
              setOpenDrawer(true);
            }}
          >
            <div
              className={`icon-wrapper ${
                selectedTab === "alerts" ? "active-wrapper-h" : " "
              } py-2 px-3 mb-1`}
            >
              <NotificationsRoundedIcon
                className={`icon-btn-h ${
                  selectedTab === "alerts" ? "icon-btn-active-h" : " "
                }`}
                style={{ fontSize: "19" }}
              />
            </div>
            <div
              className={`icon-btn-text ${
                selectedTab === "alerts" ? "icon-btn-text-active-h" : " "
              }`}
            >
              Alerts
            </div>
          </div>

          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center me-3"
            onClick={() => {
              setSelectedTab("polls");
              setOpenDrawer(true);
            }}
          >
            <div
              className={`icon-wrapper ${
                selectedTab === "polls" ? "active-wrapper-h" : " "
              } py-2 px-3 mb-1`}
            >
              <AssessmentIcon
                className={`icon-btn-h ${
                  selectedTab === "polls" ? "icon-btn-active-h" : " "
                }`}
                style={{ fontSize: "19" }}
              />
            </div>
            <div
              className={`icon-btn-text ${
                selectedTab === "polls" ? "icon-btn-text-active-h" : " "
              }`}
            >
              Polls
            </div>
          </div>

          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center"
            onClick={() => {
              setSelectedTab("moderation");
              setOpenDrawer(true);
            }}
          >
            <div
              className={`icon-wrapper ${
                selectedTab === "moderation" ? "active-wrapper-h" : " "
              } py-2 px-3 mb-1`}
            >
              <SecurityIcon
                className={`icon-btn-h ${
                  selectedTab === "moderation" ? "icon-btn-active-h" : " "
                }`}
                style={{ fontSize: "19" }}
              />
            </div>
            <div
              className={`icon-btn-text ${
                selectedTab === "moderation" ? "icon-btn-text-active-h" : " "
              }`}
            >
              Moderation
            </div>
          </div>
        </div>
      </div>

      <React.Fragment key="right">
        {/* <Button onClick={toggleDrawer(right, true)}>{right}</Button> */}
        <SwipeableDrawer
        onOpen={() => {
          console.log("Side nav was opended")
        }}
        onClose={() => {
          console.log("Side nav was closed")
        }}
          anchor="right"
          open={openDrawer}
          disableBackdropTransition={true}
        >
          <DrawerBackground className="event-platform-right-drawer px-4 py-1">
            <div className="right-top-nav-h d-flex flex-row justify-content-between align-items-center py-3">
              <div
                className="icon-btn-lobby-wrapper d-flex flex-column align-items-center me-3"
                onClick={() => {
                  setSelectedTab("feed");
                  setOpenDrawer(true);
                }}
              >
                <div
                  className={`icon-wrapper ${
                    selectedTab === "feed" ? "active-wrapper-h" : " "
                  } py-2 px-3 mb-1`}
                >
                  <DashboardIcon
                    className={`icon-btn-h ${
                      selectedTab === "feed" ? "icon-btn-active-h" : " "
                    }`}
                    style={{ fontSize: "19" }}
                  />
                </div>
                <div
                  className={`icon-btn-text ${
                    selectedTab === "feed" ? "icon-btn-text-active-h" : " "
                  }`}
                >
                  Feed
                </div>
              </div>

              <div
                className="icon-btn-lobby-wrapper d-flex flex-column align-items-center me-3"
                onClick={() => {
                  setSelectedTab("people");
                  setOpenDrawer(true);
                }}
              >
                <div
                  className={`icon-wrapper ${
                    selectedTab === "people" ? "active-wrapper-h" : " "
                  } py-2 px-3 mb-1`}
                >
                  <GroupIcon
                    className={`icon-btn-h ${
                      selectedTab === "people" ? "icon-btn-active-h" : " "
                    }`}
                    style={{ fontSize: "19" }}
                  />
                </div>
                <div
                  className={`icon-btn-text ${
                    selectedTab === "people" ? "icon-btn-text-active-h" : " "
                  }`}
                >
                  People
                </div>
              </div>

              <div
                className="icon-btn-lobby-wrapper d-flex flex-column align-items-center me-3"
                onClick={() => {
                  setSelectedTab("alerts");
                  setOpenDrawer(true);
                }}
              >
                <div
                  className={`icon-wrapper ${
                    selectedTab === "alerts" ? "active-wrapper-h" : " "
                  } py-2 px-3 mb-1`}
                >
                  <NotificationsRoundedIcon
                    className={`icon-btn-h ${
                      selectedTab === "alerts" ? "icon-btn-active-h" : " "
                    }`}
                    style={{ fontSize: "19" }}
                  />
                </div>
                <div
                  className={`icon-btn-text ${
                    selectedTab === "alerts" ? "icon-btn-text-active-h" : " "
                  }`}
                >
                  Alerts
                </div>
              </div>

              <div
                className="icon-btn-lobby-wrapper d-flex flex-column align-items-center me-3"
                onClick={() => {
                  setSelectedTab("polls");
                  setOpenDrawer(true);
                }}
              >
                <div
                  className={`icon-wrapper ${
                    selectedTab === "polls" ? "active-wrapper-h" : " "
                  } py-2 px-3 mb-1`}
                >
                  <AssessmentIcon
                    className={`icon-btn-h ${
                      selectedTab === "polls" ? "icon-btn-active-h" : " "
                    }`}
                    style={{ fontSize: "19" }}
                  />
                </div>
                <div
                  className={`icon-btn-text ${
                    selectedTab === "polls" ? "icon-btn-text-active-h" : " "
                  }`}
                >
                  Polls
                </div>
              </div>

              <div
                className="icon-btn-lobby-wrapper d-flex flex-column align-items-center"
                onClick={() => {
                  setSelectedTab("moderation");
                  setOpenDrawer(true);
                }}
              >
                <div
                  className={`icon-wrapper ${
                    selectedTab === "moderation" ? "active-wrapper-h" : " "
                  } py-2 px-3 mb-1`}
                >
                  <SecurityIcon
                    className={`icon-btn-h ${
                      selectedTab === "moderation" ? "icon-btn-active-h" : " "
                    }`}
                    style={{ fontSize: "19" }}
                  />
                </div>
                <div
                  className={`icon-btn-text ${
                    selectedTab === "moderation"
                      ? "icon-btn-text-active-h"
                      : " "
                  }`}
                >
                  Moderation
                </div>
              </div>
            </div>

            <div className="my-3">
              <hr />
            </div>
            {/* Here Main Components will be rendered conditionally based on currently selected tab */}

            {(() => {
              switch (selectedTab) {
                case "feed":
                  return (
                    <MainChatComponent
                      setOpenDrawer={setOpenDrawer}
                      resetSelectedTab={resetSelectedTab}
                    />
                  );

                case "people":
                  return (
                    <MainPeopleComponent
                      setOpenDrawer={setOpenDrawer}
                      resetSelectedTab={resetSelectedTab}
                    />
                  );

                case "alerts":
                  return (
                    <AlertMainComponent
                      setOpenDrawer={setOpenDrawer}
                      resetSelectedTab={resetSelectedTab}
                    />
                  );

                case "polls":
                  return (
                    <PollsMainComponent
                      setOpenDrawer={setOpenDrawer}
                      resetSelectedTab={resetSelectedTab}
                    />
                  );

                case "moderation":
                  return (
                    <ModerationMainComponent
                      setOpenDrawer={setOpenDrawer}
                      resetSelectedTab={resetSelectedTab}
                    />
                  );

                default:
                  return <div>You are a User visting hosting platform.</div>;
              }
            })()}
          </DrawerBackground>
        </SwipeableDrawer>
      </React.Fragment>

      <SettingsDrawer openDrawer={openSettings} handleCloseDrawer={handleCloseSettings}/>
    </>
  );
};

export default RightContent;
