import React from "react";
import "./../Styles/sessionStreaming.scss";
import { useSelector } from "react-redux";

import {
  UserRoleTag,
  VideoStreamContainer,
  IconButton,
} from "../../SessionStage/Elements";

import ZoomOutMapRoundedIcon from "@mui/icons-material/ZoomOutMapRounded";

import PushPinRoundedIcon from "@mui/icons-material/PushPinRounded";

const ShareScreenPlayer = ({
  role,
  localPlayerId,
  userName,
}) => {

    let uid = localPlayerId.slice(7);
  
  const { id } = useSelector((state) => state.eventAccessToken);

  const roleSuffix = id === uid ? "(You)" : "";

  return (
    <>
      <VideoStreamContainer style={{objectFit: "contain"}}>
        <div id={localPlayerId} className="session-local-video-player screen-share-container">
          <UserRoleTag className="session-role px-3 py-1">{role}</UserRoleTag>
          {/* <div
            className="d-flex flex-row align-items-center"
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              zIndex: "2",
            }}
          >
            <IconButton  className="me-4">
              <PushPinRoundedIcon style={{ fontSize: "20px" }} />
            </IconButton>
            <IconButton >
              <ZoomOutMapRoundedIcon style={{ fontSize: "20px" }} />
            </IconButton>
          </div> */}
         
          <div id={`user_identity_${localPlayerId}`} className="user-identity">
            <div className="d-flex flex-row align-items-center" style={{ color: "#F7F453" }}>
            <div className="me-2">  {userName + " " + roleSuffix} </div>
            </div>
          </div>
        </div>
      </VideoStreamContainer>
    </>
  );
};

export default ShareScreenPlayer;
