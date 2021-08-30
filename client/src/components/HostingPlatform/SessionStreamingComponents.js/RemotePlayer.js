/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar } from "@material-ui/core";
import React, { useEffect } from "react";
import "./../Styles/sessionStreaming.scss";
import ReactDOM from "react-dom";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from '@material-ui/icons/MicOff';

const RemotePlayer = ({
    uid,
    role,
  remotePlayerId,
  userName,
  userImage,
  userOrganisation,
  userDesignation,
}) => {


  return (
    <>
      <div id={remotePlayerId} className="session-remote-video-player">
      <div className="session-role px-3 py-1">{role}</div>
        <div id={`avatar_box_${remotePlayerId}`} className="avatar_box">
            
          <Avatar
          variant="rounded"
            src={userImage}
            alt={userName}
            style={{ backgroundColor: "#538BF7" }}
          />
        </div>
        <div id={`user_identity_${remotePlayerId}`} className="user-identity">
          <div style={{color: "#D9F753"}}>{userName}</div>

          <div className="d-flex flex-row align-items-center">
            <div className="me-2">{`${userDesignation} ${userOrganisation}`}</div>
            {/* <MicIcon id={`remote_mic_on_${uid}`} style={{fill: "#53F77C"}} /> */}
            {/* <MicOffIcon id={`remote_mic_off_${uid}`} style={{fill: "#F76C53"}} /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default RemotePlayer;
