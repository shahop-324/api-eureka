/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import SessionScreenTopNav from "../HelperComponents/SessionScreenTopNav";
import MicNoneIcon from "@material-ui/icons/MicNone";

import { withStyles } from "@material-ui/core/styles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import LiveRipple from "../HelperComponents/LiveRipple";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import socket from "../service/socket";

import "./../Styles/wave.scss";

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
import SessionStatusMsg from "../ComplimentaryParts/SessionStatusMsg";

import NotYetStarted from "./../../../assets/images/NotYetStarted.png";
import InCallDeviceTest from "../HelperComponents/InCallDeviceTest";

let rtc = {
  localAudioTrack: null,
  localVideoTrack: null,
  client: null,
  screenClient: null,
};

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

  const [openSettings, setOpenSettings] = useState(false);

  const handleOpenSettings = () => {
    setOpenSettings(true);
  }

  const handleCloseSettings = () => {
    setOpenSettings(false);
  }

  const { token } = useSelector((state) => state.RTC);

  const { peopleInThisSession } = useSelector((state) => state.user);

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
    appId: "702d57c3092c4fd389eb7ea5a505d471",
    // Set the channel name.
    channel: sessionId,
    // Set the user role in the channel.
    role: agoraRole,
    // Use a temp token
    token: token,
    // Uid
    uid: userId,
  };

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

    window.addEventListener("beforeunload", leaveStreaming);

    return () => {
      leaveStreaming();
    };
  }, [dispatch, sessionId]);

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const [videoIsEnabled, setVideoIsEnabled] = useState(true);
  const [audioIsEnabled, setAudioIsEnabled] = useState(true);
  const [localVolumeLevel, setLocalVolumeLevel] = useState("");
  const [screenSharingIsEnabled, setScreenSharingIsEnabled] = useState(false);

  const [uplinkStat, setUplinkStat] = useState("");
  const [downlinkStat, setDownLinkStat] = useState("");

  const turnOffVideo = async () => {
    if (!rtc.localVideoTrack) return;
    await rtc.localVideoTrack.setEnabled(false);
    document.getElementById(`avatar-box`).style.display = "inline-block";
    setVideoIsEnabled(false);
  };
  const turnOnVideo = async () => {
    if (!rtc.localVideoTrack) return;
    await rtc.localVideoTrack.setEnabled(true);
    document.getElementById(`avatar-box`).style.display = "none";
    setVideoIsEnabled(true);
  };

  const turnOffAudio = async () => {
    if (!rtc.localAudioTrack) return;
    await rtc.localAudioTrack.setEnabled(false);
    setAudioIsEnabled(false);
  };
  const turnOnAudio = async () => {
    if (!rtc.localAudioTrack) return;
    await rtc.localAudioTrack.setEnabled(true);
    setAudioIsEnabled(true);
  };

  useEffect(() => {
    startBasicLiveStreaming();
  }, []);

  // console.log("This is our RTC token to join RTC channel.", token);

  async function startScreenCall() {
    rtc.screenClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    await rtc.screenClient.join(options.appId,  sessionId, token);

    // options.appId, options.channel, options.token, options.uid

    const screenTrack = await AgoraRTC.createScreenVideoTrack();

    await rtc.screenClient.publish(screenTrack);

    return rtc.screenClient;
  }

  async function startBasicLiveStreaming() {
    // Created client object using Agora SDK
    rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });

    rtc.client.setClientRole(options.role);

    rtc.client.on("network-quality", (stats) => {
      console.log("downlinkNetworkQuality", stats.downlinkNetworkQuality);
      setDownLinkStat(stats.downlinkNetworkQuality);
      console.log("uplinkNetworkQuality", stats.uplinkNetworkQuality);
      setUplinkStat(stats.uplinkNetworkQuality);
  });

    rtc.client.on("user-published", async (user, mediaType) => {
      if (document.getElementById(user.uid.toString())) {
        console.log("Already in session!");

        // Subscribe to a remote user.
        await rtc.client.subscribe(user, mediaType);
        console.log("subscribe success");

        // If the subscribed track is video.
        if (mediaType === "video") {
          // Get `RemoteVideoTrack` in the `user` object.
          const remoteVideoTrack = user.videoTrack;
          // Dynamically create a container in the form of a DIV element for playing the remote video track.
          const remotePlayerContainer = document.getElementById(
            user.uid.toString()
          );

          const userId = user.uid.toString();

          document.getElementById(`avatar-box_${userId}`).style.display =
            "none";

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

        return;
      }

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
        console.log(user.uid.toString());

        const { userName, userImage, userOrganisation, userDesignation } =
          peopleInThisSession.find(
            (people) => people.userId === user.uid.toString()
          );

        const userIdentity = document.createElement("div");
        userIdentity.id = `user_identity_${user.uid.toString()}`;
        userIdentity.style.position = "absolute";
        userIdentity.style.left = "15px";
        userIdentity.style.bottom = "15px";
        userIdentity.style.color = "white";
        userIdentity.style.padding = "12px";
        userIdentity.style.boxSizing = "border-box";
        userIdentity.style.zIndex = "10000000000000";
        userIdentity.style.fontSize = "12px";
        userIdentity.style.fontWeight = "500";
        userIdentity.style.fontFamily = "Ubuntu";
        userIdentity.style.backgroundColor = "#807F7F62";
        userIdentity.style.borderRadius = "5px";
        userIdentity.style.textTransform = "capitalize";

        userIdentity.textContent = userName;

        const userCompanyAndDesignation = document.createElement("div");
        // userCompanyAndDesignation.appendChild(MicNoneIcon);

        // ReactDOM.render(document.getElementById('user_identity'), <MicNoneIcon />);

        userCompanyAndDesignation.textContent =
          userOrganisation + `, ${userDesignation}`;

        userIdentity.appendChild(userCompanyAndDesignation);

        const userVideoAvatarContainer = document.createElement("img");
        userVideoAvatarContainer.id = `avatar-box_${user.uid.toString()}`;
        userVideoAvatarContainer.src = userImage;

        userVideoAvatarContainer.style.position = "absolute";
        userVideoAvatarContainer.style.left = "50%";
        userVideoAvatarContainer.style.bottom = "37.5%";
        userVideoAvatarContainer.style.transform = "translate(-50%, -50%)";
        userVideoAvatarContainer.style.maxHeight = "100px";
        userVideoAvatarContainer.style.maxWidth = "100px";
        // userVideoAvatarContainer.style.borderRadius = "50%";
        userVideoAvatarContainer.style.boxSizing = "border-box";
        userVideoAvatarContainer.style.zIndex = "10";

        remotePlayerContainer.append(userVideoAvatarContainer);

        remotePlayerContainer.append(userIdentity);

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

        document.getElementById(
          `avatar-box_${user.uid.toString()}`
        ).style.display = "none";

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

      console.log(rtc.client.getRemoteVideoStats());
    });

    rtc.client.on("user-unpublished", (user) => {
      // console.log(user);

      const userId = user.uid.toString();

      const isAudioEnabled = user._audio_enabled_;
      const isAudioMuted = user._audio_muted_;

      const isVideoEnabled = user._video_enabled_;
      const isVideoMuted = user._video_muted_;

      if (isVideoEnabled && isVideoMuted) {
        document.getElementById(`avatar-box_${userId}`).style.display =
          "inline-block";
      }

      // Get the dynamically created DIV container.
      const remotePlayerContainer = document.getElementById(user.uid);
      // Destroy the container.
      // remotePlayerContainer && remotePlayerContainer.remove();

      setGrid(
        document.getElementById("session-stage-video-layout-grid")
          .childElementCount
      );
    });

    rtc.client.on("user-left", (user) => {
      // console.log(user);

      // Get the dynamically created DIV container.
      const remotePlayerContainer = document.getElementById(user.uid);
      // Destroy the container.
      remotePlayerContainer && remotePlayerContainer.remove();

      setGrid(
        document.getElementById("session-stage-video-layout-grid")
          .childElementCount
      );
    });

    rtc.client.on("volume-indicator", function (result) {
      result.forEach(function (volume, index) {
        console.log(`${index} UID ${volume.uid} Level ${volume.level}`);
      });
    });

    

    await rtc.client
      .join(options.appId, options.channel, options.token, options.uid)
      .then(async () => {
        console.log("Joined RTC channel");

        if (agoraRole !== "audience") {
          rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({encoderConfig: "high_quality_stereo",});
          rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();

          console.log(rtc.localAudioTrack);
          console.log(rtc.localVideoTrack);

          await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

          const localPlayerContainer = document.createElement("div");
          localPlayerContainer.id = userId;

          console.log(userId);

          console.log(peopleInThisSession);

          console.log(
            peopleInThisSession.find((people) => people.userId === userId)
          );

          const { userName, userImage, userOrganisation, userDesignation } =
            peopleInThisSession.find((people) => people.userId === userId);

          const userIdentity = document.createElement("div");
          userIdentity.id = "user_identity";
          userIdentity.style.position = "absolute";
          userIdentity.style.left = "15px";
          userIdentity.style.bottom = "15px";
          userIdentity.style.color = "white";
          userIdentity.style.padding = "12px";
          userIdentity.style.boxSizing = "border-box";
          userIdentity.style.zIndex = "10000000000000";
          userIdentity.style.fontSize = "12px";
          userIdentity.style.fontWeight = "500";
          userIdentity.style.fontFamily = "Ubuntu";
          userIdentity.style.backgroundColor = "#807F7F62";
          userIdentity.style.borderRadius = "5px";
          userIdentity.style.textTransform = "capitalize";

          userIdentity.textContent = userName + ` (You)`;

          const userCompanyAndDesignation = document.createElement("div");
          // userCompanyAndDesignation.appendChild(MicNoneIcon);

          // ReactDOM.render(document.getElementById('user_identity'), <MicNoneIcon />);

          userCompanyAndDesignation.textContent =
            userOrganisation + `, ${userDesignation}`;

          userIdentity.appendChild(userCompanyAndDesignation);

          const userVideoAvatarContainer = document.createElement("img");
          userVideoAvatarContainer.id = `avatar-box`;
          userVideoAvatarContainer.src = userImage;

          userVideoAvatarContainer.style.position = "absolute";
          userVideoAvatarContainer.style.left = "50%";
          userVideoAvatarContainer.style.bottom = "37.5%";
          userVideoAvatarContainer.style.transform = "translate(-50%, -50%)";
          userVideoAvatarContainer.style.maxHeight = "100px";
          userVideoAvatarContainer.style.maxWidth = "100px";
          // userVideoAvatarContainer.style.borderRadius = "50%";
          userVideoAvatarContainer.style.boxSizing = "border-box";
          userVideoAvatarContainer.style.zIndex = "10";

          localPlayerContainer.append(userVideoAvatarContainer);

          localPlayerContainer.append(userIdentity);
          localPlayerContainer.style.position = "relative";
          localPlayerContainer.style.borderRadius = "10px";
          localPlayerContainer.style.background = "rgba( 255, 255, 255, 0.25 )";
          localPlayerContainer.style.backdropFilter = "blur( 4px )";
          localPlayerContainer.style.zIndex = "101";

          document
            .getElementById("session-stage-video-layout-grid")
            .append(localPlayerContainer);

          setGrid(
            document.getElementById("session-stage-video-layout-grid")
              .childElementCount
          );

          rtc.localVideoTrack.play(localPlayerContainer);

          document.getElementById(`avatar-box`).style.display = "none";

          // document.getElementsByClassName("agora_video_player").style.zIndex = "100";

          // rtc.localAudioTrack.play();

          console.log("publish success!");
          console.log("op");
          console.log(12345678);
        }
      });

    setInterval(() => {
      if (!rtc.localAudioTrack) return;
      const level = rtc.localAudioTrack.getVolumeLevel();
      // setAudioLevel(level * 100);
      setLocalVolumeLevel(level * 100);
      // console.log("local stream audio level", level);
    }, 1000);

    document.getElementById("leave-session").onclick = async function () {
      if (agoraRole === "host") {
        rtc.localAudioTrack.close();
        rtc.localVideoTrack.close();
      }

      // Traverse all remote users.
      rtc.client.remoteUsers.forEach((user) => {
        // Destroy the dynamically created DIV containers.
        const playerContainer = document.getElementById(user.uid);
        playerContainer && playerContainer.remove();
      });

      // Leave the channel.
      await rtc.client.leave();
      history.push(
        `/community/${communityId}/event/${eventId}/hosting-platform/lobby`
      );
    };
  }

  const leaveStreaming = async () => {
    if (agoraRole === "host") {
      rtc.localAudioTrack.close();
      rtc.localVideoTrack.close();
    }

    // Traverse all remote users.
    rtc.client.remoteUsers.forEach((user) => {
      // Destroy the dynamically created DIV containers.
      const playerContainer = document.getElementById(user.uid);
      playerContainer && playerContainer.remove();
    });

    // Leave the channel.
    await rtc.client.leave();
    history.push(
      `/community/${communityId}/event/${eventId}/hosting-platform/lobby`
    );
  };

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
            {/* // enum: ["Not Yet Started", "Started", "Paused", "Ended"], */}
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
                    <IconButton
                      onClick={() => {
                        videoIsEnabled ? turnOffVideo() : turnOnVideo();
                      }}
                      aria-label="audio"
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
                      startScreenCall();
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
                  <IconButton onClick={handleOpenSettings} aria-label="settings" className={classes.margin}>
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
                    <div className="d-flex flex-row align-items-center">
                      <div
                        className="btn-filled-h-stage start-session-btn  px-3 py-2 ms-4"
                        onClick={() => {
                          socket.emit(
                            "setSessionRunningStatus",
                            {
                              sessionId,
                              eventId,
                              sessionRunningStatus: "Started",
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
                        Start Session
                      </div>

                      {/* <button
                        className="btn btn-danger btn-outline-text ms-4"
                        id="leave"
                      >
                        Leave
                      </button> */}
                    </div>
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
      <InCallDeviceTest open={openSettings} handleCloseSettings={handleCloseSettings} uplinkStat={uplinkStat} downlinkStat={downlinkStat}/>
      {/* InCallDeviceTest */}
    </>
  );
};

export default SessionScreen;
