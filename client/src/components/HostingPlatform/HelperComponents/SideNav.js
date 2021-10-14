import React from "react";
import "./../Styles/root.scss";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

import WifiTetheringRoundedIcon from "@material-ui/icons/WifiTetheringRounded";
import StorefrontRoundedIcon from "@material-ui/icons/StorefrontRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import Faker from "faker";
import WeekendIcon from "@mui/icons-material/Weekend";
import { Avatar } from "@material-ui/core";
import styled from "styled-components";
import { IconButton } from "@mui/material";


const SideNavBody = styled.div`
  background-color: #233e44 !important;
`;

const SideNav = ({
  activeIndex,
  communityLogo,
  communityName,
  // handleReceptionClick,
  handleLobbyClick,
  handleNetworkingClick,
  handleRoomsClick,
  handleBoothsClick,
  handleSessionsClick,
  // handleSocialSpaceClick,
}) => {

 


  return (
    <>



      
      <SideNavBody className="h-side-nav">
        <div
          className="community-logo-container d-flex flex-row align-items-center justify-content-center py-2 px-3"
          style={{ height: "9vh" }}
        >
          {/* Community Logo */}
          <Avatar src={communityLogo} alt={communityName} variant="rounded" />
        </div>
        <div className="main-icon-btn-container py-3">
          {/* <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={handleReceptionClick}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "0" ? "active-wrapper-h" : "")
              }
            >
              <HomeRoundedIcon
                className={
                  "icon-btn-h " +
                  (activeIndex === "0" ? "icon-btn-active-h" : "")
                }
              />

              
            </div>
            <div
              className={
                "icon-btn-text " +
                (activeIndex === "0" ? "icon-btn-text-active-h" : "")
              }
            >
              Reception
            </div>
          </div> */}
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={handleLobbyClick}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "0" ? "active-wrapper-h" : "")
              }
            >
              <HomeRoundedIcon
                className={
                  "icon-btn-h " +
                  (activeIndex === "0" ? "icon-btn-active-h" : "")
                }
              />
            </div>
            <div
              className={
                "icon-btn-text " +
                (activeIndex === "0" ? "icon-btn-text-active-h" : "")
              }
            >
              Lobby
            </div>
          </div>
          {/* <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={handleSocialSpaceClick}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "2" ? "active-wrapper-h" : "")
              }
            >
              <GroupsRoundedIcon
                className={
                  "icon-btn-h " +
                  (activeIndex === "2" ? "icon-btn-active-h" : "")
                }
              />
            </div>
            <div
              className={
                "icon-btn-text " +
                (activeIndex === "2" ? "icon-btn-text-active-h" : "")
              }
            >
              Social space
            </div>
          </div> */}
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={handleSessionsClick}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "3" ? "active-wrapper-h" : "")
              }
            >
              <VideocamRoundedIcon
                className={
                  "icon-btn-h " +
                  (activeIndex === "3" ? "icon-btn-active-h" : "")
                }
              />
            </div>
            <div
              className={
                "icon-btn-text " +
                (activeIndex === "3" ? "icon-btn-text-active-h" : "")
              }
            >
              Sessions
            </div>
          </div>
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={handleNetworkingClick}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "4" ? "active-wrapper-h" : "")
              }
            >
              <WifiTetheringRoundedIcon
                className={
                  "icon-btn-h " +
                  (activeIndex === "4" ? "icon-btn-active-h" : "")
                }
              ></WifiTetheringRoundedIcon>
            </div>
            <div
              className={
                "icon-btn-text " +
                (activeIndex === "4" ? "icon-btn-text-active-h" : "")
              }
            >
              Networking
            </div>
          </div>

          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={handleRoomsClick}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "5" ? "active-wrapper-h" : "")
              }
            >
              <WeekendIcon
                className={
                  "icon-btn-h " +
                  (activeIndex === "5" ? "icon-btn-active-h" : "")
                }
              />
            </div>
            <div
              className={
                "icon-btn-text " +
                (activeIndex === "5" ? "icon-btn-text-active-h" : "")
              }
            >
              Lounge
            </div>
          </div>

          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={handleBoothsClick}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (activeIndex === "6" ? "active-wrapper-h" : "")
              }
            >
              <StorefrontRoundedIcon
                className={
                  "icon-btn-h " +
                  (activeIndex === "6" ? "icon-btn-active-h" : "")
                }
              />
            </div>
            <div
              className={
                "icon-btn-text " +
                (activeIndex === "6" ? "icon-btn-text-active-h" : "")
              }
            >
              Booths
            </div>
          </div>
        </div>

        <div className="logout-btn-side-nav-h">
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            // onClick={handleLogoutClick}
          >




            
              
           
            
          </div>
        </div>
      </SideNavBody>
    </>
  );
};

export default SideNav;
