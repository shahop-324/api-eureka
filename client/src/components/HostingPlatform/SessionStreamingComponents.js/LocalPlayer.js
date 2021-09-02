import { Avatar } from "@material-ui/core";
import React from "react";
import "./../Styles/sessionStreaming.scss";
import MicIcon from "@material-ui/icons/Mic";
import { useSelector } from "react-redux";

const SoundWaveAnimation = () => {
  return (
    <>
      <div className="wave-loader">
        <span className="wave-stroke"></span>
        <span className="wave-stroke"></span>
        <span className="wave-stroke"></span>
        <span className="wave-stroke"></span>
        <span className="wave-stroke"></span>
      </div>
    </>
  );
};

const LocalPlayer = ({
  localStream,
  role,
  localPlayerId,
  userName,
  userImage,
  userOrganisation,
  userDesignation,
}) => {
  const {id} = useSelector((state) => state.eventAccessToken);

const roleSuffix = id === localPlayerId ? "(You)" : "";
console.log("This is local player");
  return (
    <>
      <div id={localPlayerId} className="session-local-video-player">
        <div className="session-role px-3 py-1">{role} </div>
        <div id={`avatar_box_${localPlayerId}`} className="avatar_box">
          <Avatar
            variant="rounded"
            src={userImage}
            alt={userName}
            style={{ backgroundColor: "#538BF7" }}
          />
        </div>
        <div id={`user_identity_${localPlayerId}`} className="user-identity">
          <div style={{ color: "#D9F753" }}>{userName + " " + roleSuffix}</div>

          <div className="d-flex flex-row align-items-center">
            <div className="me-2">{`${userDesignation} ${userOrganisation}`}</div>
            {/* <MicIcon /> */}
            {/* <SoundWaveAnimation /> */}
          </div>
        </div>
      </div>
      {/* {localStream.play(localPlayerId)} */}
    </>
  );
};

export default LocalPlayer;