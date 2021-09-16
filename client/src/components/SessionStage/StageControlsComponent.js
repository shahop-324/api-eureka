import React from "react";

import AppsRoundedIcon from "@material-ui/icons/AppsRounded";
import ViewCompactRoundedIcon from "@material-ui/icons/ViewCompactRounded";
import AccountBoxOutlinedIcon from "@material-ui/icons/AccountBoxOutlined";
import SettingsRoundedIcon from "@material-ui/icons/SettingsRounded"; // Settings rounded Icon
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";

import VideocamRoundedIcon from "@material-ui/icons/VideocamRounded"; // Video Camera Icon
import MicNoneRoundedIcon from "@material-ui/icons/MicNoneRounded"; // Microphone Icon
import ScreenShareRoundedIcon from "@material-ui/icons/ScreenShareRounded"; // Screen Share Icon

import { BtnDanger, StageControl, IconButton } from "./Elements";

import history from "../../history";
import { useParams } from "react-router";

const StageControlsComponent = ({ handleOpenPhotoBooth }) => {

    const params = useParams();

    const sessionId = params.sessionId;
    const eventId = params.eventId;
    const communityId = params.communityId;

  return (
    <>
      <StageControl className="px-3 py-1">
        <div className="d-flex flex-row align-items-center">
          <BtnDanger className="me-3" onClick={() => {
               history.push(
                `/community/${communityId}/event/${eventId}/hosting-platform/lobby`
              );
          }} >Leave</BtnDanger>

          <div className="stage-left-controls d-flex flex-row  align-items-center">
            {/* <div className="room-no-text">Table 1</div> */}
            <IconButton className="me-3">
              <AppsRoundedIcon style={{ fontSize: "20px" }} />
            </IconButton>
            <IconButton className="me-3">
              <ViewCompactRoundedIcon style={{ fontSize: "20px" }} />
            </IconButton>
            <IconButton className="me-3">
              <AccountBoxOutlinedIcon style={{ fontSize: "20px" }} />
            </IconButton>
          </div>
        </div>

        <div className="d-flex flex-row align-items-center justify-content-center">
          <IconButton className="me-4">
            <VideocamRoundedIcon style={{ fontSize: "20px" }} />
          </IconButton>
          <IconButton className="me-4">
            <MicNoneRoundedIcon style={{ fontSize: "20px" }} />
          </IconButton>
          <IconButton className="me-4">
            <ScreenShareRoundedIcon style={{ fontSize: "20px" }} />
          </IconButton>
          <IconButton
            onClick={() => {
              handleOpenPhotoBooth();
            }}
            className="me-4"
          >
            <PhotoCameraIcon style={{ fontSize: "20px" }} />
          </IconButton>
        </div>

        <div className="d-flex flex-row align-items-center justify-content-end">
          <SettingsRoundedIcon style={{ color: "#FFFFFF", fontSize: "20px" }} />
        </div>
      </StageControl>
    </>
  );
};

export default StageControlsComponent;
