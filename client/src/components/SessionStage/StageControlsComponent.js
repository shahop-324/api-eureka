/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";

import AppsRoundedIcon from "@material-ui/icons/AppsRounded";
import ViewCompactRoundedIcon from "@material-ui/icons/ViewCompactRounded";
import AccountBoxOutlinedIcon from "@material-ui/icons/AccountBoxOutlined";
import SettingsRoundedIcon from "@material-ui/icons/SettingsRounded"; // Settings rounded Icon
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";

import VideocamRoundedIcon from "@material-ui/icons/VideocamRounded"; // Video Camera Icon
import MicNoneRoundedIcon from "@material-ui/icons/MicNoneRounded"; // Microphone Icon
import ScreenShareRoundedIcon from "@material-ui/icons/ScreenShareRounded"; // Screen Share Icon
// import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded"; // Tools Icon
import WidgetsIcon from "@mui/icons-material/Widgets"; // Tools Icon

import { BtnDanger, StageControl, IconButton } from "./Elements";

import history from "../../history";
import { useParams } from "react-router";
import ReactTooltip from "react-tooltip";
import VideocamOffOutlinedIcon from "@mui/icons-material/VideocamOffOutlined";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import CancelPresentationOutlinedIcon from "@mui/icons-material/CancelPresentationOutlined";

import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import { useDispatch, useSelector } from "react-redux";
import { getRTCTokenForScreenShare } from "../../actions";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import { withStyles } from "@material-ui/core/styles";

import Settings from "./Settings";
import Tools from "./Tools";
import StartRecordingConfirmation from "./SubComponent/StartRecordingConfirmation";
import StopRecordingConfirmation from "./SubComponent/StopRecordingConfirmation";

import PanToolRoundedIcon from "@mui/icons-material/PanToolRounded";
import Like from "./../../assets/images/like.png";
import Clapping from "./../../assets/images/clapping.png";
import Love from "./../../assets/images/love.png";
import Smile from "./../../assets/images/Smile.png";

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(0),
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(16px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: "#52d869",
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: "#52d869",
      border: "6px solid #fff",
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const StageControlsComponent = ({
  handleStopScreenShare,
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
  const [fullScreen, setFullScreen] = useState(false);

  const { sessionRole, role } = useSelector((state) => state.eventAccessToken);

  const [openSettings, setOpenSettings] = useState(false);

  const [showTools, setShowTools] = useState(false);

  const [startRecording, setStartRecording] = useState(false);

  const [stopRecording, setStopRecording] = useState(false);

  const handleCloseStopRecording = () => {
    setStopRecording(false);
  };

  const handleCloseStartRecording = () => {
    setStartRecording(false);
  };

  const handleCloseTools = () => {
    setShowTools(false);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  const dispatch = useDispatch();

  const params = useParams();

  const sessionId = params.sessionId;
  const eventId = params.eventId;
  const communityId = params.communityId;

  const userId = useSelector((state) => state.eventAccessToken.id);

  const [state, setState] = React.useState({
    checkedB: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });

    if (event.target.checked) {
      // startCloudRecording();
      // Aks if you are sure to start recording ?
      setStartRecording(true);
    } else {
      setStopRecording(true);
    }
  };

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

            <a
              onClick={() => {
                handleSwitchToSpotlightView();
              }}
              data-tip={"Spotlight view"}
              className=""
            >
              <IconButton className="me-3">
                <AccountBoxOutlinedIcon style={{ fontSize: "20px" }} />
              </IconButton>
            </a>
          </div>
        </div>

        <div className="d-flex flex-row align-items-center justify-content-center">
          {sessionRole === "host" ? (
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
          ) : (
            <IconButton style={{ padding: "4px" }} className="me-3">
              <img
                src={Like}
                alt="like-reaction"
                style={{ maxWidth: "20px" }}
                className="m-2"
              />
            </IconButton>
          )}

          {sessionRole === "host" ? (
            <a
              data-tip={
                audioIsEnabled ? "Turn off microphone" : "Turn on microphone"
              }
              className=""
            >
              <IconButton
                onClick={() => {
                  audioIsEnabled
                    ? turnOffAudio(options.uid)
                    : turnOnAudio(options.uid);
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
          ) : (
            <IconButton style={{ padding: "3px" }} className="me-3">
              <img
                src={Smile}
                alt="smile-reaction"
                style={{ maxWidth: "24px" }}
                className="m-2"
              />
            </IconButton>
          )}

          {sessionRole === "host" ? (
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
                  if (screenSharingIsEnabled) {
                    handleStopScreenShare();
                    setScreenSharingIsEnabled(false);
                  } else {
                    dispatch(
                      getRTCTokenForScreenShare(
                        sessionId,
                        userId,
                        startScreenCall
                      )
                    );
                    setScreenSharingIsEnabled(true);
                  }
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
          ) : (
            <IconButton style={{ padding: "3px" }} className="me-3">
              <img
                src={Clapping}
                alt="clapping-reaction"
                style={{ maxWidth: "24px" }}
                className="m-2"
              />
            </IconButton>
          )}

          {sessionRole === "host" ? (
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
          ) : (
            <IconButton style={{ padding: "3px" }} className="me-3">
              <img
                src={Love}
                alt="love-reaction"
                style={{ maxWidth: "24px" }}
                className="m-2"
              />
            </IconButton>
          )}

<IconButton style={{padding: "12px"}} className="me-3">
  <PanToolRoundedIcon style={{ fontSize: "20px" }} />
</IconButton>


        </div>

        <div className="d-flex flex-row align-items-center justify-content-end">
          {sessionRole === "host" ? <div className="d-flex flex-row align-items-center p-2 justify-content-center ps-3 pe-3 rec-toggle-btn-wrapper me-4">
            <FormControlLabel
              control={
                <IOSSwitch
                  checked={state.checkedB}
                  onChange={handleChange}
                  name="checkedB"
                />
              }
            />
            <div className="rec-label-text">REC</div>
          </div> : <></> }
          
          {sessionRole === "host" ? <IconButton
            className="me-4"
            onClick={() => {
              setShowTools(true);
            }}
          >
            <WidgetsIcon style={{ fontSize: "20px" }} />
          </IconButton> : <></> }

          

          <IconButton
            onClick={() => {
              // handleOpenPhotoBooth();
              if (fullScreen) {
                // Logic for exiting full screen mode

                setFullScreen(false);

                document.exitFullscreen();
              } else {
                // Logic for entering full screen mode
                let elem = document.getElementById("stage-full-screen-element");

                if (!elem) return;

                setFullScreen(true);

                elem.requestFullscreen();
              }
            }}
            className="me-4"
          >
            <FullscreenRoundedIcon style={{ fontSize: "20px" }} />
          </IconButton>

          <IconButton
            onClick={() => {
              setOpenSettings(true);
            }}
          >
            <SettingsRoundedIcon style={{ fontSize: "20px" }} />
          </IconButton>
        </div>
      </StageControl>

      <Tools open={showTools} handleClose={handleCloseTools} />
      <ReactTooltip place="top" type="light" effect="float" />
      <Settings open={openSettings} handleClose={handleCloseSettings} />

      <StartRecordingConfirmation
        open={startRecording}
        handleClose={handleCloseStartRecording}
      />
      <StopRecordingConfirmation
        open={stopRecording}
        handleClose={handleCloseStopRecording}
      />
    </>
  );
};

export default StageControlsComponent;
