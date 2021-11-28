/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Emoji, Picker } from "emoji-mart";
import styled from "styled-components";
import SettingsRoundedIcon from "@material-ui/icons/SettingsRounded"; // Settings rounded Icon
import VideocamRoundedIcon from "@material-ui/icons/VideocamRounded"; // Video Camera Icon
import MicNoneRoundedIcon from "@material-ui/icons/MicNoneRounded"; // Microphone Icon
import ScreenShareRoundedIcon from "@material-ui/icons/ScreenShareRounded"; // Screen Share Icon
import { BtnDanger, StageControl } from "./Elements";
import { useParams } from "react-router";
import ReactTooltip from "react-tooltip";
import VideocamOffOutlinedIcon from "@mui/icons-material/VideocamOffOutlined";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import CancelPresentationOutlinedIcon from "@mui/icons-material/CancelPresentationOutlined";
import socket from "./../HostingPlatform/service/socket";
import { useDispatch, useSelector } from "react-redux";
import { getRTCTokenForScreenShare } from "../../actions";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { withStyles } from "@material-ui/core/styles";
import Settings from "./Settings";
import StartRecordingConfirmation from "./SubComponent/StartRecordingConfirmation";
import StopRecordingConfirmation from "./SubComponent/StopRecordingConfirmation";
import PanToolRoundedIcon from "@mui/icons-material/PanToolRounded";
import CreatePoll from "../HostingPlatform/StageSideBar/Poll/CreatePoll";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ManageStage from "./ManageStage";

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
  rtc,
  onEmojiSelect,
  onClap,
  onSmile,
  onThumbsUp,
  unMuteMyAudio,
  unMuteMyVideo,
  localUserState,
  userHasUnmutedAudio,
  userHasUnmutedVideo,
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

  const { role, sessionRole } = useSelector((state) => state.eventAccessToken);
  const { userDetails } = useSelector((state) => state.user);
  const { sessionDetails } = useSelector((state) => state.session);

  const [state, setState] = React.useState(
    sessionDetails ? sessionDetails.recording : false
  );

  const { eventDetails } = useSelector((state) => state.event);

  let myHandIsRaised = false;

  const [openManageStage, setOpenManageStage] = useState(false);

  const handleCloseManageStage = () => {
    setOpenManageStage(false);
  };

  const [openCreatePoll, setOpenCreatePoll] = React.useState(false);

  const [emojiMartVisbility, setEmojiMartVisibility] = useState("none");

  useEffect(() => {
    socket.on("invitedToStage", () => {
      setEmojiMartVisibility("none");
    });
  }, []);

  const toggleEmojiMart = () => {
    if (emojiMartVisbility === "none") {
      setEmojiMartVisibility("inline-block");
    } else {
      setEmojiMartVisibility("none");
    }
  };

  const handleCloseCreatePoll = () => {
    setOpenCreatePoll(false);
  };

  let sessionHasEnded = false;
  let currentUserIsAHost = false;

  const [openSettings, setOpenSettings] = useState(false);

  const [startRecording, setStartRecording] = useState(false);

  const [stopRecording, setStopRecording] = useState(false);

  const handleCloseStopRecording = () => {
    setStopRecording(false);
  };

  const handleCloseStartRecording = () => {
    setStartRecording(false);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
  };

  const dispatch = useDispatch();

  const params = useParams();

  const sessionId = params.sessionId;
  const eventId = params.eventId;

  const handleChange = (event) => {
    setState(event.target.checked);
    if (event.target.checked) {
      setStartRecording(true);
    } else {
      setStopRecording(true);
    }
  };

  // Determine if the current user is a host and place restrictions based on that

  const userId = userDetails._id;

  let hostIds = sessionDetails.host.map((el) => el._id);

  if (sessionRole === "host" && hostIds.includes(userId)) {
    currentUserIsAHost = true;
  }

  if (runningStatus === "Ended") {
    sessionHasEnded = true;
  }

  for (let element of sessionDetails.raisedHands) {
    if (element.userId.toString() === userId.toString()) {
      myHandIsRaised = true;
    }
  }

  return (
    <>
      <StageControl color={eventDetails.color} className="px-3 py-1">
        <div className="d-flex flex-row align-items-center">
          <BtnDanger
            id="leave-session"
            className="me-3"
            // ! If host leaves this session in live state then mark this session as Paused and show this warning to the host when leaving session in live state
            onClick={() => {
              socket.emit("leaveSession", { sessionId, userId }, (error) => {
                console.log(error);
              });

              leaveStreaming();
            }}
          >
            Leave
          </BtnDanger>

          {currentUserIsAHost ? (
            <button
              onClick={() => {
                setOpenManageStage(true);
              }}
              className="btn btn-outline-text btn-outline-light"
            >
              Manage Stage
            </button>
          ) : (
            <></>
          )}
        </div>

        {!sessionHasEnded ? (
          <div>
            <div
              style={{
                position: "fixed",
                left: "48vw",
                bottom: "60px",
                zIndex: "100000000",
              }}
            >
              <Picker
                onSelect={(emoji) => {
                  onEmojiSelect(emoji);
                  console.log(emoji);
                  socket.emit("emoji", { sessionId, emoji }, (error) => {
                    alert(error);
                  });
                }}
                perLine={8}
                emoji=""
                showPreview={false}
                set="apple"
                style={{
                  zIndex: "1000000",
                  display: emojiMartVisbility,
                }}
              />
            </div>

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
                    case "In Progress":
                      return (
                        <IconButton
                          onClick={(emoji) => {
                            onThumbsUp(emoji);
                            socket.emit("thumbsUp", { sessionId }, (error) => {
                              alert(error);
                            });
                          }}
                          style={{ padding: "8px" }}
                          className="me-3"
                        >
                          <Emoji emoji={{ id: "+1", skin: 3 }} size={24} />
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
                    case "In Progress":
                      return (
                        <IconButton
                          onClick={(emoji) => {
                            onClap(emoji);
                            socket.emit("clap", { sessionId }, (error) => {
                              alert(error);
                            });
                          }}
                          style={{ padding: "8px" }}
                          className="me-3"
                        >
                          <Emoji emoji={{ id: "clap", skin: 3 }} size={24} />
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
                            startPresenting
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

              {canPublishStream && role === "attendee" && (
                <button
                  onClick={() => {
                    socket.emit(
                      "removeFromStage",
                      { userId, sessionId, eventId },
                      (error) => {
                        alert(error);
                      }
                    );
                  }}
                  className="btn btn-outline-text btn-outline-danger"
                >
                  Leave stage
                </button>
              )}
              {!canPublishStream ? (
                (() => {
                  switch (runningStatus) {
                    case "In Progress":
                      return (
                        <>
                          <IconButton
                            onClick={(emoji) => {
                              onSmile(emoji);
                              socket.emit("smile", { sessionId }, (error) => {
                                alert(error);
                              });
                            }}
                            style={{ padding: "8px" }}
                            className="me-3"
                          >
                            <Emoji emoji={{ id: "smile", skin: 3 }} size={24} />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              toggleEmojiMart();
                            }}
                            className="me-3"
                          >
                            <MoreVertRoundedIcon />
                          </IconButton>
                        </>
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
                    case "In Progress":
                      return (
                        <IconButton
                          onClick={() => {
                            if (myHandIsRaised) {
                              socket.emit(
                                "removeFromStage",
                                {
                                  userId: userId,
                                  eventId: eventId,
                                  sessionId: sessionId,
                                },
                                (error) => {
                                  alert(error);
                                }
                              );
                            } else {
                              socket.emit(
                                "raiseHand",
                                { userId: userId, sessionId: sessionId },
                                (error) => {
                                  alert(error);
                                }
                              );
                            }
                          }}
                          style={{
                            padding: "12px",
                            color: myHandIsRaised ? "#FFFFFF" : "#152d35",
                          }}
                          className="me-3"
                        >
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
          </div>
        ) : (
          <div></div>
        )}
        <div className="d-flex flex-row align-items-center justify-content-end">
          {canPublishStream && currentUserIsAHost && !sessionHasEnded ? (
            (() => {
              switch (runningStatus) {
                case "In Progress":
                  return (
                    <div className="d-flex flex-row align-items-center p-2 justify-content-center ps-3 pe-3 rec-toggle-btn-wrapper me-4">
                      <FormControlLabel
                        control={
                          <IOSSwitch
                            checked={state}
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
                case "In Progress":
                  return (
                    <IconButton
                      className=""
                      onClick={() => {
                        setOpenCreatePoll(true);
                      }}
                    >
                      <AssessmentRoundedIcon style={{ fontSize: "20px" }} />
                    </IconButton>
                  );

                default:
                  break;
              }
            })()
          ) : (
            <></>
          )}

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

      <CreatePoll open={openCreatePoll} handleClose={handleCloseCreatePoll} />
      <ReactTooltip place="top" type="light" effect="float" />
      <Settings
        open={openSettings}
        handleClose={handleCloseSettings}
        rtc={rtc}
      />

      <StartRecordingConfirmation
        setState={setState}
        open={startRecording}
        handleClose={handleCloseStartRecording}
      />
      <StopRecordingConfirmation
        setState={setState}
        open={stopRecording}
        handleClose={handleCloseStopRecording}
      />

      <ManageStage
        open={openManageStage}
        handleClose={handleCloseManageStage}
      />

      {/*  */}

      {/* <Picker set="apple" onSelect={onSelect} /> */}
    </>
  );
};

export default StageControlsComponent;
