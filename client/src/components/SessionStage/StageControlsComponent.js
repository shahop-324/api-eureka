/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import styled from "styled-components";
import SettingsRoundedIcon from "@material-ui/icons/SettingsRounded"; // Settings rounded Icon
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import VideocamRoundedIcon from "@material-ui/icons/VideocamRounded"; // Video Camera Icon
import MicNoneRoundedIcon from "@material-ui/icons/MicNoneRounded"; // Microphone Icon
import ScreenShareRoundedIcon from "@material-ui/icons/ScreenShareRounded"; // Screen Share Icon
import WidgetsIcon from "@mui/icons-material/Widgets"; // Tools Icon
import { BtnDanger, StageControl } from "./Elements";
import { useParams } from "react-router";
import ReactTooltip from "react-tooltip";
import VideocamOffOutlinedIcon from "@mui/icons-material/VideocamOffOutlined";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import CancelPresentationOutlinedIcon from "@mui/icons-material/CancelPresentationOutlined";
import socket from "./../HostingPlatform/service/socket";
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
import Speakers from "./Speakers";
import SpeakerInfoTab from "./SpeakersInfoTab";

const IconButton = styled.div`
  max-width: fit-content;
  padding: 7px;
  border-radius: 10px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  border: 1px solid #1f545e;
  color: #1f545e;
  background-color: #ffffffa9;

  &:hover {
    cursor: pointer;
    border: 1px solid #ffffffa9;
    background-color: #ffffffa9;
    color: #1f545e;
  }
`;

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
  unMuteMyAudio,
  unMuteMyVideo,
  localUserState,
  userHasUnmutedAudio,
  userHasUnmutedVideo,
  currentState,
  handleStopScreenShare,
  turnOffAudio,
  turnOnAudio,
  turnOffVideo,
  turnOnVideo,
  stopPresenting,
  startPresenting,
  runningStatus,
  canPublishStream,
  leaveStreaming,
}) => {
  // {/* // ! Caution don't show stage controls if session has ended */}

  let sessionHasEnded = false;
  let currentUserIsAHost = false;
  let currentUserIsASpeaker = false;
  let currentUserIsAnAttendeeOnStage = false;
  let currentUserIsAnAttendee = false;

  const [openSpeakers, setOpenSpeakers] = React.useState(false);
  const [openSpeakersInfo, setOpenSpeakersInfo] = useState(false);

  const [fullScreen, setFullScreen] = useState(false);

  const [openSettings, setOpenSettings] = useState(false);

  const [showTools, setShowTools] = useState(false);

  const [startRecording, setStartRecording] = useState(false);

  const [stopRecording, setStopRecording] = useState(false);

  const handleCloseSpeakerInfoTab = () => {
    setOpenSpeakersInfo(false);
  };

  const handleCloseSpeakers = () => {
    setOpenSpeakers(false);
  };

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

  const [state, setState] = React.useState({
    checkedB: false,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });

    if (event.target.checked) {
      setStartRecording(true);
    } else {
      setStopRecording(true);
    }
  };

  // Determine if the current user is a host and place restrictions based on that

  const { userDetails } = useSelector((state) => state.user);
  const { sessionDetails } = useSelector((state) => state.session);

  const userId = userDetails._id;
  const userEmail = userDetails.email;

  const hosts = sessionDetails.host; // Hosts for this session
  const speakers = sessionDetails.speaker; // Speakers for this session

  const hostIds = hosts.map((el) => el._id);
  const speakerEmails = speakers.map((el) => el.email);

  if (hostIds.includes(userId)) {
    //This user is a host
    currentUserIsAHost = true;
  } else if (speakerEmails.includes(userEmail)) {
    // This user is a speaker
    currentUserIsASpeaker = true;
  } else if (
    canPublishStream &&
    !hostIds.includes(userId) &&
    !speakerEmails.includes(userEmail)
  ) {
    // This user is an attendee invited on stage
    currentUserIsAnAttendeeOnStage = true;
  } else {
    currentUserIsAnAttendee = true;
  }

  currentUserIsAHost = true;

  if (runningStatus === "Ended") {
    sessionHasEnded = true;
  }

  return (
    <>
      <StageControl className="px-3 py-1">
        <div className="d-flex flex-row align-items-center">
          <BtnDanger
            id="leave-session"
            className="me-3"
            // ! If host leaves this session in live state then mark this session as Paused and show this warning to the host when leaving session in live state
            onClick={() => {
              leaveStreaming();
              socket.emit("leaveSession", { sessionId, userId }, (error) => {
                console.log(error);
              });
              window.location.href = `/community/${communityId}/event/${eventId}/hosting-platform/lobby`;
            }}
          >
            Leave
          </BtnDanger>

          {/* Show speaker managemenet widget if its session host and speaker details widget if its an audience */}
          {/* This widget will be shown throughout the lifecycle of a session (i.e., in ay running state) */}
          {/* But show only speaker details widget if session has ended */}

          {currentState !== "back" ? (
            <button
              onClick={() => {
                if (currentUserIsAHost && !sessionHasEnded) {
                  setOpenSpeakers(true);
                }
                if (!currentUserIsAHost) {
                  setOpenSpeakersInfo(true);
                }
                if (currentUserIsAHost && sessionHasEnded) {
                  setOpenSpeakersInfo(true);
                }
              }}
              className="btn btn-outline-light btn-outline-text d-flex flex-row align-items-center"
            >
              {" "}
              <PersonRoundedIcon className="me-2" />{" "}
              {runningStatus === "Ended" ? (
                <span>Speakers</span>
              ) : currentUserIsAHost ? (
                <span>Manage stage</span>
              ) : (
                <span>Speakers</span>
              )}
            </button>
          ) : (
            <></>
          )}

          <div className="stage-left-controls d-flex flex-row  align-items-center">
            {/* Here we just need to give an option to switch layouts */}
            {/* // Layout will be last priority <button className="btn btn-outline-text btn-light ms-3">Layout</button> */}
          </div>
        </div>

        {!sessionHasEnded ? (
          <div className="d-flex flex-row align-items-center justify-content-center">
            {canPublishStream ? (
              <IconButton
                onClick={() => {
                  localUserState.camera
                    ? turnOffVideo()
                    : userHasUnmutedVideo.current
                    ? turnOnVideo()
                    : unMuteMyVideo();
                }}
                className="me-4"
              >
                {localUserState.camera ? (
                  <VideocamRoundedIcon style={{ fontSize: "20px" }} />
                ) : (
                  <VideocamOffOutlinedIcon
                    style={{ fontSize: "20px", color: "#BE1D1D" }}
                  />
                )}
              </IconButton>
            ) : (
              <></>
            )}

            {!canPublishStream ? (
              (() => {
                switch (runningStatus) {
                  case "Started":
                    return (
                      <IconButton style={{ padding: "4px" }} className="me-3">
                        <img
                          src={Like}
                          alt="like-reaction"
                          style={{ maxWidth: "20px" }}
                          className="m-2"
                        />
                      </IconButton>
                    );
                  case "Resumed":
                    return (
                      <IconButton style={{ padding: "4px" }} className="me-3">
                        <img
                          src={Like}
                          alt="like-reaction"
                          style={{ maxWidth: "20px" }}
                          className="m-2"
                        />
                      </IconButton>
                    );

                  default:
                    break;
                }
              })()
            ) : (
              <></>
            )}
            {canPublishStream ? (
              <IconButton
                onClick={() => {
                  localUserState.mic
                    ? turnOffAudio()
                    : userHasUnmutedAudio.current
                    ? turnOnAudio()
                    : unMuteMyAudio();
                }}
                className="me-4"
              >
                {localUserState.mic ? (
                  <MicNoneRoundedIcon style={{ fontSize: "20px" }} />
                ) : (
                  <MicOffOutlinedIcon
                    style={{ fontSize: "20px", color: "#BE1D1D" }}
                  />
                )}
              </IconButton>
            ) : (
              <></>
            )}
            {!canPublishStream ? (
              (() => {
                switch (runningStatus) {
                  case "Started":
                    return (
                      <IconButton style={{ padding: "3px" }} className="me-3">
                        <img
                          src={Smile}
                          alt="smile-reaction"
                          style={{ maxWidth: "24px" }}
                          className="m-2"
                        />
                      </IconButton>
                    );

                  case "Resumed":
                    return (
                      <IconButton style={{ padding: "3px" }} className="me-3">
                        <img
                          src={Smile}
                          alt="smile-reaction"
                          style={{ maxWidth: "24px" }}
                          className="m-2"
                        />
                      </IconButton>
                    );

                  default:
                    break;
                }
              })()
            ) : (
              <></>
            )}
            {canPublishStream ? (
              <IconButton
                onClick={() => {
                  localUserState.screen
                    ? stopPresenting()
                    : dispatch(
                        getRTCTokenForScreenShare(
                          sessionId,
                          userId,
                          startPresenting,
                          currentState,
                        ) // We will use this fxn to request a token and start screen sharing
                      );
                }}
                className="me-4"
              >
                {localUserState.screen ? (
                  <CancelPresentationOutlinedIcon
                    style={{ fontSize: "20px", color: "#1D5BBE" }}
                  />
                ) : (
                  <ScreenShareRoundedIcon style={{ fontSize: "20px" }} />
                )}
              </IconButton>
            ) : (
              <></>
            )}
            {!canPublishStream ? (
              (() => {
                switch (runningStatus) {
                  case "Started":
                    return (
                      <IconButton style={{ padding: "3px" }} className="me-3">
                        <img
                          src={Clapping}
                          alt="clapping-reaction"
                          style={{ maxWidth: "24px" }}
                          className="m-2"
                        />
                      </IconButton>
                    );

                  case "Resumed":
                    return (
                      <IconButton style={{ padding: "3px" }} className="me-3">
                        <img
                          src={Clapping}
                          alt="clapping-reaction"
                          style={{ maxWidth: "24px" }}
                          className="m-2"
                        />
                      </IconButton>
                    );

                  default:
                    break;
                }
              })()
            ) : (
              <></>
            )}
            {!canPublishStream ? (
              (() => {
                switch (runningStatus) {
                  case "Started":
                    return (
                      <IconButton style={{ padding: "12px" }} className="me-3">
                        <PanToolRoundedIcon style={{ fontSize: "20px" }} />
                      </IconButton>
                    );
                  case "Resumed":
                    return (
                      <IconButton style={{ padding: "12px" }} className="me-3">
                        <PanToolRoundedIcon style={{ fontSize: "20px" }} />
                      </IconButton>
                    );

                  default:
                    break;
                }
              })()
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div></div>
        )}
        <div className="d-flex flex-row align-items-center justify-content-end">
          {canPublishStream && currentUserIsAHost && !sessionHasEnded ? (
            (() => {
              switch (runningStatus) {
                case "Started":
                  return (
                    <div className="d-flex flex-row align-items-center p-2 justify-content-center ps-3 pe-3 rec-toggle-btn-wrapper me-4">
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
                    </div>
                  );
                case "Resumed":
                  return (
                    <div className="d-flex flex-row align-items-center p-2 justify-content-center ps-3 pe-3 rec-toggle-btn-wrapper me-4">
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
                    </div>
                  );
                default:
                  break;
              }
            })()
          ) : (
            <></>
          )}
          {canPublishStream && currentUserIsAHost && !sessionHasEnded ? (
            (() => {
              switch (runningStatus) {
                case "Started":
                  return (
                    <IconButton
                      className="me-4"
                      onClick={() => {
                        setShowTools(true);
                      }}
                    >
                      <WidgetsIcon style={{ fontSize: "20px" }} />
                    </IconButton>
                  );

                case "Resumed":
                  return (
                    <IconButton
                      className="me-4"
                      onClick={() => {
                        setShowTools(true);
                      }}
                    >
                      <WidgetsIcon style={{ fontSize: "20px" }} />
                    </IconButton>
                  );

                default:
                  break;
              }
            })()
          ) : (
            <></>
          )}

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
            className=""
          >
            <FullscreenRoundedIcon style={{ fontSize: "20px" }} />
          </IconButton>

          {!sessionHasEnded ? (
            <IconButton
              className="ms-4"
              onClick={() => {
                setOpenSettings(true);
              }}
            >
              <SettingsRoundedIcon style={{ fontSize: "20px" }} />
              {/* Settings are shown differently based on host and other person */}
            </IconButton>
          ) : (
            <></>
          )}
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
      <Speakers
        open={openSpeakers}
        handleClose={handleCloseSpeakers}
        stopPresenting={stopPresenting}
        startPresenting={startPresenting}
        turnOnAudio={turnOnAudio}
        turnOffAudio={turnOffAudio}
        turnOnVideo={turnOnVideo}
        turnOffVideo={turnOffVideo}
        userHasUnmutedVideo={userHasUnmutedVideo}
        userHasUnmutedAudio={userHasUnmutedAudio}
        unMuteMyVideo={unMuteMyVideo}
        unMuteMyAudio={unMuteMyAudio}
      />
      <SpeakerInfoTab
        open={openSpeakersInfo}
        handleClose={handleCloseSpeakerInfoTab}
      />
    </>
  );
};

export default StageControlsComponent;