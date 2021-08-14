/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import SessionScreenTopNav from "../HelperComponents/SessionScreenTopNav";

import { withStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import LiveRipple from "../HelperComponents/LiveRipple";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import socket from "../service/socket";

import { makeStyles } from "@material-ui/core/styles";

import VideocamRoundedIcon from "@material-ui/icons/VideocamRounded";
import MicRoundedIcon from "@material-ui/icons/MicRounded";
import ScreenShareRoundedIcon from "@material-ui/icons/ScreenShareRounded";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import IconButton from "@material-ui/core/IconButton";
import { useParams } from "react-router-dom";
import "./../Styles/sessionStage.scss";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../../reducers/userSlice";
import { stageActions } from "../../../reducers/stageSlice";
import { sessionActions } from "../../../reducers/sessionSlice";
import {
  errorTrackerForFetchingRTCToken,
  errorTrackerForFetchSessionForSessionStage,
  fetchSessionForSessionStage,
  getRTCToken,
} from "../../../actions";

import Like from "./../../../assets/images/like.png";
import Clapping from "./../../../assets/images/clapping.png";
import Love from "./../../../assets/images/love.png";
import Smile from "./../../../assets/images/Smile.png";

import AgoraRTC from "agora-rtc-sdk-ng";
import SessionStageSideBarRoot from "../sessionComponents/SessionStageSideBarRoot";
import Loader from "../../Loader";

import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import MicOffIcon from "@material-ui/icons/MicOff";
import history from "../../../history";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

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

const SessionScreen = () => {
  const dispatch = useDispatch();
  const params = useParams();

  const { isLoading, error, token } = useSelector((state) => state.RTC);

  const isLoadingSession = useSelector((state) => state.session.isLoading);
  const sessionError = useSelector((state) => state.session.error);

  const sessionId = params.sessionId;
  const eventId = params.eventId;
  const communityId = params.communityId;

  const classes = useStyles();
  const [state, setState] = React.useState({
    checkedB: true,
  });

  const [grid, setGrid] = useState(0);

  let col = "1fr 1fr 1fr 1fr";

  let row = "1fr 1fr";

  if (grid === 1) {
    col = "1fr";
    row = "1fr";
  } else if (grid === 2) {
    col = "1fr 1fr";
    row = "1fr";
  } else if (grid === 3) {
    col = "1fr 1fr 1fr";
    row = "1fr";
  } else if (grid === 4) {
    col = "1fr 1fr";
    row = "1fr 1fr";
  } else if (grid === 5) {
    col = "1fr 1fr 1fr 1fr";
    row = "1fr 1fr";
  }

  // RTC Configuration setting up

  let rtc = {
    // For the local audio and video tracks.
    localAudioTrack: null,
    localVideoTrack: null,
    client: null,
  };

  const sessionDetails = useSelector((state) =>
    state.session.sessions.find((session) => session.id === params.sessionId)
  );

  const userId = useSelector((state) => state.eventAccessToken.id);

  const { name } = sessionDetails;

  const { sessionRole } = useSelector((state) => state.eventAccessToken);

  const agoraRole = sessionRole !== "audience" ? "host" : "audience";

  // Defined options for connecting to Agora RTC server

  let options = {
    // Pass your app ID here.
    appId: "6877e158655f4810968b19e65d0bbb23",
    // Set the channel name.
    channel: sessionId,
    // Set the user role in the channel.
    role: "host",
    // Use a temp token
    token: token,
    // Uid
    uid: userId,
  };

  // const uid = uuidv4();

  // useEffect(() => {
  //   dispatch(getRTCToken(sessionId, agoraRole));
  // }, [agoraRole, dispatch, sessionId]);

  const sessionRunningStatus = sessionDetails
    ? sessionDetails.runningStatus
    : "Not Yet Started";

  const showLiveIndicator =
    sessionRunningStatus === "Started" || sessionRunningStatus === "Resumed"
      ? true
      : false;

  const showPeopleCountIndicator =
    sessionRunningStatus === "Started" || sessionRunningStatus === "Resumed"
      ? true
      : false;

  const showRecordingButton =
    (sessionRunningStatus === "Started" ||
      sessionRunningStatus === "Resumed") &&
    sessionRole === "host"
      ? true
      : false;

  const showStartPauseAndEndSessionButton =
    sessionRole === "host" ? true : false;

  const showSessionEnded = sessionRunningStatus === "Ended" ? true : false;

  const showEmoji = sessionRole === "audience" ? true : false;

  useEffect(() => {
    dispatch(fetchSessionForSessionStage(sessionId));

    socket.on("updatedSession", ({ session }) => {
      console.log(session);

      dispatch(
        // ! TODO
        sessionActions.EditSession({
          session: session,
        })
      );
    });

    socket.on("updatedCurrentSession", ({ session }) => {
      console.log(session);

      dispatch(
        // ! TODO
        sessionActions.FetchSession({
          session: session,
        })
      );
    });

    socket.on("stageMembers", ({ stageMembers }) => {
      console.log("I recieved no. of people on stage");

      console.log(stageMembers);
      dispatch(
        // ! TODO
        stageActions.FetchStageMembers({
          stageMembers: stageMembers,
        })
      );
    });

    socket.on("sessionRoomData", ({ sessionUsers }) => {
      console.log("I recieved session room data");

      console.log(sessionUsers);
      dispatch(
        // ! TODO
        userActions.FetchPeopleInSession({
          peopleInThisSession: sessionUsers,
        })
      );
    });
  }, [dispatch, sessionId]);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const [videoIsEnabled, setVideoIsEnabled] = useState(true);
  const [audioIsEnabled, setAudioIsEnabled] = useState(true);
  const [screenSharingIsEnabled, setScreenSharingIsEnabled] = useState(false);

  const turnOffVideo = async () => {
    await rtc.localVideoTrack.setEnabled(false);
    setVideoIsEnabled(false);
  };
  const turnOnVideo = async () => {
    await rtc.localVideoTrack.setEnabled(true);
    setVideoIsEnabled(true);
  };

  const turnOffAudio = async () => {
    await rtc.localAudioTrack.setEnabled(false);
    setAudioIsEnabled(false);
  };
  const turnOnAudio = async () => {
    await rtc.localAudioTrack.setEnabled(true);
    setAudioIsEnabled(true);
  };

  useEffect(() => {
  

      startBasicLiveStreaming();
 
  }, []);

  // if (isLoading) {
  //   return (
  //     <div
  //       className="d-flex flex-row align-items-center justify-content-center"
  //       style={{ width: "100vw", height: "100vh" }}
  //     >
  //       <Loader />
  //     </div>
  //   );
  // }

  // if (error) {
  //   alert(error);
  //   dispatch(errorTrackerForFetchingRTCToken());
  //   return null;
  // }

  console.log("This is our RTC token to join RTC channel.", token);

  let clientRoleOptions = {
    // Set latency level to low latency
    level: 1,
  };

  async function startBasicLiveStreaming() {
    // Created client object using Agora SDK
    rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

    rtc.client.setClientRole(options.role);

    await rtc.client
      .join(options.appId, options.channel, options.token, 0)
      .then(async () => {
        console.log("Joined RTC channel");

        rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();

        console.log(rtc);
        console.log(rtc.localVideoTrack);

        await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

        const localPlayerContainer = document.createElement("div");
        localPlayerContainer.id = userId;

        localPlayerContainer.style.borderRadius = "10px";
        localPlayerContainer.style.background = "rgba( 255, 255, 255, 0.25 )";
        localPlayerContainer.style.backdropFilter = "blur( 4px )";

        document
          .getElementById("session-stage-video-layout-grid")
          .append(localPlayerContainer);

        setGrid(
          document.getElementById("session-stage-video-layout-grid")
            .childElementCount
        );

        rtc.localVideoTrack.play(localPlayerContainer);
        console.log("publish success!");
        console.log("op");
        console.log(12345678);
      });

    document.getElementById("leave").onclick = async function () {
      rtc.localAudioTrack.close();
      rtc.localVideoTrack.close();

      // Traverse all remote users.
      rtc.client.remoteUsers.forEach((user) => {
        // Destroy the dynamically created DIV containers.
        const playerContainer = document.getElementById(user.uid);
        playerContainer && playerContainer.remove();
      });

      // Leave the channel.
      await rtc.client.leave();
      history.push("/home");
    };

    rtc.client.on("user-published", async (user, mediaType) => {
      // Subscribe to a remote user.
      await rtc.client.subscribe(user, mediaType);
      console.log("subscribe success");

      // If the subscribed track is video.
      if (mediaType === "video") {
        // Get `RemoteVideoTrack` in the `user` object.
        const remoteVideoTrack = user.videoTrack;
        // Dynamically create a container in the form of a DIV element for playing the remote video track.
        const remotePlayerContainer = document.createElement("div");
        // Specify the ID of the DIV container. You can use the `uid` of the remote user.
        remotePlayerContainer.id = user.uid.toString();

        remotePlayerContainer.style.borderRadius = "10px";
        remotePlayerContainer.style.background = "rgba( 255, 255, 255, 0.25 )";
        remotePlayerContainer.style.backdropFilter = "blur( 4px )";

        document
          .getElementById("session-stage-video-layout-grid")
          .append(remotePlayerContainer);
        setGrid(
          document.getElementById("session-stage-video-layout-grid")
            .childElementCount
        );

        // Play the remote video track.
        // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
        remoteVideoTrack.play(remotePlayerContainer);

        // Or just pass the ID of the DIV container.
        // remoteVideoTrack.play(playerContainer.id);
      }

      // If the subscribed track is audio.
      if (mediaType === "audio") {
        // Get `RemoteAudioTrack` in the `user` object.
        const remoteAudioTrack = user.audioTrack;
        // Play the audio track. No need to pass any DOM element.
        remoteAudioTrack.play();
      }
    });

    rtc.client.on("user-unpublished", (user) => {
      // Get the dynamically created DIV container.
      const remotePlayerContainer = document.getElementById(user.uid);
      // Destroy the container.
      remotePlayerContainer.remove();
    });
  }

  // console.log(rtc.client.leave);

  // leaveStreaming();

  return (
    <>
      <div className="session-screen-nav-container">
        <SessionScreenTopNav
          rtc={rtc}
          agoraRole={agoraRole}
          sessionRunningStatus={sessionRunningStatus}
          sessionName={name}
          sessionRole={sessionRole}
          sessionId={sessionId}
          eventId={eventId}
          communityId={communityId}
          // leaveStreaming={leaveStreaming}
        />
      </div>
      <div className="session-screen-body-container px-4 py-4">
        <div className="session-body-dark-container">
          <div className="d-flex flex-column justify-content-between px-3 py-4">
            <div
              className="session-video-layout-grid"
              id="session-stage-video-layout-grid"
              style={{
                display: "grid",
                gridTemplateColumns: col,
                gridTemplateRows: row,
                gridGap: "10px",
              }}
            >
              {/* Here Session video will go */}
            </div>
            <div className="session-video-controls-grid ">
              <div
                className="stage-left-controls d-flex flex-row justify-content-between align-items-center"
                style={{ justifySelf: "start" }}
              >
                {showRecordingButton ? (
                  <div className="d-flex flex-row align-items-center p-2 justify-content-center ps-3 pe-3 rec-toggle-btn-wrapper">
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
                ) : (
                  <div> </div>
                )}

                {showLiveIndicator ? (
                  <div className="ms-4 d-flex flex-row align-items-center">
                    <LiveRipple />
                    <div className="ms-2 live-text">Live</div>
                  </div>
                ) : (
                  <div></div>
                )}

                {showPeopleCountIndicator ? (
                  <div className="ms-4 d-flex flex-row align-items-center">
                    <PeopleOutlineIcon style={{ fill: "#A1A1A1" }} />
                    <div className="num-of-people-watching ms-2">2,238</div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>

              {/* This is Mid Stage Controls */}
              <div
                className="stage-mid-controls"
                style={{ justifySelf: "center", alignItems: "center" }}
              >
                {showEmoji ? (
                  <IconButton>
                    <img
                      src={Like}
                      alt="like-reaction"
                      style={{ maxWidth: "24px" }}
                      className="m-2"
                    />
                  </IconButton>
                ) : (
                  <>
                    {/* <IconButton aria-label="video" className={classes.margin}>
                    <VideocamRoundedIcon
                      style={{ fill: "#D3D3D3", size: "24" }}
                    />
                  </IconButton> */}
                    <IconButton
                      onClick={() => {
                        videoIsEnabled ? turnOffVideo() : turnOnVideo();
                      }}
                      aria-label="video"
                      className={classes.margin}
                    >
                      {videoIsEnabled ? (
                        <VideocamRoundedIcon
                          style={{ fill: "#D3D3D3", size: "24" }}
                        />
                      ) : (
                        <VideocamOffIcon
                          style={{ fill: "#C72E2E", size: "24" }}
                        />
                      )}
                    </IconButton>
                  </>
                )}

                {showEmoji ? (
                  <IconButton>
                    <img
                      src={Smile}
                      alt="smile-reaction"
                      style={{ maxWidth: "24px" }}
                      className="m-2"
                    />
                  </IconButton>
                ) : (
                  <>
                    {/* <IconButton aria-label="audio" className={classes.margin}>
                    <MicRoundedIcon style={{ fill: "#D3D3D3", size: "24" }} />
                  </IconButton> */}

                    <IconButton
                      onClick={() => {
                        audioIsEnabled ? turnOffAudio() : turnOnAudio();
                      }}
                      aria-label="audio"
                      className={classes.margin}
                    >
                      {audioIsEnabled ? (
                        <MicRoundedIcon
                          style={{ fill: "#D3D3D3", size: "24" }}
                        />
                      ) : (
                        <MicOffIcon style={{ fill: "#C72E2E", size: "24" }} />
                      )}
                    </IconButton>
                  </>
                )}

                {showEmoji ? (
                  <IconButton>
                    <img
                      src={Clapping}
                      alt="clapping-reaction"
                      style={{ maxWidth: "24px" }}
                      className="m-2"
                    />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => {
                      // shareScreen();
                      setScreenSharingIsEnabled(true);
                    }}
                    aria-label="share screen"
                    className={classes.margin}
                  >
                    <ScreenShareRoundedIcon
                      style={{ fill: "#D3D3D3", size: "24" }}
                    />
                  </IconButton>
                )}

                {showEmoji ? (
                  <IconButton>
                    <img
                      src={Love}
                      alt="love-reaction"
                      style={{ maxWidth: "24px" }}
                      className="m-2"
                    />
                  </IconButton>
                ) : (
                  <IconButton aria-label="settings" className={classes.margin}>
                    <SettingsOutlinedIcon
                      style={{ fill: "#D3D3D3", size: "24" }}
                    />
                  </IconButton>
                )}
              </div>

              {sessionRunningStatus !== "Ended" &&
              showStartPauseAndEndSessionButton ? (
                <div
                  className="stage-right-controls"
                  style={{ justifySelf: "end" }}
                >
                  {sessionRunningStatus === "Not Yet Started" ? (
                    // <div
                    //   className="btn-filled-h-stage start-session-btn  px-3 py-2 ms-4"
                    //   onClick={() => {
                    //     socket.emit(
                    //       "setSessionRunningStatus",
                    //       {
                    //         sessionId,
                    //         eventId,
                    //         sessionRunningStatus: "Started",
                    //       },
                    //       // enum: ["Not Yet Started", "Started", "Paused", "Ended"],
                    //       (error) => {
                    //         if (error) {
                    //           alert(error);
                    //         }
                    //       }
                    //     );
                    //   }}
                    // >
                    //   Start Session
                    // </div>

                    <button
                      className="btn btn-danger btn-outline-text"
                      id="leave"
                    >
                      Leave
                    </button>
                  ) : (
                    <div className="d-flex flex-row align-items-center">
                      {sessionRunningStatus === "Paused" ? (
                        <div
                          className="btn-filled-h-stage start-session-btn  px-3 py-2 ms-4"
                          onClick={() => {
                            socket.emit(
                              "setSessionRunningStatus",
                              {
                                sessionId,
                                eventId,
                                sessionRunningStatus: "Resumed",
                              },
                              // enum: ["Not Yet Started", "Started", "Paused", "Ended", "Resumed"],
                              (error) => {
                                if (error) {
                                  alert(error);
                                }
                              }
                            );
                          }}
                        >
                          Resume Session
                        </div>
                      ) : (
                        <div
                          className="btn-filled-h-stage take-break-session-btn  px-3 py-2 ms-4"
                          onClick={() => {
                            socket.emit(
                              "setSessionRunningStatus",
                              {
                                sessionId,
                                eventId,
                                sessionRunningStatus: "Paused",
                              },
                              // enum: ["Not Yet Started", "Started", "Paused", "Ended"],
                              (error) => {
                                if (error) {
                                  alert(error);
                                }
                              }
                            );
                          }}
                        >
                          Take break
                        </div>
                      )}

                      <div
                        className="btn-filled-h-stage end-session-btn  px-3 py-2 ms-4"
                        onClick={() => {
                          socket.emit(
                            "setSessionRunningStatus",
                            {
                              sessionId,
                              eventId,
                              sessionRunningStatus: "Ended",
                            },
                            // enum: ["Not Yet Started", "Started", "Paused", "Ended"],
                            (error) => {
                              if (error) {
                                alert(error);
                              }
                            }
                          );
                        }}
                      >
                        End Session
                      </div>
                    </div>
                  )}
                </div>
              ) : showSessionEnded ? (
                <div
                  className="stage-right-controls"
                  style={{ justifySelf: "end" }}
                >
                  {" "}
                  <div className="btn-filled-h-stage end-session-btn-ended  px-3 py-2 ms-4">
                    Session Ended
                  </div>{" "}
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>

          <div className="event-happenings-control-section">
            {/* <RightContent /> */}

            <SessionStageSideBarRoot />
          </div>
        </div>
      </div>
    </>
  );
};

export default SessionScreen;
