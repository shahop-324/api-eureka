import React from "react";
import "./../Styles/root.scss";

import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import GroupIcon from "@material-ui/icons/Group";
import WifiTetheringRoundedIcon from "@material-ui/icons/WifiTetheringRounded";
import StorefrontRoundedIcon from "@material-ui/icons/StorefrontRounded";
import GrainRoundedIcon from "@material-ui/icons/GrainRounded";
import WeekendIcon from '@material-ui/icons/Weekend';

import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { signOut } from "../../../actions"; 
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Avatar } from "@material-ui/core";

import InfoDeskPNG from "./../../../assets/images/information-desk.png";



const SideNav = (props) => {
  const userDetails = useSelector((state) => state.user.userDetails);
  const userId = userDetails._id;

  const params = useParams();

  const eventId = params.eventId;

  console.log(props.activeIndex);
  const dispatch = useDispatch();
  return (
    <>
      <div className="h-side-nav">
        <div className="community-logo-container d-flex flex-row align-items-center justify-content-center py-2 px-3" style={{height: "9vh"}}>
          {/* Community Logo */}
          <Avatar   src={props.communityLogo} alt={props.communityName} variant="rounded"/>
        </div>
        <div className="main-icon-btn-container py-3">
        <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={props.handleReceptionClick}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (props.activeIndex === "5" ? "active-wrapper-h" : "")
              }
            >
              <HomeRoundedIcon
                className={
                  "icon-btn-h " +
                  (props.activeIndex === "5" ? "icon-btn-active-h" : "")
                }
              />

              {/* <img src={InfoDeskPNG} alt="reception-desk" /> */}
            </div>
            <div
              className={
                "icon-btn-text " +
                (props.activeIndex === "5" ? "icon-btn-text-active-h" : "")
              }
            >
              Reception
            </div>
          </div>
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={props.handleLobbyClick}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (props.activeIndex === "0" ? "active-wrapper-h" : "")
              }
            >
              <WeekendIcon
                className={
                  "icon-btn-h " +
                  (props.activeIndex === "0" ? "icon-btn-active-h" : "")
                }
              />
            </div>
            <div
              className={
                "icon-btn-text " +
                (props.activeIndex === "0" ? "icon-btn-text-active-h" : "")
              }
            >
              Lobby
            </div>
          </div>

          {/* <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={props.handleSessionsClick}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (props.activeIndex === "1" ? "active-wrapper-h" : "")
              }
            >
              <GroupIcon
                className={
                  "icon-btn-h " +
                  (props.activeIndex === "1" ? "icon-btn-active-h" : "")
                }
              />
            </div>
            <div
              className={
                "icon-btn-text " +
                (props.activeIndex === "1" ? "icon-btn-text-active-h" : "")
              }
            >
              Sessions
            </div>
          </div> */}

          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={props.handleNetworkingClick}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (props.activeIndex === "2" ? "active-wrapper-h" : "")
              }
            >
              <WifiTetheringRoundedIcon
                className={
                  "icon-btn-h " +
                  (props.activeIndex === "2" ? "icon-btn-active-h" : "")
                }
              ></WifiTetheringRoundedIcon>
            </div>
            <div
              className={
                "icon-btn-text " +
                (props.activeIndex === "2" ? "icon-btn-text-active-h" : "")
              }
            >
              Networking
            </div>
          </div>

          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={props.handleRoomsClick}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (props.activeIndex === "3" ? "active-wrapper-h" : "")
              }
            >
              <GrainRoundedIcon
                className={
                  "icon-btn-h " +
                  (props.activeIndex === "3" ? "icon-btn-active-h" : "")
                }
              />
            </div>
            <div
              className={
                "icon-btn-text " +
                (props.activeIndex === "3" ? "icon-btn-text-active-h" : "")
              }
            >
              Rooms
            </div>
          </div>

          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={props.handleBoothsClick}
          >
            <div
              className={
                "icon-wrapper p-3 mb-1 " +
                (props.activeIndex === "4" ? "active-wrapper-h" : "")
              }
            >
              <StorefrontRoundedIcon
                className={
                  "icon-btn-h " +
                  (props.activeIndex === "4" ? "icon-btn-active-h" : "")
                }
              />
            </div>
            <div
              className={
                "icon-btn-text " +
                (props.activeIndex === "4" ? "icon-btn-text-active-h" : "")
              }
            >
              Booths
            </div>
          </div>
          
        </div>

        <div className="logout-btn-side-nav-h">
          <div
            className="icon-btn-lobby-wrapper d-flex flex-column align-items-center mb-3"
            onClick={props.handleLogoutClick}
          >
            <Link
              onClick={() => {
                // history.push("/signin");
                props.socket.emit(
                  "disconnectUser",
                  { userId, eventId },
                  () => {}
                );
                dispatch(signOut());
              }}
              to="/signin"
              className={
                "icon-wrapper p-3 mb-1 " +
                (props.activeIndex === "5" ? "active-wrapper-h" : "")
              }
            >
              <ExitToAppIcon
                className={
                  "icon-btn-h " +
                  (props.activeIndex === "5" ? "icon-btn-active-h" : "")
                }
              />
            </Link>
            <div
              className={
                "icon-btn-text " +
                (props.activeIndex === "5" ? "icon-btn-text-active-h" : "")
              }
            >
              Leave
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNav;
