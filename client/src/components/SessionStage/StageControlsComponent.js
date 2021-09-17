/* eslint-disable jsx-a11y/anchor-is-valid */
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

import { Button, Popup } from "semantic-ui-react";
import ReactTooltip from "react-tooltip";

import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VideocamOffOutlinedIcon from "@mui/icons-material/VideocamOffOutlined";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import CancelPresentationOutlinedIcon from "@mui/icons-material/CancelPresentationOutlined";

import MicOffIcon from "@mui/icons-material/MicOff";
import { useDispatch, useSelector } from "react-redux";
import { getRTCTokenForScreenShare } from "../../actions";

const StageControlsComponent = ({
  handleSwitchToGalleryView,
  handleSwitchToGridView,
  handleSwitchToSpotlightView,
  handleOpenPhotoBooth,
  videoIsEnabled,
  audioIsEnabled,
  turnOffAudio,
  turnOnAudio,
  turnOffVideo,
  turnOnVideo,
  options,
  screenSharingIsEnabled,
  startScreenCall,
  setScreenSharingIsEnabled,
}) => {
  const dispatch = useDispatch();

  const params = useParams();

  const sessionId = params.sessionId;
  const eventId = params.eventId;
  const communityId = params.communityId;

  const userId = useSelector((state) => state.eventAccessToken.id);

  return (
    <>
      <StageControl className="px-3 py-1">
        <div className="d-flex flex-row align-items-center">
          <BtnDanger
            id="leave-session"
            className="me-3"
            onClick={() => {
              history.push(
                `/community/${communityId}/event/${eventId}/hosting-platform/lobby`
              );
            }}
          >
            Leave
          </BtnDanger>

          <div className="stage-left-controls d-flex flex-row  align-items-center">
            {/* <div className="room-no-text">Table 1</div> */}
            <a
              onClick={() => {
                handleSwitchToGalleryView();
              }}
              data-tip={"Gallery view"}
              className=""
            >
              <IconButton className="me-3">
                <AppsRoundedIcon style={{ fontSize: "20px" }} />
              </IconButton>
            </a>

            <a
              onClick={() => {
                handleSwitchToGridView();
              }}
              data-tip={"Grid view"}
              className=""
            >
              <IconButton className="me-3">
                <ViewCompactRoundedIcon style={{ fontSize: "20px" }} />
              </IconButton>
            </a>

            <a onClick={() => {
              handleSwitchToSpotlightView();
            }} data-tip={"Spotlight view"} className="">
              <IconButton className="me-3">
                <AccountBoxOutlinedIcon style={{ fontSize: "20px" }} />
              </IconButton>
            </a>
          </div>
        </div>

        <div className="d-flex flex-row align-items-center justify-content-center">
          <a
            data-tip={videoIsEnabled ? "Turn off camera" : "Turn on camera"}
            className=""
          >
            <IconButton
              onClick={() => {
                videoIsEnabled
                  ? turnOffVideo(options.uid)
                  : turnOnVideo(options.uid);
              }}
              className="me-4"
            >
              {videoIsEnabled ? (
                <VideocamRoundedIcon style={{ fontSize: "20px" }} />
              ) : (
                <VideocamOffOutlinedIcon
                  style={{ fontSize: "20px", color: "#BE1D1D" }}
                />
              )}
            </IconButton>
          </a>

          <a
            data-tip={
              audioIsEnabled ? "Turn off microphone" : "Turn on microphone"
            }
            className=""
          >
            <IconButton
              onClick={() => {
                audioIsEnabled ? turnOffAudio(options.uid) : turnOnAudio(options.uid);
              }}
              className="me-4"
            >
              {audioIsEnabled ? (
                <MicNoneRoundedIcon style={{ fontSize: "20px" }} />
              ) : (
                <MicOffOutlinedIcon
                  style={{ fontSize: "20px", color: "#BE1D1D" }}
                />
              )}
            </IconButton>
          </a>

          <a
            data-tip={
              screenSharingIsEnabled
                ? "Stop screen share"
                : "Start screen share"
            }
            className=""
          >
            <IconButton
              onClick={() => {
                dispatch(
                  getRTCTokenForScreenShare(
                    sessionId,
                    userId,
                    startScreenCall
                  )
                );
                // TODO Execute this logic to start sharing screen
                screenSharingIsEnabled
                  ? setScreenSharingIsEnabled(false)
                  : setScreenSharingIsEnabled(true);
              }}
              className="me-4"
            >
              {screenSharingIsEnabled ? (
                <CancelPresentationOutlinedIcon
                  style={{ fontSize: "20px", color: "#BE1D1D" }}
                />
              ) : (
                <ScreenShareRoundedIcon style={{ fontSize: "20px" }} />
              )}
            </IconButton>
          </a>

          <a data-tip={"Open photo booth"} className="">
            <IconButton
              onClick={() => {
                handleOpenPhotoBooth();
              }}
              className="me-4"
            >
              <PhotoCameraIcon style={{ fontSize: "20px" }} />
            </IconButton>
          </a>
        </div>

        <div className="d-flex flex-row align-items-center justify-content-end">
          <a data-tip={"Settings"} className="">
            <SettingsRoundedIcon
              style={{ color: "#FFFFFF", fontSize: "20px" }}
            />
          </a>
        </div>
      </StageControl>

      <ReactTooltip place="top" type="light" effect="float" />
    </>
  );
};

export default StageControlsComponent;
